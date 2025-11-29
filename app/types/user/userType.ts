import { IRole } from "../master/masterType";
import { IOrganization } from "../organization/organizationType";

export interface IUser {
  id: number;
  display_code: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  dial_code: string;
  phone: string;
  id_card: string;
  image_url: string;
  organization: Omit<
    IOrganization,
    "business_type" | "package" | "documents" | "owner_user"
  >;
  position: {
    id: number;
    code: string;
    name_th: string;
    name_en: string;
    is_active: string;
    is_dashboard: string;
    is_user: string;
    is_chat: string;
    is_quotation: string;
    is_order: string;
    is_truck: string;
    is_package: string;
    is_profile: string;
  };
  role: IRole;
}
