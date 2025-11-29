"use client";

import React, { useEffect } from "react";
import clsx from "clsx";

import useTruckTableList from "../hooks/useTruckTableList";

import TruckDetailModal from "./TruckDetailModal";
import TruckLocationModal from "./TruckLocationModal";

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
import {
  formatDimension,
  formatLicensePlate,
  formatWeight,
} from "@/app/utils/formatTruck";

export default function TruckListTable() {
  const {
    headerList,
    fetchDataList,
    dataList,
    handleChangeStatus,
    pagination,
    handleChangePage,
    handleChangeLimit,
    truckDataList,
    setDataList,
    handleClickBinIcon,
    openDeleteModal,
    setOpenDeleteModal,
    selectedData,
    handleClickConfirmDelete,
    handleClickEditIcon,
    openLocationModal,
    setOpenLocationModal,
    handleClickPinIcon,
    openDetailModal,
    setOpenDetailModal,

    // onSubmitModalLocation,
    handleClickViewIcon,
    handleSort,
    sorting,
    pathName,
    handleSelectListId,
    selectedListData,
    setSelectedTruck,
    setSelectedListData,
  } = useTruckTableList();

  useEffect(() => {
    fetchDataList();

    setSelectedTruck([]);
    setSelectedListData([]);
  }, [pathName]);

  useEffect(() => {
    setDataList(truckDataList);
  }, [truckDataList]);
  useEffect(() => {
    if (sorting?.sortBy) {
      fetchDataList();
    }
  }, [sorting]);

  const renderTableRows = () => {
    if (!dataList || dataList.length <= 0) return <NoDataTable />;
    else
      return (
        <React.Fragment>
          {dataList.map((data) => (
            <TableRow key={data.id}>
              <TableCell className="w-[4%] text-sm break-words">
                <Checkbox
                  checked={selectedListData.includes(data)}
                  onCheckedChange={(checked: boolean) => {
                    handleSelectListId(data, checked);
                  }}
                />
              </TableCell>
              <TableCell className="w-[8%] text-sm">{data.truckCode}</TableCell>
              <TableCell className="w-[8%] text-sm truncate whitespace-nowrap overflow-hidden">
                {data.brand}
              </TableCell>
              <TableCell className="w-[10%] text-sm truncate whitespace-nowrap overflow-hidden">
                {formatLicensePlate(
                  data.licensePlate.value,
                  data.licensePlate.province
                )}
              </TableCell>
              <TableCell className="w-[10%] text-sm">{data.color}</TableCell>
              <TableCell className="w-[10%] text-sm break-words">
                {data.type}
              </TableCell>
              <TableCell className="w-[12%] text-sm">
                {formatDimension(
                  data.capacity.size.width,
                  data.capacity.size.height,
                  data.capacity.size.length,
                  data.capacity.size.unit
                )}
              </TableCell>
              <TableCell className="w-[10%] text-sm">
                {formatWeight(data.capacity.weight, data.capacity.weightUnit)}
              </TableCell>
              <TableCell className="w-[10%] text-sm">
                <Switch
                  checked={data.isActive}
                  onCheckedChange={(val) => {
                    handleChangeStatus(data.id, val);
                  }}
                />
              </TableCell>
              <TableCell className="w-[14%] flex gap-3 text-base font-medium">
                <Icons
                  name="ShowPassword"
                  className="w-6 h-6 cursor-pointer"
                  onClick={() => handleClickViewIcon(data)}
                />
                <Icons
                  name="PinLight"
                  className="w-6 h-6 cursor-pointer"
                  onClick={() => handleClickPinIcon(data)}
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
      </div>
      <ControlledPaginate
        configPagination={{
          page: pagination.page,
          limit: pagination.limit,
          totalPages: pagination.totalPages,
          total: pagination.total,
        }}
        setPageAfterSetLimit={false}
        setPage={handleChangePage}
        setLimit={handleChangeLimit}
        className="bg-white rounded-lg p-4 shadow-table"
      />

      <ModalNotification
        open={openDeleteModal}
        setOpen={setOpenDeleteModal}
        title="ยืนยันการลบบริษัท"
        description={`คุณต้องการลบข้อมูลรถ #${selectedData?.truckCode} หรือไม่?`}
        description2="เมื่อลบจะไม่สามารถกู้คืนได้และข้อมูลทั้งหมดจะถูกลบอย่างถาวร"
        buttonText="ยืนยัน"
        isConfirmOnly={false}
        isDelete
        icon={<Icons name="DialogDelete" className="w-16 h-16" />}
        onConfirm={() => {
          handleClickConfirmDelete(selectedData!.id);
        }}
      />
      <TruckLocationModal
        open={openLocationModal}
        setOpen={setOpenLocationModal}
        licensePlate={formatLicensePlate(
          selectedData?.licensePlate?.value,
          selectedData?.licensePlate?.province
        )}
        code={selectedData?.truckCode}
        value={selectedData?.location?.currentLocation || ""}
        location={selectedData?.location}
        id={selectedData?.id}
      />
      <TruckDetailModal
        open={openDetailModal}
        setOpen={setOpenDetailModal}
        data={selectedData}
        handleChangeStatus={handleChangeStatus}
      />
    </React.Fragment>
  );
}
