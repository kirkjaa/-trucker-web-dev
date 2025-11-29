import { z } from "zod";

import { ETruckSize } from "@/app/types/enum";

export const PriceEntryFormSchema = z.object({
  masterRouteId: z.string().optional(),
  id: z.string().optional(),
  truckSize: z.nativeEnum(ETruckSize),
  price: z.coerce.number().min(1, "กรุณากรอกราคา"),
});

export type PriceEntryFormInputs = z.infer<typeof PriceEntryFormSchema>;

export const PriceEntryFormListSchema = z.object({
  payload: z.array(
    z.object({
      id: z.string().optional(),
      truckSize: z.nativeEnum(ETruckSize),
      price: z.coerce.number().min(1, "กรุณากรอกราคา"),
    })
  ),
});

export type PriceEntryFormListInputs = z.infer<typeof PriceEntryFormListSchema>;
