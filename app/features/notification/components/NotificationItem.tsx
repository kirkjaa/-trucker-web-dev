import React from "react";

import { Icons } from "@/app/icons";
import { INotificationListTable } from "@/app/types/notificationType";

type NotificationItemProps = {
  data: INotificationListTable;
};

export default function NotificationItem({ data }: NotificationItemProps) {
  return (
    <div className="p-4 border-b cursor-pointer hover:border-primary-oxley-green-main hover:border-2 rounded-xl">
      <div className="flex gap-3 align-bottom">
        {!data.isRead && <Icons name="Dot" className="w-4 h-4" />}
        <p className="text-primary-blue-main font-bold">{data.subject}</p>
      </div>
      <div className="flex w-full flex-wrap px-8 py-2">
        <p className="w-[90%]">{data.content}</p>
        <div className="w-[10%] flex justify-end items-center">
          <Icons name="ArrowRight" className="w-4 h-4" />
        </div>
        <div className="w-full mt-4">
          <p className="text-sm">14/01/2025</p>
        </div>
      </div>
    </div>
  );
}
