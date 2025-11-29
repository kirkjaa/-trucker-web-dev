import { IUser } from "../user/userType";

export interface IDriver {
  id: number;
  display_code: string;
  driver_status: string;
  type: string;
  image_driving_license_card_url: string;
  image_id_card_url: string;
  rejected_reason: string;
  user: IUser;
  truck: {
    id: number;
    image_truck_back_url: string;
    image_truck_front_url: string;
    image_truck_document_url: string;
    image_truck_side_url: string;
    image_truck_license_plate_url: string;
    image_truck_registration_url: string;
    license_plate_value: string;
    weight: string;
    weight_unit: string;
    width: string;
    height: string;
    length: string;
    unit: string;
    vin: string;
    year: string;
    is_active: string;
    is_available: string;
    remark: string;
  };
}
