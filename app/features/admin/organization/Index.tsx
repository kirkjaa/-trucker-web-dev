"use client";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

import SearchBar from "../components/SearchBar";

import FactoriesAndComponiesListTable from "./components/FactoriesAndComponiesListTable";

import Header from "@/app/components/ui/featureComponents/Header";
import { EAdminPathName } from "@/app/types/enum";

export default function OrganizationRender() {
  // Hook
  const pathName = usePathname();
  const tFactories = useTranslations("factories");
  const tCompanies = useTranslations("companies");

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
            ? tFactories("title")
            : tCompanies("title")
        }
      />
      <SearchBar />
      <FactoriesAndComponiesListTable />
    </div>
  );
}
