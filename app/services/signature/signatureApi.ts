import { apiDelete, apiGet, apiPatch, apiPost } from "../common";

import { IBaseResponse, IBaseResponseData } from "@/app/types/global";
import { ISignature } from "@/app/types/signature/signatureType";

export const signatureApi = {
  // API Get
  getSignatures: async (): Promise<IBaseResponseData<ISignature[]>> => {
    try {
      const response = await apiGet("/v1/signature");
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  // API Post
  createSignature: async (data: FormData): Promise<IBaseResponse> => {
    const response = await apiPost("/v1/signature", data);

    return response;
  },

  // API Patch
  updateSignatureStatus: async (
    id: number,
    isDefault: boolean
  ): Promise<IBaseResponse> => {
    const response = await apiPatch(`/v1/signature/default?id=${id}`, {
      is_default: isDefault,
    });

    return response;
  },

  // API Delete
  deleteSignature: async (id: number): Promise<IBaseResponse> => {
    const response = await apiDelete(`/v1/signature?id=${id}`);

    return response;
  },
};
