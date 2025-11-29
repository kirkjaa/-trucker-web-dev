import React from "react";

import { Button } from "@/app/components/ui/button";
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
import ImportButton from "@/app/components/ui/featureComponents/ImportButton";
import NoDataTable from "@/app/components/ui/featureComponents/NoDataTable";
import { Icons } from "@/app/icons";

type UploadTemplateCsvModalDetailProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  title: string;
  headerList?: string[];
  dataList?: Record<string, string>[];
  onClickConfirm?: () => void;
};

export default function UploadTemplateCsvModalDetail({
  open,
  setOpen,
  title,
  headerList,
  dataList,
  onClickConfirm,
}: UploadTemplateCsvModalDetailProps) {
  const renderTableRows = () => {
    if (!dataList || dataList.length === 0) return <NoDataTable />;
    return (
      <>
        {dataList.map((data, index) => (
          <TableRow key={index}>
            {headerList?.map((header) => (
              <TableCell key={header} className="w-[18%] text-sm">
                {data[header] || "-"}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </>
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent outlineCloseButton>
        <DialogHeader className="w-full pb-[1rem]">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="w-full bg-modal-01 flex justify-end p-2 items-center">
          <div className="w-44">
            <ImportButton icon="ImportCsv" title="นำเข้า CSV" />
          </div>
          <div className="w-40 ml-2">
            <Button onClick={onClickConfirm}>
              <Icons name="Plus" className="w-2 h-6" />
              <p>ยืนยันการนำเข้า</p>
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-2 w-full ">
          <Table>
            <TableHeader>
              <TableRowHead>
                {headerList &&
                  headerList.map((label) => (
                    <TableHead key={label} className="w-[100px]">
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
