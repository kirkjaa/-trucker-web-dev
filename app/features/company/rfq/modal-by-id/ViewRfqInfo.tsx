"use client";

import { Detail } from "@/app/components/ui/featureComponents/DetailCard";
import { Icons } from "@/app/icons";
import { useRfqStore } from "@/app/store/rfq/rfqStore";
import { formatISOToDate } from "@/app/utils/formatDate";
import formatDecimal from "@/app/utils/formatDecimal";
import { formatId } from "@/app/utils/formatId";

export default function ViewRfqInfo() {
  // Global State
  const rfqReceivedById = useRfqStore((state) => state.rfqReceivedById);

  return (
    <div className="mx-32 grid grid-cols-2 gap-6">
      <div className="grid grid-cols-2 bg-white border border-neutral-04 px-5 py-3 rounded-lg">
        <Detail
          title="รหัสใบเสนอราคา"
          value={
            rfqReceivedById?.display_code
              ? formatId(rfqReceivedById.display_code)
              : "-"
          }
        />
        {/* <Detail title="โซน" value="-" /> */}
      </div>

      <div className="grid grid-cols-2 bg-white border border-neutral-04 px-5 py-3 rounded-lg">
        <Detail
          title="ประเภทรถ"
          value={
            rfqReceivedById?.truck_type.name_th
              ? rfqReceivedById?.truck_type.name_th
              : "-"
          }
        />
        <Detail
          title="จำนวนสถานที่"
          value={`${rfqReceivedById?.routes.length} เส้นทาง`}
        />
      </div>

      <div className="grid grid-cols-2 bg-white border border-neutral-04 px-5 py-3 rounded-lg">
        <Detail
          title="ระยะเวลาสัญญา"
          value={`${rfqReceivedById?.contract_date_start && formatISOToDate.toShortFormat(rfqReceivedById?.contract_date_start)} - ${rfqReceivedById?.contract_date_end && formatISOToDate.toShortFormat(rfqReceivedById?.contract_date_end)}`}
        />
        <Detail
          title="อายุสัญญา"
          value={
            (rfqReceivedById?.contract_date_start &&
              rfqReceivedById?.contract_date_end &&
              formatISOToDate.calculateDaysBetween(
                rfqReceivedById?.contract_date_start,
                rfqReceivedById?.contract_date_end
              )) ||
            "-"
          }
        />
      </div>

      <div className="grid grid-cols-3 gap-x-8 bg-white border border-neutral-04 px-5 py-3 rounded-lg">
        <Detail
          title="ราคาน้ำมัน"
          value={
            rfqReceivedById?.fuel_price
              ? formatDecimal(rfqReceivedById?.fuel_price)
              : "-"
          }
          unit="บาท/ลิตร"
        />
        <Detail
          title="ราคาผันขึ้น"
          value={
            rfqReceivedById?.price_changes_up
              ? formatDecimal(rfqReceivedById?.price_changes_up) + " " + "%"
              : "-"
          }
          unit={
            <Icons name="ChevronUpBulk" className="w-6 h-6 text-success-01" />
          }
        />
        <Detail
          title="ราคาผันลง"
          value={
            rfqReceivedById?.price_changes_down
              ? formatDecimal(rfqReceivedById?.price_changes_down) + " " + "%"
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
          value={rfqReceivedById?.assistant || "-"}
          unit="คน"
        />
        <Detail
          title="ค่าแรง"
          value={formatDecimal(rfqReceivedById?.assistant_price) || "-"}
          unit="บาท/คน"
        />
      </div>

      <div className="flex flex-col gap-1 bg-white border border-neutral-04 px-5 py-3 rounded-lg">
        <p className="font-semibold text-secondary-indigo-04">หมายเหตุสินค้า</p>
        <div className="flex gap-2">
          {/* {rfqById?.remark && rfqById?.remark?.length > 0 */}
          {/*   ? rfqById.rfqReason.map((reason, index) => ( */}
          <p
            className="font-normal text-secondary-dark-gray-04"
            /* key={index} */
          >
            {rfqReceivedById?.remark || "ไม่มีหมายเหตุเพิ่มเติม"}
          </p>
          {/*   )) */}
          {/* : "-"} */}
        </div>
      </div>
    </div>
  );
}
