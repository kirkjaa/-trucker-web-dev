import ModalBidPrice from "./ModalBidPrice";

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
import { Icons } from "@/app/icons";
import { useRfqStore } from "@/app/store/rfq/rfqStore";
import { IPriceOffer } from "@/app/types/offer/offerType";
import { IRfqRoute } from "@/app/types/rfq/rfqType";

interface OfferListProps {
  priceOffers: IPriceOffer[];
  setPriceOffers: React.Dispatch<React.SetStateAction<IPriceOffer[]>>;
  handleClickBidPrice: (index: number) => void;
  isBidPriceModalOpen: boolean;
  setIsBidPriceModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedBidPriceIndex: number;
}

export default function OfferList({
  priceOffers,
  setPriceOffers,
  handleClickBidPrice,
  isBidPriceModalOpen,
  setIsBidPriceModalOpen,
  selectedBidPriceIndex,
}: OfferListProps) {
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

  // Render Table Row
  const renderTableRows = () => {
    return (
      <>
        {paginatedRows?.map((route: IRfqRoute, index: number) => {
          const price = priceOffers
            .find(
              (o) => o.organization_route_id === route.organization_route.id
            )
            ?.offers.find((of) => of.is_base_price)?.price;

          return (
            <TableRow className="text-neutral-08" key={index}>
              <TableCell className="w-[4%]">
                {indexPaginate + index + 1}
              </TableCell>
              <TableCell className="w-[20%]">{`${route.organization_route.master_route.origin_province.name_th}/${route.organization_route.master_route.origin_district.name_th}`}</TableCell>
              <TableCell className="w-[20%]">{`${route.organization_route.master_route.destination_province.name_th}/${route.organization_route.master_route.destination_district.name_th}`}</TableCell>
              <TableCell className="w-[12%]">
                {route.organization_route.distance_value}
              </TableCell>
              <TableCell className="w-[18%] text-end">
                {route.base_price}
              </TableCell>
              <TableCell className="w-[14%] bg-primary-blue-03 text-end">
                {price}
              </TableCell>
              <TableCell
                className="w-[12%] text-end flex gap-2 items-center cursor-pointer"
                onClick={() => handleClickBidPrice(indexPaginate + index)}
              >
                <Icons name="DocumentLight" className="w-6 h-6" />
                <p>เสนอราคา</p>
              </TableCell>
            </TableRow>
          );
        })}
      </>
    );
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        <Table className="w-[100%]">
          <TableHeader>
            <TableRowHead className="bg-neutral-01">
              <TableHead className="w-[4%]">#</TableHead>
              <TableHead className="w-[20%]">ต้นทาง</TableHead>
              <TableHead className="w-[20%]">ปลายทาง</TableHead>
              <TableHead className="w-[12%] flex gap-2">
                <p>ระยะทาง</p>
                <p className="text-neutral-06">(กม.)</p>
              </TableHead>
              <TableHead className="w-[18%] text-end flex gap-2">
                <p>ราคาโรงงานเสนอ</p>
                <p className="text-neutral-06">(บาท)</p>
              </TableHead>
              {/* // TODO: If have bid > 0 map Name and Price */}
              {/* <TableHead className="w-[12%] text-end">โรงงาน 1</TableHead>
              <TableHead className="w-[12%] text-end">โรงงาน 2</TableHead>
              <TableHead className="w-[12%] text-end">โรงงาน 3</TableHead> */}
              <TableHead className="w-[14%] bg-secondary-indigo-main text-white text-end">
                ราคาเสนอ (บาท)
              </TableHead>
              <TableHead className="w-[12%]"></TableHead>
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

      {/* Modal Bid Price */}
      <ModalBidPrice
        setPriceOffers={setPriceOffers}
        isBidPriceModalOpen={isBidPriceModalOpen}
        setIsBidPriceModalOpen={setIsBidPriceModalOpen}
        selectedBidPriceIndex={selectedBidPriceIndex}
      />
    </>
  );
}
