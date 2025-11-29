"use client";

import clsx from "clsx";

import useAllQuotation from "../hooks/useAllQuotation";
import useQuotationTable from "../hooks/useQuotationTable";

import ModalQuotationDetailById from "./QuotationModalDetail/ModalQuotationDetailById";
import DocumentUploadModal from "./DocumentUploadModal";
import EditOilPriceModal from "./EditOilPriceModal";

import { Button } from "@/app/components/ui/button";
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
    handleClickViewIcon,
    handleClickBinIcon,
    handledClickConfirmCanceledQuotation,
    isModalDetailOpen,
    setIsModalDetailOpen,
    isModalDeleteOpen,
    setIsModalDeleteOpen,
    quotationCode,
    isModalAddDocumentFileOpen,
    setIsModalAddDocumentFileOpen,
    handleClickAddDocumentButton,
    handleClickConfirmUploadDocument,
    documentFile,
    setDocumentFile,
    isModalEditOilPriceOpen,
    setIsModalEditOilPriceOpen,
    handleClickEditOilPriceButton,
  } = useQuotationTable();

  // Use Effect
  // useEffect(() => {
  //   setQuotationIds([]);
  // }, []);

  // Render Table Row
  const renderTableRows = () => {
    if (!quotations) return null;

    // const rowsToFill = getQuotationSearchParams().limit - sortedData.length;

    return quotations && quotations.length > 0 ? (
      <>
        {quotations.map((data) => (
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
                  "px-4 py-1 w-fit rounded-3xl text-sm",
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
            <TableCell className="w-[15%] text-sm">
              {`${data?.quotation_rfq?.contract_date_start && formatISOToDate.toShortFormat(data?.quotation_rfq?.contract_date_start)} -
              ${data?.quotation_rfq?.contract_date_end && formatISOToDate.toShortFormat(data?.quotation_rfq?.contract_date_end)}`}
            </TableCell>
            <TableCell className="w-[12%] text-sm">
              {data?.quotation_rfq?.contract_date_start &&
              data?.quotation_rfq?.contract_date_end
                ? formatISOToDate.calculateDaysBetween(
                    data?.quotation_rfq?.contract_date_start,
                    data?.quotation_rfq?.contract_date_end
                  )
                : "-"}
            </TableCell>
            <TableCell className="w-[17%] text-sm">
              {data.quotation_rfq.type === ERfqType.ONEWAY
                ? "ส่งเที่ยวเดียว"
                : data.quotation_rfq.type === ERfqType.MULTIPLE
                  ? "ส่งหลายที่"
                  : "ส่งต่างประเทศ"}
            </TableCell>
            <TableCell className="w-[12%] text-sm">
              {data.quotation_rfq.truck_type.name_th
                ? data.quotation_rfq.truck_type.name_th
                : ""}
            </TableCell>
            <TableCell className="w-[15%] text-sm">
              {data.offer.organization.name}
            </TableCell>
            <TableCell className="w-[14%]">
              {data.contract_file_url ? (
                <a
                  href={data?.contract_file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={clsx("", {
                    "flex gap-2 items-center text-secondary-teal-green-main text-sm":
                      data?.contract_file_url,
                  })}
                >
                  <Icons name="Clip" className="w-4 h-4" />
                  มีเอกสารแล้ว
                </a>
              ) : (
                <Button
                  className="h-9 text-sm"
                  onClick={() => handleClickAddDocumentButton(data.id)}
                >
                  + เพิ่มเอกสาร
                </Button>
              )}
            </TableCell>
            <TableCell className="w-[16%] text-sm">
              <Button
                className="h-9 text-sm"
                onClick={() => handleClickEditOilPriceButton(data.id)}
              >
                กำหนดราคา
              </Button>
            </TableCell>
            <TableCell className="w-[10%] flex items-center gap-3">
              <Icons
                name="ShowPassword"
                className="w-6 h-6 cursor-pointer"
                onClick={() => {
                  handleClickViewIcon(data.id);
                }}
              />
              {data.status !== EQuotationStatus.PENDING && (
                <Icons
                  name="Bin"
                  className="w-6 h-6 cursor-pointer text-urgent-fail-01"
                  onClick={() => handleClickBinIcon(data.id, data.display_code)}
                />
              )}
            </TableCell>
          </TableRow>
        ))}
        {/* Render empty rows */}
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

      {/* Modal Document Upload */}
      <DocumentUploadModal
        isModalAddDocumentFileOpen={isModalAddDocumentFileOpen}
        setIsModalAddDocumentFileOpen={setIsModalAddDocumentFileOpen}
        handleClickConfirmUploadDocument={handleClickConfirmUploadDocument}
        documentFile={documentFile}
        setDocumentFile={setDocumentFile}
      />

      {/* Modal Edit Oil Price */}
      <EditOilPriceModal
        isModalEditOilPriceOpen={isModalEditOilPriceOpen}
        setIsModalEditOilPriceOpen={setIsModalEditOilPriceOpen}
      />

      {/* Modal Detail */}
      <ModalQuotationDetailById
        isModalDetailOpen={isModalDetailOpen}
        setIsModalDetailOpen={setIsModalDetailOpen}
      />

      {/* Modal Notification */}
      <ModalNotification
        open={isModalDeleteOpen}
        setOpen={setIsModalDeleteOpen}
        title="ยืนยันการลบใบเสนอราคา"
        description={`คุณต้องการลบใบเสนอราคา #${quotationCode} หรือไม่?`}
        description2="เมื่อลบจะไม่สามารถกู้คืนได้และข้อมูลทั้งหมดจะถูกลบอย่างถาวร"
        buttonText="ยืนยัน"
        isConfirmOnly={false}
        isDelete
        icon={<Icons name="DialogDelete" className="w-16 h-16" />}
        onConfirm={() => {
          handledClickConfirmCanceledQuotation();
        }}
      />
    </>
  );
}
