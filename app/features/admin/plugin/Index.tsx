"use client";

import React from "react";

import SearchBar from "../components/SearchBar";

import PluginListTable from "./components/PluginListTable";

import Header from "@/app/components/ui/featureComponents/Header";

export default function PluginRender() {
  return (
    <div className="flex flex-col gap-4">
      <Header icon="PluginPrimary" title="ปลั๊กอินเสริม" />
      <SearchBar />
      <PluginListTable />
    </div>
  );
}
