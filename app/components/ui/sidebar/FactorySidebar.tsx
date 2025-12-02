"use client";

import { useEffect, useMemo, useState } from "react";
import React from "react";
import { deleteCookie } from "cookies-next";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTrigger,
  useSidebar,
} from "./sidebar";
import SideBarGroup from "./SidebarGroup";

import MyProfileModal from "@/app/features/profile/components/MyProfileModal";
import useMyProfile from "@/app/features/profile/hooks/useMyProfile";
import { iconNames, Icons } from "@/app/icons";
import { useUserStore } from "@/app/store/user/userStore";
import { EFacPathName, ERoles, Routers } from "@/app/types/enum";
import formatFullName from "@/app/utils/formatFullName";
import { cn } from "@/lib/utils";
import sidebarLogo from "@/public/images/logo-sidebar.png";
import placeHolderPerson from "@/public/placeHolderPerson.png";

import { ThemeToggle } from "./ThemeToggle";

interface IconMapping {
  [key: string]: keyof typeof iconNames;
}
// Factory Role
const iconMapping: IconMapping = {
  แผงควบคุม: "SidebarControl",
  จัดการผู้ใช้: "SidebarUser",
  รายชื่อบริษัทขนส่ง: "SidebarWork",
  แชท: "SidebarChat",
  เสนอราคา: "SidebarPriceList",
  การขนส่ง: "SidebarTransport",
  บิลรอการเบิกจ่าย: "SidebarBill",
  รถบรรทุกโรงงาน: "SidebarTruck",
  รหัสเส้นทาง: "SidebarPin",
  แพ็คแกจ: "SidebarPackage",
  ปลั๊กอินเสริม: "SidebarPlugin",
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
      url: "/factory/users",
      iconLight: "ListPrimaryOutLine",
      iconBulk: "ListPrimary",
    },
    {
      title: "ตำแหน่งงาน",
      url: "/factory/position/users",
      iconLight: "BusinessCardPrimaryOutline",
      iconBulk: "BusinessCardPrimary",
    },
  ],
  รายชื่อบริษัทขนส่ง: [],
  แชท: [],
  เสนอราคา: [
    {
      title: "รายการเสนอราคา",
      url: "/factory/list-of-rfq",
      iconLight: "SidebarCashLight",
      iconBulk: "SidebarCashBulk",
    },
    {
      title: "รายการรอดำเนินการ",
      url: "/factory/quotation-pending",
      iconLight: "SidebarClockLight",
      iconBulk: "SidebarClockBulk",
    },
    {
      title: "รายการดำเนินการอยู่",
      url: "/factory/quotation-approved",
      iconLight: "SidebarClockLight",
      iconBulk: "SidebarClockBulk",
    },
    {
      title: "รายการหมดอายุ",
      url: "/factory/quotation-expired",
      iconLight: "SidebarWarningLight",
      iconBulk: "SidebarWarningBulk",
    },
  ],
  การขนส่ง: [
    {
      title: "รอการตอบกลับ",
      url: "/factory/orders/published",
      iconLight: "WaitingGreen",
      iconBulk: "WaitingBulk",
    },
    {
      title: "รอดำเนินการ",
      url: "/factory/orders/matched",
      iconLight: "SidebarClockLight",
      iconBulk: "SidebarClockBulk",
    },
    {
      title: "เริ่มขนส่ง",
      url: "/factory/orders/start-ship",
      iconLight: "DeliveryGreen",
      iconBulk: "DeliveryBulk",
    },
    {
      title: "ปิดงาน",
      url: "/factory/orders/shipped",
      iconLight: "LocationCheckGreen",
      iconBulk: "LocationCheckBulk",
    },
    {
      title: "ประวัติการขนส่ง",
      url: "/factory/orders/completed",
      iconLight: "ListPrimaryOutLine",
      iconBulk: "ListPrimary",
    },
  ],
  บิลรอการเบิกจ่าย: [
    {
      title: "บิลรอเบิกจ่ายขนส่ง",
      url: "/factory/transportation/disbursement",
      iconLight: "TruckPrimaryOutline",
      iconBulk: "TruckPrimary",
    },
    {
      title: "บิลรอเบิกจ่ายพนักงาน",
      url: "/factory/employee/disbursement",
      iconLight: "ThreeUserPrimaryOutline",
      iconBulk: "ThreeUserPrimary",
    },
  ],
  รถบรรทุกโรงงาน: [],
  รหัสเส้นทาง: [
    {
      title: "รหัสเส้นทางขนส่งในประเทศ",
      url: "/factory/route-code/domestic",
      iconLight: "ListPrimaryOutLine",
      iconBulk: "ListPrimary",
    },
    {
      title: "รหัสเส้นทางขนส่งต่างประเทศ",
      url: "/factory/route-code/international",
      iconLight: "ListPrimaryOutLine",
      iconBulk: "ListPrimary",
    },
  ],
  /* แพ็คแกจ: [], */
  ปลั๊กอินเสริม: [
    {
      title: "11",
      url: "/11",
    },
  ],
};

export function FactorySidebar() {
  // Global State
  const userMe = useUserStore((state) => state.userMe);

  // Local State
  const [activeGroup, setActiveGroup] = useState<string | null>(null);

  // Hook
  const pathName = usePathname();
  const router = useRouter();
  const { state } = useSidebar();
  /* const { fetchDataList, getTotalNotification } = useNotification(); */
  /* const notificationUnread = useMemo(() => { */
  /*   return getTotalNotification(); */
  /* }, [getTotalNotification]); */
  const {
    openProfileModal,
    setOpenProfileModal,
    handleOpenProfileModal,
    getMyFactory,
  } = useMyProfile();

  const userPermissions = userMe?.position;

  const filteredSidebarItems = useMemo(() => {
    if (!userPermissions) return {};

    const permissionMapping: Record<string, boolean> = {
      แผงควบคุม: userPermissions.is_dashboard === "Y",
      จัดการผู้ใช้: userPermissions.is_user === "Y",
      รายชื่อบริษัทขนส่ง: true,
      แชท: userPermissions.is_chat === "Y",
      เสนอราคา: userPermissions.is_quotation === "Y",
      การขนส่ง: userPermissions.is_order === "Y",
      บิลรอการเบิกจ่าย: true,
      รถบรรทุกโรงงาน: userPermissions.is_truck === "Y",
      แพ็คแกจ: userPermissions.is_package === "Y",
      รหัสเส้นทาง: true,
    };

    return Object.fromEntries(
      Object.entries(sidebarItems).filter(([label]) => permissionMapping[label])
    );
  }, [userPermissions]);

  // Use Effect
  useEffect(() => {
    if (activeGroup === "รถบรรทุกโรงงาน") {
      router.push(EFacPathName.TRUCK);
    } else if (activeGroup === "รายชื่อบริษัทขนส่ง") {
      router.push(EFacPathName.SHIPPINGCOMPANY);
    } else if (activeGroup === "แชท") {
      router.push(EFacPathName.CHAT);
    } else if (activeGroup === "แพ็คแกจ") {
      router.push(EFacPathName.PACKAGE);
    } else if (activeGroup === "แผงควบคุม") {
      router.push(EFacPathName.DASHBOARD_SUMMARY);
    }
  }, [activeGroup]);

  useEffect(() => {
    if (pathName === EFacPathName.TRUCK) {
      setActiveGroup("รถบรรทุกโรงงาน");
    } else if (pathName === EFacPathName.SHIPPINGCOMPANY) {
      setActiveGroup("รายชื่อบริษัทขนส่ง");
    } else if (pathName === EFacPathName.CHAT) {
      setActiveGroup("แชท");
    } else if (pathName === EFacPathName.PACKAGE) {
      setActiveGroup("แพ็คแกจ");
    } else if (pathName === EFacPathName.DASHBOARD_SUMMARY) {
      setActiveGroup("แผงควบคุม");
    } else {
      Object.entries(sidebarItems).forEach(([label, items]) => {
        if (items.some((item) => pathName.startsWith(item.url))) {
          setActiveGroup(label);
        }
      });
    }
    /* if (pathName !== Routers.NOTIFICATION) */
    /*   fetchDataList(undefined, undefined, false); */
  }, [pathName]);

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
            onClick={() => handleOpenProfileModal(true)}
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
        data={getMyFactory() || undefined}
        type={ERoles.FACTORY}
      />
    </React.Fragment>
  );
}
