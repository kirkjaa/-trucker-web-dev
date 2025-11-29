"use client";

import React from "react";

import { Checkbox } from "@/app/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/app/components/ui/collapsible";
import { Icons } from "@/app/icons";
type PoolFilterProps = {
  title: string;
  options: string[];
  selectedOptions: string[];
  setSelectedOptions: (data: string[]) => void;
  onChange?: () => void;
  displayMap?: Record<string, string>;
};
export default function PoolFilter({
  title,
  options,
  selectedOptions,
  setSelectedOptions,
  displayMap,
}: PoolFilterProps) {
  const [open, setOpen] = React.useState(true);
  const [showAll, setShowAll] = React.useState(false);

  const visibleOptions = showAll ? options : options.slice(0, 6);

  return (
    <React.Fragment>
      <Collapsible
        className="CollapsibleRoot"
        open={open}
        onOpenChange={setOpen}
      >
        <div className="flex justify-between">
          <p className="text-md">{title}</p>
          <CollapsibleTrigger asChild>
            <Icons
              name={!open ? "ChevronDownBulk" : "ChevronUpBulk"}
              className="cursor-pointer w-[1.5rem]"
            />
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent>
          {visibleOptions.map((item) => (
            <div className="Repository" key={item}>
              <Checkbox
                checked={selectedOptions.includes(item)}
                onCheckedChange={() =>
                  setSelectedOptions(
                    selectedOptions.includes(item)
                      ? selectedOptions.filter((i) => i !== item)
                      : [...selectedOptions, item]
                  )
                }
              />
              <span className="ml-2">{displayMap?.[item] ?? item}</span>
            </div>
          ))}

          {options.length > 6 && (
            <button
              className="text-sm text-secondary-caribbean-green-main mt-2 hover:underline"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? "แสดงน้อยลง" : "แสดงทั้งหมด"}
            </button>
          )}
        </CollapsibleContent>
      </Collapsible>
    </React.Fragment>
  );
}
