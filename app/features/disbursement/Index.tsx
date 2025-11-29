import React from "react";

import SearchBar from "../searchBar/components/SearchBar";

import DisbursementListTable from "./components/DisbursementListTable";

import Header from "@/app/components/ui/featureComponents/Header";

export default function DisbursementRender() {
  return (
    <div className="flex flex-col gap-4">
      <Header icon="SidebarPackage" title="บิลรอเบิกจ่าย" />
      <SearchBar />
      <DisbursementListTable />
    </div>
  );
}
