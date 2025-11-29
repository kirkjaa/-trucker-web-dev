import React from "react";

import SearchBar from "../../components/SearchBar";
import SystemUsersListTable from "../components/SystemUsersListTable";

import Header from "@/app/components/ui/featureComponents/Header";

export default function SystemUsersFactoriesRender() {
  return (
    <div className="flex flex-col gap-4">
      <Header icon="ProfilePrimary" title="จัดการผู้ใช้ระบบ - โรงงาน" />
      <SearchBar />
      <SystemUsersListTable />
    </div>
  );
}
