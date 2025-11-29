import { create } from "zustand";

import { factoryApi } from "../services/factoryApi";
import { IFactoryMe } from "../types/factoryType";
import { IBaseResponse, IBaseResponseData } from "../types/global";
import { FactoryMeFormInputs } from "../utils/validate/factory-validate";

type factoryStore = {
  myFactory: IFactoryMe | null;
  getMyFactory: () => IFactoryMe | null;
  setMyFactory: (factory: IFactoryMe | null) => void;
  getFactoryMe: () => Promise<IBaseResponseData<IFactoryMe>>;
  updateFactoryMe: (data: FactoryMeFormInputs) => Promise<IBaseResponse>;
};

export const useFactoryStore = create<factoryStore>((set, get) => ({
  myFactory: null,
  getMyFactory: () => get().myFactory,
  setMyFactory: (factory: IFactoryMe | null) => set({ myFactory: factory }),
  getFactoryMe: async (): Promise<IBaseResponseData<IFactoryMe>> => {
    const response = await factoryApi.getFactoryMe();
    set({ myFactory: response.data });
    return response;
  },
  updateFactoryMe: async (
    data: FactoryMeFormInputs
  ): Promise<IBaseResponse> => {
    const response = await factoryApi.updateFactoryMe(data);
    return response;
  },
}));
