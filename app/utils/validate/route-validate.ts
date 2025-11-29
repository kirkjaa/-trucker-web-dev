import { z } from "zod";

export const DistanceRouteSchema = z.object({
  value: z.coerce.number().min(1, "กรุณากรอกระยะทาง"),
  unit: z.string(),
});

export const LocationSchema = z.object({
  id: z.string().optional(),
  province: z.string().min(1, "กรุณาเลือกจังหวัด"),
  district: z.string().min(1, "กรุณาเลือกอําเภอ"),
  latitude: z.coerce
    .number()
    .min(1, "กรุณากรอก Latitude")
    .refine(
      (num) => {
        return !isNaN(num) && num >= -90 && num <= 90;
      },
      {
        message: "Latitude ต้องอยู่ระหว่าง -90 ถึง 90",
      }
    ),

  longitude: z.coerce
    .number()
    .min(1, "กรุณากรอก Longitude")
    .refine(
      (num) => {
        return !isNaN(num) && num >= -180 && num <= 180;
      },
      {
        message: "Longitude ต้องอยู่ระหว่าง -180 ถึง 180",
      }
    ),
});

export const RouteFormSchema = z.object({
  id: z.string().optional(),
  factoryId: z.string().optional(),
  factoryName: z.string().optional(),
  routeFactoryCode: z.string().min(1, "กรุณาใส่รหัสเส้นทาง"),
  shippingType: z.string().optional(),
  type: z.string().optional(),
  distance: DistanceRouteSchema,
  origin: LocationSchema,
  destination: LocationSchema,
  returnPoint: LocationSchema.optional(),
});

export type RouteFormInputs = z.infer<typeof RouteFormSchema>;

const isValidLatitude = (val: string) => {
  const num = Number(val);
  return !isNaN(num) && num >= -90 && num <= 90;
};

const isValidLongitude = (val: string) => {
  const num = Number(val);
  return !isNaN(num) && num >= -180 && num <= 180;
};

export const createFactoryRouteCodeSchema = z.object({
  routeFactoryCode: z.string().min(1, "กรุณาใส่รหัสเส้นทาง"),
  distance: z.string().min(1, "กรุณากรอกระยะทาง"),
  "returnPoint.province": z
    .string()
    .optional()
    .refine((val) => !val || val.length > 0, {
      message: "กรุณาเลือกจังหวัด",
    }),
  "returnPoint.district": z
    .string()
    .optional()
    .refine((val) => !val || val.length > 0, {
      message: "กรุณาเลือกอำเภอ",
    }),
  "returnPoint.latitude": z.coerce
    .string()
    .optional()
    .refine((val) => !val || val.length > 0, {
      message: "กรุณากรอกละติจูด",
    })
    .refine((val) => !val || isValidLatitude(val), {
      message: "ละติจูดต้องอยู่ระหว่าง -90 ถึง 90",
    }),
  "returnPoint.longitude": z.coerce
    .string()
    .optional()
    .refine((val) => !val || val.length > 0, {
      message: "กรุณากรอกลองจิจูด",
    })
    .refine((val) => !val || isValidLongitude(val), {
      message: "ลองจิจูดต้องอยู่ระหว่าง -180 ถึง 180",
    }),
  "origin.province": z.string().min(1, "กรุณาเลือกจังหวัด"),
  "origin.district": z.string().min(1, "กรุณาเลือกอำเภอ"),
  "origin.latitude": z.coerce
    .string()
    .min(1, "กรุณากรอกละติจูด")
    .refine(isValidLatitude, {
      message: "ละติจูดต้องอยู่ระหว่าง -90 ถึง 90",
    }),
  "origin.longitude": z.coerce
    .string()
    .min(1, "กรุณากรอกลองจิจูด")
    .refine(isValidLongitude, {
      message: "ลองจิจูดต้องอยู่ระหว่าง -180 ถึง 180",
    }),
  "destination.province": z.string().min(1, "กรุณาเลือกจังหวัด"),
  "destination.district": z.string().min(1, "กรุณาเลือกอำเภอ"),
  "destination.latitude": z.coerce
    .string()
    .min(1, "กรุณากรอกละติจูด")
    .refine(isValidLatitude, {
      message: "ละติจูดต้องอยู่ระหว่าง -90 ถึง 90",
    }),
  "destination.longitude": z.coerce
    .string()
    .min(1, "กรุณากรอกลองจิจูด")
    .refine(isValidLongitude, {
      message: "ลองจิจูดต้องอยู่ระหว่าง -180 ถึง 180",
    }),
});
