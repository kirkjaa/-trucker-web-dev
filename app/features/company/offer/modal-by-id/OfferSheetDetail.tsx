import Image from "next/image";

import { FieldBidModal } from "@/app/components/ui/featureComponents/FieldBidModal";
import { ControlledPaginate } from "@/app/components/ui/pagination/ControlledPagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import usePagination from "@/app/hooks/usePagination";
import { useOfferStore } from "@/app/store/offer/offerStore";
import { IOfferRoute } from "@/app/types/offer/offerType";
import { formatISOToDate } from "@/app/utils/formatDate";
import { formatId } from "@/app/utils/formatId";
import formatPhoneNumber from "@/app/utils/formatPhoneNumber";
import { imageToUrl } from "@/app/utils/imgToUrl";

export const OfferSheetDetail = () => {
  // Global State
  const offerById = useOfferStore((state) => state.offerById);

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
  } = usePagination(offerById?.routes ?? []);

  return (
    <>
      {/* Content */}
      <div id="bidModalDetailPrint" className="px-5 flex flex-col gap-4">
        <h4 className="text-end text-secondary-indigo-main">ใบเสนอราคา</h4>

        <div className="flex justify-between">
          <div className="flex flex-col gap-2 border-b border-neutral-03 pb-5 w-[160%]">
            <FieldBidModal
              title="ชื่อบริษัท :"
              value={
                offerById?.organization.name
                  ? offerById?.organization.name
                  : "-"
              }
            />
            <FieldBidModal
              title="ที่ตั้ง :"
              value={
                offerById?.organization?.addresses?.[0].address
                  ? `${
                      offerById?.organization?.addresses?.[0].address
                    } ${offerById?.organization?.addresses?.[0].subdistrict.name_th} ${offerById?.organization?.addresses?.[0].district.name_th} ${offerById?.organization?.addresses?.[0].province.name_th} ${offerById?.organization?.addresses?.[0].zip_code}`
                  : "-"
              }
            />
            <FieldBidModal
              title="เบอร์โทร :"
              value={
                offerById?.organization?.phone
                  ? formatPhoneNumber(offerById?.organization?.phone)
                  : "-"
              }
            />
            {/* <FieldBidModal */}
            {/*   title="เลขประจำตัวผู้เสียภาษี :" */}
            {/*   value={bidById?.companyData?.taxId || "-"} */}
            {/* /> */}
          </div>

          <div className="flex flex-col gap-2 w-full bg-modal-01 p-5 rounded-lg">
            <FieldBidModal
              title="วันที่ :"
              value={
                (offerById?.created_date &&
                  formatISOToDate.toShortFormat(offerById?.created_date)) ||
                "-"
              }
            />
            <FieldBidModal
              title="เลขที่ :"
              value={
                offerById?.display_code
                  ? formatId(offerById?.display_code)
                  : "-"
              }
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <FieldBidModal
            title="ชื่อลูกค้า :"
            value={offerById?.rfq?.organization?.name ?? "-"}
          />
          <FieldBidModal
            title="ที่ตั้ง :"
            value={
              offerById?.rfq?.organization?.addresses?.[0].address
                ? `${
                    offerById?.rfq?.organization?.addresses?.[0].address
                  } ${offerById?.rfq?.organization?.addresses?.[0].subdistrict.name_th} ${offerById?.rfq?.organization?.addresses?.[0].district.name_th} ${offerById?.rfq?.organization?.addresses?.[0].province.name_th} ${offerById?.rfq?.organization?.addresses?.[0].zip_code}`
                : "-"
            }
          />
          <FieldBidModal
            title="เบอร์โทร :"
            value={
              offerById?.rfq?.organization?.phone
                ? formatPhoneNumber(offerById?.rfq?.organization?.phone)
                : "-"
            }
          />
        </div>

        <div className="px-5 py-2 bg-modal-01 rounded-lg">
          <p className="text-base font-semibold text-secondary-indigo-main">
            รายละเอียดของงาน
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <p>ราคาน้ำมัน</p>
          <p className="text-base font-semibold text-neutral-09">
            {offerById?.rfq.fuel_price
              ? offerById?.rfq.fuel_price + " " + "บาท"
              : "-"}
          </p>
        </div>

        {/* Table */}
        <Table>
          <TableHeader>
            <TableRow className="bg-modal-01">
              <TableHead>#</TableHead>
              <TableHead>ต้นทาง</TableHead>
              <TableHead>ปลายทาง</TableHead>
              <TableHead className="text-center">ประเภทรถ</TableHead>
              <TableHead className="text-center bg-secondary-indigo-02">
                ราคาขนส่ง
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedRows?.map((route: IOfferRoute, index: number) => (
              <TableRow className="hover:border-none border-b" key={index}>
                <TableCell>{indexPaginate + index + 1}</TableCell>
                <TableCell>
                  {`${route?.master_route?.origin_province?.name_th}/${route?.master_route?.origin_district?.name_th}` ||
                    "-"}
                </TableCell>
                <TableCell>
                  {`${route?.master_route?.destination_province?.name_th}/${route?.master_route?.destination_district?.name_th}` ||
                    "-"}
                </TableCell>
                <TableCell className="text-center">
                  {offerById?.rfq?.truck_type?.name_th
                    ? offerById?.rfq?.truck_type?.name_th
                    : "-"}
                </TableCell>
                <TableCell className="text-center bg-modal-table">
                  {route?.offer_routes.find(
                    (routeOffer) => routeOffer.is_base_price === "Y"
                  )?.price ?? "-"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
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
          className="bg-white rounded-lg px-4 py-2 shadow-table"
        />

        <div className="flex flex-col gap-4">
          <div className="px-5 py-2 bg-modal-01 rounded-lg">
            <p className="text-base font-semibold text-secondary-indigo-main">
              หมายเหตุเพิ่มเติม
            </p>
          </div>
          <p className="body2 text-neutral-07">
            {offerById?.remark || "ไม่มีหมายเหตุเพิ่มเติม"}
          </p>
        </div>

        <div className="border p-5 rounded-lg flex gap-4 text-secondary-indigo-main">
          <div className="flex flex-col gap-2 w-full">
            <p className="text-sm font-semibold">ชื่อผู้เสนอราคา</p>
            <div className="flex items-center justify-center border bg-neutral-01 rounded-lg p-5">
              {offerById?.signature.is_image === "Y" ? (
                <Image
                  src={imageToUrl(offerById?.signature?.image_url)}
                  width={200}
                  height={160}
                  className="w-auto h-auto"
                  alt="company sign"
                />
              ) : (
                <h3>{offerById?.signature?.text}</h3>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2 w-full">
            <p className="text-sm font-semibold">ชื่อผู้อนุมัติราคา</p>
            <div className="flex items-center justify-center border bg-neutral-01 rounded-lg p-5">
              {offerById?.rfq?.signature?.is_image === "Y" ? (
                <Image
                  src={imageToUrl(offerById?.rfq?.signature?.image_url)}
                  width={200}
                  height={160}
                  className="w-auto h-auto"
                  alt="factory sign"
                />
              ) : (
                <h3>{offerById?.rfq?.signature?.text}</h3>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
