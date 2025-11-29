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
import { useQuotationStore } from "@/app/store/quotation/quotationStore";
import { IRouteQuotationOffer } from "@/app/types/offer/offerType";
import formatDecimal from "@/app/utils/formatDecimal";

export default function OilPriceDetail() {
  // Global State
  const quotationById = useQuotationStore((state) => state.quotationById);

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
  } = usePagination(quotationById?.offer.routes ?? []);

  const renderTableRows = () => {
    return (
      <>
        {paginatedRows?.map((route: IRouteQuotationOffer, index: number) => {
          return (
            <TableRow key={index} className="hover:border-none border-b">
              <TableCell className="w-[1%]">
                {indexPaginate + index + 1}
              </TableCell>
              <TableCell className="w-[14%]">{`${route?.organization_route?.master_route?.origin_province?.name_th}/${route?.organization_route?.master_route?.origin_district?.name_th}`}</TableCell>
              <TableCell className="w-[14%]">{`${route?.organization_route?.master_route?.destination_province?.name_th}/${route?.organization_route?.master_route?.destination_district?.name_th}`}</TableCell>
              {route.offer_routes.map((r) => (
                <TableCell
                  key={r.sequence}
                  className={clsx("text-center", {
                    "bg-primary-blue-03 text-secondary-indigo-main":
                      r.is_base_price === "Y",
                  })}
                >
                  {formatDecimal(r.price)}
                </TableCell>
              ))}
            </TableRow>
          );
        })}
      </>
    );
  };

  return (
    <div className="px-5 flex flex-col gap-4">
      <div className="flex gap-4 justify-between w-[100%]">
        <CardDetail
          iconName="TruckType"
          title="ประเภทของรถ"
          value={
            quotationById?.quotation_rfq?.truck_type?.name_th
              ? quotationById?.quotation_rfq?.truck_type?.name_th
              : "-"
          }
        />
        <CardDetail
          iconName="OilPrice"
          title="ราคาน้ำมัน"
          value={
            quotationById?.quotation_rfq?.fuel_price
              ? quotationById?.quotation_rfq?.fuel_price.toString()
              : "-"
          }
          value2={" " + "บาท/ลิตร"}
        />

        <CardDetail
          iconName="OilUpPrice"
          title="ราคาผันขึ้น"
          value={
            quotationById?.quotation_rfq?.price_changes_up
              ? quotationById?.quotation_rfq?.price_changes_up + " " + "%"
              : "-"
          }
          iconName2="ChevronUpBulk"
          oilUp
        />
        <CardDetail
          iconName="OilDownPrice"
          title="ราคาผันลง"
          value={
            quotationById?.quotation_rfq?.price_changes_down
              ? quotationById?.quotation_rfq?.price_changes_down + " " + "%"
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

            {quotationById?.offer.price_columns?.map((col) => (
              <TableHead
                className={clsx("text-base font-bold text-center", {
                  "text-white bg-secondary-indigo-main": col.sequence === 5,
                })}
                key={col.sequence}
              >
                {col.range}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>{renderTableRows()}</TableBody>
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
        <div className="flex gap-2">
          {/* {quotationById?.rfqData?.rfqReason.map((reason, index) => (
            <p className="body2 text-neutral-07" key={index}>
              {reason}
            </p>
          ))} */}
          <p className="body2 text-neutral-07">
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
        </div>
      </div>
    </div>
  );
}
