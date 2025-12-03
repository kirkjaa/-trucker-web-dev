"use client";

import React from "react";
import { useTranslations } from "next-intl";

import SearchBar from "../../components/SearchBar";
import RouteListTable from "../components/RouteListTable";

import Header from "@/app/components/ui/featureComponents/Header";

export default function InternationalRouteRender() {
  const t = useTranslations("routes");

  return (
    <div className="flex flex-col gap-4">
      <Header icon="SidebarTransport" title={t("internationalRoutes")} />
      <SearchBar />
      <RouteListTable />
    </div>
  );
}
