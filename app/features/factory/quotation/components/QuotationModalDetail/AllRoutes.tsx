import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableRowHead,
} from "@/app/components/ui/data-table";
import { CardDetail } from "@/app/components/ui/featureComponents/CardDetail";
import { ControlledPaginate } from "@/app/components/ui/pagination/ControlledPagination";
import usePagination from "@/app/hooks/usePagination";
import { useQuotationStore } from "@/app/store/quotation/quotationStore";
import { IRouteQuotationOffer } from "@/app/types/offer/offerType";

export default function AllRoutes() {
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

  // Render Table Row
  const renderTableRows = () => {
    return (
      <>
        {paginatedRows?.map((route: IRouteQuotationOffer, index: number) => {
          const r = route.offer_routes.find(
            (item) => item.is_base_price === "Y"
          );

          return (
            <TableRow key={index} className="hover:border-none">
              <TableCell className="w-[1%]">
                {indexPaginate + index + 1}
              </TableCell>
              <TableCell className="w-[14%]">{`${route?.organization_route?.master_route?.origin_province?.name_th}/${route?.organization_route?.master_route?.origin_district?.name_th}`}</TableCell>
              <TableCell className="w-[14%]">{`${route?.organization_route?.master_route?.destination_province?.name_th}/${route?.organization_route?.master_route?.destination_district?.name_th}`}</TableCell>
              <TableCell className="w-[14%]">
                {route?.organization_route?.distance_value}
              </TableCell>
              <TableCell className="w-[10%] text-end bg-primary-blue-03">
                {r?.price}
              </TableCell>
            </TableRow>
          );
        })}
      </>
    );
  };

  return (
    <div className="w-full flex flex-col gap-2 px-5">
      <div className="w-[20%]">
        <CardDetail
          iconName="TruckType"
          title="ประเภทของรถ"
          value={
            quotationById?.quotation_rfq?.truck_type.name_th
              ? quotationById?.quotation_rfq?.truck_type.name_th
              : "-"
          }
        />
      </div>

      <Table>
        <TableHeader>
          <TableRowHead className="bg-modal-01 text-main-01 text-base font-medium">
            <TableHead className="w-[1%]">#</TableHead>
            <TableHead className="w-[14%]">ต้นทาง</TableHead>
            <TableHead className="w-[14%]">ปลายทาง</TableHead>
            <TableHead className="w-[14%]">
              ระยะทาง <span className="text-neutral-06">(กม.)</span>
            </TableHead>
            <TableHead className="w-[10%] text-end text-white bg-secondary-indigo-main rounded-r-lg">
              ราคาเสนอ
            </TableHead>
          </TableRowHead>
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
        className="bg-white rounded-lg p-4 shadow-table"
      />
    </div>
  );
}
