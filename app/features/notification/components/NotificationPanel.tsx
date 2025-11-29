"use client";

import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";

import useNotification from "../hooks/useNotification";

import NotificationItem from "./NotificationItem";

import MenuButton from "@/app/components/ui/featureComponents/MenuButton";
export default function NotificationPanel() {
  const {
    fetchDataList,
    dataList,
    handleClickReadNotification,
    currentStep,
    hasMore,
  } = useNotification();
  const [ref, inView] = useInView();

  useEffect(() => {
    fetchDataList();
  }, [currentStep]);

  useEffect(() => {
    if (inView && hasMore) {
      fetchDataList(undefined, inView);
    }
  }, [inView]);
  return (
    <React.Fragment>
      <div className="font-bold text-lg flex gap-10 px-5 text-main-02 border-b mt-8">
        <MenuButton step={1} title="ทั้งหมด" />
        <MenuButton step={2} title="ยังไม่ได้อ่าน" />
      </div>
      <div className="overflow-y-auto h-[calc(160vh-700px)]">
        {dataList &&
          dataList.length > 0 &&
          dataList.map((data) => (
            <div
              key={data.id}
              onClick={() => handleClickReadNotification(data.id)}
            >
              <NotificationItem data={data} />
            </div>
          ))}
        {hasMore && <div ref={ref}></div>}
      </div>
    </React.Fragment>
  );
}
