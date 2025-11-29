import React from "react";

import UsersPositionForm from "@/app/features/users/position/components/UsersPositionForm";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  return <UsersPositionForm title="แก้ไขตำแหน่งงาน" id={id} />;
}
