import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import clsx from "clsx";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "../button";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "../dialog";
import { Input } from "../input";

import { Icons } from "@/app/icons";
import {
  ChangePasswordFormInputs,
  ChangePasswordFormSchema,
} from "@/app/utils/validate/auth-validate";

type ChangePasswordModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  title?: string;
  password?: string;
  confirmPassword?: string;
  onSubmit: (data: ChangePasswordFormInputs) => void;
};

export default function ChangePasswordModal({
  open,
  setOpen,
  title,
  password,
  confirmPassword,
  onSubmit,
}: ChangePasswordModalProps) {
  //#region Form
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    reset,
  } = useForm<ChangePasswordFormInputs>({
    resolver: zodResolver(ChangePasswordFormSchema),
  });

  //#endregion Form

  //#region Hooks
  useEffect(() => {
    if (password) setValue("password", password);
    if (confirmPassword) setValue("confirmPassword", confirmPassword);
  }, [password, confirmPassword]);

  //#endregion Hooks
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[400px]" outlineCloseButton>
        <DialogTitle>{title}</DialogTitle>

        <div className="flex flex-col gap-2 p-4 w-full">
          <div className="flex flex-col gap-1 w-full py-2">
            <p className="text-sm font-semibold text-neutral-08">
              รหัสผ่าน <span className="text-urgent-fail-02">*</span>
            </p>
            <Input
              className={clsx("h-10 w-full border border-neutral-03", {
                "border-red-500": errors.password,
              })}
              placeholder="รหัสผ่าน"
              {...register("password")}
            />
            {errors.password && (
              <div className="flex gap-2 items-center">
                <Icons name="ErrorLogin" className="w-4 h-4" />
                <p className="text-sm text-red-500 text-start pt-1">
                  {errors.password.message}
                </p>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-1 w-full py-2">
            <p className="text-sm font-semibold text-neutral-08">
              ยืนยันรหัสผ่าน <span className="text-urgent-fail-02">*</span>
            </p>
            <Input
              className={clsx("h-10 w-full border border-neutral-03", {
                "border-red-500": errors.confirmPassword,
              })}
              placeholder="ยืนยันรหัสผ่าน"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <div className="flex gap-2 items-center">
                <Icons name="ErrorLogin" className="w-4 h-4" />
                <p className="text-sm text-red-500 text-start pt-1">
                  {errors.confirmPassword.message}
                </p>
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <div className="w-full flex justify-end gap-2">
            <Button
              variant={"outline"}
              onClick={() => {
                reset();
                setOpen(false);
              }}
            >
              ยกเลิก
            </Button>
            <Button
              onClick={handleSubmit((data) => {
                onSubmit(data);
                setOpen(false);
              })}
            >
              บันทึก
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
