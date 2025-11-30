import { Request } from "express";

import { UserPayload } from "../../services/user.service";
import { buildFileUrl } from "../../utils/upload";

type MulterFiles = Record<string, Express.Multer.File[]>;

function getFilesDictionary(req: Request): MulterFiles {
  if (!req.files || Array.isArray(req.files)) {
    return {};
  }

  return req.files as MulterFiles;
}

function getUploadedFilePath(dict: MulterFiles, fieldName: string) {
  const file = dict[fieldName]?.[0];
  return file ? buildFileUrl(file.filename) : undefined;
}

export function extractUserPayload(
  req: Request,
  options?: { requireOrganization?: boolean; requireFields?: boolean }
): UserPayload {
  const {
    first_name,
    last_name,
    username,
    email,
    phone,
    organization_id,
    dial_code,
  } = req.body;

  const requireOrganization = options?.requireOrganization !== false;
  const requireFields = options?.requireFields !== false;

  const files = getFilesDictionary(req);
  const imagePath =
    req.file?.filename
      ? buildFileUrl(req.file.filename)
      : getUploadedFilePath(files, "image");

  const payload: UserPayload = {};

  if (first_name) {
    payload.firstName = first_name;
  } else if (requireFields) {
    throw new Error("First name is required");
  }

  if (last_name) {
    payload.lastName = last_name;
  } else if (requireFields) {
    throw new Error("Last name is required");
  }

  if (username) {
    payload.username = username;
  } else if (requireFields) {
    throw new Error("Username is required");
  }

  if (email) {
    payload.email = email;
  } else if (requireFields) {
    throw new Error("Email is required");
  }

  if (phone) {
    payload.phone = phone;
  } else if (requireFields) {
    throw new Error("Phone number is required");
  }

  if (requireOrganization) {
    if (!organization_id) {
      throw new Error("Organization is required");
    }
    payload.organizationId = organization_id;
  } else if (organization_id !== undefined) {
    payload.organizationId = organization_id || null;
  }

  if (dial_code !== undefined) {
    payload.dialCode = dial_code;
  }

  if (imagePath !== undefined) {
    payload.imagePath = imagePath ?? null;
  }

  return payload;
}

export { getFilesDictionary, getUploadedFilePath };

