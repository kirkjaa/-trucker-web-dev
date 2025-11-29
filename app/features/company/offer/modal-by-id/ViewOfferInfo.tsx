import { Detail } from "@/app/components/ui/featureComponents/DetailCard";
import { Icons } from "@/app/icons";
import { useOfferStore } from "@/app/store/offer/offerStore";
import { formatISOToDate } from "@/app/utils/formatDate";
import { formatId } from "@/app/utils/formatId";

export default function ViewOfferInfo() {
  // Global State
  const offerById = useOfferStore((state) => state.offerById);

  return (
    <div className="mx-32 grid grid-cols-2 gap-6">
      <div className="grid grid-cols-2 bg-white border border-neutral-04 px-5 py-3 rounded-lg">
        <Detail
          title="รหัสใบเสนอราคา"
          value={
            offerById?.display_code ? formatId(offerById.display_code) : "-"
          }
        />
        <Detail title="โซน" value="-" />
      </div>

      <div className="grid grid-cols-2 bg-white border border-neutral-04 px-5 py-3 rounded-lg">
        <Detail
          title="ประเภทรถ"
          value={
            offerById?.rfq?.truck_type.name_th
              ? offerById?.rfq?.truck_type.name_th
              : "-"
          }
        />
        <Detail
          title="จำนวนสถานที่"
          value={`${offerById?.routes.length} เส้นทาง`}
        />
      </div>

      <div className="grid grid-cols-2 bg-white border border-neutral-04 px-5 py-3 rounded-lg">
        <Detail
          title="ระยะเวลาสัญญา"
          value={`${offerById?.rfq?.contract_date_start && formatISOToDate.toShortFormat(offerById?.rfq?.contract_date_start)} - ${offerById?.rfq?.contract_date_end && formatISOToDate.toShortFormat(offerById?.rfq?.contract_date_end)}`}
        />
        <Detail
          title="อายุสัญญา"
          value={
            (offerById?.rfq?.contract_date_start &&
              offerById?.rfq?.contract_date_end &&
              formatISOToDate.calculateDaysBetween(
                offerById?.rfq?.contract_date_start,
                offerById?.rfq?.contract_date_end
              )) ||
            "-"
          }
        />
      </div>

      <div className="grid grid-cols-3 bg-white border border-neutral-04 px-5 py-3 rounded-lg">
        <Detail
          title="ราคาน้ำมัน"
          value={offerById?.rfq?.fuel_price ? offerById?.rfq?.fuel_price : "-"}
          unit="บาท/ลิตร"
        />
        <Detail
          title="ราคาผันขึ้น"
          value={
            offerById?.rfq?.price_changes_up
              ? offerById?.rfq?.price_changes_up + " " + "%"
              : "-"
          }
          unit={
            <Icons name="ChevronUpBulk" className="w-6 h-6 text-success-01" />
          }
        />
        <Detail
          title="ราคาผันลง"
          value={
            offerById?.rfq?.price_changes_down
              ? offerById?.rfq?.price_changes_down + " " + "%"
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
          value={offerById?.rfq?.assistant || "-"}
          unit="คน"
        />
        <Detail
          title="ค่าแรง"
          value={offerById?.rfq?.assistant_price || "-"}
          unit="บาท/คน"
        />
      </div>

      <div className="flex flex-col gap-1 bg-white border border-neutral-04 px-5 py-3 rounded-lg">
        <p className="font-semibold text-secondary-indigo-04">หมายเหตุสินค้า</p>
        <div className="flex gap-2">
          {/* {bidById?.rfqData?.rfqReason.map((reason, index) => ( */}
          <p className="font-normal text-secondary-dark-gray-04">
            {offerById?.remark || "ไม่มีหมายเหตุเพิ่มเติม"}
          </p>
          {/* ))} */}
        </div>
      </div>
    </div>
  );
}
