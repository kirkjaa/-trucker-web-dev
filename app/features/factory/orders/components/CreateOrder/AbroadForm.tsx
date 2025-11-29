/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from "react";
import { useState } from "react";

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import ModalNotification from "@/app/components/ui/ModalNotification";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { toast, useToast } from "@/app/components/ui/toast/use-toast";
import { Icons } from "@/app/icons";
import { createOrder } from "@/app/services/ordersApi";
import { useUserStore } from "@/app/store/userStore";

interface AbroadFormProps {
  onBack: () => void;
  onClose: () => void;
}

const AbroadForm: React.FC<AbroadFormProps> = ({ onBack, onClose }) => {
  const [currentPage, setCurrentPage] = useState<number>(1); // Added for page navigation
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [isDraftModalOpen, setIsDraftModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { userMe } = useUserStore();

  const [formData, setFormData] = useState({
    // Page 2: Basic info
    customerType: "",
    customerCode: "",
    customerName: "",
    product: "",
    productWeight: "",
    vehicleType: "", // Ensure this is used or removed if not applicable
    vehicleSize: "", // Ensure this is used or removed if not applicable

    // Page 1: Shipping details
    bookingNo: "",
    shippingLine: "",
    shipper: "",
    shipperLoad: "",
    consignee: "",
    agent: "",
    placeOfReceipt: "", // New
    portOfLoading: "",
    transhipmentPort: "", // New
    portOfDischarge: "",
    finalDestinationAddress: "", // New (for shippingInfo.finalDestinationAddress)
    feederVessel: "",
    motherVessel: "",
    thirdConnectingVessel: "", // New
    etd: "", // New (Estimated Time of Departure)
    eta: "", // New (Estimated Time of Arrival)
    cyCfsDate: "", // New
    cyEmptyCfsContainerAt: "", // New
    returnDate: "", // New
    returnFullContainerAt: "", // New
    customsPaperlessRef: "",
    customsPaperlessCode: "",
    closingTime: "",
    freightTerm: "",
    commodity: "", // New
    volume: "", // New

    // Page 2: Location info
    originCountry: "TH",
    originAddress: "",
    originLat: "",
    originLng: "",
    destinationCountry: "",
    destinationAddress: "", // This is likely the main delivery address, distinct from finalDestinationAddress for shipping docs
    destinationLat: "",
    destinationLng: "",

    // Page 2: Timing
    pickupDateTime: "",
    deliveryDateTime: "", // Main delivery date to customer

    // Page 2: Container info (can also be part of page 1, adjust as needed)
    containerNo: "",
    sealNo: "",

    // Page 2: Remarks
    remarks: "",
  });

  const handleConfirmSaveDraft = async () => {
    setIsLoading(true);
    // Implement actual save draft logic if API supports it
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast({
      title: "Info",
      description:
        "ร่างรายการขนส่งระหว่างประเทศถูกบันทึกแล้ว (ยังไม่ได้ใช้งานจริง)",
      variant: "info",
    });
    setIsDraftModalOpen(false);
    setIsLoading(false);
  };

  const handleConfirm = async () => {
    if (!userMe?.id) {
      toast({
        title: "Error",
        description: "User data not loaded. Please try again.",
        variant: "warning",
      });
      return;
    }

    try {
      setIsLoading(true);
      const orderData = {
        factoryId: userMe.factory?.id || "",
        factoryName: userMe.factory?.name || "",
        orderType: "abroad" as const,
        vehicleType: formData.vehicleType,
        vehicleSize: formData.vehicleSize,
        items: formData.product, // Product name/description
        // Page 2 main destination
        startDestinationAddress: formData.originAddress,
        startDestination: `${formData.originLat},${formData.originLng}`,
        endDestinationAddress: formData.destinationAddress, // Main delivery address
        destination: `${formData.destinationLat},${formData.destinationLng}`,
        zone: "International",
        distance: 0, // Placeholder
        orderStatus: "Published",
        paymentStatus: "Unpaid",
        paymentType: "Cash", // Or make configurable
        deliveryType: "International",
        createdBy: userMe.id,
        tripInformation: {
          pickupDateTime: formData.pickupDateTime,
          deliveryDateTime: formData.deliveryDateTime, // Main delivery date
          remarks: formData.remarks,
          customerInfo: {
            type: formData.customerType,
            code: formData.customerCode,
            name: formData.customerName,
          },
          shippingInfo: {
            // Populated from Page 1 and relevant Page 2 fields
            bookingNo: formData.bookingNo,
            shippingLine: formData.shippingLine,
            shipper: formData.shipper,
            shipperLoad: formData.shipperLoad,
            consignee: formData.consignee,
            agent: formData.agent,
            placeOfReceipt: formData.placeOfReceipt,
            portOfLoading: formData.portOfLoading,
            transhipmentPortIfAny: formData.transhipmentPort, // Ensure backend field name matches
            portOfDischarge: formData.portOfDischarge,
            finalDestinationAddress: formData.finalDestinationAddress,
            feederVessel: formData.feederVessel,
            motherVessel: formData.motherVessel,
            thirdConnectingVessel: formData.thirdConnectingVessel,
            etd: formData.etd,
            eta: formData.eta,
            cyCfsDate: formData.cyCfsDate,
            cyEmptyCfsContainerAt: formData.cyEmptyCfsContainerAt,
            returnDate: formData.returnDate,
            returnFullContainerAt: formData.returnFullContainerAt,
            customsPaperlessRef: formData.customsPaperlessRef,
            customsPaperlessCode: formData.customsPaperlessCode,
            closingTime: formData.closingTime,
            freightTerm: formData.freightTerm,
            commodity: formData.commodity,
            volume: formData.volume,
            // containerNo and sealNo are top-level in example, but could also be here
          },
        },
        originProvince: formData.originCountry, // Or a more specific province if available
        containerNo: formData.containerNo, // From Page 2 (or Page 1)
        sealNo: formData.sealNo, // From Page 2 (or Page 1)
      };

      await createOrder(orderData);
      toast({
        title: "Success",
        description: "International shipping order created successfully",
        variant: "success",
      });
      setIsConfirmModalOpen(false);
      onClose();
    } catch (error) {
      console.error("Error creating international order:", error);
      toast({
        title: "Error",
        description:
          "Failed to create order. Please check the shipping details and try again.",
        variant: "warning",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    field: keyof typeof formData,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSelectChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNextPage = () => {
    if (currentPage < 2) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Helper to create input fields for Page 1 to reduce repetition
  const renderShippingInput = (
    fieldName: keyof typeof formData,
    label: string,
    placeholder = "กรุณากรอก",
    type = "text"
  ) => (
    <div>
      <p className="text-sm font-semibold text-neutral-08 mb-1">
        {label} <span className="text-urgent-fail-02">*</span>
      </p>
      <Input
        type={type}
        value={formData[fieldName] as string}
        onChange={(e) => handleInputChange(fieldName, e.target.value)}
        className="w-full border border-gray-300 rounded-md px-3 py-2"
        placeholder={placeholder}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button
              type="button"
              onClick={onBack}
              className="mr-4 p-2 hover:bg-gray-100 rounded-full"
            >
              {/* Assuming AbroadIcon is available or use ChevronLeft */}
              <Icons name="ChevronLeft" className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-semibold">
              การขนส่ง (นอกประเทศ) - หน้า {currentPage}/2
            </h1>
          </div>
          {/* Action Buttons */}
          <div className="flex gap-4">
            {currentPage === 2 && (
              <Button
                variant="main-light"
                onClick={() => setIsDraftModalOpen(true)}
                disabled={isLoading}
              >
                <p className="button">บันทึกร่าง</p>
              </Button>
            )}
            {currentPage > 1 && (
              <Button
                variant="outline"
                onClick={handlePreviousPage}
                disabled={isLoading}
                className="flex items-center"
              >
                <Icons name="ChevronLeft" className="w-5 h-5 mr-2" />
                <p className="button">ย้อนกลับ</p>
              </Button>
            )}
            <Button
              onClick={
                currentPage === 1
                  ? handleNextPage
                  : () => setIsConfirmModalOpen(true)
              }
              disabled={isLoading}
              className="flex items-center"
            >
              <p className="button">
                {currentPage === 1
                  ? "ถัดไป"
                  : isLoading
                    ? "กำลังบันทึก..."
                    : "ยืนยันการเพิ่มรายการขนส่ง"}
              </p>
              {currentPage === 1 && (
                <Icons name="ChevronRight" className="w-5 h-5 ml-2" />
              )}
              {currentPage === 2 && !isLoading && (
                <Icons name="SendBulk" className="w-5 h-5 ml-2" />
              )}
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            {currentPage === 1 && (
              // Page 1: Basic Info, Route, Container, Remarks
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-6">
                {/* Left Column */}
                <div className="flex flex-col gap-6">
                  {/* ข้อมูลพื้นฐาน */}
                  <div className="flex flex-col gap-2 bg-modal-01 px-5 py-3 rounded-lg">
                    <p className="button">ข้อมูลพื้นฐาน</p>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-semibold text-neutral-08 mb-1">
                          ประเภทลูกค้า{" "}
                          <span className="text-urgent-fail-02">*</span>
                        </p>
                        <Select
                          value={formData.customerType}
                          onValueChange={(value) =>
                            handleSelectChange("customerType", value)
                          }
                        >
                          <SelectTrigger className="py-2 px-5 bg-white border-neutral-03 w-full">
                            <SelectValue placeholder="กรุณาเลือก" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="regular">ลูกค้าประจำ</SelectItem>
                            <SelectItem value="new">ลูกค้าใหม่</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-semibold text-neutral-08 mb-1">
                            รหัสลูกค้า{" "}
                            <span className="text-urgent-fail-02">*</span>
                          </p>
                          <Input
                            type="text"
                            value={formData.customerCode}
                            onChange={(e) =>
                              handleInputChange("customerCode", e.target.value)
                            }
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                            placeholder="กรุณากรอก"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-neutral-08 mb-1">
                            ชื่อลูกค้า{" "}
                            <span className="text-urgent-fail-02">*</span>
                          </p>
                          <Input
                            type="text"
                            value={formData.customerName}
                            onChange={(e) =>
                              handleInputChange("customerName", e.target.value)
                            }
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                            placeholder="กรุณากรอก"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-semibold text-neutral-08 mb-1">
                            สินค้า{" "}
                            <span className="text-urgent-fail-02">*</span>
                          </p>
                          <Input
                            type="text"
                            value={formData.product}
                            onChange={(e) =>
                              handleInputChange("product", e.target.value)
                            }
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                            placeholder="กรุณากรอก"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-neutral-08 mb-1">
                            น้ำหนักสินค้า (กก.){" "}
                            <span className="text-urgent-fail-02">*</span>
                          </p>
                          <Input
                            type="number"
                            value={formData.productWeight}
                            onChange={(e) =>
                              handleInputChange("productWeight", e.target.value)
                            }
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                            placeholder="0.00"
                          />
                        </div>
                      </div>
                      {/* Vehicle Type and Size - Add if needed for AbroadForm */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-semibold text-neutral-08 mb-1">
                            ประเภทรถ{" "}
                            <span className="text-urgent-fail-02">*</span>
                          </p>
                          <Select
                            value={formData.vehicleType}
                            onValueChange={(value) =>
                              handleSelectChange("vehicleType", value)
                            }
                          >
                            <SelectTrigger className="py-2 px-5 bg-white border-neutral-03 w-full">
                              <SelectValue placeholder="กรุณาเลือกประเภทรถ" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="container_truck_20ft">
                                รถบรรทุกตู้คอนเทนเนอร์ 20 ฟุต
                              </SelectItem>
                              <SelectItem value="container_truck_40ft">
                                รถบรรทุกตู้คอนเทนเนอร์ 40 ฟุต
                              </SelectItem>
                              {/* Add other relevant vehicle types for international shipping */}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-neutral-08 mb-1">
                            ขนาดรถ{" "}
                            <span className="text-urgent-fail-02">*</span>
                          </p>
                          <Select
                            value={formData.vehicleSize}
                            onValueChange={(value) =>
                              handleSelectChange("vehicleSize", value)
                            }
                          >
                            <SelectTrigger className="py-2 px-5 bg-white border-neutral-03 w-full">
                              <SelectValue placeholder="กรุณาเลือกขนาดรถ" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="20ft_container">
                                ตู้ 20 ฟุต
                              </SelectItem>
                              <SelectItem value="40ft_container">
                                ตู้ 40 ฟุต
                              </SelectItem>
                              <SelectItem value="40ft_hc_container">
                                ตู้ 40 ฟุต HC
                              </SelectItem>
                              {/* Add other relevant sizes */}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Container and Seal Info - can be a separate section or here */}
                  <div className="flex flex-col gap-2 bg-modal-01 px-5 py-3 rounded-lg">
                    <p className="button">ข้อมูลตู้สินค้า</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-semibold text-neutral-08 mb-1">
                          CONTAINER NO.{" "}
                          <span className="text-urgent-fail-02">*</span>
                        </p>
                        <Input
                          type="text"
                          value={formData.containerNo}
                          onChange={(e) =>
                            handleInputChange("containerNo", e.target.value)
                          }
                          className="w-full border border-gray-300 rounded-md px-3 py-2"
                          placeholder="กรุณากรอก"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-neutral-08 mb-1">
                          SEAL NO.{" "}
                          <span className="text-urgent-fail-02">*</span>
                        </p>
                        <Input
                          type="text"
                          value={formData.sealNo}
                          onChange={(e) =>
                            handleInputChange("sealNo", e.target.value)
                          }
                          className="w-full border border-gray-300 rounded-md px-3 py-2"
                          placeholder="กรุณากรอก"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="flex flex-col gap-6">
                  {/* กำหนดเส้นทาง */}
                  <div className="flex flex-col gap-2 bg-modal-01 px-5 py-3 rounded-lg">
                    <p className="button">กำหนดเส้นทาง และ วันเวลา</p>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-semibold text-neutral-08 mb-1">
                          ประเทศต้นทาง{" "}
                          <span className="text-urgent-fail-02">*</span>
                        </p>
                        <Select
                          value={formData.originCountry}
                          onValueChange={(value) =>
                            handleSelectChange("originCountry", value)
                          }
                        >
                          <SelectTrigger className="py-2 px-5 bg-white border-neutral-03 w-full">
                            <SelectValue placeholder="กรุณาเลือก" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="TH">ประเทศไทย</SelectItem>
                            {/* Add other countries if needed */}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-neutral-08 mb-1">
                          ที่อยู่ต้นทาง (สำหรับรับสินค้า){" "}
                          <span className="text-urgent-fail-02">*</span>
                        </p>
                        <textarea
                          value={formData.originAddress}
                          onChange={(e) =>
                            handleInputChange("originAddress", e.target.value)
                          }
                          className="w-full border border-gray-300 rounded-md px-3 py-2"
                          rows={2}
                          placeholder="กรุณากรอก"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-semibold text-neutral-08 mb-1">
                            ละติจูด (ต้นทาง){" "}
                            <span className="text-urgent-fail-02">*</span>
                          </p>
                          <Input
                            type="text"
                            value={formData.originLat}
                            onChange={(e) =>
                              handleInputChange("originLat", e.target.value)
                            }
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                            placeholder="ละติจูด"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-neutral-08 mb-1">
                            ลองจิจูด (ต้นทาง){" "}
                            <span className="text-urgent-fail-02">*</span>
                          </p>
                          <Input
                            type="text"
                            value={formData.originLng}
                            onChange={(e) =>
                              handleInputChange("originLng", e.target.value)
                            }
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                            placeholder="ลองจิจูด"
                          />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-neutral-08 mb-1">
                          ประเทศปลายทาง (สำหรับส่งสินค้า){" "}
                          <span className="text-urgent-fail-02">*</span>
                        </p>
                        <Select
                          value={formData.destinationCountry}
                          onValueChange={(value) =>
                            handleSelectChange("destinationCountry", value)
                          }
                        >
                          <SelectTrigger className="py-2 px-5 bg-white border-neutral-03 w-full">
                            <SelectValue placeholder="กรุณาเลือก" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="LA">ลาว</SelectItem>
                            <SelectItem value="KH">กัมพูชา</SelectItem>
                            <SelectItem value="MM">เมียนมาร์</SelectItem>
                            <SelectItem value="MY">มาเลเซีย</SelectItem>
                            <SelectItem value="VN">เวียดนาม</SelectItem>
                            {/* Add more countries */}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-neutral-08 mb-1">
                          ที่อยู่ปลายทาง (สำหรับส่งสินค้า){" "}
                          <span className="text-urgent-fail-02">*</span>
                        </p>
                        <textarea
                          value={formData.destinationAddress}
                          onChange={(e) =>
                            handleInputChange(
                              "destinationAddress",
                              e.target.value
                            )
                          }
                          className="w-full border border-gray-300 rounded-md px-3 py-2"
                          rows={2}
                          placeholder="กรุณากรอก"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-semibold text-neutral-08 mb-1">
                            ละติจูด (ปลายทาง){" "}
                            <span className="text-urgent-fail-02">*</span>
                          </p>
                          <Input
                            type="text"
                            value={formData.destinationLat}
                            onChange={(e) =>
                              handleInputChange(
                                "destinationLat",
                                e.target.value
                              )
                            }
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                            placeholder="ละติจูด"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-neutral-08 mb-1">
                            ลองจิจูด (ปลายทาง){" "}
                            <span className="text-urgent-fail-02">*</span>
                          </p>
                          <Input
                            type="text"
                            value={formData.destinationLng}
                            onChange={(e) =>
                              handleInputChange(
                                "destinationLng",
                                e.target.value
                              )
                            }
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                            placeholder="ลองจิจูด"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-semibold text-neutral-08 mb-1">
                            วันที่ - เวลารับ สินค้า{" "}
                            <span className="text-urgent-fail-02">*</span>
                          </p>
                          <Input
                            type="datetime-local"
                            value={formData.pickupDateTime}
                            onChange={(e) =>
                              handleInputChange(
                                "pickupDateTime",
                                e.target.value
                              )
                            }
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-neutral-08 mb-1">
                            วันที่ - เวลาส่ง สินค้า{" "}
                            <span className="text-urgent-fail-02">*</span>
                          </p>
                          <Input
                            type="datetime-local"
                            value={formData.deliveryDateTime}
                            onChange={(e) =>
                              handleInputChange(
                                "deliveryDateTime",
                                e.target.value
                              )
                            }
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                          />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-neutral-08 mb-1">
                          หมายเหตุ
                        </p>
                        <textarea
                          value={formData.remarks}
                          onChange={(e) =>
                            handleInputChange("remarks", e.target.value)
                          }
                          className="w-full border border-gray-300 rounded-md px-3 py-2"
                          rows={3}
                          placeholder="กรุณากรอก"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentPage === 2 && (
              // Page 2: Shipping Details
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2 bg-modal-01 px-5 py-3 rounded-lg">
                  <p className="button">
                    ข้อมูลการขนส่งทางเรือ (Shipping Details)
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4">
                    {renderShippingInput("bookingNo", "BOOKING NO.")}
                    {renderShippingInput("shippingLine", "SHIPPING LINES")}
                    {renderShippingInput("shipper", "SHIPPER")}
                    {renderShippingInput("shipperLoad", "SHIPPER LOAD")}
                    {renderShippingInput("consignee", "CONSIGNEE")}
                    {renderShippingInput("agent", "AGENT")}
                    {renderShippingInput("commodity", "COMMODITY")}
                    {renderShippingInput("volume", "VOLUME")}
                    {renderShippingInput("placeOfReceipt", "PLACE OF RECEIPT")}
                    {renderShippingInput("portOfLoading", "PORT OF LOADING")}
                    {renderShippingInput(
                      "transhipmentPort",
                      "TRANSHIPMENT PORT (IF ANY)"
                    )}
                    {renderShippingInput(
                      "portOfDischarge",
                      "PORT OF DISCHARGE"
                    )}
                    {renderShippingInput(
                      "finalDestinationAddress",
                      "FINAL DESTINATION (ADDRESS)"
                    )}
                    {renderShippingInput("feederVessel", "FEEDER VESSEL")}
                    {renderShippingInput("motherVessel", "MOTHER VESSEL")}
                    {renderShippingInput(
                      "thirdConnectingVessel",
                      "3rd CONNECTING VESSEL"
                    )}
                    {renderShippingInput(
                      "etd",
                      "ETD (DATE)",
                      "YYYY-MM-DD",
                      "date"
                    )}
                    {renderShippingInput(
                      "eta",
                      "ETA (DATE)",
                      "YYYY-MM-DD",
                      "date"
                    )}
                    {renderShippingInput(
                      "cyCfsDate",
                      "CY/CFS DATE",
                      "YYYY-MM-DD",
                      "date"
                    )}
                    {renderShippingInput(
                      "cyEmptyCfsContainerAt",
                      "CY EMPTY/CFS CONTAINER AT"
                    )}
                    {renderShippingInput(
                      "returnDate",
                      "RETURN DATE",
                      "YYYY-MM-DD",
                      "date"
                    )}
                    {renderShippingInput(
                      "returnFullContainerAt",
                      "RETURN FULL CONTAINER AT"
                    )}
                    {renderShippingInput(
                      "customsPaperlessRef",
                      "CUSTOMS PAPERLESS REF"
                    )}
                    {renderShippingInput(
                      "customsPaperlessCode",
                      "CUSTOMS PAPERLESS CODE"
                    )}
                    {renderShippingInput(
                      "closingTime",
                      "CLOSING TIME",
                      "YYYY-MM-DDTHH:mm",
                      "datetime-local"
                    )}
                    {renderShippingInput(
                      "freightTerm",
                      "FREIGHT TERM / INCO TERM"
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal SaveDraft */}
      <ModalNotification
        open={isDraftModalOpen}
        setOpen={setIsDraftModalOpen}
        title="บันทึกร่างรายการขนส่ง"
        description="คุณต้องการบันทึกร่างรายการขนส่งระหว่างประเทศนี้หรือไม่?"
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
        description="คุณต้องการบันทึกรายการขนส่งระหว่างประเทศนี้หรือไม่?"
        buttonText={isLoading ? "กำลังบันทึก..." : "ยืนยัน"}
        isConfirmOnly={false}
        icon={<Icons name="DialogInfo" className="w-16 h-16" />}
        onConfirm={handleConfirm}
      />
    </div>
  );
};

export default AbroadForm;
