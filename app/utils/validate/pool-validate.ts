import { nativeEnum, z } from "zod";

import { EPoolType, EPostOfferType, ETruckSize } from "@/app/types/enum";

export const PoolFormSchema = z
  .object({
    type: z.nativeEnum(EPoolType).optional(),
    subject: z.string().min(1, "กรุณากรอกหัวข้อ"),
    description: z.string().min(1, "กรุณากรอกรายละเอียด"),
    jobDetailOriginProvince: z.string().optional(),
    jobDetailDestinationProvince: z.string().optional(),
    jobDetailOriginLongitude: z.coerce.number().optional(),
    jobDetailOriginLatitude: z.coerce.number().optional(),
    jobDetailDestinationLatitude: z.coerce.number().optional(),
    jobDetailDestinationLongitude: z.coerce.number().optional(),
    jobDetailDistance: z.coerce.number().optional(),
    jobDetailJobStartAt: z.string().optional().nullable(),
    jobDetailJobEnd: z.string().optional().nullable(),
    jobDetailTruckSize: z.nativeEnum(ETruckSize).optional(),
    jobDetailTruckQuantity: z.coerce.number().optional(),
    jobDetailInitialPrice: z.number().optional(),
    isCreateFromOrder: z.boolean().optional(),
    image: z.any().optional(),
  })
  .refine(
    (data) => {
      if (data.type === EPoolType.QUICK || data.type === EPoolType.NORMAL) {
        return (
          !!data.jobDetailOriginProvince &&
          data.jobDetailOriginProvince.length >= 1
        );
      }
      return true;
    },
    {
      path: ["jobDetailOriginProvince"],
      message: "กรุณาเลือกต้นทาง",
    }
  )
  .refine(
    (data) => {
      if (data.type === EPoolType.QUICK) {
        return (
          !!data.jobDetailJobStartAt && data.jobDetailJobStartAt.length >= 1
        );
      }
      return true;
    },
    {
      path: ["jobDetailJobStartAt"],
      message: "กรุณาเลือกวันเริ่มงาน",
    }
  )
  .refine(
    (data) => {
      if (data.type === EPoolType.QUICK) {
        return !!data.jobDetailJobEnd && data.jobDetailJobEnd.length >= 1;
      }
      return true;
    },
    {
      path: ["jobDetailJobEnd"],
      message: "กรุณาเลือกวันสิ้นสุดงาน",
    }
  )
  .refine(
    (data) => {
      if (data.type === EPoolType.QUICK) {
        return !!data.jobDetailTruckSize && data.jobDetailTruckSize.length >= 1;
      }
      return true;
    },
    {
      path: ["jobDetailTruckSize"],
      message: "กรุณาเลือกขนาดรถ",
    }
  )
  .refine(
    (data) => {
      if (data.type === EPoolType.QUICK) {
        return (
          !!data.jobDetailTruckQuantity && data.jobDetailTruckQuantity >= 0
        );
      }
      return true;
    },
    {
      path: ["jobDetailTruckQuantity"],
      message: "กรุณากรอกจํานวนรถ",
    }
  )
  .refine(
    (data) => {
      if (data.type === EPoolType.QUICK) {
        return (
          !!data.jobDetailDestinationProvince &&
          data.jobDetailDestinationProvince.length >= 1
        );
      }
      return true;
    },
    {
      path: ["jobDetailDestinationProvince"],
      message: "กรุณาเลือกปลายทาง",
    }
  );

export type PoolFormInputs = z.infer<typeof PoolFormSchema>;

export const PoolOfferFormSchema = z.object({
  type: nativeEnum(EPostOfferType),
  postId: z.string(),
  offeringPrice: z.coerce.number(),
  truckIds: z.array(z.string()).optional(),
});

export type PoolOfferFormInputs = z.infer<typeof PoolOfferFormSchema>;
