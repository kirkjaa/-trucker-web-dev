import React from "react";
import clsx from "clsx";

import { Icons } from "@/app/icons";

type FileListProps = {
  fileNames?: string;
  fileType: string;
  maxWidth?: string;
};

export default function FileList({
  fileNames,
  fileType,
  maxWidth,
}: FileListProps) {
  const onClickDownload = () => {
    window.open(fileNames, "_blank");
  };
  return (
    <div className="p-4 max-w-sm">
      <div
        className={clsx(
          "flex justify-between items-center",
          maxWidth && maxWidth,
          !maxWidth && "max-w-[300px]"
        )}
      >
        <Icons
          name={fileType === "image" ? "ChatImage" : "ChatPdf"}
          className="w-14 h-14 cursor-pointer"
        />
        <p className="text-wrap w-2/3 truncate line-clamp-2">{fileNames}</p>
        <Icons
          name="ChatDownloadFile"
          className="w-8 h-8 cursor-pointer"
          onClick={onClickDownload}
        />
      </div>
    </div>
  );
}
