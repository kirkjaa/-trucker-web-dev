import React from "react";

import PackageListTable from "./components/PackageListTable";

import Header from "@/app/components/ui/featureComponents/Header";

export default function PackageRender() {
  return (
    <div className="flex flex-col gap-4">
      <Header icon="SidebarPackage" title="เลือกซื้อแพ็คเกจ" />

      <PackageListTable />
    </div>
  );
}
