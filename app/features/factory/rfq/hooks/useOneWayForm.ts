import { useRef, useState } from "react";
import Papa from "papaparse";

import { useToast } from "@/app/components/ui/toast/use-toast";
import { useUploadTemplateCsvStore } from "@/app/store/uploadTemplateCsvStore";
import { RowObject } from "@/app/types/global";
import { ICreateRfqRoute } from "@/app/types/rfq/rfqType";
import { IResponseCheckDupRoute } from "@/app/types/routesType";

export default function useOneWayForm() {
  // Global State
  const { templateByFactoryId } = useUploadTemplateCsvStore();

  // Local State
  const [isOpenEditImportRouteModal, setIsOpenEditImportRouteModal] =
    useState<boolean>(false);
  const [isOpenCustomRouteModal, setIsOpenCustomRouteModal] =
    useState<boolean>(false);
  const [isOpenEditCustomRouteModal, setIsOpenEditCustomRouteModal] =
    useState<boolean>(false);
  const [isOpenCsvTableModal, setIsOpenCsvTableModal] =
    useState<boolean>(false);
  const [csvData, setCsvData] = useState<RowObject[]>([]);
  const [transformedData, setTransformedData] = useState<RowObject[]>([]);
  const [duplicateRoute, setDuplicateRoute] = useState<
    IResponseCheckDupRoute[]
  >([]);
  const [routeNotFound, setRouteNotFound] = useState<
    Partial<IResponseCheckDupRoute[]>
  >([]);
  const [isModalRouteNotFoundOpen, setIsModalRouteNotFoundOpen] =
    useState<boolean>(false);
  const [editImportRouteData, setEditImportRouteData] =
    useState<IResponseCheckDupRoute | null>(null);
  const [editCustomRouteData, setEditCustomRouteData] =
    useState<ICreateRfqRoute | null>(null);

  // Hook
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { toast } = useToast();

  // Function
  const handleClickDownloadCsv = () => {
    if (!templateByFactoryId?.customerColumns) return;

    const headerRow = ["", ...templateByFactoryId.customerColumns];
    const csvContent = [headerRow.join(",")].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "route_template.csv");
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportButtonClick = () => {
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
      setCsvData([]);
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
          const firstColIsEmpty = rowData[0]?.trim() === "";

          const isHeaderMatch =
            rowData.length === expectedHeaders.length + 1 &&
            firstColIsEmpty &&
            expectedHeaders.every(
              (col, idx) => rowData[idx + 1]?.trim() === col
            );

          if (isHeaderMatch) {
            headerRow = rowData.map((col) => col.trim());
            headerDetected = true;
          } else {
            parserInstance.abort();
            toast({
              icon: "ToastError",
              variant: "error",
              description: "ไม่สามารถนำเข้าข้อมูลได้ กรุณาติดต่อ ผู้ดูแลระบบ",
            });
            setCsvData([]);
          }
          return;
        }

        const rowObject = headerRow.reduce((acc, col, idx) => {
          if (col.trim()) {
            acc[col.trim()] = rowData[idx]?.trim() || "";
          }
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
          setIsOpenCsvTableModal(true);
        }
      },
      encoding: "UTF-8",
    });
  };

  const handleOpenCustomRouteModal = () => {
    setIsOpenCustomRouteModal(true);
  };

  const handleClickCanceledRoutes = () => {
    setDuplicateRoute([]);
    setRouteNotFound([]);
    setIsModalRouteNotFoundOpen(false);
    setCsvData([]);
    fileInputRef.current!.value = "";
  };

  const handleClickEditImportRoute = (route: IResponseCheckDupRoute) => {
    setEditImportRouteData(route);
    setIsOpenEditImportRouteModal(true);
  };

  const handleClickEditCustomRoute = (route: ICreateRfqRoute) => {
    setEditCustomRouteData(route);
    setIsOpenEditCustomRouteModal(true);
  };

  return {
    // states
    duplicateRoute,
    isOpenEditImportRouteModal,
    setIsOpenEditImportRouteModal,
    editImportRouteData,
    isOpenEditCustomRouteModal,
    setIsOpenEditCustomRouteModal,
    editCustomRouteData,
    isOpenCustomRouteModal,
    setIsOpenCustomRouteModal,
    isOpenCsvTableModal,
    setIsOpenCsvTableModal,
    csvData,
    setCsvData,
    isModalRouteNotFoundOpen,
    setIsModalRouteNotFoundOpen,
    routeNotFound,
    setDuplicateRoute,
    setRouteNotFound,
    transformedData,
    setTransformedData,

    // functions
    handleClickDownloadCsv,
    handleImportButtonClick,
    handleFileUpload,
    fileInputRef,
    handleOpenCustomRouteModal,
    handleClickCanceledRoutes,
    handleClickEditImportRoute,
    handleClickEditCustomRoute,
  };
}
