/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useRef, useState } from "react";

import { toast, useToast } from "@/app/components/ui/toast/use-toast";
import { iconNames, Icons } from "@/app/icons";
import { createOrder } from "@/app/services/ordersApi";
import { useUserStore } from "@/app/store/userStore";

interface MultiWayFormProps {
  onBack: () => void;
  onClose: () => void;
}

interface Destination {
  id: number;
  routeCode: string;
  lat: string;
  lng: string;
  dateTime: string;
  remarks: string;
}

export function MultiWayForm({ onBack, onClose }: MultiWayFormProps) {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { userMe } = useUserStore();

  const [formData, setFormData] = useState({
    customerType: "",
    customerCode: "",
    customerName: "",
    product: "",
    productWeight: "",
    vehicleType: "",
    vehicleSize: "",
    remarks: "",
  });

  const [destinations, setDestinations] = useState<Destination[]>([
    {
      id: 1,
      routeCode: "",
      lat: "",
      lng: "",
      dateTime: "",
      remarks: "",
    },
  ]);

  const destinationsContainerRef = useRef<HTMLDivElement>(null);

  const scrollToDestination = (id: number) => {
    if (destinationsContainerRef.current) {
      const element = document.getElementById(`destination-${id}`);
      if (element) {
        const container = destinationsContainerRef.current;
        container.scrollTo({
          top: element.offsetTop - container.offsetTop,
          behavior: "smooth",
        });
      }
    }
  };

  useEffect(() => {
    setIsConfirmModalOpen(false);
  }, []);

  const addDestination = () => {
    const newId = destinations.length + 1;
    setDestinations([
      ...destinations,
      { id: newId, routeCode: "", lat: "", lng: "", dateTime: "", remarks: "" },
    ]);

    // Wait for state update and DOM render
    setTimeout(() => {
      scrollToDestination(newId);
    }, 100);
  };

  const removeDestination = (id: number) => {
    if (destinations.length > 1) {
      setDestinations(destinations.filter((dest) => dest.id !== id));
    }
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
        orderType: "multiWay" as const,
        vehicleType: formData.vehicleType,
        vehicleSize: formData.vehicleSize,
        items: formData.product,
        startDestination: `${destinations[0].lat},${destinations[0].lng}`,
        zone: "Zone 1", // This should come from configuration or user input
        destination: destinations
          .map((dest) => `${dest.lat},${dest.lng}`)
          .join(";"),
        distance: 0, // Calculate total distance if needed
        orderStatus: "Published",
        paymentStatus: "Unpaid",
        paymentType: "Cash",
        deliveryType: "Standard",
        createdBy: userMe.id,
        tripInformation: {
          destinations: destinations.map((dest) => ({
            routeCode: dest.routeCode,
            location: `${dest.lat},${dest.lng}`,
            dateTime: dest.dateTime,
            remarks: dest.remarks,
          })),
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
        description: "Multi-way order created successfully",
        variant: "success",
      });
      setIsConfirmModalOpen(false);
      onClose();
    } catch (error) {
      console.error("Error creating multi-way order:", error);
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button
              onClick={onBack}
              className="mr-4 p-2 hover:bg-gray-100 rounded-full"
            >
              <Icons name="MultiWayIcon" className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-semibold">การขนส่ง (ส่งหลายที่)</h1>
          </div>
          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              บันทึกร่าง
            </button>
            <button
              onClick={() => setIsConfirmModalOpen(true)}
              className="px-4 py-2 bg-primary-600 text-gray-700 rounded-md hover:bg-primary-700"
            >
              ยืนยันการเพิ่มรายการขนส่ง
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Order Details */}
              <div>
                <h2 className="text-lg font-medium mb-4">ข้อมูลการขนส่ง</h2>

                {/* Order Info Section */}
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ประเภท *
                    </label>
                    <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                      <option>กรุณาเลือก</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ลูกค้า *
                    </label>
                    <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                      <option>กรุณาเลือก</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        รหัสลูกค้า *
                      </label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        placeholder="กรุณากรอก"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ชื่อลูกค้า *
                      </label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        placeholder="กรุณากรอก"
                      />
                    </div>
                  </div>
                </div>

                {/* Product Info Section */}
                <div className="space-y-4 mb-6">
                  <h3 className="text-md font-medium">ข้อมูลสินค้าขนส่ง</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      เลือกสินค้าขนส่ง
                    </label>
                    <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                      <option>กรุณาเลือก</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      หมายเหตุ
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="กรุณากรอก"
                    />
                  </div>
                </div>

                {/* Product Details Section */}
                <div className="space-y-4">
                  <h3 className="text-md font-medium">ข้อมูลสินค้า</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        สินค้า *
                      </label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        placeholder="กรุณากรอก"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        น้ำหนักสินค้า *
                      </label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Transport Details */}
              <div className="h-[calc(100vh-200px)]">
                {" "}
                {/* Add fixed height */}
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium">กำหนดเส้นทาง</h2>
                  <button
                    onClick={addDestination}
                    className="inline-flex items-center px-3 py-1 text-sm text-primary-600 hover:text-primary-700"
                  >
                    <Icons name="Plus" className="w-4 h-4 mr-1" />
                    เพิ่มปลายทาง
                  </button>
                </div>
                <div
                  ref={destinationsContainerRef}
                  className="overflow-y-auto h-full pr-2" /* Add scroll container */
                >
                  {destinations.map((dest, index) => (
                    <div
                      key={dest.id}
                      id={`destination-${dest.id}`}
                      className="border border-gray-200 rounded-lg p-4 mb-4"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-medium">ปลายทางที่ {index + 1}</h3>
                        {destinations.length > 1 && (
                          <button
                            onClick={() => removeDestination(dest.id)}
                            className="text-red-500 hover:text-red-600"
                          >
                            <Icons name="Bin" className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            รหัสเส้นทาง *
                          </label>
                          <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                            <option>กรุณาเลือก</option>
                          </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              ละติจูด *
                            </label>
                            <input
                              type="text"
                              className="w-full border border-gray-300 rounded-md px-3 py-2"
                              placeholder="ละติจูด"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              ลองจิจูด *
                            </label>
                            <input
                              type="text"
                              className="w-full border border-gray-300 rounded-md px-3 py-2"
                              placeholder="ลองจิจูด"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            วันที่ - เวลา สินค้า *
                          </label>
                          <input
                            type="datetime-local"
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            หมายเหตุ
                          </label>
                          <input
                            type="text"
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                            placeholder="กรุณากรอก"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70]">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">ยืนยันการเพิ่มรายการขนส่ง</h3>
              <button
                onClick={() => setIsConfirmModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Icons name="OneWayIcon" className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="mb-6">
              <p className="text-sm text-gray-600">
                คุณต้องการบันทึกการเพิ่มรายการขนส่งนี้หรือไม่?
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsConfirmModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-primary-600 gray-700 rounded-md hover:bg-primary-700"
              >
                ยืนยัน
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
