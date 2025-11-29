import React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableRowHead,
} from "@/app/components/ui/data-table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Icons } from "@/app/icons";
import { ITemplate } from "@/app/types/template/templateType";

type UploadTemplateCsvViewModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  data?: ITemplate;
};

export default function UploadTemplateCsvViewModal({
  open,
  setOpen,
  data,
}: UploadTemplateCsvViewModalProps) {
  const headerList = [
    {
      key: "columns",
      label: "คอลัมน์",
      width: "25%",
    },
    {
      key: "columnsFile",
      label: "ไฟล์คอลัมน์",
      width: "25%",
    },
    {
      key: "space",
      label: "",
      width: "25%",
    },
    {
      key: "fields",
      label: "หัวข้อที่แนะนำ",
      width: "25%",
    },
  ];
  const renderTableRows = () => {
    return data?.fields.map((column, index) => (
      <TableRow key={index}>
        <TableCell className="w-[25%] text-sm">{`Column ${index + 1}`}</TableCell>
        <TableCell className="w-[25%] text-sm">{column?.match_field}</TableCell>
        <TableCell className="w-[25%] text-sm">
          <div className="flex justify-start items-center">
            <Icons name={"DoubleChevronRightGreen"} className="w-10 h-10" />
          </div>
        </TableCell>
        <TableCell className="w-[25%] text-sm">
          {column?.field?.field_name}
        </TableCell>
      </TableRow>
    ));
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[700px]" outlineCloseButton>
        <DialogHeader className="w-full pb-[1rem]">
          <DialogTitle>{data?.organization.name}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-2 w-full ">
          <Table>
            <TableHeader>
              <TableRowHead>
                {headerList.map(({ key, label, width }: any) => (
                  <TableHead
                    key={key}
                    className={`w-[${width}] flex items-center gap-1`}
                  >
                    {label}
                  </TableHead>
                ))}
              </TableRowHead>
            </TableHeader>
            <TableBody>{renderTableRows()}</TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
