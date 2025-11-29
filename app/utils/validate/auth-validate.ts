import { z } from "zod";

export const LoginFormSchema = z.object({
  username: z.string().email("กรุณากรอกชื่อผู้ใช้งาน หรือ เบอร์โทรศัพท์"),
  password: z.string().min(1, "กรุณากรอกรหัสผ่าน"),
  is_remembered: z.boolean(),
  // fcmToken: z.string().optional(),
});

export type LoginFormInputs = z.infer<typeof LoginFormSchema>;

export const ChangePasswordFormSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ChangePasswordFormInputs = z.infer<typeof ChangePasswordFormSchema>;
