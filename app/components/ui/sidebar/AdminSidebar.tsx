"use client";

import React, { useEffect, useState } from "react";
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
import { EAdminPathName, ERoles, Routers } from "@/app/types/enum";
import formatFullName from "@/app/utils/formatFullName";
import { cn } from "@/lib/utils";
import sidebarLogo from "@/public/images/logo-sidebar.png";
import placeHolderPerson from "@/public/placeHolderPerson.png";

interface IconMapping {
  [key: string]: keyof typeof iconNames;
}

const iconMapping: IconMapping = {
  จัดการโรงงาน: "FactoryPrimary",
  จัดการบริษัทขนส่ง: "CompanyPrimary",
  จัดการผู้ใช้ระบบ: "SidebarUser",
  จัดการระบบเหรียญ: "CoinsPrimary",
  จัดการแพ็กเกจ: "TicketPrimary",
  จัดการรหัสเส้นทาง: "PinPrimary",
  จัดการคนขับ: "SidebarTransport",
  อัพโหลดTemplateCSV: "CsvTemplatePrimary",
  แชท: "ChatPrimary",
  ประเภทรถบรรทุก: "TruckPrimary",
  รับส่งข้อมูลลูกค้า: "SidebarForm",
  ปลั๊กอินเสริม: "PluginPrimary",
};

const sidebarItems: {
  [key: string]: {
    title?: string;
    url: string;
    iconLight?: keyof typeof iconNames;
    iconBulk?: keyof typeof iconNames;
  }[];
} = {
  จัดการโรงงาน: [],
  จัดการบริษัทขนส่ง: [],
  จัดการผู้ใช้ระบบ: [
    {
      title: "ผู้ใช้ระบบ - โรงงาน",
      url: "/admin/system-users/factories",
      iconLight: "ProfilePrimaryOutLine",
      iconBulk: "ProfilePrimary",
    },
    {
      title: "ผู้ใช้ระบบ - บริษัท",
      url: "/admin/system-users/companies",
      iconLight: "ProfilePrimaryOutLine",
      iconBulk: "ProfilePrimary",
    },
  ],
  จัดการคนขับ: [
    {
      title: "พนักงานขับรถภายใน",
      url: "/admin/drivers/internal",
      iconLight: "ListPrimaryOutLine",
      iconBulk: "ListPrimary",
    },
    {
      title: "คนขับรถอิสระ",
      url: "/admin/drivers/freelance",
      iconLight: "ListPrimaryOutLine",
      iconBulk: "ListPrimary",
    },
    {
      title: "รอตรวจสอบคนขับรถอิสระ",
      url: "/admin/drivers/review/freelance",
      iconLight: "ScanPrimary",
      iconBulk: "ScanPrimary",
    },
  ],
  /* จัดการระบบเหรียญ: [], */
  /* จัดการแพ็กเกจ: [], */
  จัดการรหัสเส้นทาง: [
    {
      title: "รหัสเส้นทางขนส่งในประเทศ",
      url: "/admin/route/domestic",
      iconLight: "ListPrimaryOutLine",
      iconBulk: "ListPrimary",
    },
    {
      title: "รหัสเส้นทางขนส่งต่างประเทศ",
      url: "/admin/route/international",
      iconLight: "ListPrimaryOutLine",
      iconBulk: "ListPrimary",
    },
    {
      title: "ยืนยันสร้างรหัสเส้นทางขนส่งในประเทศ",
      url: "/admin/route/confirm/domestic",
      iconLight: "CheckCircleOutline",
      iconBulk: "CheckCircle",
    },
    {
      title: "ยืนยันสร้างรหัสเส้นทางขนส่งต่างประเทศ",
      url: "/admin/route/confirm/international",
      iconLight: "CheckCircleOutline",
      iconBulk: "CheckCircle",
    },
  ],
  // ประเภทรถบรรทุก: [
  //   {
  //     title: "ประเภทรถบรรทุก",
  //     url: "/admin/truck/types",
  //     iconLight: "ListPrimaryOutLine",
  //     iconBulk: "ListPrimary",
  //   },
  //   {
  //     title: "ขนาดรถบรรทุก",
  //     url: "/admin/truck/sizes",
  //     iconLight: "ListPrimaryOutLine",
  //     iconBulk: "ListPrimary",
  //   },
  // ],
  /* รับส่งข้อมูลลูกค้า: [], */
  แชท: [],
  อัพโหลดTemplateCSV: [],
  ปลั๊กอินเสริม: [],
};

export default function AdminSidebar() {
  // Global State
  const userMe = useUserStore((state) => state.userMe);

  // Local State
  const [activeGroup, setActiveGroup] = useState<string | null>(null);

  // Hook
  const pathName = usePathname();
  const router = useRouter();
  const { state } = useSidebar();
  // const { getNotificationList, fetchDataList } = useNotification();
  // const notificationUnread = useMemo(() => {
  //   return getNotificationList().filter((data) => !data.isRead).length;
  // }, [getNotificationList()]);
  const {
    openProfileModal,
    setOpenProfileModal,
    handleOpenProfileModal,
    getMyCompany,
  } = useMyProfile();

  // Use Effect
  useEffect(() => {
    if (pathName === EAdminPathName.FACTORIES) {
      setActiveGroup("จัดการโรงงาน");
    } else if (pathName === EAdminPathName.COMPANIES) {
      setActiveGroup("จัดการบริษัทขนส่ง");
    } else if (pathName === EAdminPathName.UPLOADTEMPLATECSV) {
      setActiveGroup("อัพโหลดTemplateCSV");
    } else if (pathName === EAdminPathName.CHAT) {
      setActiveGroup("แชท");
    } else if (pathName === EAdminPathName.COINS) {
      setActiveGroup("จัดการระบบเหรียญ");
    } else if (pathName === EAdminPathName.PACKAGES) {
      setActiveGroup("จัดการแพ็กเกจ");
    } else if (pathName === EAdminPathName.DATAUSERS) {
      setActiveGroup("รับส่งข้อมูลลูกค้า");
    } else if (pathName === EAdminPathName.PLUGIN) {
      setActiveGroup("ปลั๊กอินเสริม");
    } else {
      Object.entries(sidebarItems).forEach(([label, items]) => {
        if (items.some((item) => pathName.startsWith(item.url))) {
          setActiveGroup(label);
        }
      });
    }
    // if (pathName !== Routers.NOTIFICATION) fetchDataList();
  }, [pathName]);

  useEffect(() => {
    if (activeGroup === "จัดการโรงงาน") {
      router.push(EAdminPathName.FACTORIES);
    } else if (activeGroup === "จัดการบริษัทขนส่ง") {
      router.push(EAdminPathName.COMPANIES);
    } else if (activeGroup === "จัดการระบบเหรียญ") {
      router.push(EAdminPathName.COINS);
    } else if (activeGroup === "จัดการแพ็กเกจ") {
      router.push(EAdminPathName.PACKAGES);
    } else if (activeGroup === "อัพโหลดTemplateCSV") {
      router.push(EAdminPathName.UPLOADTEMPLATECSV);
    } else if (activeGroup === "แชท") {
      router.push(EAdminPathName.CHAT);
    } else if (activeGroup === "รับส่งข้อมูลลูกค้า") {
      router.push(EAdminPathName.DATAUSERS);
    } else if (activeGroup === "ปลั๊กอินเสริม") {
      router.push(EAdminPathName.PLUGIN);
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
              src={placeHolderPerson}
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
              {/* {notificationUnread > 0 && (
                <p className="text-3xl text-urgent-fail-02 absolute -right-0 -top-3">
                  •
                </p>
              )} */}
              <Icons name="Bell" className="w-6 h-6" />
            </div>

            {/* {state === "expanded" && (
              <p className="text-neutral-00 hover:text-secondary-caribbean-green-main">
                {notificationUnread} รายการแจ้งเตือน
              </p>
            )} */}
          </div>

          <ThemeToggle collapsed={state === "collapsed"} />
          <LanguageSwitcher collapsed={state === "collapsed"} />

          <p className="body3 text-sidebar-text-head">เมนูหลัก</p>
        </div>

        <SidebarContent>
          <div className="px-8 flex flex-col gap-2">
            {Object.entries(sidebarItems).map(([label, items]) => (
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
        type={ERoles.ADMIN}
      />
    </React.Fragment>
  );
}
