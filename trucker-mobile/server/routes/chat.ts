import { Router } from "express";
import { db } from "../db";
import { chatRooms, chatMessages, users } from "../db/schema";
import { eq, and, or, desc, sql } from "drizzle-orm";

const router = Router();

// Get all conversations for current user
router.get("/", async (req, res) => {
  try {
    const userId = (req as any).user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    // Find all chat rooms where user is a participant
    const rooms = await db
      .select()
      .from(chatRooms)
      .where(
        or(
          eq(chatRooms.participant1Id, userId),
          eq(chatRooms.participant2Id, userId)
        )
      )
      .orderBy(desc(chatRooms.lastMessageAt));

    // Enrich with participant info and last message
    const enrichedRooms = await Promise.all(
      rooms.map(async (room) => {
        // Get the other participant
        const otherParticipantId =
          room.participant1Id === userId ? room.participant2Id : room.participant1Id;

        let otherUser = null;
        if (otherParticipantId) {
          const [user] = await db
            .select({
              id: users.id,
              displayName: sql<string>`COALESCE(${users.firstName} || ' ' || ${users.lastName}, ${users.username})`,
              avatar: users.imageUrl,
            })
            .from(users)
            .where(eq(users.id, otherParticipantId))
            .limit(1);
          otherUser = user;
        }

        // Get last message
        const [lastMessage] = await db
          .select({
            content: chatMessages.content,
            createdAt: chatMessages.createdAt,
            senderId: chatMessages.senderId,
          })
          .from(chatMessages)
          .where(eq(chatMessages.roomId, room.id))
          .orderBy(desc(chatMessages.createdAt))
          .limit(1);

        // Count unread messages
        const [unreadCount] = await db
          .select({ count: sql<number>`COUNT(*)` })
          .from(chatMessages)
          .where(
            and(
              eq(chatMessages.roomId, room.id),
              eq(chatMessages.isRead, false),
              sql`${chatMessages.senderId} != ${userId}`
            )
          );

        return {
          id: room.id,
          type: "private" as const,
          name: otherUser?.displayName || "Unknown User",
          avatar: otherUser?.avatar,
          lastMessage: lastMessage
            ? {
                content: lastMessage.content,
                createdAt: lastMessage.createdAt,
                senderId: lastMessage.senderId,
              }
            : null,
          unreadCount: Number(unreadCount?.count) || 0,
          participants: otherUser
            ? [
                {
                  id: otherUser.id,
                  displayName: otherUser.displayName,
                  avatar: otherUser.avatar,
                },
              ]
            : [],
          updatedAt: room.lastMessageAt || room.createdAt,
        };
      })
    );

    return res.json(enrichedRooms);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return res.status(500).json({ error: "Failed to fetch conversations" });
  }
});

// Get single conversation
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.userId;

    const [room] = await db
      .select()
      .from(chatRooms)
      .where(eq(chatRooms.id, id))
      .limit(1);

    if (!room) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    // Check if user is a participant
    if (room.participant1Id !== userId && room.participant2Id !== userId) {
      return res.status(403).json({ error: "Not authorized to view this conversation" });
    }

    // Get the other participant
    const otherParticipantId =
      room.participant1Id === userId ? room.participant2Id : room.participant1Id;

    let otherUser = null;
    if (otherParticipantId) {
      const [user] = await db
        .select({
          id: users.id,
          displayName: sql<string>`COALESCE(${users.firstName} || ' ' || ${users.lastName}, ${users.username})`,
          avatar: users.imageUrl,
        })
        .from(users)
        .where(eq(users.id, otherParticipantId))
        .limit(1);
      otherUser = user;
    }

    return res.json({
      id: room.id,
      type: "private",
      name: otherUser?.displayName || "Unknown User",
      avatar: otherUser?.avatar,
      participants: otherUser
        ? [
            {
              id: otherUser.id,
              displayName: otherUser.displayName,
              avatar: otherUser.avatar,
            },
          ]
        : [],
      updatedAt: room.lastMessageAt || room.createdAt,
    });
  } catch (error) {
    console.error("Error fetching conversation:", error);
    return res.status(500).json({ error: "Failed to fetch conversation" });
  }
});

// Get messages for a conversation
router.get("/:id/messages", async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 50, before } = req.query;
    const userId = (req as any).user?.userId;

    // Verify user has access to this room
    const [room] = await db
      .select()
      .from(chatRooms)
      .where(eq(chatRooms.id, id))
      .limit(1);

    if (!room) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    if (room.participant1Id !== userId && room.participant2Id !== userId) {
      return res.status(403).json({ error: "Not authorized" });
    }

    // Fetch messages
    const messages = await db
      .select({
        id: chatMessages.id,
        conversationId: chatMessages.roomId,
        senderId: chatMessages.senderId,
        content: chatMessages.content,
        messageType: chatMessages.messageType,
        attachmentUrl: chatMessages.fileUrl,
        isRead: chatMessages.isRead,
        createdAt: chatMessages.createdAt,
      })
      .from(chatMessages)
      .where(eq(chatMessages.roomId, id))
      .orderBy(desc(chatMessages.createdAt))
      .limit(Number(limit));

    // Enrich with sender info
    const enrichedMessages = await Promise.all(
      messages.map(async (msg) => {
        let sender = null;
        if (msg.senderId) {
          const [user] = await db
            .select({
              id: users.id,
              displayName: sql<string>`COALESCE(${users.firstName} || ' ' || ${users.lastName}, ${users.username})`,
              avatar: users.imageUrl,
            })
            .from(users)
            .where(eq(users.id, msg.senderId))
            .limit(1);
          sender = user;
        }

        return {
          ...msg,
          sender,
        };
      })
    );

    // Mark messages as read
    await db
      .update(chatMessages)
      .set({ isRead: true })
      .where(
        and(
          eq(chatMessages.roomId, id),
          sql`${chatMessages.senderId} != ${userId}`,
          eq(chatMessages.isRead, false)
        )
      );

    // Return in chronological order
    return res.json(enrichedMessages.reverse());
  } catch (error) {
    console.error("Error fetching messages:", error);
    return res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// Send a message
router.post("/:id/messages", async (req, res) => {
  try {
    const { id } = req.params;
    const { content, messageType = "txt" } = req.body;
    const userId = (req as any).user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    if (!content) {
      return res.status(400).json({ error: "Message content is required" });
    }

    // Verify user has access
    const [room] = await db
      .select()
      .from(chatRooms)
      .where(eq(chatRooms.id, id))
      .limit(1);

    if (!room) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    if (room.participant1Id !== userId && room.participant2Id !== userId) {
      return res.status(403).json({ error: "Not authorized" });
    }

    // Create message
    const [newMessage] = await db
      .insert(chatMessages)
      .values({
        roomId: id,
        senderId: userId,
        content,
        messageType,
        isRead: false,
      })
      .returning();

    // Update room's last message time
    await db
      .update(chatRooms)
      .set({ lastMessageAt: new Date() })
      .where(eq(chatRooms.id, id));

    // Get sender info
    const [sender] = await db
      .select({
        id: users.id,
        displayName: sql<string>`COALESCE(${users.firstName} || ' ' || ${users.lastName}, ${users.username})`,
        avatar: users.imageUrl,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    return res.status(201).json({
      id: newMessage.id,
      conversationId: newMessage.roomId,
      senderId: newMessage.senderId,
      content: newMessage.content,
      messageType: newMessage.messageType,
      isRead: newMessage.isRead,
      createdAt: newMessage.createdAt,
      sender,
    });
  } catch (error) {
    console.error("Error sending message:", error);
    return res.status(500).json({ error: "Failed to send message" });
  }
});

// Create a new conversation
router.post("/", async (req, res) => {
  try {
    const { participantId } = req.body;
    const userId = (req as any).user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    if (!participantId) {
      return res.status(400).json({ error: "Participant ID is required" });
    }

    // Check if conversation already exists
    const [existingRoom] = await db
      .select()
      .from(chatRooms)
      .where(
        or(
          and(eq(chatRooms.participant1Id, userId), eq(chatRooms.participant2Id, participantId)),
          and(eq(chatRooms.participant1Id, participantId), eq(chatRooms.participant2Id, userId))
        )
      )
      .limit(1);

    if (existingRoom) {
      return res.json({ id: existingRoom.id, exists: true });
    }

    // Create new room
    const [newRoom] = await db
      .insert(chatRooms)
      .values({
        participant1Id: userId,
        participant2Id: participantId,
      })
      .returning();

    return res.status(201).json({ id: newRoom.id, exists: false });
  } catch (error) {
    console.error("Error creating conversation:", error);
    return res.status(500).json({ error: "Failed to create conversation" });
  }
});

export default router;
