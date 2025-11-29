import clsx from "clsx";
import { z } from "zod";

import useDetailModalCustomRoute from "../../../../hooks/useDetailModalCustomRoute";
import { createRfqCustomRoute } from "../../../validate/rfqCustomRoute";

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { useToast } from "@/app/components/ui/toast/use-toast";
import { Icons } from "@/app/icons";
import { useMasterStore } from "@/app/store/master/masterStore";
import { ICreateRfqRoute } from "@/app/types/rfq/rfqType";

interface DetailModalCustomRouteProps {
  routesDetails: ICreateRfqRoute[];
  setIsOpenCustomRouteModal: React.Dispatch<React.SetStateAction<boolean>>;
  handleAddCustomRoute: (route: ICreateRfqRoute) => void;
}

export default function DetailModalCustomRoute({
  routesDetails,
  setIsOpenCustomRouteModal,
  handleAddCustomRoute,
}: DetailModalCustomRouteProps) {
  // Global State
  const unitPriceRoutes = useMasterStore((state) => state.unitPriceRoutes);

  // Hook
  const {
    allStartLocations,
    allEndLocations,
    dataForCreate,
    selectedStartLocation,
    selectedEndLocation,
    distanceForRender,
    errors,
    setErrors,
    handleStartLocationChange,
    handleEndLocationChange,
    handleChangeDataForCreate,
  } = useDetailModalCustomRoute();
  const { toast } = useToast();

  // Function
  const getError = (field: string) => {
    return errors.find((error) => error.path[0] === field)?.message;
  };

  const clearFieldError = (field: string) => {
    setErrors((prev) => prev.filter((error) => error.path[0] !== field));
  };

  const handleClickSubmit = async () => {
    try {
      await createRfqCustomRoute.parseAsync({
        startLocation: selectedStartLocation,
        endLocation: selectedEndLocation,
        unitPrice: dataForCreate.unit_price_route_id,
        price: dataForCreate.base_price,
      });

      // Check for duplicate route
      const isDuplicate = routesDetails.some((route) => {
        return (
          route.organization_route_id === dataForCreate.organization_route_id
        );
      });

      if (isDuplicate) {
        toast({
          icon: "ToastError",
          variant: "error",
          description: "เส้นทางนี้ถูกเพิ่มไปแล้ว กรุณาเลือกเส้นทางอื่น",
        });
        return;
      }

      handleAddCustomRoute(dataForCreate);
      setIsOpenCustomRouteModal(false);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(error.issues);
        console.log("Validation failed", error.issues);
      }
    }
  };

  return (
    <div className="flex flex-col gap-5 text-neutral-08">
      <div className="flex flex-col gap-2 bg-modal-01 px-5 py-3 rounded-lg">
        <p className="text-base font-semibold">สถานที่จัดส่ง</p>

        <div className="flex justify-between gap-4 items-center rounded-lg px-5 py-2 border-2 border-dashed border-neutral-03">
          <div className="flex flex-col gap-1 w-full">
            <p className="text-sm font-semibold ">
              ต้นทาง <span className="text-urgent-fail-02">*</span>
            </p>

            <Select
              value={selectedStartLocation}
              onValueChange={(value) => {
                {
                  handleStartLocationChange(value);
                }
              }}
            >
              <SelectTrigger
                className={clsx(
                  "py-2 px-5 bg-white border-neutral-03",
                  // {
                  //   "text-neutral-04": selectedStartLocation === "",
                  // },
                  {
                    "border-urgent-fail-02":
                      getError && getError("startLocation"),
                  }
                )}
              >
                <SelectValue placeholder="กรุณาเลือก" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {allStartLocations.map((locate, index) => (
                    <SelectItem value={locate} key={index}>
                      {locate}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            {getError("startLocation") && (
              <p className="text-red-500 text-sm">
                {getError("startLocation")}
              </p>
            )}
          </div>

          <div className="mt-6">
            <Icons name="DoubleChevronRightGreen" className="w-14 h-14" />
          </div>

          <div className="flex flex-col gap-1 w-full">
            <p className="text-sm font-semibold ">
              ปลายทาง <span className="text-urgent-fail-02">*</span>
            </p>

            <Select
              value={selectedEndLocation}
              onValueChange={(value) => {
                {
                  handleEndLocationChange(value);
                }
              }}
            >
              <SelectTrigger
                className={clsx(
                  "py-2 px-5 bg-white border-neutral-03",
                  // {
                  //   "text-neutral-04": selectedEndLocation === "",
                  // },
                  {
                    "border-urgent-fail-02":
                      getError && getError("endLocation"),
                  }
                )}
              >
                <SelectValue placeholder="กรุณาเลือก" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {allEndLocations.map((locate, index) => (
                    <SelectItem value={locate} key={index}>
                      {locate}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            {getError("endLocation") && (
              <p className="text-red-500 text-sm">{getError("endLocation")}</p>
            )}
          </div>
        </div>

        <div className="flex gap-2 rounded-lg">
          <div className="flex flex-col gap-1 w-full">
            <p className="text-sm font-semibold ">ระยะทาง</p>

            <Input
              value={distanceForRender}
              className="h-10 w-full border-2 border-neutral-03 disabled:opacity-100"
              disabled
            />
          </div>

          <div className="flex flex-col gap-1 w-full">
            <p className="text-sm font-semibold ">
              รูปแบบ <span className="text-urgent-fail-02">*</span>
            </p>

            <Select
              /* value={dataForCreate.unit_price_route_id.toString()} */
              onValueChange={(value) => {
                {
                  handleChangeDataForCreate(
                    "unit_price_route_id",
                    Number(value)
                  );
                  clearFieldError("unitPrice");
                }
              }}
            >
              <SelectTrigger
                className={clsx(
                  "py-2 px-5 bg-white border-neutral-03",
                  // {
                  //   "text-neutral-04": dataForCreate.unit === "",
                  // },
                  {
                    "border-urgent-fail-02": getError && getError("unitPrice"),
                  }
                )}
              >
                <SelectValue placeholder="ราคา" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {unitPriceRoutes?.map((unit) => (
                    <SelectItem key={unit.id} value={unit.id.toString()}>
                      {unit.name_th}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            {getError("unitPrice") && (
              <p className="text-red-500 text-sm">{getError("unitPrice")}</p>
            )}
          </div>

          <div className="flex flex-col gap-1 w-full">
            <p className="text-sm font-semibold ">
              ราคา <span className="text-urgent-fail-02">*</span>
            </p>

            <Input
              /* value={dataForCreate.base_price} */
              type="number"
              className={clsx("h-10 w-full border-neutral-03", {
                "border-urgent-fail-02": getError && getError("price"),
              })}
              placeholder="0.00"
              onWheel={(e) => (e.target as HTMLElement).blur()}
              onChange={(e) => {
                handleChangeDataForCreate("base_price", Number(e.target.value));
                clearFieldError("price");
              }}
            />

            {getError("price") && (
              <p className="text-red-500 text-sm">{getError("price")}</p>
            )}
          </div>
        </div>
      </div>

      {/* Button */}
      <div className="flex justify-end gap-4">
        <Button
          variant="main-light"
          className="px-16"
          onClick={() => setIsOpenCustomRouteModal(false)}
        >
          ยกเลิก
        </Button>
        <Button className="px-16" onClick={handleClickSubmit}>
          ยืนยัน
        </Button>
      </div>
    </div>
  );
}
