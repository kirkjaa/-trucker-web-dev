import React from "react";
import { useSession } from "next-auth/react";

import useMyProfile from "../hooks/useMyProfile";

import MyProfile from "./MyProfile";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import HistoryOfCoinUseListTable from "@/app/components/ui/featureComponents/HistoryOfCoinUseListTable";
import MenuButton from "@/app/components/ui/featureComponents/MenuButton";
import { ICompanyMe } from "@/app/types/companyType";
import { ERoles } from "@/app/types/enum";
import { IFactoryMe } from "@/app/types/factoryType";

type MyProfileModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  data?: ICompanyMe | IFactoryMe;
  type: ERoles;
};

export default function MyProfileModal({
  open,
  setOpen,
  data,
  type,
}: MyProfileModalProps) {
  const { currentStep } = useMyProfile();
  const { data: session } = useSession();
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[900px]" outlineCloseButton>
        <DialogHeader className="w-full pb-[1rem]">
          <DialogTitle>
            <div className="font-bold text-lg flex gap-10 px-5 text-main-02 border-b">
              <MenuButton
                step={1}
                title="โปรไฟล์"
                icon1="ProfilePrimary"
                icon2="ProfilePrimaryOutLine"
              />
              <MenuButton
                step={2}
                title="เหรียญของฉัน"
                icon1="CoinPrimary"
                icon2="CoinGray"
              />
            </div>
          </DialogTitle>
        </DialogHeader>

        {currentStep === 1 && (
          <MyProfile
            data={data}
            imageUrl={session?.user?.imageUrl || undefined}
            type={type}
          />
        )}
        {currentStep === 2 && <HistoryOfCoinUseListTable />}
      </DialogContent>
    </Dialog>
  );
}
