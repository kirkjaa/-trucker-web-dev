"use client";

import React, { useEffect } from "react";
import clsx from "clsx";

import useShippingCompanyListTable from "../hooks/useShippingCompanyListTable";

import ShippingCompanyModal from "./ShippingCompanyModal";

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
import { ControlledPaginate } from "@/app/components/ui/pagination/ControlledPagination";
import FactoriesAndCompaniesLatLngModal from "@/app/features/admin/components/FactoriesAndCompaniesLatLngModal";
import { Icons } from "@/app/icons";
import { formatISOToDate } from "@/app/utils/formatDate";
import formatPhoneNumber from "@/app/utils/formatPhoneNumber";

export default function ShippingCompanyListTable() {
  const {
    headerList,
    handleSort,
    openModal,
    setOpenModal,
    fetchDataList,
    dataList,
    handleClickShowPasswordIcon,
    selectedData,
    openLatLngModal,
    setOpenLatLngModal,
    handleClickOpenLatLngModal,
    sorting,
    handleChangePage,
    handleChangeLimit,
    pagination,
    setDataList,
    contractCompanyList,
  } = useShippingCompanyListTable();

  useEffect(() => {
    fetchDataList();
  }, [sorting]);
  useEffect(() => {
    setDataList(contractCompanyList || []);
  }, [contractCompanyList]);
  const renderTableRows = () => {
    if (!dataList || dataList.length === 0) return <NoDataTable />;
    return (
      <React.Fragment>
        {dataList.map((data) => {
          const { company } = data;
          return (
            <TableRow key={data?.company?.id}>
              <TableCell className="w-[12%] text-sm">
                {company?.displayCode}
              </TableCell>
              <TableCell className="w-[14%] text-sm">{company?.name}</TableCell>
              <TableCell className="w-[13%] text-sm">
                {data?.contractStart && data?.contractEnd
                  ? `${formatISOToDate.toShortFormat(data.contractStart)} -
                          ${formatISOToDate.toShortFormat(data.contractEnd)}`
                  : ""}
              </TableCell>
              <TableCell className="w-[10%] text-sm">
                {data.contractTime}
              </TableCell>
              <TableCell className="w-[10%] text-sm">
                {company && formatPhoneNumber(company?.phone)}
              </TableCell>
              <TableCell className="w-[20%] text-sm">
                {company?.email}
              </TableCell>
              <TableCell className="w-[16%] text-sm">
                <div
                  onClick={() => handleClickOpenLatLngModal(data)}
                  className="text-secondary-caribbean-green-main cursor-pointer"
                >
                  <p className="flex items-center">
                    ดูพิกัดสถานที่
                    <span>
                      <Icons
                        name="ChevronRight"
                        className="w-6 h-6 cursor-pointer"
                      />
                    </span>
                  </p>
                </div>
              </TableCell>
              <TableCell className="w-[5%] text-sm">
                <Icons
                  name="ShowPassword"
                  className="w-6 h-6 cursor-pointer"
                  onClick={() => handleClickShowPasswordIcon(data)}
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
          setPageAfterSetLimit={false}
          setLimit={handleChangeLimit}
          className="bg-white rounded-lg p-4 shadow-table"
        />
      </div>
      <ShippingCompanyModal
        open={openModal}
        setOpen={setOpenModal}
        name={selectedData?.company?.name}
        contractTime={selectedData?.contractTime}
        contractStart={selectedData?.contractStart}
        contractEnd={selectedData?.contractEnd}
        phone={selectedData?.company?.phone}
        email={selectedData?.company?.email}
        latitude={selectedData?.company?.address.latitude.toString()}
        longitude={selectedData?.company?.address.longitude.toString()}
        imageUrl={selectedData?.company?.imageUrl}
      />
      <FactoriesAndCompaniesLatLngModal
        lattitude={selectedData?.company?.address.latitude.toString() || ""}
        longitude={selectedData?.company?.address.longitude.toString() || ""}
        open={openLatLngModal}
        setOpen={setOpenLatLngModal}
      />
    </React.Fragment>
  );
}
