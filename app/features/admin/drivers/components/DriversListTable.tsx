"use client";

import React, { useEffect } from "react";
import clsx from "clsx";

import useDriversListTable from "../hooks/useDriversListTable";

import DriversReviewModal from "./DriversReviewModal";

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
import { useDriverStore } from "@/app/store/driver/driverStore";
import { DriversStatus, DriversType } from "@/app/types/enum";
import formatFullName from "@/app/utils/formatFullName";
import formatPhoneNumber from "@/app/utils/formatPhoneNumber";
export default function DriversListTable() {
  // Global State
  const { drivers, getDriverParams } = useDriverStore((state) => ({
    drivers: state.drivers,
    getDriverParams: state.getDriverParams,
  }));

  // Hook
  const {
    fetchDataList,
    headerList,
    handleSort,
    sorting,
    handleClickEditIcon,
    handleClickBinIcon,
    handleClickViewIcon,
    openDetailModal,
    data,
    driverType,
    setOpenDetailModal,
    handleChangePage,
    handleChangeLimit,
    // selectedListId,
    // handleSelectListId,
    handleClickConfirmDelete,
    setOpenDeleteModal,
    openReviewModal,
    setOpenReviewModal,
    status,
    openDeleteModal,
    // setSelectedList,
    setSelectedListId,
    selectedData,
    handleReviewDriver,
    onSubmitReviewDriver,
    // driversData,
    pathName,
    handleClickViewDocument,
  } = useDriversListTable();

  useEffect(() => {
    fetchDataList();
    // setSelectedList([]);
    setSelectedListId([]);
  }, [pathName, sorting]);

  const renderTableRows = () => {
    if (!drivers || drivers.length === 0) return <NoDataTable />;
    return (
      <React.Fragment>
        {drivers.map((data) => (
          <TableRow key={data.display_code}>
            {driverType !== DriversType.REVIEWFREELANCE && (
              <React.Fragment>
                {/* <TableCell className="w-[4%] text-sm break-words">
                  <Checkbox
                    checked={selectedListId.includes(data)}
                    onCheckedChange={(checked: boolean) => {
                      handleSelectListId(data, checked);
                    }}
                  />
                </TableCell> */}
                <TableCell className="w-[12%] text-sm">
                  {data.display_code}
                </TableCell>
              </React.Fragment>
            )}

            <TableCell className="w-[15%] text-sm  break-words">
              {formatFullName(data.user?.first_name, data.user?.last_name)}
            </TableCell>

            {driverType !== DriversType.REVIEWFREELANCE && (
              <React.Fragment>
                {/* <TableCell className="w-[18%] text-sm">ตำแหน่ง</TableCell> */}
                {driverType === DriversType.INTERNAL && (
                  <TableCell className="w-[15%] text-sm">
                    {data?.user?.organization?.name}
                  </TableCell>
                )}
                <TableCell className="w-[10%] text-sm">
                  {data.user.username}
                </TableCell>
              </React.Fragment>
            )}

            <TableCell className="w-[10%] text-sm">
              {formatPhoneNumber(data.user.phone)}
            </TableCell>
            <TableCell className="w-[18%] text-sm break-words">
              {data.user.email}
            </TableCell>

            {driverType !== DriversType.REVIEWFREELANCE ? (
              <TableCell className="w-[10%] flex gap-3 text-base font-medium">
                <Icons
                  name="ShowPassword"
                  className="w-6 h-6 cursor-pointer"
                  onClick={() => handleClickViewIcon(data.id)}
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
            ) : (
              <React.Fragment>
                <TableCell
                  className="w-[18%] text-sm flex items-center text-secondary-teal-green-main cursor-pointer"
                  onClick={() =>
                    handleClickViewDocument(data.image_id_card_url)
                  }
                >
                  <Icons name="Pen" className="w-6 h-6" />
                  <span>ดูสำเนาบัตรประชาชน</span>
                </TableCell>

                <TableCell
                  className="w-[15%] text-sm flex items-center text-secondary-teal-green-main cursor-pointer"
                  onClick={() =>
                    handleClickViewDocument(data.truck.image_truck_document_url)
                  }
                >
                  <Icons name="Pen" className="w-6 h-6 " />
                  <span>ดูสำเนาทะเบียนรถ</span>
                </TableCell>
                <TableCell
                  className="w-[15%] text-sm flex items-center text-secondary-teal-green-main cursor-pointer"
                  onClick={() =>
                    handleClickViewDocument(data.image_driving_license_card_url)
                  }
                >
                  <Icons name="Pen" className="w-6 h-6 " />
                  <span>ดูสำเนาใบขับขี่</span>
                </TableCell>
                <TableCell className="w-[8%] flex gap-3 text-base font-medium">
                  <div
                    className="bg-green-700 w-6 h-6 flex justify-center items-center rounded-md cursor-pointer"
                    onClick={() =>
                      handleReviewDriver(data, DriversStatus.APPROVE)
                    }
                  >
                    <Icons name="Check" className="cursor-pointer" />
                  </div>
                  <div
                    className="bg-red-500 w-6 h-6 flex justify-center items-center rounded-md cursor-pointer"
                    onClick={() =>
                      handleReviewDriver(data, DriversStatus.REJECTED)
                    }
                  >
                    <Icons name="Cross" className="cursor-pointer" />
                  </div>
                </TableCell>
              </React.Fragment>
            )}
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
      </div>
      <ControlledPaginate
        configPagination={{
          page: getDriverParams().page,
          limit: getDriverParams().limit,
          totalPages: getDriverParams().totalPages,
          total: getDriverParams().total,
        }}
        setPageAfterSetLimit={false}
        setPage={handleChangePage}
        setLimit={handleChangeLimit}
        className="bg-white rounded-lg p-4 shadow-table"
      />
      <ProfileModal
        open={openDetailModal}
        setOpen={setOpenDetailModal}
        fullName={formatFullName(data?.user.first_name, data?.user.last_name)}
        imageUrl={data?.user.image_url}
        email={data?.user.email}
        phone={data?.user.phone && formatPhoneNumber(data?.user.phone)}
        display="บริษัท"
        displayData={data?.user.organization && data?.user.organization?.name}
        username={data?.user.username}
        title={`ข้อมูลพนักงาน${
          driverType === DriversType.INTERNAL ? "ขับรถภายใน" : "ขับรถอิสระ"
        }`}
      />
      <ModalNotification
        open={openDeleteModal}
        setOpen={setOpenDeleteModal}
        title="ยืนยันการลบพนักงาน"
        description={`คุณต้องการลบพนักงาน #${selectedData?.display_code} หรือไม่?`}
        description2="เมื่อลบจะไม่สามารถกู้คืนได้และข้อมูลทั้งหมดจะถูกลบอย่างถาวร"
        buttonText="ยืนยัน"
        isConfirmOnly={false}
        isDelete
        icon={<Icons name="DialogDelete" className="w-16 h-16" />}
        onConfirm={() => {
          handleClickConfirmDelete(selectedData?.id ?? 0);
        }}
      />
      <DriversReviewModal
        open={openReviewModal}
        setOpen={setOpenReviewModal}
        imageUrl={selectedData?.user?.image_url}
        status={status}
        title="ข้อมูลคนขับรถอิสระ"
        onSubmit={onSubmitReviewDriver}
        name={formatFullName(
          selectedData?.user?.first_name,
          selectedData?.user?.last_name
        )}
      />
    </React.Fragment>
  );
}
