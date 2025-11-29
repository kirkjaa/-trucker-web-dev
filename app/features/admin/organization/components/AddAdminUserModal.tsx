"use client";

import React, { useEffect } from "react";
import clsx from "clsx";
import Image from "next/image";

import { Button } from "@/app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group";
import { Icons } from "@/app/icons";
import { IUserFactoriesAndCompanies } from "@/app/types/factoriesAndCompaniesType";
import formatFullName from "@/app/utils/formatFullName";
import placeHolderPerson from "@/public/placeHolderPerson.png";

type AddAdminUserModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  title?: string;
  userAdminList?: IUserFactoriesAndCompanies[] | null;
  onClickSearch?: (searchValue: string) => void;
  onSubmit: (userId: string) => void;
};

export default function AddAdminUserModal({
  open,
  setOpen,
  title,
  userAdminList,
  onClickSearch,
  onSubmit,
}: AddAdminUserModalProps) {
  //#region State
  const [selectedUserAdmin, setSelectedUserAdmin] = React.useState<string>("");
  const [dataList, setDataList] = React.useState<
    IUserFactoriesAndCompanies[] | null
  >([]);
  const [searchValue, setSearchValue] = React.useState<string>("");
  //#endregion State

  //#region Hooks
  useEffect(() => {
    if (userAdminList) {
      setDataList(userAdminList);
    }
  }, [userAdminList]);

  //#endregion Hooks

  //#region Function
  const handleSubmit = () => {
    if (selectedUserAdmin) {
      onSubmit(selectedUserAdmin);
      setOpen(false);
    }
  };
  //#endregion Function

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[600px]" outlineCloseButton>
        <DialogHeader className="w-full pb-[1rem]">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        {onClickSearch && (
          <div className="flex">
            <Input
              value={searchValue}
              className="h-11 w-full rounded-none rounded-l-full border-r-0 border-neutral-04"
              placeholder="ค้นหา"
              onChange={(val) => {
                setSearchValue(val.target.value);
              }}
            />
            <Button
              className="rounded-l-none"
              onClick={() => {
                onClickSearch?.(searchValue);
              }}
            >
              <Icons name="Search" className="w-6 h-6" />
            </Button>
          </div>
        )}

        <RadioGroup
          defaultValue={selectedUserAdmin}
          className="grid grid-cols-2 gap-4"
          onValueChange={setSelectedUserAdmin}
        >
          {dataList &&
            dataList.length > 0 &&
            dataList.map((userAdmin) => {
              return (
                <div
                  className={clsx(
                    "flex items-center justify-between rounded-full p-2 hover:border-green-500 hover:bg-green-100",
                    {
                      "border-2 border-green-500 bg-green-100":
                        userAdmin.id === selectedUserAdmin,
                      "border-2 border-transparent":
                        userAdmin.id !== selectedUserAdmin,
                    }
                  )}
                  key={userAdmin.id}
                >
                  <div className="flex items-center space-x-3">
                    <Image
                      src={userAdmin.imageUrl || placeHolderPerson}
                      alt="Profile"
                      className="w-10 h-10 rounded-full"
                      width={40}
                      height={40}
                    />
                    <span className="text-sm font-medium text-gray-800">
                      {formatFullName(userAdmin.firstName, userAdmin.lastName)}
                    </span>
                  </div>

                  <RadioGroupItem
                    value={userAdmin.id}
                    id={userAdmin.id}
                    className=" justify-self-end"
                  />
                </div>
              );
            })}
        </RadioGroup>

        <DialogFooter>
          <div className="w-full ">
            <button
              className="w-full  bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:ring focus:ring-blue-300"
              onClick={handleSubmit}
            >
              ยืนยัน
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
