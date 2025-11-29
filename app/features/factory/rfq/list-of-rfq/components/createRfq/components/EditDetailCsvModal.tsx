import { useState } from "react";
import clsx from "clsx";

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Icons } from "@/app/icons";
import { RowObject } from "@/app/types/global";

interface IEditDetailCsvModalProps {
  rowData: RowObject;
  handleSaveToEdit: (updatedData: RowObject | null) => void;
}

export default function EditDetailCsvModal({
  rowData,
  handleSaveToEdit,
}: IEditDetailCsvModalProps) {
  // Local State
  const [editedData, setEditedData] = useState(rowData || {});

  // Function
  const handleChange = (field: string, value: string) => {
    setEditedData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex flex-col gap-5 text-neutral-08">
      <div className="flex flex-col gap-2 bg-modal-01 px-5 py-3 rounded-lg">
        <p className="text-base font-semibold">สถานที่จัดส่ง</p>

        <div className="flex justify-between gap-4 items-center rounded-lg px-5 py-2 border-2 border-dashed border-neutral-03">
          <div className="flex flex-col gap-1 w-full">
            <p className="text-sm font-semibold ">
              ต้นทาง <span className="text-urgent-fail-02">*</span>
            </p>

            <Input
              className="h-10 w-full border-2 border-neutral-03 disabled:opacity-100"
              value={editedData["originProvince"]}
              disabled
            />
          </div>

          <div className="mt-6">
            <Icons name="DoubleChevronRightGreen" className="w-14 h-14" />
          </div>

          <div className="flex flex-col gap-1 w-full">
            <p className="text-sm font-semibold ">
              ปลายทาง <span className="text-urgent-fail-02">*</span>
            </p>

            <Input
              className="h-10 w-full border-2 border-neutral-03 disabled:opacity-100"
              value={editedData["destinationProvince"]}
              disabled
            />
          </div>
        </div>

        <div className="flex gap-2 rounded-lg">
          <div className="flex flex-col gap-1 w-full">
            <p className="text-sm font-semibold ">
              ระยะทาง <span className="text-urgent-fail-02">*</span>
            </p>

            <Input
              className="h-10 w-full border-2 border-neutral-03"
              value={editedData["distance"]}
              disabled
            />
          </div>

          <div className="flex flex-col gap-1 w-full">
            <p className="text-sm font-semibold ">
              รูปแบบ <span className="text-urgent-fail-02">*</span>
            </p>

            <Select
              value={editedData["unit"]}
              onValueChange={(value) => handleChange("unit", value)}
            >
              <SelectTrigger
                className={clsx(
                  "py-2 px-5 bg-white border-neutral-03"
                  // {
                  //   "text-black": editedData["หน่วย"],
                  // }
                )}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="บาท/เที่ยว">บาท/เที่ยว</SelectItem>
                  <SelectItem value="บาท/ชิ้น">บาท/ชิ้น</SelectItem>
                  <SelectItem value="บาท/ตัน">บาท/ตัน</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1 w-full">
            <p className="text-sm font-semibold ">
              ราคา <span className="text-urgent-fail-02">*</span>
            </p>

            <Input
              type="number"
              className="h-10 w-full border border-neutral-03"
              onWheel={(e) => (e.target as HTMLElement).blur()}
              value={
                editedData["price"] ? editedData["price"].replace(/,/g, "") : ""
              }
              onChange={(e) => handleChange("price", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Button */}
      <div className="flex justify-end gap-4">
        <Button
          variant="main-light"
          className="px-16"
          onClick={() => handleSaveToEdit(null)}
        >
          ยกเลิก
        </Button>
        <Button className="px-16" onClick={() => handleSaveToEdit(editedData)}>
          ยืนยัน
        </Button>
      </div>
    </div>
  );
}
