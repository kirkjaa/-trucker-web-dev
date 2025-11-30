"use client";

import React from "react";

import usePluginForm from "../hooks/usePluginForm";

import AddFunctionPluginModal from "./AddFunctionPluginModal";
import PluginFormData from "./PluginFormData";
import PluginFormTable from "./PluginFormTable";

import { Button } from "@/app/components/ui/button";
import HeaderWithBackStep from "@/app/components/ui/featureComponents/HeaderWithBackStep";
import Stepper from "@/app/components/ui/Stepper";

export default function PluginForm() {
  const {
    handleClickBackStep,
    handleClickNextStep,
    step,
    steps,
    handleClickAddFunction,
    openAddFunctionModal,
    setOpenAddFunctionModal,
    formData,
    handleInputChange,
    headerList,
    featureList,
    handleSaveFeature,
    handleRemoveFeature,
    isSubmitting,
  } = usePluginForm();
  return (
    <React.Fragment>
      <div className="flex flex-col gap-3 ">
        <HeaderWithBackStep
          onClick={handleClickBackStep}
          iconTitle="PaperPlusBulk"
          title="เพิ่มปลั๊กอิน"
        />
        <div className="bg-modal-01 px-5 py-3 rounded-lg flex justify-between items-center w-full">
          <div className="flex justify-start w-1/2">
            <Stepper steps={steps} currentStep={step} />
          </div>
          <div className="w-1/2 flex justify-end">
            {step === 1 ? (
              <Button variant={"secondary"} onClick={handleClickNextStep}>
                ถัดไป
              </Button>
            ) : (
              <React.Fragment>
                <Button
                  variant={"outline"}
                  onClick={handleClickNextStep}
                  className="mr-2"
                >
                  ย้อนกลับ
                </Button>
                <Button
                  variant={"secondary"}
                  onClick={handleClickAddFunction}
                  className="mr-2"
                >
                  เพิ่มฟังก์ชันการใช้งาน
                </Button>
                <Button
                  variant={"main"}
                  onClick={handleClickNextStep}
                  disabled={isSubmitting}
                >
                  บันทึก
                </Button>
              </React.Fragment>
            )}
          </div>
        </div>
        {step === 1 ? (
          <PluginFormData
            formData={formData}
            onInputChange={handleInputChange}
            disabled={isSubmitting}
          />
        ) : (
          <PluginFormTable
            headerList={headerList}
            data={featureList}
            onRemove={handleRemoveFeature}
          />
        )}
      </div>
      <AddFunctionPluginModal
        open={openAddFunctionModal}
        setOpen={setOpenAddFunctionModal}
        onSave={handleSaveFeature}
      />
    </React.Fragment>
  );
}
