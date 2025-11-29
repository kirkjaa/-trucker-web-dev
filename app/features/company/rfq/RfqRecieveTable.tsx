"use client";

import clsx from "clsx";

import useRfqRecieveTable from "./hooks/useRfqRecieveTable";
import ModalRfqDetailById from "./modal-by-id/ModalRfqDetailById";

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
import useAllRfq from "@/app/features/factory/rfq/hooks/useAllRfq";
import { Icons } from "@/app/icons";
import { useRfqStore } from "@/app/store/rfq/rfqStore";
import { ERfqType } from "@/app/types/rfq/rfqEnum";
import { formatId } from "@/app/utils/formatId";

export default function RfqRecieveTable() {
  // Global State
  const { rfqsReceived, getRfqParams } = useRfqStore((state) => ({
    rfqsReceived: state.rfqsReceived,
    getRfqParams: state.getRfqParams,
  }));

  // Hook
  const { setPage, setLimit } = useAllRfq();
  const {
    headerList,
    handleSort,
    handleClickOffer,
    isModalDetailOpen,
    setIsModalDetailOpen,
    handleClickViewIcon,
  } = useRfqRecieveTable();

  // Render Table Row
  const renderTableRows = () => {
    if (!rfqsReceived) return null;

    /* const rowsToFill = getRfqParams().limit - rfqs.length; */

    return rfqsReceived && rfqsReceived.length > 0 ? (
      <>
        {rfqsReceived.map((data) => {
          return (
            <TableRow key={data.id}>
              <TableCell className="w-[12%] text-sm">
                {formatId(data.display_code)}
              </TableCell>
              <TableCell className="w-[12%] text-sm">
                {data.organization.name}
              </TableCell>
              <TableCell className="w-[12%] text-sm">
                {data.type === ERfqType.ONEWAY
                  ? "ส่งเที่ยวเดียว"
                  : data.type === ERfqType.MULTIPLE
                    ? "ส่งหลายที่"
                    : "ส่งต่างประเทศ"}
              </TableCell>
              <TableCell className="w-[12%] text-sm">
                {data.truck_size.name_th}
              </TableCell>
              <TableCell className="w-[12%] text-sm">
                {data?.routes.length > 1
                  ? `${data?.routes.length} เส้นทาง`
                  : `${data?.routes?.[0]?.organization_route.master_route.origin_province.name_th}/${data?.routes?.[0]?.organization_route.master_route.origin_district.name_th}`}
              </TableCell>
              {/* <TableCell className="w-[10%]">Wait Confirm</TableCell> */}
              <TableCell className="w-[10%] text-sm">
                {data?.routes.length > 1
                  ? `${data?.routes.length} เส้นทาง`
                  : `${data?.routes?.[0]?.organization_route.master_route.destination_province.name_th}/${data?.routes?.[0]?.organization_route.master_route.destination_district.name_th}`}
              </TableCell>
              <TableCell className="w-[7%] text-neutral-07 text-sm">
                {data.routes?.[0].unit_price_route.name_th}
              </TableCell>
              <TableCell className="w-[10%] flex items-center gap-2">
                <Icons
                  name="ShowPassword"
                  className="w-6 h-6 cursor-pointer"
                  onClick={() => handleClickViewIcon(data.id)}
                />
                <Icons
                  name="Document"
                  className="w-6 h-6 cursor-pointer"
                  onClick={() => handleClickOffer(data.id)}
                />
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
            "py-80": getRfqParams().limit === 10,
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
            page: getRfqParams().page,
            limit: getRfqParams().limit,
            totalPages: getRfqParams().totalPages,
            total: getRfqParams().total,
          }}
          setPage={setPage}
          setLimit={setLimit}
          className="bg-white rounded-lg p-4 shadow-table"
        />
      </div>

      {/* Modal Detail */}
      <ModalRfqDetailById
        isModalDetailOpen={isModalDetailOpen}
        setIsModalDetailOpen={setIsModalDetailOpen}
      />
    </>
  );
}
