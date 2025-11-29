import { apiPost } from "@/app/services/common";
import { IBaseResponse } from "@/app/types/global";

export const authApi = {
  // API Post
  postFcm: async (fcmToken: string): Promise<IBaseResponse> => {
    const response = apiPost("/v1/auth/fcm-token", { fcmToken });

    return response;
  },
};
