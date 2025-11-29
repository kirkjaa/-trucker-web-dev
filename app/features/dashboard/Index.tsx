"use client";

import FilterTimeRange from "./components/FilterTimeRange";
import MenuButton from "./components/MenuButton";

import Header from "@/app/components/ui/featureComponents/Header";

export default function DashboardRender() {
  return (
    <div className="flex flex-col gap-4">
      <Header icon="SidebarControl" title="แผงควบคุม" />
      <MenuButton />
      <FilterTimeRange />
      {/* <DonutChartCard
        title="สถานะรถในโรงงาน"
        data={[20, 30]}
        // labels={["รถในโรงงาน", "รถออกจากโรงงาน"]}
        sumVal={100}
        unit="คัน"
      />
      <DonutChartCard
        title="สถานะรถบริษัท"
        data={[20, 30]}
        // labels={["รถในโรงงาน", "รถออกจากโรงงาน"]}
        sumVal={100}
        unit="คัน"
      />
      <DonutChartCard
        title="ภาพรวมสถานะจัดส่ง"
        data={[20, 30, 50]}
        // labels={["รถในโรงงาน", "รถออกจากโรงงาน", "รถที่รอการซ่อม"]}
        sumVal={100}
        unit="คัน"
      /> */}
      <h1 className="text-center h-full py-60">Coming soon...</h1>
    </div>
  );
}
