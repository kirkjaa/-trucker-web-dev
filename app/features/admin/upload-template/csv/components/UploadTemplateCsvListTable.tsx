"use client";

import React, { useEffect } from "react";
import clsx from "clsx";

import useUploadTemplateCsvListTable from "../hooks/useUploadTemplateCsvListTable";

import UploadTemplateCsvModal from "./UploadTemplateCsvModal";
import UploadTemplateCsvModalDetail from "./UploadTemplateCsvModalDetail";
import UploadTemplateCsvViewModal from "./UploadTemplateCsvViewModal";

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
import ModalNotification from "@/app/components/ui/ModalNotification";
import { ControlledPaginate } from "@/app/components/ui/pagination/ControlledPagination";
import { Icons } from "@/app/icons";
import { useTemplateStore } from "@/app/store/template/templateStore";

export default function UploadTemplateCsvListTable() {
  // Global State
  const { templates, getTemplateParams } = useTemplateStore((state) => ({
    templates: state.templates,
    getTemplateParams: state.getTemplateParams,
  }));

  // Hook
  const {
    headerList,
    handleSort,
    fetchDataList,
    getOpenModalUploadTemplateCsv,
    setOpenModalUploadTemplateCsv,
    handleClickImport,
    fileInputRef,
    handleFileUpload,
    getUploadTemplateCsvDetailData,
    getOpenModalUploadTemplateCsvDetail,
    setOpenModalUploadTemplateCsvDetail,
    handleClickConfirm,
    // dataList,
    openViewModal,
    setOpenViewModal,
    handleClickViewIcon,
    handleClickBinIcon,
    handleClickConfirmDelete,
    openDeleteModal,
    setOpenDeleteModal,
    selectedData,
    hamdleClickEditIcon,
    handleChangePage,
    handleChangeLimit,
    // pagination,
    // handleSelectListId,
    // selectedListData,
    getUploadTemplateCsvList,
    setDataList,
    sorting,
    dataById,
  } = useUploadTemplateCsvListTable();

  useEffect(() => {
    fetchDataList();
  }, [sorting]);

  useEffect(() => {
    setDataList(getUploadTemplateCsvList() || []);
  }, [getUploadTemplateCsvList()]);

  const renderTableRows = () => {
    if (!templates || templates.length === 0) return <NoDataTable />;

    return (
      <React.Fragment>
        {templates.map((data) => {
          return (
            <TableRow key={data.id}>
              {/* <TableCell className="w-[6%] text-sm"> */}
              {/*   <Checkbox */}
              {/*     checked={selectedListData.includes(data)} */}
              {/*     onCheckedChange={(checked: boolean) => { */}
              {/*       handleSelectListId(data, checked); */}
              {/*     }} */}
              {/*   /> */}
              {/* </TableCell> */}
              <TableCell className="w-[78%] text-sm">
                {`${data.organization.display_code} - ${data.organization.name} - ${data.template_type.toLowerCase().charAt(0).toUpperCase() + data.template_type.toLowerCase().slice(1)}`}
              </TableCell>
              <TableCell className="w-[16%] flex gap-3 text-base font-medium">
                <Icons
                  name="ShowPassword"
                  className="w-6 h-6 cursor-pointer"
                  onClick={() => handleClickViewIcon(data.id)}
                />
                <Icons
                  name="Pen"
                  className="w-6 h-6 cursor-pointer"
                  onClick={() => hamdleClickEditIcon(data.id)}
                />
                <Icons
                  name="Bin"
                  className="w-6 h-6 cursor-pointer"
                  onClick={() => handleClickBinIcon(data)}
                />
              </TableCell>
            </TableRow>
          );
        })}
      </React.Fragment>
    );
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
                  className={`w-[${width}] text-sm flex items-center gap-1`}
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
        <ControlledPaginate
          configPagination={{
            page: getTemplateParams().page,
            limit: getTemplateParams().limit,
            totalPages: getTemplateParams().totalPages,
            total: getTemplateParams().total,
          }}
          setPage={handleChangePage}
          setPageAfterSetLimit={false}
          setLimit={handleChangeLimit}
          className="bg-white rounded-lg p-4 shadow-table"
        />
      </div>
      <UploadTemplateCsvModal
        title="อัพโหลด Template CSV"
        open={getOpenModalUploadTemplateCsv()}
        setOpen={setOpenModalUploadTemplateCsv}
        handleClick={handleClickImport}
      />
      <UploadTemplateCsvModalDetail
        title="รายการนำเข้าข้อมูล"
        headerList={getUploadTemplateCsvDetailData()?.header}
        dataList={getUploadTemplateCsvDetailData()?.data}
        setOpen={setOpenModalUploadTemplateCsvDetail}
        open={getOpenModalUploadTemplateCsvDetail()}
        onClickConfirm={handleClickConfirm}
      />
      <UploadTemplateCsvViewModal
        open={openViewModal}
        setOpen={setOpenViewModal}
        data={dataById}
      />
      <ModalNotification
        open={openDeleteModal}
        setOpen={setOpenDeleteModal}
        title="ยืนยันการลบบริษัท"
        description={`คุณต้องการลบ #${selectedData?.organization.name} หรือไม่?`}
        description2="เมื่อลบจะไม่สามารถกู้คืนได้และข้อมูลทั้งหมดจะถูกลบอย่างถาวร"
        buttonText="ยืนยัน"
        isConfirmOnly={false}
        isDelete
        icon={<Icons name="DialogDelete" className="w-16 h-16" />}
        onConfirm={() => {
          handleClickConfirmDelete(selectedData?.id ?? 0);
        }}
      />
      <input
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        ref={fileInputRef}
        className="hidden"
      />
    </React.Fragment>
  );
}
