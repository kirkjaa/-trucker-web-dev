import {
  IChatGroup,
  IChatMessage,
  IChatMessageId,
  IChatMessageRequest,
  IChatPushMessageRequest,
} from "../types/chatType";
import { IBaseResponseData } from "../types/global";
import ConvertToformData from "../utils/formData";

import { apiGetNoLoading, apiPost } from "./common";

export const chatApi = {
  getChatGroupMe: async (): Promise<IBaseResponseData<IChatGroup[]>> => {
    const response = await apiGetNoLoading("/v1/chat/chat-group/me");
    return response;
  },
  pushMessage: async (
    payload: IChatPushMessageRequest
  ): Promise<IBaseResponseData<IChatMessageId>> => {
    const response = await apiPost(
      "/v1/chat/chat-message",
      ConvertToformData(payload),
      false
    );
    return response;
  },

  getMessage: async (
    query: IChatMessageRequest
  ): Promise<IBaseResponseData<IChatMessage[]>> => {
    const params = new URLSearchParams();
    params.set("chatGroupId", query.chatGroupId.toString());
    params.set("page", query.page.toString());
    params.set("limit", query.limit.toString());
    params.set("sortDirection", query.sortDirection.toString());
    if (query.search) {
      params.set("search", query.search);
    }
    if (query.sortBy) {
      params.set("sortBy", query.sortBy.toString());
    }
    const response = await apiGetNoLoading(
      "/v1/chat/chat-message",
      params.toString()
    );

    console.log("response", response);
    return response;
  },
};
