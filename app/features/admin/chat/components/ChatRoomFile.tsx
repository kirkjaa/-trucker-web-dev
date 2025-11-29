import React from "react";

import FilesList from "@/app/components/ui/featureComponents/FilesList";
import MenuButton from "@/app/components/ui/featureComponents/MenuButton";
import { useGlobalStore } from "@/app/store/globalStore";
import { IChatMessage } from "@/app/types/chatType";

type ChatRoomFileProps = {
  fileList: IChatMessage[];
  imageList: IChatMessage[];
};

const NoFilesMessage = () => (
  <div className="flex justify-center items-center w-full h-60">
    <p>ไม่พบไฟล์ข้อมูล</p>
  </div>
);

export default function ChatRoomFile({
  fileList,
  imageList,
}: ChatRoomFileProps) {
  const { currentStep } = useGlobalStore();
  return (
    <div className="flex flex-wrap">
      <React.Fragment>
        <div className="flex items-center  h-20 ">
          <div>
            <p className="title3 text-login-01 p-2 ml-4">รูปและวิดีโอ</p>
          </div>
        </div>

        <div className="w-full">
          <hr className="" />
          <div className="font-bold text-lg  gap-10 p-6 text-main-02 flex justify-evenly">
            <MenuButton step={1} title={`ไฟล์ ${fileList.length || 0}`} />
            <MenuButton
              step={2}
              title={`รูป & วิดีโอ ${imageList.length || 0}`}
            />
          </div>
        </div>
        <div className=" flex flex-wrap">
          {currentStep === 1 ? (
            fileList.length > 0 ? (
              fileList.map((item) => (
                <FilesList
                  key={item.id}
                  fileNames={item.body.customExts?.payloadUrl}
                  fileType="file"
                />
              ))
            ) : (
              <NoFilesMessage />
            )
          ) : imageList.length > 0 ? (
            imageList.map((item) => (
              <FilesList
                key={item.id}
                fileNames={item.body.customExts?.payloadUrl}
                fileType="image"
              />
            ))
          ) : (
            <NoFilesMessage />
          )}
        </div>
      </React.Fragment>
    </div>
  );
}
