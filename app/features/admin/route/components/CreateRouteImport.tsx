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
import NoDataTable from "@/app/components/ui/featureComponents/NoDataTable";

type CreateRouteImportProps = {
  headerList: {
    key: string;
    label: string;
    width: string;
  }[];
  dataList: Record<string, any>[];
  onSubmit: () => void;
  errorMessage?: string;
};
export default function CreateRouteImport({
  headerList,
  dataList,
  onSubmit,
  errorMessage,
}: CreateRouteImportProps) {
  const renderTableRows = () => {
    if (dataList.length <= 0) return <NoDataTable />;
    return (
      <React.Fragment>
        {dataList.map((data, index) => (
          <TableRow key={`${data}-${index}`}>
            {headerList.map(({ key }) => (
              <TableCell key={`${data}-${key}-${index}`} className="text-sm">
                {data[key] ?? "-"}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </React.Fragment>
    );
  };

  return (
    <React.Fragment>
      <div className="flex justify-between bg-modal-01 h-20 rounded-xl w-full items-center p-4">
        <div>
          ผลลัพธ์{" "}
          <span className="text-secondary-caribbean-green-main">
            {dataList.length} <strong>รายการ</strong>
          </span>
          {errorMessage && errorMessage !== "" && (
            <p className="text-sm text-red-500 mt-2">{errorMessage}</p>
          )}
        </div>

        <Button
          variant="main"
          onClick={onSubmit}
          disabled={errorMessage !== ""}
        >
          นำเข้าข้อมูล
        </Button>
      </div>

      <div className="flex flex-col gap-2 w-full">
        <Table>
          <TableHeader>
            <TableRowHead>
              {headerList.map(({ key, label, width }) => (
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
    </React.Fragment>
  );
}
