import { IPackage } from "../package/packageType";
import { ISignature } from "../signature/signatureType";
import { IUser } from "../user/userType";

import {
  IBusinessType,
  IDistrict,
  IOrganizationType,
  IProvince,
  ISubdistrict,
} from "@/app/types/master/masterType";

export interface IOrganization {
  id: number;
  display_code: string;
  name: string;
  dial_code: string;
  phone: string;
  email: string;
  image_url: string;
  image_logo_url: string;
  owner_user: IUser;
  type: IOrganizationType;
  business_type: IBusinessType;
  package: Omit<
    IPackage,
    | "code"
    | "name_th"
    | "name_en"
    | "description_th"
    | "description_en"
    | "period"
    | "price"
    | "is_active"
    | "created_data"
  >;
  documents: [
    {
      id: number;
      file_url: string;
      document_type: string;
    },
  ];
  addresses: [
    {
      id: number;
      address: string;
      zip_code: string;
      latitude: string;
      longitude: string;
      province: Omit<IProvince, "districts">;
      district: Omit<IDistrict, "subdistricts">;
      subdistrict: ISubdistrict;
    },
  ];
  signature: ISignature;
}
