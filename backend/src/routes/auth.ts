import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";

import {
  buildUserResponse,
  findUserById,
  findUserByIdentifier,
} from "../services/user.service";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/tokens";

const router = Router();

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  is_remembered: z.boolean().optional(),
});

router.post("/login", async (req, res) => {
  const parseResult = loginSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      statusCode: 400,
      message: "Invalid request body",
      errors: parseResult.error.flatten(),
    });
  }

  const { username, password, is_remembered } = parseResult.data;

  try {
    const user = await findUserByIdentifier(username);
    if (!user || !user.password_hash) {
      return res
        .status(401)
        .json({ statusCode: 401, message: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res
        .status(401)
        .json({ statusCode: 401, message: "Invalid credentials" });
    }

    const payload = {
      id: user.id,
      role: user.role,
      organizationType: user.org_type,
    };

    const accessToken = signAccessToken(payload);
    const refreshToken = is_remembered ? signRefreshToken(payload) : undefined;

    return res.json({
      statusCode: 200,
      message: "Login successful",
      data: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res
      .status(500)
      .json({ statusCode: 500, message: "Failed to process login request" });
  }
});

const refreshSchema = z.object({
  refreshToken: z.string().min(1),
});

router.post("/refresh", (req, res) => {
  const parseResult = refreshSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      statusCode: 400,
      message: "Invalid request body",
      errors: parseResult.error.flatten(),
    });
  }

  try {
    const payload = verifyRefreshToken(parseResult.data.refreshToken);
    const accessToken = signAccessToken({
      id: payload.id,
      role: payload.role,
      organizationType: payload.organizationType,
    });

    return res.json({
      statusCode: 200,
      message: "Access token refreshed",
      data: { accessToken },
    });
  } catch (error) {
    console.error("Token refresh error:", error);
    return res
      .status(401)
      .json({ statusCode: 401, message: "Invalid refresh token" });
  }
});

router.get("/me", async (req, res) => {
  // Convenience endpoint for backend debugging (not used by frontend directly)
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ statusCode: 401, message: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = verifyRefreshToken(token);
    const user = await findUserById(payload.id);
    if (!user) {
      return res
        .status(404)
        .json({ statusCode: 404, message: "User not found" });
    }

    const data = await buildUserResponse(user);
    return res.json({ statusCode: 200, message: "OK", data });
  } catch (error) {
    console.error("Auth me error:", error);
    return res
      .status(401)
      .json({ statusCode: 401, message: "Invalid or expired token" });
  }
});

export default router;
