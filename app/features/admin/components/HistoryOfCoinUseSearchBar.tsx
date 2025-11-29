import React from "react";

import { Button } from "@/app/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import RemainingCoins from "@/app/components/ui/featureComponents/RemainingCoins";
import { Input } from "@/app/components/ui/input";
import { Icons } from "@/app/icons";

type HistoryOfCoinUseSearchBarProps = {
  amount: number;
};

// eslint-disable-next-line no-empty-pattern
export default function HistoryOfCoinUseSearchBar({
  amount,
}: HistoryOfCoinUseSearchBarProps) {
  return (
    <React.Fragment>
      <div className="flex justify-between items-center bg-neutral-01 p-4 rounded-xl">
        <div className="flex">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="dropdownMenu">
                <p>ทุกหมวดหมู่</p>
                <Icons name="ChevronDown" className="w-6 h-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80">
              <DropdownMenuLabel className="flex justify-between items-center">
                <p className="button">ตัวกรอง</p>
                {/* <Button
                  variant="ghost"
                  className="text-primary-blue-main"
                  onClick={() => {}}
                >
                  ล้างทั้งหมด
                </Button> */}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {/* <DropdownMenuCheckboxItem
                checked={true}
                onCheckedChange={() => {}}
              >
                <p className="body2">รหัส</p>
              </DropdownMenuCheckboxItem> */}
            </DropdownMenuContent>
          </DropdownMenu>

          <Input
            // value={}
            className="h-11 w-10/12 rounded-none border-x-0 border-neutral-04"
            placeholder="ค้นหา"
          />
          <Button className="rounded-l-none">
            <Icons name="Search" className="w-6 h-6" />
          </Button>
        </div>
        <RemainingCoins coins={amount} />
      </div>
    </React.Fragment>
  );
}
