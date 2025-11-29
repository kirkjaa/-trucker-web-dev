import React from "react";

import SearchBar from "../../components/SearchBar";

import UploadTemplateCsvListTable from "./components/UploadTemplateCsvListTable";

import Header from "@/app/components/ui/featureComponents/Header";

export default function UploadTemplateCsvRender() {
  return (
    <div className="flex flex-col gap-4">
      <Header icon="CsvTemplatePrimary" title="อัพโหลด Template CSV" />
      <SearchBar />
      <UploadTemplateCsvListTable />
    </div>
  );
}
