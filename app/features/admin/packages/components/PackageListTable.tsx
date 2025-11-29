"use client";

import React, { useEffect } from "react";
import clsx from "clsx";

import usePackageListTable from "../hooks/usePackageListTable";

import PackageModal from "./PackageModal";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableRowHead,
} from "@/app/components/ui/data-table";
import MenuButton from "@/app/components/ui/featureComponents/MenuButton";
import NoDataTable from "@/app/components/ui/featureComponents/NoDataTable";
import ModalNotification from "@/app/components/ui/ModalNotification";
import { ControlledPaginate } from "@/app/components/ui/pagination/ControlledPagination";
import { Switch } from "@/app/components/ui/switch";
import { Icons } from "@/app/icons";
import { usePackageStore } from "@/app/store/package/packageStore";
import { formatISOToDate } from "@/app/utils/formatDate";

export default function PackageListTable() {
  // Global State
  const { packages, packageById, getPackagesParams } = usePackageStore(
    (state) => ({
      packages: state.packages,
      packageById: state.packageById,
      getPackagesParams: state.getPackageParams,
    })
  );

  // Hook
  const {
    headerList,
    handleSort,
    fetchDataList,
    // dataList,
    currentStep,
    getOpenPackageModal,
    setOpenPackageModal,
    handleChangeStatus,
    openDeleteModal,
    setOpenDeleteModal,
    selectedData,
    handleClickConfirmDelete,
    openStatusModal,
    setOpenStatusModal,
    handleClickConfirmChangeStatus,
    handleClickBinIcon,
    handleClickPenIcon,
    handleClickViewIcon,
    handleChangePage,
    handleChangeLimit,
    // pagination,
    getPackagesListData,
    setDataList,
    sorting,
    // getPackagesByIdData,
  } = usePackageListTable();

  useEffect(() => {
    fetchDataList();
  }, [currentStep, sorting]);

  useEffect(() => {
    setDataList(getPackagesListData() || []);
  }, [getPackagesListData()]);

  const renderTableRows = () => {
    if (!packages || packages.length === 0) return <NoDataTable />;

    return (
      <React.Fragment>
        {packages.map((data) => {
          return (
            <TableRow key={data.id}>
              <TableCell className="w-[30%] text-sm">
                {/* {data.name_th + " / " + data.name_en} */}
                {data.name_th}
              </TableCell>
              <TableCell className="w-[16%] text-sm">
                {data.period} วัน
              </TableCell>
              <TableCell className="w-[15%] text-sm">
                {data.price && Number(data.price).toFixed(2)}
              </TableCell>
              <TableCell className="w-[12%] text-sm">
                {(data?.created_date &&
                  formatISOToDate.toShortFormat(data?.created_date)) ||
                  "-"}
              </TableCell>
              <TableCell className="w-[15%] text-sm">
                {(data?.start_date &&
                  formatISOToDate.toShortFormat(data?.start_date)) ||
                  "-"}
              </TableCell>
              <TableCell className="w-[17%] text-sm">
                {(data?.end_date &&
                  formatISOToDate.toShortFormat(data?.end_date)) ||
                  "-"}
              </TableCell>
              <TableCell className="w-[9%] text-sm">
                <Switch
                  checked={data.is_active === "Y"}
                  onCheckedChange={(val) => {
                    handleChangeStatus(data, val);
                  }}
                />
              </TableCell>
              <TableCell className="w-[10%] flex gap-3 text-base font-medium">
                <Icons
                  name="ShowPassword"
                  className="w-6 h-6 cursor-pointer"
                  onClick={() => handleClickViewIcon(data.id)}
                />
                <Icons
                  name="Pen"
                  className="w-6 h-6 cursor-pointer"
                  onClick={() => handleClickPenIcon(data.id)}
                />
                <Icons
                  name="Bin"
                  className="w-6 h-6 cursor-pointer"
                  onClick={() => handleClickBinIcon(data)}
                />
              </TableCell>
            </TableRow>
          );
        })}
      </React.Fragment>
    );
  };
  return (
    <React.Fragment>
      <div className="flex flex-col gap-2 w-full">
        <div className="font-bold text-lg flex gap-10 px-5 text-main-02 border-b">
          <MenuButton
            step={1}
            title="รายการแพ็คเกจ"
            icon1="PaperPrimary"
            icon2="Paper"
          />
          {/* <MenuButton
            step={2}
            title="ประวัติการซื้อแพ็คเกจ"
            icon1="BuyPrimary"
            icon2="Buy"
          /> */}
        </div>

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
                      onClick={() => sortable && key && handleSort(key as any)}
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
            page: getPackagesParams().page,
            limit: getPackagesParams().limit,
            totalPages: getPackagesParams().totalPages,
            total: getPackagesParams().total,
          }}
          setPage={handleChangePage}
          setPageAfterSetLimit={false}
          setLimit={handleChangeLimit}
          className="bg-white rounded-lg p-4 shadow-table"
        />
      </div>
      <PackageModal
        open={getOpenPackageModal()}
        setOpenChange={setOpenPackageModal}
        title={packageById ? "แก้ไขแพ็คเกจ" : "เพิ่มแพ็คเกจ"}
      />
      <ModalNotification
        open={openDeleteModal}
        setOpen={setOpenDeleteModal}
        title="ยืนยันการลบบริษัท"
        description={`คุณต้องการลบบริษัท #${selectedData?.name_th} หรือไม่?`}
        description2="เมื่อลบจะไม่สามารถกู้คืนได้และข้อมูลทั้งหมดจะถูกลบอย่างถาวร"
        buttonText="ยืนยัน"
        isConfirmOnly={false}
        isDelete
        icon={<Icons name="DialogDelete" className="w-16 h-16" />}
        onConfirm={() => {
          handleClickConfirmDelete(selectedData?.id ?? 0);
        }}
      />
      <ModalNotification
        open={openStatusModal}
        setOpen={setOpenStatusModal}
        title={`ยืนยันการ${selectedData?.is_active ? "เปิด" : "ปิด"}แพ็คเกจ`}
        description={`คุณต้องการ${selectedData?.is_active ? "เปิด" : "ปิด"}แพ็คเกจ`}
        description2={`${selectedData?.name_th} หรือไม่ ?`}
        buttonText="ยืนยัน"
        isConfirmOnly={false}
        icon={<Icons name="ActiveStatus" className="w-16 h-16" />}
        onConfirm={() => {
          handleClickConfirmChangeStatus(
            selectedData?.id ?? 0,
            selectedData?.is_active ?? ""
          );
        }}
      />
    </React.Fragment>
  );
}
