"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/app/components/ui/button";
import HeaderWithBackStep from "@/app/components/ui/featureComponents/HeaderWithBackStep";
import { Input } from "@/app/components/ui/input";
// Dialog components are removed as ModalNotification will be used
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/app/components/ui/dialog";
import ModalNotification from "@/app/components/ui/ModalNotification"; // Added import
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { useToast } from "@/app/components/ui/toast/use-toast";
import { Icons } from "@/app/icons";
import { createOrder } from "@/app/services/ordersApi";
import { useUserStore } from "@/app/store/userStore";
import { EFacPathName, ETruckSize } from "@/app/types/enum";

// interface OneWayFormProps {
//   onBack: () => void;
//   onClose: () => void;
//   selectedTruckSize: ETruckSize | undefined;
// }

export function OneWayForm() {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [isDraftModalOpen, setIsDraftModalOpen] = useState<boolean>(false); // Added state for draft modal
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { userMe } = useUserStore();
  const { toast } = useToast();
  const router = useRouter();

  const initialFormData = {
    vehicleType: "",
    vehicleSize: "",
    customerType: "",
    customerCode: "",
    customerName: "",
    selectedProduct: "",
    productItem: "",
    productWeight: "",
    productRemarks: "",
    routeCode: "",
    originAddress: "",
    originLat: "",
    originLng: "",
    destinationAddress: "",
    destinationLat: "",
    destinationLng: "",
    pickupDateTime: "",
    deliveryDateTime: "",
    distance: "",
    routeRemarks: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  // const [routeCodes, setRouteCodes] = useState<
  //   { label: string; value: string }[]
  // >([]); // Example, populate as needed

  // useEffect(() => {
  //   if (selectedTruckSize) {
  //     setFormData((prev) => ({ ...prev, vehicleSize: selectedTruckSize }));
  //   }
  // }, [selectedTruckSize]);

  const handleClickBack = () => {
    router.push(EFacPathName.ORDERS_PUBLISHED);
  };

  const handleInputChange = (
    field: keyof typeof formData,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSelectChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // const clearFormData = () => {
  //   setFormData(initialFormData);
  // };

  const handleConfirmSaveDraft = async () => {
    setIsLoading(true);
    // Simulate API call for saving draft
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast({
      title: "Info",
      description: "ร่างรายการขนส่งถูกบันทึกแล้ว (ยังไม่ได้ใช้งานจริง)",
      variant: "info",
    });
    setIsDraftModalOpen(false);
    setIsLoading(false);
    // onClose(); // Optionally close the form or navigate away
  };

  const handleConfirm = async () => {
    if (!userMe?.id) {
      toast({
        title: "Error",
        description: "User data not loaded. Please try again.",
        variant: "error",
      });
      return;
    }

    try {
      setIsLoading(true);
      const orderData = {
        factoryId: userMe.factory?.id || "",
        factoryName: userMe.factory?.name || "",
        orderType: "oneWay" as const,
        vehicleType: formData.vehicleType,
        vehicleSize: formData.vehicleSize,
        items: formData.productItem,
        startDestinationAddress: formData.originAddress,
        startDestination: `${formData.originLat},${formData.originLng}`,
        endDestinationAddress: formData.destinationAddress,
        destination: `${formData.destinationLat},${formData.destinationLng}`,
        zone: "Zone 1",
        distance: formData.distance ? Number.parseFloat(formData.distance) : 0,
        orderStatus: "Published", // Or "Draft" if saving as draft
        paymentStatus: "Unpaid",
        paymentType: "Cash",
        deliveryType: "Standard",
        createdBy: userMe.id,
        tripInformation: {
          pickupDateTime: formData.pickupDateTime,
          deliveryDateTime: formData.deliveryDateTime,
          remarks: `${formData.productRemarks}${
            formData.routeRemarks ? `; Route: ${formData.routeRemarks}` : ""
          }`.trim(),
          customerInfo: {
            type: formData.customerType,
            code: formData.customerCode,
            name: formData.customerName,
          },
        },
      };

      await createOrder(orderData);
      toast({
        title: "Success",
        description: "Order created successfully",
        variant: "success",
      });
      setIsConfirmModalOpen(false);
      // onClose();
    } catch (error) {
      console.error("Error creating order:", error);
      toast({
        title: "Error",
        description: "Failed to create order. Please try again.",
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-5">
        <HeaderWithBackStep
          onClick={handleClickBack}
          iconTitle="PaperPlusBulk"
          title="เพิ่มรายการขนส่ง"
        />
        <div className="bg-modal-01 px-5 py-3 rounded-lg flex items-center justify-between">
          <h1 className="text-xl font-semibold">
            การขนส่ง{" "}
            <span className="text-secondary-indigo-01">(เที่ยวเดียว)</span>
          </h1>

          <div className="flex gap-4">
            <Button
              variant="main-light"
              onClick={() => setIsDraftModalOpen(true)}
              disabled={isLoading}
            >
              <p className="button">บันทึกร่าง</p>
            </Button>
            <Button
              onClick={() => setIsConfirmModalOpen(true)}
              disabled={isLoading}
              className="flex items-center"
            >
              <Icons name="SendBulk" className="w-5 h-5 mr-2" />
              <p className="button">
                {isLoading ? "กำลังบันทึก..." : "ยืนยันการเพิ่มรายการขนส่ง"}
              </p>
            </Button>
          </div>
        </div>

        <div className="flex gap-4">
          {/* Left Column - Order Details */}
          <div className="flex flex-col gap-4 p-4 rounded-lg shadow-table w-full">
            {/* ข้อมูลรถขนส่ง - This section already has the new style from previous step */}
            <div className="flex flex-col gap-2 bg-modal-01 px-5 py-3 rounded-lg">
              <p className="button">ข้อมูลรถขนส่ง</p>
              <div className="flex gap-x-2 justify-between w-full">
                <div className="flex flex-col gap-1 w-full">
                  <p className="text-sm font-semibold text-neutral-08">
                    ประเภทรถ <span className="text-urgent-fail-02">*</span>
                  </p>
                  <Select
                    value={formData.vehicleType}
                    onValueChange={(value) => {
                      handleSelectChange("vehicleType", value);
                    }}
                  >
                    <SelectTrigger
                      id="vehicleType"
                      className="py-2 px-5 bg-white border-neutral-03 w-full"
                    >
                      <SelectValue placeholder="กรุณาเลือก" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="4W">4 ล้อ</SelectItem>
                      <SelectItem value="6W">6 ล้อ</SelectItem>
                      <SelectItem value="10W">10 ล้อ</SelectItem>
                      <SelectItem value="trailer">รถพ่วง</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-1 w-full">
                  <p className="text-sm font-semibold text-neutral-08">
                    ขนาดรถ <span className="text-urgent-fail-02">*</span>
                  </p>
                  <Select
                    value={formData.vehicleSize}
                    onValueChange={(value) =>
                      handleSelectChange("vehicleSize", value)
                    }
                    // disabled={!!selectedTruckSize}
                  >
                    <SelectTrigger
                      id="vehicleSize"
                      className="py-2 px-5 bg-white border-neutral-03 w-full"
                    >
                      <SelectValue placeholder="กรุณาเลือก" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(ETruckSize).map((size) => (
                        <SelectItem key={size} value={size}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* ข้อมูลการขนส่ง (Customer Info) */}
            <div className="flex flex-col gap-2 bg-modal-01 px-5 py-3 rounded-lg">
              <p className="button">ข้อมูลการขนส่ง</p>

              {/* <div className="flex flex-col gap-1 w-full">
                <p className="text-sm font-semibold text-neutral-08">
                  ลูกค้า <span className="text-urgent-fail-02">*</span>
                </p>
                <Input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) =>
                    handleInputChange("customerName", e.target.value)
                  }
                  placeholder="กรุณากรอก"
                />
              </div> */}

              <div className="flex gap-2">
                <div className="flex flex-col gap-1 w-full">
                  <p className="text-sm font-semibold text-neutral-08">
                    รหัสลูกค้า <span className="text-urgent-fail-02">*</span>
                  </p>
                  <Input
                    type="text"
                    value={formData.customerCode}
                    onChange={(e) =>
                      handleInputChange("customerCode", e.target.value)
                    }
                    placeholder="กรุณากรอก"
                  />
                </div>
                <div className="flex flex-col gap-1 w-full">
                  <p className="text-sm font-semibold text-neutral-08">
                    ชื่อลูกค้า <span className="text-urgent-fail-02">*</span>
                  </p>
                  <Input
                    type="text"
                    value={formData.customerName}
                    onChange={(e) =>
                      handleInputChange("customerName", e.target.value)
                    }
                    placeholder="กรุณากรอก"
                  />
                </div>
              </div>
            </div>

            {/* ข้อมูลบริษัทขนส่ง (Company Info) */}
            <div className="flex flex-col gap-2 bg-modal-01 px-5 py-3 rounded-lg">
              <p className="button">ข้อมูลบริษัทขนส่ง</p>

              <div className="flex flex-col gap-1 w-full">
                <p className="text-sm font-semibold text-neutral-08">
                  เลือกบริษัทขนส่ง{" "}
                  <span className="text-urgent-fail-02">*</span>
                </p>
                <Select
                // value={formData.selectedProduct}
                // onValueChange={(value) =>
                //   handleSelectChange("selectedProduct", value)
                // }
                >
                  <SelectTrigger
                    id="selectedProduct"
                    className="py-2 px-5 bg-white border-neutral-03 w-full"
                  >
                    <SelectValue placeholder="กรุณาเลือก" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PRODUCT_A">บริษัท A</SelectItem>
                    <SelectItem value="PRODUCT_B">บริษัท B</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* <div>
                <label
                  htmlFor="productRemarks"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  หมายเหตุ (สินค้า)
                </label>
                <input
                  id="productRemarks"
                  type="text"
                  value={formData.productRemarks}
                  onChange={(e) =>
                    handleInputChange("productRemarks", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="กรุณากรอก"
                />
              </div> */}
            </div>

            {/* ข้อมูลสินค้า (Item Info) */}
            <div className="flex flex-col gap-2 bg-modal-01 px-5 py-3 rounded-lg">
              <p className="button">ข้อมูลสินค้า</p>

              <div className="flex flex-col gap-1 w-full">
                <p className="text-sm font-semibold text-neutral-08">
                  ชื่อสินค้า <span className="text-urgent-fail-02">*</span>
                </p>
                <Input
                  type="text"
                  value={formData.productItem}
                  onChange={(e) =>
                    handleInputChange("productItem", e.target.value)
                  }
                  placeholder="กรุณากรอกชื่อสินค้า"
                />
              </div>
              <div className="flex gap-2">
                <div className="flex flex-col gap-1 w-full">
                  <p className="text-sm font-semibold text-neutral-08">
                    รหัสสินค้า <span className="text-urgent-fail-02">*</span>
                  </p>
                  <Input
                    type="number"
                    // value={formData.productWeight}
                    // onChange={(e) =>
                    //   handleInputChange("productWeight", e.target.value)
                    // }
                    placeholder="กรุณากรอกรหัสสินค้า"
                  />
                </div>
                <div className="flex flex-col gap-1 w-full">
                  <p className="text-sm font-semibold text-neutral-08">
                    น้ำหนักสินค้า <span className="text-urgent-fail-02">*</span>
                  </p>
                  <Input
                    type="number"
                    value={formData.productWeight}
                    onChange={(e) =>
                      handleInputChange("productWeight", e.target.value)
                    }
                    placeholder="กรุณากรอกน้ำหนักสินค้า"
                  />
                </div>
              </div>
            </div>

            {/* ข้อมูลน้ำมัน */}
            <div className="flex flex-col gap-2 bg-modal-01 px-5 py-3 rounded-lg">
              <p className="button">ข้อมูลน้ำมัน</p>

              <div className="flex flex-col gap-1 w-full">
                <p className="text-sm font-semibold text-neutral-08">
                  ราคาน้ำมัน <span className="text-urgent-fail-02">*</span>
                </p>
                <Input
                  type="number"
                  value={formData.productItem}
                  onChange={(e) =>
                    handleInputChange("productItem", e.target.value)
                  }
                  placeholder="กรุณากรอกราคาน้ำมัน"
                />
              </div>
            </div>
          </div>

          {/* Right Column - Transport Details */}
          <div className="flex flex-col gap-4 p-4 rounded-lg shadow-table w-full h-fit">
            {/* กำหนดเส้นทาง (Route Info) */}
            <div className="flex flex-col gap-2 bg-modal-01 px-5 py-3 rounded-lg">
              <p className="button">ข้อมูลเส้นทาง</p>
              <div className="flex flex-col gap-1 w-full">
                <p className="text-sm font-semibold text-neutral-08">
                  รหัสเส้นทาง <span className="text-urgent-fail-02">*</span>
                </p>

                <Select
                  value={formData.routeCode}
                  onValueChange={(value) => {
                    handleSelectChange("routeCode", value);
                    // toast({
                    //   title: "Info",
                    //   description: `เลือกเส้นทาง ${value} (ยังไม่ได้ใช้งานจริง)`,
                    // });
                  }}
                >
                  <SelectTrigger
                    id="routeCode"
                    className="py-2 px-5 bg-white border-neutral-03 w-full"
                  >
                    <SelectValue placeholder="กรุณาเลือก" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* {routeCodes.length > 0 ? (
                      routeCodes.map((rc) => (
                        <SelectItem key={rc.value} value={rc.value}>
                          {rc.label}
                        </SelectItem>
                      ))
                    ) : ( */}
                    <SelectItem value="RC001_EX">RC001 (ตัวอย่าง)</SelectItem>
                    {/* )} */}
                  </SelectContent>
                </Select>
              </div>

              <div className="border-2 border-dashed p-4 rounded-lg flex flex-col gap-2">
                <div className="flex flex-col gap-1 w-full">
                  <p className="text-sm font-semibold text-neutral-08">
                    ต้นทาง <span className="text-urgent-fail-02">*</span>
                  </p>
                  <Input
                    type="text"
                    value={formData.originAddress}
                    onChange={(e) =>
                      handleInputChange("originAddress", e.target.value)
                    }
                    placeholder="กรอกที่อยู่ต้นทาง"
                  />
                </div>
                <div className="flex gap-2">
                  <div className="flex flex-col gap-1 w-full">
                    <p className="text-sm font-semibold text-neutral-08">
                      ละติจูด (ต้นทาง){" "}
                      <span className="text-urgent-fail-02">*</span>
                    </p>
                    <Input
                      type="number"
                      value={formData.originLat}
                      onChange={(e) =>
                        handleInputChange("originLat", e.target.value)
                      }
                      placeholder="0.000000"
                    />
                  </div>

                  <div className="flex flex-col gap-1 w-full">
                    <p className="text-sm font-semibold text-neutral-08">
                      ลองจิจูด (ต้นทาง){" "}
                      <span className="text-urgent-fail-02">*</span>
                    </p>
                    <Input
                      type="number"
                      value={formData.originLng}
                      onChange={(e) =>
                        handleInputChange("originLng", e.target.value)
                      }
                      placeholder="0.000000"
                    />
                  </div>
                </div>

                <Icons
                  name="DoubleChevronDownGreen"
                  className="w-12 h-12 self-center"
                />

                <div className="flex flex-col gap-1 w-full">
                  <p className="text-sm font-semibold text-neutral-08">
                    ปลายทาง <span className="text-urgent-fail-02">*</span>
                  </p>
                  <Input
                    type="text"
                    value={formData.destinationAddress}
                    onChange={(e) =>
                      handleInputChange("destinationAddress", e.target.value)
                    }
                    placeholder="กรอกที่อยู่ปลายทาง"
                  />
                </div>
                <div className="flex gap-2">
                  <div className="flex flex-col gap-1 w-full">
                    <p className="text-sm font-semibold text-neutral-08">
                      ละติจูด (ปลายทาง){" "}
                      <span className="text-urgent-fail-02">*</span>
                    </p>
                    <Input
                      type="number"
                      value={formData.destinationLat}
                      onChange={(e) =>
                        handleInputChange("destinationLat", e.target.value)
                      }
                      placeholder="0.000000"
                    />
                  </div>
                  <div className="flex flex-col gap-1 w-full">
                    <p className="text-sm font-semibold text-neutral-08">
                      ลองจิจูด (ปลายทาง){" "}
                      <span className="text-urgent-fail-02">*</span>
                    </p>
                    <Input
                      type="number"
                      value={formData.destinationLng}
                      onChange={(e) =>
                        handleInputChange("destinationLng", e.target.value)
                      }
                      placeholder="0.000000"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <div className="flex flex-col gap-1 w-full">
                    <p className="text-sm font-semibold text-neutral-08">
                      วันที่ - เวลารับ สินค้า{" "}
                      <span className="text-urgent-fail-02">*</span>
                    </p>

                    <Input
                      type="datetime-local"
                      value={formData.pickupDateTime}
                      onChange={(e) =>
                        handleInputChange("pickupDateTime", e.target.value)
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-1 w-full">
                    <p className="text-sm font-semibold text-neutral-08">
                      วันที่ - เวลาส่ง สินค้า{" "}
                      <span className="text-urgent-fail-02">*</span>
                    </p>

                    <Input
                      type="datetime-local"
                      value={formData.deliveryDateTime}
                      onChange={(e) =>
                        handleInputChange("deliveryDateTime", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1 w-full">
                <p className="text-sm font-semibold text-neutral-08">
                  ระยะทาง (กม.) <span className="text-urgent-fail-02">*</span>
                </p>
                <Input
                  type="number"
                  value={formData.distance}
                  onChange={(e) =>
                    handleInputChange("distance", e.target.value)
                  }
                  placeholder="0"
                />
              </div>

              {/* <div>
                <label
                  htmlFor="routeRemarks"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  หมายเหตุ (เส้นทาง)
                </label>
                <input
                  id="routeRemarks"
                  type="text"
                  value={formData.routeRemarks}
                  onChange={(e) =>
                    handleInputChange("routeRemarks", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="กรุณากรอก"
                />
              </div> */}
            </div>
          </div>
        </div>
      </div>

      {/* Modal SaveDraft */}
      <ModalNotification
        open={isDraftModalOpen}
        setOpen={setIsDraftModalOpen}
        title="บันทึกร่างรายการขนส่ง"
        description="คุณต้องการบันทึกร่างรายการขนส่งนี้หรือไม่?"
        buttonText={isLoading ? "กำลังบันทึก..." : "ยืนยัน"}
        isConfirmOnly={false}
        icon={<Icons name="DialogInfo" className="w-16 h-16" />}
        onConfirm={handleConfirmSaveDraft}
      />

      {/* Confirmation Modal for Submitting Order */}
      <ModalNotification
        open={isConfirmModalOpen}
        setOpen={setIsConfirmModalOpen}
        title="ยืนยันการเพิ่มรายการขนส่ง"
        description="คุณต้องการบันทึกการเพิ่มรายการขนส่งนี้หรือไม่?"
        buttonText={isLoading ? "กำลังบันทึก..." : "ยืนยัน"}
        isConfirmOnly={false}
        icon={<Icons name="DialogInfo" className="w-16 h-16" />} // Consider using a different icon, e.g., HelpCircle
        onConfirm={handleConfirm}
      />
    </>
  );
}
