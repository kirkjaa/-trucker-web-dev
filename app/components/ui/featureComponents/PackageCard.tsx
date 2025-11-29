"use client";

import React, { useMemo } from "react";
import Image, { StaticImageData } from "next/image";

import { Checkbox } from "../checkbox";

import { PackageType } from "@/app/types/enum";
import BackgroundPackageHover from "@/public/images/background-package-hover.png";
import MonthlyPackageIcon from "@/public/images/monthly-package-icon.png";
import TestPackageIcon from "@/public/images/test-package-icon.png";
import YearlyPackageIcon from "@/public/images/yearly-package-icon.png";

type PackageCardProps = {
  packageType: PackageType;
};
type PackageDisplayType = {
  image: StaticImageData;
  title: string;
  price: number;
  days: number;
};

export default function TestPackageCard({ packageType }: PackageCardProps) {
  const packageDisplay: PackageDisplayType = useMemo(() => {
    switch (packageType) {
      case PackageType.TEST:
        return {
          image: TestPackageIcon,
          title: "ทดลองใช้งาน",
          price: 0,
          days: 0,
        };
      case PackageType.MONTHLY:
        return {
          image: MonthlyPackageIcon,
          title: "แพ็คเกจรายเดือน",
          price: 1400,
          days: 30,
        };
      case PackageType.YEARLY:
        return {
          image: YearlyPackageIcon,
          title: "แพ็คเกจรายปี",
          price: 16000,
          days: 365,
        };
    }
  }, [packageType]);
  return (
    <div className="group relative w-full flex overflow-hidden rounded-3xl cursor-pointer shadow-lg hover:shadow-green-800">
      {/* Background Image on Hover */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ backgroundImage: `url(${BackgroundPackageHover.src})` }}
      ></div>

      {/* Content */}
      <div className="relative z-10 flex items-center group-hover:text-white transition-colors duration-300 h-32">
        <Image
          src={packageDisplay.image}
          alt="test-package"
          width={100}
          height={100}
          className="h-full w-32"
        />
        <div className="relative">
          <div className="flex flex-col text-sm py-2 pl-2 w-full">
            <p className="text-base font-semibold hover:text-white">
              {packageDisplay.title}
            </p>
            <p className="text-[10px] md:text-[12px]">
              ทดลองใช้งานแบบไม่มีค่าใช้จ่าย
            </p>
            <p className="text-[10px] md:text-[12px]">
              ฟีเจอร์ทั้งหมด สนับสนนตลอดการใช้งาน
            </p>
            <p className="text-secondary-caribbean-green-main ">
              ระยะเวลา
              <span className="font-semibold"> {packageDisplay.days} </span> วัน
            </p>
            <p className=" font-semibold">
              <span className="text-secondary-caribbean-green-main">
                {packageDisplay.price}
              </span>{" "}
              บาท
            </p>
          </div>
        </div>
      </div>
      <div className="absolute top-0 right-0 p-4">
        <Checkbox />
      </div>
    </div>
  );
}
