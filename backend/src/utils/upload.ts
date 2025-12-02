import type { Request } from "express";
import fs from "fs";
import multer from "multer";
import path from "path";

const uploadsDir = path.join(__dirname, "..", "..", "uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req: Request, _file: Express.Multer.File, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req: Request, file: Express.Multer.File, cb) => {
    const timestamp = Date.now();
    const safeName = file.originalname.replace(/\s+/g, "_");
    cb(null, `${timestamp}-${safeName}`);
  },
});

export const upload = multer({ storage });

export function buildFileUrl(filename: string) {
  return `/uploads/${filename}`;
}

export function getUploadsDir() {
  return uploadsDir;
}
