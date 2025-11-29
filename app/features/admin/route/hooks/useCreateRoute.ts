import { useState } from "react";
import { useForm } from "react-hook-form";
import { usePathname } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import { RouteForm, routeSchema } from "../validate/route-validate";

import useRouteListTable from "./useRouteListTable";

import { useToast } from "@/app/components/ui/toast/use-toast";
import { routeApi } from "@/app/services/route/routeApi";
import { useRouteStore } from "@/app/store/route/routeStore";
import { EAdminPathName, EHttpStatusCode } from "@/app/types/enum";
import { IFactoriesAndCompaniesData } from "@/app/types/factoriesAndCompaniesType";
import { EFreightType } from "@/app/types/route/routeEnum";
import { haversine } from "@/app/utils/haversine";

export default function useCreateRoute() {
  // Global State
  /* const { */
  /*   setFormCreate, */
  /*   getFormCreate, */
  /*   setOpenCreateModal, */
  /*   validateBuildDataCreate, */
  /* } = useRouteStore(); */
  const setOpenCreateModal = useRouteStore((state) => state.setOpenCreateModal);

  // Local State
  const [optionFactory, setOptionFactory] = useState<
    IFactoriesAndCompaniesData[]
  >([]);

  const [selectedFactory, setSelectedFactory] = useState<string>("");

  // Hook
  const pathName = usePathname();
  const {
    register,
    formState: { errors },
    setValue,
    getValues,
    handleSubmit,
    reset,
    watch,
    clearErrors,
  } = useForm<RouteForm>({
    resolver: zodResolver(routeSchema),
    defaultValues: {
      freight_type: pathName.includes(EAdminPathName.DOMESTICROUTE)
        ? EFreightType.DOMESTIC
        : EFreightType.INTERNATIONAL,
    },
  });
  const { toast } = useToast();
  const { fetchDataList } = useRouteListTable();

  // Function
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    return haversine(lat1, lon1, lat2, lon2);
  };

  const onSubmit = async (organizationId: number) => {
    const lastedData = getValues();
    /* const data = { */
    /*   ...lastedData, */
    /*   distance: Number(lastedData.distance), */
    /**/
    /*   origin_province_id: Number(lastedData.origin_province_id), */
    /*   origin_district_id: Number(lastedData.origin_district_id), */
    /*   origin_latitude: Number(lastedData.origin_latitude), */
    /*   origin_longitude: Number(lastedData.origin_longitude), */
    /**/
    /*   destination_province_id: Number(lastedData.destination_province_id), */
    /*   destination_district_id: Number(lastedData.destination_district_id), */
    /*   destination_latitude: Number(lastedData.destination_latitude), */
    /*   destination_longitude: Number(lastedData.destination_longitude), */
    /**/
    /*   return_point_province_id: Number(lastedData.return_point_province_id), */
    /*   return_point_district_id: Number(lastedData.return_point_district_id), */
    /*   return_point_latitude: Number(lastedData.return_point_latitude), */
    /*   return_point_longitude: Number(lastedData.return_point_longitude), */
    /* }; */

    const response = await routeApi.createRoute(organizationId, lastedData);

    if (response.statusCode === EHttpStatusCode.CREATED) {
      toast({
        icon: "ToastSuccess",
        variant: "success",
        description: "สร้างเส้นทางสำเร็จ",
      });
      fetchDataList();
      setOpenCreateModal(false);
    } else {
      toast({
        icon: "ToastError",
        variant: "error",
        description: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
      });
    }

    /* const CREATE_PATH = "create"; */
    /**/
    /* const validatedData = await validateBuildDataCreate([data]); */
    /**/
    /* if (validatedData.length > 0) { */
    /*   if (pathName.includes(CREATE_PATH)) { */
    /*     const currentForm = getFormCreate(); */
    /*     const index = currentForm.findIndex( */
    /*       (item) => item.routeFactoryCode === data.routeFactoryCode */
    /*     ); */
    /*     console.log("currentForm", currentForm); */
    /*     if (index === -1) { */
    /*       console.log("crate", [...currentForm, data]); */
    /*       setFormCreate([...currentForm, data]); */
    /*     } else { */
    /*       const updatedForm = [...currentForm]; */
    /*       updatedForm[index] = data; */
    /*       setFormCreate(updatedForm); */
    /*     } */
    /*     // setFormCreate(findById ? updatedForm : [...getFormCreate(), data]); */
    /*     setOpenCreateModal(false); */
    /*   } else { */
    /*     setFormCreate([data]); */
    /*     setOpenCreateModal(false); */
    /*     router.push(`${pathName}/${CREATE_PATH}`); */
    /*   } */
    /* } else { */
    /*   toast({ */
    /*     icon: "ToastError", */
    /*     variant: "error", */
    /*     description: data.routeFactoryCode + " ซ้ำ", */
    /*   }); */
    /* } */
  };

  return {
    pathName,
    setOptionFactory,
    optionFactory,
    register,
    errors,
    handleSubmit,
    onSubmit,
    setValue,
    reset,
    watch,
    clearErrors,
    getValues,
    calculateDistance,
    selectedFactory,
    setSelectedFactory,
  };
}
