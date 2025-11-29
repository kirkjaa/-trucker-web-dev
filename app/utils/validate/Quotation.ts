import { z } from "zod";

export const createQuotationSchema = z.object({
  vehicleType: z.string().min(1, "กรุณาเลือกรูปแบบการจัดส่ง"),
  vehicleSize: z.string().min(1, "กรุณาเลือกประเภทรถ"),
  contactStart: z.date({
    required_error: "กรุณาเลือกวันที่เริ่มต้น",
  }),
  contactEnd: z.date({
    required_error: "กรุณาเลือกวันที่สิ้นสุด",
  }),
  // oilRateFirst: z.number().min(1, {
  //   message: "กรุณากรอกอัตราค่าน้ำมัน 1-15",
  //   invalid_type_error: "กรุณากรอกตัวเลข",
  // }),
  oilRateFirst: z.number().min(1, "กรุณากรอกอัตราค่าน้ำมัน 1-15"),
  oilRateSecond: z.number().min(1, "กรุณากรอกอัตราค่าน้ำมัน 16-31"),
  priceRateUp: z.number().min(1, "กรุณากรอกราคาผันขึ้น"),
  priceRateDown: z.number().min(1, "กรุณากรอกราคาผันลง"),
});

export const createQuotationCustomRoute = z.object({
  customerCode: z.string().min(1, "กรุณากรอกรหัสลูกค้า"),
  customerName: z.string().min(1, "กรุณากรอกชื่อลูกค้า"),
  productType: z.string().min(1, "กรุณากรอกประเภทสินค้า"),
  startLocation: z.string().min(1, "กรุณาเลือกต้นทาง"),
  endLocation: z.string().min(1, "กรุณาเลือกปลายทาง"),
  distance: z.number().min(1, "กรุณากรอกระยะทาง"),
  unitPrice: z.string().min(1, "กรุณาเลือกรูปแบบการจัดส่ง"),
  price: z.number().min(1, "กรุณากรอกราคา"),
});
