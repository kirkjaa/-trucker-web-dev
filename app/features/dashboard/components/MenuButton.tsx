import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { iconNames, Icons } from "@/app/icons";
import { EFacPathName } from "@/app/types/enum";

interface IDashboardPathsProps {
  icon: keyof typeof iconNames;
  name: string;
  href: string;
}

export default function MenuButton() {
  // Hook
  const pathName = usePathname();

  // Function
  const dashboardPaths: IDashboardPathsProps[] = [
    {
      icon: "Summary",
      name: "ภาพรวม",
      href: EFacPathName.DASHBOARD_SUMMARY,
    },
    {
      icon: "CoinsPrimaryGray",
      name: "การเงิน",
      href: EFacPathName.DASHBOARD_FINANCIAL,
    },
    {
      icon: "Paper",
      name: "ใบเสนอราคา",
      href: EFacPathName.DASHBOARD_QUOTATION,
    },
    {
      icon: "Truck",
      name: "การจัดส่ง",
      href: EFacPathName.DASHBOARD_ORDER,
    },
  ];

  return (
    <div className="flex justify-between text-main-02">
      {dashboardPaths.map((dashborad) => (
        <Link
          className={clsx(
            "w-full flex justify-center px-10 items-center gap-4 pb-6 cursor-pointer border-b-2",
            {
              "border-primary-blue-main text-primary-blue-main":
                pathName === dashborad.href,
            }
          )}
          key={dashborad.name}
          href={dashborad.href}
        >
          <Icons
            name={dashborad.icon}
            className={clsx("w-6 h-6 text-main-02", {
              "text-primary-oxley-green-main": pathName === dashborad.href,
            })}
          />
          <p className="text-lg font-bold">{dashborad.name}</p>
        </Link>
      ))}
    </div>
  );
}
