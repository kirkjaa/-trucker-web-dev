"use client";

import React, { useEffect, useMemo, useState } from "react";
import { deleteCookie } from "cookies-next";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

import { LanguageSwitcher } from "./LanguageSwitcher";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTrigger,
  useSidebar,
} from "./sidebar";
import SideBarGroup from "./SidebarGroup";
import { ThemeToggle } from "./ThemeToggle";

import MyProfileModal from "@/app/features/profile/components/MyProfileModal";
import useMyProfile from "@/app/features/profile/hooks/useMyProfile";
import { iconNames, Icons } from "@/app/icons";
import { useUserStore } from "@/app/store/user/userStore";
import { EComPathName, ERoles, Routers } from "@/app/types/enum";
import formatFullName from "@/app/utils/formatFullName";
import { cn } from "@/lib/utils";
import sidebarLogo from "@/public/images/logo-sidebar.png";
import placeHolderPerson from "@/public/placeHolderPerson.png";

interface IconMapping {
  [key: string]: keyof typeof iconNames;
}
// Company Role
const iconMapping: IconMapping = {
  แผงควบคุม: "SidebarControl",
  จัดการผู้ใช้: "SidebarUser",
  "ตลาด (Pool)": "SidebarMarket",
  แชท: "SidebarChat",
  เสนอราคา: "SidebarPriceList",
  การขนส่ง: "SidebarTransport",
  บิลรอการเบิกจ่าย: "SidebarBill",
  รถบรรทุกบริษัท: "SidebarTruck",
  ฟอร์มราคากลาง: "SidebarForm",
  แพ็คแกจ: "SidebarPackage",
};

const sidebarItems: {
  [key: string]: {
    title?: string;
    url: string;
    iconLight?: keyof typeof iconNames;
    iconBulk?: keyof typeof iconNames;
  }[];
} = {
  //แผงควบคุม: [],
  จัดการผู้ใช้: [
    {
      title: "รายการผู้ใช้งาน",
      url: "/company/users",
      iconLight: "ListPrimaryOutLine",
      iconBulk: "ListPrimary",
    },
    {
      title: "รายการผู้ขับรถ",
      url: "/company/driver/users",
      iconLight: "ListPrimaryOutLine",
      iconBulk: "ListPrimary",
    },
    {
      title: "ตำแหน่งงาน",
      url: "/company/position/users",
      iconLight: "BusinessCardPrimaryOutline",
      iconBulk: "BusinessCardPrimary",
    },
  ],
  "ตลาด (Pool)": [
    {
      title: "ตลาดพูลโพสต์",
      url: "/company/market/pool",
      iconLight: "GraphLinePrimaryOutline",
      iconBulk: "GraphLinePrimary",
    },
    // {
    //   title: "ตลาดประมูล",
    //   url: "/company/auction/pool",
    //   iconLight: "SidebarBillOutline",
    //   iconBulk: "SidebarBill",
    // },
    {
      title: "โพสต์ของฉัน",
      url: "/company/post/pool",
      iconLight: "BookmarkPrimaryOutline",
      iconBulk: "BookmarkPrimary",
    },
    {
      title: "ประวัติโพสต์",
      url: "/company/history/pool",
      iconLight: "TimeCirclePrimaryOutline",
      iconBulk: "TimeCirclePrimary",
    },
  ],
  แชท: [],
  เสนอราคา: [
    {
      title: "รายการเสนอราคา (โรงงาน)",
      url: "/company/quotation-factory",
      iconLight: "SidebarCashLight",
      iconBulk: "SidebarCashBulk",
    },
    {
      title: "รายการเสนอราคา (ตลาด)",
      url: "/company/quotation-market",
      iconLight: "SidebarPaperLight",
      iconBulk: "SidebarPriceList",
    },
    {
      title: "รายการรอดำเนินการ",
      url: "/company/quotation-pending",
      iconLight: "SidebarClockLight",
      iconBulk: "SidebarClockBulk",
    },
    {
      title: "รายการดำเนินการอยู่",
      url: "/company/quotation-approved",
      iconLight: "SidebarClockLight",
      iconBulk: "SidebarClockBulk",
    },
    {
      title: "รายการหมดอายุ",
      url: "/company/quotation-expired",
      iconLight: "SidebarWarningLight",
      iconBulk: "SidebarWarningBulk",
    },
  ],
  การขนส่ง: [
    {
      title: "ใบงาน",
      url: "/company/orders/published",
      iconLight: "SidebarPaperLight",
      iconBulk: "SidebarPriceList",
    },
    {
      title: "เริ่มขนส่ง",
      url: "/company/orders/start-ship",
      iconLight: "DeliveryGreen",
      iconBulk: "DeliveryBulk",
    },
    // {
    //   title: "โพสต์งาน",
    //   url: "/company/orders/post",
    //   iconLight: "SidebarWarningLight",
    //   iconBulk: "SidebarWarningBulk",
    // },
    {
      title: "ปิดงาน",
      url: "/company/orders/shipped",
      iconLight: "LocationCheckGreen",
      iconBulk: "LocationCheckBulk",
    },
  ],
  บิลรอการเบิกจ่าย: [
    {
      title: "บิลรอเบิกจ่ายโรงงาน",
      url: "/company/factory/disbursement",
      iconLight: "FactoryPrimary",
      iconBulk: "FactoryPrimary",
    },
    {
      title: "บิลรอเบิกจ่ายพนักงาน",
      url: "/company/employee/disbursement",
      iconLight: "ThreeUserPrimaryOutline",
      iconBulk: "ThreeUserPrimary",
    },
    {
      title: "บิลรอเบิกจ่ายรถซัพ",
      url: "/company/freelance/disbursement",
      iconLight: "TruckPrimaryOutline",
      iconBulk: "TruckPrimary",
    },
  ],
  รถบรรทุกบริษัท: [
    {
      title: "รายการรถบรรทุก",
      url: "/company/truck",
      iconLight: "ListPrimaryOutLine",
      iconBulk: "ListPrimary",
    },
    {
      title: "รายการรถบรรทุก (เช่า)",
      url: "/company/rental/truck",
      iconLight: "BoltPrimaryOutline",
      iconBulk: "BoltPrimary",
    },
  ],
  ฟอร์มราคากลาง: [
    {
      title: "เส้นทางในประเทศ",
      url: "/company/domestic/price-entry",
      iconLight: "PinPrimaryOutline",
      iconBulk: "PinPrimary",
    },
    {
      title: "เส้นทางต่างประเทศ",
      url: "/company/abroad/price-entry",
      iconLight: "PinPrimaryOutline",
      iconBulk: "PinPrimary",
    },
  ],
  /* แพ็คแกจ: [], */
};

export function CompanySidebar() {
  // Global State
  const userMe = useUserStore((state) => state.userMe);

  // Local State
  const [activeGroup, setActiveGroup] = useState<string | null>(null);

  // Hook
  const pathName = usePathname();
  const router = useRouter();
  const { state } = useSidebar();
  /* const { getNotificationList, fetchDataList } = useNotification(); */
  /* const notificationUnread = useMemo(() => { */
  /*   return getNotificationList().filter((data) => !data.isRead).length; */
  /* }, [getNotificationList()]); */
  const {
    openProfileModal,
    setOpenProfileModal,
    handleOpenProfileModal,
    getMyCompany,
  } = useMyProfile();

  const userPermissions = userMe?.position;

  const filteredSidebarItems = useMemo(() => {
    if (!userPermissions) return {};

    const permissionMapping: Record<string, boolean> = {
      แผงควบคุม: userPermissions.is_dashboard === "Y",
      จัดการผู้ใช้: userPermissions.is_user === "Y",
      "ตลาด (Pool)": true,
      แชท: userPermissions.is_chat === "Y",
      เสนอราคา: userPermissions.is_quotation === "Y",
      การขนส่ง: userPermissions.is_order === "Y",
      บิลรอการเบิกจ่าย: true,
      รถบรรทุกบริษัท: userPermissions.is_truck === "Y",
      ฟอร์มราคากลาง: true,
      แพ็คแกจ: userPermissions.is_package === "Y",
    };

    return Object.fromEntries(
      Object.entries(sidebarItems).filter(([label]) => permissionMapping[label])
    );
  }, [userPermissions]);

  // Use Effect
  useEffect(() => {
    if (pathName === EComPathName.TRUCK) {
      setActiveGroup("รถบรรทุกบริษัท");
    } else if (pathName === EComPathName.PACKAGE) {
      setActiveGroup("แพ็คแกจ");
    } else if (pathName === EComPathName.CHAT) {
      setActiveGroup("แชท");
    } else {
      Object.entries(sidebarItems).forEach(([label, items]) => {
        if (items.some((item) => pathName === item.url)) {
          setActiveGroup(label);
        }
      });
    }
    /* if (pathName !== Routers.NOTIFICATION) fetchDataList(); */
  }, [pathName]);

  useEffect(() => {
    if (activeGroup === "แผงควบคุม") {
      router.push(EComPathName.DASHBOARD_SUMMARY);
    } else if (activeGroup === "แชท") {
      router.push(EComPathName.CHAT);
    } else if (activeGroup === "แพ็คแกจ") {
      router.push(EComPathName.PACKAGE);
    }
  }, [activeGroup]);

  // Function
  const handleSignOut = async (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteCookie("fcmToken", { path: "/" });
    localStorage.clear();
    await signOut();
  };

  const handleControlClick = () => {};

  return (
    <React.Fragment>
      <Sidebar>
        <div
          className={cn("px-8 pb-5 flex flex-col gap-2", {
            "items-center": state === "collapsed",
          })}
        >
          <SidebarHeader>
            <Image
              src={sidebarLogo}
              alt="logo"
              width={100}
              height={100}
              className={cn("w-32 h-16", {
                "h-12 mt-1": state === "collapsed",
              })}
              priority
            />
            <SidebarTrigger />
          </SidebarHeader>

          <p className="pt-5 body3 text-sidebar-text-head">บัญชีผู้ใช้งาน</p>

          <div
            className={cn(
              "flex gap-3 p-2 cursor-pointer rounded-lg hover:bg-sidebar-user-card",
              state === "collapsed" && "bg-tranperent",
              openProfileModal && "bg-sidebar-user-card"
            )}
            onClick={() => handleOpenProfileModal()}
          >
            <Image
              src={userMe?.image_url || placeHolderPerson}
              alt="user image"
              width={40}
              height={40}
              className="w-fit h-fit rounded-full border border-secondary-caribbean-green-main"
            />
            {state === "expanded" && (
              <>
                <div className="flex flex-col">
                  <p className="max-w-24 line-clamp-1 text-neutral-00  hover:text-secondary-caribbean-green-main">
                    {formatFullName(userMe?.first_name, userMe?.last_name)}
                  </p>
                  <p className="body3 text-neutral-05">
                    {userMe?.role ? userMe?.role.name_en : ""}
                  </p>
                  <div className="flex gap-1">
                    <p className="body3 text-secondary-caribbean-green-main">
                      397
                    </p>
                    <p className="body3 text-neutral-00">Coins ทีใช้ได้</p>
                  </div>
                </div>

                <div className="border-l border-neutral-05"></div>

                <Icons
                  name="Logout"
                  className="w-6 h-6 cursor-pointer"
                  onClick={handleSignOut}
                />
              </>
            )}
          </div>

          <div
            className={cn(
              "flex gap-3 p-2 rounded-lg cursor-pointer",
              pathName.startsWith(Routers.NOTIFICATION) &&
                "bg-sidebar-user-card"
            )}
            onClick={() => router.push(Routers.NOTIFICATION)}
          >
            <div className="relative">
              {/* {notificationUnread > 0 && ( */}
              {/*   <p className="text-3xl text-urgent-fail-02 absolute -right-0 -top-3"> */}
              {/*     • */}
              {/*   </p> */}
              {/* )} */}
              <Icons name="Bell" className="w-6 h-6" />
            </div>

            {/* {state === "expanded" && ( */}
            {/*   <p className="text-neutral-00 hover:text-secondary-caribbean-green-main"> */}
            {/*     {notificationUnread} รายการแจ้งเตือน */}
            {/*   </p> */}
            {/* )} */}
          </div>

          <ThemeToggle collapsed={state === "collapsed"} />
          <LanguageSwitcher collapsed={state === "collapsed"} />

          <p className="body3 text-sidebar-text-head">เมนูหลัก</p>
        </div>

        <SidebarContent>
          <div className="px-8 flex flex-col gap-2">
            {Object.entries(filteredSidebarItems).map(([label, items]) => (
              <SideBarGroup
                key={label}
                iconMain={iconMapping[label] as keyof typeof iconNames}
                label={label}
                items={items}
                isOpen={activeGroup === label}
                onClick={() =>
                  setActiveGroup(activeGroup === label ? null : label)
                }
                pathName={pathName}
                handleControlClick={handleControlClick}
              />
            ))}
          </div>
        </SidebarContent>
      </Sidebar>
      <MyProfileModal
        open={openProfileModal}
        setOpen={setOpenProfileModal}
        data={getMyCompany() || undefined}
        type={ERoles.COMPANY}
      />
    </React.Fragment>
  );
}
