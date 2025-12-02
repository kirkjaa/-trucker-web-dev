import { Router } from "express";

import { authMiddleware, AuthenticatedRequest } from "../middleware/auth";
import { buildUserResponse, findUserById } from "../services/user.service";

const router = Router();

router.get("/me", authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ statusCode: 401, message: "Unauthorized" });
    }

    const user = await findUserById(req.user.id);
    if (!user) {
      return res
        .status(404)
        .json({ statusCode: 404, message: "User not found" });
    }

    const data = await buildUserResponse(user);
    return res.json({ statusCode: 200, message: "OK", data });
  } catch (error) {
    console.error("Fetch current user error:", error);
    return res
      .status(500)
      .json({ statusCode: 500, message: "Failed to load user profile" });
  }
});

export default router;
