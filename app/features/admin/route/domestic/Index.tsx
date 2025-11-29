import React from "react";

import SearchBar from "../../components/SearchBar";
import RouteListTable from "../components/RouteListTable";

import Header from "@/app/components/ui/featureComponents/Header";

export default function DomesticRouteRender() {
  return (
    <div className="flex flex-col gap-4">
      <Header icon="SidebarTransport" title="รหัสเส้นทางขนส่งในประเทศ" />
      <SearchBar />
      <RouteListTable />
    </div>
  );
}
