"use client";

import clsx from "clsx";
import { usePathname } from "next/navigation";

import SignatureModal from "../../../../../../components/ui/signature/SignatureModal";
import useAllCreateRfqForm from "../../../hooks/useAllCreateRfqForm";
import useCompanyListTable from "../../../hooks/useCompanyListTable";

import AbroadForm from "./components/AbroadForm";
import OneWayForm from "./components/OneWayForm";

import { Button } from "@/app/components/ui/button";
import { MultipleChoiceCombobox } from "@/app/components/ui/Combobox";
import { DatePicker } from "@/app/components/ui/DatePicker";
import HeaderWithBackStep from "@/app/components/ui/featureComponents/HeaderWithBackStep";
import { Input } from "@/app/components/ui/input";
import ModalNotification from "@/app/components/ui/ModalNotification";
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Icons } from "@/app/icons";
import { EFacPathName } from "@/app/types/enum";
import { ERfqSendTo } from "@/app/types/rfq/rfqEnum";

export default function CreateRfqForm() {
  // Hook
  const { handleNavigation } = useCompanyListTable();
  const {
    // const
    sendBidText,

    // states
    truckSizes,
    truckTypes,
    companies,
    handleSearchCompany,
    sendRfqTo,
    setSendRfqTo,
    setSelectedVehicleSize,
    setSelectedVehicleType,
    contactStart,
    setContactStart,
    contactEnd,
    setContactEnd,
    selectedCompany,
    setSelectedCompany,
    oilRatePrice,
    setOilRatePrice,
    setPriceRateUp,
    setPriceRateDown,
    setAddOnEmp,
    setEmpCost,
    setReason,
    routesDetails,
    setRoutesDetails,
    isDraftModalOpen,
    setIsDraftModalOpen,
    isSignatureModalOpen,
    setIsSignatureModalOpen,
    isSendRfqModalOpen,
    setIsSendRfqModalOpen,
    setSelectedSignature,

    // functions
    getError,
    clearFieldError,
    // handleClickSaveDraft,
    handleClickSendRfq,
    handleClickConfirmSaveDraft,
    handleConfirmCreateRfq,
  } = useAllCreateRfqForm();
  const pathName = usePathname();

  return (
    <>
      <div className="flex flex-col gap-5">
        <HeaderWithBackStep
          onClick={handleNavigation.back}
          iconTitle="PaperPlusBulk"
          title="เพิ่มใบเสนอราคา"
        />
        {/* <SubHead /> */}
        <div className="bg-modal-01 px-5 py-3 rounded-lg flex justify-between items-center">
          <div className="text-xl font-bold flex gap-2">
            <p className="text-secondary-indigo-main">เปิดประมูลใบเสนอราคา</p>
            <p className=" text-secondary-indigo-01">ส่งเที่ยวเดียว</p>
          </div>

          <div className="flex gap-4">
            {/* <Button
              variant="main-light"
              onClick={handleClickSaveDraft}
              disabled
            >
              <p className="button">บันทึกร่าง</p>
            </Button> */}
            <Button onClick={handleClickSendRfq}>
              <Icons name="SendBulk" className="w-6 h-6" />
              <p className="button">ส่งใบเปิดประมูลงาน</p>
            </Button>
          </div>
        </div>

        <div className="w-full flex gap-4">
          {/* <MainForm /> */}
          <div className="flex flex-col gap-4 shadow-table w-full p-5 rounded-2xl text-secondary-indigo-main">
            <RadioGroup
              className="flex gap-10 full-hd:gap-14 bg-modal-01 px-5 py-3 rounded-lg"
              value={sendRfqTo}
              onValueChange={(value) => setSendRfqTo(value as ERfqSendTo)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={ERfqSendTo.BOTH} id={ERfqSendTo.BOTH} />
                <p className="02:text-sm full-hd:body2">
                  ส่งไปยังตลาดและบริษัทขนส่งที่เลือก
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value={ERfqSendTo.DIRECT}
                  id={ERfqSendTo.DIRECT}
                />
                <p className="02:text-sm full-hd:body2">
                  ส่งไปยังบริษัทขนส่งที่เลือก
                </p>
              </div>
            </RadioGroup>

            {/* ประเภทรถ */}
            <div className="flex flex-col gap-2 bg-modal-01 px-5 py-3 rounded-lg">
              <p className="button">ประเภทรถ</p>

              <div className="flex gap-x-2 justify-between w-full">
                <div className="flex flex-col gap-1 w-full">
                  <p className="text-sm font-semibold text-neutral-08">
                    ประเภทรถ <span className="text-urgent-fail-02">*</span>
                  </p>

                  <Select
                    onValueChange={(value) => {
                      {
                        setSelectedVehicleSize(value);
                        clearFieldError("vehicleSize");
                      }
                    }}
                  >
                    <SelectTrigger
                      className={clsx("py-2 px-5 bg-white border-neutral-03", {
                        "border-urgent-fail-02": getError("vehicleSize"),
                      })}
                    >
                      <SelectValue placeholder="กรุณาเลือก" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {truckSizes?.map((size) => (
                          <SelectItem key={size.id} value={size.id.toString()}>
                            {size.name_th}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>

                  {getError("vehicleSize") && (
                    <div className="flex gap-2 items-center">
                      <Icons name="ErrorLogin" className="w-3 h-3" />
                      <p className="text-red-500 text-sm">
                        {getError("vehicleSize")}
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-1 w-full">
                  <p className="text-sm font-semibold text-neutral-08">
                    รูปแบบการจัดส่ง{" "}
                    <span className="text-urgent-fail-02">*</span>
                  </p>

                  <Select
                    onValueChange={(value) => {
                      {
                        setSelectedVehicleType(value);
                        clearFieldError("vehicleType");
                      }
                    }}
                  >
                    <SelectTrigger
                      className={clsx("py-2 px-5 bg-white border-neutral-03", {
                        "border-urgent-fail-02": getError("vehicleType"),
                      })}
                    >
                      <SelectValue placeholder="กรุณาเลือก" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {truckTypes?.map((type) => (
                          <SelectItem key={type.id} value={type.id.toString()}>
                            {type.name_th}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {getError("vehicleType") && (
                    <div className="flex gap-2 items-center">
                      <Icons name="ErrorLogin" className="w-3 h-3" />
                      <p className="text-red-500 text-sm">
                        {getError("vehicleType")}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ระยะเวลาสัญญา */}
            <div className="flex flex-col gap-2 bg-modal-01 px-5 py-3 rounded-lg">
              <p className="button">ระยะเวลาสัญญา</p>

              <div className="flex gap-x-2 justify-between w-full">
                <div className="flex flex-col gap-1 w-full">
                  <p className="text-sm font-semibold text-neutral-08">
                    วันเริ่มต้นสัญญา{" "}
                    <span className="text-urgent-fail-02">*</span>
                  </p>

                  <DatePicker
                    value={contactStart}
                    onChange={(date) => {
                      setContactStart(date);
                      clearFieldError("contactStart");
                    }}
                    className={clsx("", {
                      "border-urgent-fail-02": getError("contactStart"),
                    })}
                    disablePastDates
                  />

                  {getError("contactStart") && (
                    <div className="flex gap-2 items-center">
                      <Icons name="ErrorLogin" className="w-3 h-3" />
                      <p className="text-red-500 text-sm">
                        {getError("contactStart")}
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-1 w-full">
                  <div className="flex gap-1 text-sm font-semibold ">
                    <p className="text-neutral-08">วันสิ้นสุดสัญญา</p>
                    <p className="text-urgent-fail-02">*</p>
                  </div>

                  <DatePicker
                    value={contactEnd}
                    onChange={(date) => {
                      setContactEnd(date);
                      clearFieldError("contactEnd");
                    }}
                    disablePastDates
                    disableDateBefore={contactStart}
                    className={clsx("", {
                      "border-urgent-fail-02": getError("contactEnd"),
                    })}
                  />

                  {getError("contactEnd") && (
                    <div className="flex gap-2 items-center">
                      <Icons name="ErrorLogin" className="w-3 h-3" />
                      <p className="text-red-500 text-sm">
                        {getError("contactEnd")}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* เลือกบริษัท */}
            <div className="flex flex-col gap-2 bg-modal-01 px-5 py-3 w-full rounded-lg">
              <div className="flex gap-1">
                <p className="button">เลือกบริษัท</p>
                <p className="text-urgent-fail-02">*</p>
              </div>

              <MultipleChoiceCombobox
                selected={selectedCompany}
                options={(companies ?? []).map((opt) => ({
                  id: String(opt.id),
                  value: String(opt.id),
                  label: opt.name,
                }))}
                onChange={(options) => {
                  setSelectedCompany(options);
                  clearFieldError("selectedCompany");
                }}
                onInput={(e) => handleSearchCompany(e)}
                /* popOverClassName="w-multipleChoiceCombobox" */
                placeholder="กรุณาเลือกบริษัท"
                className={clsx("", {
                  "border-2 border-urgent-fail-02": getError("selectedCompany"),
                })}
              />

              {getError("selectedCompany") && (
                <div className="flex gap-2 items-center">
                  <Icons name="ErrorLogin" className="w-3 h-3" />
                  <p className="text-red-500 text-sm">
                    {getError("selectedCompany")}
                  </p>
                </div>
              )}
            </div>

            {/* กำหนดราคาน้ำมัน */}
            <div className="flex flex-col gap-2 bg-modal-01 px-5 py-3 rounded-lg">
              <p className="button">กำหนดราคาน้ำมัน</p>

              <div className="flex flex-col gap-4 w-full">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-semibold text-neutral-08">
                    ราคาน้ำมัน{" "}
                    <span className="text-neutral-06">
                      (บาท/ลิตร) <span className="text-urgent-fail-02">*</span>
                    </span>
                  </p>

                  <Input
                    value={oilRatePrice}
                    type="number"
                    className={clsx("h-10 w-full border border-neutral-03", {
                      "border-urgent-fail-02": getError("oilRatePrice"),
                    })}
                    placeholder="0.00"
                    onWheel={(e) => (e.target as HTMLElement).blur()}
                    onChange={(e) => {
                      setOilRatePrice(+e.target.value);
                      clearFieldError("oilRatePrice");
                    }}
                  />

                  {getError("oilRatePrice") && (
                    <div className="flex gap-2 items-center">
                      <Icons name="ErrorLogin" className="w-3 h-3" />
                      <p className="text-red-500 text-sm">
                        {getError("oilRatePrice")}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex justify-between gap-x-2">
                  <div className="flex flex-col gap-1 w-full">
                    <p className="text-sm font-semibold text-neutral-08">
                      ราคาผันขึ้น{" "}
                      <span className="text-neutral-06">
                        (%) <span className="text-urgent-fail-02">*</span>
                      </span>
                    </p>

                    <Input
                      type="number"
                      className={clsx("h-10 w-full border border-neutral-03", {
                        "border-urgent-fail-02": getError("priceRateUp"),
                      })}
                      placeholder="0.00"
                      onWheel={(e) => (e.target as HTMLElement).blur()}
                      onChange={(e) => {
                        setPriceRateUp(+e.target.value);
                        clearFieldError("priceRateUp");
                      }}
                    />

                    {getError("priceRateUp") && (
                      <div className="flex gap-2 items-center">
                        <Icons name="ErrorLogin" className="w-3 h-3" />
                        <p className="text-red-500 text-sm">
                          {getError("priceRateUp")}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-1 w-full">
                    <p className="text-sm font-semibold text-neutral-08">
                      ราคาผันลง{" "}
                      <span className="text-neutral-06">
                        (%) <span className="text-urgent-fail-02">*</span>
                      </span>
                    </p>

                    <Input
                      type="number"
                      className={clsx("h-10 w-full border border-neutral-03", {
                        "border-urgent-fail-02": getError("priceRateDown"),
                      })}
                      placeholder="0.00"
                      onWheel={(e) => (e.target as HTMLElement).blur()}
                      onChange={(e) => {
                        setPriceRateDown(+e.target.value);
                        clearFieldError("priceRateDown");
                      }}
                    />

                    {getError("priceRateDown") && (
                      <div className="flex gap-2 items-center">
                        <Icons name="ErrorLogin" className="w-3 h-3" />
                        <p className="text-red-500 text-sm">
                          {getError("priceRateDown")}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* เพิ่มเติม */}
            <div className="flex flex-col gap-2 bg-modal-01 px-5 py-3 rounded-lg">
              <p className="button">เพิ่มเติม</p>

              <div className="flex gap-x-2 justify-between w-full">
                <div className="flex flex-col gap-1 w-full">
                  <p className="text-sm font-semibold text-neutral-08">
                    แรงงานเพิ่มเติม{" "}
                    <span className="text-neutral-06">(ไม่รวมคนขับรถ)</span>
                  </p>

                  <Input
                    type="number"
                    className="h-10 w-full border border-neutral-03"
                    placeholder="0"
                    onWheel={(e) => (e.target as HTMLElement).blur()}
                    onChange={(e) => {
                      setAddOnEmp(e.target.value);
                    }}
                  />
                </div>

                <div className="flex flex-col gap-1 w-full">
                  <p className="text-sm font-semibold text-neutral-08">
                    ค่าแรงต่อคน
                  </p>

                  <Input
                    type="number"
                    className="h-10 w-full border border-neutral-03"
                    placeholder="0.00"
                    onWheel={(e) => (e.target as HTMLElement).blur()}
                    onChange={(e) => {
                      setEmpCost(e.target.value);
                    }}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1 w-full">
                <p className="text-sm font-semibold text-neutral-08">
                  หมายเหตุ
                </p>

                {/* <CustomTagInput */}
                {/*   placeholder="หมายเหตุ" */}
                {/*   state={reason} */}
                {/*   setState={setReason} */}
                {/* /> */}
                <Input
                  type="text"
                  className="h-10 w-full border border-neutral-03"
                  placeholder="กรุณากรอก"
                  onChange={(e) => {
                    setReason(e.target.value);
                  }}
                />
              </div>
            </div>
          </div>

          {pathName === EFacPathName.CREATE_RFQ_ONEWAY ? (
            <OneWayForm
              routesDetails={routesDetails}
              setRoutesDetails={setRoutesDetails}
            />
          ) : (
            <AbroadForm setRoutesDetails={setRoutesDetails} />
          )}
        </div>
      </div>

      {/* Modal SaveDraft */}
      <ModalNotification
        open={isDraftModalOpen}
        setOpen={setIsDraftModalOpen}
        title="บันทึกร่างใบเสนอราคา"
        description="หากท่าต้องการใช้ใบเสนอราคาในภายหลัง"
        description2={`กรุณา "${sendBidText}" เพื่อบันทึกสถานะปัจจุบัน`}
        buttonText="ยืนยัน"
        isConfirmOnly={false}
        icon={<Icons name="DialogInfo" className="w-16 h-16" />}
        onConfirm={() => {
          handleClickConfirmSaveDraft();
        }}
      />

      {/* Signature Modal */}
      <SignatureModal
        isSignatureModalOpen={isSignatureModalOpen}
        setIsSignatureModalOpen={setIsSignatureModalOpen}
        isSendRfqModalOpen={isSendRfqModalOpen}
        setIsSendRfqModalOpen={setIsSendRfqModalOpen}
        handleConfirmCreateRfq={handleConfirmCreateRfq}
        setSelectedSignature={setSelectedSignature}
      />
    </>
  );
}
