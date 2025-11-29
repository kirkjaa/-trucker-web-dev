import React from "react";
import Image from "next/image";

import Message from "./Message";

import { EChatMessageType } from "@/app/types/enum";
import { timeAgo } from "@/app/utils/formatDate";
import placeHolderPerson from "@/public/placeHolderPerson.png";
type SenderMessageProps = {
  message?: string;
  createdAt: Date;
  imageUrl?: string;
  type: EChatMessageType;
  name?: string;
};

export default function SenderMessage({
  message,
  createdAt,
  imageUrl,
  type,
  name,
}: SenderMessageProps) {
  return (
    <div className="flex items-start justify-end space-x-2">
      <div className="flex flex-col items-end">
        <span className="text-gray-500 text-xs message-time">
          {timeAgo(createdAt)} {name && `(${name})`}
        </span>

        <div className=" bg-primary-blue-04 text-white rounded-lg rounded-br-none p-3 shadow-md max-w-md ">
          <Message type={type} message={message} />
        </div>
      </div>
      <Image
        src={imageUrl || placeHolderPerson}
        alt="user image"
        width={100}
        height={100}
        className="w-8 h-8 rounded-full object-cover"
      />
    </div>
  );
}
