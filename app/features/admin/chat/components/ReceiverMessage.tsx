import React from "react";
import Image from "next/image";

import Message from "./Message";

import { EChatMessageType } from "@/app/types/enum";
import { timeAgo } from "@/app/utils/formatDate";
import placeHolderPerson from "@/public/placeHolderPerson.png";
type ReceiverMessageProps = {
  message?: string;
  createdAt: Date;
  imageUrl?: string;
  type: EChatMessageType;
  name?: string;
};

export default function ReceiverMessage({
  message,
  createdAt,
  imageUrl,
  type,
  name,
}: ReceiverMessageProps) {
  return (
    <div className="flex items-start space-x-2">
      <Image
        src={imageUrl || placeHolderPerson}
        alt="user image"
        width={100}
        height={100}
        className="w-8 h-8 rounded-full object-cover"
      />
      <div>
        <span className="text-gray-500 text-xs message-time">
          {timeAgo(createdAt)} {name && `(${name})`}
        </span>
        <div className=" bg-modal-01 rounded-lg rounded-bl-none p-3 shadow-md max-w-md break-normal">
          <Message type={type} message={message} />
        </div>
      </div>
    </div>
  );
}
