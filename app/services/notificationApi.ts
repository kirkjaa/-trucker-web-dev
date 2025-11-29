import { IBaseResponse, IMeta, IResponseWithPaginate } from "../types/global";
import { INotificationListTable } from "../types/notificationType";

import { apiGet, apiPatch } from "./common";

export const notificationApi = {
  getAllNotificationsList: async (
    byId?: string,
    isRead?: boolean,
    query?: IMeta
  ): Promise<IResponseWithPaginate<INotificationListTable[]>> => {
    try {
      const params = new URLSearchParams();
      if (byId) {
        params.set("byId", byId);
      }
      if (isRead !== undefined) {
        params.set("isRead", isRead.toString());
      }
      if (query) {
        params.set("page", query.page.toString());
        params.set("limit", query.limit.toString());
      }
      const response = await apiGet("/v1/notification", params.toString());
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  updateReadNotificationById: async (id: string): Promise<IBaseResponse> => {
    const response = await apiPatch(
      `/v1/notification/${id}/update-read-status`
    );
    return response;
  },
};
