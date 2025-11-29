import React from "react";

import SearchBar from "../components/SearchBar";

import CoinsListTable from "./components/CoinsListTable";

import Header from "@/app/components/ui/featureComponents/Header";

export default function CoinsRender() {
  return (
    <div className="flex flex-col gap-4">
      <Header icon="CoinsPrimary" title="ระบบจัดการเหรียญ" />
      <SearchBar />
      <CoinsListTable />
    </div>
  );
}
