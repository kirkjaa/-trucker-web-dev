import { z } from "zod";

const PermissionSchema = z.object({
  isManageDashboard: z.boolean(),
  isManageCompany: z.boolean(),
  isManageUser: z.boolean(),
  isManageChat: z.boolean(),
  isManageQuotaion: z.boolean(),
  isManageOrder: z.boolean(),
  isManageTruck: z.boolean(),
  isManagePackage: z.boolean(),
  isManageProfile: z.boolean(),
});

export const UsersPositionFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "กรุณากรอกชื่อ"),
  title: z.string().min(1, "กรุณากรอกตําแหน่ง"),
  isActive: z.boolean(),
  permission: PermissionSchema,
});

export type UsersPositionFormInputs = z.infer<typeof UsersPositionFormSchema>;
export type permissionForm = z.infer<typeof PermissionSchema>;
