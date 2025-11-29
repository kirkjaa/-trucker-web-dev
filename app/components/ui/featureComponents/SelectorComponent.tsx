import * as React from "react";
import clsx from "clsx";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Icons } from "@/app/icons";
import { IAmphure, IProvince, ITambon } from "@/app/types/addressType";

interface ISelectorComponentProps {
  title: string;
  valueChange: (value: string) => void;
  json?: Array<{ id: number; name: string; type: string }>;
  provinceJson?: IProvince[];
  districtJson?: IAmphure[];
  subdistrictJson?: ITambon[];
  value?: string;
  validateKey: string;
  getError?: (field: string) => string | undefined;
  disabled?: boolean;
  isRequired?: boolean;
}

export const SelectorComponent = ({
  title,
  valueChange,
  json,
  provinceJson,
  districtJson,
  subdistrictJson,
  value,
  validateKey,
  getError,
  disabled,
  isRequired,
}: ISelectorComponentProps) => {
  return (
    <div className="w-full flex flex-col gap-1">
      <p className="text-sm font-semibold">
        {title} {isRequired && <span className="text-urgent-fail-02">*</span>}
      </p>
      <div className="flex flex-col gap-1">
        <Select onValueChange={valueChange} value={value} disabled={disabled}>
          <SelectTrigger
            className={clsx(
              "disabled:opacity-100 bg-white",
              {
                "border-urgent-fail-02": getError && getError(validateKey),
              },
              {
                "text-neutral-05": value === "",
              }
            )}
            borderColor="border-neutral-02"
          >
            <SelectValue placeholder="กรุณาเลือก" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {json &&
                json?.map((type) => (
                  <SelectItem key={type.id} value={type.type}>
                    {type.name}
                  </SelectItem>
                ))}
              {provinceJson &&
                provinceJson?.map((prov) => (
                  <SelectItem key={prov.id} value={prov.name_th}>
                    {prov.name_th}
                  </SelectItem>
                ))}
              {districtJson &&
                districtJson?.map((dis) => (
                  <SelectItem key={dis.id} value={dis.name_th}>
                    {dis.name_th}
                  </SelectItem>
                ))}
              {subdistrictJson &&
                subdistrictJson?.map((sub) => (
                  <SelectItem key={sub.id} value={sub.name_th}>
                    {sub.name_th}
                  </SelectItem>
                ))}
            </SelectGroup>
          </SelectContent>
        </Select>
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
