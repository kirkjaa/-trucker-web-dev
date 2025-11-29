import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableRowHead,
} from "@/app/components/ui/data-table";
import { ControlledPaginate } from "@/app/components/ui/pagination/ControlledPagination";
import usePagination from "@/app/hooks/usePagination";
import { useOfferStore } from "@/app/store/offer/offerStore";
import { IOfferRoute } from "@/app/types/offer/offerType";

export default function ExpandedTable() {
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

  return (
    <>
      <Table className="max-w-full">
        <TableHeader>
          <TableRowHead className="bg-modal-01 text-main-01 font-medium">
            <TableHead className="w-[1%]">#</TableHead>
            <TableHead className="w-[17%]">ต้นทาง</TableHead>
            <TableHead className="w-[17%]">ปลายทาง</TableHead>
            <TableHead className="w-[12%]">ระยะทาง</TableHead>
            <TableHead className="w-[16%] text-end">ราคา</TableHead>
          </TableRowHead>
        </TableHeader>
        <TableBody>
          {paginatedRows.map((route: IOfferRoute, routeIndex: number) => (
            <TableRow
              key={routeIndex}
              className="hover:border-none text-base font-normal text-neutral-08"
            >
              <TableCell className="w-[1%]">
                {indexPaginate + routeIndex + 1}
              </TableCell>
              <TableCell className="w-[17%]">
                {`${route?.master_route?.origin_province?.name_th}/${route?.master_route?.origin_district?.name_th}`}
              </TableCell>
              <TableCell className="w-[17%]">
                {`${route?.master_route?.destination_province?.name_th}/${route?.master_route?.destination_district?.name_th}`}
              </TableCell>
              <TableCell className="w-[12%]">
                {route?.distance_value ?? 0 + " " + route?.distance_unit}
              </TableCell>
              <TableCell className="w-[16%] text-end text-main-01 font-bold">
                {
                  route?.offer_routes.find(
                    (route) => route.is_base_price === "Y"
                  )?.price
                }{" "}
                <span className="text-neutral-08 font-normal">
                  {route?.unit_price_route?.name_th}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <ControlledPaginate
        configPagination={{
          page,
          limit,
          totalPages,
          total,
        }}
        setPage={setPage}
        setLimit={setLimit}
        className="bg-white rounded-lg px-4 py-2 shadow-table"
      />
    </>
  );
}
