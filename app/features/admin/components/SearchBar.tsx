"use client";

import React from "react";
import { useTranslations } from "next-intl";

import useSearchBarAdmin from "../hooks/useSearchBarAdmin";
import useCreateRouteModal from "../route/hooks/useCreateRouteModal";

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import ModalNotification from "@/app/components/ui/ModalNotification";
import { Icons } from "@/app/icons";
import { EAdminPathName } from "@/app/types/enum";

export default function SearchBar() {
  // Global State
  // const getOrganizationParams = useOrganizationStore(
  //   (state) => state.getOrganizationParams
  // );
  // const getUserParams = useUserStore((state) => state.getUserParams);

  // Translations
  const t = useTranslations("common");

  // Hook
  const {
    handleClickCreate,
    search,
    setSearch,
    getSelectedListId,
    dataCount,
    handleClickConfirmDelete,
    selectedListId,
    openModalDeleteList,
    setOpenModalDeleteList,
    onClickDeleteList,
    // handleCheckSearchKey,
    pathName,
    // getFactoriesParams,
    // getCompaniesParams,
    // companiesList,
    // factorysList,
    handleClearFilter,
    // systemUsersFactoryList,
    // systemUsersCompanyList,
    // driversData: _driversData,
    visibleBtnPlus,
    // setVisibleBtnPlus,
    visibleBtnFilter,
    // setVisibleBtnFilter,
    // getDriversData,
    btnPlusText,
    // setBtnPlusText,
    /* getRouteList, */
    /* getFormCreate, */
    visibleBtnIconPlus,
    // setVisibleBtnIconPlus,
    // getUploadTemplateCsvList,
    visibleBtnAddRoute,
    // setVisibleBtnAddRoute,
    handleClickOpenModalCreateRoute,
    visibleImportCsv,
    // setVisibleImportCsv,
    // setVisibleDowloadTemplate,
    visibleDowloadTemplate,
    handleDownloadTemplate,
    // getPackagesListData,
    // optionSearch,
    // setOptionSearch,
    // getOptionSearchFactory,
    // searchKey,
    // setSearchKey,
    // getOptionSearchCompany,

    // getOptionSearchSystemUsersFactory,
    // getOptionSearchSystemUsersCompany,
    // getOptionSearchSystemUsersDriver,
    // getOptionSearchPackage,
    // getOptionSearchUploadTemplateCsv,
    // getSystemUserCompanyParams,
    // getSystemUserFactoryParams,
    // getDriversParams,
    // getRouteParams,
    // getUploadTemplateCsvParams,
    // getPackageParams,
    // handleClearSearch,
  } = useSearchBarAdmin();
  const { handleSetFormType, handleFileUpload, fileInputRef } =
    useCreateRouteModal();

  return (
    <React.Fragment>
      <div className="flex justify-between items-center bg-neutral-01 px-5 py-4 rounded-xl">
        <div className="flex">
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="dropdownMenu">
                <p>ทุกหมวดหมู่</p>
                <Icons name="ChevronDown" className="w-6 h-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80">
              <DropdownMenuLabel className="flex justify-between items-center">
                <p className="button">ตัวกรอง</p>
                <Button
                  variant="ghost"
                  className="text-primary-blue-main"
                  onClick={handleClearSearch}
                >
                  ล้างทั้งหมด
                </Button>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {optionSearch.map((item) => (
                <React.Fragment key={item}>
                  <DropdownMenuCheckboxItem
                    checked={searchKey.findIndex((key) => key === item) !== -1}
                    onCheckedChange={() => handleCheckSearchKey(item)}
                  >
                    <p className="body2">
                      {searchKeyLabels[item as ESearchKey]}
                    </p>
                  </DropdownMenuCheckboxItem>
                </React.Fragment>
              ))}
            </DropdownMenuContent>
          </DropdownMenu> */}

          <Input
            value={search}
            className="h-11 w-full rounded-3xl border-neutral-04"
            placeholder={t("search")}
            onChange={(e) => setSearch(e.target.value)}
          />
          {/* <Button className="rounded-l-none" onClick={handleSearch}>
            <Icons name="Search" className="w-6 h-6" />
          </Button> */}
        </div>
        <div className="flex items-center gap-4">
          <p className="">
            {t("results")} {dataCount} {t("items")}
          </p>
          {visibleDowloadTemplate && (
            <Button
              variant="main-light"
              disabled
              onClick={handleDownloadTemplate}
            >
              <Icons name="CsvFile" className="w-6 h-6" />
              {t("downloadTemplate")}
            </Button>
          )}
          {visibleImportCsv && (
            <Button
              variant="filter"
              onClick={() => handleSetFormType("import")}
            >
              <Icons name="PaperUpload" className="w-6 h-6" />
              {t("importCsv")}
            </Button>
          )}
          {visibleBtnAddRoute && (
            <Button variant="filter" onClick={handleClickOpenModalCreateRoute}>
              <Icons name="Plus" className="w-4 h-6" />
              {t("addRouteCode")}
            </Button>
          )}
          {visibleBtnFilter && (
            <Button variant="filter" onClick={handleClearFilter}>
              <Icons name="Filter" className="w-6 h-6" />
              <p>{t("showAll")}</p>
            </Button>
          )}

          {getSelectedListId().length > 0 && (
            <Button onClick={onClickDeleteList} className="bg-red-500">
              <Icons name="Bin" className="w-6 h-6" />
              <p>
                {t("delete")} {getSelectedListId().length} {t("items")}
              </p>
            </Button>
          )}
          {visibleBtnPlus &&
            (pathName.includes(EAdminPathName.INTERNATIONALROUTE) &&
            !pathName.includes("create") ? (
              <React.Fragment>
                <Button onClick={handleClickCreate}>
                  {visibleBtnIconPlus && (
                    <Icons name="Plus" className="w-4 h-6" />
                  )}
                  <p>{btnPlusText}</p>
                </Button>
                {/* <Button onClick={handleClickCreate}>
                  {visibleBtnIconPlus && (
                    <Icons name="Plus" className="w-4 h-6" />
                  )}
                  <p>{btnPlusText} (ไม่เต็มตู้)</p>
                </Button> */}
              </React.Fragment>
            ) : (
              <Button onClick={handleClickCreate}>
                {visibleBtnIconPlus && (
                  <Icons name="Plus" className="w-4 h-6" />
                )}
                <p>{btnPlusText}</p>
              </Button>
            ))}
        </div>
      </div>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        ref={fileInputRef}
        className="hidden"
      />
      <ModalNotification
        open={openModalDeleteList}
        setOpen={setOpenModalDeleteList}
        title={t("confirmDeleteCompany")}
        description={`${t("delete")} #${selectedListId.map((item) => item.name).join(", ")}?`}
        description2={t("deleteWarning")}
        buttonText={t("confirm")}
        isConfirmOnly={false}
        isDelete
        icon={<Icons name="DialogDelete" className="w-16 h-16" />}
        onConfirm={() => {
          handleClickConfirmDelete(selectedListId.map((item) => item.id));
        }}
      />
    </React.Fragment>
  );
}
