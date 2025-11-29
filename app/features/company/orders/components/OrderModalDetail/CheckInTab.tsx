import React from "react";

import MapComponent from "./MapComponent";

import { Icons } from "@/app/icons";

// Define the expected structure for a check-in item
interface CheckInItem {
  id: number | string;
  location?: string; // Made optional to align with OrderData.CheckIn
  timestamp?: string; // Made optional
  checkInTime?: string; // Made optional
  createdAt?: Date | string; // Allow string for flexibility, will parse to Date
  latitude?: number;
  longitude?: number;
}

// Define props for CheckInTab
interface CheckInTabProps {
  checkInData: CheckInItem[];
}

const getLatestCheckIn = (data: CheckInItem[]) => {
  if (!data || data.length === 0) {
    return null;
  }
  return data.reduce((latest, current) => {
    const currentCreatedAt = current.createdAt
      ? new Date(current.createdAt)
      : new Date(0);
    const latestCreatedAt = latest.createdAt
      ? new Date(latest.createdAt)
      : new Date(0);
    return currentCreatedAt > latestCreatedAt ? current : latest;
  });
};

const CheckInTab: React.FC<CheckInTabProps> = ({ checkInData }) => {
  const latestCheckIn = getLatestCheckIn(checkInData);

  if (!checkInData || checkInData.length === 0) {
    return (
      <div className="flex flex-col gap-3">
        <p className="title3 text-secondary-indigo-main">การเช็คอิน</p>
        <p>ไม่มีข้อมูลการเช็คอิน</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="title3 text-secondary-indigo-main">การเช็คอิน</p>
      <div className="grid grid-cols-1 gap-4">
        <div className="border pt-5 pb-4 pl-4 pr-4 rounded-3xl bg-white">
          <div className="relative">
            <div className="absolute left-0 top-0 h-full w-10 flex flex-col items-center">
              {checkInData.map((data, index) => (
                <React.Fragment key={data.id}>
                  <div
                    className={`flex items-center justify-center w-8 h-8 ${
                      index === 0 ? "bg-green-500" : "bg-blue-500"
                    } text-white rounded-full`}
                  >
                    {index + 1}
                  </div>
                  {index < checkInData.length - 1 && (
                    <div className="flex-1 w-px bg-gray-300"></div>
                  )}
                </React.Fragment>
              ))}
            </div>
            <div className="ml-12">
              {checkInData.map((data) => (
                <div
                  key={data.id}
                  className="mb-4 p-4 bg-white rounded-lg shadow flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold text-blue-500">
                      {data.location || "N/A"}
                    </p>
                    <p className="text-black">{data.timestamp || "N/A"}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="bg-green-100 text-green-500 px-2 py-1 rounded-full flex items-center">
                      <Icons name="locationPin" className="w-6 h-6 mr-1" />
                      เช็คอิน {data.checkInTime || "N/A"}
                    </span>
                    {latestCheckIn && data.id === latestCheckIn.id && (
                      <span className="bg-blue-100 text-blue-500 px-2 py-1 rounded-full">
                        • ล่าสุด
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4">
            <p className="font-semibold">ตำแหน่งรถขนส่ง</p>
            <div className="w-full h-64 bg-gray-200 rounded-lg">
              <MapComponent
                lat={latestCheckIn?.latitude || 13.7563} // Removed extra space
                lon={latestCheckIn?.longitude || 100.5018}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckInTab;
