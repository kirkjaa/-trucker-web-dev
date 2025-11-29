import { z } from "zod";

export const UploadTemplateCsvFormSchema = z.object({
  id: z.string().optional(),
  factoryId: z.string().min(1, "กรุณาเลือกโรงงาน"),
  type: z.string().min(1, "กรุณาเลือกประเภทของ Template"),
  customerColumns: z.array(z.string().optional()).optional(),
  mappedColumns: z.array(z.string().optional()).optional(),
});

export type UploadTemplateCsvFormInputs = z.infer<
  typeof UploadTemplateCsvFormSchema
>;
