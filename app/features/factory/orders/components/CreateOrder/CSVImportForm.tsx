/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import Papa from "papaparse";

import { toast, useToast } from "@/app/components/ui/toast/use-toast";
import { Icons } from "@/app/icons";
import { createOrder } from "@/app/services/ordersApi";
import { useUserStore } from "@/app/store/userStore";

interface CSVImportFormProps {
  onBack: () => void;
  onClose: () => void;
}

interface CSVRow {
  customerType: string;
  customerCode: string;
  customerName: string;
  product: string;
  productWeight: string;
  routeCode: string;
  originLat: string;
  originLng: string;
  pickupDateTime: string;
  destinationLat: string;
  destinationLng: string;
  deliveryDateTime: string;
  remarks: string;
  vehicleType: string;
  vehicleSize: string;
}

export function CSVImportForm({ onBack, onClose }: CSVImportFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<CSVRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const { userMe } = useUserStore();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);

      Papa.parse(file, {
        header: true,
        complete: (results) => {
          setPreview(results.data as CSVRow[]);
        },
        error: (error) => {
          console.error("Error parsing CSV:", error);
          toast({
            title: "Error",
            description: "Failed to parse CSV file. Please check the format.",
            variant: "error",
          });
        },
      });
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

    if (!preview.length) {
      toast({
        title: "Error",
        description: "No data to import. Please select a valid CSV file.",
        variant: "error",
      });
      return;
    }

    try {
      setIsLoading(true);
      // Process each row in the CSV
      const results = await Promise.all(
        preview.map(async (row) => {
          const orderData = {
            factoryId: userMe.factory?.id || "",
            factoryName: userMe.factory?.name || "",
            orderType: "csvImport" as const,
            vehicleType: row.vehicleType,
            vehicleSize: row.vehicleSize,
            items: row.product,
            startDestination: `${row.originLat},${row.originLng}`,
            zone: "Zone 1",
            destination: `${row.destinationLat},${row.destinationLng}`,
            distance: 0,
            orderStatus: "Published",
            paymentStatus: "Unpaid",
            paymentType: "Cash",
            deliveryType: "Standard",
            createdBy: userMe.id,
            tripInformation: {
              pickupDateTime: row.pickupDateTime,
              deliveryDateTime: row.deliveryDateTime,
              remarks: row.remarks,
              customerInfo: {
                type: row.customerType,
                code: row.customerCode,
                name: row.customerName,
              },
            },
          };

          return createOrder(orderData);
        })
      );

      const successCount = results.filter((r) => r).length;

      toast({
        title: "Success",
        description: `Successfully created ${successCount} orders from CSV`,
        variant: "success",
      });
      setIsConfirmModalOpen(false);
      onClose();
    } catch (error) {
      console.error("Error creating orders from CSV:", error);
      toast({
        title: "Error",
        description:
          "Failed to create some orders. Please check the data and try again.",
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
        <div className="flex items-center mb-6">
          <button
            onClick={onBack}
            className="mr-4 p-2 hover:bg-gray-100 rounded-full"
          >
            <Icons name="ImportCsv" className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-semibold">นำเข้า CSV</h1>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow p-6">
          {/* File Upload Section */}
          <div className="mb-8">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
                id="csv-upload"
              />
              <label
                htmlFor="csv-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <Icons
                  name="CloudUpload"
                  className="w-12 h-12 text-gray-400 mb-4"
                />
                <p className="text-sm text-gray-600 mb-2">
                  ลากไฟล์มาวางที่นี่ หรือ{" "}
                  <span className="text-primary-600">เลือกไฟล์</span>
                </p>
                <p className="text-xs text-gray-500">รองรับไฟล์ CSV เท่านั้น</p>
              </label>
            </div>
          </div>

          {/* Preview Section */}
          {selectedFile && preview.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4">ตรวจสอบข้อมูล</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        รหัสลูกค้า
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ชื่อลูกค้า
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        สินค้า
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        เส้นทาง
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {preview.map((row, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {row.customerCode}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {row.customerName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {row.product}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {row.routeCode}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <button
              onClick={onBack}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              ยกเลิก
            </button>
            <button
              onClick={() => setIsConfirmModalOpen(true)}
              disabled={!selectedFile || preview.length === 0}
              className="px-4 py-2 bg-primary-600 text-gray-700 rounded-md hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              นำเข้าข้อมูล
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium mb-4">
              ยืนยันการนำเข้ารายการขนส่ง
            </h3>
            <p className="text-gray-500 mb-4">
              คุณต้องการนำเข้ารายการขนส่งใน {preview.length} รายการหรือไม่?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsConfirmModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                disabled={isLoading}
              >
                ยกเลิก
              </button>
              <button
                onClick={handleConfirm}
                disabled={isLoading}
                className="px-4 py-2 bg-primary-600 text-gray-700 rounded-md hover:bg-primary-700 disabled:opacity-50"
              >
                {isLoading ? "กำลังนำเข้า..." : "ยืนยัน"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
