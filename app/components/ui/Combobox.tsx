"use client";

import * as React from "react";
import { debounce } from "lodash";
import { Check, X } from "lucide-react";

import { Badge } from "./badge";
import { Button } from "./button";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

import { iconNames, Icons } from "@/app/icons";
import { useGlobalStore } from "@/app/store/globalStore";
import { IOption } from "@/app/types/global";
import { cn } from "@/lib/utils";

type Mode = "single" | "multiple";

interface ComboboxProps {
  mode?: Mode;
  options: IOption[];
  selected: IOption[];
  className?: string;
  popOverClassName?: string;
  placeholder?: string;
  disabled?: boolean;
  Icon?: keyof typeof iconNames;
  showIcon?: boolean;
  onChange?: (event: IOption[]) => void;
  onInput?: (value: string) => void;
}

const MultipleChoiceCombobox = ({
  options = [],
  selected = [],
  className,
  popOverClassName,
  placeholder,
  disabled = false,
  Icon = "ChevronDown",
  showIcon = true,
  onChange,
  onInput,
}: ComboboxProps) => {
  // Global State
  const loading = useGlobalStore((state) => state.loading);

  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const [selectedItems, setSelectedItems] = React.useState<IOption[]>(selected);

  React.useEffect(() => {
    setSelectedItems(selected);
  }, [selected]);

  const debounced = React.useRef(
    debounce((value) => {
      if (onInput) {
        onInput(value);
      }
    }, 500)
  ).current;

  const handleSelect = (item: IOption) => {
    if (!selectedItems.some((selected) => selected.value === item.value)) {
      const updatedSelection = [...selectedItems, item];
      setSelectedItems(updatedSelection);
      if (onChange) {
        onChange(updatedSelection);
      }
      setInputValue("");
      setOpen(false);
    }
  };

  const removeItem = (item: IOption) => {
    const updatedSelection = selectedItems.filter(
      (selected) => selected.value !== item.value
    );
    setSelectedItems(updatedSelection);
    if (onChange) {
      onChange(updatedSelection);
    }
  };

  return (
    <div className="block w-full">
      <Popover open={open} onOpenChange={disabled ? undefined : setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "border border-neutral-05 w-full h-fit rounded-md font-normal bg-white",
              selected[0]?.value && !disabled
                ? "text-neutral-04"
                : "text-neutral-04",
              className
            )}
          >
            <div className="flex gap-4 flex-wrap w-full">
              {selectedItems.length > 0 ? (
                selectedItems.map((item) => (
                  <Badge
                    key={item.value}
                    className="flex rounded-md px-2 py-1 bg-calendar-selected text-secondary-teal-green-04 gap-2 max-w-full break-words"
                  >
                    <p className="text-start break-all whitespace-normal w-full">
                      {item.label}
                    </p>
                    <span
                      className="ml-auto cursor-pointer chip-remove text-black border border-black rounded-full shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeItem(item);
                      }}
                    >
                      <X size={14} />
                    </span>
                  </Badge>
                ))
              ) : (
                <p className="text-start break-all whitespace-normal w-full">
                  {placeholder}
                </p>
              )}
            </div>

            {showIcon && (
              <Icons name={Icon} className="w-4 h-4 text-neutral-07" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className={cn("p-0", popOverClassName)}>
          <Command>
            <CommandInput
              onInput={(e) => {
                const val = e.currentTarget.value;
                setInputValue(val);
                debounced(val);
              }}
              placeholder={placeholder}
              disabled={disabled}
            />

            <CommandEmpty>
              {loading ? (
                <p className="ml-8 text-neutral-04">กำลังค้นหา...</p>
              ) : inputValue && options.length === 0 ? (
                <p className="ml-8 text-neutral-04">ไม่พบข้อมูล</p>
              ) : null}
            </CommandEmpty>

            <CommandList className="max-h-[320px]">
              {options &&
                options.map((item, index) => (
                  <CommandItem
                    key={item.value ?? `${item.label}-${index}`}
                    value={item.value}
                    onSelect={() => handleSelect(item)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4 text-secondary-teal-green-main",
                        selected.find((i) => i.value == item.value)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {item.label}
                  </CommandItem>
                ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

const ISearchOptionCombobox = ({
  mode = "single",
  options = [],
  selected = [],
  className,
  popOverClassName,
  placeholder = "Select an option...",
  disabled = false,
  Icon = "ChevronDown",
  showIcon = true,
  onChange,
  onInput,
}: ComboboxProps) => {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filteredOptions, setFilteredOptions] = React.useState<IOption[]>([]);
  const [selectedItems, setSelectedItems] = React.useState<IOption[]>(selected);

  React.useEffect(() => {
    setSelectedItems(selected);
  }, [selected]);

  const debouncedSearch = React.useRef(
    debounce((value: string) => {
      setSearchTerm(value);
      onInput?.(value);
    }, 300)
  ).current;

  React.useEffect(() => {
    const term = searchTerm.toLowerCase();
    const result = !term
      ? options.slice(0, 50)
      : options
          .filter((item) => item.label.toLowerCase().includes(term))
          .slice(0, 50);
    setFilteredOptions(result);
  }, [searchTerm, options]);

  const handleSelect = (item: IOption) => {
    let updated: IOption[] = [];

    if (mode === "multiple") {
      const exists = selectedItems.some((i) => i.value == item.value);
      updated = exists
        ? selectedItems.filter((i) => i.value != item.value)
        : [...selectedItems, item];
    } else {
      updated = [item];
      setOpen(false);
    }

    setSelectedItems(updated);
    setSearchTerm("");
    onChange?.(updated);
  };

  const isSelected = (item: IOption) =>
    selectedItems.some((i) => i.value == item.value);

  return (
    <div className={cn("relative w-full", className)}>
      <input
        type="text"
        placeholder={
          selectedItems.length > 0
            ? selectedItems.map((i) => i.label).join(", ")
            : placeholder
        }
        onChange={(e) => debouncedSearch(e.target.value)}
        onFocus={() => !disabled && setOpen(true)}
        className={cn(
          "w-full border border-neutral-07 rounded-3xl px-3 py-2 bg-white",
          disabled ? "cursor-not-allowed bg-gray-100" : "",
          "text-sm"
        )}
        disabled={disabled}
        value={searchTerm}
      />
      {showIcon && (
        <Icons
          name={Icon}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
        />
      )}
      {open && (
        <div
          className={cn(
            "absolute z-50 mt-1 w-full bg-white border rounded-md shadow-md max-h-[320px] overflow-auto",
            popOverClassName
          )}
        >
          {filteredOptions.length === 0 ? (
            <div className="p-3 text-sm text-muted-foreground">
              No options found.
            </div>
          ) : (
            filteredOptions.map((item) => (
              <div
                key={`${item.value}`}
                className={cn(
                  "cursor-pointer px-3 py-2 text-sm hover:bg-gray-100 flex items-center",
                  isSelected(item) ? "font-medium text-primary" : ""
                )}
                onClick={() => handleSelect(item)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    isSelected(item) ? "opacity-100" : "opacity-0"
                  )}
                />
                {item.label}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export { MultipleChoiceCombobox, ISearchOptionCombobox };
