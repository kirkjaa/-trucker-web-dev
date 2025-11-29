import React from "react";
import clsx from "clsx";

import HistoryOfCoinUseSearchBar from "../../../features/admin/components/HistoryOfCoinUseSearchBar";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableRowHead,
} from "@/app/components/ui/data-table";
import { Icons } from "@/app/icons";
import { ICoinsByTruckerId } from "@/app/types/coinsType";

interface keyHeaderListProps {
  amount: number;
  type: string;
  createdAt: Date;
  createdBy: string;
  approvedBy: string;
  remark: string;
}
// eslint-disable-next-line no-empty-pattern
type HistoryOfCoinUseListTableProps = { transactionCoins?: ICoinsByTruckerId };
export default function HistoryOfCoinUseListTable({
  transactionCoins,
}: HistoryOfCoinUseListTableProps) {
  const headerList: {
    key: keyof keyHeaderListProps | "";
    label: string;
    sortable?: boolean;
    width?: string;
  }[] = [
    { key: "amount", label: "Coins", width: "16%", sortable: false },
    { key: "type", label: "รายการ", width: "16%", sortable: false },
    { key: "createdAt", label: "วันที่ - เวลา", width: "16%", sortable: false },
    {
      key: "createdBy",
      label: "ผู้ทำรายการ",
      sortable: false,
      width: "16%",
    },
    { key: "approvedBy", label: "ผู้อนุมัติ", sortable: false, width: "16%" },
    { key: "remark", label: "หมายเหตุ", width: "16%", sortable: false },
  ];

  const renderTableRows = () => {
    if (!transactionCoins || transactionCoins?.transactions.length <= 0)
      return (
        <TableRow className="hover:border-none flex justify-center items-center">
          <TableCell
            colSpan={8}
            className={clsx("py-40 font-semibold text-secondary-200", {
              "py-40": 10 === 10,
            })}
          >
            <h4 className="h-10">No data found</h4>
          </TableCell>
        </TableRow>
      );
    return (
      <React.Fragment>
        {transactionCoins?.transactions.map((data) => (
          <TableRow key={data.id}>
            <TableCell className="w-[16%] text-sm">{data.amount}</TableCell>
            <TableCell className="w-[16%] text-sm">{data.type}</TableCell>
            <TableCell className="w-[16%] text-sm">{data.createdAt}</TableCell>
            <TableCell className="w-[16%] text-sm">{data.createdBy}</TableCell>
            <TableCell className="w-[16%] text-sm">{data.approvedBy}</TableCell>
            <TableCell className="w-[16%] text-sm">{data.remark}</TableCell>
          </TableRow>
        ))}
      </React.Fragment>
    );
  };
  return (
    <div className="flex flex-col gap-4">
      <HistoryOfCoinUseSearchBar amount={transactionCoins?.currentCoin || 0} />
      <div className="flex flex-col gap-2 w-full">
        <Table>
          <TableHeader>
            <TableRowHead>
              {headerList.map(({ key, label, sortable = true, width }) => (
                <TableHead
                  key={key}
                  className={`w-[${width}] flex items-center gap-1`}
                >
                  {label}
                  {sortable && key && (
                    <Icons
                      name="Swap"
                      className={clsx("w-4 h-4", {
                        "cursor-pointer": sortable,
                      })}
                    />
                  )}
                </TableHead>
              ))}
            </TableRowHead>
          </TableHeader>

          <TableBody>{renderTableRows()}</TableBody>
        </Table>
      </div>
    </div>
  );
}
