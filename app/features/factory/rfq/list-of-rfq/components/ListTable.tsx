"use client";

import clsx from "clsx";

import useAllRfq from "../../hooks/useAllRfq";
import useListOfRfqTable from "../../hooks/useListOfRfqTable";

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
import { Switch } from "@/app/components/ui/switch";
import { Icons } from "@/app/icons";
import { useRfqStore } from "@/app/store/rfq/rfqStore";
import { EOfferStatus } from "@/app/types/offer/offerEnum";
import { ERfqType } from "@/app/types/rfq/rfqEnum";
import { formatId } from "@/app/utils/formatId";

export default function ListTable() {
  // Global State
  const { rfqs, getRfqParams } = useRfqStore((state) => ({
    rfqs: state.rfqs,
    getRfqParams: state.getRfqParams,
  }));

  // Hook
  const { setPage, setLimit } = useAllRfq();
  const {
    displayCode,
    headerList,
    handleSort,
    activeStatus,
    isModalActiveStatusOpen,
    setIsModalActiveStatusOpen,
    handleClickSwitchToggleActive,
    handleClickConfirmChangeActive,
    handleClickViewRoute,
    handleClickCompanySelected,
    isModalDeleteOpen,
    setIsModalDeleteOpen,
    handleClickBinIcon,
    handleClickConfirmDeleteQuotation,
  } = useListOfRfqTable();

  // Render Table Row
  const renderTableRows = () => {
    if (!rfqs) return null;

    /* const rowsToFill = getRfqParams().limit - rfqs.length; */

    return rfqs && rfqs.length > 0 ? (
      <>
        {rfqs.map((data) => (
          <TableRow key={data.id}>
            <TableCell className="w-[14%] text-sm">
              {formatId(data.display_code)}
            </TableCell>
            <TableCell className="w-[16%] text-sm">
              {data.type === ERfqType.ONEWAY
                ? "ส่งเที่ยวเดียว"
                : data.type === ERfqType.MULTIPLE
                  ? "ส่งหลายที่"
                  : "ส่งต่างประเทศ"}
            </TableCell>
            <TableCell className="w-[11%] text-sm">
              {data.truck_size.name_th}
            </TableCell>
            <TableCell className="w-[13%] text-sm">
              {data?.routes.length > 1
                ? `${data?.routes.length} เส้นทาง`
                : `${data?.routes?.[0]?.organization_route.master_route.origin_province.name_th}/${data?.routes?.[0]?.organization_route.master_route.origin_district.name_th}`}
            </TableCell>
            <TableCell className="w-[13%] text-sm">
              {data?.routes.length > 1
                ? `${data?.routes.length} เส้นทาง`
                : `${data?.routes?.[0]?.organization_route.master_route.destination_province.name_th}/${data?.routes?.[0]?.organization_route.master_route.destination_district.name_th}`}
            </TableCell>
            <TableCell className="w-[11%] text-sm">
              {
                data.offers.filter(
                  (offer) => offer.status === EOfferStatus.OFFER
                ).length
              }{" "}
              บริษัท
            </TableCell>
            <TableCell className="w-[12%] flex gap-3 text-sm font-medium">
              <Switch
                checked={data?.is_active === "Y" ? true : false}
                onCheckedChange={() =>
                  handleClickSwitchToggleActive(
                    data.id,
                    data.is_active,
                    data.display_code
                  )
                }
              />
              {data?.is_active === "Y" ? (
                <p className="text-success-01">ใช้งาน</p>
              ) : (
                <p className="text-neutral-06">ปิดใช้งาน</p>
              )}
            </TableCell>
            <TableCell className="w-[9%] flex items-center gap-2 text-sm">
              <Icons
                name="ShowPassword"
                className="w-6 h-6 cursor-pointer"
                onClick={() => handleClickViewRoute(data.id)}
              />
              <Icons
                name="Document"
                className="w-6 h-6 cursor-pointer"
                onClick={() => handleClickCompanySelected(data.id)}
              />
              <Icons
                name="Bin"
                className="w-6 h-6 cursor-pointer text-urgent-fail-01"
                onClick={() => handleClickBinIcon(data.id, data.display_code)}
              />
            </TableCell>
          </TableRow>
        ))}
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

      {/* Modal Notification */}
      <ModalNotification
        open={isModalActiveStatusOpen}
        setOpen={setIsModalActiveStatusOpen}
        title={
          activeStatus === "Y"
            ? "ยืนยันปิดใช้งานการประมูล"
            : "ยืนยันเปิดใช้งานการประมูล"
        }
        description={
          activeStatus === "Y"
            ? "คุณต้องการปิดใช้งานการประมูล"
            : "คุณต้องการเปิดใช้งานการประมูล"
        }
        description2={`ใบเสนอราคา #${displayCode} หรือไม่?`}
        buttonText="ยืนยัน"
        isConfirmOnly={false}
        icon={
          <Icons
            name={activeStatus === "Y" ? "DisableStatus" : "ActiveStatus"}
            className="w-16 h-16"
          />
        }
        onConfirm={() => {
          handleClickConfirmChangeActive();
        }}
      />

      <ModalNotification
        open={isModalDeleteOpen}
        setOpen={setIsModalDeleteOpen}
        title="ยืนยันการลบใบเสนอราคา"
        description={`คุณต้องการลบใบเสนอราคา #${displayCode} หรือไม่?`}
        description2="เมื่อลบจะไม่สามารถกู้คืนได้และข้อมูลทั้งหมดจะถูกลบอย่างถาวร"
        buttonText="ยืนยัน"
        isConfirmOnly={false}
        isDelete
        icon={<Icons name="DialogDelete" className="w-16 h-16" />}
        onConfirm={() => {
          handleClickConfirmDeleteQuotation();
        }}
      />
    </>
  );
}
