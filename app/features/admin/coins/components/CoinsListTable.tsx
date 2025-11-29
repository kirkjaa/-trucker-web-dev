"use client";

import React, { useEffect } from "react";
import clsx from "clsx";

import useCoinsListTable from "../hooks/useCoinsListTable";

import CoinModal from "./CoinModal";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableRowHead,
} from "@/app/components/ui/data-table";
import MenuButton from "@/app/components/ui/featureComponents/MenuButton";
import NoDataTable from "@/app/components/ui/featureComponents/NoDataTable";
import { Icons } from "@/app/icons";
import { CoinsType } from "@/app/types/enum";

export default function CoinsListTable() {
  const {
    fetchDataList,
    currentStep,
    tab,
    setTab,
    handleSort,
    headerList,
    dataList,
    handleClickViewIcon,
    openModal,
    setOpenModal,
    selectedData,
  } = useCoinsListTable();
  const renderTableRows = () => {
    if (!dataList || dataList.length <= 0) return <NoDataTable />;
    return (
      <React.Fragment>
        {dataList.map((data, index) => (
          <TableRow key={index}>
            <TableCell className="w-[18%] text-sm">{data.driverType}</TableCell>
            <TableCell className="w-[15%] text-sm">
              {data.companyName}
            </TableCell>
            <TableCell className="w-[14%] text-sm">
              {data.factoryName}
            </TableCell>
            <TableCell className="w-[15%] text-sm">{data.createdBy}</TableCell>
            <TableCell
              className={clsx("w-[10%] font-bold", {
                "text-success-01": data.amount > 0,
                "text-red-500": data.amount < 0,
              })}
            >
              {data.amount > 0 && "+"} {data.amount}
            </TableCell>
            <TableCell className="w-[10%] text-sm">
              <Icons
                name="ShowPassword"
                className="w-6 h-6 cursor-pointer"
                onClick={() => {
                  handleClickViewIcon(data);
                }}
              />
            </TableCell>
          </TableRow>
        ))}
      </React.Fragment>
    );
  };

  useEffect(() => {
    fetchDataList();
  }, [tab]);

  useEffect(() => {
    if (currentStep === 2) {
      setTab(CoinsType.TOPUP);
    } else if (currentStep === 3) {
      setTab(CoinsType.WITHDRAW);
    } else {
      setTab(undefined);
    }
  }, [currentStep]);
  return (
    <React.Fragment>
      <div className="flex flex-col gap-2 w-full">
        <div className="font-bold text-lg flex gap-10 px-5 text-main-02 border-b">
          <MenuButton
            step={1}
            title="ทั้งหมด"
            icon1="ListPrimary"
            icon2="ListGray"
          />
          <MenuButton
            step={2}
            title="เติมเหรียญ"
            icon1="AddCoinsPrimary"
            icon2="AddCoinsGray"
          />
          <MenuButton
            step={3}
            title="ถอนเหรียญ"
            icon1="CoinPrimary"
            icon2="CoinGray"
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
      <CoinModal
        open={openModal}
        setOpen={setOpenModal}
        imageUrl={selectedData?.imageUrl}
      />
    </React.Fragment>
  );
}
