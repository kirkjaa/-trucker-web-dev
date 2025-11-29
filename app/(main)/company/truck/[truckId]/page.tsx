import React from "react";

import TruckForm from "@/app/features/truck/components/TruckForm";

export default async function Page({
  params,
}: {
  params: Promise<{ truckId: string }>;
}) {
  const truckId = (await params).truckId;
  return <TruckForm id={truckId} title="แก้ไขข้อมูลรถบรรทุก" icon="Pen" />;
}
