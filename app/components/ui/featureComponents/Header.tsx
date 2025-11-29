import { iconNames, Icons } from "@/app/icons";

interface HeaderProps {
  icon: keyof typeof iconNames;
  title: string;
}

export default function Header({ icon, title }: HeaderProps) {
  return (
    <div className="flex gap-2 items-center">
      <Icons name={icon} className="w-9 h-9" />
      <p className="title1 text-login-01">{title}</p>
    </div>
  );
}
