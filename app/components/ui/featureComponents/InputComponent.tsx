import clsx from "clsx";

import { Input } from "@/app/components/ui/input";
import { Icons } from "@/app/icons";

interface IInputCompoenentProps {
  title: string;
  isNum?: boolean;
  istel?: boolean;
  isEmail?: boolean;
  state?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  validateKey: string;
  getError?: (field: string) => string | undefined;
  disabled?: boolean;
  stateIcon?: boolean;
  setStateIcon?: React.Dispatch<React.SetStateAction<boolean>>;
  isPassword?: boolean;
  isFrontIcon?: boolean;
  isRequired?: boolean;
  isLatLong?: boolean;
}

export const InputComponent = ({
  title,
  isNum,
  istel,
  isEmail,
  state,
  onChange,
  validateKey,
  getError,
  disabled,
  stateIcon,
  setStateIcon,
  isPassword = false,
  isFrontIcon = false,
  isRequired,
  isLatLong,
}: IInputCompoenentProps) => {
  return (
    <div className="w-full flex flex-col gap-1">
      <p className="text-sm font-semibold">
        {title} {isRequired && <span className="text-urgent-fail-02">*</span>}
      </p>
      <div className="flex flex-col gap-1">
        <Input
          value={state}
          className={clsx(
            "disabled:opacity-100",
            {
              "border-urgent-fail-02": getError && getError(validateKey),
            },
            {
              "placeholder:text-neutral-05": state === "" || state === 0,
            }
          )}
          placeholder="กรุณากรอก"
          type={
            isNum
              ? "number"
              : istel
                ? "tel"
                : isEmail
                  ? "email"
                  : stateIcon === false
                    ? "password"
                    : "text"
          }
          onKeyDown={(e) => {
            if (
              isNum &&
              (e.key === "e" ||
                e.key === "E" ||
                e.key === "+" ||
                (!isLatLong && e.key === "-"))
            ) {
              e.preventDefault();
            }
          }}
          onWheel={(e) => (e.target as HTMLElement).blur()}
          onChange={onChange}
          disabled={disabled}
          FrontIcon={
            isFrontIcon ? (
              isEmail ? (
                <Icons
                  name="Profile"
                  className="w-4 h-4 md:w-5 md:h-5 text-neutral-07"
                />
              ) : (
                <Icons
                  name="Lock"
                  className="w-4 h-4 md:w-5 md:h-5 text-neutral-07"
                />
              )
            ) : (
              ""
            )
          }
          BackIcon={
            isPassword ? (
              stateIcon ? (
                <Icons
                  name="ShowPassword"
                  className="w-5 h-5 md:w-6 md:h-6 text-neutral-07"
                />
              ) : (
                <Icons
                  name="HidePassword"
                  className="w-5 h-5 md:w-6 md:h-6 text-neutral-07"
                />
              )
            ) : (
              ""
            )
          }
          onIconClick={() => setStateIcon && setStateIcon(!stateIcon)}
        />

        {getError && getError(validateKey) ? (
          <div className="flex gap-2 items-center">
            <Icons name="ErrorLogin" className="w-3 h-3" />
            <p className="text-red-500 text-sm">{getError(validateKey)}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};
