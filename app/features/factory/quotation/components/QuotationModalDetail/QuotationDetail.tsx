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
import { useQuotationStore } from "@/app/store/quotation/quotationStore";
import { IRouteQuotationOffer } from "@/app/types/offer/offerType";
import { formatISOToDate } from "@/app/utils/formatDate";
import { formatId } from "@/app/utils/formatId";
import formatPhoneNumber from "@/app/utils/formatPhoneNumber";
import { imageToUrl } from "@/app/utils/imgToUrl";

export const QuotationDetail = () => {
  // Global State
  const quotationById = useQuotationStore((state) => state.quotationById);

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
  } = usePagination(quotationById?.offer.routes ?? []);

  return (
    <>
      {/* Content */}
      <div id="quotationDetailPrint" className="px-5 flex flex-col gap-4">
        <h4 className="text-end text-secondary-indigo-main">ใบเสนอราคา</h4>

        <div className="flex justify-between">
          <div className="flex flex-col gap-2 border-b border-neutral-03 pb-5 w-[160%]">
            <FieldBidModal
              title="ชื่อบริษัท :"
              value={
                quotationById?.offer?.organization?.name
                  ? quotationById?.offer?.organization?.name
                  : "-"
              }
            />
            <FieldBidModal
              title="ที่ตั้ง :"
              value={
                quotationById?.offer?.organization?.addresses?.[0].address
                  ? `${
                      quotationById?.offer?.organization?.addresses?.[0].address
                    } ${quotationById?.offer?.organization?.addresses?.[0].subdistrict.name_th} ${quotationById?.offer?.organization?.addresses?.[0].district.name_th} ${quotationById?.offer?.organization?.addresses?.[0].province.name_th} ${quotationById?.offer?.organization?.addresses?.[0].zip_code}`
                  : "-"
              }
            />
            <FieldBidModal
              title="เบอร์โทร :"
              value={
                quotationById?.offer?.organization?.phone
                  ? formatPhoneNumber(quotationById?.offer?.organization?.phone)
                  : "-"
              }
            />
            {/* <FieldBidModal */}
            {/*   title="เลขประจำตัวผู้เสียภาษี :" */}
            {/*   value={ */}
            {/*     quotationById?.bidsData?.companyData */}
            {/*       ? quotationById?.bidsData?.companyData.taxId */}
            {/*       : "-" */}
            {/*   } */}
            {/* /> */}
          </div>

          <div className="flex flex-col gap-2 w-full bg-modal-01 p-5 rounded-lg">
            <FieldBidModal
              title="วันที่ :"
              value={
                (quotationById?.created_date &&
                  formatISOToDate.toShortFormat(quotationById?.created_date)) ||
                "-"
              }
            />
            <FieldBidModal
              title="เลขที่ :"
              value={
                quotationById?.display_code
                  ? formatId(quotationById?.display_code)
                  : "-"
              }
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <FieldBidModal
            title="ชื่อลูกค้า :"
            value={quotationById?.quotation_rfq?.organization?.name ?? "-"}
          />
          <FieldBidModal
            title="ที่ตั้ง :"
            value={
              quotationById?.quotation_rfq?.organization?.addresses?.[0].address
                ? `${
                    quotationById?.quotation_rfq?.organization?.addresses?.[0]
                      .address
                  } ${quotationById?.quotation_rfq?.organization?.addresses?.[0].subdistrict.name_th} ${quotationById?.quotation_rfq?.organization?.addresses?.[0].district.name_th} ${quotationById?.quotation_rfq?.organization?.addresses?.[0].province.name_th} ${quotationById?.quotation_rfq?.organization?.addresses?.[0].zip_code}`
                : "-"
            }
          />
          <FieldBidModal
            title="เบอร์โทร :"
            value={
              quotationById?.quotation_rfq?.organization?.phone
                ? formatPhoneNumber(
                    quotationById?.quotation_rfq?.organization?.phone
                  )
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
            {quotationById?.quotation_rfq?.fuel_price
              ? quotationById?.quotation_rfq?.fuel_price + " " + "บาท"
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
            {paginatedRows?.map(
              (route: IRouteQuotationOffer, index: number) => {
                const r = route?.offer_routes?.find(
                  (item) => item.is_base_price === "Y"
                );

                return (
                  <TableRow className="hover:border-none border-b" key={index}>
                    <TableCell>{indexPaginate + index + 1}</TableCell>
                    <TableCell>
                      {`${route?.organization_route?.master_route?.origin_province?.name_th}/${
                        route?.organization_route?.master_route?.origin_district
                          ?.name_th
                      }` || "-"}
                    </TableCell>
                    <TableCell>
                      {`${route?.organization_route?.master_route?.destination_province?.name_th}/${
                        route?.organization_route?.master_route
                          ?.destination_district?.name_th
                      }` || "-"}
                    </TableCell>
                    <TableCell className="text-center">
                      {quotationById?.quotation_rfq?.truck_type?.name_th || "-"}
                    </TableCell>
                    <TableCell className="text-center bg-modal-table">
                      {r?.price || "-"}
                    </TableCell>
                  </TableRow>
                );
              }
            )}
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
            {`${
              quotationById?.quotation_rfq?.remark
                ? `${quotationById?.quotation_rfq?.remark}`
                : "-"
            }` +
              `${
                quotationById?.offer?.remark
                  ? `, ${quotationById?.offer?.remark}`
                  : ""
              }` || "ไม่มีหมายเหตุเพิ่มเติม"}
          </p>
        </div>

        <div className="border p-5 rounded-lg flex gap-4 text-secondary-indigo-main">
          <div className="flex flex-col gap-2 w-full">
            <p className="text-sm font-semibold">ชื่อผู้เสนอราคา</p>
            <div className="flex items-center justify-center border bg-neutral-01 rounded-lg p-5">
              {quotationById?.offer?.signature?.is_image === "Y" ? (
                <Image
                  src={imageToUrl(quotationById?.offer?.signature?.image_url)}
                  width={200}
                  height={160}
                  className="w-auto h-auto"
                  alt="company sign"
                />
              ) : (
                <h3>{quotationById?.offer?.signature?.text}</h3>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2 w-full">
            <p className="text-sm font-semibold">ชื่อผู้อนุมัติราคา</p>
            <div className="flex items-center justify-center border bg-neutral-01 rounded-lg p-5">
              {quotationById?.quotation_rfq?.signature?.is_image === "Y" ? (
                <Image
                  src={imageToUrl(
                    quotationById?.quotation_rfq?.signature?.image_url
                  )}
                  width={200}
                  height={160}
                  className="w-auto h-auto"
                  alt="factory sign"
                />
              ) : (
                <h3>{quotationById?.quotation_rfq?.signature?.text}</h3>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
