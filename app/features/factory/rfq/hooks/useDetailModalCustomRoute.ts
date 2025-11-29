import { useEffect, useState } from "react";
import { z } from "zod";

import { masterApi } from "@/app/services/master/masterApi";
import { useMasterStore } from "@/app/store/master/masterStore";
import { useRouteStore } from "@/app/store/route/routeStore";
import { EHttpStatusCode } from "@/app/types/enum";
import { ICreateRfqRoute } from "@/app/types/rfq/rfqType";
import { EFreightType } from "@/app/types/route/routeEnum";

export default function useDetailModalCustomRoute() {
  // Global State
  const { routes, getAllRoutes } = useRouteStore((state) => ({
    routes: state.routes,
    getAllRoutes: state.getAllRoutes,
  }));
  const setUnitPriceRoutes = useMasterStore(
    (state) => state.setUnitPriceRoutes
  );

  // Local State
  const [dataForCreate, setDataForCreate] = useState<ICreateRfqRoute>({
    organization_route_id: 0,
    unit_price_route_id: 0,
    base_price: 0,
  });
  const [selectedStartLocation, setSelectedStartLocation] =
    useState<string>("");
  const [selectedEndLocation, setSelectedEndLocation] = useState<string>("");
  const [distanceForRender, setDistanceForRender] = useState<number>(0);
  const [errors, setErrors] = useState<z.ZodIssue[]>([]);
  // Data
  const [allStartLocations, setAllStartLocations] = useState<string[]>([]);
  const [allEndLocations, setAllEndLocations] = useState<string[]>([]);

  // Use Effect
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [routesRes, unitPricesRes] = await Promise.all([
          getAllRoutes({
            page: 1,
            limit: 500,
            freight_type: EFreightType.DOMESTIC,
          }),
          masterApi.getUnitPriceRoutes(),
        ]);

        if (
          routesRes.statusCode === EHttpStatusCode.SUCCESS &&
          unitPricesRes.statusCode === EHttpStatusCode.SUCCESS
        ) {
          const startLocations = [
            ...new Set(
              routesRes.data
                ?.map((item) => {
                  const province =
                    item.master_route.origin_province.name_th || "";
                  const district =
                    item.master_route.origin_district.name_th || "";
                  return province && district
                    ? `${province}/${district}`
                    : null;
                })
                .filter((location): location is string => Boolean(location))
            ),
          ];

          setAllStartLocations(startLocations);
          setUnitPriceRoutes(unitPricesRes.data);
        }
      } catch (error) {
        console.error("Error fetching route factory list:", error);
      }
    };

    fetchData();
  }, []);

  // Function
  const handleChangeDataForCreate = (
    name: keyof typeof dataForCreate,
    value: string | number
  ) => {
    setDataForCreate((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleStartLocationChange = (selectedStartLocation: string) => {
    setSelectedStartLocation(selectedStartLocation);

    try {
      const filteredEndLocations = [
        ...new Set(
          routes
            ?.filter(
              (item) =>
                `${item.master_route.origin_province.name_th}/${item.master_route.origin_district.name_th}` ===
                selectedStartLocation
            )
            .map((item) => {
              const province =
                item.master_route.destination_province.name_th || "";
              const district =
                item.master_route.destination_district.name_th || "";
              return province && district ? `${province}/${district}` : null;
            })
            .filter((location): location is string => Boolean(location))
        ),
      ];

      setAllEndLocations(filteredEndLocations);
    } catch (error) {
      console.error("Error fetching filtered end locations:", error);
    }
  };

  const handleEndLocationChange = (selectedEndLocation: string) => {
    setSelectedEndLocation(selectedEndLocation);

    const matchingRoute = routes?.find(
      (item) =>
        `${item.master_route.origin_province.name_th}/${item.master_route.origin_district.name_th}` ===
          selectedStartLocation &&
        `${item.master_route.destination_province.name_th}/${item.master_route.destination_district.name_th}` ===
          selectedEndLocation
    );

    if (matchingRoute) {
      handleChangeDataForCreate("organization_route_id", matchingRoute.id);
      setDistanceForRender(Number(matchingRoute.distance_value));
      /* setDataForCreate((prevData) => ({ */
      /*   ...prevData, */
      /*   distance: { */
      /*     value: matchingRoute.distance_value, */
      /*     unit: matchingRoute.distance_unit, */
      /*   }, */
      /* })); */
    } else {
      handleChangeDataForCreate("organization_route_id", 0);
      setDistanceForRender(0);
    }
  };

  return {
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
  };
}
