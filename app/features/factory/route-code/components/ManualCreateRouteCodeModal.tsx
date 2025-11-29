import { useState } from "react";
import { usePathname } from "next/navigation";
import { z } from "zod";

import useCreateRouteCode from "../hooks/useCreateRouteCode";

import { Button } from "@/app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { InputComponent } from "@/app/components/ui/featureComponents/InputComponent";
import { SelectorComponent } from "@/app/components/ui/featureComponents/SelectorComponent";
import { useToast } from "@/app/components/ui/toast/use-toast";
import { Icons } from "@/app/icons";
import { useRouteStore } from "@/app/store/routeStore";
import { useUserStore } from "@/app/store/userStore";
import {
  EFacPathName,
  EHttpStatusCode,
  ERouteShippingType,
  ERouteType,
} from "@/app/types/enum";
import { createFactoryRouteCodeSchema } from "@/app/utils/validate/route-validate";

interface ManualCreateRouteCodeModalProps {
  isManualCreateRouteCodeModalOpen: boolean;
  setIsManualCreateRouteCodeModalOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  selectedShippingType: ERouteShippingType;
  setSelectedShippingType: React.Dispatch<
    React.SetStateAction<ERouteShippingType>
  >;
}

export default function ManualCreateRouteCodeModal({
  isManualCreateRouteCodeModalOpen,
  setIsManualCreateRouteCodeModalOpen,
  selectedShippingType,
  setSelectedShippingType,
}: ManualCreateRouteCodeModalProps) {
  // Global State
  const { userMe } = useUserStore();
  const {
    createOneFactoryRoute,
    getRouteFactoryList,
    getRouteFactorySearchParams,
  } = useRouteStore();

  // Local State
  const [errors, setErrors] = useState<z.ZodIssue[]>([]);

  // Hook
  const pathName = usePathname();
  const { toast } = useToast();
  const {
    dataForCreateRouteCode,
    setDataForCreateRouteCode,
    handleChangeDataForCreateRouteCode,
    handleChangeNestedDataForCreateRouteCode,
    onProvinceChange,
    provinceReturnPoint,
    provinceOrigin,
    provinceDestination,
    districtReturnPoint,
    districtOrigin,
    districtDestination,
  } = useCreateRouteCode();

  // Function
  const getError = (field: string) => {
    return errors.find((error) => error.path[0] === field)?.message;
  };

  const clearFieldError = (field: string) => {
    setErrors((prev) => prev.filter((error) => error.path[0] !== field));
  };

  const handleClickConfirmCreateRoute = async () => {
    try {
      await createFactoryRouteCodeSchema.parseAsync({
        routeFactoryCode: dataForCreateRouteCode.routeFactoryCode,
        distance: dataForCreateRouteCode.distance.value,
        "returnPoint.province": dataForCreateRouteCode.returnPoint.province,
        "returnPoint.district": dataForCreateRouteCode.returnPoint.district,
        "returnPoint.latitude": dataForCreateRouteCode.returnPoint.latitude,
        "returnPoint.longitude": dataForCreateRouteCode.returnPoint.longitude,
        "origin.province": dataForCreateRouteCode.origin.province,
        "origin.district": dataForCreateRouteCode.origin.district,
        "origin.latitude": dataForCreateRouteCode.origin.latitude,
        "origin.longitude": dataForCreateRouteCode.origin.longitude,
        "destination.province": dataForCreateRouteCode.destination.province,
        "destination.district": dataForCreateRouteCode.destination.district,
        "destination.latitude": dataForCreateRouteCode.destination.latitude,
        "destination.longitude": dataForCreateRouteCode.destination.longitude,
      });

      await createOneFactoryRoute({
        factoryId: userMe?.factory?.id ?? "",
        routeFactoryCode: dataForCreateRouteCode.routeFactoryCode,
        shippingType:
          pathName === EFacPathName.DOMESTIC_ROUTE
            ? ERouteShippingType.LANDFREIGHT
            : selectedShippingType,
        type:
          pathName === EFacPathName.DOMESTIC_ROUTE
            ? ERouteType.ONEWAY
            : ERouteType.ABROAD,
        distance: {
          value: Number(dataForCreateRouteCode.distance.value),
          unit: "km",
        },
        origin: {
          ...dataForCreateRouteCode.origin,
          latitude: Number(dataForCreateRouteCode.origin.latitude),
          longitude: Number(dataForCreateRouteCode.origin.longitude),
        },
        destination: {
          ...dataForCreateRouteCode.destination,
          latitude: Number(dataForCreateRouteCode.destination.latitude),
          longitude: Number(dataForCreateRouteCode.destination.longitude),
        },
        returnPoint: {
          ...dataForCreateRouteCode.returnPoint,
          latitude: Number(dataForCreateRouteCode.returnPoint.latitude),
          longitude: Number(dataForCreateRouteCode.returnPoint.longitude),
        },
      }).then((res) => {
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
          setDataForCreateRouteCode({
            factoryId: "",
            routeFactoryCode: "",
            shippingType: "",
            type: "",
            distance: {
              value: "",
              unit: "",
            },
            origin: {
              province: "",
              district: "",
              latitude: "",
              longitude: "",
            },
            destination: {
              province: "",
              district: "",
              latitude: "",
              longitude: "",
            },
            returnPoint: {
              province: "",
              district: "",
              latitude: "",
              longitude: "",
            },
          });
          setIsManualCreateRouteCodeModalOpen(false);
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
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(error.issues);
        console.log("Validation failed", error.issues);
      }
    }
  };

  const handleClickCancel = () => {
    setIsManualCreateRouteCodeModalOpen(false);
    setSelectedShippingType(ERouteShippingType.SEAFREIGHT);
    setDataForCreateRouteCode({
      factoryId: "",
      routeFactoryCode: "",
      shippingType: "",
      type: "",
      distance: {
        value: "",
        unit: "",
      },
      origin: {
        province: "",
        district: "",
        latitude: "",
        longitude: "",
      },
      destination: {
        province: "",
        district: "",
        latitude: "",
        longitude: "",
      },
      returnPoint: {
        province: "",
        district: "",
        latitude: "",
        longitude: "",
      },
    });
  };

  return (
    <Dialog
      open={isManualCreateRouteCodeModalOpen}
      onOpenChange={setIsManualCreateRouteCodeModalOpen}
    >
      <DialogContent className="max-w-modal" outlineCloseButton>
        <DialogHeader>
          <DialogTitle>
            <p className="text-lg font-bold text-secondary-indigo-main">
              เพิ่มรหัสเส้นทาง
            </p>
          </DialogTitle>
        </DialogHeader>

        {/* Content */}
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2 text-neutral-08">
            <div className="flex gap-2 bg-modal-01 px-5 py-3 rounded-lg">
              <InputComponent
                title="ชื่อโรงงาน"
                validateKey="factoryName"
                state={userMe?.factory?.name}
                disabled
              />
              <InputComponent
                title="รหัสเส้นทางโรงงาน"
                state={dataForCreateRouteCode.routeFactoryCode}
                onChange={(e) => {
                  handleChangeDataForCreateRouteCode(
                    "routeFactoryCode",
                    e.target.value
                  );
                  clearFieldError("routeFactoryCode");
                }}
                validateKey="routeFactoryCode"
                getError={getError}
                isRequired
              />
            </div>

            <div className="flex flex-col gap-2 bg-modal-01 px-5 py-3 rounded-lg">
              <p className="text-base font-semibold">สถานที่จัดส่ง</p>

              <div className="flex justify-between gap-4 items-center rounded-lg p-4 border-2 border-dashed border-neutral-03">
                {pathName === EFacPathName.INTERNATIONAL_ROUTE &&
                  selectedShippingType === ERouteShippingType.SEAFREIGHT && (
                    <>
                      <div className="w-full flex flex-col gap-2">
                        <p className="text-sm font-semibold">
                          จุดรับตู้หนัก/รับตู้เปล่า
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          <SelectorComponent
                            title="จังหวัด"
                            value={dataForCreateRouteCode.returnPoint.province}
                            valueChange={(value) => {
                              {
                                onProvinceChange(value, "returnPoint");
                                handleChangeNestedDataForCreateRouteCode(
                                  "returnPoint",
                                  "province",
                                  value
                                );
                                clearFieldError("returnPoint.province");
                              }
                            }}
                            provinceJson={provinceReturnPoint}
                            validateKey="returnPoint.province"
                            getError={getError}
                            isRequired
                          />
                          <SelectorComponent
                            title="อำเภอ"
                            value={dataForCreateRouteCode.returnPoint.district}
                            valueChange={(value) => {
                              {
                                handleChangeNestedDataForCreateRouteCode(
                                  "returnPoint",
                                  "district",
                                  value
                                );
                                clearFieldError("returnPoint.district");
                              }
                            }}
                            districtJson={districtReturnPoint}
                            validateKey="returnPoint.district"
                            getError={getError}
                            isRequired
                          />
                          <InputComponent
                            title="ละติจูด"
                            state={dataForCreateRouteCode.returnPoint.latitude}
                            onChange={(e) => {
                              {
                                handleChangeNestedDataForCreateRouteCode(
                                  "returnPoint",
                                  "latitude",
                                  e.target.value
                                );
                                clearFieldError("returnPoint.latitude");
                              }
                            }}
                            validateKey="returnPoint.latitude"
                            getError={getError}
                            isNum
                            isLatLong
                            isRequired
                          />
                          <InputComponent
                            title="ลองจิจูด"
                            state={dataForCreateRouteCode.returnPoint.longitude}
                            onChange={(e) => {
                              {
                                handleChangeNestedDataForCreateRouteCode(
                                  "returnPoint",
                                  "longitude",
                                  e.target.value
                                );
                                clearFieldError("returnPoint.longitude");
                              }
                            }}
                            validateKey="returnPoint.longitude"
                            getError={getError}
                            isNum
                            isLatLong
                            isRequired
                          />
                        </div>
                      </div>

                      <div className="mt-12">
                        <Icons
                          name="DoubleChevronRightGreen"
                          className="w-14 h-14"
                        />
                      </div>
                    </>
                  )}
                <div className="w-full flex flex-col gap-2">
                  <p className="text-sm font-semibold">ต้นทาง</p>
                  <div className="grid grid-cols-2 gap-2">
                    <SelectorComponent
                      title="จังหวัด"
                      value={dataForCreateRouteCode.origin.province}
                      valueChange={(value) => {
                        {
                          onProvinceChange(value, origin);
                          handleChangeNestedDataForCreateRouteCode(
                            "origin",
                            "province",
                            value
                          );
                          clearFieldError("origin.province");
                        }
                      }}
                      provinceJson={provinceOrigin}
                      validateKey="origin.province"
                      getError={getError}
                      isRequired
                    />
                    <SelectorComponent
                      title="อำเภอ"
                      value={dataForCreateRouteCode.origin.district}
                      valueChange={(value) => {
                        {
                          handleChangeNestedDataForCreateRouteCode(
                            "origin",
                            "district",
                            value
                          );
                          clearFieldError("origin.district");
                        }
                      }}
                      districtJson={districtOrigin}
                      validateKey="origin.district"
                      getError={getError}
                      isRequired
                    />
                    <InputComponent
                      title="ละติจูด"
                      state={dataForCreateRouteCode.origin.latitude}
                      onChange={(e) => {
                        {
                          handleChangeNestedDataForCreateRouteCode(
                            "origin",
                            "latitude",
                            e.target.value
                          );
                          clearFieldError("origin.latitude");
                        }
                      }}
                      validateKey="origin.latitude"
                      getError={getError}
                      isNum
                      isLatLong
                      isRequired
                    />
                    <InputComponent
                      title="ลองจิจูด"
                      state={dataForCreateRouteCode.origin.longitude}
                      onChange={(e) => {
                        {
                          handleChangeNestedDataForCreateRouteCode(
                            "origin",
                            "longitude",
                            e.target.value
                          );
                          clearFieldError("origin.longitude");
                        }
                      }}
                      validateKey="origin.longitude"
                      getError={getError}
                      isNum
                      isLatLong
                      isRequired
                    />
                  </div>
                </div>

                <div className="mt-12">
                  <Icons name="DoubleChevronRightGreen" className="w-14 h-14" />
                </div>

                <div className="w-full flex flex-col gap-2">
                  <p className="text-sm font-semibold">ปลายทาง</p>
                  <div className="grid grid-cols-2 gap-2">
                    <SelectorComponent
                      title="จังหวัด"
                      value={dataForCreateRouteCode.destination.province}
                      valueChange={(value) => {
                        {
                          onProvinceChange(value, "destination");
                          handleChangeNestedDataForCreateRouteCode(
                            "destination",
                            "province",
                            value
                          );
                          clearFieldError("destination.province");
                        }
                      }}
                      provinceJson={provinceDestination}
                      validateKey="destination.province"
                      getError={getError}
                      isRequired
                    />
                    <SelectorComponent
                      title="อำเภอ"
                      value={dataForCreateRouteCode.destination.district}
                      valueChange={(value) => {
                        {
                          handleChangeNestedDataForCreateRouteCode(
                            "destination",
                            "district",
                            value
                          );
                          clearFieldError("destination.district");
                        }
                      }}
                      districtJson={districtDestination}
                      validateKey="destination.district"
                      getError={getError}
                      isRequired
                    />
                    <InputComponent
                      title="ละติจูด"
                      state={dataForCreateRouteCode.destination.latitude}
                      onChange={(e) => {
                        {
                          handleChangeNestedDataForCreateRouteCode(
                            "destination",
                            "latitude",
                            e.target.value
                          );
                          clearFieldError("destination.latitude");
                        }
                      }}
                      validateKey="destination.latitude"
                      getError={getError}
                      isNum
                      isLatLong
                      isRequired
                    />
                    <InputComponent
                      title="ลองจิจูด"
                      state={dataForCreateRouteCode.destination.longitude}
                      onChange={(e) => {
                        {
                          handleChangeNestedDataForCreateRouteCode(
                            "destination",
                            "longitude",
                            e.target.value
                          );
                          clearFieldError("destination.longitude");
                        }
                      }}
                      validateKey="destination.longitude"
                      getError={getError}
                      isNum
                      isLatLong
                      isRequired
                    />
                  </div>
                </div>
              </div>

              <InputComponent
                title="ระยะทาง"
                state={dataForCreateRouteCode.distance.value}
                onChange={(e) => {
                  handleChangeNestedDataForCreateRouteCode(
                    "distance",
                    "value",
                    e.target.value
                  );
                  clearFieldError("distance");
                }}
                validateKey="distance"
                getError={getError}
                isNum
                isRequired
              />
            </div>
          </div>

          {/* Button */}
          <div className="flex justify-end gap-4">
            <Button
              variant="main-light"
              className="px-16"
              onClick={handleClickCancel}
            >
              ยกเลิก
            </Button>
            <Button className="px-16" onClick={handleClickConfirmCreateRoute}>
              ยืนยัน
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
