import React from "react";

import SystemUsersForm from "@/app/features/admin/system-users/components/SystemUsersForm";

export default async function Page({
  params,
}: {
  params: Promise<{ companiesId: string }>;
}) {
  const companiesId = (await params).companiesId;
  return (
    <SystemUsersForm title="แก้ไขผู้ใช้ระบบ (บริษัท)" companyId={companiesId} />
  );
}
