"use client";

import RouteCodeTable from "../components/RouteCodeTable";
import SearchBar from "../components/SearchBar";

import Header from "@/app/components/ui/featureComponents/Header";

export default function DomesticRouteCodeRender() {
  return (
    <div className="flex flex-col gap-4">
      <Header icon="PinSolid" title="รหัสเส้นทางขนส่งในประเทศ" />
      <SearchBar />
      <RouteCodeTable />
    </div>
  );
}
