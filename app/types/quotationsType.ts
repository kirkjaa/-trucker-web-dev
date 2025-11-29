import { IBidById } from "./bidsType";
import { IContract } from "./contractType";
import { IRfqById } from "./rfqType";

export interface IQuotationById {
  id: string; // id mongoDB
  displayCode: string; // Auto gen
  quotationStatus: string; // Pending === รอ sign เอกสาร, Approved === ทั้ง 2 ฝ่าย sign เอกสารเรียบร้อยแล้ว, Expired === หมดอายุ
  bidsData: IBidById;
  rfqData: IRfqById;
  createdAt: Date; // Date quotation === Pending
  updatedAt: Date; // Date quotation === Approved, ทั้ง 2 ฝ่ายเซ็นสัญญาเสร็จแล้ว
  expiredAt: Date; // updatedAt + rfqContactAge
  contract: IContract;
  document: string;
}

export interface IQuotationContractCompany {
  company: IContractCompany;
  contractStart: Date;
  contractEnd: Date;
  contractTime: string;
  status: string;
}

export interface IContractCompany {
  id: string;
  displayCode: string;
  name: string;
  address: IContractCompanyAddress;
  dialCode: string;
  phone: string;
  email: string;
  admin: IContractCompanyAdmin;
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
  companyStatus: string;
  businessType: string;
  imageUrl: string;
  logoImageUrl: string;
  documentUrls: string[];
  taxId: string;
  truckerId: string;
  package: IContractCompanyPackage;
}

export interface IContractCompanyAddress {
  latitude: number;
  longitude: number;
  province: string;
  district: string;
  subDistrict: string;
  addressLine1: string;
  postalCode: string;
}

export interface IContractCompanyAdmin {
  adminUserId: string;
  fullName: string;
}

export interface IContractCompanyPackage {
  duration: IContractCompanyPackageDuration;
}

export interface IContractCompanyPackageDuration {}
