import { z } from "zod";

import { EComPathName } from "@/app/types/enum";

export const UsersSchema = z
  .object({
    id: z.string().optional(),
    pathName: z.string().optional(),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .optional(),
    firstName: z.string().min(3, "First name must be at least 3 characters"),
    lastName: z.string().min(3, "Last name must be at least 3 characters"),
    dialCode: z.string().default("+66"),
    phone: z
      .string()
      .min(9, "กรุณากรอกเบอร์โทรศัพท์อย่างน้อย 9 หลัก")
      .max(10, "กรุณากรอกเบอร์โทรศัพท์ 10 หลัก"),
    email: z.string().email(),
    image: z.any().optional(),
    companyId: z.string().optional(),
    factoryId: z.string().optional(),
    positionId: z.string().optional(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .optional(),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .optional(),
  })
  .superRefine((data, ctx) => {
    const isNew = !data.id;

    if (isNew && !data.pathName!.includes(EComPathName.USERSDRIVER)) {
      console.log(data);
      if (!data.password) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["password"],
          message: "Password is required",
        });
      }

      if (!data.confirmPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["confirmPassword"],
          message: "Confirm password is required",
        });
      }
      if (!data.username) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["username"],
          message: "username is required",
        });
      }
    }
    if (!data.pathName!.includes(EComPathName.USERSDRIVER)) {
      if (!data.positionId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["positionId"],
          message: "Position is required",
        });
      }
    }

    if (data.password || data.confirmPassword) {
      if (data.password !== data.confirmPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["confirmPassword"],
          message: "Passwords do not match",
        });
      }
    }
  });

export type UsersFormInputs = z.infer<typeof UsersSchema>;
