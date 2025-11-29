"use client";

import { useRef } from "react";
import React from "react";
import clsx from "clsx";
import Image from "next/image";

import { Icons } from "@/app/icons";
import ImagePicture from "@/public/images/image-picture.png";
import imageUpload from "@/public/images/image-upload.png";

type DragAndDropProps = {
  files: any;
  setFiles: React.Dispatch<React.SetStateAction<any[]>>;
  maxFiles: number;
  showFileList?: boolean;
  imgWidth?: number;
  imgHeight?: number;
  isPreview?: boolean;
  setFileIds?: React.Dispatch<React.SetStateAction<number[]>>;
};

export default function DragAndDrop({
  files = [],
  setFiles,
  maxFiles,
  showFileList,
  imgWidth = 50,
  imgHeight = 50,
  isPreview = false,
  setFileIds,
}: DragAndDropProps) {
  // const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 5 * 1024 * 1024;
  const allowedExtensions = ["jpg", "jpeg", "png", "webp"];

  const isDuplicate = (file: File, existingFiles: any[]) => {
    return existingFiles.some((f) => {
      if (f instanceof File) {
        return (
          f.name === file.name &&
          f.size === file.size &&
          f.lastModified === file.lastModified
        );
      }

      if (typeof f === "object" && "name" in f) {
        return f.name === file.name;
      }

      return false;
    });
  };

  const filterValidFiles = (fileList: FileList | File[]) => {
    const newFiles = Array.from(fileList).filter((file) => {
      const ext = file.name.split(".").pop()?.toLowerCase();
      return (
        file.size <= MAX_FILE_SIZE &&
        allowedExtensions.includes(ext || "") &&
        !isDuplicate(file, files)
      );
    });

    if (newFiles.length !== fileList.length) {
      alert("บางไฟล์มีนามสกุลไม่รองรับ ขนาดเกิน 5MB หรือมีอยู่แล้ว");
    }

    return newFiles;
  };
  const handleAddFiles = (fileList: FileList | File[]) => {
    const validFiles = filterValidFiles(fileList);

    const updatedFiles = [...files, ...validFiles].slice(0, maxFiles);

    setFiles(updatedFiles);
  };

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    if (e.target.files) {
      handleAddFiles(e.target.files);
      inputRef.current!.value = "";
    }
  }

  function handleDrop(e: React.DragEvent<HTMLFormElement>) {
    e.preventDefault();
    e.stopPropagation();
    // setDragActive(false);
    if (e.dataTransfer.files) {
      handleAddFiles(e.dataTransfer.files);
    }
  }

  function handleDragEnter(e: React.DragEvent<HTMLFormElement>) {
    e.preventDefault();
    e.stopPropagation();
    // setDragActive(true);
  }

  function handleDragOver(e: React.DragEvent<HTMLFormElement>) {
    e.preventDefault();
    e.stopPropagation();
    // setDragActive(true);
  }

  function handleDragLeave(e: React.DragEvent<HTMLFormElement>) {
    e.preventDefault();
    e.stopPropagation();
    // setDragActive(false);
  }

  function removeFile(fileId: number, idx: number) {
    if (fileId && setFileIds) {
      setFileIds((prev) => [...prev, fileId]);
    }

    const updatedFiles = files.filter((_: any, i: any) => i !== idx);
    setFiles(updatedFiles);
  }

  function openFileExplorer() {
    inputRef.current!.value = "";
    inputRef.current!.click();
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
        onClick={openFileExplorer}
        onSubmit={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleChange}
        />
        <Image
          src={
            isPreview && files?.length > 0 && files[0] instanceof File
              ? URL.createObjectURL(files[0])
              : imageUpload
          }
          alt="upload"
          width={imgWidth}
          height={imgHeight}
          className={
            isPreview && files?.length > 0
              ? "w-auto h-auto max-w-[150px] max-h-[150px]"
              : "h-fit w-fit"
          }
          priority
        />
        <p className="mt-2 text-sm">เลือกไฟล์หรือลากวางที่นี่</p>

        {!showFileList && files?.length > 0 ? (
          <div className="flex flex-col items-center p-3 text-xs">
            {Array.isArray(files) &&
              files.map((file: any, idx: number) => (
                <div
                  key={idx}
                  className="flex flex-row space-x-5 items-center mb-1"
                >
                  <span className="truncate max-w-[150px]" title={file.name}>
                    {file.name}
                  </span>
                  <Icons
                    name="Bin"
                    className="w-3 h-3 text-red-500 cursor-pointer"
                    onClick={() => removeFile(file.id, idx)}
                  />
                </div>
              ))}
          </div>
        ) : (
          <p className="text-gray-500 text-xs">
            รองรับไฟล์ JPEG, JPG, PNG, WEBP ขนาดไม่เกิน 5MB
          </p>
        )}
      </form>

      {showFileList && (
        <div className="w-1/2 px-2">
          <div className="flex flex-col gap-2 justify-center">
            {files.map((file: any, idx: number) => (
              <div
                key={idx}
                className="bg-white flex flex-row p-2 items-center justify-between rounded-lg"
              >
                <Image
                  className="h-4 w-4 rounded-full bg-white"
                  src={ImagePicture.src}
                  alt="image"
                  width={40}
                  height={40}
                />
                <p className="text-xs items-center truncate flex-1 px-2">
                  {file.name}
                </p>
                <Icons
                  name="Bin"
                  className="w-3 h-3 text-red-500 cursor-pointer"
                  onClick={() => removeFile(file.id, idx)}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
