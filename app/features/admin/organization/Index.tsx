"use client";

import { usePathname } from "next/navigation";

import SearchBar from "../components/SearchBar";

import FactoriesAndComponiesListTable from "./components/FactoriesAndComponiesListTable";

import Header from "@/app/components/ui/featureComponents/Header";
import { EAdminPathName } from "@/app/types/enum";

export default function OrganizationRender() {
  // Hook
  const pathName = usePathname();

  return (
    <div className="flex flex-col gap-4">
      <Header
        icon={
          pathName === EAdminPathName.COMPANIES
            ? "CompanyPrimary"
            : "FactoryPrimary"
        }
        title={
          pathName === EAdminPathName.FACTORIES
            ? "จัดการบริษัทขนส่ง"
            : "จัดการโรงงาน"
        }
      />
      <SearchBar />
      <FactoriesAndComponiesListTable />
    </div>
  );
}
