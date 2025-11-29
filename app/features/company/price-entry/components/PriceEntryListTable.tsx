"use client";

import React, { useEffect } from "react";
import clsx from "clsx";

import usePriceEntryListTable from "../hooks/usePriceEntryListTable";

import AddPriceEntryModal from "./AddPriceEntryModal";
import EditPriceEntryModal from "./EditPriceEntryModal";

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
import { Icons } from "@/app/icons";
import { ETruckSize } from "@/app/types/enum";

export default function PriceEntryListTable() {
  const {
    headerList,
    handleSort,
    handleChangePage,
    pagination,
    handleChangeLimit,
    openAddModal,
    setOpenAddModal,
    openEditModal,
    setOpenEditModal,
    fetchDataList,
    dataList,
    handleClickPlusIcon,
    selectedData,
    handleClickPenIcon,
  } = usePriceEntryListTable();
  useEffect(() => {
    fetchDataList();
  }, []);

  const renderTableRows = () => {
    if (!dataList || !dataList.length) return <NoDataTable />;

    return (
      <>
        {dataList.map((data) => (
          <TableRow key={data.id}>
            {headerList.map((header) => {
              let cellContent = "";
              let cellClass = "";
              if (header.key === "displayCode") {
                cellContent = data.displayCode;
              } else if (header.key === "origin") {
                cellContent = data.origin.province!;
              } else if (header.key === "destination") {
                cellContent = data.destination.province!;
              } else if (header.key === "distance") {
                cellContent = "ระยะทาง";
              } else if (
                Object.values(ETruckSize).includes(header.key as ETruckSize)
              ) {
                const priceEntry = data.priceEntries.find(
                  (entry) => entry.truckSize === header.key
                );
                cellContent = priceEntry?.price ? `${priceEntry.price}` : "";
                cellClass =
                  "bg-red-500 min-h-10 bg-primary-blue-02 text-secondary-indigo-main font-bold text-center lg: min-w-20";
              } else if (header.key === "action") {
                return (
                  <TableCell
                    key={header.key}
                    className={`w-[${header.width}] flex gap-3 text-base font-medium`}
                  >
                    <Icons
                      name="Plus"
                      className="w-6 h-6 cursor-pointer"
                      onClick={() => handleClickPlusIcon(data)}
                    />
                    <Icons
                      name="Pen"
                      className="w-6 h-6 cursor-pointer"
                      onClick={() => handleClickPenIcon(data)}
                    />
                  </TableCell>
                );
              }

              return (
                <TableCell
                  className={`w-[${header.width}] text-sm break-words ${cellClass} `}
                  key={header.key}
                >
                  {cellContent}
                </TableCell>
              );
            })}
          </TableRow>
        ))}
      </>
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
                  {Object.values(ETruckSize).includes(key as ETruckSize) ? (
                    <div className="bg-secondary-indigo-main text-white p-4 min-h-20 font-bold text-nowrap">
                      {label}
                    </div>
                  ) : (
                    label
                  )}
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
      <AddPriceEntryModal
        open={openAddModal}
        setOpen={setOpenAddModal}
        address={`${selectedData?.origin.province} - ${selectedData?.destination.province}`}
        masterRouteId={selectedData?.id}
        fetchData={fetchDataList}
      />
      <EditPriceEntryModal
        open={openEditModal}
        setOpen={setOpenEditModal}
        priceEntriesListProp={selectedData?.priceEntries}
        address={`${selectedData?.origin.province} - ${selectedData?.destination.province}`}
        fetchData={fetchDataList}
      />
    </React.Fragment>
  );
}
