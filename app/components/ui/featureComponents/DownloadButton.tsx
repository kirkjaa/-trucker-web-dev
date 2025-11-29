import { iconNames, Icons } from "@/app/icons";

interface DownloadButtonProps {
  icon: keyof typeof iconNames;
  title: string;
  onClick?: () => void;
}

export const DownloadButton = ({
  icon,
  title,
  onClick,
}: DownloadButtonProps) => {
  return (
    <button
      className="bg-neutral-00 px-5 py-2 rounded-3xl flex gap-2 hover:bg-secondary-indigo-main hover:text-white"
      onClick={onClick}
    >
      <Icons name={icon} className="w-5 h-5" />
      <p className="button">{title}</p>
    </button>
  );
};
