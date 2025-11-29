import React from "react";

import SearchBar from "../../searchBar/components/SearchBar";

import ShippingCompanyListTable from "./components/ShippingCompanyListTable";

import Header from "@/app/components/ui/featureComponents/Header";

export default function ShippingCompanyRender() {
  return (
    <div className="flex flex-col gap-4">
      <Header icon={"SidebarWork"} title={"รายชื่อบริษัทขนส่ง"} />
      <SearchBar />
      <ShippingCompanyListTable />
    </div>
  );
}
