import React, { useEffect, useState } from "react";
import clsx from "clsx";

import useCreateRoute from "../hooks/useCreateRoute";
import useCreateRouteModal from "../hooks/useCreateRouteModal";

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
import { Icons } from "@/app/icons";
import { masterApi } from "@/app/services/master/masterApi";
import {
  EAdminPathName,
  EHttpStatusCode,
  ERouteShippingType,
  ERouteType,
} from "@/app/types/enum";
import { IProvinceAndDistrict } from "@/app/types/master/masterType";
import { IRouteData } from "@/app/types/routesType";

type CreateRouteFormProps = {
  byShippingType: ERouteShippingType;
  byType: ERouteType;
  onClickCancel: () => void;
  selectedFactoryId: number;
  dataForm?: IRouteData;
};

export default function CreateRouteForm({
  // byShippingType,
  // byType,
  onClickCancel,
  selectedFactoryId,
  // dataForm,
}: CreateRouteFormProps) {
  // Local State
  const [provincesAndDistricts, setProvincesAndDistricts] =
    useState<IProvinceAndDistrict[]>();

  // Hook
  const {
    pathName,
    register,
    errors,
    handleSubmit,
    onSubmit,
    setValue,
    reset,
    watch,
    clearErrors,
    // selectedFactory,
    // setSelectedFactory,
    // getValues,
  } = useCreateRoute();
  const {
    searchFactory,
    setSearchFactory,
    optionFactory,
    // setOptionFactory,
    fetchOptionFactory,
  } = useCreateRouteModal();

  const originProvinceId = watch("origin_province_id");
  const originDistrictId = watch("origin_district_id");
  const selectedOriginProvinceId = provincesAndDistricts?.find(
    (p) => p.id === Number(originProvinceId)
  );
  const originDistricts = selectedOriginProvinceId?.districts ?? [];

  const destinationProvinceId = watch("destination_province_id");
  const destinationDistrictId = watch("destination_district_id");
  const selectedDestinationProvinceId = provincesAndDistricts?.find(
    (p) => p.id === Number(destinationProvinceId)
  );
  const destinationDistricts = selectedDestinationProvinceId?.districts ?? [];

  const returnPointProvinceId = watch("return_point_province_id");
  const returnPointDistrictId = watch("return_point_district_id");
  const selectedReturnPointProvinceId = provincesAndDistricts?.find(
    (p) => p.id === Number(returnPointProvinceId)
  );
  const returnPointDistricts = selectedReturnPointProvinceId?.districts ?? [];

  // Use Effect
  useEffect(() => {
    const fetchProvince = async () => {
      const response = await masterApi.getProvincesAndDistricts();
      if (response.statusCode === EHttpStatusCode.SUCCESS) {
        setProvincesAndDistricts(response.data);
      }
    };
    fetchProvince();
  }, []);

  useEffect(() => {
    fetchOptionFactory();
  }, [searchFactory]);

  /* useEffect(() => { */
  /*   /* fetchOptionFactory(); */
  /*   if (selectedFactoryId) { */
  /*     setSelectedFactory(selectedFactoryId); */
  /*   } */
  /*   setValue("shippingType", byShippingType); */
  /*   setValue("type", byType); */
  /* }, []); */
  /**/
  /* useEffect(() => { */
  /*   setOptionFactory(optionFactory); */
  /*   if (selectedFactoryId) { */
  /*     setValue("factoryId", selectedFactoryId); */
  /*     setValue( */
  /*       "factoryName", */
  /*       optionFactory?.find((item) => item.id === selectedFactoryId)?.name */
  /*     ); */
  /*   } */
  /* }, [selectedFactoryId, optionFactory]); */
  /**/
  /* useEffect(() => { */
  /*   if (dataForm) { */
  /*     console.log("dataForm", dataForm); */
  /**/
  /*     setSelectedFactory(dataForm.factory.id); */
  /*     setValue("type", dataForm.type); */
  /*     setValue("shippingType", dataForm.shippingType); */
  /*     setValue("routeFactoryCode", dataForm.routeFactoryCode); */
  /*     setValue("distance.value", dataForm.distance.value); */
  /*     setValue("distance.unit", dataForm.distance.unit); */
  /*     const provinceDestination = provinces.find( */
  /*       (p) => p.name_th === dataForm.masterRoute.destination.province */
  /*     ); */
  /*     if (provinceDestination) { */
  /*       const amphureDestination = amphures.find( */
  /*         (a) => a.name_th === dataForm.masterRoute.destination.district */
  /*       ); */
  /*       setSelectedDistrictDestination(amphureDestination); */
  /*     } */
  /**/
  /*     setSelectedProvinceDestination(provinceDestination); */
  /*     setValue("destination", { */
  /*       ...dataForm.masterRoute.destination, */
  /*       latitude: dataForm.masterRoute.destination.latitude!, */
  /*       longitude: dataForm.masterRoute.destination.longitude!, */
  /*       province: dataForm.masterRoute.destination.province!, */
  /*       district: dataForm.masterRoute.destination.district!, */
  /*     }); */
  /*     const provinceOrigin = provinces.find( */
  /*       (p) => p.name_th === dataForm.masterRoute.origin.province */
  /*     ); */
  /*     setSelectedProvinceOrigin(provinceOrigin); */
  /*     if (provinceOrigin) { */
  /*       const amphureOrigin = amphures.find( */
  /*         (a) => a.name_th === dataForm.masterRoute.origin.district */
  /*       ); */
  /*       setSelectedDistrictOrigin(amphureOrigin); */
  /*     } */
  /**/
  /*     setValue("origin", { */
  /*       ...dataForm.masterRoute.origin, */
  /*       latitude: dataForm.masterRoute.origin.latitude!, */
  /*       longitude: dataForm.masterRoute.origin.longitude!, */
  /*       province: dataForm.masterRoute.origin.province!, */
  /*       district: dataForm.masterRoute.origin.district!, */
  /*     }); */
  /*     if (dataForm.returnPoint) { */
  /*       const provinceReturnPoint = provinces.find( */
  /*         (p) => p.name_th === dataForm.returnPoint?.province */
  /*       ); */
  /*       setSelectedProvinceReturnPoint(provinceReturnPoint); */
  /*       if (provinceReturnPoint) { */
  /*         const amphureReturnPoint = amphures.find( */
  /*           (a) => a.name_th === dataForm.returnPoint?.district */
  /*         ); */
  /*         setSelectedDistrictReturnPoint(amphureReturnPoint); */
  /*       } */
  /*       setValue("returnPoint", { */
  /*         ...dataForm.returnPoint, */
  /*         latitude: dataForm.returnPoint.latitude!, */
  /*         longitude: dataForm.returnPoint.longitude!, */
  /*         province: dataForm.returnPoint.province!, */
  /*         district: dataForm.returnPoint.district!, */
  /*       }); */
  /*     } */
  /**/
  /*     console.log("getValues", getValues()); */
  /*   } */
  /* }, [dataForm]); */
  /**/
  /* useEffect(() => { */
  /*   setValue("factoryId", selectedFactory); */
  /*   setValue( */
  /*     "factoryName", */
  /*     optionFactory?.find((f) => f.id === selectedFactory)?.name */
  /*   ); */
  /* }, [selectedFactory]); */

  return (
    <div className="">
      <div className="bg-modal-01 p-4 rounded-xl mb-4">
        <div className="flex flex-row gap-2 p-4 w-full">
          <div className="flex flex-col gap-1 w-1/2">
            <p className="text-sm font-semibold text-neutral-08">ชื่อโรงงาน</p>

            <Select
              value={selectedFactoryId.toString()}
              /* onValueChange={(val) => { */
              /*   setSelectedFactory(val); */
              /* }} */
              disabled
            >
              <SelectTrigger className="py-2 px-5 bg-white border-neutral-03">
                <SelectValue placeholder="กรุณาเลือก" />
              </SelectTrigger>
              <SelectContent>
                <div className="p-2">
                  <Input
                    type="text"
                    placeholder="ค้นหาโรงงาน..."
                    className="w-full rounded-md border text-sm"
                    value={searchFactory}
                    onChange={(e) => setSearchFactory(e.target.value)}
                  />
                </div>
                <SelectGroup>
                  {optionFactory &&
                    optionFactory?.map((item) => (
                      <SelectItem key={item.id} value={item.id.toString()}>
                        {item.name}
                      </SelectItem>
                    ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1 w-1/2">
            <p className="text-sm font-semibold text-neutral-08">
              รหัสเส้นทางโรงงาน
              <span className="text-urgent-fail-02">*</span>
            </p>
            <Input
              className={clsx("h-10 w-full border border-neutral-03", {
                "border-red-500": errors.route_code,
              })}
              placeholder="รหัสเส้นทางโรงงาน"
              {...register("route_code", { required: true })}
            />
            {errors.route_code && (
              <div className="flex gap-2 items-center">
                <Icons name="ErrorLogin" className="w-4 h-4" />
                <p className="text-sm text-red-500 text-start pt-1">
                  {errors.route_code.message}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="bg-modal-01 p-4 rounded-xl">
        <p>สถานที่จัดส่ง</p>
        <div className="flex w-full">
          {pathName.includes(EAdminPathName.INTERNATIONALROUTE) && (
            <React.Fragment>
              <div className="flex flex-row flex-wrap gap-2 p-4 w-1/2">
                <div className="flex flex-col gap-1 w-full">
                  <p className="text-sm font-semibold text-neutral-08">
                    จุดรับตู้หนัก/รับตู้เปล่า
                    <span className="text-urgent-fail-02">*</span>
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <Select
                      onValueChange={(val) => {
                        setValue("return_point_province_id", val);
                        setValue("return_point_district_id", "");
                        clearErrors("return_point_province_id");
                      }}
                      value={returnPointProvinceId}
                    >
                      <SelectTrigger
                        className={clsx(
                          "py-2 px-5 bg-white border-neutral-03",
                          {
                            "border-red-500": errors.return_point_province_id,
                          }
                        )}
                      >
                        <SelectValue placeholder="กรุณาเลือก" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {provincesAndDistricts &&
                            provincesAndDistricts?.map((item) => (
                              <SelectItem
                                key={item.id}
                                value={item.id.toString()}
                              >
                                {item.name_th}
                              </SelectItem>
                            ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <Select
                      onValueChange={(val) => {
                        setValue("return_point_district_id", val);
                        clearErrors("return_point_district_id");
                      }}
                      value={returnPointDistrictId}
                    >
                      <SelectTrigger
                        className={clsx(
                          "py-2 px-5 bg-white border-neutral-03",
                          {
                            "border-red-500": errors.return_point_district_id,
                          }
                        )}
                      >
                        <SelectValue placeholder="กรุณาเลือก" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {returnPointDistricts.map((item) => (
                            <SelectItem
                              key={item.id}
                              value={item.id.toString()}
                            >
                              {item.name_th}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex gap-2 w-full">
                  <div className="w-1/2">
                    <p className="text-sm font-semibold text-neutral-08">
                      ละติจูด
                      <span className="text-urgent-fail-02">*</span>
                    </p>
                    <Input
                      type="number"
                      className={clsx("h-10 w-full border border-neutral-03", {
                        "border-red-500": errors.return_point_latitude,
                      })}
                      placeholder="ละติจูด"
                      {...register("return_point_latitude", {
                        required: true,
                      })}
                    />
                    {errors.return_point_latitude && (
                      <div className="flex gap-2 items-center">
                        <Icons name="ErrorLogin" className="w-4 h-4" />
                        <p className="text-sm text-red-500 text-start pt-1">
                          {errors.return_point_latitude.message}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="w-1/2">
                    <p className="text-sm font-semibold text-neutral-08">
                      ลองจิจูด
                      <span className="text-urgent-fail-02">*</span>
                    </p>
                    <Input
                      type="number"
                      className={clsx("h-10 w-full border border-neutral-03", {
                        "border-red-500": errors.return_point_longitude,
                      })}
                      placeholder="ลองจิจูด"
                      {...register("return_point_longitude", {
                        required: true,
                      })}
                    />
                    {errors.return_point_longitude && (
                      <div className="flex gap-2 items-center">
                        <Icons name="ErrorLogin" className="w-4 h-4" />
                        <p className="text-sm text-red-500 text-start pt-1">
                          {errors.return_point_longitude.message}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-center items-center">
                <Icons name={"DoubleChevronRightGreen"} className="w-10 h-10" />
              </div>
            </React.Fragment>
          )}

          <div className="flex flex-row flex-wrap gap-2 p-4 w-1/2">
            <div className="flex flex-col gap-1 w-full">
              <p className="text-sm font-semibold text-neutral-08">
                ต้นทาง <span className="text-urgent-fail-02">*</span>
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Select
                  onValueChange={(val) => {
                    setValue("origin_province_id", val);
                    setValue("origin_district_id", "");
                    clearErrors("origin_province_id");
                  }}
                  value={originProvinceId}
                >
                  <SelectTrigger
                    className={clsx("py-2 px-5 bg-white border-neutral-03", {
                      "border-red-500": errors.origin_province_id,
                    })}
                  >
                    <SelectValue placeholder="กรุณาเลือก" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {provincesAndDistricts &&
                        provincesAndDistricts?.map((item) => (
                          <SelectItem key={item.id} value={item.id.toString()}>
                            {item.name_th}
                          </SelectItem>
                        ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <Select
                  onValueChange={(val) => {
                    setValue("origin_district_id", val);
                    clearErrors("origin_district_id");
                  }}
                  value={originDistrictId}
                >
                  <SelectTrigger
                    className={clsx("py-2 px-5 bg-white border-neutral-03", {
                      "border-red-500": errors.origin_district_id,
                    })}
                  >
                    <SelectValue placeholder="กรุณาเลือก" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {originDistricts.map((item) => (
                        <SelectItem key={item.id} value={item.id.toString()}>
                          {item.name_th}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2 w-full">
              <div className="w-1/2">
                <p className="text-sm font-semibold text-neutral-08">
                  ละติจูด
                  <span className="text-urgent-fail-02">*</span>
                </p>
                <Input
                  type="number"
                  className={clsx("h-10 w-full border border-neutral-03", {
                    "border-red-500": errors.origin_latitude,
                  })}
                  placeholder="ละติจูด"
                  {...register("origin_latitude", { required: true })}
                />
                {errors.origin_latitude && (
                  <div className="flex gap-2 items-center">
                    <Icons name="ErrorLogin" className="w-4 h-4" />
                    <p className="text-sm text-red-500 text-start pt-1">
                      {errors.origin_latitude.message}
                    </p>
                  </div>
                )}
              </div>
              <div className="w-1/2">
                <p className="text-sm font-semibold text-neutral-08">
                  ลองจิจูด
                  <span className="text-urgent-fail-02">*</span>
                </p>
                <Input
                  type="number"
                  className={clsx("h-10 w-full border border-neutral-03", {
                    "border-red-500": errors.origin_longitude,
                  })}
                  placeholder="ลองจิจูด"
                  {...register("origin_longitude", { required: true })}
                />
                {errors.origin_longitude && (
                  <div className="flex gap-2 items-center">
                    <Icons name="ErrorLogin" className="w-4 h-4" />
                    <p className="text-sm text-red-500 text-start pt-1">
                      {errors.origin_longitude.message}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-center items-center">
            <Icons name={"DoubleChevronRightGreen"} className="w-10 h-10" />
          </div>
          <div className="flex flex-row flex-wrap gap-2 p-4 w-1/2">
            <div className="flex flex-col gap-1 w-full">
              <p className="text-sm font-semibold text-neutral-08">
                ปลายทาง <span className="text-urgent-fail-02">*</span>
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Select
                  onValueChange={(val) => {
                    setValue("destination_province_id", val);
                    setValue("destination_district_id", "");
                    clearErrors("destination_province_id");
                  }}
                  value={destinationProvinceId}
                >
                  <SelectTrigger
                    className={clsx("py-2 px-5 bg-white border-neutral-03", {
                      "border-red-500": errors.destination_province_id,
                    })}
                  >
                    <SelectValue placeholder="กรุณาเลือก" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {provincesAndDistricts &&
                        provincesAndDistricts?.map((item) => (
                          <SelectItem key={item.id} value={item.id.toString()}>
                            {item.name_th}
                          </SelectItem>
                        ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <Select
                  onValueChange={(val) => {
                    setValue("destination_district_id", val);
                    clearErrors("destination_district_id");
                  }}
                  value={destinationDistrictId}
                >
                  <SelectTrigger
                    className={clsx("py-2 px-5 bg-white border-neutral-03", {
                      "border-red-500": errors.destination_district_id,
                    })}
                  >
                    <SelectValue placeholder="กรุณาเลือก" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {destinationDistricts.map((item) => (
                        <SelectItem key={item.id} value={item.id.toString()}>
                          {item.name_th}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2 w-full">
              <div className="w-1/2">
                <p className="text-sm font-semibold text-neutral-08">
                  ละติจูด
                  <span className="text-urgent-fail-02">*</span>
                </p>
                <Input
                  type="number"
                  className={clsx("h-10 w-full border border-neutral-03", {
                    "border-red-500": errors.destination_latitude,
                  })}
                  placeholder="ละติจูด"
                  {...register("destination_latitude", { required: true })}
                />
                {errors.destination_latitude && (
                  <div className="flex gap-2 items-center">
                    <Icons name="ErrorLogin" className="w-4 h-4" />
                    <p className="text-sm text-red-500 text-start pt-1">
                      {errors.destination_latitude.message}
                    </p>
                  </div>
                )}
              </div>
              <div className="w-1/2">
                <p className="text-sm font-semibold text-neutral-08">
                  ลองจิจูด
                  <span className="text-urgent-fail-02">*</span>
                </p>
                <Input
                  type="number"
                  className={clsx("h-10 w-full border border-neutral-03", {
                    "border-red-500": errors.destination_longitude,
                  })}
                  placeholder="ลองจิจูด"
                  {...register("destination_longitude", { required: true })}
                />
                {errors.destination_longitude && (
                  <div className="flex gap-2 items-center">
                    <Icons name="ErrorLogin" className="w-4 h-4" />
                    <p className="text-sm text-red-500 text-start pt-1">
                      {errors.destination_longitude.message}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="w-full p-4">
          <div className="flex flex-row gap-1 w-full">
            <div className="w-full">
              <p className="text-sm font-semibold text-neutral-08">
                ระยะทาง
                <span className="text-urgent-fail-02">*</span>
              </p>
              <Input
                className={clsx("h-10 w-full border border-neutral-03", {
                  "border-red-500": errors.distance,
                })}
                placeholder="ระยะทาง"
                type="number"
                {...register("distance", { required: true })}
              />
              {errors.distance && (
                <div className="flex gap-2 items-center">
                  <Icons name="ErrorLogin" className="w-4 h-4" />
                  <p className="text-sm text-red-500 text-start pt-1">
                    {errors.distance.message}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="w-full py-4 flex justify-end">
        <div className="mr-4 ">
          <Button
            variant="main-light"
            className="w-40"
            onClick={() => {
              reset();
              onClickCancel();
            }}
          >
            <p>ยกเลิก</p>
          </Button>
        </div>

        <div className="">
          <Button
            className="w-40"
            onClick={handleSubmit(() => onSubmit(selectedFactoryId))}
          >
            <p>ยืนยัน</p>
          </Button>
        </div>
      </div>
    </div>
  );
}
