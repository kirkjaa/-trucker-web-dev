/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useEffect } from "react";

import usePackageListTable from "../hooks/usePackageListTable";

import PackageActiveModal from "./PackageActiveModal";

import { Button } from "@/app/components/ui/button";
import { EPackagesType } from "@/app/types/enum";

export default function PackageListTable() {
  const {
    fetchDataList,
    openActiveModal,
    setOpenActiveModal,
    dataList,
    handleClickSelectPackage,
    handleConfirmActive,
    selectedData,
  } = usePackageListTable();

  useEffect(() => {
    fetchDataList();
  }, []);

  return (
    <React.Fragment>
      <div className="w-full overflow-x-auto">
        <div
          className="min-w-[800px] grid"
          style={{
            gridTemplateColumns: `200px repeat(${dataList.length}, minmax(200px, 1fr))`,
          }}
        >
          {/* Header */}
          <div className="p-4 bg-white"></div>
          {dataList.map((data) => (
            <div key={data.id} className="text-center p-4 bg-gray-100">
              <p className="title3">{data.name}</p>
              <p className="text-primary-oxley-green-main text-sm mt-2">
                {data.duration.value} {data.duration.unit}
              </p>
            </div>
          ))}

          {/* Price Row */}
          <div className="p-4 bg-white">ราคาแพ็กเกจ</div>
          {dataList.map((data) => (
            <div key={data.id} className="text-center bg-primary-blue-02 p-4">
              <span className="text-primary-oxley-green-main font-bold text-lg">
                {data.price}
              </span>{" "}
              เหรียญ
            </div>
          ))}

          {/* Select Row */}
          <div className="p-4 bg-white">เลือกแพ็กเกจ</div>
          {dataList.map((data) => (
            <div key={data.id} className="text-center bg-primary-blue-02 p-4">
              <Button
                onClick={() => handleClickSelectPackage(data)}
                className="text-sm w-full max-w-[180px] mx-auto"
              >
                อัพเกรดเป็นระดับมืออาชีพ
              </Button>
            </div>
          ))}
        </div>
      </div>

      <PackageActiveModal
        onSubmit={handleConfirmActive}
        open={openActiveModal}
        setOpen={setOpenActiveModal}
        packageType={selectedData?.type}
        price={selectedData?.price}
      />
    </React.Fragment>
  );
}
