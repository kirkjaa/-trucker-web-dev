"use client";

import React from "react";

import SearchBar from "../components/SearchBar";

import PackageListTable from "./components/PackageListTable";

import Header from "@/app/components/ui/featureComponents/Header";

export default function PackagesRender() {
  return (
    <div className="flex flex-col gap-4">
      <Header icon="TicketPrimary" title="จัดการแพ็กเกจ" />
      <SearchBar />
      <PackageListTable />
    </div>
  );
}
