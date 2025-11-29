"use client";

import React from "react";

import SearchBar from "../searchBar/components/SearchBar";

import TruckListTable from "./components/TruckListTable";
import useTruckTableList from "./hooks/useTruckTableList";

import Header from "@/app/components/ui/featureComponents/Header";
import SummaryCard from "@/app/components/ui/featureComponents/SummaryCard";
import { iconNames } from "@/app/icons";

type TruckRenderProps = {
  title: string;
  icon: keyof typeof iconNames;
};

export default function TruckRender({ icon, title }: TruckRenderProps) {
  const { total, fetchTotal } = useTruckTableList();

  React.useEffect(() => {
    fetchTotal();
  }, []);
  return (
    <div className="flex flex-col gap-4">
      <Header icon={icon} title={title} />
      <div className="flex flex-wrap gap-2 h-full w-full items-center ">
        <div className="md:w-1/4 sm:w-full">
          <SummaryCard
            value={total.totalTypes.total || 0}
            unit={"ประเภท"}
            title={"ประเภทของรถ"}
            icon="StarCircle"
          />
        </div>
        <div className="md:w-1/4 sm:w-full">
          <SummaryCard
            value={total.totalSizes.total || 0}
            unit={"คัน"}
            title={"รถบรรทุกทั้งหมด"}
            icon="TruckCircle"
          />
        </div>
      </div>

      <SearchBar />
      <TruckListTable />
    </div>
  );
}
