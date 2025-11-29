"use client";

import React from "react";
import { useRouter } from "next/navigation";

import UploadTemplateCsvForm from "../components/UploadTemplateCsvForm";

import HeaderWithBackStep from "@/app/components/ui/featureComponents/HeaderWithBackStep";
import { EAdminPathName } from "@/app/types/enum";

type CreateUploadTemplateCsvRenderProps = {
  id?: string;
};
export default function CreateUploadTemplateCsvRender({
  id,
}: CreateUploadTemplateCsvRenderProps) {
  const router = useRouter();
  return (
    <div className="flex flex-col gap-4">
      <HeaderWithBackStep
        onClick={() => router.replace(EAdminPathName.UPLOADTEMPLATECSV)}
        iconTitle="SidebarTransport"
        title="อัพโหลด Template CSV"
      />

      <UploadTemplateCsvForm id={id} />
    </div>
  );
}
