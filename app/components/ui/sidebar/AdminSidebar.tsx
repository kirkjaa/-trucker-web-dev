"use client";

import React, { useEffect, useState } from "react";
import { deleteCookie } from "cookies-next";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";

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

// Use translation keys instead of Thai strings
const iconMapping: IconMapping = {
  manageFactory: "FactoryPrimary",
  manageCompany: "CompanyPrimary",
  manageSystemUsers: "SidebarUser",
  manageCoins: "CoinsPrimary",
  managePackages: "TicketPrimary",
  manageRouteCodes: "PinPrimary",
  manageDrivers: "SidebarTransport",
  uploadTemplateCSV: "CsvTemplatePrimary",
  chat: "ChatPrimary",
  truckTypes: "TruckPrimary",
  customerData: "SidebarForm",
  plugins: "PluginPrimary",
};

const sidebarItems: {
  [key: string]: {
    titleKey?: string;
    url: string;
    iconLight?: keyof typeof iconNames;
    iconBulk?: keyof typeof iconNames;
  }[];
} = {
  manageFactory: [],
  manageCompany: [],
  manageSystemUsers: [
    {
      titleKey: "systemUsersFactory",
      url: "/admin/system-users/factories",
      iconLight: "ProfilePrimaryOutLine",
      iconBulk: "ProfilePrimary",
    },
    {
      titleKey: "systemUsersCompany",
      url: "/admin/system-users/companies",
      iconLight: "ProfilePrimaryOutLine",
      iconBulk: "ProfilePrimary",
    },
  ],
  manageDrivers: [
    {
      titleKey: "internalDrivers",
      url: "/admin/drivers/internal",
      iconLight: "ListPrimaryOutLine",
      iconBulk: "ListPrimary",
    },
    {
      titleKey: "freelanceDrivers",
      url: "/admin/drivers/freelance",
      iconLight: "ListPrimaryOutLine",
      iconBulk: "ListPrimary",
    },
    {
      titleKey: "reviewFreelanceDrivers",
      url: "/admin/drivers/review/freelance",
      iconLight: "ScanPrimary",
      iconBulk: "ScanPrimary",
    },
  ],
  manageRouteCodes: [
    {
      titleKey: "domesticRoutes",
      url: "/admin/route/domestic",
      iconLight: "ListPrimaryOutLine",
      iconBulk: "ListPrimary",
    },
    {
      titleKey: "internationalRoutes",
      url: "/admin/route/international",
      iconLight: "ListPrimaryOutLine",
      iconBulk: "ListPrimary",
    },
    {
      titleKey: "confirmDomesticRoutes",
      url: "/admin/route/confirm/domestic",
      iconLight: "CheckCircleOutline",
      iconBulk: "CheckCircle",
    },
    {
      titleKey: "confirmInternationalRoutes",
      url: "/admin/route/confirm/international",
      iconLight: "CheckCircleOutline",
      iconBulk: "CheckCircle",
    },
  ],
  chat: [],
  uploadTemplateCSV: [],
  plugins: [],
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
  const t = useTranslations("sidebar");
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
      setActiveGroup("manageFactory");
    } else if (pathName === EAdminPathName.COMPANIES) {
      setActiveGroup("manageCompany");
    } else if (pathName === EAdminPathName.UPLOADTEMPLATECSV) {
      setActiveGroup("uploadTemplateCSV");
    } else if (pathName === EAdminPathName.CHAT) {
      setActiveGroup("chat");
    } else if (pathName === EAdminPathName.COINS) {
      setActiveGroup("manageCoins");
    } else if (pathName === EAdminPathName.PACKAGES) {
      setActiveGroup("managePackages");
    } else if (pathName === EAdminPathName.DATAUSERS) {
      setActiveGroup("customerData");
    } else if (pathName === EAdminPathName.PLUGIN) {
      setActiveGroup("plugins");
    } else {
      Object.entries(sidebarItems).forEach(([key, items]) => {
        if (items.some((item) => pathName.startsWith(item.url))) {
          setActiveGroup(key);
        }
      });
    }
    // if (pathName !== Routers.NOTIFICATION) fetchDataList();
  }, [pathName]);

  useEffect(() => {
    if (activeGroup === "manageFactory") {
      router.push(EAdminPathName.FACTORIES);
    } else if (activeGroup === "manageCompany") {
      router.push(EAdminPathName.COMPANIES);
    } else if (activeGroup === "manageCoins") {
      router.push(EAdminPathName.COINS);
    } else if (activeGroup === "managePackages") {
      router.push(EAdminPathName.PACKAGES);
    } else if (activeGroup === "uploadTemplateCSV") {
      router.push(EAdminPathName.UPLOADTEMPLATECSV);
    } else if (activeGroup === "chat") {
      router.push(EAdminPathName.CHAT);
    } else if (activeGroup === "customerData") {
      router.push(EAdminPathName.DATAUSERS);
    } else if (activeGroup === "plugins") {
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

          <p className="pt-5 body3 text-sidebar-text-head">
            {t("userAccount")}
          </p>

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
                    <p className="body3 text-neutral-00">
                      {t("coinsAvailable")}
                    </p>
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

          <p className="body3 text-sidebar-text-head">{t("mainMenu")}</p>
        </div>

        <SidebarContent>
          <div className="px-8 flex flex-col gap-2">
            {Object.entries(sidebarItems).map(([key, items]) => (
              <SideBarGroup
                key={key}
                iconMain={iconMapping[key] as keyof typeof iconNames}
                label={t(key)}
                items={items.map((item) => ({
                  ...item,
                  title: item.titleKey ? t(item.titleKey) : undefined,
                }))}
                isOpen={activeGroup === key}
                onClick={() => setActiveGroup(activeGroup === key ? null : key)}
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
