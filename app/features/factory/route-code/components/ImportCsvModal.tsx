import clsx from "clsx";
import { usePathname } from "next/navigation";

import { Button } from "@/app/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableRowHead,
} from "@/app/components/ui/data-table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { ControlledPaginate } from "@/app/components/ui/pagination/ControlledPagination";
import { useToast } from "@/app/components/ui/toast/use-toast";
import usePagination from "@/app/hooks/usePagination";
import { useRouteStore } from "@/app/store/routeStore";
import { useUserStore } from "@/app/store/userStore";
import {
  EFacPathName,
  EHttpStatusCode,
  ERouteShippingType,
  ERouteType,
} from "@/app/types/enum";
import { RowObject } from "@/app/types/global";

interface ImportCsvModalProps {
  csvData: RowObject[];
  transformedData: RowObject[];
  isImportCsvModalOpen: boolean;
  setIsImportCsvModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedShippingType: ERouteShippingType;
  setIsSelectTypeCreateRouteCodeModalOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >;
}

export default function ImportCsvModal({
  csvData,
  transformedData,
  isImportCsvModalOpen,
  setIsImportCsvModalOpen,
  selectedShippingType,
  setIsSelectTypeCreateRouteCodeModalOpen,
}: ImportCsvModalProps) {
  // Global State
  const { userMe } = useUserStore();
  const {
    createManyFactoryRoute,
    getRouteFactoryList,
    getRouteFactorySearchParams,
  } = useRouteStore();

  // Hook
  const pathName = usePathname();
  const { toast } = useToast();
  const { page, setPage, limit, setLimit, total, totalPages, paginatedRows } =
    usePagination(csvData);

  // Function
  const handleClickImportData = async () => {
    const createdRoutes = transformedData.map((item) => {
      const parseLatLong = (
        value: string
      ): { latitude: number; longitude: number } => {
        const [lat, long] = value.split(",").map((v) => parseFloat(v.trim()));
        return {
          latitude: isNaN(lat) ? 0 : lat,
          longitude: isNaN(long) ? 0 : long,
        };
      };

      return {
        factoryId: userMe?.factory?.id ?? "", // or wherever you're getting factoryId
        routeFactoryCode: item.routeFactoryCode || "",
        shippingType:
          pathName === EFacPathName.DOMESTIC_ROUTE
            ? ERouteShippingType.LANDFREIGHT
            : selectedShippingType,
        type:
          pathName === EFacPathName.DOMESTIC_ROUTE
            ? ERouteType.ONEWAY
            : ERouteType.ABROAD,
        distance: {
          value: parseFloat(item.distance || "0"),
          unit: "km",
        },
        origin: {
          province: item.originProvince || "",
          district: item.originDistrict || "",
          ...parseLatLong(item.originLatLong || ""),
        },
        destination: {
          province: item.destinationProvince || "",
          district: item.destinationDistrict || "",
          ...parseLatLong(item.destinationLatLong || ""),
        },
        returnPoint: {
          province: item.returnPointProvince || "",
          district: item.returnPointDistrict || "",
          ...parseLatLong(item.returnPointLatLong || ""),
        },
      };
    });

    await createManyFactoryRoute(createdRoutes).then((res) => {
      if (res.statusCode === EHttpStatusCode.CREATED) {
        toast({
          icon: "ToastSuccess",
          variant: "success",
          description: "เพิ่มรหัสเส้นทางสำเร็จ",
        });
        getRouteFactoryList({
          page: getRouteFactorySearchParams().page,
          limit: getRouteFactorySearchParams().limit,
          byFactoryId: userMe?.factory?.id,
          byType:
            pathName === EFacPathName.DOMESTIC_ROUTE
              ? ERouteType.ONEWAY
              : ERouteType.ABROAD,
        });
        setIsImportCsvModalOpen(false);
        setIsSelectTypeCreateRouteCodeModalOpen(false);
      } else if (res.statusCode === EHttpStatusCode.CONFLICT) {
        toast({
          icon: "ToastError",
          variant: "error",
          description:
            "บางเส้นทางไม่สามารถเพิ่มได้ เนื่องจากเส้นทางซ้ำกับรายการที่มีอยู่",
        });
      } else {
        toast({
          icon: "ToastError",
          variant: "error",
          description: "เพิ่มรหัสเส้นทางไม่สำเร็จ กรุณาลองอีกครั้ง",
        });
      }
    });
  };

  // Render Table Headers
  const renderTableHeaders = () => {
    const keys = csvData.length > 0 ? Object.keys(csvData[0]) : [];
    return (
      <TableRowHead className="bg-sidebar-bg-hover">
        {keys.map((key, index) => (
          <TableHead key={index} className="w-[10%]">
            {key}
          </TableHead>
        ))}
      </TableRowHead>
    );
  };

  // Render Table Rows
  const renderTableRows = () => {
    const rowsToFill = limit - paginatedRows.length;

    return paginatedRows && paginatedRows.length > 0 ? (
      <>
        {paginatedRows.map((data: RowObject, rowIndex: number) => (
          <TableRow key={rowIndex} className="hover:border-none">
            {Object.values(data).map((value, cellIndex) => (
              <TableCell key={cellIndex} className="w-[10%]">
                {value || "-"}
              </TableCell>
            ))}
          </TableRow>
        ))}
        {/* Render empty rows to fill the table */}
        {Array.from({ length: rowsToFill }, (_, index) => (
          <TableRow key={`empty-${index}`} className="hover:border-none">
            <TableCell
              colSpan={Object.keys(csvData[0] || {}).length + 1}
              className="h-[2.6rem]"
            >
              &nbsp;
            </TableCell>
          </TableRow>
        ))}
      </>
    ) : (
      <TableRow className="hover:border-none flex justify-center items-center">
        <TableCell
          colSpan={Object.keys(csvData[0] || {}).length + 1}
          className={clsx("py-40 font-semibold text-secondary-200", {
            "py-80": 10,
          })}
        >
          <h4 className="h-10">No data found</h4>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <Dialog open={isImportCsvModalOpen} onOpenChange={setIsImportCsvModalOpen}>
      <DialogContent
        className="text-secondary-indigo-main px-0"
        outlineCloseButton
      >
        <DialogHeader>
          <DialogTitle>
            <p className="text-xl font-bold px-5">รายการนำเข้า CSV</p>
          </DialogTitle>
        </DialogHeader>

        {/* Content */}
        <div className="flex flex-col gap-5">
          <div className="flex justify-between items-center bg-modal-01 px-5 py-3 rounded-lg">
            <p className="text-xl font-medium">
              ผลลัพธ์{" "}
              <span className="text-secondary-teal-green-main">
                {csvData.length + " " + "รายการ"}
              </span>
            </p>

            <Button className="py-1 px-7" onClick={handleClickImportData}>
              นำเข้าข้อมูล
            </Button>
          </div>

          <div className="flex flex-col px-5">
            <Table className="w-full">
              <TableHeader>{renderTableHeaders()}</TableHeader>
              <TableBody>{renderTableRows()}</TableBody>
            </Table>

            <ControlledPaginate
              configPagination={{
                page,
                limit,
                totalPages,
                total,
              }}
              setPage={(page) => setPage(page)}
              setLimit={(limit) => {
                setLimit(limit);
                setPage(1);
              }}
              className="bg-white rounded-lg p-4 shadow-table"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
