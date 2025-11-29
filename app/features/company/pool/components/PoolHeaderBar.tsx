import React from "react";

import PoolType from "./PoolType";

import { Button } from "@/app/components/ui/button";
import { Icons } from "@/app/icons";
import { EPoolType } from "@/app/types/enum";

type PoolHeaderBarProps = {
  onClick: (type: EPoolType) => void;
};

export default function PoolHeaderBar({ onClick }: PoolHeaderBarProps) {
  return (
    <div className="bg-modal-01 flex gap-4 w-full p-2 rounded-xl">
      <PoolType type={EPoolType.OFFER} outline onClick={onClick} />

      <Button className="ml-auto" onClick={() => onClick(EPoolType.NORMAL)}>
        <Icons name="Plus" /> โพสต์
      </Button>
    </div>
  );
}
