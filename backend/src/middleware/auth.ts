import { NextFunction, Request, Response } from "express";

import { verifyAccessToken } from "../utils/tokens";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
    organizationType?: string | null;
  };
}

export function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ statusCode: 401, message: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = verifyAccessToken(token);
    req.user = payload;
    next();
  } catch {
    return res
      .status(401)
      .json({ statusCode: 401, message: "Invalid or expired token" });
  }
}

