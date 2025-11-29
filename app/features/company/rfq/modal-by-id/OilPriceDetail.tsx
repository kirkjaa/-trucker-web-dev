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
import { useRfqStore } from "@/app/store/rfq/rfqStore";
import { IRfqRoute } from "@/app/types/rfq/rfqType";
import formatDecimal from "@/app/utils/formatDecimal";

export default function OilPriceDetail() {
  // Global State
  const rfqReceivedById = useRfqStore((state) => state.rfqReceivedById);

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
  } = usePagination(rfqReceivedById?.routes ?? []);

  const computeOilData: Array<{ oilPrice: string }> = [
    {
      oilPrice: (rfqReceivedById?.fuel_price &&
        `${"<="} ${(rfqReceivedById?.fuel_price - 2 - 2 - 2 - 0.01).toFixed(2)}`) as string,
    },
    {
      oilPrice: (rfqReceivedById?.fuel_price &&
        `${(rfqReceivedById?.fuel_price - 2 - 2 - 2).toFixed(2) + " " + "-" + " " + (rfqReceivedById?.fuel_price - 2 - 2 - 0.01).toFixed(2)}`) as string,
    },
    {
      oilPrice: (rfqReceivedById?.fuel_price &&
        `${(rfqReceivedById?.fuel_price - 2 - 2).toFixed(2) + " " + "-" + " " + (rfqReceivedById?.fuel_price - 2 - 0.01).toFixed(2)}`) as string,
    },
    {
      oilPrice: (rfqReceivedById?.fuel_price &&
        `${(rfqReceivedById?.fuel_price - 2).toFixed(2) + " " + "-" + " " + (rfqReceivedById?.fuel_price - 0.01).toFixed(2)}`) as string,
    },
    {
      // index === 4
      oilPrice: (rfqReceivedById?.fuel_price &&
        `${rfqReceivedById?.fuel_price + " " + "-" + " " + (rfqReceivedById?.fuel_price + 2 - 0.01).toFixed(2)}`) as string,
    },
    {
      oilPrice: (rfqReceivedById?.fuel_price &&
        `${rfqReceivedById?.fuel_price + 2 + " " + "-" + " " + (rfqReceivedById?.fuel_price + 2 + 2 - 0.01)}`) as string,
    },
    {
      oilPrice: (rfqReceivedById?.fuel_price &&
        `${rfqReceivedById?.fuel_price + 2 + 2 + " " + "-" + " " + (rfqReceivedById?.fuel_price + 2 + 4 - 0.01)}`) as string,
    },
    {
      oilPrice: (rfqReceivedById?.fuel_price &&
        `${rfqReceivedById?.fuel_price + 2 + 4 + " " + "-" + " " + (rfqReceivedById?.fuel_price + 2 + 6 - 0.01)}`) as string,
    },
    {
      oilPrice: (rfqReceivedById?.fuel_price &&
        `${rfqReceivedById?.fuel_price + 2 + 6 + " " + "-" + " " + (rfqReceivedById?.fuel_price + 2 + 8 - 0.01)}`) as string,
    },
    {
      oilPrice: (rfqReceivedById?.fuel_price &&
        `${">="}  ${rfqReceivedById?.fuel_price + 2 + 8}`) as string,
    },
  ];

  const renderRouteDetails = () =>
    paginatedRows.map((route: IRfqRoute, index: number) => {
      return (
        <TableRow className="hover:border-none border-b" key={index}>
          <TableCell>{indexPaginate + index + 1}</TableCell>
          <TableCell>
            {`${route?.organization_route?.master_route?.origin_province?.name_th}/${route?.organization_route?.master_route?.origin_district?.name_th}` ||
              "-"}
          </TableCell>
          <TableCell>
            {`${route?.organization_route?.master_route?.destination_province?.name_th}/${route?.organization_route?.master_route?.destination_district?.name_th}` ||
              "-"}
          </TableCell>
          <TableCell className="text-center">
            {formatDecimal(
              (route?.base_price *
                (100 -
                  (rfqReceivedById?.price_changes_down ?? 0) -
                  (rfqReceivedById?.price_changes_down ?? 0) -
                  (rfqReceivedById?.price_changes_down ?? 0) -
                  (rfqReceivedById?.price_changes_down ?? 0))) /
                100
            )}
          </TableCell>
          <TableCell className="text-center">
            {formatDecimal(
              (route?.base_price *
                (100 -
                  (rfqReceivedById?.price_changes_down ?? 0) -
                  (rfqReceivedById?.price_changes_down ?? 0) -
                  (rfqReceivedById?.price_changes_down ?? 0))) /
                100
            )}
          </TableCell>
          <TableCell className="text-center">
            {formatDecimal(
              (route?.base_price *
                (100 -
                  (rfqReceivedById?.price_changes_down ?? 0) -
                  (rfqReceivedById?.price_changes_down ?? 0))) /
                100
            )}
          </TableCell>
          <TableCell className="text-center">
            {formatDecimal(
              (route?.base_price *
                (100 - (rfqReceivedById?.price_changes_down ?? 0))) /
                100
            )}
          </TableCell>
          <TableCell className="text-center bg-primary-blue-03 text-secondary-indigo-main">
            {formatDecimal(route?.base_price)}
          </TableCell>
          <TableCell className="text-center">
            {formatDecimal(
              (route?.base_price *
                (100 + (rfqReceivedById?.price_changes_down ?? 0))) /
                100
            )}
          </TableCell>
          <TableCell className="text-center">
            {formatDecimal(
              (route?.base_price *
                (100 +
                  (rfqReceivedById?.price_changes_down ?? 0) +
                  (rfqReceivedById?.price_changes_down ?? 0))) /
                100
            )}
          </TableCell>
          <TableCell className="text-center">
            {formatDecimal(
              (route?.base_price *
                (100 +
                  (rfqReceivedById?.price_changes_down ?? 0) +
                  (rfqReceivedById?.price_changes_down ?? 0) +
                  (rfqReceivedById?.price_changes_down ?? 0))) /
                100
            )}
          </TableCell>
          <TableCell className="text-center">
            {formatDecimal(
              (route?.base_price *
                (100 +
                  (rfqReceivedById?.price_changes_down ?? 0) +
                  (rfqReceivedById?.price_changes_down ?? 0) +
                  (rfqReceivedById?.price_changes_down ?? 0) +
                  (rfqReceivedById?.price_changes_down ?? 0))) /
                100
            )}
          </TableCell>
          <TableCell className="text-center">
            {formatDecimal(
              (route?.base_price *
                (100 +
                  (rfqReceivedById?.price_changes_down ?? 0) +
                  (rfqReceivedById?.price_changes_down ?? 0) +
                  (rfqReceivedById?.price_changes_down ?? 0) +
                  (rfqReceivedById?.price_changes_down ?? 0) +
                  (rfqReceivedById?.price_changes_down ?? 0))) /
                100
            )}
          </TableCell>
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
            rfqReceivedById?.truck_type?.name_th
              ? rfqReceivedById?.truck_type?.name_th
              : "-"
          }
        />
        <CardDetail
          iconName="OilPrice"
          title="ราคาน้ำมัน"
          value={
            rfqReceivedById?.fuel_price
              ? rfqReceivedById?.fuel_price.toString()
              : "-"
          }
          value2={" " + "บาท/ลิตร"}
        />

        <CardDetail
          iconName="OilUpPrice"
          title="ราคาผันขึ้น"
          value={
            rfqReceivedById?.price_changes_up
              ? rfqReceivedById?.price_changes_up + " " + "%"
              : "-"
          }
          iconName2="ChevronUpBulk"
          oilUp
        />
        <CardDetail
          iconName="OilDownPrice"
          title="ราคาผันลง"
          value={
            rfqReceivedById?.price_changes_up
              ? rfqReceivedById?.price_changes_up + " " + "%"
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
            {computeOilData.map((data, index) => (
              <TableHead
                key={index}
                className={clsx("text-center", {
                  "bg-secondary-indigo-main text-white": index === 4,
                })}
              >
                {data.oilPrice}
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
        <div className="flex gap-2">
          {/* {rfqById?.rfqReason.map((reason, index) => ( */}
          <p className="body2 text-neutral-07">
            {rfqReceivedById?.remark || "ไม่มีหมายเหตุเพิ่มเติม"}
          </p>
          {/* ))} */}
        </div>
      </div>
    </div>
  );
}
