import clsx from "clsx";

import { Icons } from "@/app/icons";
import { useGlobalStore } from "@/app/store/globalStore";

interface BreadCrumbProps {
  step: number;
  step2?: number;
  step3?: number;
  title: string;
  isLast?: boolean;
}

export default function BreadCrumb({
  step,
  step2,
  step3,
  title,
  isLast = false,
}: BreadCrumbProps) {
  // Global State
  const { currentStep } = useGlobalStore();

  return (
    <div
      className="flex items-center gap-2 cursor-pointer"
      // onClick={() => setCurrentStep(step)}
    >
      {currentStep === step2 || currentStep === step3 ? (
        <Icons name="ToastSuccess" className="w-10 h-10" />
      ) : (
        <p
          className={clsx(
            " bg-neutral-03 text-neutral-07 px-3 py-1 rounded-full",
            {
              "text-white bg-secondary-indigo-main": currentStep === step,
            }
          )}
        >
          {step}
        </p>
      )}
      <p
        className={clsx("text-neutral-07", {
          "text-secondary-indigo-main": currentStep === step,
        })}
      >
        {title}
      </p>

      {!isLast && <Icons name="ChevronRight" className="w-6 h-6" />}
    </div>
  );
}
