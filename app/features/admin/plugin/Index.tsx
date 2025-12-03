"use client";

import React from "react";
import { useTranslations } from "next-intl";

import SearchBar from "../components/SearchBar";

import PluginListTable from "./components/PluginListTable";

import Header from "@/app/components/ui/featureComponents/Header";

export default function PluginRender() {
  const t = useTranslations("plugins");

  return (
    <div className="flex flex-col gap-4">
      <Header icon="PluginPrimary" title={t("title")} />
      <SearchBar />
      <PluginListTable />
    </div>
  );
}
