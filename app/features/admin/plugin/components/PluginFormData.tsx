"use client";

import React from "react";
import clsx from "clsx";

import UploadImage from "@/app/components/ui/featureComponents/UploadImage";
import { Input } from "@/app/components/ui/input";
import { PluginFormState } from "../hooks/usePluginForm";

type PluginFormDataProps = {
  formData: PluginFormState;
  onInputChange: (field: keyof PluginFormState, value: string) => void;
  disabled?: boolean;
};

export default function PluginFormData({
  formData,
  onInputChange,
  disabled = false,
}: PluginFormDataProps) {
  return (
    <div className=" rounded-xl ">
      <div
        className={clsx(
          "flex flex-col gap-1  bg-modal-01 p-4 rounded-xl w-1/4"
        )}
      >
        <p className="text-sm font-semibold text-neutral-08">รูปภาพโรงงาน</p>
        <UploadImage
          setFile={() => {}}
          imageUrl={""}
          discription="กดเพื่อเลือกรุปภาพโรงาน"
        />
      </div>
      <div className="bg-modal-01 p-4 rounded-xl mt-4 ">
        <p>ข้อมูลบริษัท</p>
        <div className="flex flex-row gap-2 p-4 w-full">
          <div className="flex flex-col gap-1 w-1/2">
            <p className="text-sm font-semibold text-neutral-08">
              ชื่อบริษัท <span className="text-urgent-fail-02">*</span>
            </p>
            <Input
              className={clsx("h-10 w-full border border-neutral-03", {
                // "border-red-500": errors.username,
              })}
              placeholder="ชื่อบริษัท"
              value={formData.companyName}
              onChange={(e) => onInputChange("companyName", e.target.value)}
              disabled={disabled}
            />
          </div>
          <div className="flex flex-col gap-1 w-1/2">
            <p className="text-sm font-semibold text-neutral-08">
              ตำแหน่งที่ตั้งบริษัท
              <span className="text-urgent-fail-02">*</span>
            </p>
            <Input
              className={clsx("h-10 w-full border border-neutral-03", {
                // "border-red-500": errors.username,
              })}
              placeholder="ตำแหน่งที่ตั้งบริษัท"
              value={formData.companyLocation}
              onChange={(e) => onInputChange("companyLocation", e.target.value)}
              disabled={disabled}
            />
          </div>
        </div>
        <div className="flex flex-row gap-2 p-4 w-full">
          <div className="flex flex-col gap-1 w-1/2">
            <p className="text-sm font-semibold text-neutral-08">
              ประเภทปลั๊กอิน <span className="text-urgent-fail-02">*</span>
            </p>
            <Input
              className={clsx("h-10 w-full border border-neutral-03", {
                // "border-red-500": errors.username,
              })}
              placeholder="ประเภทปลั๊กอิน"
              value={formData.pluginType}
              onChange={(e) => onInputChange("pluginType", e.target.value)}
              disabled={disabled}
            />
          </div>
          <div className="flex flex-col gap-1 w-1/2">
            <p className="text-sm font-semibold text-neutral-08">
              รายละเอียดบริษัท <span className="text-urgent-fail-02">*</span>
            </p>
            <Input
              className={clsx("h-10 w-full border border-neutral-03", {
                // "border-red-500": errors.username,
              })}
              placeholder="รายละเอียดบริษัท"
              value={formData.description}
              onChange={(e) => onInputChange("description", e.target.value)}
              disabled={disabled}
            />
          </div>
        </div>
      </div>
      <div className="bg-modal-01 p-4 rounded-xl mt-4 ">
        <p>ข้อมูลส่วนตัว</p>
        <div className="flex flex-row gap-2 p-4 w-full">
          <div className="flex flex-col gap-1 w-1/2">
            <p className="text-sm font-semibold text-neutral-08">
              ชื่อ <span className="text-urgent-fail-02">*</span>
            </p>
            <Input
              className={clsx("h-10 w-full border border-neutral-03", {
                // "border-red-500": errors.username,
              })}
              placeholder="ชื่อ"
              value={formData.contactFirstName}
              onChange={(e) =>
                onInputChange("contactFirstName", e.target.value)
              }
              disabled={disabled}
            />
          </div>
          <div className="flex flex-col gap-1 w-1/2">
            <p className="text-sm font-semibold text-neutral-08">
              นามสกุล <span className="text-urgent-fail-02">*</span>
            </p>
            <Input
              className={clsx("h-10 w-full border border-neutral-03", {
                // "border-red-500": errors.username,
              })}
              placeholder="นามสกุล"
              value={formData.contactLastName}
              onChange={(e) => onInputChange("contactLastName", e.target.value)}
              disabled={disabled}
            />
          </div>
        </div>
        <div className="flex flex-row gap-2 p-4 w-full">
          <div className="flex flex-col gap-1 w-1/2">
            <p className="text-sm font-semibold text-neutral-08">
              เบอร์โทรศัพท์ <span className="text-urgent-fail-02">*</span>
            </p>
            <Input
              className={clsx("h-10 w-full border border-neutral-03", {
                // "border-red-500": errors.username,
              })}
              placeholder="เบอร์โทรศัพท์"
              value={formData.contactPhone}
              onChange={(e) => onInputChange("contactPhone", e.target.value)}
              disabled={disabled}
            />
          </div>
          <div className="flex flex-col gap-1 w-1/2">
            <p className="text-sm font-semibold text-neutral-08">
              อีเมล <span className="text-urgent-fail-02">*</span>
            </p>
            <Input
              className={clsx("h-10 w-full border border-neutral-03", {
                // "border-red-500": errors.username,
              })}
              placeholder="อีเมล"
              value={formData.contactEmail}
              onChange={(e) => onInputChange("contactEmail", e.target.value)}
              disabled={disabled}
            />
          </div>
        </div>
      </div>
      <div className="bg-modal-01 p-4 rounded-xl mt-4 ">
        <p>ข้อมูลผู้ใช้งาน</p>
        <div className="flex flex-row gap-2 p-4 w-full">
          <div className="flex flex-col gap-1 w-1/2">
            <p className="text-sm font-semibold text-neutral-08">
              ชื่อผู้ใช้งาน <span className="text-urgent-fail-02">*</span>
            </p>
            <Input
              className={clsx("h-10 w-full border border-neutral-03", {
                // "border-red-500": errors.username,
              })}
              placeholder="ชื่อผู้ใช้งาน"
              value={formData.accountUsername}
              onChange={(e) =>
                onInputChange("accountUsername", e.target.value)
              }
              disabled={disabled}
            />
          </div>
        </div>
        <div className="flex flex-row gap-2 p-4 w-full">
          <div className="flex flex-col gap-1 w-1/2">
            <p className="text-sm font-semibold text-neutral-08">
              รหัสผ่าน <span className="text-urgent-fail-02">*</span>
            </p>
            <Input
              className={clsx("h-10 w-full border border-neutral-03", {
                // "border-red-500": errors.username,
              })}
              placeholder="รหัสผ่าน"
              type="password"
              value={formData.accountPassword}
              onChange={(e) =>
                onInputChange("accountPassword", e.target.value)
              }
              disabled={disabled}
            />
          </div>
          <div className="flex flex-col gap-1 w-1/2">
            <p className="text-sm font-semibold text-neutral-08">
              ยืนยันรหัสผ่าน <span className="text-urgent-fail-02">*</span>
            </p>
            <Input
              className={clsx("h-10 w-full border border-neutral-03", {
                // "border-red-500": errors.username,
              })}
              placeholder="ยืนยันรหัสผ่าน"
              type="password"
              value={formData.accountPassword}
              onChange={(e) =>
                onInputChange("accountPassword", e.target.value)
              }
              disabled={disabled}
            />
          </div>
        </div>
      </div>
      <div className="bg-modal-01 p-4 rounded-xl mt-4 ">
        <div className="flex flex-row gap-1 w-full">
          <div className="bg-white p-4 rounded-lg w-1/3">
            <p className="text-sm font-semibold text-neutral-08">
              แพ็คเกจแบบจำกัดจำนวน
            </p>
            <div className="flex flex-row gap-1 w-full mt-2">
              <div className="flex flex-col gap-1 w-1/2">
                <p className="text-sm font-semibold text-neutral-08">
                  จำนวน (ออเดอร์) <span className="text-urgent-fail-02">*</span>
                </p>
                <Input
                  className={clsx("h-10 w-full border border-neutral-03", {
                    // "border-red-500": errors.username,
                  })}
                  placeholder="0"
                  type="number"
                  value={formData.limitedOrderQuota}
                  onChange={(e) =>
                    onInputChange("limitedOrderQuota", e.target.value)
                  }
                  disabled={disabled}
                />
              </div>
              <div className="flex flex-col gap-1 w-1/2">
                <p className="text-sm font-semibold text-neutral-08">
                  ราคา (เหรียญ) <span className="text-urgent-fail-02">*</span>
                </p>
                <Input
                  className={clsx("h-10 w-full border border-neutral-03", {
                    // "border-red-500": errors.username,
                  })}
                  placeholder="0.00"
                  type="number"
                  value={formData.limitedPrice}
                  onChange={(e) =>
                    onInputChange("limitedPrice", e.target.value)
                  }
                  disabled={disabled}
                />
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg w-1/3">
            <p className="text-sm font-semibold text-neutral-08">
              แพ็คเกจรายเดือน
            </p>
            <div className="flex flex-row gap-1 w-full mt-2">
              <div className="flex flex-col gap-1 w-1/2">
                <p className="text-sm font-semibold text-neutral-08">
                  ระยะเวลา (วัน) <span className="text-urgent-fail-02">*</span>
                </p>
                <Input
                  className={clsx("h-10 w-full border border-neutral-03", {
                    // "border-red-500": errors.username,
                  })}
                  placeholder="0"
                  type="number"
                  value={formData.monthlyDurationDays}
                  onChange={(e) =>
                    onInputChange("monthlyDurationDays", e.target.value)
                  }
                  disabled={disabled}
                />
              </div>
              <div className="flex flex-col gap-1 w-1/2">
                <p className="text-sm font-semibold text-neutral-08">
                  ราคา (เหรียญ) <span className="text-urgent-fail-02">*</span>
                </p>
                <Input
                  className={clsx("h-10 w-full border border-neutral-03", {
                    // "border-red-500": errors.username,
                  })}
                  placeholder="0.00"
                  type="number"
                  value={formData.monthlyPrice}
                  onChange={(e) =>
                    onInputChange("monthlyPrice", e.target.value)
                  }
                  disabled={disabled}
                />
              </div>
            </div>
          </div>{" "}
          <div className="bg-white p-4 rounded-lg w-1/3">
            <p className="text-sm font-semibold text-neutral-08">
              แพ็คเก็จรายปี
            </p>
            <div className="flex flex-row gap-1 w-full mt-2">
              <div className="flex flex-col gap-1 w-1/2">
                <p className="text-sm font-semibold text-neutral-08">
                  ระยะเวลา (วัน) <span className="text-urgent-fail-02">*</span>
                </p>
                <Input
                  className={clsx("h-10 w-full border border-neutral-03", {
                    // "border-red-500": errors.username,
                  })}
                  placeholder="0"
                  type="number"
                  value={formData.yearlyDurationDays}
                  onChange={(e) =>
                    onInputChange("yearlyDurationDays", e.target.value)
                  }
                  disabled={disabled}
                />
              </div>
              <div className="flex flex-col gap-1 w-1/2">
                <p className="text-sm font-semibold text-neutral-08">
                  ราคา (เหรียญ) <span className="text-urgent-fail-02">*</span>
                </p>
                <Input
                  className={clsx("h-10 w-full border border-neutral-03", {
                    // "border-red-500": errors.username,
                  })}
                  placeholder="0.00"
                  type="number"
                  value={formData.yearlyPrice}
                  onChange={(e) =>
                    onInputChange("yearlyPrice", e.target.value)
                  }
                  disabled={disabled}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
