import { Router, Response } from 'express';
import { db, conversations, conversationParticipants, messages, users } from '../db';
import { eq, desc, and, sql } from 'drizzle-orm';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { z } from 'zod';

const router = Router();

router.use(authMiddleware);

const createConversationSchema = z.object({
  type: z.enum(['private', 'group']),
  name: z.string().optional(),
  participantIds: z.array(z.string().uuid()),
});

const sendMessageSchema = z.object({
  content: z.string().min(1),
  messageType: z.enum(['text', 'image', 'file']).optional(),
  attachmentUrl: z.string().optional(),
});

router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const userParticipations = await db
      .select()
      .from(conversationParticipants)
      .where(eq(conversationParticipants.userId, userId));

    const conversationIds = userParticipations.map(p => p.conversationId);

    if (conversationIds.length === 0) {
      return res.json([]);
    }

    const userConversations = await Promise.all(
      conversationIds.map(async (convId) => {
        const [conversation] = await db
          .select()
          .from(conversations)
          .where(eq(conversations.id, convId))
          .limit(1);

        if (!conversation) return null;

        const participants = await db
          .select({
            id: users.id,
            displayName: users.displayName,
            avatar: users.avatar,
          })
          .from(conversationParticipants)
          .innerJoin(users, eq(conversationParticipants.userId, users.id))
          .where(eq(conversationParticipants.conversationId, convId));

        const [lastMessage] = await db
          .select()
          .from(messages)
          .where(eq(messages.conversationId, convId))
          .orderBy(desc(messages.createdAt))
          .limit(1);

        const [{ unreadCount }] = await db
          .select({ unreadCount: sql<number>`COUNT(*)` })
          .from(messages)
          .where(and(
            eq(messages.conversationId, convId),
            eq(messages.isRead, false)
          ));

        return {
          ...conversation,
          participants,
          lastMessage,
          unreadCount: Number(unreadCount),
        };
      })
    );

    res.json(userConversations.filter(Boolean));
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const [conversation] = await db
      .select()
      .from(conversations)
      .where(eq(conversations.id, id))
      .limit(1);

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    const participants = await db
      .select({
        id: users.id,
        displayName: users.displayName,
        avatar: users.avatar,
        isAdmin: conversationParticipants.isAdmin,
      })
      .from(conversationParticipants)
      .innerJoin(users, eq(conversationParticipants.userId, users.id))
      .where(eq(conversationParticipants.conversationId, id));

    res.json({ ...conversation, participants });
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id/messages', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { limit = 50, before } = req.query;

    let query = db
      .select({
        id: messages.id,
        content: messages.content,
        messageType: messages.messageType,
        attachmentUrl: messages.attachmentUrl,
        isRead: messages.isRead,
        createdAt: messages.createdAt,
        senderId: messages.senderId,
        senderName: users.displayName,
        senderAvatar: users.avatar,
      })
      .from(messages)
      .innerJoin(users, eq(messages.senderId, users.id))
      .where(eq(messages.conversationId, id))
      .orderBy(desc(messages.createdAt))
      .limit(Number(limit));

    const conversationMessages = await query;

    await db
      .update(messages)
      .set({ isRead: true })
      .where(and(
        eq(messages.conversationId, id),
        eq(messages.isRead, false)
      ));

    res.json(conversationMessages.reverse());
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const data = createConversationSchema.parse(req.body);
    const userId = req.user!.id;

    const [newConversation] = await db
      .insert(conversations)
      .values({
        type: data.type,
        name: data.name,
        createdById: userId,
      })
      .returning();

    const allParticipantIds = [...new Set([userId, ...data.participantIds])];

    await Promise.all(
      allParticipantIds.map((participantId, index) =>
        db.insert(conversationParticipants).values({
          conversationId: newConversation.id,
          userId: participantId,
          isAdmin: participantId === userId,
        })
      )
    );

    res.status(201).json(newConversation);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    console.error('Create conversation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/:id/messages', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const data = sendMessageSchema.parse(req.body);
    const userId = req.user!.id;

    const [newMessage] = await db
      .insert(messages)
      .values({
        conversationId: id,
        senderId: userId,
        content: data.content,
        messageType: data.messageType || 'text',
        attachmentUrl: data.attachmentUrl,
      })
      .returning();

    await db
      .update(conversations)
      .set({ updatedAt: new Date() })
      .where(eq(conversations.id, id));

    const [sender] = await db
      .select({ displayName: users.displayName, avatar: users.avatar })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    res.status(201).json({
      ...newMessage,
      senderName: sender?.displayName,
      senderAvatar: sender?.avatar,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/:id/participants', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { userId: newUserId } = req.body;

    await db.insert(conversationParticipants).values({
      conversationId: id,
      userId: newUserId,
    });

    res.status(201).json({ message: 'Participant added' });
  } catch (error) {
    console.error('Add participant error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    await db.delete(messages).where(eq(messages.conversationId, id));
    await db.delete(conversationParticipants).where(eq(conversationParticipants.conversationId, id));
    await db.delete(conversations).where(eq(conversations.id, id));

    res.json({ message: 'Conversation deleted' });
  } catch (error) {
    console.error('Delete conversation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
