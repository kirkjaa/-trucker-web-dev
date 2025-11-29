import type {
  DeliveryType,
  EOrderStatus,
  PaymentStatus,
  PaymentType,
} from "./enum";
import type { IMeta } from "./global"; // Import IMeta

export interface OrderResponse {
  items(items: any): unknown;
  statusCode: number;
  data: Order[];
  meta: IMeta; // Changed from Meta to IMeta
}

export interface Order {
  origin: string;
  fuelRate: string;
  status: string;
  _id: Record<string, any>;
  deleted: boolean;
  displayCode: string;
  factoryId: string;
  factoryName?: string;
  items: string;
  startDestination: string;
  destination: string;
  distance: number;
  orderStatus: EOrderStatus; // Use the renamed enum type
  paymentStatus: PaymentStatus;
  paymentType: PaymentType;
  deliveryType: DeliveryType;
  createBy: string;
  companies: any[];
  drivers: any[];
  assistantStaff: any[];
  registrationHistory: any[];
  price: number;
  fuelCost: number;
  maxGross: number;
  tare: number;
  containerNo: string;
  sealNo: string;
  isDeleted: boolean;
  masterRouteType: string;
  originProvince: string;
  createdAt: string;
  updatedAt: string;
  checkIns: any[];
  id: string;
}

// Interface for nested objects in OrderDetail (based on previous ModalOrderDetailById and curl)
interface CompanyInfoDetail {
  address?: string;
  contactNumber?: string;
  email?: string;
  // Add other relevant fields from your actual API response
}

interface CompanyDetail {
  companyId?: string;
  companyName?: string;
  companyNameThai?: string; // Added this field
  companyInfo?: CompanyInfoDetail;
  // Add other relevant fields
}

interface DriverDetail {
  driverId?: string;
  driverName?: string;
  licensePlate?: string;
  truckCode?: string;
  // Add other relevant driver fields
}

interface AssistantStaffDetail {
  staffId?: string;
  staffName?: string;
  staffContact?: string;
  // Add other relevant fields
}

interface RegistrationHistoryDetail {
  registrationId?: string;
  registrationDate?: string; // Or Date type if you parse it
  updatedBy?: string;
  // Add other relevant fields
}

interface CheckInDetail {
  checkInTime?: string; // Or Date
  location?: string;
  // Add other relevant fields
}

// Define DriverAssignmentHistoryDetail to match the API structure
interface AssignedDriverDetail {
  driverId: string;
  driverName: string;
  driverContact: string;
  driverData?: {
    _id?: any;
    deleted?: boolean;
    phone?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    roles?: string;
    userStatus?: string;
    imageUrl?: string | null;
    displayCode?: string;
    driver?: {
      _id?: any;
      displayCode?: string;
      type?: string;
      truck?: {
        _id?: any;
        licensePlate?: {
          value?: string;
          province?: string;
        };
        brand?: string;
        color?: string;
        type?: string;
        size?: string;
      };
    };
  };
}

interface DriverAssignmentHistoryDetail {
  _id?: string;
  drivers: AssignedDriverDetail[];
  assignedAt: string;
  assignedBy?: string;
}

// OrderDetail interface based on the curl response structure
export interface OrderDetail {
  _id: string;
  deleted?: boolean;
  displayCode: string;
  factoryId?: string;
  items?: string;
  startDestination?: string;
  destination?: string;
  distance?: number | string;
  orderStatus?: EOrderStatus | string; // Use existing enum or string
  paymentStatus?: PaymentStatus | string;
  paymentType?: PaymentType | string;
  deliveryType?: DeliveryType | string;
  createBy?: string; // User ID
  companies?: CompanyDetail[];
  drivers?: DriverDetail[];
  assistantStaff?: AssistantStaffDetail[];
  registrationHistory?: RegistrationHistoryDetail[];
  driverAssignmentHistory?: DriverAssignmentHistoryDetail[]; // Explicitly add driver assignment history
  isDeleted?: boolean;
  createdAt?: string; // ISO date string
  updatedAt?: string; // ISO date string
  checkIns?: CheckInDetail[];
  id?: string; // Often an alias for _id

  // Added based on error messages and potential structure
  customerName?: string;
  // companyNameThai is likely within CompanyDetail, ensure it's there or add here if root
  // truckCode, licensePlate, driverName are likely within DriverDetail
  // assistantName is likely within AssistantStaffDetail
  assistantCompensation?: string;

  // Include other fields from your curl response if they are at the root level
  // For example:
  // factoryId: string; (already there)
  // truckId: string | null;
  // vehicleRegistration: string | null;
  // price: number | null;
  // fuelCost: number | null;
  // maxGross: number | null;
  // tare: number | null;
  // containerNo: string | null;
  // sealNo: string | null;
  // expensive: number | null;
  // etc.
}

export type { EOrderStatus as OrderStatus }; // Export OrderStatus as a type

// Added for PATCH /v1/orders/update-drivers
export interface IDriverDetailUpdate {
  driverId: string;
  driverName: string;
  driverContact: string;
}

export interface IUpdateDriversRequest {
  id: string; // This is the orderId
  drivers: IDriverDetailUpdate[];
}

// Added for updating the company of an order
export interface IUpdateOrderCompanyRequest {
  orderId: string;
  companyId: string;
}

export interface IOrderTruck {
  displayCode: string;
  originProvince: string;
  destinationProvince: string;
  checkIns: ICheckIn[];
  createdAt: string;
}

export interface ICheckIn {
  sequence: string;
  lat: number;
  lon: number;
  location: string;
  timestamp: string;
  status: string;
  updatedAt: string;
}
