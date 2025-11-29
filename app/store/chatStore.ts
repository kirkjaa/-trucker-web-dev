import { create } from "zustand";

import { chatApi } from "../services/chatApi";
import {
  IChatGroup,
  IChatMessage,
  IChatMessageId,
  IChatMessageRequest,
  IChatPushMessageRequest,
} from "../types/chatType";
import { IBaseResponseData } from "../types/global";

type chatStore = {
  chatGroup: IChatGroup[];
  getChatGroup: () => IChatGroup[];
  setChatGroup: (chatGroup: IChatGroup[]) => void;
  getChatGroupMe: () => Promise<IBaseResponseData<IChatGroup[]>>;
  selectedChatGroup: IChatGroup | null;
  getSelectedChatGroup: () => IChatGroup | null;
  setSelectedChatGroup: (chatGroup: IChatGroup | null) => void;
  pushMessage: (
    payload: IChatPushMessageRequest
  ) => Promise<IBaseResponseData<IChatMessageId>>;
  getMessage: (
    query: IChatMessageRequest
  ) => Promise<IBaseResponseData<IChatMessage[]>>;
  chatMessage: IChatMessage[];
  setChatMessage: (chatMessage: IChatMessage[]) => void;
  getChatMessage: () => IChatMessage[];
};

export const useChatStore = create<chatStore>((set, get) => ({
  chatGroup: [],
  getChatGroup: () => get().chatGroup,
  setChatGroup: (chatGroup: IChatGroup[]) => set({ chatGroup: chatGroup }),
  getChatGroupMe: async (): Promise<IBaseResponseData<IChatGroup[]>> => {
    const response = await chatApi.getChatGroupMe();
    set({ chatGroup: response.data });
    return response;
  },
  selectedChatGroup: null,
  getSelectedChatGroup: () => get().selectedChatGroup,
  setSelectedChatGroup: (chatGroup: IChatGroup | null) =>
    set({ selectedChatGroup: chatGroup }),
  pushMessage: async (
    payload: IChatPushMessageRequest
  ): Promise<IBaseResponseData<IChatMessageId>> => {
    const response = await chatApi.pushMessage(payload);
    return response;
  },
  getMessage: async (
    query: IChatMessageRequest
  ): Promise<IBaseResponseData<IChatMessage[]>> => {
    const response = await chatApi.getMessage(query);
    set({ chatMessage: response.data });
    return response;
  },
  chatMessage: [],
  setChatMessage: (chatMessage: IChatMessage[]) =>
    set({ chatMessage: chatMessage }),
  getChatMessage: () => get().chatMessage,
}));
