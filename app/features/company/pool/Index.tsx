"use client";

import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import clsx from "clsx";

import PoolCard from "./components/PoolCard";
import PoolFilter from "./components/PoolFilter";
import PoolFormModal from "./components/PoolFormModal";
import PoolHeaderBar from "./components/PoolHeaderBar";
import PoolOfferModal from "./components/PoolOfferModal";
import usePool from "./hooks/usePool";
import usePoolForm from "./hooks/usePoolForm";

import { Button } from "@/app/components/ui/button";
import { Icons } from "@/app/icons";
import {
  EPoolType,
  ETruckSize,
  poolTypeLabel,
  truckSizeLabel,
} from "@/app/types/enum";

export default function PoolRender() {
  const {
    openModal,
    setOpenModal,
    handleClickCreatePool,
    fetchDataList,
    dataList,
    handleClickOffer,
    openOfferModal,
    setOpenOfferModal,
    selectedData,
    selectedProvinceFilter,
    setSelectedProvinceFilter,
    ePoolType,
    selectedPoolTypeFilter,
    setSelectedPoolTypeFilter,
    selectedTruckSizeFilter,
    setSelectedTruckSizeFilter,
    getPoolParams,
    wFull,
    setWFull,
    handleClickClearFilter,
    handleClickPoolCard,
    pathName,
    getSelectedPoolType,
    getSelectedProvice,
    getSelectedTruckSize,
    setSelectedPoolType,
    setSelectedTruckSize,
    setSelectedProvice,
    defaultPagination,
    hasMore,
    // setPoolListData,
    // setDataList,
  } = usePool();

  const { provinces } = usePoolForm();

  useEffect(() => {
    fetchDataList(
      getSelectedPoolType(),
      getSelectedProvice(),
      getSelectedTruckSize()
    );
  }, []);

  useEffect(() => {
    setSelectedPoolTypeFilter(getSelectedPoolType());
    setSelectedTruckSizeFilter(getSelectedTruckSize());
    setSelectedProvinceFilter(getSelectedProvice());
  }, [getSelectedPoolType(), getSelectedProvice(), getSelectedTruckSize()]);

  const [ref, inView] = useInView();

  useEffect(() => {
    if (inView && hasMore) {
      fetchDataList(
        getSelectedPoolType(),
        getSelectedProvice(),
        getSelectedTruckSize(),
        inView
      );
    }
  }, [inView]);

  return (
    <React.Fragment>
      <div className="flex w-full">
        <PoolHeaderBar onClick={(type) => handleClickCreatePool(type)} />
      </div>
      <div className="w-full flex justify-between p-2">
        <p>โพสต์ทั้งหมด</p>
        <div className="flex items-center">
          <Icons
            name={wFull ? "ListPrimary" : "ListPrimaryOutLine"}
            className="w-4 h-4 cursor-pointer"
            onClick={() => setWFull(!wFull)}
          />
          <p className="ml-2">
            <span className="text-gray-300">|</span> ผลลัทธ์{" "}
            {getPoolParams()?.total} รายการ
          </p>
        </div>
      </div>
      <div className="flex flex-row w-full mt-2">
        <div className="flex flex-col w-1/5 gap-4">
          <p className="mt-4">โพสทั้งหมด</p>
          <p className="title2">ตัวกรอง</p>
          <PoolFilter
            title="จังหวัด"
            options={provinces.map((p) => p.name_th)}
            selectedOptions={getSelectedProvice()}
            setSelectedOptions={setSelectedProvice}
          />
          <PoolFilter
            title="ประเภทงาน"
            options={Object.values(EPoolType).map((p) => p)}
            selectedOptions={getSelectedPoolType()}
            setSelectedOptions={setSelectedPoolType}
            displayMap={poolTypeLabel}
          />
          <PoolFilter
            title="ประเภทรถ"
            options={Object.values(ETruckSize).map((p) => p)}
            selectedOptions={getSelectedTruckSize()}
            setSelectedOptions={setSelectedTruckSize}
            displayMap={truckSizeLabel}
          />
          <div className="flex flex-row w-full gap-4">
            <Button
              onClick={() => {
                fetchDataList(
                  selectedPoolTypeFilter,
                  selectedProvinceFilter,
                  selectedTruckSizeFilter,
                  false,
                  defaultPagination
                );
              }}
            >
              ค้นหา
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                handleClickClearFilter();
              }}
            >
              ล้างค่า
            </Button>
          </div>
          {/* <PoolFilter title="ประเภทงาน" />
          <PoolFilter title="ประเภทรถ" /> */}
        </div>

        <div
          className={clsx(
            "w-[80%] grid overflow-y-auto max-h-[calc(100vh-200px)] pr-2",
            wFull ? "grid-cols-1 gap-y-4" : "grid-cols-3 gap-4"
          )}
        >
          {dataList.map((data) => {
            return (
              <div className={clsx("cursor-pointer")} key={data.id}>
                <PoolCard
                  imageUrl={data.imageUrl}
                  subject={data.subject}
                  description={data.description}
                  type={data.type}
                  onClickOffer={() => handleClickOffer(data)}
                  createdAt={data.createdAt}
                  onClickCard={() =>
                    pathName.includes("market") || pathName.includes("post")
                      ? handleClickPoolCard(data)
                      : null
                  }
                  visibleBinIcon={!pathName.includes("market")}
                  visiblePenIcon={!pathName.includes("market")}
                  visibleOfferBtn={pathName.includes("market")}
                />
              </div>
            );
          })}
          {hasMore && <div ref={ref}></div>}
        </div>
      </div>
      <PoolFormModal
        open={openModal}
        setOpen={setOpenModal}
        type={ePoolType}
        fetchDataList={fetchDataList}
      />
      <PoolOfferModal
        open={openOfferModal}
        setOpen={setOpenOfferModal}
        data={selectedData!}
      />
    </React.Fragment>
  );
}
