"use client";

import React, { useEffect } from "react";
import clsx from "clsx";
import { useSession } from "next-auth/react";

import useUsersForm from "../hooks/useUsersForm";

import { Button } from "@/app/components/ui/button";
import ChangePasswordModal from "@/app/components/ui/featureComponents/ChangePasswordModal";
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
import { Icons } from "@/app/icons";
import { EComPathName } from "@/app/types/enum";

type UsersFormProps = {
  id?: string;
};

export default function UsersForm({ id }: UsersFormProps) {
  const {
    register,
    errors,
    handleSubmit,
    handleCreate,
    image,
    setImage,
    handleClickBack,
    getValues,
    fetchFormById,
    setValue,
    pathName,
    openChangePassword,
    setOpenChangePassword,
    onSubmitChangePassword,
    handleClickChangePassword,
    handleUpdate,
    optionTruck,
    fetchOptionTruck,
    fetchOptionUsersPosition,
    optionPosition,
    selectedPosition,
    setSelectedPosition,
    clearErrors,
    isShowPassword,
    setIsShowPassword,
    isShowConfirmPassword,
    setIsShowConfirmPassword,
  } = useUsersForm();

  const { data: session } = useSession();

  useEffect(() => {
    console.log("session", session);
    if (pathName.includes(EComPathName.USERSDRIVER)) {
      fetchOptionTruck();
    } else {
      fetchOptionUsersPosition();
      if (session?.user.factoryId)
        setValue("factoryId", session?.user.factoryId);
      if (session?.user.companyId)
        setValue("companyId", session?.user.companyId);
    }
    setValue("pathName", pathName);
  }, [pathName]);

  useEffect(() => {
    setValue("image", image);
  }, [image]);
  useEffect(() => {
    if (id) {
      fetchFormById(id!);
      setValue("id", id);
    }
  }, [id]);

  useEffect(() => {
    setValue("positionId", selectedPosition);
    if (selectedPosition) clearErrors("positionId");
  }, [selectedPosition]);
  return (
    <React.Fragment>
      <div className="flex flex-col gap-3 ">
        <HeaderWithBackStep
          onClick={handleClickBack}
          iconTitle="PaperPlusBulk"
          title={id ? "แก้ไขผู้ใช้งาน" : "สร้างผู้ใช้งาน"}
        />
        <div className="bg-modal-01 px-5 py-3 rounded-xl flex justify-end items-center">
          <div className="flex gap-4 ">
            {!id ? (
              <React.Fragment>
                <Button onClick={handleSubmit(handleCreate)}>
                  <p className="button">ยืนยัน</p>
                </Button>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Button
                  onClick={handleSubmit((data) => handleUpdate(data, id))}
                >
                  <p className="button">บันทึก</p>
                </Button>
              </React.Fragment>
            )}
          </div>
        </div>

        <div className=" rounded-xl ">
          <div className="flex flex-col gap-1 w-1/4 bg-modal-01 p-4 rounded-xl">
            <p className="text-sm font-semibold text-neutral-08">
              รูปภาพประจำตัว
            </p>
            <DragAndDrop files={image} setFiles={setImage} maxFiles={1} />
          </div>
        </div>
        <div className="bg-modal-01 p-4 rounded-xl ">
          <p>ข้อมูลส่วนตัว</p>
          <div className="flex flex-row gap-2 p-4 w-full">
            <div className="flex flex-col gap-1 w-1/2">
              <p className="text-sm font-semibold text-neutral-08">
                ชื่อ <span className="text-urgent-fail-02">*</span>
              </p>
              <Input
                className={clsx("h-10 w-full border border-neutral-03", {
                  "border-red-500": errors.firstName,
                })}
                placeholder="ชื่อ"
                {...register("firstName")}
              />
              {errors.firstName && (
                <div className="flex gap-2 items-center">
                  <Icons name="ErrorLogin" className="w-4 h-4" />
                  <p className="text-sm text-red-500 text-start pt-1">
                    {errors.firstName.message}
                  </p>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-1 w-1/2">
              <p className="text-sm font-semibold text-neutral-08">
                นามสกุล <span className="text-urgent-fail-02">*</span>
              </p>
              <Input
                className={clsx("h-10 w-full border border-neutral-03", {
                  "border-red-500": errors.lastName,
                })}
                placeholder="นามสกุล"
                {...register("lastName")}
              />
              {errors.lastName && (
                <div className="flex gap-2 items-center">
                  <Icons name="ErrorLogin" className="w-4 h-4" />
                  <p className="text-sm text-red-500 text-start pt-1">
                    {errors.lastName.message}
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-row gap-2 p-4 w-full">
            <div className="flex flex-col gap-1 w-1/2">
              <p className="text-sm font-semibold text-neutral-08">
                เบอร์โทรศัพท์ <span className="text-urgent-fail-02">*</span>
              </p>
              <Input
                className={clsx("h-10 w-full border border-neutral-03", {
                  "border-red-500": errors.phone,
                })}
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
            <div className="flex flex-col gap-1 w-1/2">
              <p className="text-sm font-semibold text-neutral-08">
                อีเมล <span className="text-urgent-fail-02">*</span>
              </p>
              <Input
                className={clsx("h-10 w-full border border-neutral-03", {
                  "border-red-500": errors.email,
                })}
                placeholder="อีเมล"
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
          <div className="mt-4">
            {pathName.includes(EComPathName.USERSDRIVER) ? (
              <React.Fragment>
                <p>ข้อมูลรถบรรทุก</p>
                <div className="flex flex-col gap-1 w-1/2 p-4">
                  <p className="text-sm font-semibold text-neutral-08">
                    เลือกรถบรรทุก
                  </p>

                  <Select
                    value={selectedPosition}
                    onValueChange={(val) => {
                      setSelectedPosition(val);
                    }}
                  >
                    <SelectTrigger className="py-2 px-5 bg-white border-neutral-03">
                      <SelectValue placeholder="กรุณาเลือก" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {optionTruck &&
                          optionTruck?.map((item) => (
                            <SelectItem key={item.id} value={item.id}>
                              {item.truckCode}
                            </SelectItem>
                          ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <p>ข้อมูลผู้ใช้งาน</p>
                <div className="flex flex-row gap-2 p-4 w-full">
                  <div className="flex flex-col gap-1 w-1/2">
                    <p className="text-sm font-semibold text-neutral-08">
                      ตำแหน่ง
                    </p>

                    <Select
                      value={selectedPosition}
                      onValueChange={(val) => {
                        setSelectedPosition(val);
                      }}
                    >
                      <SelectTrigger
                        className={clsx(
                          "py-2 px-5 bg-white border-neutral-03",
                          {
                            "border-urgent-fail-02": errors.positionId,
                          }
                        )}
                      >
                        <SelectValue placeholder="กรุณาเลือกตำแหน่ง" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {optionPosition &&
                            optionPosition?.map((item) => (
                              <SelectItem key={item.id} value={item.id}>
                                {item.name}
                              </SelectItem>
                            ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-1 w-1/2">
                    <p className="text-sm font-semibold text-neutral-08">
                      ชื่อผู้ใช้งาน{" "}
                      <span className="text-urgent-fail-02">*</span>
                    </p>
                    <Input
                      className={clsx("h-10 w-full border border-neutral-03", {
                        "border-red-500": errors.username,
                      })}
                      placeholder="ชื่อผู้ใช้งาน"
                      {...register("username")}
                    />
                    {errors.username && (
                      <div className="flex gap-2 items-center">
                        <Icons name="ErrorLogin" className="w-4 h-4" />
                        <p className="text-sm text-red-500 text-start pt-1">
                          {errors.username.message}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                {!id ? (
                  <div className="flex flex-row gap-2 p-4 w-full">
                    <div className="flex flex-col gap-1 w-1/2">
                      <p className="text-sm font-semibold text-neutral-08">
                        รหัสผ่าน <span className="text-urgent-fail-02">*</span>
                      </p>
                      <Input
                        type={isShowPassword ? "text" : "password"}
                        className={clsx(
                          "h-10 w-full border border-neutral-03",
                          {
                            "border-red-500": errors.password,
                          }
                        )}
                        placeholder="รหัสผ่าน"
                        BackIcon={
                          isShowPassword ? (
                            <Icons
                              name="ShowPassword"
                              className="w-6 p-1 cursor-pointer"
                            />
                          ) : (
                            <Icons
                              name="HidePassword"
                              className="w-6 p-1 cursor-pointer"
                            />
                          )
                        }
                        onIconClick={() => setIsShowPassword(!isShowPassword)}
                        {...register("password")}
                      />
                      {errors.password && (
                        <div className="flex gap-2 items-center">
                          <Icons name="ErrorLogin" className="w-4 h-4" />
                          <p className="text-sm text-red-500 text-start pt-1">
                            {errors.password.message}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-1 w-1/2">
                      <p className="text-sm font-semibold text-neutral-08">
                        ยืนยันรหัสผ่าน{" "}
                        <span className="text-urgent-fail-02">*</span>
                      </p>
                      <Input
                        type={isShowConfirmPassword ? "text" : "password"}
                        className={clsx(
                          "h-10 w-full border border-neutral-03",
                          {
                            "border-red-500": errors.confirmPassword,
                          }
                        )}
                        placeholder="ยืนยันรหัสผ่าน"
                        BackIcon={
                          isShowConfirmPassword ? (
                            <Icons
                              name="ShowPassword"
                              className="w-6 p-1 cursor-pointer"
                            />
                          ) : (
                            <Icons
                              name="HidePassword"
                              className="w-6 p-1 cursor-pointer"
                            />
                          )
                        }
                        onIconClick={() =>
                          setIsShowConfirmPassword(!isShowConfirmPassword)
                        }
                        {...register("confirmPassword")}
                      />
                      {errors.confirmPassword && (
                        <div className="flex gap-2 items-center">
                          <Icons name="ErrorLogin" className="w-4 h-4" />
                          <p className="text-sm text-red-500 text-start pt-1">
                            {errors.confirmPassword.message}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="px-4">
                    <Button
                      variant="outline"
                      onClick={handleClickChangePassword}
                    >
                      เปลี่ยนรหัสผ่าน
                    </Button>
                  </div>
                )}
              </React.Fragment>
            )}
          </div>
        </div>
      </div>
      <ChangePasswordModal
        open={openChangePassword}
        setOpen={setOpenChangePassword}
        title="เปลี่ยนรหัสผ่าน"
        onSubmit={(data) => onSubmitChangePassword(data)}
        password={getValues("password")}
        confirmPassword={getValues("confirmPassword")}
      />
    </React.Fragment>
  );
}
