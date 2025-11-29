import React from "react";
import Image from "next/image";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import MenuButton from "@/app/components/ui/featureComponents/MenuButton";
import { useGlobalStore } from "@/app/store/globalStore";
import placeHolderPerson from "@/public/placeHolderPerson.png";
type DataUserModalProps = { open: boolean; setOpen: (open: boolean) => void };

export default function DataUserModal({ open, setOpen }: DataUserModalProps) {
  const { currentStep } = useGlobalStore();
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[800px]" outlineCloseButton>
        <DialogHeader className="w-full pb-[1rem]">
          <DialogTitle>
            <div className="font-bold text-lg flex gap-10 px-5 text-main-02 border-b">
              <MenuButton
                step={1}
                title="ข้อมูลการสมัคร"
                icon1="ListPrimary"
                icon2="ListGray"
              />
              <MenuButton
                step={2}
                title="เอกสารเปิดลูกค้าใหม่"
                icon1="Document"
                icon2="Document"
              />
            </div>
          </DialogTitle>
        </DialogHeader>
        {currentStep === 1 && (
          <React.Fragment>
            <div className="border-2 border-gray-200 rounded-xl  ">
              <div className="h-2/6 w-full my-4 flex justify-between mx-4">
                <div className="flex flex-row flex-wrap w-full">
                  <div className="flex flex-col justify-start w-1/2">
                    <div className="pb-2">
                      <div className="mb-2">ประเภทธุรกิจ</div>
                      <div className="text-neutral-06"></div>
                    </div>
                  </div>
                  <div className="flex flex-col justify-start w-1/2">
                    <div className="pb-2">
                      <div className="mb-2">ประเภทนิติบุคคล</div>
                      <div className="text-neutral-06"></div>
                    </div>
                  </div>
                  <div className="flex flex-col justify-start w-1/2">
                    <div className="pb-2">
                      <div className="mb-2">ชื่อนิติบุคคล</div>
                      <div className="text-neutral-06"></div>
                    </div>
                  </div>
                  <div className="flex flex-col justify-start w-1/2">
                    <div className="pb-2">
                      <div className="mb-2">ที่ตั้งหลัก</div>
                      <div className="text-neutral-06"></div>
                    </div>
                  </div>
                  <div className="flex flex-col justify-start w-1/2">
                    <div className="pb-2">
                      <div className="mb-2">เบอร์โทรศัพท์</div>
                      <div className="text-neutral-06"></div>
                    </div>
                  </div>
                  <div className="flex flex-col justify-start w-1/2">
                    <div className="pb-2">
                      <div className="mb-2">อีเมล</div>
                      <div className="text-neutral-06"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-2 border-gray-200 rounded-xl ">
              <div className="flex flex-wrap p-4">
                <div className="w-full items-center flex justify-center h-fit">
                  <Image
                    src={placeHolderPerson}
                    alt="user image"
                    width={80}
                    height={80}
                    className="w-fit h-fit rounded-full border"
                  />
                </div>
              </div>

              <div className="h-2/6 w-full my-4 flex justify-between mx-4">
                <div className="flex flex-row flex-wrap w-full">
                  <div className="flex flex-col justify-start w-1/2">
                    <div className="pb-2">
                      <div className="mb-2">ผู้ดูแล</div>
                      <div className="text-neutral-06"></div>
                    </div>
                  </div>
                  <div className="flex flex-col justify-start w-1/2">
                    <div className="pb-2">
                      <div className="mb-2">ชื่อผู้ใช้งาน</div>
                      <div className="text-neutral-06"></div>
                    </div>
                  </div>
                  <div className="flex flex-col justify-start w-1/2">
                    <div className="pb-2">
                      <div className="mb-2">เบอร์โทรศัพท์</div>
                      <div className="text-neutral-06"></div>
                    </div>
                  </div>
                  <div className="flex flex-col justify-start w-1/2">
                    <div className="pb-2">
                      <div className="mb-2">อีเมล</div>
                      <div className="text-neutral-06"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </React.Fragment>
        )}
        {currentStep === 2 && (
          <div className="bg-modal-01 h-32 flex justify-center items-center rounded-lg">
            No Data
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
