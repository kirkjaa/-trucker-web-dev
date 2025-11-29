import { z } from "zod";

export const packageSchema = z.object({
  id: z.number().optional(),
  is_active: z.boolean(),
  name_th: z.string().min(1, "กรุณากรอกชื่อ"),
  description_th: z.string().min(1, "กรุณากรอกรายละเอียด"),
  period: z.string().min(1, "กรุณากรอกระยะเวลาใช้งาน"),
  price: z.string().min(1, "กรุณากรอกราคาแพ็คเกจ"),
  start_date: z.date({ required_error: "กรุณาเลือกวันเริ่มต้นใช้งาน" }),
  end_date: z.date({ required_error: "กรุณาเลือกวันสิ้นสุดใช้งาน" }),
});
export type PackageForm = z.infer<typeof packageSchema>;
