"use client";

import React, { useEffect } from "react";

import useNotification from "../hooks/useNotification";

import HeaderWithBackStep from "@/app/components/ui/featureComponents/HeaderWithBackStep";

type NotificationDetailProps = {
  id: string;
};

export default function NotificationDetail({ id }: NotificationDetailProps) {
  const { fetchDataList, handleBack, dataDetail } = useNotification();
  useEffect(() => {
    fetchDataList(id);
  }, [id]);
  return (
    <div className="flex flex-col gap-3 ">
      <HeaderWithBackStep
        onClick={handleBack}
        iconTitle="Bell"
        title={dataDetail?.subject || ""}
      />
      <div className="bg-modal-01 px-5 py-3 rounded-lg flex justify-start items-start min-h-60">
        <div className="text-sm  flex gap-2">
          <p className="text-secondary-indigo-main ">{dataDetail?.subject}</p>
        </div>
      </div>
    </div>
  );
}
