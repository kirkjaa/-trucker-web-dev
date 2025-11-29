import React from "react";

import { ERouteStatus } from "@/app/types/route/routeEnum";

type Props = {
  status: ERouteStatus;
};

export default function StatusRoute({ status }: Props) {
  return (
    <React.Fragment>
      {status === ERouteStatus.APPROVED ? (
        <div className="flex items-center">
          <div className="w-2 h-2 bg-green-700 rounded-full mr-1"></div>
          <p className="text-green-700">ยืนยันแล้ว</p>
        </div>
      ) : (
        <div className="flex items-center">
          <div className="w-2 h-2 bg-yellow-700 rounded-full mr-1"></div>
          <p className="text-yellow-700">รออนุมัติ</p>
        </div>
      )}
    </React.Fragment>
  );
}
