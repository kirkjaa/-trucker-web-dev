"use client";

import React, { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import clsx from "clsx";
import { usePathname, useRouter } from "next/navigation";

import useFactoriesAndCompaniesForm from "../hook/useFactoriesAndCompaniesForm";

import { Button } from "@/app/components/ui/button";
import DragAndDrop from "@/app/components/ui/featureComponents/DragAndDrop";
import HeaderWithBackStep from "@/app/components/ui/featureComponents/HeaderWithBackStep";
import UploadImage from "@/app/components/ui/featureComponents/UploadImage";
import { Input } from "@/app/components/ui/input";
import ModalNotification from "@/app/components/ui/ModalNotification";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Icons } from "@/app/icons";
import { masterApi } from "@/app/services/master/masterApi";
import { EAdminPathName, EHttpStatusCode } from "@/app/types/enum";
import { IBusinessType, IProvince } from "@/app/types/master/masterType";

type FactoriesAndCompaniesFormProps = {
  title: string;
  factoriesId?: string;
  companiesId?: string;
};

export default function FactoriesAndCompaniesForm({
  title,
  factoriesId,
  companiesId,
}: FactoriesAndCompaniesFormProps) {
  // Local State
  const [provinces, setProvinces] = useState<IProvince[]>();
  const [businessTypes, setBusinessTypes] = useState<IBusinessType[]>();

  // Hook
  const {
    errors,
    register,
    handleSubmit,
    handleConfirm,
    handleClickBackStep,
    handleUpdate,
    setValue,
    onSubmit,
    openModalConfirm,
    setOpenModalConfirm,
    watch,
    control,
    getOrganizationById,
    setDocumentDeleteIds,
    clearErrors,
  } = useFactoriesAndCompaniesForm();
  const provinceId = watch("province_id");
  const districtId = watch("district_id");
  const subdistrictId = watch("sub_district_id");

  const selectedProvince = provinces?.find((p) => p.id === Number(provinceId));
  const districts = selectedProvince?.districts ?? [];

  const selectedDistrict = districts.find((d) => d.id === Number(districtId));
  const subdistricts = selectedDistrict?.subdistricts ?? [];

  const selectedSubdistrict = subdistricts.find(
    (s) => s.id === Number(subdistrictId)
  );
  const zipCode = selectedSubdistrict?.zip_code ?? "";

  const pathName = usePathname();
  const router = useRouter();

  // Use Effect
  useEffect(() => {
    const fetchMaster = async () => {
      const [provincesRes, businessTypesRes] = await Promise.all([
        masterApi.getProvinces(),
        masterApi.getBusinessTypes(),
      ]);
      if (
        provincesRes.statusCode === EHttpStatusCode.SUCCESS &&
        businessTypesRes.statusCode === EHttpStatusCode.SUCCESS
      ) {
        setProvinces(provincesRes.data);
        setBusinessTypes(businessTypesRes.data);
      } else {
        router.back();
      }
    };

    fetchMaster();
    pathName.startsWith(EAdminPathName.FACTORIES)
      ? setValue("type_id", 1)
      : setValue("type_id", 2);
  }, []);

  useEffect(() => {
    if (pathName.includes(EAdminPathName.FACTORIES) && factoriesId) {
      getOrganizationById(Number(factoriesId));
    }
    if (pathName.includes(EAdminPathName.COMPANIES) && companiesId) {
      getOrganizationById(Number(companiesId));
    }
  }, [factoriesId, companiesId]);

  // useEffect(() => {
  //   setValue("image", images);
  // }, [images]);

  // useEffect(() => {
  //   setValue("logoImage", logoImages);
  // }, [logoImages]);
  // useEffect(() => {
  //   setValue("documents", document);
  // }, [document]);

  // useEffect(() => {
  //   setValue("adminUserId", adminId);
  // }, [adminId]);

  // useEffect(() => {
  //   setValue("province", province);
  // }, [province]);

  // useEffect(() => {
  //   setValue("subDistrict", subDistrict);
  // }, [subDistrict]);
  // useEffect(() => {
  //   setValue("district", district);
  // }, [district]);

  return (
    <React.Fragment>
      <div className="flex flex-col gap-3 ">
        <HeaderWithBackStep
          onClick={handleClickBackStep}
          iconTitle="PaperPlusBulk"
          title={title}
        />

        <div className="bg-modal-01 px-5 py-3 rounded-lg flex justify-between items-center">
          <div className="text-sm  flex gap-2">
            <p className="text-secondary-indigo-main">
              สมัครสมาชิกในรูปแบบของบริษัท โดยการสมัครจะกำหนด Role Admin
              ของบริษัท
            </p>
          </div>
          <div className="flex gap-4 ">
            {factoriesId || companiesId ? (
              <Button onClick={handleSubmit(handleConfirm)}>
                <p className="button">บันทึก</p>
              </Button>
            ) : (
              <Button onClick={handleSubmit(handleConfirm)}>
                <p className="button"> ยืนยัน</p>
              </Button>
            )}
          </div>
        </div>
        <div className="bg-modal-01 p-4 rounded-xl ">
          <p>
            ข้อมูล
            {pathName.startsWith(EAdminPathName.COMPANIES)
              ? "บริษัท"
              : "โรงงาน"}
          </p>

          <div className="flex flex-row gap-2 p-4 w-full">
            <div className="flex flex-col gap-1 w-1/3">
              <p className="text-sm font-semibold text-neutral-08">
                ชื่อ
                {pathName.startsWith(EAdminPathName.COMPANIES)
                  ? "บริษัท"
                  : "โรงงาน"}
                <span className="text-urgent-fail-02">*</span>
              </p>
              <Input
                className={clsx("h-10 w-full border border-neutral-03", {
                  "border-red-500": errors.name,
                })}
                placeholder={`ชื่อ${pathName.startsWith(EAdminPathName.COMPANIES) ? "บริษัท" : "โรงงาน"}`}
                {...register("name")}
              />
              {errors.name && (
                <div className="flex gap-2 items-center">
                  <Icons name="ErrorLogin" className="w-4 h-4" />
                  <p className="text-sm text-red-500 text-start pt-1">
                    {errors.name.message}
                  </p>
                </div>
              )}
            </div>
            {/* <div className="flex flex-col gap-1 w-1/3">
            <p className="text-sm font-semibold text-neutral-08">ผู้ดูแล</p>

            <Select
              value={adminId}
              onValueChange={(val) => {
                setAdminId(val);
              }}
            >
              <SelectTrigger className="py-2 px-5 bg-white border-neutral-03">
                <SelectValue placeholder="กรุณาเลือก" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {optionUserAdmin &&
                    optionUserAdmin?.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.fullName}
                      </SelectItem>
                    ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div> */}
            <div className="flex flex-col gap-1 w-1/3">
              <p className="text-sm font-semibold text-neutral-08">
                ธุรกิจเกี่ยวกับ
              </p>
              <Select
                onValueChange={(val) => {
                  setValue("business_type_id", val);
                  clearErrors("business_type_id");
                }}
                value={watch("business_type_id")}
              >
                <SelectTrigger
                  className={clsx("py-2 px-5 bg-white border-neutral-03", {
                    " border-red-500 ": errors.business_type_id,
                  })}
                >
                  <SelectValue placeholder="กรุณาเลือก" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {businessTypes &&
                      businessTypes.map((item) => (
                        <SelectItem key={item.id} value={item.id.toString()}>
                          {item.name_th}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors.business_type_id && (
                <div className="flex gap-2 items-center">
                  <Icons name="ErrorLogin" className="w-4 h-4" />
                  <p className="text-sm text-red-500 text-start pt-1">
                    {errors.business_type_id.message}
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-row gap-2  px-4  w-full">
            <div className="flex flex-col gap-1 w-1/3">
              <p className="text-sm font-semibold text-neutral-08">
                เบอร์โทรศัพท์ <span className="text-urgent-fail-02">*</span>
              </p>
              <Input
                className={clsx("h-10 w-full border border-neutral-03", {
                  "border-red-500": errors.phone,
                })}
                type="number"
                placeholder="เบอร์โทรศัพท์"
                {...register("phone")}
              />
              {errors.phone && (
                <div className="flex gap-2 items-center">
                  <Icons name="ErrorLogin" className="w-4 h-4" />
                  <p className="text-sm text-red-500 text-start pt-1">
                    {errors.phone.message}
                  </p>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-1 w-1/3">
              <p className="text-sm font-semibold text-neutral-08">
                อีเมล <span className="text-urgent-fail-02">*</span>
              </p>
              <Input
                className={clsx("h-10 w-full border border-neutral-03", {
                  "border-red-500": errors.email,
                })}
                placeholder="อีเมล"
                type="email"
                {...register("email")}
              />
              {errors.email && (
                <div className="flex gap-2 items-center">
                  <Icons name="ErrorLogin" className="w-4 h-4" />
                  <p className="text-sm text-red-500 text-start pt-1">
                    {errors.email.message}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        {/*  */}
        <div className="bg-modal-01 p-4 rounded-xl ">
          <p>ข้อมูลที่อยู่</p>
          <div className="flex flex-row gap-2 p-4 w-full">
            <div className="flex flex-col gap-1 w-1/3">
              <p className="text-sm font-semibold text-neutral-08">
                จังหวัด <span className="text-urgent-fail-02">*</span>
              </p>

              <Select
                onValueChange={(val) => {
                  setValue("province_id", val);
                  setValue("district_id", "");
                  setValue("sub_district_id", "");
                  setValue("zip_code", "");
                  clearErrors("province_id");
                }}
                value={provinceId}
              >
                <SelectTrigger
                  className={clsx("py-2 px-5 bg-white border-neutral-03", {
                    " border-red-500 ": errors.province_id,
                  })}
                >
                  <SelectValue placeholder="กรุณาเลือก" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {provinces &&
                      provinces.map((item) => (
                        <SelectItem key={item.id} value={item.id.toString()}>
                          {item.name_th}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors.province_id && (
                <div className="flex gap-2 items-center">
                  <Icons name="ErrorLogin" className="w-4 h-4" />
                  <p className="text-sm text-red-500 text-start pt-1">
                    {errors.province_id.message}
                  </p>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-1 w-1/3">
              <p className="text-sm font-semibold text-neutral-08">
                อำเภอ/เขต <span className="text-urgent-fail-02">*</span>
              </p>

              <Select
                onValueChange={(val) => {
                  setValue("district_id", val);
                  setValue("sub_district_id", "");
                  setValue("zip_code", "");
                  clearErrors("district_id");
                }}
                value={districtId}
              >
                <SelectTrigger
                  className={clsx("py-2 px-5 bg-white border-neutral-03", {
                    " border-red-500 ": errors.district_id,
                  })}
                >
                  <SelectValue placeholder="กรุณาเลือก" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {districts.map((item) => (
                      <SelectItem key={item.id} value={item.id.toString()}>
                        {item.name_th}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors.district_id && (
                <div className="flex gap-2 items-center">
                  <Icons name="ErrorLogin" className="w-4 h-4" />
                  <p className="text-sm text-red-500 text-start pt-1">
                    {errors.district_id.message}
                  </p>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-1 w-1/3">
              <p className="text-sm font-semibold text-neutral-08">
                ตำบล/แขวง <span className="text-urgent-fail-02">*</span>
              </p>

              <Select
                onValueChange={(val) => {
                  setValue("sub_district_id", val);
                  const sub = subdistricts.find((s) => s.id === +val);
                  setValue("zip_code", sub?.zip_code || "");
                  clearErrors("sub_district_id");
                }}
                value={subdistrictId}
              >
                <SelectTrigger
                  className={clsx("py-2 px-5 bg-white border-neutral-03", {
                    " border-red-500 ": errors.sub_district_id,
                  })}
                >
                  <SelectValue placeholder="กรุณาเลือก" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {subdistricts.map((item) => (
                      <SelectItem key={item.id} value={item.id.toString()}>
                        {item.name_th}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors.sub_district_id && (
                <div className="flex gap-2 items-center">
                  <Icons name="ErrorLogin" className="w-4 h-4" />
                  <p className="text-sm text-red-500 text-start pt-1">
                    {errors.sub_district_id.message}
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-row gap-2 p-4 w-full">
            <div className="flex flex-col gap-1 w-1/3">
              <p className="text-sm font-semibold text-neutral-08">
                ที่อยู่ <span className="text-urgent-fail-02">*</span>
              </p>
              <Input
                className={clsx("h-10 w-full border border-neutral-03", {
                  "border-red-500": errors.address,
                })}
                placeholder="ที่อยู่"
                {...register("address")}
              />
              {errors.address && (
                <div className="flex gap-2 items-center">
                  <Icons name="ErrorLogin" className="w-4 h-4" />
                  <p className="text-sm text-red-500 text-start pt-1">
                    {errors.address.message}
                  </p>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-1 w-1/3">
              <p className="text-sm font-semibold text-neutral-08">
                รหัสไปรษณีย์ <span className="text-urgent-fail-02">*</span>
              </p>
              <Input
                className={clsx(
                  "h-10 w-full border border-neutral-03 disabled:opacity-100",
                  {
                    "placeholder:text-neutral-05": zipCode === "",
                  }
                )}
                disabled
                placeholder="รหัสไปรษณีย์"
                value={zipCode}
                {...register("zip_code")}
              />
            </div>
            <div className="flex flex-col gap-1 w-2/12">
              <p className="text-sm font-semibold text-neutral-08">
                ละติจูด (สถานที่) <span className="text-urgent-fail-02">*</span>
              </p>
              <Input
                // value={watch("latitude")}
                className={clsx("h-10 w-full border border-neutral-03", {
                  "border-red-500": errors.latitude,
                })}
                placeholder="ละติจูด (สถานที่)"
                {...register("latitude")}
                type="number"
              />
              {errors.latitude && (
                <div className="flex gap-2 items-center">
                  <Icons name="ErrorLogin" className="w-4 h-4" />
                  <p className="text-sm text-red-500 text-start pt-1">
                    {errors.latitude.message}
                  </p>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-1 w-2/12">
              <p className="text-sm font-semibold text-neutral-08">
                ลองจิจูด (สถานที่)
                <span className="text-urgent-fail-02">*</span>
              </p>
              <Input
                // value={watch("longitude")}
                className={clsx("h-10 w-full border border-neutral-03", {
                  "border-red-500": errors.longitude,
                })}
                placeholder="ลองจิจูด (สถานที่)"
                {...register("longitude")}
                type="number"
              />
              {errors.longitude && (
                <div className="flex gap-2 items-center">
                  <Icons name="ErrorLogin" className="w-4 h-4" />
                  <p className="text-sm text-red-500 text-start pt-1">
                    {errors.longitude.message}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        {/*  */}
        <div className="flex rounded-xl  gap-2  w-full">
          <div className="flex flex-col gap-1 w-2/6 bg-modal-01 p-4 rounded-xl">
            <p className="text-sm font-semibold text-neutral-08">
              รูปภาพ
              {pathName.includes(EAdminPathName.COMPANIES)
                ? "บริษัท"
                : "โรงงาน"}
            </p>
            <Controller
              name="cover"
              control={control}
              render={({ field: { value, onChange } }) => (
                <UploadImage
                  setFile={onChange}
                  imageUrl={typeof value === "string" ? value : undefined}
                />
              )}
            />
          </div>
          <div className="flex flex-col gap-1 w-2/6 bg-modal-01 p-4 rounded-xl">
            <p className="text-sm font-semibold text-neutral-08">
              รูปภาพ
              {pathName.includes(EAdminPathName.COMPANIES)
                ? "บริษัท"
                : "โรงงาน"}
            </p>

            <Controller
              name="logo"
              control={control}
              render={({ field: { value, onChange } }) => (
                <UploadImage
                  setFile={onChange}
                  imageUrl={typeof value === "string" ? value : undefined}
                />
              )}
            />
          </div>
          <div className="flex flex-col gap-1 w-full bg-modal-01 p-4 rounded-xl">
            <p className="text-sm font-semibold text-neutral-08">
              เอกสารเปิดลูกค้าใหม่
            </p>
            <Controller
              name="documents"
              control={control}
              render={({ field: { value, onChange } }) => (
                <DragAndDrop
                  files={value}
                  setFiles={onChange}
                  maxFiles={4}
                  showFileList
                  setFileIds={setDocumentDeleteIds}
                />
              )}
            />
          </div>
        </div>
      </div>

      <ModalNotification
        open={openModalConfirm}
        setOpen={setOpenModalConfirm}
        title={
          !factoriesId && !companiesId
            ? "ยืนยันการเพิ่มข้อมูล"
            : "ยืนยันการแก้ไขข้อมูล"
        }
        description="กรุณาตรวจสอบข้อมูลให้ถูกต้องก่อนดำเนินการ"
        buttonText={"ยืนยัน"}
        isConfirmOnly={false}
        icon={<Icons name="CheckCircle" className="w-16 h-16" />}
        onConfirm={() => {
          if (factoriesId || companiesId) {
            handleUpdate(
              pathName.includes(EAdminPathName.FACTORIES)
                ? factoriesId!
                : companiesId!
            );
          } else {
            onSubmit();
          }
        }}
      />
    </React.Fragment>
  );
}
