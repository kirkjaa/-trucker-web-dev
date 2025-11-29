import React, { useState } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/app/components/ui/tooltip";
import { Icons } from "@/app/icons";

type CoppyToClipboardButtonProps = {
  text: string;
};

export default function CoppyToClipboardButton({
  text,
}: CoppyToClipboardButtonProps) {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 1000);
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <Tooltip>
      <TooltipTrigger>
        <Icons
          name="Coppy"
          className="w-6 h-6 cursor-pointer active:scale-95"
          onClick={() => copyToClipboard(text)}
        />
      </TooltipTrigger>
      <TooltipContent> {isCopied ? "Copied!" : "Copy"}</TooltipContent>
    </Tooltip>
  );
}
