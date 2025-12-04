import { Router, Response } from "express";
import { db, conversations, conversationParticipants, messages, users } from "../db";
import { eq, desc, and, lt, asc } from "drizzle-orm";
import { authMiddleware, AuthRequest } from "../middleware/auth";
import { z } from "zod";

const router = Router();

router.use(authMiddleware);

// Get all conversations for current user
router.get("/", async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    // Get conversations where user is a participant
    const participations = await db
      .select()
      .from(conversationParticipants)
      .where(eq(conversationParticipants.userId, userId));

    const conversationIds = participations.map((p) => p.conversationId);

    if (conversationIds.length === 0) {
      return res.json([]);
    }

    const userConversations = await Promise.all(
      conversationIds.map(async (convId) => {
        const [conv] = await db
          .select()
          .from(conversations)
          .where(eq(conversations.id, convId))
          .limit(1);

        if (!conv) return null;

        // Get last message
        const [lastMessage] = await db
          .select()
          .from(messages)
          .where(eq(messages.conversationId, convId))
          .orderBy(desc(messages.createdAt))
          .limit(1);

        // Get participants
        const participants = await db
          .select()
          .from(conversationParticipants)
          .where(eq(conversationParticipants.conversationId, convId));

        const participantUsers = await Promise.all(
          participants.map(async (p) => {
            const [user] = await db
              .select()
              .from(users)
              .where(eq(users.id, p.userId))
              .limit(1);
            return user
              ? {
                  id: user.id,
                  displayName: user.displayName,
                  avatar: user.avatar,
                }
              : null;
          })
        );

        // Get unread count
        const unreadMessages = await db
          .select()
          .from(messages)
          .where(
            and(
              eq(messages.conversationId, convId),
              eq(messages.isRead, false)
            )
          );
        const unreadCount = unreadMessages.filter(
          (m) => m.senderId !== userId
        ).length;

        // For private chats, get the other user's info
        let displayName = conv.name;
        let avatar = conv.avatar;
        if (conv.type === "private") {
          const otherParticipant = participantUsers.find(
            (p) => p && p.id !== userId
          );
          if (otherParticipant) {
            displayName = otherParticipant.displayName;
            avatar = otherParticipant.avatar;
          }
        }

        return {
          id: conv.id,
          type: conv.type,
          name: displayName,
          avatar: avatar,
          lastMessage: lastMessage
            ? {
                content: lastMessage.content,
                createdAt: lastMessage.createdAt,
                senderId: lastMessage.senderId,
              }
            : null,
          unreadCount,
          participants: participantUsers.filter(Boolean),
          updatedAt: conv.updatedAt,
        };
      })
    );

    const validConversations = userConversations
      .filter(Boolean)
      .sort((a, b) => {
        const aTime = a!.lastMessage?.createdAt || a!.updatedAt;
        const bTime = b!.lastMessage?.createdAt || b!.updatedAt;
        return new Date(bTime!).getTime() - new Date(aTime!).getTime();
      });

    res.json(validConversations);
  } catch (error) {
    console.error("Get conversations error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get conversation by ID with messages
router.get("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const [conv] = await db
      .select()
      .from(conversations)
      .where(eq(conversations.id, id))
      .limit(1);

    if (!conv) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    // Check if user is a participant
    const [participation] = await db
      .select()
      .from(conversationParticipants)
      .where(
        and(
          eq(conversationParticipants.conversationId, id),
          eq(conversationParticipants.userId, userId)
        )
      )
      .limit(1);

    if (!participation) {
      return res.status(403).json({ error: "Not a participant of this conversation" });
    }

    // Get participants
    const participants = await db
      .select()
      .from(conversationParticipants)
      .where(eq(conversationParticipants.conversationId, id));

    const participantUsers = await Promise.all(
      participants.map(async (p) => {
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.id, p.userId))
          .limit(1);
        return user
          ? {
              id: user.id,
              displayName: user.displayName,
              avatar: user.avatar,
              isAdmin: p.isAdmin,
            }
          : null;
      })
    );

    res.json({
      ...conv,
      participants: participantUsers.filter(Boolean),
    });
  } catch (error) {
    console.error("Get conversation error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get messages for a conversation
router.get("/:id/messages", async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { limit = 50, before } = req.query;
    const userId = req.user!.id;

    // Check if user is a participant
    const [participation] = await db
      .select()
      .from(conversationParticipants)
      .where(
        and(
          eq(conversationParticipants.conversationId, id),
          eq(conversationParticipants.userId, userId)
        )
      )
      .limit(1);

    if (!participation) {
      return res.status(403).json({ error: "Not a participant of this conversation" });
    }

    let conversationMessages;
    if (before) {
      conversationMessages = await db
        .select()
        .from(messages)
        .where(
          and(
            eq(messages.conversationId, id),
            lt(messages.createdAt, new Date(before as string))
          )
        )
        .orderBy(desc(messages.createdAt))
        .limit(Number(limit));
    } else {
      conversationMessages = await db
        .select()
        .from(messages)
        .where(eq(messages.conversationId, id))
        .orderBy(desc(messages.createdAt))
        .limit(Number(limit));
    }

    // Get sender info for each message
    const messagesWithSender = await Promise.all(
      conversationMessages.map(async (msg) => {
        const [sender] = await db
          .select()
          .from(users)
          .where(eq(users.id, msg.senderId))
          .limit(1);
        return {
          ...msg,
          sender: sender
            ? {
                id: sender.id,
                displayName: sender.displayName,
                avatar: sender.avatar,
              }
            : null,
        };
      })
    );

    // Mark messages as read
    await db
      .update(messages)
      .set({ isRead: true })
      .where(
        and(
          eq(messages.conversationId, id),
          eq(messages.isRead, false)
        )
      );

    res.json(messagesWithSender.reverse());
  } catch (error) {
    console.error("Get messages error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create conversation
router.post("/", async (req: AuthRequest, res: Response) => {
  try {
    const { type = "private", name, participantIds } = req.body;
    const userId = req.user!.id;

    if (!participantIds || !Array.isArray(participantIds)) {
      return res.status(400).json({ error: "participantIds is required" });
    }

    // For private chat, check if conversation already exists
    if (type === "private" && participantIds.length === 1) {
      const existingParticipations = await db
        .select()
        .from(conversationParticipants)
        .where(eq(conversationParticipants.userId, userId));

      for (const p of existingParticipations) {
        const [otherParticipant] = await db
          .select()
          .from(conversationParticipants)
          .where(
            and(
              eq(conversationParticipants.conversationId, p.conversationId),
              eq(conversationParticipants.userId, participantIds[0])
            )
          )
          .limit(1);

        if (otherParticipant) {
          const [existingConv] = await db
            .select()
            .from(conversations)
            .where(
              and(
                eq(conversations.id, p.conversationId),
                eq(conversations.type, "private")
              )
            )
            .limit(1);

          if (existingConv) {
            return res.json(existingConv);
          }
        }
      }
    }

    // Create new conversation
    const [newConv] = await db
      .insert(conversations)
      .values({
        type: type,
        name: name,
        createdById: userId,
      })
      .returning();

    // Add participants
    const allParticipantIds = [...new Set([userId, ...participantIds])];
    await Promise.all(
      allParticipantIds.map((pId) =>
        db.insert(conversationParticipants).values({
          conversationId: newConv.id,
          userId: pId,
          isAdmin: pId === userId,
        })
      )
    );

    res.status(201).json(newConv);
  } catch (error) {
    console.error("Create conversation error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Send message
router.post("/:id/messages", async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { content, messageType = "text", attachmentUrl } = req.body;
    const userId = req.user!.id;

    // Check if user is a participant
    const [participation] = await db
      .select()
      .from(conversationParticipants)
      .where(
        and(
          eq(conversationParticipants.conversationId, id),
          eq(conversationParticipants.userId, userId)
        )
      )
      .limit(1);

    if (!participation) {
      return res.status(403).json({ error: "Not a participant of this conversation" });
    }

    const [newMessage] = await db
      .insert(messages)
      .values({
        conversationId: id,
        senderId: userId,
        content,
        messageType,
        attachmentUrl,
      })
      .returning();

    // Update conversation's updatedAt
    await db
      .update(conversations)
      .set({ updatedAt: new Date() })
      .where(eq(conversations.id, id));

    // Get sender info
    const [sender] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    res.status(201).json({
      ...newMessage,
      sender: sender
        ? {
            id: sender.id,
            displayName: sender.displayName,
            avatar: sender.avatar,
          }
        : null,
    });
  } catch (error) {
    console.error("Send message error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Add participant to conversation
router.post("/:id/participants", async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { userId: newUserId } = req.body;
    const userId = req.user!.id;

    // Check if requester is admin
    const [participation] = await db
      .select()
      .from(conversationParticipants)
      .where(
        and(
          eq(conversationParticipants.conversationId, id),
          eq(conversationParticipants.userId, userId)
        )
      )
      .limit(1);

    if (!participation || !participation.isAdmin) {
      return res.status(403).json({ error: "Only admins can add participants" });
    }

    // Add new participant
    await db.insert(conversationParticipants).values({
      conversationId: id,
      userId: newUserId,
      isAdmin: false,
    });

    res.status(201).json({ message: "Participant added successfully" });
  } catch (error) {
    console.error("Add participant error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete conversation
router.delete("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    // Check if user is admin
    const [participation] = await db
      .select()
      .from(conversationParticipants)
      .where(
        and(
          eq(conversationParticipants.conversationId, id),
          eq(conversationParticipants.userId, userId)
        )
      )
      .limit(1);

    if (!participation || !participation.isAdmin) {
      return res.status(403).json({ error: "Only admins can delete conversations" });
    }

    // Delete messages, participants, then conversation
    await db.delete(messages).where(eq(messages.conversationId, id));
    await db
      .delete(conversationParticipants)
      .where(eq(conversationParticipants.conversationId, id));
    await db.delete(conversations).where(eq(conversations.id, id));

    res.json({ message: "Conversation deleted successfully" });
  } catch (error) {
    console.error("Delete conversation error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
