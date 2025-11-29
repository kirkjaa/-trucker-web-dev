import { iconNames, Icons } from "@/app/icons";

interface HeaderWithBackStepProps {
  onClick: () => void;
  iconTitle?: keyof typeof iconNames;
  title: string;
  title2?: string;
}

export default function HeaderWithBackStep({
  onClick,
  iconTitle,
  title,
  title2,
}: HeaderWithBackStepProps) {
  return (
    <div className="flex gap-5 text-primary-blue-main">
      <button
        className="flex items-center gap-4 cursor-pointer"
        onClick={onClick}
      >
        <Icons name="ChevronLeft" className="w-6 h-6" />
        <p className="text-base font-semibold">ย้อนกลับ</p>
      </button>

      <div className="flex gap-2 items-center">
        {iconTitle && <Icons name={iconTitle} className="w-9 h-9" />}
        <p className="title1 text-secondary-indigo-main">{title}</p>
        {title2 && (
          <p className="text-2xl font-medium text-neutral-06">{title2}</p>
        )}
      </div>
    </div>
  );
}
