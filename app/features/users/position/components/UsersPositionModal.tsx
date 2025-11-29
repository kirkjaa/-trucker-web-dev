import React from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Icons } from "@/app/icons";
import { EUsersPosition, usersPositionLabel } from "@/app/types/enum";
import { IUsersPositionListTable } from "@/app/types/usersPositionType";

type UsersPositionModalProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  data?: IUsersPositionListTable;
};

export default function UsersPositionModal({
  open,
  setOpen,
  data,
}: UsersPositionModalProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[700px]" outlineCloseButton>
        <DialogHeader className="w-full pb-[1rem]">
          <DialogTitle>
            <div className="flex gap-2 items-center">
              <Icons name="BusinessCardPrimary" className="w-6 h-6" />
              <p className="title3">ข้อมูลตำแหน่งงาน</p>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="border rounded-lg p-4 ">
          <div className="flex flex-row w-full">
            <div className="w-1/2 flex flex-col">
              <p className="font-bold">ชื่อตำแหน่งงาน</p>
              <p>{data?.title}</p>
            </div>
            <div className="w-1/2 flex flex-col">
              <p className="font-bold">ชื่อตำแหน่งงาน</p>
              <p>{data?.name}</p>
            </div>
          </div>
          <hr className="mt-4 mb-4" />
          <p className="font-bold">การเข้าถึงข้อมูล</p>

          <ul className="w-full flex flex-wrap flex-row list-disc p-4">
            {data &&
              Object.entries(data.permission).map(([key, value]) =>
                value ? (
                  <div className="w-1/3" key={key}>
                    <li>{usersPositionLabel[key as EUsersPosition]}</li>
                  </div>
                ) : null
              )}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}
