import { z } from "zod";

export const createRfqOneWaySchema = z.object({
  vehicleType: z.string().min(1, "กรุณาเลือกรูปแบบการจัดส่ง"),
  vehicleSize: z.string().min(1, "กรุณาเลือกประเภทรถ"),
  contactStart: z.date({
    required_error: "กรุณาเลือกวันที่เริ่มต้น",
  }),
  contactEnd: z.date({
    required_error: "กรุณาเลือกวันที่สิ้นสุด",
  }),
  selectedCompany: z
    .array(
      z.object({
        id: z.string(),
        value: z.string(),
      })
    )
    .min(1, "กรุณาเลือกบริษัท"),
  oilRatePrice: z.number().min(1, "กรุณากรอกราคาน้ำมัน"),
  priceRateUp: z.number().min(1, "กรุณากรอกราคาผันขึ้น"),
  priceRateDown: z.number().min(1, "กรุณากรอกราคาผันลง"),
});

export const createRfqAbroadSchema = z.object({
  contactStart: z.date({
    required_error: "กรุณาเลือกวันที่เริ่มต้น",
  }),
  contactEnd: z.date({
    required_error: "กรุณาเลือกวันที่สิ้นสุด",
  }),
  selectedCompany: z
    .array(
      z.object({
        id: z.string(),
        value: z.string(),
        label: z.string(),
      })
    )
    .min(1, "กรุณาเลือกบริษัท"),
  oilRatePrice: z.number().min(1, "กรุณากรอกราคาน้ำมัน"),
  priceRateUp: z.number().min(1, "กรุณากรอกราคาผันขึ้น"),
  priceRateDown: z.number().min(1, "กรุณากรอกราคาผันลง"),
});

export const createRfqCustomRoute = z.object({
  startLocation: z.string().min(1, "กรุณาเลือกต้นทาง"),
  endLocation: z.string().min(1, "กรุณาเลือกปลายทาง"),
  unitPrice: z.string().min(1, "กรุณาเลือกรูปแบบการจัดส่ง"),
  price: z.number().min(1, "กรุณากรอกราคา"),
});
