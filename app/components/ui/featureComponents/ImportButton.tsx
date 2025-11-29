import clsx from "clsx";

import { iconNames, Icons } from "@/app/icons";

interface ImportButtonProps {
  icon: keyof typeof iconNames;
  title: string;
  onClick?: () => void;
  disabled?: boolean;
}

export default function ImportButton({
  icon,
  title,
  onClick,
  disabled,
}: ImportButtonProps) {
  return (
    <button
      className={clsx(
        "rounded-3xl flex justify-between items-center border border-neutral-03 px-5 py-2 w-full",
        {
          "bg-neutral-01": disabled,
        }
      )}
      onClick={onClick}
      disabled={disabled}
    >
      <div className="flex items-center gap-3">
        <Icons name={icon} className="w-10 h-10" />
        <p className="title3">{title}</p>
      </div>
      <Icons name="ArrowRightGreen" className="w-6 h-6" />
    </button>
  );
}
