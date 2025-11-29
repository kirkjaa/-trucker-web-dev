export interface ICreateSignature {
  type: string; // text,image
  image?: File; // type === image
  text?: string; // type === text พิมพ์ชื่อ
  isMain: boolean; // ตั้งเป็นลายเซ็นหลัก
  factoryId?: string; // หน้าบ้านแปะไปให้
  companyId?: string; // หน้าบ้านแปะไปให้
}

export interface IGetSignature {
  // query ได้ด้วย factoryId หรือ companyId
  id: string;
  isDeleted: boolean; // soft delete or hard??
  type: string; // text,image
  imageUrl?: string; // link s3 type === image
  text?: string; // type === text พิมพ์ชื่อ
  isMain: boolean; // ตั้งเป็นลายเซ็นหลัก
  factoryId?: string;
  companyId?: string;
}

export interface IUpdateIsMainSignatureStatus {
  id: string;
  isMain: boolean;
  factoryId?: string;
  companyId?: string;
}

export interface IDeleteSignature {
  id: string;
  factoryId?: string;
  companyId?: string;
}
