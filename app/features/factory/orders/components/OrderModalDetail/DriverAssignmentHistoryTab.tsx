import React from "react";
import Image from "next/image";

import { formatISOToDate } from "@/app/utils/formatDate";
import { imageToUrl } from "@/app/utils/imgToUrl";

interface AssignedDriver {
  driverId: string;
  driverName: string;
  driverContact: string;
  driverData?: {
    _id?: any;
    deleted?: boolean;
    phone?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    roles?: string;
    userStatus?: string;
    imageUrl?: string | null;
    displayCode?: string;
    driver?: {
      _id?: any;
      displayCode?: string;
      type?: string;
      truck?: {
        _id?: any;
        licensePlate?: {
          value?: string;
          province?: string;
        };
        brand?: string;
        color?: string;
        type?: string;
        size?: string;
      };
    };
  };
}

interface DriverAssignment {
  _id: string; // Added _id to match API structure
  drivers: AssignedDriver[];
  assignedAt: string;
  assignedBy?: string; // Made assignedBy optional
}

interface DriverAssignmentHistoryTabProps {
  driverAssignmentHistory?: DriverAssignment[];
}

// Sample data for when API doesn't return any driver assignment history
const SAMPLE_DRIVER_ASSIGNMENTS: DriverAssignment[] = [
  {
    _id: "sample-assignment-1",
    drivers: [
      {
        driverId: "sample-driver-1",
        driverName: "นายสมชาย รักการขับ",
        driverContact: "081-234-5678",
      },
    ],
    assignedAt: new Date().toISOString(),
    assignedBy: "Admin User",
  },
  {
    _id: "sample-assignment-2",
    drivers: [
      {
        driverId: "sample-driver-2",
        driverName: "นายสมหมาย ขับดี",
        driverContact: "089-876-5432",
      },
      {
        driverId: "sample-driver-3",
        driverName: "นายมานะ รถเร็ว",
        driverContact: "062-345-6789",
      },
    ],
    assignedAt: new Date(new Date().getTime() - 86400000 * 2).toISOString(), // 2 days ago
    assignedBy: "Supervisor User",
  },
];

const DriverAssignmentHistoryTab: React.FC<DriverAssignmentHistoryTabProps> = ({
  driverAssignmentHistory,
}) => {
  // Determine if driverAssignmentHistory is available
  const hasApiData = Array.isArray(driverAssignmentHistory);

  // Check if the API returned an empty array (valid API response but no data)
  const isEmptyApiResponse = hasApiData && driverAssignmentHistory.length === 0;

  // Only consider it valid if the API returned actual data
  const isValidAssignmentHistory =
    hasApiData && driverAssignmentHistory.length > 0;

  // Use real data when available, only fall back to sample data when necessary
  const useDriverAssignmentHistory = isValidAssignmentHistory
    ? driverAssignmentHistory
    : SAMPLE_DRIVER_ASSIGNMENTS;

  // Flag to indicate if we're using sample data
  const usingSampleData = !isValidAssignmentHistory;

  // If API returned an empty array, show that specifically
  if (isEmptyApiResponse) {
    return (
      <div className="p-4">
        <div className="flex items-center mb-4">
          <h4 className="text-lg font-bold">ประวัติการจ่ายงานคนขับ</h4>
          <div className="flex items-center ml-3 bg-blue-100 rounded-full px-3 py-1">
            <svg
              className="w-4 h-4 text-blue-500 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1v-3a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-blue-700 text-sm font-medium">
              (No Driver History)
            </span>
          </div>
        </div>
        <div className="p-6 border rounded-lg shadow-sm bg-white text-center">
          <svg
            className="w-12 h-12 mx-auto text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <p className="text-gray-600 mb-1">
            ไม่พบข้อมูลประวัติการจ่ายงานคนขับ
          </p>
          <p className="text-sm text-gray-500">
            ยังไม่มีการบันทึกประวัติการจ่ายงานคนขับ
          </p>
        </div>
      </div>
    );
  }

  // General case for no data
  if (!useDriverAssignmentHistory || useDriverAssignmentHistory.length === 0) {
    return (
      <div className="p-4">
        <div className="flex items-center mb-4">
          <p className="title3 text-secondary-indigo-main">
            ประวัติการจ่ายงานคนขับ
          </p>
          {usingSampleData && !isEmptyApiResponse && (
            <div className="flex items-center ml-3 bg-yellow-100 rounded-full px-3 py-1">
              <svg
                className="w-4 h-4 text-yellow-500 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1v-3a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-yellow-700 text-sm font-medium">
                (Sample Data)
              </span>
            </div>
          )}
        </div>
        <p>ไม่มีข้อมูลประวัติการจ่ายงานคนขับ</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="title3 text-secondary-indigo-main">
        ประวัติการจ่ายงานคนขับ
      </p>

      {useDriverAssignmentHistory.map((assignment, index) => (
        <div key={index} className="p-4 border rounded-lg shadow-sm bg-white">
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm text-gray-600">
              จ่ายงานเมื่อ:{" "}
              <span className="font-semibold text-gray-800">
                {formatISOToDate.toFullDateTimeFormat(assignment.assignedAt)}
              </span>
            </p>
            {assignment.assignedBy && (
              <p className="text-sm text-gray-500">
                จ่ายงานโดย: {assignment.assignedBy}
              </p>
            )}
          </div>
          {assignment.drivers.map((driver) => (
            <div
              key={driver.driverId}
              className="p-3 bg-gray-50 rounded-md mb-2 last:mb-0"
            >
              <div className="flex items-center mb-2">
                {driver.driverData?.imageUrl ? (
                  <Image
                    src={imageToUrl(driver.driverData.imageUrl)}
                    alt={driver.driverName}
                    className="w-10 h-10 rounded-full mr-3 object-cover border border-gray-200"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-bold">
                      {driver.driverName.substring(0, 1)}
                    </span>
                  </div>
                )}
                <div>
                  <p className="font-semibold text-blue-600">
                    {driver.driverName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {driver.driverData?.displayCode || driver.driverId}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-2">
                <div>
                  <p className="text-xs text-gray-500">ติดต่อ</p>
                  <p className="text-sm text-gray-700">
                    {driver.driverContact}
                  </p>
                </div>
                {driver.driverData?.driver?.truck && (
                  <div>
                    <p className="text-xs text-gray-500">รถ</p>
                    <p className="text-sm text-gray-700">
                      {driver.driverData.driver.truck.type &&
                      driver.driverData.driver.truck.size
                        ? `${driver.driverData.driver.truck.type} ${driver.driverData.driver.truck.size}`
                        : "ไม่ระบุประเภท"}
                    </p>
                  </div>
                )}
              </div>

              {driver.driverData?.driver?.truck?.licensePlate && (
                <div className="mt-2 bg-blue-50 px-2 py-1 rounded inline-block">
                  <p className="text-sm text-blue-700">
                    {driver.driverData.driver.truck.licensePlate.value}{" "}
                    {driver.driverData.driver.truck.licensePlate.province}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default DriverAssignmentHistoryTab;
