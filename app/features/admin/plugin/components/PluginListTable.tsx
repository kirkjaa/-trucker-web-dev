"use client";

import React, { useEffect } from "react";
import clsx from "clsx";

import usePluginListTable from "../hooks/usePluginListTable";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRowHead,
} from "@/app/components/ui/data-table";
import NoDataTable from "@/app/components/ui/featureComponents/NoDataTable";
import { Icons } from "@/app/icons";

export default function PluginListTable() {
  const { headerList, handleSort, fetchDataList, loading, plugins, sortKey } =
    usePluginListTable();

  useEffect(() => {
    fetchDataList();
  }, [fetchDataList]);

  const renderTableRows = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan={headerList.length} className="py-8 text-center">
            กำลังโหลดข้อมูล...
          </td>
        </tr>
      );
    }

    if (!plugins.length) {
      return <NoDataTable colSpan={headerList.length} />;
    }

    return plugins.map((plugin) => (
      <tr
        key={plugin.id}
        className="border-b border-neutral-02 last:border-b-0"
      >
        <td className="py-4 text-sm font-semibold">{plugin.code}</td>
        <td className="py-4 text-sm">{plugin.name}</td>
        <td className="py-4 text-sm">
          <p className="font-semibold">{plugin.company_name}</p>
          <p className="text-neutral-05">{plugin.company_location || "-"}</p>
        </td>
        <td className="py-4 text-sm">
          {new Date(plugin.created_at).toLocaleDateString("th-TH")}
        </td>
        <td className="py-4 text-sm">
          {plugin.created_by
            ? `${plugin.created_by.first_name} ${plugin.created_by.last_name}`
            : "-"}
        </td>
        <td className="py-4 text-sm">
          {plugin.available_credit.toLocaleString()}
        </td>
        <td className="py-4">
          <span
            className={clsx(
              "rounded-full px-3 py-1 text-xs font-semibold uppercase",
              {
                "bg-success-02 text-success-01": plugin.status === "ACTIVE",
                "bg-warning-02 text-warning-01": plugin.status === "DRAFT",
                "bg-urgent-fail-02 text-urgent-fail-01":
                  plugin.status === "INACTIVE",
              }
            )}
          >
            {plugin.status}
          </span>
        </td>
        <td className="py-4 text-right">
          <Icons name="ChevronRight" className="w-5 h-5 text-neutral-05" />
        </td>
      </tr>
    ));
  };

  return (
    <React.Fragment>
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
                        "text-primary-indigo-main": sortKey === key,
                      })}
                      onClick={() => sortable && key && handleSort(key as any)}
                    />
                  )}
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
