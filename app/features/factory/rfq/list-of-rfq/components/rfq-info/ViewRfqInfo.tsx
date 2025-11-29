"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { Detail } from "@/app/components/ui/featureComponents/DetailCard";
import { Icons } from "@/app/icons";
import { rfqApi } from "@/app/services/rfq/rfqApi";
import { EFacPathName, EHttpStatusCode } from "@/app/types/enum";
import { IRfqById } from "@/app/types/rfq/rfqType";
import { formatISOToDate } from "@/app/utils/formatDate";
import formatDecimal from "@/app/utils/formatDecimal";
import { formatId } from "@/app/utils/formatId";

export default function ViewRfqInfo() {
  // Local State
  const [rfqById, setRfqById] = useState<IRfqById>();

  // Hook
  const { rfqId } = useParams();
  const router = useRouter();

  // Use Effect
  useEffect(() => {
    if (rfqId) {
      const fetchDataById = async () => {
        const response = await rfqApi.getRfqById(Number(rfqId));
        if (response.statusCode === EHttpStatusCode.SUCCESS) {
          setRfqById(response.data);
        } else {
          router.replace(EFacPathName.RFQLIST);
        }
      };

      fetchDataById();
    }
  }, [rfqId]);

  return (
    <div className="mx-32 grid grid-cols-2 gap-6">
      <div className="grid grid-cols-2 bg-white border border-neutral-04 px-5 py-3 rounded-lg">
        <Detail
          title="รหัสใบเสนอราคา"
          value={rfqById?.display_code ? formatId(rfqById.display_code) : "-"}
        />
        {/* <Detail title="โซน" value="-" /> */}
      </div>

      <div className="grid grid-cols-2 bg-white border border-neutral-04 px-5 py-3 rounded-lg">
        <Detail
          title="ประเภทรถ"
          value={
            rfqById?.truck_type.name_th ? rfqById?.truck_type.name_th : "-"
          }
        />
        <Detail
          title="จำนวนสถานที่"
          value={`${rfqById?.routes.length} เส้นทาง`}
        />
      </div>

      <div className="grid grid-cols-2 bg-white border border-neutral-04 px-5 py-3 rounded-lg">
        <Detail
          title="ระยะเวลาสัญญา"
          value={`${rfqById?.contract_date_start && formatISOToDate.toShortFormat(rfqById?.contract_date_start)} - ${rfqById?.contract_date_end && formatISOToDate.toShortFormat(rfqById?.contract_date_end)}`}
        />
        <Detail
          title="อายุสัญญา"
          value={
            (rfqById?.contract_date_start &&
              rfqById?.contract_date_end &&
              formatISOToDate.calculateDaysBetween(
                rfqById?.contract_date_start,
                rfqById?.contract_date_end
              )) ||
            "-"
          }
        />
      </div>

      <div className="grid grid-cols-3 gap-x-8 bg-white border border-neutral-04 px-5 py-3 rounded-lg">
        <Detail
          title="ราคาน้ำมัน"
          value={rfqById?.fuel_price ? formatDecimal(rfqById?.fuel_price) : "-"}
          unit="บาท/ลิตร"
        />
        <Detail
          title="ราคาผันขึ้น"
          value={
            rfqById?.price_changes_up
              ? formatDecimal(rfqById?.price_changes_up) + " " + "%"
              : "-"
          }
          unit={
            <Icons name="ChevronUpBulk" className="w-6 h-6 text-success-01" />
          }
        />
        <Detail
          title="ราคาผันลง"
          value={
            rfqById?.price_changes_down
              ? formatDecimal(rfqById?.price_changes_down) + " " + "%"
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
          value={rfqById?.assistant || "-"}
          unit="คน"
        />
        <Detail
          title="ค่าแรง"
          value={formatDecimal(rfqById?.assistant_price) || "-"}
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
            {rfqById?.remark || "ไม่มีหมายเหตุเพิ่มเติม"}
          </p>
          {/*   )) */}
          {/* : "-"} */}
        </div>
      </div>
    </div>
  );
}
