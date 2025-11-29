/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useMemo, useRef, useState } from "react";
import { useSession } from "next-auth/react";

import { useChatStore } from "@/app/store/chatStore";
import {
  IChatGroup,
  IChatMessage,
  IChatMessageRequest,
  IChatPushMessageRequest,
} from "@/app/types/chatType";
import {
  EChatMessageType,
  EHttpStatusCode,
  EKeyCode,
  ESortDirection,
} from "@/app/types/enum";

export default function useChat() {
  //#region State
  const [myChatgroup, setMyChatgroup] = useState<IChatGroup[]>([]);
  const [messageList, setMessageList] = useState<IChatMessage[]>([]);
  const [textMessage, setTextMessage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [historyFileList, setHistoryFileList] = useState<IChatMessage[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  //#endregion State

  //#region Store
  const {
    getChatGroupMe,
    chatGroup,
    setSelectedChatGroup,
    getSelectedChatGroup,
    selectedChatGroup,
    getMessage,
    getChatMessage,
    pushMessage,
    getChatGroup,
  } = useChatStore();

  const { data: session } = useSession();

  //#endregion Store

  //#region Function
  const fetchMyChatgroup = async () => {
    await getChatGroupMe();
  };

  const handleFilterMyChatgroup = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setMyChatgroup(
      chatGroup.filter((data) =>
        data.groupName.toLocaleLowerCase().includes(value.toLocaleLowerCase())
      )
    );
  };

  const handleGetMessage = async (data: IChatGroup) => {
    setSelectedChatGroup(data);
    const query: IChatMessageRequest = {
      page: 1,
      limit: 999,
      sortDirection: ESortDirection.ASC,
      chatGroupId: data.groupId,
    };
    await getMessage(query);
  };

  const handlePushMessage = async (event: any) => {
    const { keyCode } = event;

    if (keyCode === EKeyCode.ENTER || event.type === "click") {
      const payload: IChatPushMessageRequest = {
        type: EChatMessageType.TEXT,
        to: [selectedChatGroup!.groupId],
        text: textMessage,
      };
      const response = await pushMessage(payload);

      if (response.statusCode === EHttpStatusCode.CREATED) {
        await handleAfterPushMessage();
      }
    }
  };
  const handleAfterPushMessage = async () => {
    const query: IChatMessageRequest = {
      page: 1,
      limit: 999,
      sortDirection: ESortDirection.ASC,
      chatGroupId: selectedChatGroup!.groupId,
    };
    await getMessage(query);
    setTextMessage("");
    setShowEmojiPicker(false);
    await fetchMyChatgroup();
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (_e) => {};
    reader.onerror = (error) => {
      console.error("Error reading file:", error);
    };

    reader.readAsText(file);

    const payload: IChatPushMessageRequest = {
      type:
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/jpg"
          ? EChatMessageType.IMAGE
          : EChatMessageType.FILE,
      to: [selectedChatGroup!.groupId],
      text: file.name,
      payload: file,
    };

    const response = await pushMessage(payload);
    if (response.statusCode === EHttpStatusCode.CREATED) {
      await handleAfterPushMessage();
    }
  };

  const handleClickClipIcon = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    fileInputRef.current?.click();
  };
  const handleClickEmojiIcon = () => {
    setShowEmojiPicker((prev) => !prev);
  };
  const handleClickEmoji = (event: any) => {
    setTextMessage((prev) => prev + event.emoji);
  };

  //#endregion Function
  return {
    myChatgroup,
    fetchMyChatgroup,
    handleFilterMyChatgroup,
    handleGetMessage,
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
    historyFileList,
    setHistoryFileList,
    handleClickEmoji,
    handleClickEmojiIcon,
    showEmojiPicker,
    messagesEndRef,
    setMyChatgroup,
    getChatGroup,
    getSelectedChatGroup,
  };
}
