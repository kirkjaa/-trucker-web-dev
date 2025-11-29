import React from "react";

import SearchBar from "../../searchBar/components/SearchBar";
import UsersListTable from "../components/UsersListTable";

import Header from "@/app/components/ui/featureComponents/Header";
import { iconNames } from "@/app/icons";

type UsersDriverRenderProps = {
  icon: keyof typeof iconNames;
  title: string;
};

export default function UsersDriverRender({
  icon,
  title,
}: UsersDriverRenderProps) {
  return (
    <div className="flex flex-col gap-4">
      <Header icon={icon} title={title} />
      <SearchBar />
      <UsersListTable />
    </div>
  );
}
