"use client";

import React from "react";
import { useTranslations } from "next-intl";

import SearchBar from "../../components/SearchBar";
import DriversListTable from "../components/DriversListTable";

import Header from "@/app/components/ui/featureComponents/Header";

export default function DriversFreelanceRender() {
  const t = useTranslations("drivers");

  return (
    <div className="flex flex-col gap-4">
      <Header icon="ListPrimary" title={t("freelanceDrivers")} />
      <SearchBar />
      <DriversListTable />
    </div>
  );
}
