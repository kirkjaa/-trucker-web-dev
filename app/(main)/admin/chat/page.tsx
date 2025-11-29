import React from "react";

import ChatRender from "@/app/features/admin/chat/Index";

// Force dynamic rendering to avoid build-time URL errors
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function Page() {
  return <ChatRender />;
}
