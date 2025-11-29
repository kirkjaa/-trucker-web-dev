import React from "react";

import SearchBar from "../../components/SearchBar";
import TruckListTable from "../components/TruckListTable";

import Header from "@/app/components/ui/featureComponents/Header";

export default function TruckTypesRender() {
  return (
    <div className="flex flex-col gap-4">
      <Header icon="ListPrimary" title="ประเภทรถบรรทุก" />
      <SearchBar />
      <TruckListTable />
    </div>
  );
}
