"use client";

import clsx from "clsx";

import useAllOffers from "./hooks/useAllOffers";
import useOfferListTable from "./hooks/useOfferListTable";
import ModalOfferDetailById from "./modal-by-id/ModalOfferDetailById";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableRowHead,
} from "@/app/components/ui/data-table";
import ModalNotification from "@/app/components/ui/ModalNotification";
import { ControlledPaginate } from "@/app/components/ui/pagination/ControlledPagination";
import { Icons } from "@/app/icons";
import { useOfferStore } from "@/app/store/offer/offerStore";
import { EOfferStatus } from "@/app/types/offer/offerEnum";
import { ERfqType } from "@/app/types/rfq/rfqEnum";
import { formatId } from "@/app/utils/formatId";

export default function OfferListTable() {
  // Global State
  const { offers, getOfferParams } = useOfferStore((state) => ({
    offers: state.offers,
    getOfferParams: state.getOfferParams,
  }));

  // Hook
  const { setPage, setLimit } = useAllOffers();
  const {
    headerList,
    handleSort,
    offerId,
    displayCode,
    isCanceledBidModalOpen,
    setIsCanceledBidModalOpen,
    isModalDetailOpen,
    setIsModalDetailOpen,
    handleClickViewIcon,
    handleClickPenIcon,
    handleClickCanceledBid,
    handleClickConfirmCanceledBid,
  } = useOfferListTable();

  // Render Table Row
  const renderTableRows = () => {
    if (!offers) return null;

    /* const rowsToFill = getBidsParams().limit - sortedDataForAllBid.length; */

    return offers && offers.length > 0 ? (
      <>
        {offers.map((data) => {
          return (
            <TableRow key={data.id}>
              <TableCell className="w-[12%] text-sm">
                {formatId(data.display_code)}
              </TableCell>
              <TableCell className="w-[12%] text-sm">
                {data?.rfq?.organization?.name}
              </TableCell>
              <TableCell className="w-[14%] text-sm">
                {data?.rfq?.type === ERfqType.ONEWAY
                  ? "ส่งเที่ยวเดียว"
                  : data?.rfq?.type === ERfqType.MULTIPLE
                    ? "ส่งหลายที่"
                    : "ส่งต่างประเทศ"}
              </TableCell>
              <TableCell className="w-[12%] text-sm">
                {data?.rfq?.truck_size?.name_th
                  ? data?.rfq?.truck_size?.name_th
                  : "-"}
              </TableCell>
              <TableCell className="w-[12%] text-sm">
                {data?.rfq?.routes.length > 1
                  ? `${data?.rfq?.routes.length} เส้นทาง`
                  : `${data?.rfq?.routes?.[0]?.organization_route.master_route.origin_province.name_th}/${data?.rfq?.routes?.[0]?.organization_route.master_route.origin_district.name_th}`}
              </TableCell>
              <TableCell className="w-[12%] text-sm">
                {data?.rfq?.routes.length > 1
                  ? `${data?.rfq?.routes.length} เส้นทาง`
                  : `${data?.rfq?.routes?.[0]?.organization_route.master_route.destination_province.name_th}/${data?.rfq?.routes?.[0]?.organization_route.master_route.destination_district.name_th}`}
              </TableCell>
              <TableCell className="w-[10%] text-sm">
                {data?.rfq?.routes.length > 1
                  ? "ราคาตามเส้นทาง"
                  : data?.rfq?.routes?.[0].base_price}
              </TableCell>
              <TableCell className="w-[12%] text-sm">
                <p
                  className={clsx("body2 px-4 py-1 w-fit rounded-3xl", {
                    "text-urgent-fail-02 bg-toast-error-background":
                      data?.status === EOfferStatus.CANCELED,
                    "text-neutral-07 bg-neutral-03":
                      data?.status === EOfferStatus.REJECTED,
                    "text-process-02 bg-toast-warning-background":
                      data?.status === EOfferStatus.OFFER,
                  })}
                >
                  {data?.status === EOfferStatus.CANCELED
                    ? "• ยกเลิก"
                    : data?.status === EOfferStatus.REJECTED
                      ? "• ปฏิเสธ"
                      : "• รอตอบรับ"}
                </p>
              </TableCell>
              <TableCell className="w-[10%] flex items-center gap-2">
                <Icons
                  name="ShowPassword"
                  className="w-6 h-6 cursor-pointer"
                  onClick={() => handleClickViewIcon(data.id)}
                />

                {data.status === EOfferStatus.OFFER && (
                  <>
                    <Icons
                      name="Pen"
                      className="w-6 h-6 cursor-pointer"
                      onClick={() => handleClickPenIcon(data.id)}
                    />
                    <Icons
                      name="PaperFailLight"
                      className="w-6 h-6 cursor-pointer"
                      onClick={() =>
                        handleClickCanceledBid(data.id, data.display_code)
                      }
                    />
                  </>
                )}
              </TableCell>
            </TableRow>
          );
        })}
        {/* Render empty rows to fill the table */}
        {/* {Array.from({ length: rowsToFill }, (_, index) => ( */}
        {/*   <TableRow key={`empty-${index}`} className="hover:border-none"> */}
        {/*     <TableCell colSpan={7} className="h-[2.6rem]"> */}
        {/*       &nbsp; */}
        {/*     </TableCell> */}
        {/*   </TableRow> */}
        {/* ))} */}
      </>
    ) : (
      <TableRow className="hover:border-none flex justify-center items-center">
        <TableCell
          colSpan={8}
          className={clsx("py-40 font-semibold text-secondary-200", {
            "py-80": getOfferParams().limit === 10,
          })}
        >
          <h4 className="h-10">No data found</h4>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <>
      <div className="flex flex-col gap-2 w-full">
        {/* Table */}
        <Table>
          <TableHeader>
            <TableRowHead>
              {headerList.map(({ key, label, sortable = true, width }) => (
                <TableHead
                  key={key}
                  className={`w-[${width}] text-sm flex items-center gap-1`}
                >
                  {label}
                  {sortable && key && (
                    <Icons
                      name="Swap"
                      className={clsx("w-4 h-4", {
                        "cursor-pointer": sortable,
                      })}
                      onClick={() => sortable && key && handleSort(key)}
                    />
                  )}
                </TableHead>
              ))}
            </TableRowHead>
          </TableHeader>
          <TableBody>{renderTableRows()}</TableBody>
        </Table>

        <ControlledPaginate
          configPagination={{
            page: getOfferParams().page,
            limit: getOfferParams().limit,
            totalPages: getOfferParams().totalPages,
            total: getOfferParams().total,
          }}
          setPage={setPage}
          setLimit={setLimit}
          className="bg-white rounded-lg p-4 shadow-table"
        />
      </div>

      {/* Modal Detail */}
      <ModalOfferDetailById
        isModalDetailOpen={isModalDetailOpen}
        setIsModalDetailOpen={setIsModalDetailOpen}
      />

      <ModalNotification
        open={isCanceledBidModalOpen}
        setOpen={setIsCanceledBidModalOpen}
        title="ยืนยันการลบใบเสนอราคา"
        description={`คุณต้องการยกเลิกใบเสนอราคา #${displayCode} หรือไม่?`}
        description2="และข้อมูลจะถูกส่งไปที่ ยกเลิกการเสนอราคา"
        buttonText="ยืนยัน"
        isConfirmOnly={false}
        icon={<Icons name="PaperFailBulkYellow" className="w-16 h-16" />}
        onConfirm={() => {
          handleClickConfirmCanceledBid(Number(offerId));
        }}
      />
    </>
  );
}
