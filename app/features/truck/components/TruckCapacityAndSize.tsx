import React from "react";

import { ETruckContainers } from "@/app/types/enum";

type TruckCapacityAndSizeProps = {
  weight?: number;
  dimension?: string;
  containers?: ETruckContainers[];
};

export default function TruckCapacityAndSize({
  weight,
  dimension,
  containers,
}: TruckCapacityAndSizeProps) {
  return (
    <React.Fragment>
      <div className="">
        <p>ข้อมูลบริษัท</p>
        <div className="mt-2 w-full border border-gray-300 min-h-20 rounded-lg">
          <div className="p-4 flex  justify-start w-full items-center">
            <div className="flex flex-col w-1/3">
              <p>ความจุที่รับได้ (กิโลกรัม)</p>
              <p>{weight}</p>
            </div>
            <div className="flex flex-col w-1/3">
              <p>ขนาดบรรทุกได้ (กxยxส)</p>
              <p>{dimension}</p>
            </div>
            <div className="flex flex-col w-1/3">
              <p>ประเภทตู้คอนเทนเนอร์ที่รับได้</p>
              <p>{containers && containers.join(", ")}</p>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
