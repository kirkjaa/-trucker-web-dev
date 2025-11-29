import clsx from "clsx";

import { iconNames, Icons } from "@/app/icons";
import { useGlobalStore } from "@/app/store/globalStore";
import { cn } from "@/lib/utils";

interface MenuButtonProps {
  step: number;
  title: string;
  icon?: keyof typeof iconNames;
}

export default function OrderMenuButton({
  step,
  title,
  icon,
}: MenuButtonProps) {
  // Global State
  const { currentStep, setCurrentStep } = useGlobalStore();

  return (
    <div
      className={clsx("pb-4 cursor-pointer flex gap-2 text-main-02", {
        "border-b-2 border-primary-blue-main text-primary-blue-main":
          currentStep === step,
      })}
      onClick={() => setCurrentStep(step)}
    >
      {icon && (
        <Icons
          name={icon}
          className={cn("w-6 h-6", {
            "text-primary-oxley-green-main": currentStep === step,
          })}
        />
      )}

      <p>{title}</p>
    </div>
  );
}
