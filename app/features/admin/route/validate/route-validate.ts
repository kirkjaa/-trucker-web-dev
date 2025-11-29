import { z } from "zod";

import { EAdminPathName } from "@/app/types/enum";

export const routeSchema = z
  .object({
    // organization_id: z.string(),
    freight_type: z.string(),
    route_code: z.string().min(1, "กรุณากรอกรหัสเส้นทาง"),
    distance: z.string(),

    origin_province_id: z.string().min(1, "กรุณาเลือกจังหวัด"),
    origin_district_id: z.string().min(1, "กรุณาเลือกอำเภอ/เขต"),
    origin_latitude: z.string().min(1, "กรุณากรอกละติจูด"),
    origin_longitude: z.string().min(1, "กรุณากรอกลองจิจูด"),

    destination_province_id: z.string().min(1, "กรุณาเลือกจังหวัด"),
    destination_district_id: z.string().min(1, "กรุณาเลือกอำเภอ/เขต"),
    destination_latitude: z.string().min(1, "กรุณากรอกละติจูด"),
    destination_longitude: z.string().min(1, "กรุณากรอกลองจิจูด"),

    return_point_province_id: z.string().optional(),
    return_point_district_id: z.string().optional(),
    return_point_latitude: z.string().optional(),
    return_point_longitude: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const pathname =
      typeof window !== "undefined" ? window.location.pathname : "";

    const isInternational = pathname.includes(
      EAdminPathName.INTERNATIONALROUTE
    );

    if (isInternational) {
      if (
        !data.return_point_province_id ||
        data.return_point_province_id.trim() === ""
      ) {
        ctx.addIssue({
          path: ["return_point_province_id"],
          code: z.ZodIssueCode.custom,
          message: "กรุณาเลือกจังหวัด",
        });
      }

      if (
        !data.return_point_district_id ||
        data.return_point_district_id.trim() === ""
      ) {
        ctx.addIssue({
          path: ["return_point_district_id"],
          code: z.ZodIssueCode.custom,
          message: "กรุณาเลือกอำเภอ/เขต",
        });
      }

      if (
        !data.return_point_latitude ||
        data.return_point_latitude.trim() === ""
      ) {
        ctx.addIssue({
          path: ["return_point_latitude"],
          code: z.ZodIssueCode.custom,
          message: "กรุณากรอกละติจูด",
        });
      }

      if (
        !data.return_point_longitude ||
        data.return_point_longitude.trim() === ""
      ) {
        ctx.addIssue({
          path: ["return_point_longitude"],
          code: z.ZodIssueCode.custom,
          message: "กรุณากรอกลองจิจูด",
        });
      }
    }
  });

export type RouteForm = z.infer<typeof routeSchema>;
