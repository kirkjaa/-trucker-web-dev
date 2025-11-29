import { z } from "zod";

export const organizationSchema = z.object({
  name: z.string().min(1, "กรุณากรอกชื่อ"),
  dial_code: z.string().default("+66"),
  phone: z
    .string()
    .min(9, "กรุณากรอกเบอร์โทรศัพท์อย่างน้อย 9 หลัก")
    .max(10, "กรุณากรอกเบอร์โทรศัพท์ 10 หลัก"),
  email: z.string().email("กรุณากรอกอีเมล"),
  type_id: z.number(),
  business_type_id: z.string().min(1, "กรุณาเลือกประเภทธุรกิจ"),
  address: z.string().min(1, "กรุณากรอกที่อยู่"),
  province_id: z.string().min(1, "กรุุณาเลือกจังหวัด"),
  district_id: z.string().min(1, "กรุณาเลือกอำเภอ/เขต"),
  sub_district_id: z.string().min(1, "กรุณาเลือกตำบล/แขวง"),
  zip_code: z.string(),
  latitude: z.string().min(1, "กรุณากรอกละติจูด"),
  longitude: z.string().min(1, "กรุณากรอกลองจิจูด"),
  cover: z.union([z.instanceof(File), z.string()]).optional(),
  logo: z.union([z.instanceof(File), z.string()]).optional(),
  documents: z.any().array().optional(),
});
export type OrganizationForm = z.infer<typeof organizationSchema>;
