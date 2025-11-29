import { create } from "zustand";

import { notificationApi } from "../services/notificationApi";
import { IBaseResponse, IMeta, IResponseWithPaginate } from "../types/global";
import { INotificationListTable } from "../types/notificationType";

type NotificationStore = {
  notificationList: INotificationListTable[];
  setNotificationList: (data: INotificationListTable[]) => void;
  getNotificationList: () => INotificationListTable[];
  getAllNotificationList: (
    byId?: string,
    isRead?: boolean,
    query?: IMeta
  ) => Promise<IResponseWithPaginate<INotificationListTable[]>>;
  updateReadStatus: (id: string) => Promise<IBaseResponse>;
  totalNotification: number;
  getTotalNotification: () => number;
  setTotalNotification: (data: number) => void;
};

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notificationList: [],
  totalNotification: 0,
  getTotalNotification: () => get().totalNotification,
  setTotalNotification: (data: number) => {
    set({ totalNotification: data });
  },
  setNotificationList: (data: INotificationListTable[]) => {
    set({ notificationList: data });
  },
  getNotificationList: () => get().notificationList,
  getAllNotificationList: async (
    byId?: string,
    isRead?: boolean,
    query?: IMeta
  ): Promise<IResponseWithPaginate<INotificationListTable[]>> => {
    const response = await notificationApi.getAllNotificationsList(
      byId,
      isRead,
      query
    );
    set({ notificationList: response.data });
    return response;
  },
  updateReadStatus: async (id: string): Promise<IBaseResponse> => {
    const response = await notificationApi.updateReadNotificationById(id);
    return response;
  },
}));
