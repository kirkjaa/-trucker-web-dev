"use client";

import React from "react";

import ChatList from "./components/ChatList";
import ChatRoom from "./components/ChatRoom";

export default function ChatRender() {
  return (
    <div className="flex  min-h-full max-w-full min-w-full">
      <div className=" w-1/4">
        <ChatList />
      </div>
      <div className=" w-2/3">
        <ChatRoom />
      </div>
    </div>
  );
}
