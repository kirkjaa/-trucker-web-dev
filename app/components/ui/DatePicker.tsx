"use client";

import * as React from "react";
import dayjs from "dayjs";

import { Button } from "@/app/components/ui/button";
import { Calendar } from "@/app/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/popover";
import { Icons } from "@/app/icons";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  disabled?: boolean;
  disablePastDates?: boolean; // New prop to control past dates disabling
  disableDateBefore?: Date;
  disableDateAfter?: Date;
  className?: string;
  primary?: boolean;
}

export function DatePicker({
  value,
  onChange,
  disabled,
  disablePastDates,
  disableDateBefore,
  disableDateAfter,
  className,
  primary = true,
}: DatePickerProps) {
  const currentDate = dayjs().startOf("day").toDate();

  function disableDate(): ((date: Date) => boolean) | undefined {
    return (date: Date) => {
      const day = dayjs(date).startOf("day");

      if (disablePastDates && day.isBefore(dayjs().startOf("day"))) {
        return true;
      }

      if (
        disableDateBefore &&
        day.isBefore(dayjs(disableDateBefore).startOf("day"))
      ) {
        return true;
      }

      if (
        disableDateAfter &&
        day.isAfter(dayjs(disableDateAfter).startOf("day"))
      ) {
        return true;
      }

      return false;
    };
  }

  return (
    <Popover>
      <PopoverTrigger disabled={disabled} asChild>
        <Button
          variant={"datePicker"}
          size="date"
          className={cn(
            "w-full justify-start text-left border-2 pr-0  rounded-lg font-normal disabled:cursor-not-allowed",
            !value ? "text-muted-foreground" : "",
            primary && "border-secondary-teal-green-main",
            className
          )}
        >
          {value ? (
            <span className="flex justify-between items-center w-full">
              {dayjs(value).format("DD MMM YYYY")}
              <div
                className={cn(
                  "text-white  w-14 flex items-center justify-center",
                  primary && "bg-secondary-teal-green-main"
                )}
              >
                <Icons
                  name={primary ? "Calendar" : "CalendarMain"}
                  className={cn(primary ? "w-8 h-9" : " h-6")}
                />
              </div>
            </span>
          ) : (
            <span className="flex justify-between items-center w-full">
              <span className="text-neutral-400">Pick a date</span>
              <div
                className={cn(
                  "text-white  w-14 flex items-center justify-center",
                  primary && "bg-secondary-teal-green-main"
                )}
              >
                <Icons
                  name={primary ? "Calendar" : "CalendarMain"}
                  className={cn(primary ? "w-8 h-9" : " h-6")}
                />
              </div>
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          mode="single"
          captionLayout="label"
          selected={value}
          onSelect={onChange}
          // fromYear={1960}
          // toYear={2030}
          disabled={disableDate()}
        />
        <div className="flex justify-between px-2 mb-2">
          <Button
            variant="ghost"
            onClick={() => onChange(currentDate)}
            disabled={disabled}
            className="text-sm font-bold h-6"
          >
            Today
          </Button>
          <Button
            variant="ghost"
            onClick={() => onChange(undefined)}
            disabled={disabled}
            className="text-sm font-bold h-6"
          >
            Clear
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
