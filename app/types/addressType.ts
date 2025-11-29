export interface IAddress {
  id: number;
  name_th: string;
  name_en: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface IProvince extends IAddress {
  geography_id: number;
}

export interface IAmphure extends IAddress {
  province_id: number;
}

export interface ITambon extends IAddress {
  zip_code: number;
  amphure_id: number;
}
