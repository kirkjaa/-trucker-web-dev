"use client";

import React, { useEffect } from "react";

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
import SummaryCard from "@/app/components/ui/featureComponents/SummaryCard";
import { useTruckStore } from "@/app/store/truckStore";
import { IOrderTruck } from "@/app/types/orderType";
import { formatDateToISOString } from "@/app/utils/formatDate";

type TruckJobProps = {
  id: string;
};

export default function TruckJob({ id }: TruckJobProps) {
  const headerList = [
    {
      key: "code",
      label: "รอบที่",
      width: "15%",
      sortable: false,
    },
    {
      key: "date",
      label: "วันที่",
      width: "15%",
      sortable: false,
    },
    {
      key: "origin",
      label: "ต้นทาง",
      width: "15%",
      sortable: false,
    },
    {
      key: "destination",
      label: "ปลายทาง",
      width: "15%",
      sortable: false,
    },
    {
      key: "action",
      label: "",
      width: "15%",
      sortable: false,
    },
  ];

  const [dataList, setDataList] = React.useState<IOrderTruck[]>([]);
  const { getTruckOrder } = useTruckStore();

  const fetchJob = async () => {
    const res = await getTruckOrder(id);
    setDataList(res.data);
  };
  useEffect(() => {
    if (id && id !== "") {
      fetchJob();
    }
  }, [id]);
  const renderTableRows = () => {
    if (!dataList || dataList.length <= 0) return <NoDataTable />;
    else
      return (
        <React.Fragment>
          {dataList.map((data) => (
            <TableRow key={data.displayCode}>
              <TableCell className="w-[15%] text-sm">
                {data.displayCode}
              </TableCell>
              <TableCell className="w-[15%] text-sm">
                {formatDateToISOString(new Date(data.createdAt))}
              </TableCell>
              <TableCell className="w-[15%] text-sm">
                {data.originProvince}
              </TableCell>
              <TableCell className="w-[15%] text-sm">
                {data.destinationProvince}
              </TableCell>
            </TableRow>
          ))}
        </React.Fragment>
      );
  };
  return (
    <React.Fragment>
      <div className="">
        <div className="flex flex-wrap gap-2 h-full w-full items-center min-h-fit ">
          <div className="md:w-1/3 sm:w-full">
            <SummaryCard
              value={0}
              unit={"ประเภท"}
              title={"ประเภทของรถ"}
              icon="StarCircle"
            />
          </div>
          <div className="md:w-1/3 sm:w-full">
            <SummaryCard
              value={0}
              unit={"คัน"}
              title={"รถบรรทุกทั้งหมด"}
              icon="TruckCircle"
            />
          </div>
        </div>

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
