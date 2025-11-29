"use client";

import React from "react";
import Image from "next/image";

import { useGlobalStore } from "@/app/store/globalStore";
import LoadingImage from "@/public/images/Loading.png";

export default function LoadingChild(): React.ReactElement {
  const { loading } = useGlobalStore();

  return (
    <div>
      {loading && loading.value && (
        <div className="fixed top-0 w-full h-full flex justify-center items-center z-[999]">
          <div className="absolute top-0 left-0 w-full h-full opacity-50 bg-black"></div>
          <button type="button" className="relative" disabled>
            <Image
              src={LoadingImage}
              alt="Loading..."
              width={64}
              height={64}
              className="animate-spin w-[5rem] h-[5rem]"
              priority
            />
          </button>
        </div>
      )}
    </div>
  );
}
