import React from "react";
import Image from "next/image";

import { EAdminPathName } from "@/app/types/enum";
import image from "@/public/images/image-picture.png";
type FactoriesAndComponiesImageCardProps = {
  imageUrl?: string;
  name: string;
  pathName?: string;
};

export default function FactoriesAndComponiesImageCard({
  imageUrl,
  name,
  pathName,
}: FactoriesAndComponiesImageCardProps) {
  return (
    <div className="flex flex-wrap gap-4 border-2 border-gray-300 p-4 rounded-lg min-h-full">
      <p>
        {pathName && pathName.includes(EAdminPathName.FACTORIES)
          ? "รูปภาพโรงงาน"
          : "รูปภาพบริษัท"}
      </p>
      {imageUrl ? (
        <Image
          src={imageUrl || image}
          alt={name}
          width={100}
          height={100}
          className=" h-[170px] w-full "
        />
      ) : (
        <div className="h-[170px] w-full flex justify-center items-center">
          <p className="title2">No Image</p>
        </div>
      )}
    </div>
  );
}
