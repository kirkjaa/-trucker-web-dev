"use client";

import React, { useEffect } from "react";
import clsx from "clsx";

import useSystemUserListTable from "../hooks/useSystemUserListTable";

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
import ProfileModal from "@/app/components/ui/featureComponents/ProfileModal";
import ModalNotification from "@/app/components/ui/ModalNotification";
import { ControlledPaginate } from "@/app/components/ui/pagination/ControlledPagination";
import { Icons } from "@/app/icons";
import { useUserStore } from "@/app/store/user/userStore";
import { EAdminPathName } from "@/app/types/enum";
import formatFullName from "@/app/utils/formatFullName";
import formatPhoneNumber from "@/app/utils/formatPhoneNumber";

export default function SystemUsersListTable() {
  // Global State
  const { allUserByTypeId, getUserParams } = useUserStore((state) => ({
    allUserByTypeId: state.allUserByTypeId,
    getUserParams: state.getUserParams,
  }));

  // Hook
  const {
    headerList,
    handleSort,
    pathName,
    fetchDataList,
    handleClickViewIcon,
    handleClickEditIcon,
    dataById,
    openModal,
    setOpenModal,
    sorting,
    // handleSelectListId,
    // selectedListId,
    handleChangePage,
    handleChangeLimit,
    handleClickBinIcon,
    openDeleteModal,
    setOpenDeleteModal,
    selectedData,
    handleClickConfirmDelete,
    // setSelectedListId,
  } = useSystemUserListTable();

  // Use Effect
  useEffect(() => {
    fetchDataList();
  }, [pathName, sorting]);

  const renderTableRows = () => {
    if (!allUserByTypeId || allUserByTypeId.length === 0)
      return <NoDataTable />;

    return (
      <>
        {allUserByTypeId.map((data) => {
          return (
            <TableRow key={data.id}>
              {/* <TableCell className="w-[4%] text-sm">
                <Checkbox
                  checked={selectedListId.includes(data)}
                  onCheckedChange={(checked: boolean) =>
                    handleSelectListId(data, checked)
                  }
                />
              </TableCell> */}
              <TableCell className="w-[15%] text-sm break-words">
                {data.organization.name}
              </TableCell>
              <TableCell className="w-[12%] text-sm break-words">
                {data.display_code}
              </TableCell>
              <TableCell className="w-[18%] text-sm break-words">
                {formatFullName(data.first_name, data.last_name)}
              </TableCell>
              <TableCell className="w-[12%] text-sm break-words">
                {data.username}
              </TableCell>
              <TableCell className="w-[14%] text-sm break-words">
                {data?.phone && formatPhoneNumber(data?.phone)}
              </TableCell>
              <TableCell className="w-[20%] text-sm break-words">
                {data.email}
              </TableCell>
              <TableCell className="w-[10%] flex gap-3 text-base font-medium">
                <Icons
                  name="ShowPassword"
                  className="w-6 h-6 cursor-pointer"
                  onClick={() => handleClickViewIcon(data.id)}
                />
                <Icons
                  name="Pen"
                  className="w-6 h-6 cursor-pointer"
                  onClick={() => handleClickEditIcon(data.id)}
                />
                <Icons
                  name="Bin"
                  className="w-6 h-6 cursor-pointer text-red-500"
                  onClick={() => handleClickBinIcon(data)}
                />
              </TableCell>
            </TableRow>
          );
        })}
      </>
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
            page: getUserParams().page,
            limit: getUserParams().limit,
            totalPages: getUserParams().totalPages,
            total: getUserParams().total,
          }}
          setPage={handleChangePage}
          setLimit={handleChangeLimit}
          setPageAfterSetLimit={false}
          className="bg-white rounded-lg p-4 shadow-table"
        />
      </div>
      <ProfileModal
        open={openModal}
        setOpen={setOpenModal}
        fullName={formatFullName(dataById?.first_name, dataById?.last_name)}
        imageUrl={dataById?.image_url}
        email={dataById?.email}
        phone={dataById?.phone && formatPhoneNumber(dataById?.phone)}
        display={
          pathName.includes(EAdminPathName.SYSTEMUSERSCOMPANIES)
            ? "บริษัท"
            : "โรงงาน"
        }
        displayData={dataById?.organization && dataById?.organization.name}
      />
      <ModalNotification
        open={openDeleteModal}
        setOpen={setOpenDeleteModal}
        title={`คุณต้องการลบผู้ใช้${pathName.includes(EAdminPathName.SYSTEMUSERSCOMPANIES) ? "บริษัท" : "โรงงาน"}`}
        description={`คุณต้องการลบผู้ใช้ #${selectedData?.first_name} หรือไม่?`}
        description2="เมื่อลบจะไม่สามารถกู้คืนได้และข้อมูลทั้งหมดจะถูกลบอย่างถาวร"
        buttonText="ยืนยัน"
        isConfirmOnly={false}
        isDelete
        icon={<Icons name="DialogDelete" className="w-16 h-16" />}
        onConfirm={handleClickConfirmDelete}
      />
    </React.Fragment>
  );
}
