import React from "react";

import SearchBar from "../../searchBar/components/SearchBar";

import UsersPositionListTable from "./components/UsersPositionListTable";

import Header from "@/app/components/ui/featureComponents/Header";

export default function UsersPositionRender() {
  return (
    <div className="flex flex-col gap-4">
      <Header icon="BusinessCardPrimary" title="ตำแหน่งงาน" />
      <SearchBar />
      <UsersPositionListTable />
    </div>
  );
}
