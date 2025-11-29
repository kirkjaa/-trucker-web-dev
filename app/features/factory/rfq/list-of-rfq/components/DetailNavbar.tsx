"use client";

import clsx from "clsx";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

import { iconNames, Icons } from "@/app/icons";
import { EFacPathName } from "@/app/types/enum";

interface IRfqPaths {
  iconName: keyof typeof iconNames;
  name: string;
  href: string;
}

export default function DetailNavBar() {
  // Hook
  const { rfqId } = useParams();
  const pathName = usePathname();

  // Function
  const rfqPath: IRfqPaths[] = [
    {
      iconName: "ChevronLeft",
      name: "ย้อนกลับ",
      href: EFacPathName.RFQLIST,
    },
    {
      iconName: "PinSolid",
      name: "เส้นทางการขนส่ง",
      href: `/factory/list-of-rfq/${rfqId}/routes`,
    },
    {
      iconName: "DocumentBulk",
      name: "ข้อมูลเสนอราคา",
      href: `/factory/list-of-rfq/${rfqId}/info`,
    },
  ];

  return (
    <div className="flex text-primary-blue-main border-b-2">
      {rfqPath.map((rfq) => (
        <Link
          className={clsx(
            "flex px-10 items-center gap-4 pb-6 cursor-pointer",
            {
              "border-b-2 border-primary-blue-main": pathName === rfq.href,
            },
            {
              "pl-0 border-b-0": rfq.name === "ย้อนกลับ",
            }
          )}
          key={rfq.name}
          href={rfq.href}
        >
          <Icons name={rfq.iconName} className="w-6 h-6" />
          <p className="text-lg font-bold">{rfq.name}</p>
        </Link>
      ))}
    </div>
  );
}
