"use client";

import clsx from "clsx";
import { usePathname, useRouter } from "next/navigation";

import { Icons } from "@/app/icons";
import { EComPathName } from "@/app/types/enum";

export default function SelectedList() {
  // Hook
  const router = useRouter();
  const pathName = usePathname();

  return (
    <div className="flex gap-16 pl-10 text-main-02 border-b">
      <div
        className={clsx("flex items-center gap-2 pb-4 cursor-pointer", {
          "border-b-2 border-primary-blue-main text-primary-blue-main":
            pathName === EComPathName.QUOFAC,
        })}
        onClick={() => router.push(EComPathName.QUOFAC)}
      >
        <Icons
          name={
            pathName === EComPathName.QUOFAC
              ? "SidebarPriceList"
              : "DocumentBold"
          }
          className="w-6 h-6 text-neutral-04"
        />
        <p className="text-lg font-bold">รอเสนอราคา</p>
      </div>

      <div
        className={clsx("flex items-center gap-2 pb-4 cursor-pointer", {
          "border-b-2 border-primary-blue-main text-primary-blue-main":
            pathName === EComPathName.QUOFAC_OFFERED,
        })}
        onClick={() => router.push(EComPathName.QUOFAC_OFFERED)}
      >
        <Icons
          name={
            pathName === EComPathName.QUOFAC_OFFERED
              ? "PaperCheckBulkGreen"
              : "PaperCheckBulkGray"
          }
          className="w-6 h-6"
        />
        <p className="text-lg font-bold">เสนอราคาแล้ว</p>
      </div>

      <div
        className={clsx("flex items-center gap-2 pb-4 cursor-pointer", {
          "border-b-2 border-primary-blue-main text-primary-blue-main":
            pathName === EComPathName.QUOFAC_REJECTED,
        })}
        onClick={() => router.push(EComPathName.QUOFAC_REJECTED)}
      >
        <Icons
          name={
            pathName === EComPathName.QUOFAC_REJECTED
              ? "PaperFailBulkGreen"
              : "PaperFailBulkGray"
          }
          className="w-6 h-6"
        />
        <p className="text-lg font-bold">ถูกปฏิเสธ</p>
      </div>

      <div
        className={clsx("flex items-center gap-2 pb-4 cursor-pointer", {
          "border-b-2 border-primary-blue-main text-primary-blue-main":
            pathName === EComPathName.QUOFAC_CANCELED,
        })}
        onClick={() => router.push(EComPathName.QUOFAC_CANCELED)}
      >
        <Icons
          name={
            pathName === EComPathName.QUOFAC_CANCELED
              ? "CloseSquareBulkGreen"
              : "CloseSquareBulkGray"
          }
          className="w-6 h-6"
        />
        <p className="text-lg font-bold">ยกเลิกการเสนอราคา</p>
      </div>
    </div>
  );
}
