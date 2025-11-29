"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

import { Icons } from "@/app/icons";
import ImagePicture from "@/public/images/image-picture.png";

type UploadImageProps = {
  imageUrl?: string; // Default image URL (if any)
  setFile: (file: File | null) => void;
  discription?: string;
};

export default function UploadImage({
  imageUrl,
  setFile,
  discription,
}: UploadImageProps) {
  const [previewImage, setPreviewImage] = useState<string>(
    imageUrl || ImagePicture.src
  );
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (imageUrl) {
      setPreviewImage(imageUrl);
    }
  }, [imageUrl]);

  const loadFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target;
    const file = input.files ? input.files[0] : null;
    setFile(file);

    if (file && (file.type === "image/png" || file.type === "image/jpeg")) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const openFileExplorer = () => {
    if (inputRef.current) {
      inputRef.current.value = ""; // Reset file input
      inputRef.current.click();
    }
  };

  return (
    <form
      className="flex justify-center w-full flex-wrap items-center min-h-[10rem] flex-row"
      onClick={openFileExplorer}
    >
      <div className="relative h-20 w-20 rounded-full border-4 border-white">
        <Image
          className="h-full w-full rounded-full bg-white"
          src={previewImage}
          alt="Current profile photo"
          width={80}
          height={80}
        />
        <Icons
          name="Camera"
          className="w-20 h-20 absolute top-7 left-9 m-2 p-1 rounded-full"
        />
        <input
          placeholder="fileInput"
          className="hidden"
          ref={inputRef}
          type="file"
          multiple={false}
          onChange={loadFile}
          accept="image/*"
        />
      </div>
      <p className="w-full text-center">
        {discription || "กดเพื่อเลือกรูปภาพ"}
      </p>
    </form>
  );
}
