"use client";

import React from "react";
import Image from "next/image";

import MyProfileForm from "./MyProfileForm";

import { Button } from "@/app/components/ui/button";
import RemainingCoins from "@/app/components/ui/featureComponents/RemainingCoins";
import { Icons } from "@/app/icons";
import { ICompanyMe } from "@/app/types/companyType";
import { ERoles } from "@/app/types/enum";
import { IFactoryMe } from "@/app/types/factoryType";
import formatPhoneNumber from "@/app/utils/formatPhoneNumber";
import placeHolderPerson from "@/public/placeHolderPerson.png";
type MyProfileProps = {
  data?: ICompanyMe | IFactoryMe;
  imageUrl?: string;
  type: ERoles;
};

export default function MyProfile({ data, imageUrl, type }: MyProfileProps) {
  const [visibleForm, setVisibleForm] = React.useState(false);

  return (
    <React.Fragment>
      {visibleForm ? (
        <MyProfileForm
          setVisibleForm={setVisibleForm}
          data={data}
          imageUrl={imageUrl}
          type={type}
        />
      ) : (
        <div className="flex w-full flex-wrap justify-between gap-4">
          <div className="flex w-full justify-center">
            <Image
              src={data?.imageUrl || placeHolderPerson}
              alt="user image"
              width={60}
              height={60}
              className="w-fit h-fit rounded-full "
            />
          </div>
          <div className="flex justify-between w-full bg-yellow-100 rounded-xl">
            <div className="w-1/2">
              <RemainingCoins coins={0} />
            </div>
            <div className="w-1/2 p-2 text-right">
              <Button className="mr-2" variant="secondary">
                ถอนเหรียญ
              </Button>
              <Button>เติมเหรียญ</Button>
            </div>
          </div>
          <div className="border-b-2 w-full flex justify-between flex-wrap gap-4">
            <div className="p-2 w-1/3">
              <div className="w-1/2">บริษัท</div>
              <div className="w-1/2">{data?.name}</div>
            </div>
            <div className="p-2 w-1/3">
              <div className="w-1/2">ประเภทธุรกิจ</div>
              <div className="w-1/2">{data?.businessType}</div>
            </div>
            <div className="w-full p-2">
              <div className="w-1/2">ตำแหน่งที่ตั้ง</div>
              <div className="w-1/2">{data?.address.addressLine1}</div>
            </div>
          </div>
          <div className="border-b-2 w-full flex justify-between flex-wrap gap-4">
            <div className="p-2 w-1/3">
              <div className="w-1/2">เบอร์โทรศัพท์</div>
              <div className="w-1/2">
                {data?.phone && formatPhoneNumber(data?.phone)}
              </div>
            </div>
            <div className="p-2 w-1/3">
              <div className="w-1/2">อีเมล</div>
              <div className="w-1/2">{data?.email}</div>
            </div>
            <div className="w-full p-2 text-right">
              <Button onClick={() => setVisibleForm(!visibleForm)}>
                <Icons name="Pen" />
                แก้ไขโปรไฟล์
              </Button>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
}
