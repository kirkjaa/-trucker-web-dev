"use client";

import { useRef } from "react";
import React from "react";
import clsx from "clsx";
import Image from "next/image";

import { useToast } from "../toast/use-toast";

import { Icons } from "@/app/icons";
import ImagePicture from "@/public/images/image-picture.png";
import imageUpload from "@/public/images/image-upload.png";

type DragAndDropProps = {
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  showFileList?: boolean;
  imgWidth?: number;
  imgHeight?: number;
  isPreview?: boolean;
  description?: string;
};

export default function DragAndDropOneFile({
  file,
  setFile,
  showFileList,
  imgWidth = 50,
  imgHeight = 50,
  isPreview = false,
  description,
}: DragAndDropProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    const selected = e.target.files?.[0];
    if (selected) {
      if (selected.type !== "application/pdf") {
        toast({
          icon: "ToastError",
          variant: "error",
          description: "Only PDF files are allowed.",
        });
        return;
      }
      if (selected.size <= MAX_FILE_SIZE) {
        setFile(selected);
      } else {
        toast({
          icon: "ToastError",
          variant: "error",
          description:
            "File exceeds the maximum size of 10MB and will not be uploaded.",
        });
      }
    }
  }

  function handleDrop(e: React.DragEvent<HTMLFormElement>) {
    e.preventDefault();
    e.stopPropagation();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      if (droppedFile.type !== "application/pdf") {
        toast({
          icon: "ToastError",
          variant: "error",
          description: "Only PDF files are allowed.",
        });
        return;
      }

      if (droppedFile.size <= MAX_FILE_SIZE) {
        setFile(droppedFile);
      } else {
        toast({
          icon: "ToastError",
          variant: "error",
          description:
            "File exceeds the maximum size of 10MB and will not be uploaded.",
        });
      }
    }
  }

  function openFileExplorer() {
    inputRef?.current?.click();
  }

  function removeFile() {
    setFile(null);
  }

  return (
    <div className="flex flex-wrap justify-between w-full">
      <form
        className={clsx(
          "p-4 rounded-lg bg-white min-h-[10rem] text-center flex flex-col items-center justify-center border-2 cursor-pointer",
          {
            "w-1/2": showFileList,
            "w-full": !showFileList,
          }
        )}
        onDragEnter={(e) => e.preventDefault()}
        onSubmit={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onDragLeave={(e) => e.preventDefault()}
        onDragOver={(e) => e.preventDefault()}
        onClick={openFileExplorer}
      >
        <input
          className="hidden"
          ref={inputRef}
          type="file"
          onChange={handleChange}
          accept=".pdf"
        />
        <Image
          src={isPreview && file ? URL.createObjectURL(file) : imageUpload}
          alt="image upload"
          width={imgWidth}
          height={imgHeight}
          className={
            isPreview && file
              ? "w-auto h-auto max-w-[150px] max-h-[150px]"
              : "h-fit w-fit"
          }
          priority
        />
        <p className="mt-2 text-sm text-black">เลือกไฟล์หรือลากวางที่นี่</p>

        {file ? (
          <div className="flex flex-col items-center p-3 text-xs">
            <div className="flex flex-row space-x-5 items-center">
              <span className="truncate max-w-[150px]" title={file.name}>
                {file.name}
              </span>
              <Icons
                name="Bin"
                className="w-3 h-3 text-red-500 cursor-pointer"
                onClick={removeFile}
              />
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-xs">{description}</p>
        )}
      </form>

      {showFileList && file && (
        <div className="w-1/2 px-2">
          <div className="bg-white flex flex-row p-2 items-center justify-between rounded-lg">
            <Image
              className="h-4 w-4 rounded-full bg-white"
              src={ImagePicture.src}
              alt="Current profile photo"
              width={40}
              height={40}
            />
            <p className="text-xs truncate flex-1 px-2">{file.name}</p>
            <Icons
              name="Bin"
              className="w-3 h-3 text-red-500 cursor-pointer"
              onClick={removeFile}
            />
          </div>
        </div>
      )}
    </div>
  );
}
