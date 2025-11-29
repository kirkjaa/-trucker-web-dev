import { create } from "zustand";

import {
  IBusinessType,
  IProvince,
  IUnitPriceRoute,
} from "../../types/master/masterType";

type masterStore = {
  // State
  provinces: IProvince[] | null;
  businessTypes: IBusinessType[] | null;
  unitPriceRoutes: IUnitPriceRoute[] | null;

  // Function
  setProvinces: (data: IProvince[]) => void;
  setBusinessTypes: (data: IBusinessType[]) => void;
  setUnitPriceRoutes: (data: IUnitPriceRoute[]) => void;
};

export const useMasterStore = create<masterStore>((set) => ({
  // State
  provinces: null,
  businessTypes: null,
  unitPriceRoutes: null,

  // Function
  setProvinces: (provinces) => set({ provinces }),
  setBusinessTypes: (businessTypes) => set({ businessTypes }),
  setUnitPriceRoutes: (unitPriceRoutes) => set({ unitPriceRoutes }),
}));
