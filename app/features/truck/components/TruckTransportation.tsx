import React from "react";

import { ITruckDriver } from "@/app/types/truckType";
import formatFullName from "@/app/utils/formatFullName";

type TruckTransportationProps = {
  truckCode?: string;
  licensePlate?: string;
  brand?: string;
  color?: string;
  companyName?: string;
  factoryName?: string;
  drivers?: ITruckDriver[];
};

export default function TruckTransportation({
  truckCode,
  licensePlate,
  brand,
  color,
  companyName,
  factoryName,
  drivers,
}: TruckTransportationProps) {
  return (
    <React.Fragment>
      <div className="">
        <p>ข้อมูลบริษัท</p>
        <div className="mt-2 w-full border border-gray-300 min-h-20 rounded-lg">
          <div className="p-4 flex  justify-start w-full items-center">
            {!companyName ? (
              <div className="flex flex-col w-1/4">
                <p>ชื่อโรงงาน (ไทย)</p>
                <p>{factoryName}</p>
              </div>
            ) : (
              <div className="flex flex-col w-1/4">
                <p>ชื่อบริษัท (ไทย)</p>
                <p>{companyName}</p>
              </div>
            )}

            {/* <div className="flex flex-col w-1/4">
              <p>ชื่อบริษัท (English)</p>
              <p>b</p>
            </div> */}
          </div>
        </div>
      </div>
      <div className="mt-4">
        <p>ข้อมูลรถ</p>
        <div className="mt-2 w-full border border-gray-300 min-h-20 rounded-lg">
          <div className="p-4 flex gap-2 justify-between w-full items-center">
            <div className="flex flex-col w-1/4">
              <p>รหัสรถบรรทุก</p>
              <p>{truckCode}</p>
            </div>
            <div className="flex flex-col w-1/4">
              <p>ป้ายทะเบียน</p>
              <p>{licensePlate}</p>
            </div>
            <div className="flex flex-col w-1/4">
              <p>ยี่ห้อ</p>
              <p>{brand}</p>
            </div>
            <div className="flex flex-col w-1/4">
              <p>สี</p>
              <p>{color}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <p>ข้อมูลผู้ขับขี่</p>
        <div className="mt-2 w-full border border-gray-300 min-h-20 rounded-lg">
          {drivers &&
            drivers.length > 0 &&
            drivers[0] !== null &&
            drivers.map((driver, index) => (
              <div
                className="p-4 flex gap-2 justify-between w-full items-center"
                key={driver?.id + index}
              >
                <div className="flex flex-col w-1/3">
                  <p>ชื่อ นามสกุล</p>
                  <p className="break-words">
                    {formatFullName(
                      driver?.user?.firstName,
                      driver?.user?.lastName
                    )}
                  </p>
                </div>
                <div className="flex flex-col w-1/3">
                  <p>ประเภทรถ</p>
                  <p>{driver?.type}</p>
                </div>
                {/* <div className="flex flex-col w-1/4">
                  <p>ประเภทการส่ง</p>
                  <p>{driver.}</p>
                </div> */}
                <div className="flex flex-col w-1/3">
                  <p>สถานะ</p>
                  <p>{driver?.driverStatus}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </React.Fragment>
  );
}
