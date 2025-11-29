import DonutChart from "./DonutChart";

import { Icons } from "@/app/icons";

interface DonutChartCardProps {
  title: string;
  data: number[];
  // labels: string[];
  sumVal: number;
  unit: string;
}

export default function DonutChartCard({
  title,
  data,
  // labels,
  sumVal,
  unit,
}: DonutChartCardProps) {
  return (
    <div className="bg-secondary-indigo-main w-full p-4 rounded-xl text-white flex flex-col gap-4">
      <div className="flex items-center">
        <Icons name="VerticalLineGreen" className="w-4 h-4" />
        <p className="button">{title}</p>
      </div>
      <div className="flex items-center justify-center px-14">
        <DonutChart data={data} sumVal={sumVal} unit={unit} />
      </div>
    </div>
  );
}
