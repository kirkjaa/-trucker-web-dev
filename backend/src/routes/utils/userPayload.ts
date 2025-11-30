import { Request } from "express";

import { UserPayload } from "../../services/user.service";
import { buildFileUrl } from "../../utils/upload";

export function extractUserPayload(req: Request): UserPayload {
  const {
    first_name,
    last_name,
    username,
    email,
    phone,
    organization_id,
    dial_code,
  } = req.body;

  if (!first_name || !last_name) {
    throw new Error("First name and last name are required");
  }

  if (!username) {
    throw new Error("Username is required");
  }

  if (!email) {
    throw new Error("Email is required");
  }

  if (!phone) {
    throw new Error("Phone number is required");
  }

  if (!organization_id) {
    throw new Error("Organization is required");
  }

  const imagePath = req.file ? buildFileUrl(req.file.filename) : undefined;

  return {
    firstName: first_name,
    lastName: last_name,
    username,
    email,
    phone,
    organizationId: organization_id,
    dialCode: dial_code,
    imagePath: imagePath ?? null,
  };
}

