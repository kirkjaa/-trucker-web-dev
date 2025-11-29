"use client";

import React, { useEffect } from "react";
import clsx from "clsx";

import useUsersListTable from "../hooks/useUsersListTable";

import UsersDriverTruckModal from "./UsersDriverTruckModal";

import { Button } from "@/app/components/ui/button";
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
import ProfileModal from "@/app/components/ui/featureComponents/ProfileModal";
import ModalNotification from "@/app/components/ui/ModalNotification";
import { ControlledPaginate } from "@/app/components/ui/pagination/ControlledPagination";
import { Icons } from "@/app/icons";
import { EComPathName } from "@/app/types/enum";
import formatFullName from "@/app/utils/formatFullName";
import formatPhoneNumber from "@/app/utils/formatPhoneNumber";
import { formatLicensePlate } from "@/app/utils/formatTruck";

export default function UsersListTable() {
  const {
    handleSort,
    headerList,
    fetchDataList,
    dataList,
    handleChangePage,
    handleChangeLimit,
    handleClickViewIcon,
    handleClickBinIcon,
    handleClickEditIcon,
    pagination,
    openDetailModal,
    setOpenDetailModal,
    selectedData,
    selectedListData,
    handleSelectListData,
    openDeleteModal,
    setOpenDeleteModal,
    handleClickConfirmDelete,
    getSelectedUsers,
    setSelectedListData,
    setSelectedUsers,
    pathName,
    getUsersDataList,
    setDataList,
    sorting,
    handleClickAddTruckDriver,
    openDriverTruckModal,
    setOpenDriverTruckModal,
  } = useUsersListTable();

  useEffect(() => {
    fetchDataList();
  }, [sorting]);

  useEffect(() => {
    setSelectedListData(getSelectedUsers());
  }, [getSelectedUsers()]);

  useEffect(() => {
    setSelectedUsers([]);
  }, [pathName]);

  useEffect(() => {
    setDataList(getUsersDataList() || []);
  }, [getUsersDataList()]);

  const renderTableRows = () => {
    if (!dataList || dataList.length === 0) return <NoDataTable />;
    return (
      <React.Fragment>
        {dataList.map((data) => (
          <TableRow key={data.id}>
            <TableCell className="w-[5%] text-sm break-words">
              <Checkbox
                checked={selectedListData.includes(data)}
                onCheckedChange={(checked: boolean) => {
                  handleSelectListData(data, checked);
                }}
              />
            </TableCell>
            <TableCell className="w-[15%] text-sm break-words">
              {data.position && data.position.name}
            </TableCell>
            <TableCell className="w-[15%] text-sm break-words">
              {formatFullName(data.firstName, data.lastName)}
            </TableCell>
            <TableCell className="w-[15%] text-sm break-words">
              {data.username}
            </TableCell>
            <TableCell className="w-[15%] text-sm break-words">
              {formatPhoneNumber(data.phone || "")}
            </TableCell>
            <TableCell
              className={`${
                pathName.includes(EComPathName.USERSDRIVER)
                  ? "w-[15%]"
                  : "w-[20%]"
              } text-sm break-words`}
            >
              {data.email}
            </TableCell>

            {pathName.includes(EComPathName.USERSDRIVER) && (
              <TableCell className="w-[15%] text-sm break-words p-2">
                {data.driver?.truck ? (
                  <React.Fragment>
                    {formatLicensePlate(
                      data.driver.truck.licensePlate.value,
                      data.driver.truck.licensePlate.province
                    )}
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <Button onClick={() => handleClickAddTruckDriver(data)}>
                      <Icons name="Plus" className="w-4 h-4" />
                      ผูกกับรถบรรทุก
                    </Button>
                  </React.Fragment>
                )}
              </TableCell>
            )}

            <TableCell className="w-[10%] flex gap-3 text-base font-medium justify-end">
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
                className="w-6 h-6 cursor-pointer text-red-500"
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
      <ProfileModal
        open={openDetailModal}
        setOpen={setOpenDetailModal}
        fullName={formatFullName(
          selectedData?.firstName,
          selectedData?.lastName
        )}
        imageUrl={selectedData?.imageUrl}
        email={selectedData?.email}
        phone={selectedData?.phone && formatPhoneNumber(selectedData?.phone)}
        display={"โรงงาน"}
        displayData={selectedData?.companyId}
        username={selectedData?.username}
      />
      <ModalNotification
        open={openDeleteModal}
        setOpen={setOpenDeleteModal}
        title="ยืนยันการลบผู้ใช้งาน"
        description={`คุณต้องการลบผู้ใช้งาน #${selectedData?.username} หรือไม่?`}
        description2="เมื่อลบจะไม่สามารถกู้คืนได้และข้อมูลทั้งหมดจะถูกลบอย่างถาวร"
        buttonText="ยืนยัน"
        isConfirmOnly={false}
        isDelete
        icon={<Icons name="DialogDelete" className="w-16 h-16" />}
        onConfirm={() => {
          handleClickConfirmDelete(selectedData!.id);
        }}
      />

      <UsersDriverTruckModal
        open={openDriverTruckModal}
        setOpen={setOpenDriverTruckModal}
        id={selectedData?.driver?.id}
        fetchDataList={fetchDataList}
      />
    </React.Fragment>
  );
}
