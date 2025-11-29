import { z } from "zod";

import { DriversType } from "@/app/types/enum";

export const DriversFormSchema = z
  .object({
    username: z.string().min(1, "กรุณากรอกชื่อผู้ใช้งาน"),
    firstName: z.string().min(1, "กรุณากรอกชื่อ"),
    lastName: z.string().min(1, "กรุณากรอกนามสกุล"),
    dialCode: z.string().default("+66"),
    phone: z
      .string()
      .min(9, "กรุณากรอกเบอร์โทรศัพท์")
      .max(10, "กรุณากรอกเบอร์โทรศัพท์"),
    email: z.string().email("กรุณากรอกอีเมล"),
    image: z.any().optional(),
    type: z.nativeEnum(DriversType),
    driverCompanyId: z.string().optional(),
    idCardImage: z.any().optional(),
    vehicleRegistrationImage: z.any().optional(),
    vehicleLicenseImage: z.any().optional(),
  })
  .refine(
    (data) => {
      if (
        data.type === DriversType.INTERNAL &&
        (data.driverCompanyId === "" || !data.driverCompanyId)
      ) {
        return false;
      }
      return true;
    },
    {
      message: "กรุณาเลือกบริษัท",
      path: ["driverCompanyId"],
    }
  );

export type DriversFormInputs = z.infer<typeof DriversFormSchema>;

export const DriverCompanyInternalFormSchema = z.object({
  firstName: z.string().min(1, "กรุณากรอกชื่อ"),
  lastName: z.string().min(1, "กรุณากรอกนามสกุล"),
  email: z.string().email("กรุณากรอกอีเมล"),
  dialCode: z.string().default("+66"),
  phone: z
    .string()
    .min(9, "กรุณากรอกเบอร์โทรศัพท์อย่างน้อย 9 หลัก")
    .max(10, "กรุณากรอกเบอร์โทรศัพท์ 10 หลัก"),
  image: z.any().optional(),
  truckId: z.string().optional(),
});

export type DriverCompanyInternalFormInputs = z.infer<
  typeof DriverCompanyInternalFormSchema
>;

export const DriverAddTruckFormSchema = z.object({
  id: z.string(),
  truckId: z.string().min(1, "กรุณาเลือกข้อมูล"),
});

export type DriverAddTruckFormInputs = z.infer<typeof DriverAddTruckFormSchema>;
