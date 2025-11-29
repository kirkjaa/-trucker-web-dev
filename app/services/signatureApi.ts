import { IBaseResponse, IBaseResponseData } from "../types/global";
import {
  IDeleteSignature,
  IGetSignature,
  IUpdateIsMainSignatureStatus,
} from "../types/signatureType";

import { apiDelete, apiGet, apiPatch, apiPost } from "./common";

export interface ISignatureParams {
  factoryId?: string;
  companyId?: string;
}

export const signatureApi = {
  // API Get
  getAllSignatureByFacIdOrComId: async (
    getSignatureParams: ISignatureParams
  ): Promise<IBaseResponseData<IGetSignature[]>> => {
    const params = new URLSearchParams();

    if (getSignatureParams.factoryId) {
      params.set("factoryId", getSignatureParams.factoryId);
    }
    if (getSignatureParams.companyId) {
      params.set("companyId", getSignatureParams.companyId);
    }

    try {
      const response = await apiGet(
        "/v1/quotations/getsignatures",
        params.toString()
      );
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  // API Post
  createSignature: async (data: FormData): Promise<IBaseResponse> => {
    const response = await apiPost("/v1/quotations/create-signature", data);
    return response;
  },

  // API Patch
  updatateIsMainSignatureStatus: async (
    data: IUpdateIsMainSignatureStatus
  ): Promise<IBaseResponse> => {
    const params = new URLSearchParams();

    if (data.factoryId) {
      params.set("factoryId", data.factoryId);
    }
    if (data.companyId) {
      params.set("companyId", data.companyId);
    }
    params.set("signatureId", data.id);
    params.set("isMain", data.isMain.toString());

    try {
      const response = await apiPatch(
        `/v1/quotations/signatureIsMainUpdate?${params.toString()}`
      );
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  // API Delete
  deleteSignature: async (data: IDeleteSignature): Promise<IBaseResponse> => {
    const params = new URLSearchParams();

    if (data.factoryId) {
      params.set("factoryId", data.factoryId);
    }
    if (data.companyId) {
      params.set("companyId", data.companyId);
    }
    params.set("signatureId", data.id);

    try {
      const response = await apiDelete(
        `/v1/quotations/deletedSignature?${params.toString()}`
      );
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
};
