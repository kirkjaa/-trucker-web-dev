import React from "react";
import Image from "next/image";
import Link from "next/link";

import { EChatMessageType } from "@/app/types/enum";

type MessageProps = {
  type: EChatMessageType;
  message?: string;
};

export default function Message({ type, message }: MessageProps) {
  return (
    <React.Fragment>
      {type === EChatMessageType.FILE ? (
        <Link href={message!} target="_blank" className=" hover:text-blue-200">
          <p className="break-words">{message}</p>
        </Link>
      ) : type === EChatMessageType.IMAGE ? (
        <Image src={message!} alt="image" width={300} height={300} />
      ) : (
        <p className="break-words">{message}</p>
      )}
    </React.Fragment>
  );
}
