"use client";

import Image from "next/image";

import useCompanyListTable from "../../../hooks/useCompanyListTable";
import OfferDetailModal from "../route-detail/offer-detail-modal/OfferDetailModal";

import ExpandedTable from "./components/ExpandedTable";
import { TableHeaders } from "./components/Header";

import { Button } from "@/app/components/ui/button";
import HeaderWithBackStep from "@/app/components/ui/featureComponents/HeaderWithBackStep";
import ModalNotification from "@/app/components/ui/ModalNotification";
import { Icons } from "@/app/icons";
import { ERfqType } from "@/app/types/rfq/rfqEnum";
import { formatId } from "@/app/utils/formatId";
import placeHolderPerson from "@/public/placeHolderPerson.png";

export default function CompanyListTable() {
  // Hook
  const {
    rfqById,
    modalStates,
    setModalStates,
    expandedTables,
    handleNavigation,
    handleCompanyAction,
  } = useCompanyListTable();

  return (
    <>
      <div className="flex flex-col gap-5">
        {/* Header Navigation */}
        <HeaderWithBackStep
          onClick={handleNavigation.back}
          iconTitle="SidebarPriceList"
          title="เลือกบริษัทเสนอราคา"
          title2={
            rfqById?.type === ERfqType.ONEWAY
              ? "ส่งเที่ยวเดียว"
              : rfqById?.type === ERfqType.MULTIPLE
                ? "หลายเส้นทาง"
                : "นอกประเทศ"
          }
        />
        <div className="flex flex-col gap-2">
          {/* {rfqById?.rfqType === ERfqType.ABROAD && (
            <div className="flex gap-4 border py-2 px-5 rounded-lg">
              <p className="button text-secondary-dark-gray-main">
                ต้นทาง :{" "}
                <span className="text-secondary-indigo-main">
                  ชลบุรี Hard Code
                </span>
              </p>
              <p className="button text-secondary-dark-gray-main">
                จุดรับ/ส่งสินค้า (นอกประเทศ) :{" "}
                <span className="text-secondary-indigo-main">
                  ชลบุรี Hard Code
                </span>
              </p>
              <p className="button text-secondary-dark-gray-main">
                ปลายทาง :{" "}
                <span className="text-secondary-indigo-main">
                  ชลบุรี Hard Code
                </span>
              </p>
            </div>
          )} */}

          <div className="w-full text-base font-medium text-main-01 flex flex-col gap-2">
            <div className="bg-modal-01 p-4 text-left align-middle shadow-table rounded-md flex items-center justify-between w-full">
              {TableHeaders.map((header, index) => (
                <p key={index} className={header.className}>
                  {header.label}
                </p>
              ))}
            </div>
            <div className="flex flex-col gap-2 pb-2">
              {rfqById?.offers?.map((offer) => (
                <div key={offer.id}>
                  <div className="hover:border-none px-4 py-2 align-middle text-base font-normal text-neutral-08 shadow-table bg-white rounded-md flex items-center justify-between w-full">
                    {/* Table Row Header */}
                    <div className="w-[1%]">
                      <Icons
                        name={
                          expandedTables.includes(offer.id)
                            ? "ChevronDown"
                            : "ChevronRight"
                        }
                        className="w-6 h-6 cursor-pointer"
                        onClick={() =>
                          handleNavigation.toggleTableExpansion(offer.id)
                        }
                      />
                    </div>
                    <p className="w-[9%]">{formatId(offer.display_code)}</p>
                    <div className="w-[5%]">
                      <Image
                        src={
                          offer?.organization?.image_url || placeHolderPerson
                        }
                        alt="organization image"
                        width={40}
                        height={40}
                        className="w-fit h-fit rounded-full border border-secondary-caribbean-green-main"
                      />
                    </div>
                    <p className="w-[12.5%]">{offer?.organization?.name}</p>
                    <p className="w-[7%] text-secondary-indigo-main">
                      {rfqById?.routes.length} เส้นทาง
                    </p>
                    {/* <p className="w-[9%] text-end font-semibold text-secondary-indigo-main">
                          300 Hard Code
                        </p>
                        <p className="w-[12%] text-end font-semibold text-secondary-indigo-main">
                          300 Hard Code
                        </p>
                        <p className="w-[12%] text-end font-semibold text-secondary-indigo-main">
                          7,000 Hard Code
                        </p> */}
                    <p className="w-[12%] font-semibold text-secondary-indigo-main">
                      {rfqById?.offers.length > 1
                        ? "มากกว่า 1 รายการ"
                        : rfqById?.offers[0]?.routes.find(
                            (route) => route.is_base_price === "Y"
                          )?.price}
                    </p>
                    <div className="w-[9%] flex justify-center text-secondary-indigo-main">
                      <Icons
                        name="ShowPassword"
                        className="w-6 h-6 cursor-pointer"
                        onClick={() =>
                          handleNavigation.openOfferModal(offer.id)
                        }
                      />
                    </div>
                    <div className="w-[17%] flex items-center gap-5">
                      <Button
                        onClick={() =>
                          handleNavigation.selectCompany(
                            offer.id,
                            offer.organization.name
                          )
                        }
                      >
                        <Icons name="CheckCircleLight" className="w-6 h-6" />
                        <p className="text-sm font-medium">เลือกบริษัท</p>
                      </Button>
                      <Icons
                        name="Bin"
                        className="w-6 h-6 text-urgent-fail-01 cursor-pointer"
                        onClick={() =>
                          handleNavigation.deleteCompany(
                            offer.id,
                            offer.organization.name
                          )
                        }
                      />
                    </div>
                  </div>

                  {/* Expandable Details */}
                  {expandedTables.includes(offer.id) && (
                    <div className="max-w-full hover:border-none py-2 text-base font-normal text-neutral-08 shadow-table bg-white rounded-md flex items-center justify-between w-full">
                      <div className="w-full rounded-lg ml-16 p-4 py-2 align-middle bg-neutral-02">
                        <ExpandedTable />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <OfferDetailModal
        isModalOfferOpen={modalStates.offerDetail.isOpen}
        setIsModalOfferOpen={(isOpen) =>
          setModalStates((prev) => ({
            ...prev,
            offerDetail: { isOpen },
          }))
        }
      />

      <ModalNotification
        open={modalStates.selectedCompany.isOpen}
        setOpen={(isOpen) =>
          setModalStates((prev) => ({
            ...prev,
            selectedCompany: { ...prev.selectedCompany, isOpen },
          }))
        }
        title="ยืนยันการบริษัทขนส่ง"
        description="คุณต้องการเลือกบริษัทขนส่ง"
        description2={`${modalStates.selectedCompany.companyName} ใช่หรือไม่?`}
        buttonText="ยืนยัน"
        isConfirmOnly={false}
        icon={<Icons name="DialogSuccess" className="w-16 h-16" />}
        onConfirm={() => {
          handleCompanyAction.approve(
            rfqById?.id ?? 0,
            modalStates.selectedCompany.offerId
          );
        }}
      />

      <ModalNotification
        open={modalStates.deleteCompany.isOpen}
        setOpen={(isOpen) =>
          setModalStates((prev) => ({
            ...prev,
            deleteCompany: { ...prev.deleteCompany, isOpen },
          }))
        }
        title="ยืนยันการลบใบเสนอราคา"
        description="คุณแน่ใจหรือไม่ว่าต้องการลบใบเสนอราคา"
        description2={`${modalStates.deleteCompany.companyName} หรือไม่?`}
        buttonText="ยืนยัน"
        isConfirmOnly={false}
        isDelete
        icon={<Icons name="DialogDelete" className="w-16 h-16" />}
        onConfirm={() => {
          handleCompanyAction.reject(modalStates.deleteCompany.offerId);
        }}
      />
    </>
  );
}
