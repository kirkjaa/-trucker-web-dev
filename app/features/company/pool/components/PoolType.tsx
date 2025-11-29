import React from "react";
import clsx from "clsx";

import { iconNames, Icons } from "@/app/icons";
import { EPoolType, poolTypeLabel } from "@/app/types/enum";
import { timeAgo } from "@/app/utils/formatDate";

type PoolTypeProps = {
  outline?: boolean;
  type: EPoolType;
  onClick?: (type: EPoolType) => void;
  createdAt?: Date;
};

export default function PoolType({
  type,
  outline,
  onClick,
  createdAt,
}: PoolTypeProps) {
  const typeStyles: Record<
    EPoolType,
    {
      icon: keyof typeof iconNames;
      bgColor: string;
      textColor: string;
      label: string;
    }
  > = {
    [EPoolType.NORMAL]: {
      icon: outline ? "CalendarBlueOutline" : "CalendarBlue",
      bgColor: outline ? "bg-white" : "bg-blue-100",
      textColor: outline ? "text-primary-blue-main" : "text-blue-600",
      label: poolTypeLabel[EPoolType.NORMAL],
    },
    [EPoolType.QUICK]: {
      icon: outline ? "BoltYellowOutline" : "BoltYellow",
      bgColor: outline ? "bg-white" : "bg-yellow-100",
      textColor: outline ? "text-primary-blue-main" : "text-yellow-600",
      label: poolTypeLabel[EPoolType.QUICK],
    },
    [EPoolType.OFFER]: {
      icon: outline ? "DocumentGreen" : "DocumentLight",
      bgColor: outline ? "bg-white" : "bg-green-100",
      textColor: outline ? "text-primary-blue-main" : "text-green-700",
      label: poolTypeLabel[EPoolType.OFFER],
    },
    // 3: {
    //   icon: outline ? "DocumentGreen" : "DocumentLight",
    //   bgColor: outline ? "bg-white" : "bg-green-100",
    //   textColor: outline ? "text-primary-blue-main" : "text-green-700",
    //   label: "เช่ารถแบบสัญญา",
    // },
  };
  const style = typeStyles[type] || typeStyles[EPoolType.NORMAL]; // fallback ถ้าไม่มี type ที่ match

  return (
    <div
      className={clsx(
        "flex items-center justify-between text-sm text-gray-500 cursor-default",
        onClick && "cursor-pointer"
      )}
      onClick={() => onClick && onClick(type)}
    >
      <span
        className={`px-3 py-1 rounded-full font-medium flex items-center gap-1 ${style.bgColor} ${style.textColor}`}
      >
        <Icons name={style.icon} />
        {style.label}
      </span>

      {!outline && (
        <span className="text-xs text-left">
          {" "}
          {createdAt && timeAgo(createdAt)}
        </span>
      )}
    </div>
  );
}
