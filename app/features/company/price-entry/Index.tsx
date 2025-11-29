import React from "react";

import SearchBar from "../../searchBar/components/SearchBar";

import PriceEntryListTable from "./components/PriceEntryListTable";

import Header from "@/app/components/ui/featureComponents/Header";

type PriceEntryRenderProps = {
  title: string;
};

export default function PriceEntryRender({ title }: PriceEntryRenderProps) {
  return (
    <div className="flex flex-col gap-4">
      <Header icon="PinPrimary" title={title} />
      <SearchBar />
      <PriceEntryListTable />
    </div>
  );
}
