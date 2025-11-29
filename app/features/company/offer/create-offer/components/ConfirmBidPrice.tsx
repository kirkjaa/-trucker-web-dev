import { useEffect, useState } from "react";
import Image from "next/image";

import { FieldBidModal } from "@/app/components/ui/featureComponents/FieldBidModal";
import SignatureModal from "@/app/components/ui/signature/SignatureModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { Icons } from "@/app/icons";
import { signatureApi } from "@/app/services/signature/signatureApi";
import { useRfqStore } from "@/app/store/rfq/rfqStore";
import { useSignatureStore } from "@/app/store/signature/signatureStore";
import { useUserStore } from "@/app/store/user/userStore";
import { EHttpStatusCode } from "@/app/types/enum";
import { IPriceOffer } from "@/app/types/offer/offerType";
import formatPhoneNumber from "@/app/utils/formatPhoneNumber";
import { imageToUrl } from "@/app/utils/imgToUrl";

interface ConfirmBidPriceProps {
  offerReason: string;
  priceOffers: IPriceOffer[];
  selectedSignature: number | null;
  setSelectedSignature: React.Dispatch<React.SetStateAction<number | null>>;
}

export default function ConfirmBidPrice({
  offerReason,
  priceOffers,
  selectedSignature,
  setSelectedSignature,
}: ConfirmBidPriceProps) {
  // Global State
  const rfqReceivedById = useRfqStore((state) => state.rfqReceivedById);
  const userMe = useUserStore((state) => state.userMe);
  const { signatures, setSignatures } = useSignatureStore((state) => ({
    signatures: state.signatures,
    setSignatures: state.setSignatures,
  }));

  // Local State
  const [isSignatureModalOpen, setIsSignatureModalOpen] =
    useState<boolean>(false);

  // Use Effect
  useEffect(() => {
    const fetchSign = async () => {
      const res = await signatureApi.getSignatures();

      if (res.statusCode === EHttpStatusCode.SUCCESS) {
        setSignatures(res.data);
      }
    };

    fetchSign();
  }, []);

  return (
    <>
      <div id="confirmBidPricePrint" className="px-5 flex flex-col gap-4">
        <h4 className="text-end text-secondary-indigo-main">ใบเสนอราคา</h4>

        <div className="flex justify-between">
          <div className="flex flex-col gap-2 border-b border-neutral-03 pb-5 w-[160%]">
            <FieldBidModal
              title="ชื่อบริษัท :"
              value={
                userMe?.organization?.name ? userMe?.organization?.name : "-"
              }
            />
            <FieldBidModal
              title="ที่ตั้ง :"
              value={
                userMe?.organization?.addresses
                  ? `${
                      userMe?.organization?.addresses?.[0].address
                    } ${userMe?.organization?.addresses?.[0].subdistrict.name_th} ${userMe?.organization?.addresses?.[0].district.name_th} ${userMe?.organization?.addresses?.[0].province.name_th} ${userMe?.organization?.addresses?.[0].zip_code}`
                  : "-"
              }
            />
            <FieldBidModal
              title="เบอร์โทร :"
              value={userMe?.phone ? formatPhoneNumber(userMe?.phone) : "-"}
            />
            {/* <FieldBidModal */}
            {/*   title="เลขประจำตัวผู้เสียภาษี :" */}
            {/*   value={userMe?.company?.taxId ? userMe?.company?.taxId : "-"} */}
            {/* /> */}
          </div>

          <div className="flex flex-col gap-2 w-full bg-modal-01 p-5 rounded-lg">
            <FieldBidModal title="วันที่ :" value="-" />
            <FieldBidModal title="เลขที่ :" value="-" />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <FieldBidModal
            title="ชื่อลูกค้า :"
            value={
              rfqReceivedById?.organization?.name
                ? rfqReceivedById?.organization?.name
                : "-"
            }
          />
          <FieldBidModal
            title="ที่ตั้ง :"
            value={
              rfqReceivedById?.organization?.addresses?.[0].address
                ? `${
                    rfqReceivedById?.organization?.addresses?.[0].address
                  } ${rfqReceivedById?.organization?.addresses?.[0].subdistrict.name_th} ${rfqReceivedById?.organization?.addresses?.[0].district.name_th} ${rfqReceivedById?.organization?.addresses?.[0].province.name_th} ${rfqReceivedById?.organization?.addresses?.[0].zip_code}`
                : "-"
            }
          />
          <FieldBidModal
            title="เบอร์โทร :"
            value={
              rfqReceivedById?.organization?.phone
                ? formatPhoneNumber(rfqReceivedById?.organization?.phone)
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
            {rfqReceivedById?.fuel_price
              ? rfqReceivedById?.fuel_price + " " + "บาท"
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
            {rfqReceivedById?.routes?.map((route, index) => {
              const offerDetail = priceOffers.find(
                (price) =>
                  price.organization_route_id === route.organization_route.id
              );
              const offerPrice =
                offerDetail?.offers.find((o) => o.is_base_price)?.price || "-";

              return (
                <TableRow className="hover:border-none border-b" key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{`${route?.organization_route?.master_route?.origin_province?.name_th}/${route?.organization_route?.master_route?.origin_district?.name_th}`}</TableCell>
                  <TableCell>{`${route?.organization_route?.master_route?.destination_province?.name_th}/${route?.organization_route?.master_route?.destination_district?.name_th}`}</TableCell>
                  <TableCell className="text-center">
                    {rfqReceivedById?.truck_type.name_th
                      ? rfqReceivedById?.truck_type.name_th
                      : "-"}
                  </TableCell>

                  <TableCell className="text-center bg-modal-table">
                    {offerPrice}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        <div className="flex flex-col gap-4">
          <div className="px-5 py-2 bg-modal-01 rounded-lg">
            <p className="text-base font-semibold text-secondary-indigo-main">
              หมายเหตุเพิ่มเติม
            </p>
          </div>
          <p className="body2 text-neutral-07">{offerReason || "-"}</p>
        </div>

        <div className="border p-5 rounded-lg flex gap-4 text-secondary-indigo-main">
          <div className="flex flex-col gap-2 w-full">
            <p className="text-sm font-semibold">ชื่อผู้เสนอราคา</p>
            {selectedSignature ? (
              (() => {
                const sign = signatures?.find(
                  (s) => s.id === selectedSignature
                );
                return (
                  <div
                    className="cursor-pointer flex items-center justify-center border border-dashed border-component-green bg-component-green/5 rounded-lg p-5 h-full"
                    onClick={() => setIsSignatureModalOpen(true)}
                  >
                    {sign?.is_image === "Y" ? (
                      <Image
                        src={imageToUrl(sign.image_url)}
                        width={200}
                        height={120}
                        className="w-auto h-auto"
                        alt="company sign"
                      />
                    ) : (
                      <h3>{sign?.text}</h3>
                    )}
                  </div>
                );
              })()
            ) : (
              <div
                className="cursor-pointer flex items-center justify-center border border-dashed border-component-green bg-component-green/5 rounded-lg p-5 h-full"
                onClick={() => setIsSignatureModalOpen(true)}
              >
                <Icons name="SignaturePenGreen" className="w-6 h-6" />
                <p className="button text-secondary-teal-green-04">
                  ลงนามผู้เสนอราคา
                </p>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2 w-full">
            <p className="text-sm font-semibold">ชื่อผู้อนุมัติราคา</p>
            <div className="flex items-center justify-center border bg-neutral-01 rounded-lg p-5 h-full">
              {rfqReceivedById?.signature?.is_image === "Y" ? (
                <Image
                  src={imageToUrl(rfqReceivedById?.signature?.image_url)}
                  width={200}
                  height={160}
                  className="w-auto h-auto"
                  alt="factory sign"
                />
              ) : (
                <h3>{rfqReceivedById?.signature?.text}</h3>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Signature Modal */}
      <SignatureModal
        isSignatureModalOpen={isSignatureModalOpen}
        setIsSignatureModalOpen={setIsSignatureModalOpen}
        setSelectedSignature={setSelectedSignature}
      />
    </>
  );
}
