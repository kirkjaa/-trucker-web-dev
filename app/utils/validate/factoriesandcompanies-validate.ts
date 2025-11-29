import { z } from "zod";

export const FactoriesAndCompaniesFormSchema = z.object({
  name: z.string().min(1, "กรุณากรอกชื่อ"),
  dialCode: z.string(),
  phone: z
    .string()
    .min(9, "กรุณากรอกเบอร์โทรศัพท์อย่างน้อย 9 หลัก")
    .max(10, "กรุณากรอกเบอร์โทรศัพท์ 10 หลัก"),
  email: z.string().email("กรุณากรอกอีเมล"),
  province: z.string().min(1, "กรุณาเลือกจังหวัด"),
  adminUserId: z.string(),
  latitude: z.string().refine(
    (val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num >= -90 && num <= 90;
    },
    {
      message: "Latitude ต้องอยู่ระหว่าง -90 ถึง 90",
    }
  ),

  longitude: z.string().refine(
    (val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num >= -180 && num <= 180;
    },
    {
      message: "Longitude ต้องอยู่ระหว่าง -180 ถึง 180",
    }
  ),

  district: z.string().min(1, "กรุณาเลือกอําเภอ"),
  subDistrict: z.string().min(1, "กรุณาเลือกตําบล"),
  postalCode: z.string().min(1, "กรุณากรอกรหัสไปรษณีย์"),
  businessType: z.string(),
  addressLine1: z.string().min(1, "กรุณากรอกที่อยู่"),
  image: z.any().optional(),
  logoImage: z.any().optional(),
  documents: z.any().array().optional(),
});

export type FactoriesAndCompaniesFormInputs = z.infer<
  typeof FactoriesAndCompaniesFormSchema
>;
