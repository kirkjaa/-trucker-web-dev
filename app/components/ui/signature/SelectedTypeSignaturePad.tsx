import clsx from "clsx";

import { iconNames, Icons } from "@/app/icons";

interface SelectedTypeSignaturePadProps {
  selectedType: string;
  setSelectedType: React.Dispatch<React.SetStateAction<string>>;
  icon1: keyof typeof iconNames;
  icon2: keyof typeof iconNames;
  title: string;
  type: string;
}

export default function SelectedTypeSignaturePad({
  selectedType,
  setSelectedType,
  icon1,
  icon2,
  title,
  type,
}: SelectedTypeSignaturePadProps) {
  return (
    <button
      className={clsx(
        "shadow-table flex flex-col gap-2 border px-5 py-3 w-32 items-center justify-center rounded-lg",
        {
          "border-component-green bg-component-green/5": selectedType === type,
        }
      )}
      onClick={() => setSelectedType(type)}
    >
      <Icons name={selectedType === type ? icon1 : icon2} className="w-6 h-6" />
      <p
        className={clsx("button", {
          "text-secondary-caribbean-green-04": selectedType === type,
        })}
      >
        {title}
      </p>
    </button>
  );
}
