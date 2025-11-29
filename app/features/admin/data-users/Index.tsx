import React from "react";

import SearchBar from "../components/SearchBar";

import DataUsersListTable from "./components/DataUsersListTable";

import Header from "@/app/components/ui/featureComponents/Header";

export default function DataUsersRender() {
  return (
    <div className="flex flex-col gap-4">
      <Header icon="SidebarForm" title="รับ - ส่งข้อมูลลูกค้า" />
      <SearchBar />
      <DataUsersListTable />
    </div>
  );
}
