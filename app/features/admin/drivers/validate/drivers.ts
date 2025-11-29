import { z } from "zod";

import { EAdminPathName } from "@/app/types/enum";

export const driverSchema = z
  .object({
    first_name: z.string().min(1, "กรุณากรอกชื่อ"),
    last_name: z.string().min(1, "กรุณากรอกนามสกุล"),
    username: z.string().min(1, "กรุณากรอกชื่อผู้ใช้งาน"),
    email: z.string().email("กรุณากรอกอีเมล"),
    phone: z
      .string()
      .min(9, "กรุณากรอกเบอร์โทรศัพท์อย่างน้อย 9 หลัก")
      .max(10, "กรุณากรอกเบอร์โทรศัพท์ 10 หลัก"),
    organization_id: z.string().optional(),
    image: z
      .union([z.instanceof(File), z.array(z.instanceof(File)), z.string()])
      .optional(),
    image_id_card: z
      .union([z.instanceof(File), z.array(z.instanceof(File)), z.string()])
      .optional(),
    image_truck_registration: z
      .union([z.instanceof(File), z.array(z.instanceof(File)), z.string()])
      .optional(),
    image_driving_license_card: z
      .union([z.instanceof(File), z.array(z.instanceof(File)), z.string()])
      .optional(),
  })
  .superRefine((data, ctx) => {
    const pathname =
      typeof window !== "undefined" ? window.location.pathname : "";

    if (pathname.includes(EAdminPathName.DRIVERSINTERNAL)) {
      if (!data.organization_id || data.organization_id.trim() === "") {
        ctx.addIssue({
          path: ["organization_id"],
          code: z.ZodIssueCode.custom,
          message: "กรุณาเลือก",
        });
      }
    }
  });

export type DriverForm = z.infer<typeof driverSchema>;
