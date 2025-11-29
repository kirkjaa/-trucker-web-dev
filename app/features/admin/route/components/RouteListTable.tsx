"use client";

import React, { useEffect } from "react";
import clsx from "clsx";

import FactoriesAndCompaniesLatLngModal from "../../components/FactoriesAndCompaniesLatLngModal";
import useRouteListTable from "../hooks/useRouteListTable";

import CreateRouteModal from "./CreateRouteModal";
import StatusRoute from "./StatusRoute";

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
import NoDataTable from "@/app/components/ui/featureComponents/NoDataTable";
import { ControlledPaginate } from "@/app/components/ui/pagination/ControlledPagination";
import { Icons } from "@/app/icons";
import { useRouteStore } from "@/app/store/route/routeStore";
import { formatValueUnit } from "@/app/utils/formatValueUnit";

export default function RouteListTable() {
  // Global State
  const { routes, getRouteParams } = useRouteStore((state) => ({
    routes: state.routes,
    getRouteParams: state.getRouteParams,
  }));

  // Hook
  const {
    sorting,
    headerList,
    handleSort,
    pathName,
    // setByShippingType,
    fetchDataList,
    // dataList,
    byShippingType,
    setOpenCreateModal,
    getOpenCreateModal,
    // pagination,
    handleChangePage,
    handleChangeLimit,
    handleClickOpenLatLngModal,
    // fetchFormList,
    openLatLngModal,
    setOpenLatLngModal,
    latLngByType,
    // setByType,
    byType,
    // handleClickPen,
    // typeForm,
    handleConfirm,
    dataEdit,
    /* getFormCreate, */
    // setFormData,
    // setDataEdit,
    handleReject,
  } = useRouteListTable();

  /* const routeConfig: Record< */
  /*   string, */
  /*   { shipping?: ERouteShippingType; type: ERouteType } */
  /* > = { */
  /*   [EAdminPathName.CONFIRMDOMESTICROUTE]: { */
  /*     shipping: ERouteShippingType.LANDFREIGHT, */
  /*     type: ERouteType.ONEWAY, */
  /*   }, */
  /*   [EAdminPathName.CONFIRMINTERNATIONALROUTE]: { */
  /*     type: ERouteType.ABROAD, */
  /*   }, */
  /*   [EAdminPathName.CREATEINTERNATIONALROUTE]: { */
  /*     shipping: ERouteShippingType.AIRFREIGHT, */
  /*     type: ERouteType.ABROAD, */
  /*   }, */
  /*   [EAdminPathName.CREATEDOMESTICROUTE]: { */
  /*     shipping: ERouteShippingType.LANDFREIGHT, */
  /*     type: ERouteType.ONEWAY, */
  /*   }, */
  /*   [EAdminPathName.DOMESTICROUTE]: { */
  /*     shipping: ERouteShippingType.LANDFREIGHT, */
  /*     type: ERouteType.ONEWAY, */
  /*   }, */
  /*   [EAdminPathName.INTERNATIONALROUTE]: { */
  /*     // shipping: ERouteShippingType.AIRFREIGHT, */
  /*     type: ERouteType.ABROAD, */
  /*   }, */
  /* }; */

  /* useEffect(() => { */
  /*   if (!openModalCreate) { */
  /*     setDataEdit(undefined); */
  /**/
  /*     if (routeConfig[pathName]) { */
  /*       if (routeConfig[pathName].shipping) { */
  /*         setByShippingType(routeConfig[pathName].shipping); */
  /*       } */
  /*       setByType(routeConfig[pathName].type); */
  /*     } */
  /*   } */
  /* }, [openModalCreate]); */
  /**/
  /* useEffect(() => { */
  /*   setFormData(getFormCreate()); */
  /* }, [getFormCreate()]); */

  useEffect(() => {
    fetchDataList();
  }, [sorting]);

  const renderTableRows = () => {
    if (!routes || routes.length === 0) return <NoDataTable />;

    return (
      <React.Fragment>
        {routes.map((data) => {
          return (
            <TableRow key={data.id}>
              {pathName.includes("create") ? (
                <TableCell className="w-[18%] text-sm break-words">
                  {data.id}
                </TableCell>
              ) : (
                <TableCell className="w-[18%] text-sm break-words">
                  {data.master_route.code}
                </TableCell>
              )}

              <TableCell className="w-[18%] text-sm break-words">
                {data?.organization_route_code}
              </TableCell>
              <TableCell className="w-[18%] text-sm break-words">
                {data?.organization.name}
              </TableCell>
              <TableCell className="w-[18%] text-sm break-words">
                {data?.master_route.origin_province.name_th +
                  " " +
                  data?.master_route?.origin_district.name_th}
                {/* {data?.master_route?.origin_district.name_th} */}
                <div
                  onClick={() => handleClickOpenLatLngModal(data, "origin")}
                  className="text-secondary-caribbean-green-main cursor-pointer"
                >
                  <p className="flex items-center break-words text-sm">
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
              <TableCell className="w-[18%] text-sm break-words">
                {data?.master_route?.destination_province.name_th +
                  " " +
                  data?.master_route?.destination_district.name_th}
                <div
                  onClick={() =>
                    handleClickOpenLatLngModal(data, "destination")
                  }
                  className="text-secondary-caribbean-green-main cursor-pointer"
                >
                  <p className="flex items-center break-words text-sm">
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
              <TableCell className="w-[18%] text-sm">
                {formatValueUnit(
                  Number(data?.distance_value),
                  data?.distance_unit.toLowerCase().charAt(0).toUpperCase() +
                    data?.distance_unit.toLowerCase().slice(1)
                )}
              </TableCell>
              <TableCell className="w-[12%] text-sm">
                <StatusRoute status={data.status} />
              </TableCell>
              {pathName.includes("create") && (
                <TableCell className="w-[6%] text-sm">
                  <Icons
                    name="Pen"
                    className="w-6 h-6 cursor-pointer"
                    /* onClick={() => handleClickPen(data)} */
                  />
                </TableCell>
              )}
              {pathName.includes("confirm") && (
                <React.Fragment>
                  <TableCell className="w-[10%] text-sm">
                    <Button
                      className="bg-green-700 text-xs sm:text-sm px-2 py-1 sm:px-4 sm:py-2"
                      onClick={() => handleConfirm(data.id)}
                    >
                      <Icons name="Check" className="w-2" /> อนุมัติ
                    </Button>
                  </TableCell>
                  <TableCell className="w-[15%] text-sm">
                    <Button
                      className="bg-red-500 text-xs sm:text-sm px-2 py-1 sm:px-4 sm:py-2"
                      onClick={() => handleReject(data.id)}
                    >
                      <Icons name="Cross" className="w-2" />
                      ไม่อนุมัติ
                    </Button>
                  </TableCell>
                </React.Fragment>
              )}
            </TableRow>
          );
        })}
      </React.Fragment>
    );
  };

  return (
    <React.Fragment>
      <div className="flex flex-col gap-2 w-full overflow-auto">
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
        <div className="w-full overflow-x-auto mt-4">
          <ControlledPaginate
            configPagination={{
              page: getRouteParams().page,
              limit: getRouteParams().limit,
              totalPages: getRouteParams().totalPages,
              total: getRouteParams().total,
            }}
            setPage={handleChangePage}
            setPageAfterSetLimit={false}
            setLimit={handleChangeLimit}
            className="bg-white rounded-lg p-4 shadow-table"
          />
        </div>
      </div>
      <CreateRouteModal
        byShippingType={byShippingType!}
        open={getOpenCreateModal()}
        setOpen={setOpenCreateModal}
        title="เพิ่มเส้นทาง"
        byType={byType!}
        // typeForm={typeForm}
        dataForm={dataEdit}
      />
      <FactoriesAndCompaniesLatLngModal
        lattitude={latLngByType?.latitude || ""}
        longitude={latLngByType?.longitude || ""}
        open={openLatLngModal}
        setOpen={setOpenLatLngModal}
      />
    </React.Fragment>
  );
}
