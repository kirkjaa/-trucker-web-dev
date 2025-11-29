"use client";

import React, { useEffect } from "react";
import clsx from "clsx";

import useDisbursementListTable from "../hooks/useDisbursementListTable";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRowHead,
} from "@/app/components/ui/data-table";
import MenuButton from "@/app/components/ui/featureComponents/MenuButton";
import NoDataTable from "@/app/components/ui/featureComponents/NoDataTable";
import PaymentConfirmationModal from "@/app/components/ui/featureComponents/PaymentConfirmationModal";
import StartDateEndDateModal from "@/app/components/ui/featureComponents/StartDateEndDateModal";
import { Icons } from "@/app/icons";

export default function DisbursementListTable() {
  const {
    headerList,
    handleSort,
    openPaymentModal,
    setOpenPaymentModal,
    openDownloadModal,
    setOpenDownloadModal,
    getOpenDowloadModal,
    setOpenDownloadModalStore,
  } = useDisbursementListTable();

  useEffect(() => {
    setOpenDownloadModal(getOpenDowloadModal());
  }, [getOpenDowloadModal()]);

  const renderTableRows = () => {
    return <NoDataTable />;
  };
  return (
    <React.Fragment>
      <div className="flex flex-col gap-2 w-full">
        <div className="font-bold text-lg flex gap-10 p-5 text-main-02 border-b">
          <MenuButton
            step={1}
            title="รอการจ่าย"
            icon1="PaperPrimary"
            icon2="Paper"
          />
          <MenuButton
            step={2}
            title="จ่ายเสร็จสิ้น"
            icon1="BuyPrimary"
            icon2="Buy"
          />
        </div>
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
      <PaymentConfirmationModal
        open={openPaymentModal}
        setOpen={setOpenPaymentModal}
        title="ยืนยันการจ่ายเงิน"
      />
      <StartDateEndDateModal
        open={openDownloadModal}
        setOpen={setOpenDownloadModalStore}
        title="ดาววน์โหลด (กำหนดวันของบิล)"
        startDateLabel="บิลวันที่ จาก"
        endDateLabel="บิลวันที่ ถึง"
      />
    </React.Fragment>
  );
}
