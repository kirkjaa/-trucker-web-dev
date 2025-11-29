import { iconNames, Icons } from "@/app/icons";

interface CardModalProps {
  iconCard: keyof typeof iconNames;
  title: string;
  title2: string;
  onClick: () => void;
}

export const CardModal = ({
  iconCard,
  title,
  title2,
  onClick,
}: CardModalProps) => {
  return (
    <div
      className="w-full bg-neutral-00 shadow-card flex flex-col items-center justify-center rounded-xl py-6 px-16 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex flex-col gap-4 items-center">
        <Icons name={iconCard} className="w-24 h-24" />
        <p className="title1 text-secondary-indigo-main">{title}</p>
      </div>
      <div className="flex gap-2">
        <p className="body2 text-secondary-teal-green-main">{title2}</p>
        <Icons name="ArrowRight" className="w-6 h-6" />
      </div>
    </div>
  );
};
