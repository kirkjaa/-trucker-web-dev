import React from "react";

import { PluginFeatureForm } from "../hooks/usePluginForm";

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
import { Icons } from "@/app/icons";

type PluginFormTableProps = {
  headerList: {
    key: string;
    label: string;
    width: string;
    sortable: boolean;
  }[];
  data: PluginFeatureForm[];
  onRemove: (index: number) => void;
};

export default function PluginFormTable({
  headerList,
  data,
  onRemove,
}: PluginFormTableProps) {
  return (
    <React.Fragment>
      <div className="flex flex-col gap-2 w-full">
        <Table>
          <TableHeader>
            <TableRowHead>
              {headerList.map(({ key, label, width }) => (
                <TableHead
                  key={key}
                  className={`w-[${width}] flex items-center gap-1 bg-secondary-indigo-main text-white min-h-20 border-r-2 rounded-lg`}
                >
                  {label}
                </TableHead>
              ))}
            </TableRowHead>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <NoDataTable
                title="ยังไม่มีฟังก์ชันการใช้งาน"
                colSpan={headerList.length}
              />
            ) : (
              data.map((feature, index) => (
                <TableRow key={`${feature.featureName}-${index}`}>
                  <TableCell className="text-sm font-semibold">
                    {feature.featureName}
                  </TableCell>
                  <TableCell className="text-sm">
                    {feature.limitedPrice
                      ? `${feature.limitedPrice.toLocaleString()} ฿`
                      : "-"}
                  </TableCell>
                  <TableCell className="text-sm">
                    {feature.monthlyPrice
                      ? `${feature.monthlyPrice.toLocaleString()} ฿`
                      : "-"}
                  </TableCell>
                  <TableCell className="text-sm">
                    {feature.yearlyPrice
                      ? `${feature.yearlyPrice.toLocaleString()} ฿`
                      : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      onClick={() => onRemove(index)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Icons name="Bin" className="w-5 h-5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </React.Fragment>
  );
}
