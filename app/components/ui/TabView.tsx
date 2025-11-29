import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface TapViewProps {
  headers: { name: string; href: string; href2: string }[];
}

export default function TabView({ headers: headers }: TapViewProps) {
  const pathname = usePathname();
  return (
    <div className="w-full flex gap-6 font-medium">
      {headers.map((header) => (
        <Link
          key={header.name}
          className={clsx(
            "pb-4 h-full w-20 text-center border-b-4 border-neutral-300 text-primary-blue-main",
            {
              "border-primary-blue-main":
                pathname === header.href || pathname === header.href2,
            }
          )}
          href={header.href}
        >
          {header.name}
        </Link>
      ))}
    </div>
  );
}
