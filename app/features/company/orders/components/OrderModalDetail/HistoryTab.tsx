import React from "react";

// Assuming RegistrationHistoryDetail will have these fields.
// Ideally, import this from your main types (e.g., app/types/order.types.ts)
interface RegistrationHistoryDetail {
  registrationId?: string;
  registrationDate?: string; // Timestamp of when this state became active
  updatedBy?: string; // User who made this state active
}

interface HistoryTabProps {
  registrationHistory?: RegistrationHistoryDetail[];
}

// Add sample data for fallback
const SAMPLE_HISTORY_DATA: RegistrationHistoryDetail[] = [
  {
    registrationId: "sample-reg-123",
    registrationDate: new Date().toISOString(),
    updatedBy: "Sample User",
  },
  {
    registrationId: "sample-reg-122",
    registrationDate: new Date(new Date().getTime() - 86400000).toISOString(), // yesterday
    updatedBy: "Previous User",
  },
];

const HistoryTab: React.FC<HistoryTabProps> = ({ registrationHistory }) => {
  const hasApiData = Array.isArray(registrationHistory);

  // Check if the API returned an empty array (valid API response but no data)
  const isEmptyApiResponse = hasApiData && registrationHistory.length === 0;

  // Only consider it valid if the API returned actual data
  const isValidRegistrationHistory =
    hasApiData && registrationHistory.length > 0;

  // Use real data when available, only fall back to sample data when necessary
  const useRegistrationHistory = isValidRegistrationHistory
    ? registrationHistory
    : SAMPLE_HISTORY_DATA;

  const latestHistory = useRegistrationHistory[0];

  const previousHistory =
    useRegistrationHistory.length > 1 ? useRegistrationHistory[1] : null;
  // If API returned an empty array, show that specifically
  if (isEmptyApiResponse) {
    return (
      <div className="flex flex-col gap-3">
        <p className="title3 text-secondary-indigo-main">ประวัติแก้ไขทะเบียน</p>

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
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-gray-600 mb-1">
            ไม่พบข้อมูลประวัติการแก้ไขทะเบียน
          </p>
          <p className="text-sm text-gray-500">
            ยังไม่มีการบันทึกประวัติการแก้ไขทะเบียน
          </p>
        </div>
      </div>
    );
  }

  // If there's no history data at all (not even sample)
  if (!latestHistory) {
    return (
      <div className="flex flex-col gap-3">
        <p className="title3 text-secondary-indigo-main">ประวัติแก้ไขทะเบียน</p>

        <p>ไม่มีข้อมูลประวัติการแก้ไขทะเบียน</p>
      </div>
    );
  }

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return (
        date.toLocaleTimeString("th-TH", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }) +
        " น. " +
        date.toLocaleDateString("th-TH", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
      );
    } catch (e) {
      return dateString; // Fallback to original string if parsing fails
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <p className="title3 text-secondary-indigo-main">ประวัติแก้ไขทะเบียน</p>

      <div className="grid grid-cols-8 gap-2">
        {/* Previous Registration Info */}
        <div className="flex items-start p-2 col-span-3 bg-gray-50 border pt-5 pb-4 pl-4 pr-4 rounded-3xl">
          <svg
            width="48"
            height="49"
            viewBox="0 0 48 49"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M48 24.3164C48 37.5712 37.2548 48.3164 24 48.3164C10.7452 48.3164 0 37.5712 0 24.3164C0 11.0616 10.7452 0.316406 24 0.316406C37.2548 0.316406 48 11.0616 48 24.3164Z"
              fill="white"
            />
            <path
              d="M23.996 28.3262C18.548 28.3262 13.8945 29.1851 13.8945 32.6209C13.8945 36.058 18.519 36.9472 23.996 36.9472C29.444 36.9472 34.0975 36.0895 34.0975 32.6525C34.0975 29.2154 29.4743 28.3262 23.996 28.3262Z"
              fill="#126D8A"
            />
            <path
              opacity="0.4"
              d="M23.9971 25.0529C27.7083 25.0529 30.6818 22.0781 30.6818 18.3682C30.6818 14.6583 27.7083 11.6836 23.9971 11.6836C20.2872 11.6836 17.3125 14.6583 17.3125 18.3682C17.3125 22.0781 20.2872 25.0529 23.9971 25.0529Z"
              fill="#126D8A"
            />
          </svg>
          <div className="ml-2 p-2 col-span-3">
            {previousHistory ? (
              <>
                <div>
                  <p className="font-semibold text-blue-600">ทะเบียนก่อนหน้า</p>
                </div>
                {previousHistory.registrationId && (
                  <div>
                    <p className="font-semibold text-blue-600">
                      ID การลงทะเบียน
                    </p>
                    <p className="text-gray-700">
                      {previousHistory.registrationId}
                    </p>
                  </div>
                )}
                <div>
                  <p className="font-semibold text-blue-600">แก้ไขเมื่อ</p>
                  <p className="text-gray-700">
                    {formatDateTime(previousHistory.registrationDate)}
                  </p>
                </div>
                {previousHistory.updatedBy && (
                  <div>
                    <p className="font-semibold text-blue-600">แก้ไขโดย</p>
                    <p className="text-gray-700">{previousHistory.updatedBy}</p>
                  </div>
                )}
              </>
            ) : (
              <p className="text-gray-500">ไม่มีข้อมูลก่อนหน้า</p>
            )}
          </div>
        </div>

        {/* Arrow Separator */}
        <div className="flex items-center justify-center col-span-2">
          <svg
            width="50"
            height="50"
            viewBox="0 0 50 50"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              opacity="0.4"
              d="M31.582 10H22.207L32.6237 24.5833L22.207 39.1667H31.582L41.9987 24.5833L31.582 10Z"
              fill="#6DA37F"
            />
            <path
              d="M17 10H7.625L18.0417 24.5833L7.625 39.1667H17L27.4167 24.5833L17 10Z"
              fill="#6DA37F"
            />
          </svg>
        </div>

        {/* Current/Latest Registration Info */}
        <div className="flex items-start p-2 col-span-3 border pt-5 pb-4 pl-4 pr-4 bg-green-50 rounded-3xl">
          <svg
            width="48"
            height="49"
            viewBox="0 0 48 49"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M48 24.3164C48 37.5712 37.2548 48.3164 24 48.3164C10.7452 48.3164 0 37.5712 0 24.3164C0 11.0616 10.7452 0.316406 24 0.316406C37.2548 0.316406 48 11.0616 48 24.3164Z"
              fill="white"
            />
            <path
              d="M23.996 28.3262C18.548 28.3262 13.8945 29.1851 13.8945 32.6209C13.8945 36.058 18.519 36.9472 23.996 36.9472C29.444 36.9472 34.0975 36.0895 34.0975 32.6525C34.0975 29.2154 29.4743 28.3262 23.996 28.3262Z"
              fill="#126D8A"
            />
            <path
              opacity="0.4"
              d="M23.9971 25.0529C27.7083 25.0529 30.6818 22.0781 30.6818 18.3682C30.6818 14.6583 27.7083 11.6836 23.9971 11.6836C20.2872 11.6836 17.3125 14.6583 17.3125 18.3682C17.3125 22.0781 20.2872 25.0529 23.9971 25.0529Z"
              fill="#126D8A"
            />
          </svg>
          <div className="ml-2 p-2 col-span-3">
            <div>
              <p className="font-semibold text-blue-600">ทะเบียนปัจจุบัน</p>
            </div>
            {latestHistory.registrationId && (
              <div>
                <p className="font-semibold text-blue-600">ID การลงทะเบียน</p>
                <p className="text-gray-700">{latestHistory.registrationId}</p>
              </div>
            )}
            {latestHistory.updatedBy && (
              <div>
                <p className="font-semibold text-blue-600">แก้ไขโดย</p>
                <p className="text-gray-700">{latestHistory.updatedBy}</p>
              </div>
            )}
          </div>
          <div className="flex flex-col items-end ml-auto">
            <div className="flex items-center bg-green-100 rounded-full px-3 py-1 mt-2">
              <svg
                className="w-4 h-4 text-green-600 mr-1"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-green-600 whitespace-nowrap">
                เวลาเปลี่ยน{" "}
                {
                  formatDateTime(latestHistory.registrationDate).split(" ")[0]
                }{" "}
              </p>
            </div>
            <div className="flex items-center mt-2">
              <span className="text-blue-600">•</span>
              <p className="text-blue-600 ml-1">ล่าสุด</p>
            </div>
            <div className="text-xs text-gray-500 mt-1 whitespace-nowrap">
              {formatDateTime(latestHistory.registrationDate)
                .split(" ")
                .slice(2)
                .join(" ")}{" "}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryTab;
