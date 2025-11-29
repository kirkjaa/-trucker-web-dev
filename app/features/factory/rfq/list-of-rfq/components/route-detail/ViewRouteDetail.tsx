"use client";

import clsx from "clsx";

import useViewRouteDetail from "../../../hooks/useViewRouteDetail";

import OfferDetailModal from "./offer-detail-modal/OfferDetailModal";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableCustom,
  TableHead,
  TableHeader,
  TableRow,
  TableRowHead,
} from "@/app/components/ui/data-table";
import { CardDetail } from "@/app/components/ui/featureComponents/CardDetail";
import { ControlledPaginate } from "@/app/components/ui/pagination/ControlledPagination";
import usePagination from "@/app/hooks/usePagination";
import { Icons } from "@/app/icons";
import { IRfqRoute } from "@/app/types/rfq/rfqType";
import { translateTruckType } from "@/app/utils/translateTruckType";

export default function ViewRouteDetail() {
  // Hook
  const {
    rfqById,
    handleRowHover,
    headerLeftList,
    hoveredRoutesId,
    hoveredCaptionById,
    setHoveredCaptionById,
    isModalOfferOpen,
    setIsModalOfferOpen,
    handleClickOpenOfferModal,
  } = useViewRouteDetail();
  const {
    page,
    setPage,
    limit,
    setLimit,
    total,
    totalPages,
    paginatedRows,
    indexPaginate,
  } = usePagination(rfqById?.routes ?? []);

  // Render Table Row
  const renderLeftTableRows = () => {
    return (
      <>
        {paginatedRows?.map((route: IRfqRoute, index: number) => (
          <TableRow
            key={index}
            onMouseEnter={() => handleRowHover(route.organization_route.id)}
            onMouseLeave={() => handleRowHover(null)}
          >
            <TableCell className="w-[1%]">
              {indexPaginate + index + 1}
            </TableCell>
            <TableCell className="w-[30%]">{`${route.organization_route.master_route.origin_province.name_th}/${route.organization_route.master_route.origin_district.name_th}`}</TableCell>
            <TableCell className="w-[30%]">{`${route.organization_route.master_route.destination_province.name_th}/${route.organization_route.master_route.destination_district.name_th}`}</TableCell>
            <TableCell className="w-[14%]">
              {route.organization_route.distance_value}
            </TableCell>
            <TableCell className="w-[15%]">{route.base_price}</TableCell>
          </TableRow>
        ))}
      </>
    );
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex gap-4 justify-between w-[100%]">
          <CardDetail
            iconName="TruckType"
            title="ประเภทของรถ"
            value={
              rfqById?.truck_type.name_th
                ? translateTruckType(rfqById?.truck_type.name_th)
                : "-"
            }
          />
          <CardDetail
            iconName="OilPrice"
            title="ราคาน้ำมัน"
            value={rfqById?.fuel_price ? rfqById?.fuel_price.toString() : "-"}
            value2={" " + "บาท/ลิตร"}
          />

          <CardDetail
            iconName="OilUpPrice"
            title="ราคาผันขึ้น"
            value={
              rfqById?.price_changes_up
                ? rfqById?.price_changes_up + " " + "%"
                : "-"
            }
            iconName2="ChevronUpBulk"
            oilUp
          />
          <CardDetail
            iconName="OilDownPrice"
            title="ราคาผันลง"
            value={
              rfqById?.price_changes_down
                ? rfqById?.price_changes_down + " " + "%"
                : "-"
            }
            iconName2="ChevronDownBulk"
            oilDown
          />
        </div>

        <div className="flex gap-4">
          {/* Table Left */}
          <Table className="max-w-full">
            <TableHeader>
              <TableRowHead className="bg-neutral-01">
                {headerLeftList.map(({ key, label, width }) => (
                  <TableHead
                    key={key}
                    className={`w-[${width}] text-sm flex items-center gap-1`}
                  >
                    {label}
                  </TableHead>
                ))}
              </TableRowHead>
            </TableHeader>
            <TableBody>{renderLeftTableRows()}</TableBody>
            <TableCaption className="text-end">
              <p>ดูใบเสนอราคา</p>
            </TableCaption>
          </Table>

          {/* Table Right */}
          <div
            className={clsx(
              "flex gap-4 overflow-x-auto",
              {
                "w-[20%]": rfqById?.offers && rfqById?.offers.length === 1,
              },
              {
                "w-[28%]": rfqById?.offers && rfqById?.offers.length === 2,
              },
              {
                "w-[50%]": rfqById?.offers && rfqById?.offers.length > 2,
              },
              {
                "w-0": rfqById?.offers && rfqById?.offers.length === 0,
              }
            )}
          >
            {rfqById?.offers.map((offer, index) => (
              <TableCustom
                className="w-fit h-fit gap-0 hover:border hover:border-secondary-caribbean-green-main hover:rounded-t-md hover:rounded-b-xl"
                key={index}
              >
                <TableHeader className="mb-2 ">
                  <TableRowHead className="bg-neutral-01 justify-center">
                    <TableHead className="flex items-center text-center gap-3 justify-center">
                      <Icons name="PinBar" className="w-6 h-6" />
                      <p className="line-clamp-1">{offer.organization.name}</p>
                      <Icons name="InfoGreen" className="w-5 h-5" />
                    </TableHead>
                  </TableRowHead>
                </TableHeader>

                <TableBody>
                  {offer.routes
                    .filter((route) => route.is_base_price === "Y")
                    .map((route, index) => (
                      <TableRow className="hover:border-none" key={index}>
                        <TableCell
                          className={clsx("w-full text-end", {
                            "bg-secondary-caribbean-green-main-hover":
                              hoveredRoutesId &&
                              route.organization_route.id === hoveredRoutesId,
                          })}
                        >
                          {route.price}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
                <TableCaption
                  className="bg-secondary-indigo-main hover:bg-secondary-teal-green-main text-white py-2 flex gap-1 items-center justify-center px-5 cursor-pointer"
                  onMouseEnter={() => setHoveredCaptionById(offer.id)}
                  onMouseLeave={() => setHoveredCaptionById(null)}
                  onClick={() => handleClickOpenOfferModal(offer.id)}
                >
                  <Icons
                    name={
                      hoveredCaptionById === offer.id
                        ? "DocumentBold"
                        : "SidebarPriceList"
                    }
                    className="w-6 h-6"
                  />
                  <p className="text-base">ใบเสนอราคา</p>
                </TableCaption>
              </TableCustom>
            ))}
          </div>
        </div>

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

      {/* Modal */}
      <OfferDetailModal
        isModalOfferOpen={isModalOfferOpen}
        setIsModalOfferOpen={setIsModalOfferOpen}
      />
    </>
  );
}
