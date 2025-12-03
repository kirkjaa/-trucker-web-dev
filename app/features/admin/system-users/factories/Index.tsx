"use client";

import React from "react";
import { useTranslations } from "next-intl";

import SearchBar from "../../components/SearchBar";
import SystemUsersListTable from "../components/SystemUsersListTable";

import Header from "@/app/components/ui/featureComponents/Header";

export default function SystemUsersFactoriesRender() {
  const t = useTranslations("systemUsers");

  return (
    <div className="flex flex-col gap-4">
      <Header icon="ProfilePrimary" title={t("factoryUsers")} />
      <SearchBar />
      <SystemUsersListTable />
    </div>
  );
}
