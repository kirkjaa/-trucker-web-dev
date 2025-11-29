import React, { useEffect } from "react";
import clsx from "clsx";

import useCreateRouteModal from "../hooks/useCreateRouteModal";

import CreateRouteForm from "./CreateRouteForm";
import CreateRouteImport from "./CreateRouteImport";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import ImportButton from "@/app/components/ui/featureComponents/ImportButton";
import { Input } from "@/app/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { ERouteShippingType, ERouteType } from "@/app/types/enum";
import { IRouteData } from "@/app/types/routesType";

type CreateRouteModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  title: string;
  byShippingType: ERouteShippingType;
  byType: ERouteType;
  typeForm?: "import" | "form";
  idFactory?: string;
  dataForm?: IRouteData;
};

export default function CreateRouteModal({
  open,
  setOpen,
  title,
  byShippingType,
  byType,
  // typeForm,
  // idFactory,
  dataForm,
}: CreateRouteModalProps) {
  // Hook
  const {
    formType,
    setFormType,
    fileInputRef,
    warningImport,
    handleSetFormType,
    onClickCancel,
    disabledImportBtn,
    onFactoryIdChange,
    fetchOptionFactory,
    // setSelectedFactory,
    optionFactory,
    selectedFactory,
    handleFileUpload,
    headerImport,
    dataImport,
    handleClickCreate,
    handleClickImportCsv,
    errorMessage,
    // resetFormState,
    // updateSelectedFactory,
    // getFormCreate,
    // pathName,
    // setWarningImport,
    searchFactory,
    setSearchFactory,
  } = useCreateRouteModal();

  useEffect(() => {
    if (!open) setFormType(undefined);
  }, [open]);

  /* useEffect(() => { */
  /*   resetFormState(); */
  /*   setWarningImport(false); */
  /*   if (!open) { */
  /*     setSearchFactory({ ...searchFactory, search: "" }); */
  /*     setSelectedFactory(undefined); */
  /*     setFormType(undefined); */
  /*     return; */
  /*   } */
  /**/
  /*   fetchOptionFactory(); */
  /*   updateSelectedFactory(idFactory); */
  /*   if (typeForm) setFormType(typeForm); */
  /*   else if (getFormCreate()[0] && pathName.includes("create")) */
  /*     setFormType("form"); */
  /* }, [open]); */

  useEffect(() => {
    fetchOptionFactory();
  }, [searchFactory]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className={clsx({
          "max-w-[600px]": formType === undefined,
          "max-w-[1200px]": formType,
        })}
        outlineCloseButton
      >
        <DialogHeader className="w-full pb-[1rem]">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {!formType ? (
          <React.Fragment>
            <div className="flex flex-col gap-1 w-full">
              <p className="text-sm font-semibold text-neutral-08">
                ชื่อโรงงาน
              </p>

              <Select
                onValueChange={(val) => {
                  onFactoryIdChange(Number(val));
                }}
              >
                <SelectTrigger className="py-2 px-5 bg-white border-neutral-03">
                  <SelectValue placeholder="กรุณาเลือก" />
                </SelectTrigger>
                <SelectContent>
                  <div className="p-2">
                    <Input
                      type="text"
                      placeholder="ค้นหาโรงงาน..."
                      className="w-full rounded-md border text-sm"
                      value={searchFactory}
                      onChange={(e) => setSearchFactory(e.target.value)}
                    />
                  </div>
                  <SelectGroup>
                    {optionFactory &&
                      optionFactory?.map((item) => (
                        <SelectItem key={item.id} value={item.id.toString()}>
                          {item.name}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-5 w-full h-40">
              <ImportButton
                disabled={disabledImportBtn || !selectedFactory}
                icon="ImportCsv"
                title="นำเข้า CSV"
                onClick={() => handleSetFormType("import")}
              />

              <ImportButton
                disabled={!selectedFactory}
                icon="BranchIcon"
                title="กำหนดเอง"
                onClick={() => handleSetFormType("form")}
              />
            </div>
            {warningImport && (
              <p
                className="text-sm text-red-500 cursor-pointer hover:underline"
                onClick={handleClickImportCsv}
              >
                * กรุณาอัพโหลด Template CSV
              </p>
            )}
          </React.Fragment>
        ) : formType === "form" ? (
          <CreateRouteForm
            selectedFactoryId={selectedFactory?.id || 0}
            byShippingType={byShippingType}
            onClickCancel={onClickCancel}
            byType={byType}
            dataForm={dataForm}
          />
        ) : (
          <CreateRouteImport
            headerList={headerImport}
            dataList={dataImport}
            onSubmit={handleClickCreate}
            errorMessage={errorMessage}
          />
        )}
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          ref={fileInputRef}
          className="hidden"
        />
      </DialogContent>
    </Dialog>
  );
}
