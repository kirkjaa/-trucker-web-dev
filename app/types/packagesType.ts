import { EPackagesType } from "./enum";

export interface IPackagesData {
  id: string;
  name: string;
  duration: IPackagesDuration;
  price: number;
  isActive: boolean;
  type: EPackagesType;
  startDate: Date;
  endDate: Date;
  remark: string;
  createdAt?: string;
}

export interface IPackagesId {
  id: string;
}

export interface IPackagesDuration {
  value: number;
  unit: string;
}
