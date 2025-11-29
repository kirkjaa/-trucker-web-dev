"use client";

import clsx from "clsx";

import useQuotationTable from "../hooks/useQuotationTable";

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
import ModalQuotationDetailById from "@/app/features/factory/quotation/components/QuotationModalDetail/ModalQuotationDetailById";
import useAllQuotation from "@/app/features/factory/quotation/hooks/useAllQuotation";
import { Icons } from "@/app/icons";
import { useQuotationStore } from "@/app/store/quotation/quotationStore";
import { EQuotationStatus } from "@/app/types/quotation/quotationEnum";
import { ERfqType } from "@/app/types/rfq/rfqEnum";
import { formatISOToDate } from "@/app/utils/formatDate";
import { formatId } from "@/app/utils/formatId";

export default function ListTable() {
  // Global State
  const { quotations, getQuotationParams } = useQuotationStore((state) => ({
    quotations: state.quotations,
    getQuotationParams: state.getQuotationParams,
  }));

  // Hook
  const { setPage, setLimit } = useAllQuotation();
  const {
    headerList,
    handleSort,
    isModalDetailOpen,
    setIsModalDetailOpen,
    handleClickViewIcon,
  } = useQuotationTable();

  // Render Table Row
  const renderTableRows = () => {
    if (!quotations) return null;

    // const rowsToFill = getQuotationSearchParams().limit - sortedData.length;

    return quotations && quotations.length > 0 ? (
      <>
        {quotations.map((data) => {
          return (
            <TableRow key={data.id}>
              {/* <TableCell className="w-[2%]">
                <Checkbox
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setQuotationIds([...quotationIds, data.id]);
                    } else {
                      unCheckQuotationIds(data.id);
                    }
                  }}
                />
              </TableCell> */}
              <TableCell className="w-[15%]">
                <p
                  className={clsx(
                    "text-sm px-4 py-1 w-fit rounded-3xl",
                    {
                      "text-secondary-caribbean-green-04 bg-toast-success-background":
                        data.status !== EQuotationStatus.EXPIRED,
                    },
                    {
                      "text-urgent-fail-02 bg-toast-error-background":
                        data.status === EQuotationStatus.EXPIRED,
                    }
                  )}
                >
                  {data.status === EQuotationStatus.SUCCESS
                    ? "• ดำเนินการ"
                    : data.status === EQuotationStatus.PENDING
                      ? "• รอดำเนินการ"
                      : data.status === EQuotationStatus.EXPIRED
                        ? "• หมดอายุ"
                        : "-"}
                </p>
              </TableCell>
              <TableCell className="w-[15%] text-sm">
                {formatId(data.display_code)}
              </TableCell>
              <TableCell className="w-[20%] text-sm">
                {`${data?.quotation_rfq.contract_date_start && formatISOToDate.toShortFormat(data?.quotation_rfq.contract_date_start)} -
              ${data?.quotation_rfq.contract_date_end && formatISOToDate.toShortFormat(data?.quotation_rfq.contract_date_end)}`}
              </TableCell>
              <TableCell className="w-[10%] text-sm">
                {data?.quotation_rfq.contract_date_start &&
                data?.quotation_rfq.contract_date_end
                  ? formatISOToDate.calculateDaysBetween(
                      data?.quotation_rfq.contract_date_start,
                      data?.quotation_rfq.contract_date_end
                    )
                  : "-"}
              </TableCell>
              <TableCell className="w-[15%] text-sm">
                {data.quotation_rfq.type === ERfqType.ONEWAY
                  ? "ส่งเที่ยวเดียว"
                  : data.quotation_rfq.type === ERfqType.MULTIPLE
                    ? "ส่งหลายที่"
                    : "ส่งต่างประเทศ"}
              </TableCell>
              <TableCell className="w-[15%] text-sm">
                {data.quotation_rfq.truck_size.name_th
                  ? data.quotation_rfq.truck_size.name_th
                  : "-"}
              </TableCell>
              <TableCell className="w-[15%] flex gap-3 text-sm font-medium">
                {data.quotation_rfq.organization.name}
              </TableCell>
              <TableCell className="w-[10%]">
                <Icons
                  name="ShowPassword"
                  className="w-6 h-6 cursor-pointer"
                  onClick={() => {
                    handleClickViewIcon(data.id);
                  }}
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
            "py-80": getQuotationParams().limit === 10,
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
              {/* <TableHead className="w-[2%]">
                <Checkbox />
              </TableHead> */}
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
            page: getQuotationParams().page,
            limit: getQuotationParams().limit,
            totalPages: getQuotationParams().totalPages,
            total: getQuotationParams().total,
          }}
          setPage={setPage}
          setLimit={setLimit}
          className="bg-white rounded-lg p-4 shadow-table"
        />
      </div>

      {/* Modal Detail */}
      <ModalQuotationDetailById
        isModalDetailOpen={isModalDetailOpen}
        setIsModalDetailOpen={setIsModalDetailOpen}
      />
    </>
  );
}
