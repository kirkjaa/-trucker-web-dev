import { z } from "zod";

import {
  ETruckContainers,
  ETruckDepartmentType,
  ETruckFuelType,
  ETruckSize,
  ETruckType,
} from "@/app/types/enum";

const baseTruckSchema = {
  remark: z.string().optional(),
  color: z.string().min(1, "กรุณากรอกสีรถ"),
  sideImage: z.any().optional(),
  licensePlateProvince: z.string().min(1, "กรุณาเลือกจังหวัด"),
  width: z.coerce
    .number()
    .nonnegative()
    .min(1, "กรุณากรอกความกว้าง")
    .max(3, "กรุณากรอกความกว้างไม่เกิน 3 เมตร"),
  length: z.coerce
    .number()
    .nonnegative()
    .min(1, "กรุณากรอกความยาว")
    .max(15, "กรุณากรอกความยาวไม่เกิน 15 เมตร"),
  licensePlateImage: z.any().optional(),
  height: z.coerce.number().nonnegative().min(1, "กรุณากรอกความสูง"),
  brand: z.string().min(1, "กรุณากรอกยี่ห้อรถ"),
  zone: z.string().min(1, "กรุณากรอกตำแหน่งล่าสุดที่รถอยู่"),
  fuelType: z.nativeEnum(ETruckFuelType),
  containers: z
    .array(z.nativeEnum(ETruckContainers))
    .min(1, "ประเภทตู้ที่รับได้"),
  frontImage: z.any().optional(),
  backImage: z.any().optional(),
  weight: z.coerce.number().nonnegative().min(1, "กรุณากรอกน้ําหนัก"),
  documents: z.array(z.any()).optional(),
  type: z.nativeEnum(ETruckType),
  vin: z
    .string()
    .min(1, "กรุณากรอกหมายเลข VIN")
    .regex(/^[A-HJ-NPR-Z0-9]{17}$/, {
      message:
        "หมายเลข VIN ต้องมี 17 ตัวอักษร และห้ามมี I, O, Q (พิมพ์ใหญ่เท่านั้น)",
    }),
  licensePlateValue: z.string().min(1, "กรุณากรอกป้ายทะเบียน"),
  year: z.string().min(1, "กรุณากรอกปีรถ"),
  truckCode: z.string().min(1, "กรุณากรอกรหัสรถ"),
  size: z.nativeEnum(ETruckSize),
};

const factoryTruckSchema = z.object({
  ...baseTruckSchema,
  departmentType: z.literal(ETruckDepartmentType.FACTORY),
  driverId: z.string().min(1, "กรุณากรอกรหัสพนักงาน"),
});

const freelanceTruckSchema = z.object({
  ...baseTruckSchema,
  departmentType: z.literal(ETruckDepartmentType.FREELANCE),
  driverId: z.string().optional(),
});

const companyTruckSchema = z.object({
  ...baseTruckSchema,
  departmentType: z.literal(ETruckDepartmentType.COMPANY),
  driverId: z.string().min(1, "กรุณากรอกรหัสพนักงาน"),
});

export const truckSchema = z.discriminatedUnion("departmentType", [
  factoryTruckSchema,
  freelanceTruckSchema,
  companyTruckSchema,
]);

export type TruckFormInputs = z.infer<typeof truckSchema>;
