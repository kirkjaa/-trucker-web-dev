import React from "react";

import SystemUsersForm from "@/app/features/admin/system-users/components/SystemUsersForm";

export default async function page({
  params,
}: {
  params: Promise<{ factoriesId: string }>;
}) {
  const factoriesId = (await params).factoriesId;
  return (
    <SystemUsersForm title="แก้ไขผู้ใช้ระบบ (โรงงาน)" factoryId={factoriesId} />
  );
}
