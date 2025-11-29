import { useEffect } from "react";
import clsx from "clsx";

import useAbroadForm from "../../../../hooks/useAbroadForm";

import { Input } from "@/app/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Icons } from "@/app/icons";
import { useMasterStore } from "@/app/store/master/masterStore";
import { ERfqAbroadType } from "@/app/types/rfq/rfqEnum";
import { ICreateRfqRoute } from "@/app/types/rfq/rfqType";

interface AbroadFormProps {
  setRoutesDetails: React.Dispatch<React.SetStateAction<ICreateRfqRoute[]>>;
}

export default function AbroadForm({ setRoutesDetails }: AbroadFormProps) {
  // Global State
  const unitPriceRoutes = useMasterStore((state) => state.unitPriceRoutes);

  // Hook
  const {
    dataForCreate,
    handleChangeDataForCreate,
    selectedShippingType,
    setSelectedShippingType,
    selectedStartLocation,
    selectedEndLocation,
    selectedReturnLocation,
    allStartLocations,
    allEndLocations,
    allReturnLocations,
    handleStartLocationChange,
    handleEndLocationChange,
    handleReturnLocationChange,
    distanceForRender,
    errors,
    setErrors,
  } = useAbroadForm();

  // Use Effect
  useEffect(() => {
    if (
      dataForCreate.organization_route_id === 0 ||
      dataForCreate.unit_price_route_id === 0 ||
      dataForCreate.base_price === 0
    )
      return;

    setRoutesDetails([
      {
        organization_route_id: dataForCreate.organization_route_id,
        unit_price_route_id: dataForCreate.unit_price_route_id,
        base_price: dataForCreate.base_price,
      },
    ]);
  }, [dataForCreate]);

  // Function
  const getError = (field: string) => {
    return errors.find((error) => error.path[0] === field)?.message;
  };

  const clearFieldError = (field: string) => {
    setErrors((prev) => prev.filter((error) => error.path[0] !== field));
  };

  return (
    <div className="flex flex-col gap-4 shadow-table h-fit w-full p-5 rounded-2xl text-secondary-indigo-main">
      <p className="text-xl font-bold">ข้อมูลลูกค้า / กำหนดเส้นทาง</p>

      <RadioGroup
        value={selectedShippingType}
        className="flex gap-4 bg-modal-01 px-5 py-3 rounded-lg"
        onValueChange={(value) =>
          setSelectedShippingType(value as ERfqAbroadType)
        }
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value={ERfqAbroadType.SHIP} />
          <p className="body2">ส่งทางเรือ</p>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value={ERfqAbroadType.AIR} />
          <p className="body2">ส่งทางเครื่องบิน</p>
        </div>
      </RadioGroup>

      {/* สถานที่จัดส่ง */}
      <div className="flex flex-col gap-2 bg-modal-01 px-5 py-3 rounded-lg">
        <div className="flex items-center">
          <p className="button">สถานที่จัดส่ง</p>
        </div>

        <div className="flex flex-col gap-4 w-full h-full p-5 rounded-lg border-2 border-dashed border-neutral-03">
          <div className="flex flex-col gap-1 w-full">
            <p className="text-sm font-semibold text-neutral-08">
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

          <Icons
            name="DoubleChevronDownGreen"
            className="w-12 h-12 self-center"
          />

          <div className="flex flex-col gap-1 w-full">
            <p className="text-sm font-semibold text-neutral-08">
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

          {selectedShippingType === ERfqAbroadType.SHIP && (
            <>
              <Icons
                name="DoubleChevronDownGreen"
                className="w-12 h-12 self-center"
              />

              <div className="flex flex-col gap-1 w-full">
                <p className="text-sm font-semibold text-neutral-08">
                  จุดคืนตู้เปล่า/คืนตู้หนัก
                  <span className="text-urgent-fail-02">*</span>
                </p>

                <Select
                  value={selectedReturnLocation}
                  onValueChange={(value) => {
                    {
                      handleReturnLocationChange(value);
                    }
                  }}
                >
                  <SelectTrigger
                    className={clsx(
                      "py-2 px-5 bg-white border-neutral-03",
                      // {
                      //   "text-neutral-04": selectedReturnLocation === "",
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
                      {allReturnLocations.map((locate, index) => (
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
            </>
          )}
        </div>

        <div className="flex gap-x-2 justify-between w-full">
          <div className="flex flex-col gap-1 w-full">
            <p className="text-sm font-semibold text-neutral-08">
              ระยะทาง <span className="text-urgent-fail-02">*</span>
            </p>

            <Input
              value={distanceForRender}
              className="h-10 w-full border-2 border-neutral-03 disabled:opacity-100"
              disabled
            />
          </div>

          <div className="flex flex-col gap-1 w-full">
            <p className="text-sm font-semibold text-neutral-08">
              รูปแบบ <span className="text-urgent-fail-02">*</span>
            </p>

            <Select
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
            <p className="text-sm font-semibold text-neutral-08">
              ราคา <span className="text-urgent-fail-02">*</span>
            </p>

            <Input
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
    </div>
  );
}
