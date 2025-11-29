import { useEffect, useState } from "react";

import useAddress from "@/app/hooks/useAddress";
import { IAmphure, IProvince } from "@/app/types/addressType";
import { ICreateRouteCode } from "@/app/types/routesType";

export default function useCreateRouteCode() {
  // Local State
  const [dataForCreateRouteCode, setDataForCreateRouteCode] =
    useState<ICreateRouteCode>({
      factoryId: "",
      routeFactoryCode: "",
      shippingType: "",
      type: "",
      distance: {
        value: "",
        unit: "km",
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
  const [addressType, setAddressType] = useState<string>("");
  // Set Address Value
  const [provinceReturnPoint, setProvinceReturnPoint] = useState<IProvince[]>(
    []
  );
  const [districtReturnPoint, setDistrictReturnPoint] = useState<IAmphure[]>(
    []
  );
  const [provinceOrigin, setProvinceOrigin] = useState<IProvince[]>([]);
  const [districtOrigin, setDistrictOrigin] = useState<IAmphure[]>([]);
  const [provinceDestination, setProvinceDestination] = useState<IProvince[]>(
    []
  );
  const [districtDestination, setDistrictDestination] = useState<IAmphure[]>(
    []
  );

  // Hook
  const { provinces, amphures, updateAmphuresByProvinceName } = useAddress();

  // Use Effect
  useEffect(() => {
    setProvinceReturnPoint(provinces);
    setProvinceOrigin(provinces);
    setProvinceDestination(provinces);
  }, [provinces]);

  useEffect(() => {
    if (addressType === "returnPoint") {
      setDistrictReturnPoint(amphures);
    } else if (addressType === "destination") {
      setDistrictDestination(amphures);
    } else {
      setDistrictOrigin(amphures);
    }
  }, [amphures]);

  // Function
  const handleChangeDataForCreateRouteCode = (
    name: keyof typeof dataForCreateRouteCode,
    value: string | string[] | null
  ) => {
    setDataForCreateRouteCode((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleChangeNestedDataForCreateRouteCode = <
    T extends keyof ICreateRouteCode,
    K extends keyof ICreateRouteCode[T],
  >(
    parentKey: T,
    childKey: K,
    value: ICreateRouteCode[T][K]
  ) => {
    setDataForCreateRouteCode((prev) => ({
      ...prev,
      [parentKey]: {
        ...(typeof prev[parentKey] === "object" && prev[parentKey] !== null
          ? prev[parentKey]
          : {}),
        [childKey]: value,
      },
    }));
  };

  const onProvinceChange = (val: string, type: string) => {
    updateAmphuresByProvinceName(val);
    setAddressType(type);
  };

  return {
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
  };
}
