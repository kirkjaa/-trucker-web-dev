"use client";

import React, { useEffect } from "react";
import clsx from "clsx";

import { useOrganizationStore } from "../../../../store/organization/organizationStore";
import FactoriesAndCompaniesLatLngModal from "../../components/FactoriesAndCompaniesLatLngModal";
import useFactoriesAndCompaniesListTable from "../hook/useFactoriesAndCompaniesListTable";

import AddAdminUserModal from "./AddAdminUserModal";
import FactoriesAndCompaniesModal from "./FactoriesAndCompaniesModal";

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
import { EAdminPathName } from "@/app/types/enum";
import formatPhoneNumber from "@/app/utils/formatPhoneNumber";

export default function FactoriesAndComponiesListTable() {
  // Global State
  const { organizations, getOrganizationParams } = useOrganizationStore(
    (state) => ({
      organizations: state.organizations,
      getOrganizationParams: state.getOrganizationParams,
    })
  );

  // Hook
  const {
    factorysList,
    openDeleteModal,
    setOpenDeleteModal,
    selectedOrg,
    handleClickBinIcon,
    handleClickEditIcon,
    // handleSelectListId,
    headerList,
    handleSort,
    // handleClickAddUserAdmin,
    openDetailModal,
    setOpenDetailModal,
    handleClickViewIcon,
    pathName,
    openModal,
    setOpenModal,
    handleSearchAdminUser,
    fetchDataList,
    allUserAdminList,
    // selectedListId,
    // setSelectedListId,
    handleClickConfirmDelete,
    openLatLngModal,
    setOpenLatLngModal,
    handleChangeLimit,
    handleChangePage,
    // setSelectedCompanyListId,
    // setSelectedFactoryListId,
    // dataList,
    handleClickOpenLatLngModal,
    companiesList,
    setDataList,
    sorting,
    selectedData,
    handleClickAddAdminUser,
    getCoinsByTruckerData,
    // setAllUserAdminList,
    dataById,
  } = useFactoriesAndCompaniesListTable();

  //Use Effect
  useEffect(() => {
    fetchDataList();
    // setSelectedListId([]);
    // setSelectedCompanyListId([]);
    // setSelectedFactoryListId([]);
  }, [pathName, sorting]);

  useEffect(() => {
    const isCompany = pathName.includes(EAdminPathName.COMPANIES);
    const data = isCompany ? companiesList : factorysList;
    setDataList(data || []);
  }, [factorysList, companiesList]);

  const renderTableRows = () => {
    if (!organizations || organizations.length === 0) return <NoDataTable />;

    return (
      <React.Fragment>
        {organizations.map((data) => (
          <TableRow key={data.id}>
            {/* <TableCell className="w-[4%]">
              <Checkbox
              // checked={selectedListId.includes(data)}
              // onCheckedChange={(checked: boolean) => {
              //   handleSelectListId(data, checked);
              // }}
              />
            </TableCell> */}
            <TableCell className="w-[15%] text-sm break-words">
              {data.display_code}
            </TableCell>
            <TableCell className="w-[14%] text-sm break-words">
              {data.name}
            </TableCell>
            {/* // TODO: Owner User  */}
            <TableCell className="w-[12%] text-sm break-words">
              {/* {!data.admin ? (
                <Button
                  variant="main"
                  onClick={() => handleClickAddUserAdmin(data)}
                >
                  + เพิ่มผู้ดูแล
                </Button>
              ) : (
                data.admin.fullName
              )} */}
              ผู้ดูแล
            </TableCell>
            <TableCell className="w-[15%] text-sm break-words">
              Package
            </TableCell>
            <TableCell className="w-[12%] text-sm break-words">
              {formatPhoneNumber(data.phone)}
            </TableCell>
            <TableCell className="w-[18%] text-sm break-words">
              {data.email}
            </TableCell>
            <TableCell className="w-[14%] text-sm cursor-pointer">
              <div
                onClick={() => handleClickOpenLatLngModal(data)}
                className="text-secondary-caribbean-green-main cursor-pointer"
              >
                <p className="flex items-center">
                  ดูพิกัดสถานที่
                  <span>
                    <Icons
                      name="ChevronRight"
                      className="w-6 h-6 cursor-pointer"
                    />
                  </span>
                </p>
              </div>
            </TableCell>
            <TableCell className="w-[10%] flex gap-3">
              <Icons
                name="ShowPassword"
                className="w-6 h-6 cursor-pointer"
                onClick={() => handleClickViewIcon(data.id)}
              />
              <Icons
                name="Pen"
                className="w-6 h-6 cursor-pointer"
                onClick={() => {
                  handleClickEditIcon(data.id);
                }}
              />
              <Icons
                name="Bin"
                className="w-6 h-6 cursor-pointer text-red-500"
                onClick={() => {
                  handleClickBinIcon(data);
                }}
              />
            </TableCell>
          </TableRow>
        ))}
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
            page: getOrganizationParams().page,
            limit: getOrganizationParams().limit,
            totalPages: getOrganizationParams().totalPages,
            total: getOrganizationParams().total,
          }}
          setPage={handleChangePage}
          setLimit={handleChangeLimit}
          setPageAfterSetLimit={false}
          className="bg-white rounded-lg p-4 shadow-table"
        />
      </div>

      <AddAdminUserModal
        onSubmit={handleClickAddAdminUser}
        open={openModal}
        setOpen={setOpenModal}
        title="เพิ่มผู้ดูแล"
        userAdminList={allUserAdminList}
        onClickSearch={(val) => handleSearchAdminUser(val)}
      />
      <FactoriesAndCompaniesModal
        open={openDetailModal}
        setOpen={setOpenDetailModal}
        data={dataById}
        transactionCoins={getCoinsByTruckerData()!}
      />
      <FactoriesAndCompaniesLatLngModal
        lattitude={
          selectedData?.addresses[0].latitude
            ? selectedData?.addresses[0].latitude.toString()
            : ""
        }
        longitude={
          selectedData?.addresses[0].longitude
            ? selectedData?.addresses[0].longitude.toString()
            : ""
        }
        open={openLatLngModal}
        setOpen={setOpenLatLngModal}
      />
      <ModalNotification
        open={openDeleteModal}
        setOpen={setOpenDeleteModal}
        title={`ยืนยันการลบ${pathName.includes(EAdminPathName.FACTORIES) ? "โรงงาน" : "บริษัท"}`}
        description={`คุณต้องการลบ${pathName.includes(EAdminPathName.FACTORIES) ? "โรงงาน" : "บริษัท"} #${selectedOrg?.name} หรือไม่?`}
        description2="เมื่อลบจะไม่สามารถกู้คืนได้และข้อมูลทั้งหมดจะถูกลบอย่างถาวร"
        buttonText="ยืนยัน"
        isConfirmOnly={false}
        isDelete
        icon={<Icons name="DialogDelete" className="w-16 h-16" />}
        onConfirm={() => {
          handleClickConfirmDelete(selectedOrg!.id);
        }}
      />
    </React.Fragment>
  );
}
