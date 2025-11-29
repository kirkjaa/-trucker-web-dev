import { z } from "zod";

import { EAdminPathName } from "@/app/types/enum";

export const SystemUsersFormSchema = z
  .object({
    first_name: z.string().min(1, "กรุณากรอกชื่อ"),
    last_name: z.string().min(1, "กรุณากรอกนามสกุล"),
    username: z.string().min(1, "กรุณากรอกชื่อผู้ใช้งาน"),
    email: z.string().email("กรุณากรอกอีเมล"),
    phone: z
      .string()
      .min(9, "กรุณากรอกเบอร์โทรศัพท์อย่างน้อย 9 หลัก")
      .max(10, "กรุณากรอกเบอร์โทรศัพท์ 10 หลัก"),
    organization_id: z.string().min(1, "กรุณาเลือก"),
    image: z.any().optional(),
    pathName: z.string(),
  })
  .refine(
    (data) => {
      if (data.pathName === EAdminPathName.CREATESYSTEMUSERSFACTORIES) {
        return !!data.organization_id;
      }
      return true;
    },
    {
      message: "กรุณาเลือกโรงงาน",
      path: ["organization_id"],
    }
  )
  .refine(
    (data) => {
      if (data.pathName === EAdminPathName.CREATESYSTEMUSERSCOMPANIES) {
        return !!data.organization_id;
      }
      return true;
    },
    {
      message: "กรุณาเลือกบริษัท",
      path: ["organization_id"],
    }
  );
export type SystemUsersFormInputs = z.infer<typeof SystemUsersFormSchema>;
