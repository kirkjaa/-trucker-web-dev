"use client";

import React, { useEffect } from "react";
import clsx from "clsx";

import useTruckForm from "../hooks/useTruckForm";

import { Button } from "@/app/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import DragAndDrop from "@/app/components/ui/featureComponents/DragAndDrop";
import HeaderWithBackStep from "@/app/components/ui/featureComponents/HeaderWithBackStep";
import { Input } from "@/app/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Textarea } from "@/app/components/ui/textarea";
import { iconNames, Icons } from "@/app/icons";
import {
  ETruckContainers,
  ETruckDepartmentType,
  ETruckFuelType,
  ETruckType,
  truckTypeLabel,
} from "@/app/types/enum";
import formatFullName from "@/app/utils/formatFullName";

type TruckFormProps = {
  id?: string;
  icon: keyof typeof iconNames;
  title: string;
};

export default function TruckForm({ id, icon, title }: TruckFormProps) {
  const {
    register,
    errors,
    provinces,
    onProvinceChange,
    province,
    setValue,
    frontImage,
    // setFrontImage,
    backImage,
    // setBackImage,
    sideImage,
    // setSideImage,
    licensePlateImage,
    setLicensePlateImage,
    documents,
    setDocuments,
    fuelType,
    setFuelType,
    year,
    setYear,
    truckType,
    setTruckType,
    handleCreate,
    handleSubmit,
    pathName,
    fetchFormData,
    containers,
    handleBack,
    handleSelectContainer,
    handleUpdate,
    fetchOptionDriver,
    optionDriver,
    selectedDriver,
    setSelectedDriver,
    clearErrors,
    remark,
    setRemark,
  } = useTruckForm();

  useEffect(() => {
    if (pathName.includes("rental")) {
      setValue("departmentType", ETruckDepartmentType.FREELANCE);
    } else if (pathName.includes(ETruckDepartmentType.COMPANY)) {
      setValue("departmentType", ETruckDepartmentType.COMPANY);
    } else {
      setValue("departmentType", ETruckDepartmentType.FACTORY);
    }

    if (id) {
      fetchFormData(id);
    }

    fetchOptionDriver();
  }, [pathName]);

  useEffect(() => {
    if (province) {
      setValue("licensePlateProvince", province!);
      clearErrors("licensePlateProvince");
    }
    if (year) {
      setValue("year", year);
      clearErrors("year");
    }
    if (fuelType) {
      setValue("fuelType", fuelType);
      clearErrors("fuelType");
    }
    if (truckType) {
      setValue("type", truckType);
      clearErrors("type");
    }
    if (containers) {
      setValue("containers", containers);
      clearErrors("containers");
    }
  }, [province, year, fuelType, truckType, containers]);

  useEffect(() => {
    if (frontImage) {
      setValue("frontImage", frontImage[0]);
    }
    if (backImage) {
      setValue("backImage", backImage[0]);
    }
    if (sideImage) {
      setValue("sideImage", sideImage[0]);
    }
    if (licensePlateImage) {
      setValue("licensePlateImage", licensePlateImage[0]);
    }
    if (documents) {
      setValue("documents", documents);
    }
    if (selectedDriver) {
      setValue("driverId", selectedDriver);
    }
    if (remark) {
      setValue("remark", remark);
    }
  }, [
    frontImage,
    backImage,
    sideImage,
    licensePlateImage,
    documents,
    selectedDriver,
    remark,
  ]);

  return (
    <div className="flex flex-col gap-3 ">
      <HeaderWithBackStep onClick={handleBack} iconTitle={icon} title={title} />
      <div className="bg-modal-01 px-5 py-3 rounded-lg flex justify-between items-center">
        <div className="text-sm  flex gap-2">
          <p className="text-secondary-indigo-main title2">ข้อมูลรถบรรทุก</p>
        </div>

        {!id ? (
          <React.Fragment>
            <Button onClick={handleSubmit(handleCreate)}>
              <p className="button"> ยืนยัน</p>
            </Button>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Button onClick={handleSubmit((data) => handleUpdate(data, id))}>
              <p className="button"> บันทึก</p>
            </Button>
          </React.Fragment>
        )}
      </div>

      <div className=" rounded-xl ">
        <div className="flex flex-col gap-1  bg-modal-01 p-4 rounded-xl w-full">
          <div className="flex flex-wrap">
            <div className="flex flex-col gap-1 w-3/12 bg-modal-01 p-1 rounded-xl">
              <p className="text-sm font-semibold text-neutral-08">
                รูปภาพด้านหน้า
              </p>
              {/* <DragAndDrop
                files={frontImage}
                setFiles={setFrontImage}
                maxFiles={1}
              /> */}
            </div>
            <div className="flex flex-col gap-1  w-3/12 bg-modal-01 p-1 rounded-xl">
              <p className="text-sm font-semibold text-neutral-08">
                รูปภาพด้านหลัง
              </p>
              {/* <DragAndDrop
                files={backImage}
                setFiles={setBackImage}
                maxFiles={1}
              /> */}
            </div>
            <div className="flex flex-col gap-1  w-3/12 bg-modal-01 p-1 rounded-xl">
              <p className="text-sm font-semibold text-neutral-08">
                รูปภาพด้านข้าง
              </p>
              {/* <DragAndDrop
                files={sideImage}
                setFiles={setSideImage}
                maxFiles={1}
              /> */}
            </div>
            <div className="flex flex-col gap-1  w-3/12 bg-modal-01 p-1 rounded-xl">
              <p className="text-sm font-semibold text-neutral-08">
                รูปภาพป้ายทะเบียน
              </p>
              <DragAndDrop
                files={licensePlateImage}
                setFiles={setLicensePlateImage}
                maxFiles={1}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-modal-01 p-4 rounded-xl ">
        <p>ข้อมูลรถบรรทุก</p>
        <div className="flex flex-row gap-2 p-4 w-full">
          <div className="flex flex-col gap-1 w-1/4">
            <p className="text-sm font-semibold text-neutral-08">
              รหัสรถบรรทุก <span className="text-urgent-fail-02">*</span>
            </p>
            <Input
              className={clsx("h-10 w-full border border-neutral-03", {
                "border-red-500": errors.truckCode,
              })}
              placeholder="รหัสรถบรรทุก"
              {...register("truckCode")}
            />
            {errors.truckCode && (
              <div className="flex gap-2 items-center">
                <Icons name="ErrorLogin" className="w-4 h-4" />
                <p className="text-sm text-red-500 text-start pt-1">
                  {errors.truckCode.message}
                </p>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-1 w-1/4">
            <p className="text-sm font-semibold text-neutral-08">
              ป้ายทะเบียน <span className="text-urgent-fail-02">*</span>
            </p>
            <Input
              className={clsx("h-10 w-full border border-neutral-03", {
                "border-red-500": errors.licensePlateValue,
              })}
              placeholder="ป้ายทะเบียน"
              {...register("licensePlateValue")}
              onKeyDown={(e) => {
                const key = e.key;

                const isValidChar = /^[ก-ฮA-Za-z0-9]$/.test(key);

                if (!isValidChar && key.length === 1) {
                  e.preventDefault();
                }
              }}
              onPaste={(e) => {
                const pasted = e.clipboardData.getData("text");

                if (!/^[ก-ฮA-Za-z0-9]+$/.test(pasted)) {
                  e.preventDefault();
                }
              }}
            />

            {errors.licensePlateValue && (
              <div className="flex gap-2 items-center">
                <Icons name="ErrorLogin" className="w-4 h-4" />
                <p className="text-sm text-red-500 text-start pt-1">
                  {errors.licensePlateValue.message}
                </p>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-1 w-1/4">
            <p className="text-sm font-semibold text-neutral-08">
              จังหวัด <span className="text-urgent-fail-02">*</span>
            </p>

            <Select onValueChange={onProvinceChange} value={province}>
              <SelectTrigger
                className={clsx("py-2 px-5 bg-white  border-neutral-03", {
                  " border-red-500 ": errors.licensePlateProvince,
                })}
              >
                <SelectValue placeholder="กรุณาเลือก" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {provinces &&
                    provinces.map((item) => (
                      <SelectItem key={item.id} value={item.name_th}>
                        {item.name_th}
                      </SelectItem>
                    ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.licensePlateProvince && (
              <div className="flex gap-2 items-center">
                <Icons name="ErrorLogin" className="w-4 h-4" />
                <p className="text-sm text-red-500 text-start pt-1">
                  {errors.licensePlateProvince.message}
                </p>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-1 w-1/4">
            <p className="text-sm font-semibold text-neutral-08">
              ยี่ห้อ <span className="text-urgent-fail-02">*</span>
            </p>
            <Input
              className={clsx("h-10 w-full border border-neutral-03", {
                "border-red-500": errors.brand,
              })}
              placeholder="ยี่ห้อ"
              {...register("brand")}
              onKeyDown={(e) => {
                const key = e.key;

                const isValidChar = /^[\u0E00-\u0E7Fa-zA-Z\s]$/.test(key);

                if (!isValidChar && key.length === 1) {
                  e.preventDefault();
                }
              }}
            />
            {errors.brand && (
              <div className="flex gap-2 items-center">
                <Icons name="ErrorLogin" className="w-4 h-4" />
                <p className="text-sm text-red-500 text-start pt-1">
                  {errors.brand.message}
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-row gap-2 p-4 w-full">
          <div className="flex flex-col gap-1 w-1/4">
            <p className="text-sm font-semibold text-neutral-08">
              ปีที่ผลิต <span className="text-urgent-fail-02">*</span>
            </p>

            <Select onValueChange={(val) => setYear(val)} value={year}>
              <SelectTrigger
                className={clsx("py-2 px-5 bg-white border-neutral-03", {
                  "border-red-500": errors.year,
                })}
              >
                <SelectValue placeholder="กรุณาเลือกปีที่ผลิต" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {Array.from({ length: 30 }, (_, i) => {
                    const year = new Date().getFullYear() - i;
                    return (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    );
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.year && (
              <div className="flex gap-2 items-center">
                <Icons name="ErrorLogin" className="w-4 h-4" />
                <p className="text-sm text-red-500 text-start pt-1">
                  {errors.year.message}
                </p>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-1 w-1/4">
            <p className="text-sm font-semibold text-neutral-08">
              VIN (หมายเลขประจำตัวยานพาหนะ)
              <span className="text-urgent-fail-02">*</span>
            </p>
            <Input
              className={clsx("h-10 w-full border border-neutral-03", {
                "border-red-500": errors.vin,
              })}
              placeholder="VIN (หมายเลขประจำตัวยานพาหนะ)"
              {...register("vin")}
              onInput={(e) =>
                (e.currentTarget.value = e.currentTarget.value.toUpperCase())
              }
            />
            {errors.vin && (
              <div className="flex gap-2 items-center">
                <Icons name="ErrorLogin" className="w-4 h-4" />
                <p className="text-sm text-red-500 text-start pt-1">
                  {errors.vin.message}
                </p>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-1 w-1/4">
            <p className="text-sm font-semibold text-neutral-08">
              สี <span className="text-urgent-fail-02">*</span>
            </p>
            <Input
              className={clsx("h-10 w-full border border-neutral-03", {
                "border-red-500": errors.color,
              })}
              placeholder="สี"
              {...register("color")}
              onKeyDown={(e) => {
                const key = e.key;

                const isValidChar = /^[\u0E00-\u0E7Fa-zA-Z\s]$/.test(key);

                if (!isValidChar && key.length === 1) {
                  e.preventDefault();
                }
              }}
            />
            {errors.color && (
              <div className="flex gap-2 items-center">
                <Icons name="ErrorLogin" className="w-4 h-4" />
                <p className="text-sm text-red-500 text-start pt-1">
                  {errors.color.message}
                </p>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-1 w-1/4">
            <p className="text-sm font-semibold text-neutral-08">
              ประเภทรถ <span className="text-urgent-fail-02">*</span>
            </p>

            <Select
              onValueChange={(val: ETruckType) => setTruckType(val)}
              value={truckType}
            >
              <SelectTrigger
                className={clsx("py-2 px-5 bg-white border-neutral-03", {
                  " border-red-500 ": errors.type,
                })}
              >
                <SelectValue placeholder="กรุณาเลือก" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {Object.entries(ETruckType).map(([key, value]) => (
                    <SelectItem key={key} value={value}>
                      {truckTypeLabel[value]}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.type && (
              <div className="flex gap-2 items-center">
                <Icons name="ErrorLogin" className="w-4 h-4" />
                <p className="text-sm text-red-500 text-start pt-1">
                  {errors.type.message}
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-row gap-2 p-4 w-full">
          <div className="flex flex-col gap-1 w-1/4">
            <p className="text-sm font-semibold text-neutral-08">
              ประเภทเชื้อเพลิง <span className="text-urgent-fail-02">*</span>
            </p>

            <Select
              onValueChange={(val: ETruckFuelType) => setFuelType(val)}
              value={fuelType}
            >
              <SelectTrigger
                className={clsx("py-2 px-5 bg-white border-neutral-03", {
                  " border-red-500 ": errors.fuelType,
                })}
              >
                <SelectValue placeholder="กรุณาเลือก" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {Object.entries(ETruckFuelType).map(([key, value]) => (
                    <SelectItem key={key} value={value}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.fuelType && (
              <div className="flex gap-2 items-center">
                <Icons name="ErrorLogin" className="w-4 h-4" />
                <p className="text-sm text-red-500 text-start pt-1">
                  {errors.fuelType.message}
                </p>
              </div>
            )}
          </div>
        </div>
        <p>รายละเอียดผู้ขับ</p>
        <div className="flex flex-row gap-2 p-4 w-full">
          <div className="flex flex-col gap-1 w-1/4">
            <p className="text-sm font-semibold text-neutral-08">
              ผู้ขับ{" "}
              {!pathName.includes("rental") && (
                <span className="text-urgent-fail-02">*</span>
              )}
            </p>

            <Select
              onValueChange={(val) => setSelectedDriver(val)}
              value={selectedDriver}
            >
              <SelectTrigger
                className={clsx("py-2 px-5 bg-white border-neutral-03", {
                  "border-red-500": errors.driverId,
                })}
              >
                <SelectValue placeholder="กรุณาเลือกผู้ขับ" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {optionDriver.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {formatFullName(
                        item.user?.firstName,
                        item.user?.lastName
                      )}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.driverId && (
              <div className="flex gap-2 items-center">
                <Icons name="ErrorLogin" className="w-4 h-4" />
                <p className="text-sm text-red-500 text-start pt-1">
                  {errors.driverId.message}
                </p>
              </div>
            )}
          </div>
        </div>
        <p>ความจุและน้ำหนักบรรทุก</p>
        <div className="flex flex-row gap-2 p-4 w-full">
          <div className="flex flex-col gap-1 w-1/4">
            <p className="text-sm font-semibold text-neutral-08">
              ความจุที่รับได้ <span className="text-urgent-fail-02">*</span>
            </p>
            <Input
              className={clsx("h-10 w-full border border-neutral-03", {
                "border-red-500": errors.weight,
              })}
              placeholder="ความจุที่รับได้"
              type="number"
              {...register("weight")}
            />
            {errors.weight && (
              <div className="flex gap-2 items-center">
                <Icons name="ErrorLogin" className="w-4 h-4" />
                <p className="text-sm text-red-500 text-start pt-1">
                  {errors.weight.message}
                </p>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-1 w-1/4">
            <p className="text-sm font-semibold text-neutral-08">
              ขนาดบรรทุกได้ (เมตร)<span className="text-urgent-fail-02">*</span>
            </p>
            <div className="flex w-full">
              <div className="w-1/3">
                <Input
                  className={clsx("h-10 w-full border border-neutral-03", {
                    "border-red-500": errors.width,
                  })}
                  type="number"
                  placeholder="กว้าง"
                  {...register("width")}
                  onKeyDown={(e) => {
                    if (["e", "E", "+", "-", "."].includes(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
              </div>
              <div className="w-1/3">
                <Input
                  className={clsx("h-10 w-full border border-neutral-03", {
                    "border-red-500": errors.height,
                  })}
                  type="number"
                  placeholder="ยาว"
                  {...register("height")}
                  onKeyDown={(e) => {
                    if (["e", "E", "+", "-", "."].includes(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
              </div>
              <div className="w-1/3">
                <Input
                  className={clsx("h-10 w-full border border-neutral-03", {
                    "border-red-500": errors.length,
                  })}
                  type="number"
                  placeholder="สูง"
                  {...register("length")}
                  onKeyDown={(e) => {
                    if (["e", "E", "+", "-", "."].includes(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
              </div>
            </div>
            {errors.width && errors.height && errors.length && (
              <div className="flex gap-2 items-center">
                <Icons name="ErrorLogin" className="w-4 h-4" />
                <p className="text-sm text-red-500 text-start pt-1">
                  {errors.width.message} {errors.height.message}
                  {errors.length.message}
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1 w-1/4">
            <p className="text-sm font-semibold text-neutral-08">
              ประเภทตู้ที่รับได้ <span className="text-urgent-fail-02">*</span>
            </p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="form"
                  className={clsx(
                    "w-full h-10",
                    errors.containers && "border border-red-500"
                  )}
                >
                  <div className="flex justify-between w-full  items-center">
                    <p
                      className={clsx(
                        "text-sm ",
                        !containers.length && "text-neutral-04 font-normal"
                      )}
                    >
                      {containers.length > 0
                        ? containers.join(", ")
                        : "กรุณาเลือก"}
                    </p>
                    <Icons name="ChevronDown" className="w-6 h-6" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80">
                {Object.entries(ETruckContainers).map(([key, value]) => (
                  <DropdownMenuCheckboxItem
                    key={key}
                    checked={containers.includes(value)}
                    onCheckedChange={(checked: boolean) => {
                      handleSelectContainer(value, checked);
                    }}
                  >
                    <p className="body2">{value}</p>
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {errors.containers && (
              <div className="flex gap-2 items-center">
                <Icons name="ErrorLogin" className="w-4 h-4" />
                <p className="text-sm text-red-500 text-start pt-1">
                  {errors.containers.message}
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1 w-1/4">
            <p className="text-sm font-semibold text-neutral-08">
              ตำแหน่งล่าสุดที่รถอยู่{" "}
              <span className="text-urgent-fail-02">*</span>
            </p>
            <Input
              className={clsx("h-10 w-full border border-neutral-03", {
                "border-red-500": errors.zone,
              })}
              placeholder="ตำแหน่งล่าสุดที่รถอยู่"
              {...register("zone")}
            />
            {errors.zone && (
              <div className="flex gap-2 items-center">
                <Icons name="ErrorLogin" className="w-4 h-4" />
                <p className="text-sm text-red-500 text-start pt-1">
                  {errors.zone.message}
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="flex rounded-xl  gap-2  w-full">
          <div className="flex flex-col gap-1  bg-modal-01 p-4 rounded-xl w-2/5">
            <p className="text-sm font-semibold text-neutral-08">หมายเหตุ</p>
            <Textarea
              className={clsx("h-10 w-full border border-neutral-03", {
                "border-red-500": errors.weight,
              })}
              placeholder="หมายเหตุ"
              value={remark}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                setRemark(e.target.value);
              }}
            />
            {errors.weight && (
              <div className="flex gap-2 items-center">
                <Icons name="ErrorLogin" className="w-4 h-4" />
                <p className="text-sm text-red-500 text-start pt-1">
                  {errors.weight.message}
                </p>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-1  bg-modal-01 p-4 rounded-xl w-2/3">
            <p className="text-sm font-semibold text-neutral-08">เอกสารแนบ</p>

            <DragAndDrop
              files={documents}
              setFiles={setDocuments}
              maxFiles={4}
              showFileList
            />
          </div>
        </div>
      </div>
    </div>
  );
}
