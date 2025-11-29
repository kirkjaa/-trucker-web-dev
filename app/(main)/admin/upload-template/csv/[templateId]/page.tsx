import React from "react";

import CreateUploadTemplateCsvRender from "@/app/features/admin/upload-template/csv/create/Index";

export default async function Page({
  params,
}: {
  params: Promise<{ templateId: string }>;
}) {
  const templateId = (await params).templateId;
  return <CreateUploadTemplateCsvRender id={templateId} />;
}
