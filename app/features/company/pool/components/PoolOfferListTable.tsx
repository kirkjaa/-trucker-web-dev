"use client";

import React, { useEffect } from "react";
import clsx from "clsx";

import usePoolOfferListTable from "../hooks/usePoolOfferListTable";

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
import HeaderWithBackStep from "@/app/components/ui/featureComponents/HeaderWithBackStep";
import NoDataTable from "@/app/components/ui/featureComponents/NoDataTable";
import ModalNotification from "@/app/components/ui/ModalNotification";
import { ControlledPaginate } from "@/app/components/ui/pagination/ControlledPagination";
import { Icons } from "@/app/icons";

type PoolOfferListTableProps = {
  postId: string;
};

export default function PoolOfferListTable({
  postId,
}: PoolOfferListTableProps) {
  const {
    fetchDataList,
    headerList,
    handleSort,
    // sorting,
    dataList,
    handleClickBackStep,
    getSelectedPool,
    handleAcceptOffer,
    handleRejectOffer,
    handleChangePage,
    handleChangeLimit,
    pagination,
    openAceptModal,
    setOpenAcceptModal,
    openRejectModal,
    setOpenRejectModal,
    selectedData,
    handleClickConfirmAcceptOffer,
    handleClickConfirmRejectOffer,
  } = usePoolOfferListTable();

  useEffect(() => {
    fetchDataList(postId);
  }, []);

  const renderTableRows = () => {
    if (!dataList || dataList.length === 0) return <NoDataTable />;
    return (
      <React.Fragment>
        {dataList.map((data) => {
          return (
            <TableRow key={data.id}>
              <TableCell className="w-[20%] text-sm break-words">
                {data.offerFrom.name}
              </TableCell>
              <TableCell className="w-[20%] text-sm break-words">
                {data.post.jobDetail.truckSize}
              </TableCell>
              <TableCell className="w-[20%] text-sm break-words">
                {data.post.jobDetail.truckQuantity}
              </TableCell>
              <TableCell className="w-[20%] text-sm break-words">
                {data.offeringPrice}
              </TableCell>
              <TableCell className="w-[20%] text-sm break-words">
                <div className="flex items-center">
                  <div className="w-1/2">
                    <Button
                      variant="ghost"
                      onClick={() => handleAcceptOffer(data)}
                    >
                      <Icons name="CheckCircleOutline" />
                      <p className="text-sm text-primary-oxley-green-01">
                        ยืนยัน
                      </p>
                    </Button>
                  </div>
                  <div className="w-1/2">
                    <Button
                      variant="ghost"
                      onClick={() => handleRejectOffer(data)}
                    >
                      <Icons name="CloseCircleDangerOutline" />
                    </Button>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </React.Fragment>
    );
  };
  return (
    <React.Fragment>
      <div className="flex flex-col gap-3 ">
        <HeaderWithBackStep
          onClick={handleClickBackStep}
          title={getSelectedPool()?.subject || ""}
        />
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
                        onClick={() =>
                          sortable && key && handleSort(key as any)
                        }
                      />
                    )}
                  </TableHead>
                ))}
              </TableRowHead>
            </TableHeader>
            <TableBody>{renderTableRows()}</TableBody>
          </Table>
          <ControlledPaginate
            configPagination={{
              page: pagination?.page || 1,
              limit: pagination?.limit || 10,
              totalPages: pagination?.totalPages || 0,
              total: pagination?.total || 0,
            }}
            setPage={handleChangePage}
            setLimit={handleChangeLimit}
            setPageAfterSetLimit={false}
            className="bg-white rounded-lg p-4 shadow-table"
          />
        </div>
      </div>
      <ModalNotification
        open={openAceptModal}
        setOpen={setOpenAcceptModal}
        title="ยืนยันเสนอราคา"
        description={"คุณต้องการรัการเสนอราคานี้หรือไม่?"}
        description2="กรุณาตรวจสอบรายละเอียดข้อเสนอของคุณให้แน่ใจ"
        buttonText="ยืนยัน"
        isConfirmOnly={false}
        icon={<Icons name="DialogInfo" className="w-16 h-16" />}
        onConfirm={() => {
          handleClickConfirmAcceptOffer(
            selectedData!.id,
            selectedData!.post.id
          );
        }}
      />
      <ModalNotification
        open={openRejectModal}
        setOpen={setOpenRejectModal}
        title="ยืนยันการปฏิเสธข้อเสนอราคา"
        description={"คุณกำลังปฏิเสธข้อเสนอราคา"}
        description2="กรุณาตรวจสอบให้แน่ใจว่าคุณต้องการดำเนินการต่อ"
        buttonText="ยืนยัน"
        isConfirmOnly={false}
        isDelete
        icon={<Icons name="DialogDelete" className="w-16 h-16" />}
        onConfirm={() => {
          handleClickConfirmRejectOffer(selectedData!.id);
        }}
      />
    </React.Fragment>
  );
}
