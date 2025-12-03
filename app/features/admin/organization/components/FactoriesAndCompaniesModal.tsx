"use client";

import React from "react";
import { usePathname } from "next/navigation";

import HistoryOfCoinUseListTable from "../../../../components/ui/featureComponents/HistoryOfCoinUseListTable";
import { IOrganization } from "../../../../types/organization/organizationType";
import FactoriesAndComponiesImageCard from "../../components/FactoriesAndComponiesImageCard";
import FactoriesAndComponiesLocationCard from "../../components/FactoriesAndComponiesLocationCard";

import FactoriesAndComponiesDetailCard from "./FactoriesAndComponiesDetailCard";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import MenuButton from "@/app/components/ui/featureComponents/MenuButton";
import { Icons } from "@/app/icons";
import { useGlobalStore } from "@/app/store/globalStore";
import { ICoinsByTruckerId } from "@/app/types/coinsType";
import { EAdminPathName } from "@/app/types/enum";

type FactoriesAndCompaniesModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  data: IOrganization | undefined;
  transactionCoins: ICoinsByTruckerId;
};

export default function FactoriesAndCompaniesModal({
  open,
  setOpen,
  data,
  transactionCoins,
}: FactoriesAndCompaniesModalProps) {
  const { currentStep } = useGlobalStore();

  const pathName = usePathname();
  const handleDownload = (
    documents: Array<{
      id: number;
      file_url: string;
      document_type: string;
    }>
  ) => {
    documents.forEach((element, index) => {
      setTimeout(() => {
        window.open(element.file_url, "_blank");
      }, index * 100);
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[900px]" outlineCloseButton>
        <DialogHeader className="w-full pb-[1rem]">
          <DialogTitle>
            <div className="font-bold text-lg flex gap-10 px-5 text-main-02 border-b">
              <MenuButton
                step={1}
                title={
                  pathName.includes(EAdminPathName.FACTORIES)
                    ? "ข้อมูลโรงงาน"
                    : "ข้อมูลบริษัท"
                }
                icon1="WorkPrimary"
                icon2="WorkGray"
              />
              <MenuButton
                step={2}
                title="ข้อมูลเอกสาร"
                icon1="DocumentGreen"
                icon2="DocumentBulk"
              />
              <MenuButton
                step={3}
                title="ประวัติการใช้ Coin"
                icon1="CoinsPrimary"
                icon2="CoinsGray"
              />
            </div>
          </DialogTitle>
        </DialogHeader>
        {currentStep === 1 && (
          <div className="flex flex-wrap justify-between gap-y-4 gap-x-2">
            <div className="w-full">
              <FactoriesAndComponiesDetailCard
                name={data?.name}
                email={data?.email}
                phone={data?.phone}
                adminName={
                  `${data?.owner_user?.first_name} ${data?.owner_user?.last_name}` ||
                  ""
                }
                imageUrl={data?.image_url || ""}
                pathName={pathName}
              />
            </div>
            <div className="w-[49%]">
              <FactoriesAndComponiesLocationCard
                latitude={
                  data?.addresses?.[0]?.latitude
                    ? data.addresses[0].latitude.toString()
                    : ""
                }
                longitude={
                  data?.addresses?.[0]?.longitude
                    ? data.addresses[0].longitude.toString()
                    : ""
                }
              />
            </div>
            <div className="w-[49%]">
              <FactoriesAndComponiesImageCard
                imageUrl={data?.image_url || ""}
                name={data?.name || ""}
                pathName={pathName}
              />
            </div>
          </div>
        )}
        {currentStep === 2 && (
          <>
            {data?.documents && data.documents.length ? (
              <React.Fragment>
                <div className="w-full bg-modal-01 h-14 rounded-lg flex justify-end items-center px-4 ">
                  <Icons
                    name="JpgDownload"
                    className="w-8 h-8 cursor-pointer mr-4"
                    onClick={() => handleDownload(data.documents)}
                  />
                  <p
                    className=" text-cyan-600 cursor-pointer hover:text-cyan-700"
                    onClick={() => handleDownload(data.documents)}
                  >
                    ดาวน์โหลดไฟล์เอกสารเปิดลูกค้าใหม่
                  </p>
                </div>
                <div className="bg-gray-100  min-h-[300px] p-4 flex flex-wrap justify-center rounded-lg gap-8">
                  {data?.documents.map((url, index) => (
                    <div key={url.id} className="w-full h-full">
                      <p className="text-gray-500 text-xs text-center mb-2">
                        {index + 1}/{data?.documents.length}
                      </p>
                      <iframe src={url.file_url} className="w-full h-full" />
                    </div>
                  ))}
                </div>
              </React.Fragment>
            ) : (
              <div className="bg-modal-01 h-32 flex justify-center items-center rounded-lg">
                No Data
              </div>
            )}
          </>
        )}
        {currentStep === 3 && (
          <HistoryOfCoinUseListTable transactionCoins={transactionCoins} />
        )}
      </DialogContent>
    </Dialog>
  );
}
