"use client";

import React, { useEffect } from "react";
import { clsx } from "clsx";

import useUploadTemplateCsvForm from "../hooks/useUploadTemplateCsvForm";

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
import { Input } from "@/app/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Icons } from "@/app/icons";
import { useTemplateStore } from "@/app/store/template/templateStore";

type UploadTemplateCsvFormProps = {
  id?: string;
};
export default function UploadTemplateCsvForm({
  id,
}: UploadTemplateCsvFormProps) {
  // Global State
  const getUploadTemplateCsvDetailData = useTemplateStore(
    (state) => state.getUploadTemplateCsvDetailData
  );

  // Hook
  const {
    optionFactory,
    organizationId,
    setOrganizationId,
    fetchOptionFactory,
    fetchTemplateField,
    templateFields,
    selectedTemplateType,
    setSelectedTemplateType,
    headerList,
    onMappedColumnsChange,
    onClickConfirm,
    fetchFormById,
    searchOption,
    setSearchOption,
    mappedColumns,
    setMappedColumns,
  } = useUploadTemplateCsvForm();

  // Use Effect
  useEffect(() => {
    fetchOptionFactory();
  }, [searchOption]);

  useEffect(() => {
    if (selectedTemplateType) {
      fetchTemplateField(selectedTemplateType);
    }
  }, [selectedTemplateType]);

  useEffect(() => {
    if (!id && templateFields.length > 0) {
      setMappedColumns([]);
    }
  }, []);

  /* useEffect(() => { */
  /*   setValue("mappedColumns", selectedColumns); */
  /* }, [selectedColumns]); */
  /**/
  /* useEffect(() => { */
  /*   setValue("customerColumns", getUploadTemplateCsvDetailData()?.header); */
  /* }, [getUploadTemplateCsvDetailData()]); */
  /**/
  /* useEffect(() => { */
  /*   setValue("factoryId", factoryId); */
  /*   if (factoryId) { */
  /*     onFactoryIdChange(factoryId); */
  /*   } */
  /* }, [factoryId]); */

  useEffect(() => {
    if (id) {
      fetchFormById(id).then(() => {
        if (selectedTemplateType) {
          fetchTemplateField(selectedTemplateType);
        }
      });
    }
  }, [id]);

  const renderTableRows = () => {
    const headers = id
      ? mappedColumns
      : (getUploadTemplateCsvDetailData()?.header ?? []);

    return headers.map((match_field, index) => {
      const actualMatchField =
        typeof match_field === "string" ? match_field : match_field.match_field;

      const selected = mappedColumns.find(
        (col) => col.match_field === actualMatchField
      );
      const selectedFieldId = selected?.field_id?.toString();

      return (
        <TableRow key={index}>
          <TableCell className="w-[18%] text-sm">Column {index + 1}</TableCell>
          <TableCell className="w-[18%] text-sm">
            {typeof match_field === "string"
              ? match_field
              : match_field.match_field}
          </TableCell>
          <TableCell className="w-[10%] text-sm">
            <div className="flex justify-center items-center">
              <Icons name="DoubleChevronRightGreen" className="w-10 h-10" />
            </div>
          </TableCell>
          <TableCell className="w-[18%] text-sm">
            <Select
              value={selectedFieldId}
              onValueChange={(val) => {
                onMappedColumnsChange(
                  Number(val),
                  typeof match_field === "string"
                    ? match_field
                    : match_field.match_field
                );
              }}
            >
              <SelectTrigger className="py-2 px-5 bg-white border-neutral-03">
                <SelectValue placeholder="กรุณาเลือก" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {templateFields?.map((item) => (
                    <SelectItem key={item.id} value={item.id.toString()}>
                      {item.field_name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </TableCell>
          <TableCell className="w-[18%] text-sm"></TableCell>
        </TableRow>
      );
    });
  };

  return (
    <React.Fragment>
      <div className="flex justify-between items-center bg-modal-01 px-5 py-4 rounded-xl h-18">
        <div className="w-full flex justify-between items-center ">
          <div>
            <p className="title3 text-login-01">อัพโหลด Template (.csv)</p>
          </div>
          <div className="">
            <Button onClick={onClickConfirm}>
              <p>บันทึกข้อมูล</p>
            </Button>
          </div>
        </div>
      </div>
      <div className=" border-2 shadow-card border-neutral-02  rounded-lg">
        <div className="m-2 bg-modal-01 h-22 rounded-lg flex gap-2 p-4">
          <div className="flex flex-col gap-1 w-1/2">
            <p className="text-sm font-semibold text-neutral-08">ชื่อโรงงาน</p>

            <Select
              value={organizationId}
              onValueChange={(val) => {
                setOrganizationId(val);
              }}
            >
              <SelectTrigger
                className={clsx("py-2 px-5 bg-white border-neutral-03", {
                  /* " border-red-500 ": errors.organization_id, */
                })}
              >
                <SelectValue placeholder="กรุณาเลือก" />
              </SelectTrigger>
              <SelectContent>
                <div className="p-2">
                  <Input
                    type="text"
                    placeholder="ค้นหาโรงงาน..."
                    className="w-full rounded-md border text-sm"
                    value={searchOption}
                    onChange={(e) => setSearchOption(e.target.value)}
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
            {/* {errors.organization_id && ( */}
            {/*   <div className="flex gap-2 items-center"> */}
            {/*     <Icons name="ErrorLogin" className="w-4 h-4" /> */}
            {/*     <p className="text-sm text-red-500 text-start pt-1"> */}
            {/*       {errors.organization_id.message} */}
            {/*     </p> */}
            {/*   </div> */}
            {/* )} */}
          </div>

          <div className="flex flex-col gap-1 w-1/2">
            <p className="text-sm font-semibold text-neutral-08">
              ประเภทของ Template
            </p>

            <Select
              value={selectedTemplateType}
              onValueChange={(val) => setSelectedTemplateType(val)}
            >
              <SelectTrigger
                className={clsx("py-2 px-5 bg-white border-neutral-03", {
                  /* " border-red-500 ": errors.template_type, */
                })}
              >
                <SelectValue placeholder="กรุณาเลือก" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem key="RFQ" value="RFQ">
                    สำหรับสร้างใบเสนอราคา
                  </SelectItem>
                  <SelectItem key="ROUTE" value="ROUTE">
                    สำหรับสร้างเส้นทางขนส่ง
                  </SelectItem>
                  <SelectItem key="ORDER" value="ORDER">
                    สำหรับสร้างออเดอร์
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            {/* {errors.template_type && ( */}
            {/*   <div className="flex gap-2 items-center"> */}
            {/*     <Icons name="ErrorLogin" className="w-4 h-4" /> */}
            {/*     <p className="text-sm text-red-500 text-start pt-1"> */}
            {/*       {errors.template_type.message} */}
            {/*     </p> */}
            {/*   </div> */}
            {/* )} */}
          </div>
        </div>
        <div className="p-2">
          <div className="flex flex-col gap-2 w-full">
            <Table>
              <TableHeader>
                <TableRowHead>
                  {headerList.map(({ key, label, width }: any) => (
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
        </div>
      </div>
    </React.Fragment>
  );
}
