import React from "react";

import { Button } from "@/app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Icons } from "@/app/icons";
import { EPackagesType } from "@/app/types/enum";

type PackageActiveModalProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  packageType?: EPackagesType;
  price?: number;
  onSubmit: () => void;
};

export default function PackageActiveModal({
  open,
  setOpen,
  packageType,
  price,
  onSubmit,
}: PackageActiveModalProps) {
  const textDisplay = packageType === EPackagesType.MONTHLY ? "เดือน" : "ปี";
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[400px]">
        <DialogHeader className="w-full pb-[1rem]">
          <DialogTitle></DialogTitle>
        </DialogHeader>
        <div className="flex justify-center items-center w-full flex-wrap">
          <Icons name="Rocket" className="" />
          <div className="w-full flex justify-center mt-4 flex-wrap">
            <p className="title3 text-primary-blue-04">
              อัพเกรดเป็นแพ็กเกจราย
              {textDisplay}
            </p>
            <div className="w-full flex justify-center mt-4">
              <p className="title1 text-primary-oxley-green-main mr-2">
                {price}
              </p>
              <p className="flex items-center"> เหรียญ</p>
            </div>
            <div className="w-full flex flex-wrap justify-center mt-4">
              <p className="title4 text-secondary-dark-gray-main">
                คุ้มค่าแบบเต็มสุด! ตลอด{textDisplay}แบบยาวนาน
              </p>
              <p className="title4 text-secondary-dark-gray-main">
                พร้อมฟีเจอร์ครบครัน ประหยัดมากขึ้น
              </p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <div className="w-full flex justify-center gap-2">
            <Button onClick={onSubmit}>อัพเกรดตอนนี้</Button>
            <Button variant={"outline"} onClick={() => setOpen(false)}>
              ยกเลิก
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
