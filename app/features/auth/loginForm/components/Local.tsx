import { Icons } from "@/app/icons";

export default function Local() {
  return (
    <div className="flex justify-end pt-4 pr-4">
      <button className="flex gap-2 items-center">
        <Icons name="FlagThailand" className="w-8 h-8" />
        <p className="body1">ภาษาไทย</p>
      </button>
    </div>
  );
}
