import { z } from "zod";

import { EPackagesType } from "@/app/types/enum";

export const PackageFormSchema = z
  .object({
    id: z.string().optional(),
    name: z.string().min(1, "กรุณากรอกชื่อแพ็คเกจ"),
    duration: z.object({
      value: z.coerce.number().min(1, "กรุณากรอกจํานวน"),

      unit: z.string().default("day"),
    }),
    price: z.coerce.number().min(1, "กรุณากรอกราคา"),

    isActive: z.boolean(),
    type: z.nativeEnum(EPackagesType),
    starDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    remark: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.starDate && data.endDate) {
        const diffMs = data.endDate.getTime() - data.starDate.getTime();
        const diffDays = diffMs / (1000 * 60 * 60 * 24);
        return data.duration.value <= diffDays;
      }
      return true;
    },
    {
      message: "จำนวนวันต้องไม่เกินระยะห่างระหว่างวันเริ่มต้นและวันสิ้นสุด",
      path: ["duration", "value"],
    }
  );

export type PackageFormInputs = z.infer<typeof PackageFormSchema>;
