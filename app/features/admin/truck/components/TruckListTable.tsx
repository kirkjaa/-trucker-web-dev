"use client";

import React, { useEffect } from "react";
import clsx from "clsx";

import useTruckListTable from "../hooks/useTruckListTable";

import TruckModal from "./TruckModal";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRowHead,
} from "@/app/components/ui/data-table";
import NoDataTable from "@/app/components/ui/featureComponents/NoDataTable";
import { Icons } from "@/app/icons";

export default function TruckListTable() {
  const {
    headerList,
    handleSort,
    getOpenModal,
    setOpenModal,
    setVisibleModal,
    visibleModal,
    feature,
  } = useTruckListTable();

  useEffect(() => {
    setVisibleModal(getOpenModal());
  }, [getOpenModal()]);

  const renderTableRows = () => {
    return <NoDataTable />;
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
      <TruckModal
        open={visibleModal}
        setOpen={setOpenModal}
        feature={feature}
      />
    </React.Fragment>
  );
}
