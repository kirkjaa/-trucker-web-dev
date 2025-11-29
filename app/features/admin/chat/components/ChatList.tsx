"use client";

import React, { useEffect } from "react";
import clsx from "clsx";
import Image from "next/image";

import useChat from "../hooks/useChat";

import { Input } from "@/app/components/ui/input";
import { timeAgo } from "@/app/utils/formatDate";
import placeHolderPerson from "@/public/placeHolderPerson.png";

export default function ChatList() {
  const {
    myChatgroup,
    fetchMyChatgroup,
    handleFilterMyChatgroup,
    handleGetMessage,
    setMyChatgroup,
    getChatGroup,
    selectedChatGroup,
    getSelectedChatGroup,
  } = useChat();

  useEffect(() => {
    fetchMyChatgroup();
  }, []);
  useEffect(() => {
    setMyChatgroup(getChatGroup());
  }, [getChatGroup()]);

  const selectedGroup = getSelectedChatGroup();

  useEffect(() => {
    if (!selectedGroup) return;

    const intervalId = setInterval(() => {
      handleGetMessage(selectedGroup);
    }, 6000);

    return () => clearInterval(intervalId);
  }, [selectedGroup]);

  return (
    // <!-- Chat List -->
    <aside className=" border-r-2">
      <div className="flex items-center  h-20">
        <div>
          <p className="title3 text-login-01">แชท</p>
          <a
            href="https://abhirajk.vercel.app"
            className="text-sm text-blue-100 hover:text-white transition"
          ></a>
        </div>
      </div>
      <hr />
      <div className="p-4">
        <div className="relative">
          <div className="rounded-xl focus-within:ring-2 focus-within:ring-primary">
            <Input
              placeholder="Search"
              className="px-2 rounded-xl placeholder-gray-400 focus:outline-none"
              onChange={handleFilterMyChatgroup}
            />
          </div>
        </div>
      </div>
      {/**/}
      <div className="overflow-y-auto  h-[calc(100vh-12rem)] ">
        <div className="px-2 space-y-1">
          {/* <!-- More chat items --> */}
          {myChatgroup.length > 0 ? (
            myChatgroup.map((item) => (
              <React.Fragment key={item.groupId}>
                <div
                  className={clsx(
                    "p-3 rounded-xl hover:bg-primary-oxley-green-02 flex items-center gap-3 cursor-pointer",
                    item.groupId === selectedChatGroup?.groupId &&
                      "bg-primary-oxley-green-02"
                  )}
                  onClick={() => handleGetMessage(item)}
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <Image
                      src={placeHolderPerson}
                      alt="user image"
                      width={100}
                      height={100}
                      className="w-full h-full object-cover "
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold truncate overflow-hidden whitespace-nowrap">
                        {item.groupName}
                      </p>
                      <span className="text-xs text-gray-400">
                        {timeAgo(item.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 truncate">
                      {item.lastMessage}
                    </p>
                  </div>
                </div>
              </React.Fragment>
            ))
          ) : (
            <></>
          )}
        </div>
      </div>
    </aside>
  );
}
