import { z } from "zod";

export const FactoryMeFormSchema = z.object({
  name: z.string().min(1, "กรุณากรอกชื่อ"),
  dialCode: z.string().default("+66"),
  phone: z
    .string()
    .min(9, "กรุณากรอกเบอร์โทรศัพท์อย่างน้อย 9 หลัก")
    .max(10, "กรุณากรอกเบอร์โทรศัพท์ 10 หลัก"),
  email: z.string().email("กรุณากรอกอีเมล"),
  province: z.string().optional(),
  district: z.string().optional(),
  subDistrict: z.string().optional(),
  postalCode: z.string().optional(),
  addressLine1: z.string().min(1, "กรุณากรอกที่อยู่"),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
  adminUserId: z.string().optional(),
  businessType: z.string().optional(),
  image: z.any().optional(),
  logoImage: z.any().optional(),
  documents: z.any().array().optional(),
});

export type FactoryMeFormInputs = z.infer<typeof FactoryMeFormSchema>;
