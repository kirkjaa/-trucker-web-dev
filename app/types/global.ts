export interface IMeta {
  page: number;
  limit: number;
  totalPages?: number;
  total?: number;
}

export interface IBaseParams extends IMeta {
  search?: string;
  sort?: string;
  order?: string;
}

export interface IBaseResponse {
  message: {
    en: string;
    th: string;
  };
  statusCode: number;
}

export interface IBaseResponseData<T> extends IBaseResponse {
  data: T;
}

export interface IResponseWithPaginate<T> extends IBaseResponse {
  data: T;
  meta: IMeta;
}

export interface IBaseType {
  id: number;
  name_th: string;
  name_en: string;
}

export interface ISort {
  sortDirection?: string;
  sortBy?: string;
}

export interface getAllParams extends IMeta {
  status?: string;
  name?: string[];
  value?: string;
  isActive?: string;
  bidStatus?: string;
}

export interface IOption {
  value: string;
  label: string;
  extra?: string;
}

// export interface IOption {
//   // key: number;
//   id: number | string;
//   value: string;
//   label: string;
//   name?: string;
// }

export interface ISearch {
  search?: string;
  searchKey?: string[];
}

export type RowObject = { [key: string]: string };
