"use client";

import React, { useEffect } from "react";
import clsx from "clsx";

import useUsersPositionListTable from "../hooks/useUsersPositionListTable";

import UsersPositionModal from "./UsersPositionModal";

import { Checkbox } from "@/app/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableRowHead,
} from "@/app/components/ui/data-table";
import NoDataTable from "@/app/components/ui/featureComponents/NoDataTable";
import ModalNotification from "@/app/components/ui/ModalNotification";
import { ControlledPaginate } from "@/app/components/ui/pagination/ControlledPagination";
import { Switch } from "@/app/components/ui/switch";
import { Icons } from "@/app/icons";

export default function UsersPositionListTable() {
  const {
    headerList,
    handleSort,
    fetchDataList,
    dataList,
    handleChangeStatus,
    handleClickEditIcon,
    openDeleteModal,
    setOpenDeleteModal,
    handleClickConfirmDelete,
    selectedData,
    handleClickBinIcon,
    handleClickViewIcon,
    openDetailModal,
    setOpenDetailModal,
    handleSelectListId,
    selectedList,
    sorting,
    pagination,
    handleChangeLimit,
    handleChangePage,
  } = useUsersPositionListTable();

  useEffect(() => {
    fetchDataList();
  }, [sorting]);

  const renderTableRows = () => {
    if (!dataList || dataList.length === 0) return <NoDataTable />;
    return (
      <React.Fragment>
        {dataList.map((data) => (
          <TableRow key={data.id}>
            <TableCell className="w-[5%] text-sm break-words">
              <Checkbox
                checked={selectedList.includes(data)}
                onCheckedChange={(checked: boolean) => {
                  handleSelectListId(data, checked);
                }}
              />
            </TableCell>
            <TableCell className="w-[13%] text-sm break-words">
              {data.title}
            </TableCell>
            <TableCell className="w-[17%] text-sm break-words">
              {data.name}
            </TableCell>
            <TableCell className="w-[10%] text-sm break-words">
              <Switch
                checked={data.isActive}
                onCheckedChange={(val) => {
                  handleChangeStatus(data.id, val);
                }}
              />
            </TableCell>

            <TableCell className="w-[55%] flex gap-3 text-base font-medium justify-end">
              <Icons
                name="ShowPassword"
                className="w-6 h-6 cursor-pointer"
                onClick={() => handleClickViewIcon(data)}
              />
              <Icons
                name="Pen"
                className="w-6 h-6 cursor-pointer"
                onClick={() => {
                  handleClickEditIcon(data.id);
                }}
              />
              <Icons
                name="Bin"
                className="w-6 h-6 cursor-pointer"
                onClick={() => {
                  handleClickBinIcon(data);
                }}
              />
            </TableCell>
          </TableRow>
        ))}
      </React.Fragment>
    );
  };
  return (
    <React.Fragment>
      <div className="flex flex-col gap-2 w-full">
        <Table>
          <TableHeader>
            <TableRowHead>
              {headerList.map(({ key, label, sortable = true, width }) => (
                <TableHead
                  key={key}
                  className={`w-[${width}] flex items-center gap-1`}
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
            page: pagination.page,
            limit: pagination.limit,
            totalPages: pagination.totalPages,
            total: pagination.total,
          }}
          setPage={handleChangePage}
          setLimit={handleChangeLimit}
          setPageAfterSetLimit={false}
          className="bg-white rounded-lg p-4 shadow-table"
        />
      </div>
      <ModalNotification
        open={openDeleteModal}
        setOpen={setOpenDeleteModal}
        title="ยืนยันการลบบริษัท"
        description={`คุณต้องการลบบริษัท #${selectedData?.name} หรือไม่?`}
        description2="เมื่อลบจะไม่สามารถกู้คืนได้และข้อมูลทั้งหมดจะถูกลบอย่างถาวร"
        buttonText="ยืนยัน"
        isConfirmOnly={false}
        isDelete
        icon={<Icons name="DialogDelete" className="w-16 h-16" />}
        onConfirm={() => {
          handleClickConfirmDelete(selectedData!.id);
        }}
      />
      <UsersPositionModal
        open={openDetailModal}
        setOpen={setOpenDetailModal}
        data={selectedData!}
      />
    </React.Fragment>
  );
}
