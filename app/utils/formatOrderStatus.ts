import { EOrderStatus } from "../types/enum";

export const getStatusStyle = (status: string) => {
  switch (status) {
    case EOrderStatus.MATCHED:
      return "text-toast-warning-border bg-toast-warning-background";
    case EOrderStatus.START_SHIP:
      return "text-primary-700 bg-toast-info-background";
    case EOrderStatus.SHIPPED:
      return "text-secondary-caribbean-green-04 bg-toast-success-background";
    case EOrderStatus.COMPLETED:
      return "text-secondary-caribbean-green-04 bg-toast-success-background";
    default:
      return "text-secondary-200 bg-neutral-02";
  }
};

export const mapStatusToThaiFac = (status: string) => {
  switch (status) {
    case EOrderStatus.MATCHED:
      return "รอดำเนินการ";
    case EOrderStatus.START_SHIP:
      return "เริ่มขนส่ง";
    case EOrderStatus.SHIPPED:
      return "ปิดงาน";
    case EOrderStatus.COMPLETED:
      return "ส่งเรียบร้อย";
    default:
      return "รอตอบกลับ";
  }
};

export const mapStatusToThaiCom = (status: string) => {
  switch (status) {
    case EOrderStatus.START_SHIP:
      return "เริ่มขนส่ง";
    case EOrderStatus.SHIPPED:
      return "ปิดงาน";
    default:
      return "รอเลือกรถ";
  }
};
