import React from "react";

import usePluginForm from "../hooks/usePluginForm";

import {
  Table,
  TableHead,
  TableHeader,
  TableRowHead,
} from "@/app/components/ui/data-table";

export default function PluginFormTable() {
  const { headerList } = usePluginForm();
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
          {/* <TableBody>{renderTableRows()}</TableBody> */}
        </Table>
      </div>
    </React.Fragment>
  );
}
