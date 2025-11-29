import clsx from "clsx";

import { CardDetail } from "@/app/components/ui/featureComponents/CardDetail";
import { ControlledPaginate } from "@/app/components/ui/pagination/ControlledPagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import usePagination from "@/app/hooks/usePagination";
import { useOfferStore } from "@/app/store/offer/offerStore";
import { IOfferRoute } from "@/app/types/offer/offerType";
import formatDecimal from "@/app/utils/formatDecimal";

export default function OilPriceDetail() {
  // Global State
  const offerById = useOfferStore((state) => state.offerById);

  // Hook
  const {
    page,
    setPage,
    limit,
    setLimit,
    total,
    totalPages,
    paginatedRows,
    indexPaginate,
  } = usePagination(offerById?.routes ?? []);

  const renderRouteDetails = () =>
    paginatedRows.map((route: IOfferRoute, index: number) => {
      return (
        <TableRow className="hover:border-none border-b" key={index}>
          <TableCell>{indexPaginate + index + 1}</TableCell>
          <TableCell>
            {`${route?.master_route?.origin_province?.name_th}/${route?.master_route?.origin_district?.name_th}` ||
              "-"}
          </TableCell>
          <TableCell>
            {`${route?.master_route?.destination_province?.name_th}/${route?.master_route?.destination_district?.name_th}` ||
              "-"}
          </TableCell>
          {route?.offer_routes.map((offerRoute) => (
            <TableCell
              key={offerRoute?.sequence}
              className={clsx("text-center", {
                "bg-primary-blue-03 text-secondary-indigo-main":
                  offerRoute.sequence === 5,
              })}
            >
              {formatDecimal(offerRoute?.price)}
            </TableCell>
          ))}
        </TableRow>
      );
    });

  return (
    <div className="px-5 flex flex-col gap-4">
      <div className="flex gap-4 justify-between w-[100%]">
        <CardDetail
          iconName="TruckType"
          title="ประเภทของรถ"
          value={
            offerById?.rfq?.truck_type?.name_th
              ? offerById?.rfq?.truck_type?.name_th
              : "-"
          }
        />
        <CardDetail
          iconName="OilPrice"
          title="ราคาน้ำมัน"
          value={
            offerById?.rfq?.fuel_price
              ? offerById?.rfq?.fuel_price.toString()
              : "-"
          }
          value2={" " + "บาท/ลิตร"}
        />

        <CardDetail
          iconName="OilUpPrice"
          title="ราคาผันขึ้น"
          value={
            offerById?.rfq?.price_changes_up
              ? offerById?.rfq?.price_changes_up + " " + "%"
              : "-"
          }
          iconName2="ChevronUpBulk"
          oilUp
        />
        <CardDetail
          iconName="OilDownPrice"
          title="ราคาผันลง"
          value={
            offerById?.rfq?.price_changes_down
              ? offerById?.rfq?.price_changes_down + " " + "%"
              : "-"
          }
          iconName2="ChevronDownBulk"
          oilDown
        />
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow className="bg-modal-01 text-main-01">
            <TableHead>#</TableHead>
            <TableHead>ต้นทาง</TableHead>
            <TableHead>ปลายทาง</TableHead>
            {offerById?.price_columns?.map((col) => (
              <TableHead
                className={clsx("text-base font-bold text-center", {
                  "text-white bg-secondary-indigo-main": col.sequence === 5,
                })}
                key={col.id}
              >
                {col.range}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>{renderRouteDetails()}</TableBody>
      </Table>

      <ControlledPaginate
        configPagination={{
          page,
          limit,
          totalPages,
          total,
        }}
        setPage={(page) => setPage(page)}
        setLimit={(limit) => {
          setLimit(limit);
          setPage(1);
        }}
        className="bg-white rounded-lg px-4 py-2 shadow-table"
      />

      <div className="flex gap-4">
        <p className="text-base font-semibold text-secondary-indigo-main">
          หมายเหตุเพิ่มเติม :
        </p>
        {/* <div className="flex gap-2">
          {bidById?.rfqData?.rfqReason.map((reason, index) => (
            <p className="body2 text-neutral-07" key={index}>
              {reason}
            </p>
          ))}
        </div> */}
        <p className="body2 text-neutral-07">
          {offerById?.remark || "ไม่มีหมายเหตุเพิ่มเติม"}
        </p>
      </div>
    </div>
  );
}
