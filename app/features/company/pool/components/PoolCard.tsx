import React from "react";
import clsx from "clsx";
import Image from "next/image";

import PoolType from "./PoolType";

import { Button } from "@/app/components/ui/button";
import { Icons } from "@/app/icons";
import { EPoolType } from "@/app/types/enum";
import chat from "@/public/images/chat.png";

type PoolCardProps = {
  imageUrl?: string;
  subject: string;
  description: string;
  type: EPoolType;
  onClickOffer: () => void;
  createdAt?: Date;
  onClickCard?: () => void;
  visibleOfferBtn?: boolean;
  visiblePenIcon?: boolean;
  visibleBinIcon?: boolean;
};
export default function PoolCard({
  imageUrl,
  subject,
  description,
  type,
  onClickOffer,
  createdAt,
  onClickCard,
  visibleOfferBtn = true,
  visiblePenIcon = false,
  visibleBinIcon = false,
}: PoolCardProps) {
  return (
    <div
      className={clsx(
        "bg-white rounded-xl shadow p-4 flex flex-col gap-4 min-h-62",
        onClickCard &&
          " hover:bg-primary-oxley-green-03 hover:border-2 hover:border-primary-oxley-green-01"
      )}
      onClick={onClickCard}
    >
      <PoolType type={type} createdAt={createdAt} />

      <div className="flex items-start gap-4">
        <Image
          src={imageUrl || chat}
          alt="logo"
          width={100}
          height={10}
          className="w-16 h-16 rounded object-cover"
        />
        <div className="flex-1">
          <h2 className="text-lg font-bold text-gray-800">{subject}</h2>
        </div>
      </div>
      <p className="text-gray-600 text-sm mt-1 line-clamp-2 min-h-10">
        {description}
      </p>
      {visibleOfferBtn && (
        <div className="flex gap-2">
          {/* <Button variant="outline">
          <Icons name="ChatPrimary" />
          แชทเลย
        </Button> */}

          <Button
            onClick={(e) => {
              e.stopPropagation();
              onClickOffer();
            }}
          >
            <Icons name="Document" />
            เสนอราคา
          </Button>
        </div>
      )}
      {(visiblePenIcon || visibleBinIcon) && (
        <div className="flex gap-2 justify-end">
          <Icons name="Pen" className="w-4 h-4 cursor-pointer" />
          <Icons name="Bin" className="w-4 h-4 cursor-pointer" />
        </div>
      )}
    </div>
  );
}
