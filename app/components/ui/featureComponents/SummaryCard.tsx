import React from "react";

import { iconNames, Icons } from "@/app/icons";

type SummaryCardProps = {
  title: string;
  value: number | string;
  unit: string;
  icon?: keyof typeof iconNames;
};

export default function SummaryCard({
  title,
  value,
  unit,
  icon,
}: SummaryCardProps) {
  return (
    <div className=" bg-primary-oxley-green-03 w-full h-full p-2 rounded-lg">
      <div className="flex justify-evenly items-center h-full">
        {icon && (
          <div className="w-1/2 flex justify-center">
            <Icons name={icon} className="w-20 h-20" />
          </div>
        )}
        <div className="w-1/2">
          <div className="flex flex-col">
            <p className="mb-2">{title}</p>
            <p className="title3">
              {value} {unit}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
