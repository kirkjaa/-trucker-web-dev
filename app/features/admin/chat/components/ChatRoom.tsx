"use client";

import React, { useEffect } from "react";
import Picker from "emoji-picker-react";
import Image from "next/image";

import useChat from "../hooks/useChat";

import ChatRoomFile from "./ChatRoomFile";
import ReceiverMessage from "./ReceiverMessage";
import SenderMessage from "./SenderMessage";

import { Input } from "@/app/components/ui/input";
import { Icons } from "@/app/icons";
import { EChatMessageType } from "@/app/types/enum";
import placeHolderPerson from "@/public/placeHolderPerson.png";

export default function ChatRoom() {
  const {
    selectedChatGroup,
    handlePushMessage,
    session,
    getChatMessage,
    messageList,
    setMessageList,
    textMessage,
    setTextMessage,
    fileInputRef,
    handleFileUpload,
    handleClickClipIcon,
    setHistoryFileList,
    historyFileList,
    handleClickEmoji,
    handleClickEmojiIcon,
    showEmojiPicker,
    messagesEndRef,
  } = useChat();

  useEffect(() => {
    setMessageList(getChatMessage());
    const newList = getChatMessage().filter(
      (item) => item.type !== EChatMessageType.TEXT
    );

    setHistoryFileList(newList);
  }, [getChatMessage()]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messageList]);

  return (
    <div className="w-full flex h-screen">
      {selectedChatGroup && (
        <div className="w-2/3 border-r-2  flex flex-col h-full">
          <React.Fragment>
            <div className="p-4 ">
              <div className=" mx-auto flex items-center justify-between h-12">
                <div className="flex items-center space-x-4">
                  <Image
                    src={placeHolderPerson}
                    alt="user image"
                    width={100}
                    height={100}
                    className="w-10 h-10 rounded-full object-cover border-2 border-white"
                  />
                  <div>
                    <p className="title3 text-login-01">
                      {selectedChatGroup.groupName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4"></div>
              </div>
            </div>
            <hr />

            {/* <!-- Chat Messages --> */}

            <div className=" flex-1 overflow-y-auto p-4 h-[calc(100vh-12rem)]">
              <div className=" mx-auto space-y-4">
                {messageList.length > 0 &&
                  messageList.map((data) => {
                    if (data.from?.id === session?.user?.id)
                      return (
                        <SenderMessage
                          key={data.id}
                          message={
                            !data.body.customEvent
                              ? data.body.msg
                              : data.body.customExts?.payloadUrl
                          }
                          createdAt={data.createdAt}
                          type={data.type}
                          imageUrl={data.from.imageUrl}
                          name={data.from.firstName}
                        />
                      );
                    else
                      return (
                        <ReceiverMessage
                          key={data.id}
                          message={
                            !data.body.customEvent
                              ? data.body.msg
                              : data.body.customExts?.payloadUrl
                          }
                          createdAt={data.createdAt}
                          type={data.type}
                          imageUrl={data.from.imageUrl}
                          name={data.from.firstName}
                        />
                      );
                  })}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* <!-- Chat Input --> */}

            <div className="bg-white border-t p-4">
              <div className=" mx-auto flex items-center space-x-4">
                <Input
                  placeholder="พิมพ์ข้อความ"
                  className="flex-1 p-2  rounded-full focus:outline-none focus:border-blue-500"
                  onKeyDown={handlePushMessage}
                  onChange={(e) => setTextMessage(e.target.value)}
                  value={textMessage}
                  BackIcon={
                    <Icons
                      name="SendPrimary"
                      className="w-5 cursor-pointer"
                      onClick={handlePushMessage}
                    />
                  }
                />
                <div className="p-2 transition">
                  <Icons
                    name="Clip"
                    className="w-6 h-6 cursor-pointer"
                    onClick={handleClickClipIcon}
                  />
                </div>

                <div className="relative">
                  <div className="p-2 transition">
                    <Icons
                      name="Emoji"
                      className="w-6 h-6 cursor-pointer"
                      onClick={handleClickEmojiIcon}
                    />
                  </div>

                  {showEmojiPicker && (
                    <div className="absolute bottom-full left-0 mb-2 z-50">
                      <Picker
                        onEmojiClick={handleClickEmoji}
                        reactionsDefaultOpen={true}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </React.Fragment>

          <input
            type="file"
            onChange={handleFileUpload}
            ref={fileInputRef}
            className="hidden"
          />
        </div>
      )}
      <div className="xl:w-2/6 h-full">
        {selectedChatGroup && (
          <ChatRoomFile
            fileList={historyFileList.filter(
              (item) => item.type === EChatMessageType.FILE
            )}
            imageList={historyFileList.filter(
              (item) => item.type === EChatMessageType.IMAGE
            )}
          />
        )}
      </div>
    </div>
  );
}
