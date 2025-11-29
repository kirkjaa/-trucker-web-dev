import React from "react";
import Image from "next/image";

import { EAdminPathName } from "@/app/types/enum";
import formatPhoneNumber from "@/app/utils/formatPhoneNumber";
import placeHolderPerson from "@/public/placeHolderPerson.png";
type FactoriesAndComponiesDetailCardProps = {
  name?: string;
  adminName?: string;
  phone?: string;
  email?: string;
  imageUrl?: string;
  pathName?: string;
};

export default function FactoriesAndComponiesDetailCard({
  name,
  adminName,
  phone,
  email,
  imageUrl,
  pathName,
}: FactoriesAndComponiesDetailCardProps) {
  return (
    <div className="flex flex-wrap gap-4 border-2 border-gray-300 p-4 rounded-lg">
      <div className="w-2/12">
        <Image
          src={imageUrl || placeHolderPerson}
          alt="logo"
          width={100}
          height={100}
          className="w-26 h-30 rounded-full"
          priority
        />
      </div>
      <div className="w-1/3 flex flex-col ">
        <div className="pb-2">
          <div className="mb-2">
            {pathName && pathName.includes(EAdminPathName.FACTORIES)
              ? "ชื่อโรงงาน"
              : "ชื่อบริษัท"}
          </div>
          <div className="text-neutral-06">{name}</div>
        </div>
        <div className="pb-2">
          <div className="mb-2">เบอร์โทรศัพท์</div>
          <div className="text-neutral-06">
            {formatPhoneNumber(phone || "")}
          </div>
        </div>
      </div>
      <div className="w-1/3 flex flex-col">
        <div className="pb-2">
          <div className="mb-2">ผู้ดูแล</div>
          <div className="text-neutral-06 break-words">{adminName || "-"}</div>
        </div>
        <div className="pb-2">
          <div className="mb-2">อีเมล</div>
          <div className="text-neutral-06">{email}</div>
        </div>
      </div>
    </div>
  );
}
