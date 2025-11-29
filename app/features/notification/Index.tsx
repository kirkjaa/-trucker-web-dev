"use client";

import React from "react";

import NotificationPanel from "./components/NotificationPanel";

import Header from "@/app/components/ui/featureComponents/Header";

export default function NotificationRender() {
  return (
    <div className="flex flex-col gap-4">
      <Header icon="Bell" title="การแจ้งเตือน" />
      <NotificationPanel />
    </div>
  );
}
