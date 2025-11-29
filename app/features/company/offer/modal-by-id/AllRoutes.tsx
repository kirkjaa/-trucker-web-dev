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
import { useOfferStore } from "@/app/store/offer/offerStore";
import { IOfferRoute } from "@/app/types/offer/offerType";

export default function AllRoutes() {
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

  // Render Table Row
  const renderTableRows = () => {
    return (
      <>
        {paginatedRows?.map((route: IOfferRoute, index: number) => (
          <TableRow key={index} className="hover:border-none">
            <TableCell className="w-[1%]">
              {indexPaginate + index + 1}
            </TableCell>
            <TableCell className="w-[14%]">{`${route?.master_route.origin_province.name_th}/${route?.master_route.origin_district.name_th}`}</TableCell>
            <TableCell className="w-[14%]">{`${route?.master_route.destination_province.name_th}/${route?.master_route.destination_district.name_th}`}</TableCell>
            <TableCell className="w-[14%]">{route?.distance_value}</TableCell>
            <TableCell className="w-[10%] text-end bg-primary-blue-03">
              {route?.offer_routes.find(
                (routeOffer) => routeOffer.is_base_price === "Y"
              )?.price ?? "-"}
            </TableCell>
          </TableRow>
        ))}
      </>
    );
  };

  return (
    <div className="w-full flex flex-col gap-4 px-5">
      <div className="w-[20%]">
        <CardDetail
          iconName="TruckType"
          title="ประเภทของรถ"
          value={
            offerById?.rfq?.truck_type?.name_th
              ? offerById?.rfq?.truck_type?.name_th
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
