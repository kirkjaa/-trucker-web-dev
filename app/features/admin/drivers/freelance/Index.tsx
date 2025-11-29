import React from "react";

import SearchBar from "../../components/SearchBar";
import DriversListTable from "../components/DriversListTable";

import Header from "@/app/components/ui/featureComponents/Header";

export default function DriversFreelanceRender() {
  return (
    <div className="flex flex-col gap-4">
      <Header icon="ListPrimary" title="รายชื่อคนขับรถอิสระ" />
      <SearchBar />
      <DriversListTable />
    </div>
  );
}
