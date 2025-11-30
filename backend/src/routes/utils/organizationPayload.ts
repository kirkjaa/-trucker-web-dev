import { AuthenticatedRequest } from "../../middleware/auth";
import { OrganizationPayload } from "../../services/organization.service";
import { buildFileUrl } from "../../utils/upload";

function getFilesDictionary(req: AuthenticatedRequest) {
  if (!req.files) {
    return {};
  }

  if (Array.isArray(req.files)) {
    return {};
  }

  return req.files as Record<string, Express.Multer.File[]>;
}

function getSingleFilePath(
  files: Record<string, Express.Multer.File[]>,
  fieldName: string
) {
  const file = files[fieldName]?.[0];
  return file ? buildFileUrl(file.filename) : undefined;
}

function getMultipleFilePaths(
  files: Record<string, Express.Multer.File[]>,
  fieldName: string
) {
  const list = files[fieldName] ?? [];
  return list.map((file) => buildFileUrl(file.filename));
}

function parseNumber(value: any) {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
}

export function extractOrganizationPayload(
  req: AuthenticatedRequest,
  defaultTypeId?: number
): OrganizationPayload {
  const files = getFilesDictionary(req);
  const {
    name,
    dial_code,
    phone,
    email,
    type_id,
    business_type_id,
    address,
    province_id,
    district_id,
    sub_district_id,
    zip_code,
    latitude,
    longitude,
  } = req.body;

  if (!name) {
    throw new Error("Name is required");
  }

  if (!phone) {
    throw new Error("Phone number is required");
  }

  if (!email) {
    throw new Error("Email is required");
  }

  if (!address) {
    throw new Error("Address is required");
  }

  const provinceId = parseNumber(province_id);
  const districtId = parseNumber(district_id);
  const subDistrictId = parseNumber(sub_district_id);

  if (!provinceId || !districtId || !subDistrictId) {
    throw new Error("Invalid address information");
  }

  const parsedTypeId = parseNumber(type_id) ?? 1;
  const typeId = defaultTypeId ?? parsedTypeId;

  return {
    name,
    dialCode: dial_code || "+66",
    phone,
    email,
    typeId,
    businessTypeId: parseNumber(business_type_id),
    addressLine1: address,
    provinceId,
    districtId,
    subDistrictId,
    zipCode: zip_code,
    latitude: latitude || undefined,
    longitude: longitude || undefined,
    coverPath: getSingleFilePath(files, "cover") ?? null,
    logoPath: getSingleFilePath(files, "logo") ?? null,
    documentPaths: getMultipleFilePaths(files, "documents"),
    documentDeleteIds: extractDocumentDeleteIds(req),
  };
}

export function extractDocumentDeleteIds(req: AuthenticatedRequest) {
  const ids = req.body.document_delete_ids;
  if (!ids) return [];
  return Array.isArray(ids) ? ids : [ids];
}

