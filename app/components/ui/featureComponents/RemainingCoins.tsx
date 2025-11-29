import React from "react";
import Image from "next/image";

import Coins from "@/public/images/coins.png";
type RemainingCoinsProps = {
  coins: number;
};

export default function RemainingCoins({ coins }: RemainingCoinsProps) {
  return (
    <div className="bg-yellow-100 p-4 rounded-full flex items-center max-w-fit">
      <Image
        src={Coins}
        alt="coins"
        height={100}
        width={100}
        className="h-6 w-6 mr-2"
      />
      <p>
        เหรียญคงเหลือ :{" "}
        <span className="text-yellow-500 font-bold">{coins}</span>
      </p>
    </div>
  );
}
