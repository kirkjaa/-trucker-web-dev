import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { db } from "../db";
import { users } from "../db/schema";
import { eq, or } from "drizzle-orm";
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

const registerSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  displayName: z.string().min(1),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  role: z.enum(["admin", "company", "customer", "shipping"]).default("shipping"),
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    const parseResult = loginSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ 
        error: "Invalid input", 
        details: parseResult.error.errors 
      });
    }
    
    const { username, password } = parseResult.data;

    // Query mobile_user_profiles table - search by username or email
    const [user] = await db
      .select()
      .from(users)
      .where(or(eq(users.username, username), eq(users.email, username)))
      .limit(1);

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ error: "Account is not active. Please contact admin." });
    }

    // Verify password
    if (!user.passwordHash) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const displayName =
      [user.firstName, user.lastName].filter(Boolean).join(" ") ||
      user.displayName ||
      user.username;

    const token = generateToken({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role || "shipping",
      displayName: displayName,
    });

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        displayName: displayName,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        avatar: user.avatar,
      },
    });
  } catch (error: any) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
});

router.post("/register", async (req: Request, res: Response) => {
  try {
    const parseResult = registerSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ 
        error: "Invalid input", 
        details: parseResult.error.errors 
      });
    }

    const data = parseResult.data;

    // Check if username or email already exists
    const [existingUser] = await db
      .select()
      .from(users)
      .where(or(eq(users.username, data.username), eq(users.email, data.email)))
      .limit(1);

    if (existingUser) {
      return res.status(400).json({ error: "Username or email already exists" });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(data.password, 10);

    // Create user
    const [newUser] = await db
      .insert(users)
      .values({
        username: data.username,
        email: data.email,
        passwordHash: passwordHash,
        displayName: data.displayName,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        role: data.role,
        isActive: true,
      })
      .returning();

    const displayName =
      [newUser.firstName, newUser.lastName].filter(Boolean).join(" ") ||
      newUser.displayName ||
      newUser.username;

    const token = generateToken({
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role || "shipping",
      displayName: displayName,
    });

    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        displayName: displayName,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        phone: newUser.phone,
        avatar: newUser.avatar,
      },
    });
  } catch (error: any) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
});

router.get("/me", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, req.user!.id))
      .limit(1);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const displayName =
      [user.firstName, user.lastName].filter(Boolean).join(" ") ||
      user.displayName ||
      user.username;

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      displayName: displayName,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      avatar: user.avatar,
    });
  } catch (error) {
    console.error("Get me error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
