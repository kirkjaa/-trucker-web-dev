import React from "react";
import clsx from "clsx";

import { TableCell, TableRow } from "../data-table";

type Props = {
  title?: string;
  colSpan?: number;
};

export default function NoDataTable({ title, colSpan = 8 }: Props) {
  return (
    <TableRow className="hover:border-none flex justify-center items-center">
      <TableCell
        colSpan={colSpan}
        className={clsx("py-40 font-semibold text-secondary-200", {
          "py-80": 10 === 10,
        })}
      >
        <h4 className="h-10">{title || "No data found"}</h4>
      </TableCell>
    </TableRow>
  );
}
