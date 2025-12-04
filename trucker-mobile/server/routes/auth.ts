import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { db } from "../db";
import { sql } from "drizzle-orm";
import {
  generateToken,
  authMiddleware,
  AuthRequest,
} from "../middleware/auth";
import { z } from "zod";

const router = Router();

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

// Desktop database user interface
interface DesktopUser {
  id: string;
  display_code: string;
  username: string;
  email: string | null;
  password_hash: string | null;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  image_url: string | null;
  role: string;
  status: string;
}

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { username, password } = loginSchema.parse(req.body);

    // Query desktop database schema - search by username or email
    const result = await db.execute(sql`
      SELECT 
        id, display_code, username, email, password_hash, 
        first_name, last_name, phone, image_url, role, status
      FROM users 
      WHERE (username = ${username} OR email = ${username})
        AND deleted = false
      LIMIT 1
    `);

    const users = result.rows as DesktopUser[];

    if (!users || users.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = users[0];

    // Check if user is active
    if (user.status !== "ACTIVE") {
      return res
        .status(401)
        .json({ error: "Account is not active. Please contact admin." });
    }

    // Verify password
    if (!user.password_hash) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Map desktop role to mobile role
    const mobileRole = mapDesktopRoleToMobile(user.role);
    const displayName =
      [user.first_name, user.last_name].filter(Boolean).join(" ") ||
      user.username;

    const token = generateToken({
      id: user.id,
      username: user.username,
      email: user.email || "",
      role: mobileRole,
      displayName: displayName,
    });

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: mobileRole,
        displayName: displayName,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
        avatar: user.image_url,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ error: "Invalid input", details: error.errors });
    }
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/me", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const result = await db.execute(sql`
      SELECT 
        id, display_code, username, email, 
        first_name, last_name, phone, image_url, role, status
      FROM users 
      WHERE id = ${req.user!.id}::uuid
        AND deleted = false
      LIMIT 1
    `);

    const users = result.rows as DesktopUser[];

    if (!users || users.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = users[0];
    const mobileRole = mapDesktopRoleToMobile(user.role);
    const displayName =
      [user.first_name, user.last_name].filter(Boolean).join(" ") ||
      user.username;

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: mobileRole,
      displayName: displayName,
      firstName: user.first_name,
      lastName: user.last_name,
      phone: user.phone,
      avatar: user.image_url,
    });
  } catch (error) {
    console.error("Get me error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Map desktop roles to mobile roles
function mapDesktopRoleToMobile(desktopRole: string): string {
  switch (desktopRole) {
    case "SUPERADMIN":
      return "admin";
    case "ORGANIZATION":
      return "company";
    case "DRIVER":
      return "shipping";
    default:
      return "customer";
  }
}

export default router;
