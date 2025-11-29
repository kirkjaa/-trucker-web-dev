import React from "react";

import SearchBar from "../../components/SearchBar";
import DriversListTable from "../components/DriversListTable";

import Header from "@/app/components/ui/featureComponents/Header";

type DriversInternalRenderProps = {
  title: string;
};

export default function DriversInternalRender({
  title,
}: DriversInternalRenderProps) {
  return (
    <div className="flex flex-col gap-4">
      <Header icon="ListPrimary" title={title} />
      <SearchBar />
      <DriversListTable />
    </div>
  );
}
