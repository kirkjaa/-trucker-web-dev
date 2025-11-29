import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useGlobalStore } from "@/app/store/globalStore";
import { useNotificationStore } from "@/app/store/notificationStore";
import { IMeta } from "@/app/types/global";
import { INotificationListTable } from "@/app/types/notificationType";

export default function useNotification() {
  //#region State
  const defaultPagination: IMeta = {
    page: 1,
    limit: 10,
    total: 0,
  };
  const [dataList, setDataList] = useState<INotificationListTable[]>([]);
  const [dataDetail, setDataDetail] = useState<INotificationListTable>();
  const [hasMore, setHasMore] = useState(true);
  const [pagination, setPagination] = useState<IMeta>(defaultPagination);
  const router = useRouter();
  const pathName = usePathname();
  //#endregion State

  //#region Store
  const {
    getAllNotificationList,
    updateReadStatus,
    getNotificationList,
    setTotalNotification,
    getTotalNotification,
  } = useNotificationStore();
  const { currentStep } = useGlobalStore();
  //#endregion Store

  //#region Function
  const fetchDataList = async (
    byId?: string,
    more?: boolean,
    read?: boolean
  ) => {
    const isRead = byId || currentStep === 1 ? undefined : read || false;
    let queryParam = undefined;
    if (!byId) {
      queryParam = pagination;
      if (more) {
        queryParam.page += 1;
      } else {
        queryParam.page = 1;
      }
    }

    const response = await getAllNotificationList(byId, isRead, queryParam);
    const notifications = response.data;
    if (isRead === false) {
      setTotalNotification(response?.meta?.total || 0);
    }
    if (byId) {
      const firstItem = notifications[0];

      if (firstItem) {
        setDataDetail(firstItem);

        const isUnread = !firstItem.isRead;
        if (isUnread) {
          await handleSetReadNotification(firstItem.id);
        }
      } else {
        handleBack();
      }
    } else {
      if (response) {
        if (!more) {
          setDataList(notifications);
        } else {
          setDataList((prev: INotificationListTable[] | undefined) => [
            ...(prev?.length ? prev : []),
            ...notifications,
          ]);
        }
        setPagination(response.meta);
        setHasMore(response.meta.page < response.meta.total!);
      }
    }
  };

  const handleClickReadNotification = async (id: string) => {
    router.push(`${pathName}/${id}`);
  };

  const handleSetReadNotification = async (id: string) => {
    await updateReadStatus(id);
  };
  const handleBack = () => {
    router.back();
  };
  //#endregion Function

  return {
    fetchDataList,
    dataList,
    handleClickReadNotification,
    handleBack,
    dataDetail,
    currentStep,
    getNotificationList,
    setDataList,
    hasMore,
    getTotalNotification,
  };
}
