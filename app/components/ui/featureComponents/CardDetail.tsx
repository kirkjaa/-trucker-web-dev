import clsx from "clsx";

import { iconNames, Icons } from "@/app/icons";

interface CardDetailProps {
  iconName: keyof typeof iconNames;
  title: string;
  value: string;
  value2?: string;
  iconName2?: keyof typeof iconNames;
  oilUp?: boolean;
  oilDown?: boolean;
}

export const CardDetail = ({
  iconName,
  title,
  value,
  value2,
  iconName2,
  oilUp,
  oilDown,
}: CardDetailProps) => {
  return (
    <div className="flex gap-3 items-center bg-neutral-01 px-4 py-2 rounded-lg w-full">
      <Icons name={iconName} className="w-14 h-14" />
      <div className="text-base">
        <p className="font-medium text-main-01">{title}</p>
        <div className="flex gap-1">
          <p
            className={clsx(
              "font-semibold text-secondary-indigo-main",
              {
                "text-success-01": oilUp,
              },
              {
                "text-urgent-fail-02": oilDown,
              }
            )}
          >
            {value}
          </p>
          <p className="font-normal text-neutral-06">{value2}</p>
          {iconName2 && (
            <Icons
              name={iconName2}
              className={clsx(
                "w-6 h-6",
                {
                  "text-success-01": oilUp,
                },
                {
                  "text-urgent-fail-02": oilDown,
                }
              )}
            />
          )}
        </div>
      </div>
    </div>
  );
};
