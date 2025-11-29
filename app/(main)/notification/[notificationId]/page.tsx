import React from "react";

import NotificationDetail from "@/app/features/notification/components/NotificationDetail";

export default async function Page({
  params,
}: {
  params: Promise<{ notificationId: string }>;
}) {
  const id = (await params).notificationId;
  return <NotificationDetail id={id} />;
}
