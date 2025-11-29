import React from "react";
import Image from "next/image";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import placeHolderPerson from "@/public/placeHolderPerson.png";

type ProfileModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  imageUrl?: string;
  email?: string;
  fullName?: string;
  phone?: string;
  display?: string;
  displayData?: string;
  title?: string;
  username?: string;
};

export default function ProfileModal({
  open,
  setOpen,
  imageUrl,
  fullName,
  phone,
  email,
  display,
  displayData,
  title,
  username,
}: ProfileModalProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[562px] min-h-[510px]" outlineCloseButton>
        <DialogHeader className="w-full pb-[1rem]">
          <DialogTitle>
            {title ? title : `ข้อมูลผู้ใช้ระบบ(${display})`}
          </DialogTitle>
        </DialogHeader>
        <div className="border-2 border-gray-200 rounded-xl p-4 ">
          <div className="h-1/2 flex flex-wrap">
            <div className="h-2/3 w-full items-center flex justify-center">
              <Image
                src={imageUrl || placeHolderPerson}
                alt="user image"
                width={80}
                height={80}
                className="w-fit h-fit rounded-full border"
              />
            </div>
            <div className="h-2/6 w-full my-8 flex justify-between mx-4">
              {display && displayData && (
                <div className="flex flex-col justify-start w-1/2">
                  <div className="pb-2">
                    <div className="mb-2">{display}</div>
                    <div className="text-neutral-06">{displayData}</div>
                  </div>
                </div>
              )}

              <div className="flex flex-col justify-start w-1/2">
                <div className="pb-2">
                  <div className="mb-2">ชื่อผู้ใช้งาน</div>
                  <div className="text-neutral-06">{username || ""}</div>
                </div>
              </div>
            </div>
          </div>
          <hr className="mx-8 my-10" />
          <div className="h-2/6 w-full my-4 flex justify-between mx-4">
            <div className="flex flex-row flex-wrap w-full">
              <div className="flex flex-col justify-start w-1/2">
                <div className="pb-2">
                  <div className="mb-2">ชื่อ - นามสกุล</div>
                  <div className="text-neutral-06">{fullName || ""}</div>
                </div>
              </div>
              <div className="flex flex-col justify-start w-1/2">
                {/* <div className="pb-2">
                  <div className="mb-2">ผู้ดูแล</div>
                  <div className="text-neutral-06">aa</div>
                </div> */}
              </div>
              <div className="flex flex-col justify-start w-1/2">
                <div className="pb-2">
                  <div className="mb-2">เบอร์โทรศัพท์</div>
                  <div className="text-neutral-06">{phone || ""}</div>
                </div>
              </div>
              <div className="flex flex-col justify-start w-1/2">
                <div className="pb-2">
                  <div className="mb-2">อีเมล</div>
                  <div className="text-neutral-06">{email || ""}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
