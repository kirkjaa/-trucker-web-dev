import React from "react";

import { formatISOToDate } from "@/app/utils/formatDate";
import formatPhoneNumber from "@/app/utils/formatPhoneNumber";

type ShippingCompanyCardProps = {
  name?: string;
  contractTime?: string;
  contractStart?: Date;
  contractEnd?: Date;
  phone?: string;
  email?: string;
};

export default function ShippingCompanyCard({
  name,
  contractTime,
  contractStart,
  contractEnd,
  phone,
  email,
}: ShippingCompanyCardProps) {
  return (
    <div className="flex flex-wrap  flex-row gap-4 border-2 border-gray-300 p-4 rounded-lg w-full">
      <div className="flex flex-col w-1/4">
        <p>ชื่อโรงงาน</p>
        <p>{name}</p>
      </div>
      <div className="flex flex-col w-1/4">
        <p>ระยะเวลาสัญญา</p>
        <p>
          {contractStart && contractEnd
            ? `${formatISOToDate.toShortFormat(contractStart)} -
          ${formatISOToDate.toShortFormat(contractEnd)}`
            : ""}
        </p>
      </div>
      <div className="flex flex-col w-1/4">
        <p>อายุสัญญา</p>
        <p>{contractTime}</p>
      </div>
      <div className="flex flex-col w-1/4">
        <p>เบอร์โทรศัพท์</p>
        <p>{phone && formatPhoneNumber(phone)}</p>
      </div>
      <div className="flex flex-col w-1/4">
        <p>อีเมล</p>
        <p>{email}</p>
      </div>
    </div>
  );
}
