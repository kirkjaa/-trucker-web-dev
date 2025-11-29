import { Detail } from "@/app/components/ui/featureComponents/DetailCard";
import { Icons } from "@/app/icons";
import { useQuotationStore } from "@/app/store/quotation/quotationStore";
import { formatISOToDate } from "@/app/utils/formatDate";
import { formatId } from "@/app/utils/formatId";

export default function ViewQuotationInfo() {
  // Global State
  const quotationById = useQuotationStore((state) => state.quotationById);

  return (
    <div className="mx-32 grid grid-cols-2 gap-6">
      <div className="grid grid-cols-2 bg-white border border-neutral-04 px-5 py-3 rounded-lg">
        <Detail
          title="รหัสใบเสนอราคา"
          value={
            quotationById?.display_code
              ? formatId(quotationById?.display_code)
              : "-"
          }
        />
        <Detail title="โซน" value="-" />
      </div>

      <div className="grid grid-cols-2 bg-white border border-neutral-04 px-5 py-3 rounded-lg">
        <Detail
          title="ประเภทรถ"
          value={
            quotationById?.quotation_rfq?.truck_type.name_th
              ? quotationById?.quotation_rfq?.truck_type.name_th
              : "-"
          }
        />
        <Detail
          title="จำนวนสถานที่"
          value={`${quotationById?.quotation_rfq?.routes.length} เส้นทาง`}
        />
      </div>

      <div className="grid grid-cols-2 bg-white border border-neutral-04 px-5 py-3 rounded-lg">
        <Detail
          title="ระยะเวลาสัญญา"
          value={`${quotationById?.quotation_rfq?.contract_date_start && formatISOToDate.toShortFormat(quotationById?.quotation_rfq?.contract_date_start)} - ${quotationById?.quotation_rfq?.contract_date_end && formatISOToDate.toShortFormat(quotationById?.quotation_rfq?.contract_date_end)}`}
        />
        <Detail
          title="อายุสัญญา"
          value={
            quotationById?.quotation_rfq?.contract_date_start &&
            quotationById?.quotation_rfq?.contract_date_end
              ? formatISOToDate.calculateDaysBetween(
                  quotationById?.quotation_rfq?.contract_date_start,
                  quotationById?.quotation_rfq?.contract_date_end
                )
              : "-"
          }
        />
      </div>

      <div className="grid grid-cols-3 bg-white border border-neutral-04 px-5 py-3 rounded-lg">
        <Detail
          title="ราคาน้ำมัน"
          value={
            quotationById?.quotation_rfq?.fuel_price
              ? quotationById?.quotation_rfq?.fuel_price
              : "-"
          }
          unit="บาท/ลิตร"
        />
        <Detail
          title="ราคาผันขึ้น"
          value={
            quotationById?.quotation_rfq?.price_changes_up
              ? quotationById?.quotation_rfq?.price_changes_up + " " + "%"
              : "-"
          }
          unit={
            <Icons name="ChevronUpBulk" className="w-6 h-6 text-success-01" />
          }
        />
        <Detail
          title="ราคาผันลง"
          value={
            quotationById?.quotation_rfq?.price_changes_down
              ? quotationById?.quotation_rfq?.price_changes_down + " " + "%"
              : "-"
          }
          unit={
            <Icons
              name="ChevronDownBulk"
              className="w-6 h-6 text-urgent-fail-02"
            />
          }
        />
      </div>

      <div className="grid grid-cols-2 bg-white border border-neutral-04 px-5 py-3 rounded-lg">
        <Detail
          title="แรงงานเพิ่มเติม"
          value={quotationById?.quotation_rfq?.assistant || "-"}
          unit="คน"
        />
        <Detail
          title="ค่าแรง"
          value={quotationById?.quotation_rfq?.assistant_price || "-"}
          unit="บาท/คน"
        />
      </div>

      <div className="flex flex-col gap-1 bg-white border border-neutral-04 px-5 py-3 rounded-lg">
        <p className="font-semibold text-secondary-indigo-04">หมายเหตุสินค้า</p>
        <div className="flex gap-2">
          {/* {quotationById?.rfqData?.rfqReason.map((reason, index) => ( */}
          <p className="font-normal text-secondary-dark-gray-04">
            {`${
              quotationById?.quotation_rfq?.remark
                ? `${quotationById?.quotation_rfq?.remark}`
                : "-"
            }` +
              `${
                quotationById?.offer?.remark
                  ? `, ${quotationById?.offer?.remark}`
                  : ""
              }`}
          </p>
          {/* ))} */}
        </div>
      </div>
    </div>
  );
}
