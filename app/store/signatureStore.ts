import { create } from "zustand";

import { ISignatureParams, signatureApi } from "../services/signatureApi";
import { IBaseResponse, IBaseResponseData } from "../types/global";
import {
  IDeleteSignature,
  IGetSignature,
  IUpdateIsMainSignatureStatus,
} from "../types/signatureType";

type signatureStore = {
  // State
  signatures: IGetSignature[] | null;

  // API Get
  getAllSignatureByFacIdOrComId: (
    getSignatureParams: ISignatureParams
  ) => Promise<IBaseResponseData<IGetSignature[]>>;

  // API Post
  createSignature: (data: FormData) => Promise<IBaseResponse>;

  // API Patch
  updatateIsMainSignatureStatus: (
    data: IUpdateIsMainSignatureStatus
  ) => Promise<IBaseResponse>;

  // API Delete
  deleteSignature: (data: IDeleteSignature) => Promise<IBaseResponse>;
};

export const useSignatureStore = create<signatureStore>((set) => ({
  // State
  signatures: null,

  // API Get
  getAllSignatureByFacIdOrComId: async (
    getSignatureParams: ISignatureParams
  ): Promise<IBaseResponseData<IGetSignature[]>> => {
    const response = await signatureApi.getAllSignatureByFacIdOrComId({
      factoryId: getSignatureParams.factoryId ?? "",
      companyId: getSignatureParams.companyId ?? "",
    });
    set({ signatures: response.data });
    return response;
  },

  // API Post
  createSignature: async (data: FormData): Promise<IBaseResponse> => {
    const response = await signatureApi.createSignature(data);
    return response;
  },

  // API Patch
  updatateIsMainSignatureStatus: async (
    data: IUpdateIsMainSignatureStatus
  ): Promise<IBaseResponse> => {
    const response = await signatureApi.updatateIsMainSignatureStatus(data);
    return response;
  },

  // API Delete
  deleteSignature: async (data: IDeleteSignature): Promise<any> => {
    const response = await signatureApi.deleteSignature(data);
    return response;
  },
}));
