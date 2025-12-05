import { Router } from "express";
import { db } from "../db";
import { users } from "../db/schema";
import { eq, or, and, sql } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

// Login schema
const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

// Map desktop roles to mobile-friendly names
function mapRoleToMobile(role: string): string {
  switch (role) {
    case "SUPERADMIN":
      return "admin";
    case "ORGANIZATION":
      return "company";
    case "DRIVER":
      return "shipping";
    default:
      return "shipping";
  }
}

// Login endpoint
router.post("/login", async (req, res) => {
  try {
    // Validate input
    const validationResult = loginSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        error: "Invalid input",
        details: validationResult.error.errors,
      });
    }

    const { username, password } = validationResult.data;
    const trimmedUsername = username.trim().toLowerCase();

    // Find user by username or email in desktop users table
    const [user] = await db
      .select()
      .from(users)
      .where(
        and(
          or(
            sql`LOWER(${users.username}) = ${trimmedUsername}`,
            sql`LOWER(${users.email}) = ${trimmedUsername}`
          ),
          eq(users.deleted, false)
        )
      )
      .limit(1);

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check if user has a password hash
    if (!user.passwordHash) {
      return res.status(401).json({ error: "Invalid credentials - no password set" });
    }

    // Verify password using bcrypt
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check user status
    if (user.status !== "ACTIVE") {
      return res.status(403).json({ 
        error: "Account not active",
        status: user.status 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        organizationId: user.organizationId,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Build display name
    const displayName = user.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`
      : user.username;

    // Return success response
    return res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        displayName: displayName,
        role: mapRoleToMobile(user.role),
        originalRole: user.role,
        organizationId: user.organizationId,
        avatar: user.imageUrl,
        status: user.status,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Get current user
router.get("/me", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    // Fetch fresh user data
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, decoded.userId))
      .limit(1);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const displayName = user.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`
      : user.username;

    return res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      displayName: displayName,
      role: mapRoleToMobile(user.role),
      originalRole: user.role,
      organizationId: user.organizationId,
      avatar: user.imageUrl,
      status: user.status,
    });
  } catch (error) {
    console.error("Get user error:", error);
    return res.status(401).json({ error: "Invalid token" });
  }
});

// Register endpoint (optional - for new driver sign-ups)
router.post("/register", async (req, res) => {
  try {
    const { username, email, password, firstName, lastName, phone } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    // Check if username or email already exists
    const [existingUser] = await db
      .select()
      .from(users)
      .where(
        or(
          sql`LOWER(${users.username}) = ${username.toLowerCase()}`,
          email ? sql`LOWER(${users.email}) = ${email.toLowerCase()}` : sql`false`
        )
      )
      .limit(1);

    if (existingUser) {
      return res.status(409).json({ error: "Username or email already exists" });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Generate display code
    const displayCode = `DRV-${Date.now().toString(36).toUpperCase()}`;

    // Create new user as DRIVER role with PENDING status
    const [newUser] = await db
      .insert(users)
      .values({
        displayCode,
        username: username.toLowerCase(),
        email: email?.toLowerCase(),
        passwordHash,
        firstName,
        lastName,
        phone,
        role: "DRIVER",
        status: "PENDING",
      })
      .returning();

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        displayName: firstName && lastName ? `${firstName} ${lastName}` : username,
        role: mapRoleToMobile(newUser.role),
        status: newUser.status,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
