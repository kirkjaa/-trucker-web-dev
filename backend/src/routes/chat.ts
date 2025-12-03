import { Response, Router } from "express";

import { AuthenticatedRequest, authMiddleware } from "../middleware/auth";
import {
  chatMessages,
  ChatServiceError,
  createChatMessage,
  listChatGroups,
  listChatMessages,
} from "../services/chat.service";
import { buildFileUrl, upload } from "../utils/upload";

const router = Router();
const uploadSingle = upload.single("payload");

router.get(
  "/chat-group/me",
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      const userRole = req.user?.role;
      if (!userId) {
        return res.status(401).json({
          statusCode: 401,
          message: { en: "Unauthorized", th: "ไม่มีสิทธิ์เข้าใช้งาน" },
        });
      }

      const result = await listChatGroups(userId, userRole);
      return res.json({
        statusCode: 200,
        message: chatMessages.GROUPS,
        data: result.data,
      });
    } catch (error) {
      return handleUnexpectedError(error, res);
    }
  }
);

router.get(
  "/chat-message",
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      const userRole = req.user?.role;
      if (!userId) {
        return res.status(401).json({
          statusCode: 401,
          message: { en: "Unauthorized", th: "ไม่มีสิทธิ์เข้าใช้งาน" },
        });
      }

      const roomId = req.query.chatGroupId as string;
      if (!roomId) {
        return res.status(400).json({
          statusCode: 400,
          message: {
            en: "chatGroupId is required",
            th: "กรุณาระบุกลุ่มแชท",
          },
        });
      }

      const page = req.query.page ? Number(req.query.page) : 1;
      const limit = req.query.limit ? Number(req.query.limit) : 50;
      const sortDirectionParam = (req.query.sortDirection || "ASC")
        .toString()
        .toUpperCase();
      const sortDirection = sortDirectionParam === "DESC" ? "DESC" : "ASC";

      const result = await listChatMessages(
        roomId,
        userId,
        userRole,
        page,
        limit,
        sortDirection
      );

      return res.json({
        statusCode: 200,
        message: chatMessages.MESSAGES,
        data: result.data,
        meta: result.meta,
      });
    } catch (error) {
      if (error instanceof ChatServiceError) {
        return res.status(error.statusCode).json({
          statusCode: error.statusCode,
          message: {
            en: error.message,
            th: error.message,
          },
        });
      }
      return handleUnexpectedError(error, res);
    }
  }
);

router.post(
  "/chat-message",
  authMiddleware,
  uploadSingle,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          statusCode: 401,
          message: { en: "Unauthorized", th: "ไม่มีสิทธิ์เข้าใช้งาน" },
        });
      }

      const roomId = extractFirstValue(req.body.to);
      if (!roomId) {
        return res.status(400).json({
          statusCode: 400,
          message: {
            en: "Chat group id is required",
            th: "กรุณาเลือกกลุ่มแชท",
          },
        });
      }

      const type = req.body.type as string | undefined;
      const text = req.body.text as string | undefined;
      const fileUrl = req.file ? buildFileUrl(req.file.filename) : undefined;

      const messageId = await createChatMessage({
        roomId,
        senderId: userId,
        type: type ?? "txt",
        text,
        fileUrl,
      });

      return res.status(201).json({
        statusCode: 201,
        message: chatMessages.CREATE_MESSAGE,
        data: { id: messageId },
      });
    } catch (error) {
      if (error instanceof ChatServiceError) {
        return res.status(error.statusCode).json({
          statusCode: error.statusCode,
          message: {
            en: error.message,
            th: error.message,
          },
        });
      }
      return handleUnexpectedError(error, res);
    }
  }
);

function extractFirstValue(value: unknown) {
  if (Array.isArray(value)) {
    return value[0];
  }
  if (typeof value === "string") {
    return value;
  }
  return undefined;
}

function handleUnexpectedError(error: unknown, res: Response) {
  console.error("Chat route error:", error);
  return res.status(500).json({
    statusCode: 500,
    message: {
      en: "Failed to process chat request",
      th: "ไม่สามารถดำเนินการคำขอแชทได้",
    },
  });
}

export default router;
