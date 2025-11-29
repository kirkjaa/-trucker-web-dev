import clsx from "clsx";
import { usePathname } from "next/navigation";

import LatLngModal from "../../../../components/ui/featureComponents/LatLngModal";
import useRouteCodeTable from "../hooks/useRouteCodeTable";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableRowHead,
} from "@/app/components/ui/data-table";
import { ControlledPaginate } from "@/app/components/ui/pagination/ControlledPagination";
import { Icons } from "@/app/icons";
import { useRouteStore } from "@/app/store/routeStore";
import { EFacPathName, ERouteStatus } from "@/app/types/enum";

export default function RouteCodeTable() {
  // Global State
  const { routeFactoryList, getRouteFactorySearchParams } = useRouteStore();

  // Hook
  const {
    headerList,
    handleSort,
    setPage,
    setLimit,
    latLngByType,
    openLatLngModal,
    setOpenLatLngModal,
    handleClickOpenLatLngModal,
  } = useRouteCodeTable();
  const pathName = usePathname();

  // Render Table Row
  const renderTableRows = () => {
    if (!routeFactoryList) return null;

    const rowsToFill =
      getRouteFactorySearchParams().limit - routeFactoryList.length;

    return routeFactoryList && routeFactoryList.length > 0 ? (
      <>
        {routeFactoryList.map((data) => (
          <TableRow key={data.id}>
            <TableCell className="w-[15%]">
              {data.masterRoute.displayCode}
            </TableCell>
            <TableCell className="w-[15%] truncate">
              {data.routeFactoryCode}
            </TableCell>
            {/* <TableCell className="w-[15%] break-words">
              {data.factory.name}
            </TableCell> */}
            <TableCell
              className={clsx("w-[15%]", {
                hidden: pathName === EFacPathName.DOMESTIC_ROUTE,
              })}
            >
              {data.masterRoute.returnPoint
                ? data.masterRoute.returnPoint.province +
                  " " +
                  data.masterRoute.returnPoint.district
                : "-"}
              <div
                onClick={() => handleClickOpenLatLngModal(data, "returnPoint")}
                className={clsx(
                  "text-secondary-caribbean-green-main cursor-pointer",
                  {
                    hidden: !data.masterRoute.returnPoint,
                  }
                )}
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
            <TableCell className="w-[15%]">
              {data.masterRoute.origin.province +
                " " +
                data.masterRoute.origin.district}
              <div
                onClick={() => handleClickOpenLatLngModal(data, "origin")}
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
            <TableCell className="w-[15%]">
              {data.masterRoute.destination.province +
                " " +
                data.masterRoute.destination.district}
              <div
                onClick={() => handleClickOpenLatLngModal(data, "destination")}
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
            <TableCell className="w-[10%]">{data.distance.value}</TableCell>
            <TableCell className="w-[15%]">
              <p
                className={clsx(
                  "text-neutral-07 bg-neutral-03 px-4 py-1 w-fit rounded-3xl",
                  {
                    "text-secondary-caribbean-green-04 bg-toast-success-background":
                      data.status === ERouteStatus.CONFIRMED,
                  },
                  {
                    "text-process-02 bg-toast-warning-background":
                      data.status === ERouteStatus.PENDING,
                  }
                )}
              >
                {data.status === ERouteStatus.CONFIRMED
                  ? "• ยืนยันแล้ว"
                  : data.status === ERouteStatus.PENDING
                    ? "• รอตอบรับ"
                    : "• ปฏิเสธ"}
              </p>
            </TableCell>
          </TableRow>
        ))}
        {/* Render empty rows to fill the table */}
        {Array.from({ length: rowsToFill }, (_, index) => (
          <TableRow key={`empty-${index}`} className="hover:border-none">
            <TableCell colSpan={7} className="h-[2.6rem]">
              &nbsp;
            </TableCell>
          </TableRow>
        ))}
      </>
    ) : (
      <TableRow className="hover:border-none flex justify-center items-center">
        <TableCell
          colSpan={8}
          className={clsx("py-40 font-semibold text-secondary-200", {
            "py-80": getRouteFactorySearchParams().limit === 10,
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
                  className={clsx(`w-[${width}] flex items-center gap-1`, {
                    hidden:
                      key === "returnPoint" &&
                      pathName === EFacPathName.DOMESTIC_ROUTE,
                  })}
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
            page: getRouteFactorySearchParams().page,
            limit: getRouteFactorySearchParams().limit,
            totalPages: getRouteFactorySearchParams().totalPages,
            total: getRouteFactorySearchParams().total,
          }}
          setPage={setPage}
          setLimit={setLimit}
          className="bg-white rounded-lg p-4 shadow-table"
        />
      </div>

      <LatLngModal
        lattitude={latLngByType?.latitude || ""}
        longitude={latLngByType?.longitude || ""}
        open={openLatLngModal}
        setOpen={setOpenLatLngModal}
      />
    </>
  );
}
