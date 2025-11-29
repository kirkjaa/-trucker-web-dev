import clsx from "clsx";

import { iconNames, Icons } from "@/app/icons";
import { useGlobalStore } from "@/app/store/globalStore";

interface MenuButtonProps {
  step: number;
  title: string;
  icon1?: keyof typeof iconNames;
  icon2?: keyof typeof iconNames;
}

export default function MenuButton({
  step,
  title,
  icon1,
  icon2,
}: MenuButtonProps) {
  // Global State
  const { currentStep, setCurrentStep } = useGlobalStore();

  return (
    <div
      className={clsx("pb-4 cursor-pointer flex gap-2", {
        "border-b-2 border-primary-blue-main text-primary-blue-main":
          currentStep === step,
      })}
      onClick={() => setCurrentStep(step)}
    >
      {icon1 && icon2 && (
        <Icons
          name={currentStep === step ? icon1 : icon2}
          className="w-6 h-6 text-neutral-05"
        />
      )}

      <p>{title}</p>
    </div>
  );
}
