import { useState } from "react";
import clsx from "clsx";

import EditDetailCsvModal from "./EditDetailCsvModal";

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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { ControlledPaginate } from "@/app/components/ui/pagination/ControlledPagination";
import usePagination from "@/app/hooks/usePagination";
import { Icons } from "@/app/icons";
import { useUserStore } from "@/app/store/userStore";
import { RowObject } from "@/app/types/global";
import { IRouteForCheck } from "@/app/types/routesType";
import { cn } from "@/lib/utils";

interface DetailCsvModalProps {
  csvData: RowObject[];
  handleClickCheckDuplicateRouteFactory: (
    factoryId: string,
    routes: IRouteForCheck[]
  ) => void;
  transformedData: RowObject[];
  setTransformedData: React.Dispatch<React.SetStateAction<RowObject[]>>;
}

export default function DetailCsvModal({
  csvData,
  handleClickCheckDuplicateRouteFactory,
  transformedData,
  setTransformedData,
}: DetailCsvModalProps) {
  // Global State
  const { userMe } = useUserStore();

  // Local State
  const [selectedRow, setSelectedRow] = useState<RowObject | null>(null);
  const [isOpenEditModal, setIsOpenEditModal] = useState<boolean>(false);

  // Hook
  const {
    page,
    setPage,
    limit,
    setLimit,
    total,
    totalPages,
    paginatedRows,
    indexPaginate,
  } = usePagination(transformedData);

  // Function
  const transformedDataForCheckDup = {
    routes: transformedData.map((item) => ({
      routeFactoryCode: item["routeFactoryCode"],
      origin: {
        district: item["originDistrict"],
        province: item["originProvince"],
      },
      destination: {
        district: item["destinationDistrict"],
        province: item["destinationProvince"],
      },
      offerPrice: item["price"],
      unit: item["unit"],
    })),
  };

  const handleEditClick = (row: RowObject) => {
    setSelectedRow(row);
    setIsOpenEditModal(true);
  };

  const handleSaveToEdit = (updatedData: RowObject | null) => {
    if (updatedData) {
      setTransformedData((prevData) =>
        prevData.map((row) =>
          row["routeFactoryCode"] === updatedData["routeFactoryCode"]
            ? updatedData
            : row
        )
      );
    }
    setIsOpenEditModal(false);
  };

  // Render Table Headers
  const renderTableHeaders = () => {
    const keys = csvData.length > 0 ? Object.keys(csvData[0]) : [];
    return (
      <TableRowHead className="bg-sidebar-bg-hover">
        <TableHead className="w-[1%]">#</TableHead>
        {keys.map((key, index) => (
          <TableHead
            key={index}
            // style={{
            //   width:
            //     index === 0
            //       ? "12%"
            //       : [6, 9].includes(index)
            //         ? "24%"
            //         : [1, 2, 3].includes(index)
            //           ? "10%"
            //           : [10].includes(index)
            //             ? "13%"
            //             : [11, 12].includes(index)
            //               ? "9%"
            //               : "11%",
            //   textAlign: index === 10 ? "end" : "start",
            // }}
            className={cn("w-[20%]", {
              "w-[14%]": index !== 3 && index !== 6,
            })}
          >
            {key}
          </TableHead>
        ))}
        <TableHead className="w-[3%]"></TableHead>
      </TableRowHead>
    );
  };

  // Render Table Rows
  const renderTableRows = () => {
    const rowsToFill = limit - paginatedRows.length;

    return paginatedRows && paginatedRows.length > 0 ? (
      <>
        {paginatedRows.map((data: RowObject, rowIndex: number) => (
          <TableRow key={rowIndex} className="hover:border-none">
            <TableCell className="w-[1%]">
              {indexPaginate + rowIndex + 1}
            </TableCell>
            {Object.values(data).map((value, cellIndex) => (
              <TableCell
                key={cellIndex}
                className={cn("w-[20%]", {
                  "w-[14%]": cellIndex !== 3 && cellIndex !== 6,
                })}
              >
                {value}
              </TableCell>
            ))}
            <TableCell className="w-[3%]">
              <Icons
                name="Pen"
                className="w-6 h-6 cursor-pointer"
                onClick={() => handleEditClick(data)}
              />
            </TableCell>
          </TableRow>
        ))}
        {/* Render empty rows to fill the table */}
        {Array.from({ length: rowsToFill }, (_, index) => (
          <TableRow key={`empty-${index}`} className="hover:border-none">
            <TableCell
              colSpan={Object.keys(csvData[0] || {}).length + 1}
              className="h-[2.6rem]"
            >
              &nbsp;
            </TableCell>
          </TableRow>
        ))}
      </>
    ) : (
      <TableRow className="hover:border-none flex justify-center items-center">
        <TableCell
          colSpan={Object.keys(csvData[0] || {}).length + 1}
          className={clsx("py-40 font-semibold text-secondary-200", {
            "py-80": 10,
          })}
        >
          <h4 className="h-10">No data found</h4>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <>
      <div className="flex flex-col gap-5">
        <div className="flex justify-between items-center bg-modal-01 px-5 py-3 rounded-lg">
          <p className="text-xl font-medium">
            ผลลัพธ์{" "}
            <span className="text-secondary-teal-green-main">
              {csvData.length + " " + "รายการ"}
            </span>
          </p>

          <Button
            className="py-1 px-7"
            onClick={() =>
              handleClickCheckDuplicateRouteFactory(
                userMe?.factory?.id ?? "",
                transformedDataForCheckDup.routes
              )
            }
          >
            ยืนยันการนำเข้า
          </Button>
        </div>

        <div className="flex flex-col px-5">
          <Table className="w-full">
            <TableHeader>{renderTableHeaders()}</TableHeader>
            <TableBody>{renderTableRows()}</TableBody>
          </Table>

          <ControlledPaginate
            configPagination={{
              page,
              limit,
              totalPages,
              total,
            }}
            setPage={(page) => setPage(page)}
            setLimit={(limit) => {
              setLimit(limit);
              setPage(1);
            }}
            className="bg-white rounded-lg p-4 shadow-table"
          />
        </div>
      </div>

      <Dialog open={isOpenEditModal} onOpenChange={setIsOpenEditModal}>
        <DialogContent className="text-secondary-indigo-main" removeCloseBtn>
          <DialogHeader>
            <DialogTitle>
              <p className="text-xl font-bold">ข้อมูลลูกค้า / กำหนดเส้นทาง</p>
            </DialogTitle>
          </DialogHeader>

          {selectedRow && (
            <EditDetailCsvModal
              rowData={selectedRow}
              handleSaveToEdit={handleSaveToEdit}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
