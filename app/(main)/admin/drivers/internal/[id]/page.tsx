import React from "react";

import DriversForm from "@/app/features/admin/drivers/components/DriversForm";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  return <DriversForm title="แก้ไขพนักงานขับรถภายใน" id={id} />;
}
