import { query, queryOne } from "../db";

export class ChatServiceError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

const SUCCESS_MESSAGES = {
  GROUPS: {
    en: "Fetched chat groups successfully",
    th: "ดึงกลุ่มแชทสำเร็จ",
  },
  MESSAGES: {
    en: "Fetched chat messages successfully",
    th: "ดึงข้อความสำเร็จ",
  },
  CREATE_MESSAGE: {
    en: "Message sent successfully",
    th: "ส่งข้อความสำเร็จ",
  },
};

interface ChatGroupRow {
  id: string;
  created_at: string;
  last_message_at: string | null;
  other_user_id: string;
  other_first_name: string | null;
  other_last_name: string | null;
  last_message: string | null;
  last_message_type: string | null;
  last_message_created_at: string | null;
}

export interface ChatGroupDto {
  groupId: string;
  groupName: string;
  lastMessage: string;
  createdAt: string;
}

interface ChatMessageRow {
  id: string;
  room_id: string;
  sender_id: string;
  message_type: string;
  content: string | null;
  file_url: string | null;
  created_at: string;
  sender_first_name: string | null;
  sender_last_name: string | null;
  sender_image_url: string | null;
}

export interface ChatMessageDto {
  id: string;
  type: string;
  to: any[];
  body: {
    msg: string;
    customEvent?: string;
    customExts?: {
      payloadUrl?: string | null;
    };
  };
  from: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    imageUrl: string | null;
  };
  createdAt: string;
}

export interface ChatMessageListResult {
  data: ChatMessageDto[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export async function listChatGroups(userId: string) {
  const rows = await query<ChatGroupRow>(
    `
      SELECT
        cr.id,
        cr.created_at,
        cr.last_message_at,
        CASE
          WHEN cr.participant1_id = $1 THEN cr.participant2_id
          ELSE cr.participant1_id
        END AS other_user_id,
        u.first_name AS other_first_name,
        u.last_name AS other_last_name,
        lm.content AS last_message,
        lm.message_type AS last_message_type,
        lm.created_at AS last_message_created_at
      FROM chat_rooms cr
      JOIN users u ON u.id = CASE
        WHEN cr.participant1_id = $1 THEN cr.participant2_id
        ELSE cr.participant1_id
      END
      LEFT JOIN LATERAL (
        SELECT content, message_type, created_at
        FROM chat_messages
        WHERE room_id = cr.id
        ORDER BY created_at DESC
        LIMIT 1
      ) lm ON true
      WHERE cr.participant1_id = $1 OR cr.participant2_id = $1
      ORDER BY COALESCE(lm.created_at, cr.last_message_at, cr.created_at) DESC
    `,
    [userId]
  );

  const data: ChatGroupDto[] = rows.map((row) => ({
    groupId: row.id,
    groupName: buildGroupName(row),
    lastMessage: buildLastMessagePreview(row),
    createdAt: row.last_message_created_at ?? row.created_at,
  }));

  return {
    message: SUCCESS_MESSAGES.GROUPS,
    data,
  };
}

export async function listChatMessages(
  roomId: string,
  userId: string,
  page: number,
  limit: number,
  sortDirection: "ASC" | "DESC"
): Promise<ChatMessageListResult> {
  await ensureRoomAccess(roomId, userId);

  const safeLimit = Math.min(Math.max(limit, 1), 200);
  const safePage = Math.max(page, 1);
  const offset = (safePage - 1) * safeLimit;

  const rows = await query<ChatMessageRow>(
    `
      SELECT
        cm.id,
        cm.room_id,
        cm.sender_id,
        cm.message_type,
        cm.content,
        cm.file_url,
        cm.created_at,
        u.first_name AS sender_first_name,
        u.last_name AS sender_last_name,
        u.image_url AS sender_image_url
      FROM chat_messages cm
      JOIN users u ON u.id = cm.sender_id
      WHERE cm.room_id = $1
      ORDER BY cm.created_at ${sortDirection}
      LIMIT $2 OFFSET $3
    `,
    [roomId, safeLimit, offset]
  );

  const totalRow = await queryOne<{ count: number }>(
    "SELECT COUNT(*)::int AS count FROM chat_messages WHERE room_id = $1",
    [roomId]
  );
  const total = totalRow?.count ?? 0;
  const totalPages = safeLimit === 0 ? 0 : Math.ceil(total / safeLimit);

  const data = rows.map(mapMessageRow);

  return {
    data,
    meta: {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages,
    },
  };
}

interface CreateMessagePayload {
  roomId: string;
  senderId: string;
  type: string;
  text?: string | null;
  fileUrl?: string | null;
}

export async function createChatMessage({
  roomId,
  senderId,
  type,
  text,
  fileUrl,
}: CreateMessagePayload) {
  await ensureRoomAccess(roomId, senderId);

  const normalizedType = normalizeMessageType(type);
  const messageText = (text ?? "").trim();

  if (!messageText && !fileUrl) {
    throw new ChatServiceError(400, "Message content is required");
  }

  const inserted = await queryOne<{ id: string }>(
    `
      INSERT INTO chat_messages (
        room_id,
        sender_id,
        message_type,
        content,
        file_url
      ) VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `,
    [roomId, senderId, normalizedType, messageText || null, fileUrl ?? null]
  );

  await query("UPDATE chat_rooms SET last_message_at = NOW() WHERE id = $1", [
    roomId,
  ]);

  return inserted?.id ?? null;
}

function buildGroupName(row: ChatGroupRow) {
  const first = row.other_first_name ?? "";
  const last = row.other_last_name ?? "";
  const full = `${first} ${last}`.trim();
  return full || "Chat";
}

function buildLastMessagePreview(row: ChatGroupRow) {
  if (!row.last_message_type) {
    return "";
  }
  if (row.last_message_type === "txt") {
    return row.last_message ?? "";
  }
  if (row.last_message_type === "img") {
    return "[Image]";
  }
  if (row.last_message_type === "file") {
    return "[File]";
  }
  return row.last_message ?? "";
}

async function ensureRoomAccess(roomId: string, userId: string) {
  const existing = await queryOne<{ id: string }>(
    `
      SELECT id
      FROM chat_rooms
      WHERE id = $1 AND (participant1_id = $2 OR participant2_id = $2)
    `,
    [roomId, userId]
  );

  if (!existing) {
    throw new ChatServiceError(
      403,
      "You are not allowed to access this chat room"
    );
  }
}

function normalizeMessageType(type?: string) {
  const allowed = new Set([
    "txt",
    "img",
    "file",
    "audio",
    "loc",
    "cmd",
    "custome",
  ]);
  if (!type) {
    return "txt";
  }
  const normalized = type.toLowerCase();
  return allowed.has(normalized) ? normalized : "txt";
}

function mapMessageRow(row: ChatMessageRow): ChatMessageDto {
  const body: ChatMessageDto["body"] = {
    msg: row.content ?? "",
  };

  if (row.file_url) {
    body.customEvent = "payload";
    body.customExts = { payloadUrl: row.file_url };
  }

  return {
    id: row.id,
    type: row.message_type || "txt",
    to: [],
    body,
    from: {
      id: row.sender_id,
      firstName: row.sender_first_name,
      lastName: row.sender_last_name,
      imageUrl: row.sender_image_url,
    },
    createdAt: row.created_at,
  };
}

export const chatMessages = SUCCESS_MESSAGES;
