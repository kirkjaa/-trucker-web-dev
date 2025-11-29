import { useRef, useState } from "react";
import Papa from "papaparse";

import { useToast } from "@/app/components/ui/toast/use-toast";
import { useUploadTemplateCsvStore } from "@/app/store/uploadTemplateCsvStore";
import { RowObject } from "@/app/types/global";

export default function useImportRouteCode() {
  // Global State
  const { templateByFactoryId } = useUploadTemplateCsvStore();

  // Local State
  const [isImportCsvModalOpen, setIsImportCsvModalOpen] =
    useState<boolean>(false);
  const [csvData, setCsvData] = useState<RowObject[]>();
  const [transformedData, setTransformedData] = useState<RowObject[]>([]);

  // Hook
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { toast } = useToast();

  // Function
  const handleClickImportCsv = () => {
    if (fileInputRef.current && templateByFactoryId) {
      fileInputRef.current.value = "";
      fileInputRef.current?.click();
    } else {
      toast({
        icon: "ToastError",
        variant: "error",
        description: "ไม่สามารถนำเข้าข้อมูลได้ กรุณาติดต่อ ผู้ดูแลระบบ",
      });
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (csvData) {
      setCsvData(undefined);
    }

    const file = event.target.files?.[0];
    if (!file) return;

    event.target.value = "";

    let headerDetected = false;
    let headerRow: string[] = [];
    const rows: RowObject[] = [];

    const expectedHeaders = templateByFactoryId?.customerColumns || [];

    Papa.parse(file, {
      skipEmptyLines: true,
      step: function (row, parserInstance) {
        const rowData = row.data as string[];

        if (!headerDetected) {
          const trimmedRowData = rowData.map((col) => col.trim());
          const hasAllExpectedHeaders = expectedHeaders.every((col) =>
            trimmedRowData.includes(col)
          );

          if (hasAllExpectedHeaders) {
            headerRow = trimmedRowData;
            headerDetected = true;
          } else {
            parserInstance.abort();
            toast({
              icon: "ToastError",
              variant: "error",
              description:
                "หัวตารางไม่ตรงกับรูปแบบที่ระบบต้องการ กรุณาตรวจสอบไฟล์ CSV อีกครั้ง",
            });
            setCsvData(undefined);
          }
          return;
        }

        const rowObject = headerRow.reduce((acc, col, idx) => {
          acc[col] = rowData[idx]?.trim() || "";
          return acc;
        }, {} as RowObject);

        rows.push(rowObject);
      },
      complete: () => {
        if (rows.length > 0) {
          setCsvData(rows);

          const customerColumns = templateByFactoryId?.customerColumns || [];
          const mappedColumns = templateByFactoryId?.mappedColumns || [];

          const transformed = rows.map((row) => {
            const mapped: RowObject = {};

            customerColumns.forEach((header, idx) => {
              const mappedKey = mappedColumns[idx];
              if (mappedKey) {
                mapped[mappedKey] = row[header] ?? "";
              }
            });

            return mapped;
          });

          setTransformedData(transformed);
          setIsImportCsvModalOpen(true);
        }
      },
      encoding: "UTF-8",
    });
  };

  return {
    isImportCsvModalOpen,
    setIsImportCsvModalOpen,
    csvData,
    transformedData,
    fileInputRef,
    handleClickImportCsv,
    handleFileUpload,
  };
}
