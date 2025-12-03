"use client";

import React from "react";
import { useTranslations } from "next-intl";

import SearchBar from "../../components/SearchBar";

import UploadTemplateCsvListTable from "./components/UploadTemplateCsvListTable";

import Header from "@/app/components/ui/featureComponents/Header";

export default function UploadTemplateCsvRender() {
  const t = useTranslations("templates");

  return (
    <div className="flex flex-col gap-4">
      <Header icon="CsvTemplatePrimary" title={t("title")} />
      <SearchBar />
      <UploadTemplateCsvListTable />
    </div>
  );
}
