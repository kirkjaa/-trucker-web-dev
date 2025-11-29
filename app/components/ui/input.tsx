import * as React from "react";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  FrontIcon?: React.ReactNode;
  BackIcon?: React.ReactNode;
  placeholderColor?: string;
  bgColor?: string;
  checked?: boolean;
  name?: string;
  className?: string;
  variant?: string;
  disabled?: boolean;
  rounded?: string;
  onIconClick?: () => void;
  borderColor?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      FrontIcon,
      BackIcon,
      placeholderColor = "text-text-quaternary",
      bgColor = "bg-white",
      onIconClick,
      disabled = false,
      rounded = "md",
      borderColor = "border-neutral-02",
      // name,
      ...props
    },
    ref
  ) => {
    return (
      // <div
      //   className={cn(
      //     `grid w-full items-center gap-[4px] focus:border focus:border-secondary-teal-green-main focus:rounded-${rounded}`,
      //     className
      //   )}
      // >
      /* inside content */
      <div
        className={cn(
          `flex h-10 items-center rounded-${rounded} border-2 ${borderColor} ${bgColor} overflow-hidden text-sm`,
          className
        )}
      >
        {FrontIcon && (
          <span className="pl-2">
            {React.isValidElement(FrontIcon) ? FrontIcon : null}
          </span>
        )}
        <input
          {...props}
          type={type}
          ref={ref}
          className={cn(
            `w-full px-3 py-2 rounded-${rounded} placeholder:${placeholderColor}  focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-neutral-02 ${bgColor}`,
            className
            // type === "file" && "hidden"
          )}
          style={{}}
          disabled={disabled}
          // name={name}
        />
        {BackIcon && (
          <span className="pe-2" onClick={onIconClick}>
            {React.isValidElement(BackIcon) ? BackIcon : null}
          </span>
        )}
      </div>
      /* </div> */
    );
  }
);
Input.displayName = "Input";

const Radio = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      checked,
      label,
      name,
      disabled = false,
      variant = "default",
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn("relative flex", className)}>
        <input
          {...props}
          type={type}
          ref={ref}
          name={name}
          checked={checked}
          className={cn(
            "w-full h-full absolute opacity-0 z-[2]",
            disabled ? "cursor-not-allowed" : "cursor-pointer"
          )}
          style={{}}
          disabled={disabled}
          // name={name}
        />
        {checked}
        <span
          className={cn(
            "relative block w-[24px] h-[24px] shadow-[0_0_0_1px]",
            {
              "rounded-full border-[0.5rem]": variant === "default",
              "rounded-sm border-[0.75rem]": variant === "square",
              "shadow-primary-lighter border-primary ": checked === true,
              "shadow-gray-400": checked === false,
            },
            disabled && checked ? "!border-muted-foreground" : ""
          )}
        >
          {checked && variant === "square" && (
            <Check className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white w-[1.2rem] z-[1]" />
          )}
        </span>

        <label
          className={cn("ml-3 font-normal	", {
            "text-primary font-bold": checked === true,
            "text-gray-500": checked === false,
            "!text-gray-500": disabled === true,
          })}
        >
          {label}
        </label>
      </div>
    );
  }
);
Radio.displayName = "Radio";

export { Input, Radio };
