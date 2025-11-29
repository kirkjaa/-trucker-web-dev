"use client";

import { Dispatch, SetStateAction, useEffect } from "react";

import CheckInTab from "./CheckInTab";
import DriverAssignmentHistoryTab from "./DriverAssignmentHistoryTab";
import HistoryTab from "./HistoryTab";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import OrderMenuButton from "@/app/components/ui/featureComponents/OrderMenuButton";
import { useGlobalStore } from "@/app/store/globalStore";
import { useOrderStore } from "@/app/store/ordersStore";
import {
  getStatusStyle,
  mapStatusToThaiFac,
} from "@/app/utils/formatOrderStatus";

export interface ModalOrderDetailByIdProps {
  isModalDetailOpen: boolean;
  setIsModalDetailOpen: Dispatch<SetStateAction<boolean>>;
  orderId: string;
}

interface AddressInfo {
  latitude?: number;
  longitude?: number;
  province?: string;
  district?: string;
  subDistrict?: string;
  addressLine1?: string;
  postalCode?: string;
}

interface NestedCompanyDetails {
  _id?: any;
  deleted?: boolean;
  displayCode?: string;
  name?: string;
  address?: AddressInfo;
  dialCode?: string;
  phone?: string;
  email?: string;
  companyStatus?: string;
  createBy?: string;
  adminUserId?: string;
  businessType?: string;
  imageUrl?: string;
  logoImageUrl?: string;
  documentUrls?: string[];
  signatures?: any[];
  truckerId?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Company {
  companyId?: string;
  company: NestedCompanyDetails;
}

interface Driver {
  driverId?: string;
  driverName?: string;
  driverContact?: string;
  licensePlate?: string;
  truckCode?: string;
}

interface AssistantStaff {
  staffId?: string;
  staffName?: string;
  staffContact?: string;
}

interface RegistrationHistory {
  registrationId?: string;
  registrationDate?: string;
  updatedBy?: string;
}

interface CheckIn {
  id: number | string;
  location?: string;
  timestamp?: string;
  checkInTime?: string;
  createdAt?: Date | string;
  latitude?: number;
  longitude?: number;
}

// Interface for AssignedDriver, matching DriverAssignmentHistoryTab.tsx
interface AssignedDriver {
  driverId: string;
  driverName: string;
  driverContact: string;
}

// Interface for DriverAssignment, matching DriverAssignmentHistoryTab.tsx
interface DriverAssignment {
  _id: string;
  drivers: AssignedDriver[];
  assignedAt: string;
  assignedBy?: string; // Optional to match DriverAssignmentHistoryTab.tsx
}

interface OrderData {
  _id: string;
  deleted?: boolean;
  displayCode: string;
  factoryId?: string;
  items?: string;
  startDestination?: string;
  destination?: string;
  distance?: number | string;
  orderStatus?: string;
  paymentStatus?: string;
  paymentType?: string;
  deliveryType?: string;
  createBy?: string;
  companies?: Company[];
  drivers?: Driver[];
  assistantStaff?: AssistantStaff[];
  registrationHistory?: RegistrationHistory[];
  driverAssignmentHistory?: DriverAssignment[]; // Added field for assignment history
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
  checkIns?: CheckIn[];
  id?: string;
  updatedBy?: string;
  containerNo?: string;
  sealNo?: string;
  tare?: string;
  maxGross?: string;
  companyNameEnglish?: string;
  customerName?: string;
  brand?: string;
  color?: string;
  category?: string;
  productCode?: string;
  productWeight?: string;
  fuelRate?: string;
  transportCost?: string;
  additionalNotes?: string;
  assistantCompensation?: string;
}

const ModalOrderDetailById = ({
  isModalDetailOpen,
  setIsModalDetailOpen,
  orderId,
}: ModalOrderDetailByIdProps) => {
  const { currentStep, setCurrentStep } = useGlobalStore((state) => ({
    currentStep: state.currentStep,
    setCurrentStep: state.setCurrentStep,
  }));
  const { selectedOrder, getOrderById, clearSelectedOrder } = useOrderStore();

  useEffect(() => {
    if (orderId && isModalDetailOpen) {
      getOrderById(orderId);
      setCurrentStep(1);
    } else if (!isModalDetailOpen) {
      clearSelectedOrder();
    }
  }, [orderId, isModalDetailOpen, getOrderById, clearSelectedOrder]);

  const orderData = selectedOrder as OrderData | null;

  // Enhanced debug log to see if we're getting data from the API
  // useEffect(() => {
  //   if (orderData) {
  //     // Log information about driver assignment history
  //     console.log(
  //       "[ModalOrderDetailById] Order data loaded:",
  //       orderData.displayCode,
  //       "Has driverAssignmentHistory:",
  //       Boolean(orderData.driverAssignmentHistory),
  //       orderData.driverAssignmentHistory
  //         ? "Length: " + orderData.driverAssignmentHistory.length
  //         : "No driver assignment history"
  //     );

  //     // Log information about registration history
  //     console.log(
  //       "[ModalOrderDetailById] Registration history data:",
  //       Boolean(orderData.registrationHistory),
  //       orderData.registrationHistory
  //         ? `Length: ${orderData.registrationHistory.length}`
  //         : "No registration history"
  //     );

  //     // Add detailed logging for driver assignment history
  //     if (
  //       orderData.driverAssignmentHistory &&
  //       orderData.driverAssignmentHistory.length > 0
  //     ) {
  //       console.log(
  //         "[ModalOrderDetailById] REAL API DATA: Driver assignment history structure:",
  //         JSON.stringify(orderData.driverAssignmentHistory[0], null, 2)
  //       );
  //     }

  //     // Add detailed logging for registration history
  //     if (
  //       orderData.registrationHistory &&
  //       orderData.registrationHistory.length > 0
  //     ) {
  //       console.log(
  //         "[ModalOrderDetailById] REAL API DATA: Registration history structure:",
  //         JSON.stringify(orderData.registrationHistory[0], null, 2)
  //       );
  //     }
  //   }
  // }, [orderData]);

  const renderTabContent = () => {
    // if (isLoading) {
    //   return <div className="p-4 text-center">Loading order details...</div>;
    // }
    // if (error) {
    //   return (
    //     <div className="p-4 text-center text-red-500">
    //       Error loading order details: {error}
    //     </div>
    //   );
    // }
    if (!orderData) {
      return <div className="p-4 text-center">No order data available.</div>;
    }

    const companyName = orderData.companies?.[0]?.company?.name || "-";
    const truckCode = orderData.drivers?.[0]?.truckCode || "-";
    const licensePlate = orderData.drivers?.[0]?.licensePlate || "-";
    const driverName = orderData.drivers?.[0]?.driverName || "-";
    const assistantName = orderData.assistantStaff?.[0]?.staffName || "-";

    switch (currentStep) {
      case 1:
        return (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <p className="title3 text-secondary-indigo-main">
                ข้อมูลตู้คอนเทนเนอร์
              </p>
              <div className="grid grid-cols-4 gap-4 border py-2 px-4 rounded-lg">
                <div>
                  <p className="font-semibold">CONTAINER NO.</p>
                  <p>{orderData.containerNo || "-"}</p>
                </div>
                <div>
                  <p className="font-semibold">SEAL NO.</p>
                  <p>{orderData.sealNo || "-"}</p>
                </div>
                <div>
                  <p className="font-semibold">TARE</p>
                  <p>{orderData.tare || "-"}</p>
                </div>
                <div>
                  <p className="font-semibold">MAX GROSS</p>
                  <p>{orderData.maxGross || orderData.productWeight || "-"}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <p className="title3 text-secondary-indigo-main">ข้อมูลบริษัท</p>
              <div className="grid grid-cols-4 gap-4 border py-2 px-4 rounded-lg">
                <div>
                  <p className="font-semibold">ชื่อบริษัท (ไทย)</p>
                  <p>{companyName || "-"}</p>
                </div>
                <div>
                  <p className="font-semibold">ชื่อบริษัท (English)</p>
                  <p>{companyName || "-"}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <p className="title3 text-secondary-indigo-main">ข้อมูลรถ</p>
              <div className="grid grid-cols-4 gap-4 border py-2 px-4 rounded-lg">
                <div>
                  <p className="font-semibold">รหัสรถบรรทุก</p>
                  <p>{truckCode}</p>
                </div>
                <div>
                  <p className="font-semibold">ทะเบียน</p>
                  <p>{licensePlate}</p>
                </div>
                <div>
                  <p className="font-semibold">ยี่ห้อ</p>
                  <p>{orderData.brand || "-"}</p>
                </div>
                <div>
                  <p className="font-semibold">สี</p>
                  <p>{orderData.color || "-"}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <p className="title3 text-secondary-indigo-main">
                ข้อมูลผู้ขับขี่
              </p>
              <div className="grid grid-cols-4 gap-4 border py-2 px-4 rounded-lg">
                <div>
                  <p className="font-semibold">ชื่อ นามสกุล</p>
                  <p>{driverName}</p>
                </div>
                <div>
                  <p className="font-semibold">ประเภทรถ</p>
                  <p>{orderData.category || "-"}</p>
                </div>
                <div>
                  <p className="font-semibold">ประเภทการส่ง</p>
                  <p>{orderData.deliveryType || "-"}</p>
                </div>
                <div>
                  <p className="font-semibold">สถานะ</p>
                  <p
                    className={`body2 ${orderData.orderStatus && getStatusStyle(orderData.orderStatus)} px-6 py-1 w-fit rounded-3xl`}
                  >
                    •{" "}
                    {orderData.orderStatus &&
                      mapStatusToThaiFac(orderData.orderStatus)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="flex flex-col gap-6">
            <p className="title3 text-secondary-indigo-main">ภาพรวมข้อมูล</p>

            <div className="border py-2 px-4 rounded-lg flex flex-col gap-4">
              <div>
                <p className="font-semibold">ชื่อลูกค้า</p>
                <p>{orderData.customerName || companyName}</p>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <p className="font-semibold">รหัสออเดอร์</p>
                  <p>{orderData.displayCode || "-"}</p>
                </div>
                <div>
                  <p className="font-semibold">รหัสสินค้า</p>
                  <p>{orderData.productCode || "-"}</p>
                </div>
                <div>
                  <p className="font-semibold">ชื่อสินค้า</p>
                  <p>{orderData.items || "-"}</p>
                </div>
                <div>
                  <p className="font-semibold">น้ำหนักสินค้า</p>
                  <p>{orderData.productWeight || orderData.maxGross || "-"}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <p className="title3 text-secondary-indigo-main">ข้อมูลเส้นทาง</p>
              <div className="grid grid-cols-4 gap-4 border py-2 px-4 rounded-lg">
                <div>
                  <p className="font-semibold">ต้นทาง</p>
                  <p>{orderData.startDestination || "-"}</p>
                </div>
                <div>
                  <p className="font-semibold">ปลายทาง</p>
                  <p>{orderData.destination || "-"}</p>
                </div>
                <div>
                  <p className="font-semibold">ระยะทาง</p>
                  <p>{orderData.distance ? `${orderData.distance} km` : "-"}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <p className="title3 text-secondary-indigo-main">ข้อมูลราคา</p>
              <div className="grid grid-cols-4 gap-4 border py-2 px-4 rounded-lg">
                <div>
                  <p className="font-semibold">เรทราคาน้ำมัน</p>
                  <p>{orderData.fuelRate || "-"}</p>
                </div>
                <div>
                  <p className="font-semibold">ราคาค่าขนส่ง</p>
                  <p>{orderData.transportCost || "-"}</p>
                </div>
                <div>
                  <p className="font-semibold">หมายเหตุเพิ่มเติม</p>
                  <p>{orderData.additionalNotes || "-"}</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 3:
        return <CheckInTab checkInData={orderData.checkIns || []} />;
      case 4:
        return (
          <div className="flex flex-col gap-3">
            <p className="title3 text-secondary-indigo-main">พนักงานผู้ช่วย</p>
            <div className="grid grid-cols-2 gap-4 border py-2 px-4 rounded-lg">
              <div>
                <p className="font-semibold">ชื่อพนักงาน</p>
                <p>{assistantName}</p>
              </div>
              <div>
                <p className="font-semibold">ค่าตอบแทน</p>
                <p>{orderData.assistantCompensation || "-"}</p>
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <HistoryTab
            // Ensure we pass real API data when available
            registrationHistory={orderData.registrationHistory || []}
          />
        );
      case 6:
        return (
          <DriverAssignmentHistoryTab
            // Ensure we pass real API data when available
            driverAssignmentHistory={orderData.driverAssignmentHistory || []}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Dialog open={isModalDetailOpen} onOpenChange={setIsModalDetailOpen}>
        <DialogContent className="max-w-[80rem] px-5" outlineCloseButton>
          <DialogHeader>
            <DialogTitle className="flex gap-10 border-b">
              <OrderMenuButton
                step={1}
                title="ข้อมูลการขนส่ง"
                icon="Delivery"
              />
              <OrderMenuButton
                step={2}
                title="ภาพรวมข้อมูล"
                icon="DocumentBulk"
              />
              <OrderMenuButton
                step={3}
                title="การเช็คอิน"
                icon="LocationBulk"
              />
              <OrderMenuButton
                step={4}
                title="พนักงานผู้ช่วย"
                icon="ProfileBulk"
              />
              <OrderMenuButton
                step={5}
                title="ประวัติแก้ไขทะเบียน"
                icon="PenBulk"
              />
              <OrderMenuButton
                step={6}
                title="ประวัติการจ่ายงานคนขับ"
                icon="DocumentBold"
              />
            </DialogTitle>
          </DialogHeader>

          {renderTabContent()}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ModalOrderDetailById;
