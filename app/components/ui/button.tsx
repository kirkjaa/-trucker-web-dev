import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[1.25rem] text-base font-semibold leading-normal",
  {
    variants: {
      variant: {
        main: "main group bg-secondary-indigo-main text-white hover:bg-secondary-indigo-01 hover:drop-shadow-main-button disabled:bg-neutral-05 disabled:text-neutral-00",
        "main-light":
          "main-light group bg-white border border-secondary-indigo-main text-secondary-indigo-main hover:bg-secondary-indigo-hover hover:border-none disabled:border-neutral-04 disabled:text-neutral-04",
        secondary:
          "secondary group bg-secondary-teal-green-main text-white hover:bg-secondary-teal-green-04 hover:drop-shadow-secondary-button disabled:bg-neutral-05 disabled:text-neutral-00",
        "secondary-light":
          "secondary-light group bg-white border border-secondary-teal-green-04 text-secondary-teal-green-04 hover:bg-secondary-teal-green-hover hover:border-none disabled:border-neutral-04 disabled:text-neutral-04",
        delete:
          "delete group bg-urgent-fail-02 text-white hover:bg-urgent-fail-01 hover:drop-shadow-delete-button disabled:bg-neutral-05 disabled:text-neutral-00",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        pagination: "border-none text-primary flex gap-0",
        disableDatePasts:
          "hover:bg-accent hover:text-accent-foreground disabled:bg-white disabled:text-black disabled:opacity-20",
        datePicker:
          "bg-background hover:bg-accent hover:text-accent-foreground",
        dropdownMenu:
          "bg-secondary-teal-green-main rounded-r-none text-white hover:bg-secondary-teal-green-04 hover:text-white",
        filter:
          "bg-secondary-teal-green-main text-white hover:bg-secondary-teal-green-04 hover:text-white",
        form: " rounded-md border border-neutral-03 bg-white",
        timeRange:
          "timeRange group bg-white text-secondary-dark-gray-main border border-neutral-03",
      },
      size: {
        default: "h-11 px-4 py-2 w-fit",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
        pagination: "h-10 w-8",
        selectPaginate: "h-6",
        date: "h-10 px-4 py-0",
        timeRange: "h-9 w-24 px-4 py-2 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "main",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  disabled?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, asChild = false, disabled = false, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    const disabledStyles =
      variant === "main"
        ? "pointer-events-none bg-secondary-75 text-secondary-500"
        : variant === "secondary"
          ? " pointer-events-none text-secondary-400 border-secondary-100"
          : " pointer-events-none text-secondary-400";

    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className }),
          disabled && disabledStyles
        )}
        ref={ref}
        disabled={disabled}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
