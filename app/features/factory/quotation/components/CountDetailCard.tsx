"use client";

import { CardDetail } from "@/app/components/ui/featureComponents/CardDetail";
import { useQuotationStore } from "@/app/store/quotation/quotationStore";
import { IQuotationList } from "@/app/types/quotation/quotationType";

export default function CountDetailCard() {
  // Global State
  const quotations = useQuotationStore((state) => state.quotations);

  const countUniqueVehicleTypes = (quotations: IQuotationList[]): number => {
    const vehicleTypes = new Set<string>();
    quotations.forEach((quotation) => {
      if (quotation?.quotation_rfq.truck_type.name_th) {
        vehicleTypes.add(quotation?.quotation_rfq.truck_type.name_th);
      }
    });
    return vehicleTypes.size;
  };

  const countUniqueRoutes = (quotations: IQuotationList[]): number => {
    const vehicleTypes = new Set<string>();
    quotations.forEach((quotation) => {
      if (quotation?.quotation_rfq?.routes?.length > 0) {
        vehicleTypes.add(quotation?.quotation_rfq?.routes?.length.toString());
      }
    });
    return vehicleTypes.size;
  };

  const uniqueVehicleTypeCount =
    quotations !== null ? countUniqueVehicleTypes(quotations) : 0;
  const uniqueRoutesCount =
    quotations !== null ? countUniqueRoutes(quotations) : 0;

  return (
    <div className="flex gap-4 justify-between w-[100%]">
      <CardDetail
        title="จำนวนใบเสนอราคาทั้งหมด"
        value={(quotations?.length ?? 0).toString() + " ใบ"}
        iconName="QuotationCount"
      />
      <CardDetail
        title="เส้นทางทั้งหมด"
        value={uniqueRoutesCount.toString() + " เส้นทาง"}
        iconName="AllRoute"
      />
      <CardDetail
        title="ประเภทของรถ"
        value={`${uniqueVehicleTypeCount} ประเภท`}
        iconName="VehicleTypeCount"
      />
    </div>
  );
}
