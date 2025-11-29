import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { z } from "zod";

import {
  createRfqAbroadSchema,
  createRfqOneWaySchema,
} from "../list-of-rfq/validate/rfqCustomRoute";

import { useToast } from "@/app/components/ui/toast/use-toast";
import { masterApi } from "@/app/services/master/masterApi";
import { organizationApi } from "@/app/services/organization/organizationApi";
import { rfqApi } from "@/app/services/rfq/rfqApi";
import { signatureApi } from "@/app/services/signature/signatureApi";
import { useSignatureStore } from "@/app/store/signature/signatureStore";
import { EFacPathName, EHttpStatusCode } from "@/app/types/enum";
import { IBaseResponseData, IOption } from "@/app/types/global";
import { ITruckSize, ITruckType } from "@/app/types/master/masterType";
import { IOrganization } from "@/app/types/organization/organizationType";
import { ERfqSendTo, ERfqType } from "@/app/types/rfq/rfqEnum";
import { ICreateRfqRoute } from "@/app/types/rfq/rfqType";
import { IRfqById } from "@/app/types/rfq/rfqType";

interface RfqSchemaParams {
  schema: z.ZodSchema<any>;
  data: any;
}

export default function useAllCreateRfqForm() {
  // Global State
  const setSignatures = useSignatureStore((state) => state.setSignatures);

  // Local State
  const [truckSizes, setTruckSizes] = useState<ITruckSize[]>();
  const [truckTypes, setTruckTypes] = useState<ITruckType[]>();
  const [companies, setCompanies] = useState<IOrganization[]>();

  // Modal State
  const [isDraftModalOpen, setIsDraftModalOpen] = useState<boolean>(false);
  const [isSendRfqModalOpen, setIsSendRfqModalOpen] = useState<boolean>(false);
  const [isSignatureModalOpen, setIsSignatureModalOpen] =
    useState<boolean>(false);

  // Data For Create State
  const [sendRfqTo, setSendRfqTo] = useState<ERfqSendTo>(ERfqSendTo.BOTH);
  const [selectedVehicleSize, setSelectedVehicleSize] = useState<string>("");
  const [selectedVehicleType, setSelectedVehicleType] = useState<string>("");
  const [contactStart, setContactStart] = useState<Date>();
  const [contactEnd, setContactEnd] = useState<Date>();
  const [selectedCompany, setSelectedCompany] = useState<IOption[]>([]);
  const [oilRatePrice, setOilRatePrice] = useState<number>(0);
  const [priceRateUp, setPriceRateUp] = useState<number>(0);
  const [priceRateDown, setPriceRateDown] = useState<number>(0);
  const [addOnEmp, setAddOnEmp] = useState<string>("");
  const [empCost, setEmpCost] = useState<string>("");
  const [selectedSignature, setSelectedSignature] = useState<number | null>(
    null
  );
  const [reason, setReason] = useState<string>("");
  /* const [reason, setReason] = useState<Tag[]>([]); */
  const [routesDetails, setRoutesDetails] = useState<ICreateRfqRoute[]>([]);

  const [errors, setErrors] = useState<z.ZodIssue[]>([]);

  // Hook
  const { toast } = useToast();
  const router = useRouter();
  const pathName = usePathname();

  // Use Effect
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      const [
        truckSizesRes,
        truckTypesRes,
        fuelPriceRes,
        companiesRes,
        signatureRes,
      ] = await Promise.all([
        masterApi.getTruckSizes(),
        masterApi.getTruckTypes(),
        masterApi.getFuelPrices(),
        organizationApi.getOrganizationsByTypeId({
          page: 1,
          limit: 10,
          typeId: 2,
        }),
        signatureApi.getSignatures(),
      ]);

      if (isMounted) {
        setTruckSizes(truckSizesRes.data);
        setTruckTypes(truckTypesRes.data);
        setCompanies(companiesRes.data);
        setSignatures(signatureRes.data);
        setOilRatePrice(fuelPriceRes.data[0].PriceToday);
        setSelectedSignature(
          signatureRes.data.find((sig) => sig.is_default === "Y")!.id
        );
      }

      return () => {
        isMounted = false;
      };
      /* await getTruckType(); */
      /* await getTruckSize(); */
      /* await getAllCompanyList({ */
      /*   page: getCompanySearchParams().page, */
      /*   limit: getCompanySearchParams().limit, */
      /* }); */
      /* await getRfqOil().then((res) => { */
      /*   setOilRatePrice(res[1].PriceToday); */
      /* }); */
      /* const userResponse = await getUserMe(); */
      /* const factoryId = userResponse.data.factory.id; */
      /**/
      /* if (factoryId) { */
      /*   await getTemplateByFactoryId(factoryId, EUploadTemplateType.CREATERFQ); */
      /*   const signaturesResponse = await getAllSignatureByFacIdOrComId({ */
      /*     factoryId, */
      /*   }); */
      /**/
      /*   const mainSignature = signaturesResponse?.data?.find( */
      /*     (sig) => sig.isMain === true */
      /*   ); */
      /**/
      /*   if (mainSignature) { */
      /*     setMainSign({ */
      /*       type: mainSignature.type, */
      /*       sign: */
      /*         mainSignature.type === "image" */
      /*           ? mainSignature.imageUrl || "" */
      /*           : mainSignature.text || "", */
      /*     }); */
      /*   } */
      /* } */
    };

    fetchData();
  }, []);

  // Constant
  const sendBidText = "ส่งใบเปิดประมูลงาน";

  // Function
  const getError = (field: string) => {
    return errors.find((error) => error.path[0] === field)?.message;
  };

  const clearFieldError = (field: string) => {
    setErrors((prev) => prev.filter((error) => error.path[0] !== field));
  };

  const handleSearchCompany = async (text: string) => {
    const res = await organizationApi.getOrganizationsByTypeId({
      page: 1,
      limit: 10,
      typeId: 2,
      search: text,
    });

    setCompanies(res.data);
  };

  const submitRfq = async () => {
    const response = await rfqApi.createRfq({
      type:
        pathName === EFacPathName.CREATE_RFQ_ONEWAY
          ? ERfqType.ONEWAY
          : ERfqType.ABROAD,
      send_type: sendRfqTo,
      price_changes_up: priceRateUp,
      price_changes_down: priceRateDown,
      truck_size_id: Number(selectedVehicleSize),
      truck_type_id: Number(selectedVehicleType),
      contract_start_date: contactStart?.toISOString() ?? "",
      contract_end_date: contactEnd?.toISOString() ?? "",
      organization_ids: selectedCompany.map((com) => Number(com.value)),
      fuel_price: oilRatePrice,
      assistant: Number(addOnEmp),
      assistant_price: Number(empCost),
      remark: reason,
      signature_id: selectedSignature ?? 0,
      routes: routesDetails,
    });
    // const response = await createRfq({
    //   factoryId: userMe?.factory?.id ?? "",
    //   active: ERfqActive.ACTIVE,
    //   rfqStatus: status,
    //   rfqType:
    //     pathName === EFacPathName.CREATE_RFQ_ONEWAY
    //       ? ERfqType.ONEWAY
    //       : ERfqType.ABROAD,
    //   sendRfqTo,
    //   vehicleSize: selectedVehicleSize,
    //   vehicleType: selectedVehicleType,
    //   contactStart: contactStart?.toISOString() ?? "",
    //   contactEnd: contactEnd?.toISOString() ?? "",
    //   companyIds: selectedCompany.map((company) => company.value.toString()),
    //   oilRatePrice,
    //   priceRateUp,
    //   priceRateDown,
    //   addOnEmp: addOnEmp?.toString() ?? "",
    //   addOnCostPerEmp: empCost?.toString() ?? "",
    //   rfqReason: reason.map((reason) => reason.text),
    //   signatureFactory: selectedSignature ?? { type: "", sign: "" },
    //   routes: routesDetails,
    // });
    return response;
  };

  const validateAndSubmitRfq = async ({ schema, data }: RfqSchemaParams) => {
    try {
      await schema.parseAsync(data);

      if (routesDetails.length === 0) {
        toast({
          icon: "ToastError",
          variant: "error",
          description: "กรุณาเพิ่มเส้นทาง",
        });
        return;
      }

      setIsSignatureModalOpen(true);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(error.issues);
        console.log("Validation failed", error.issues);
      }
    }
  };

  const handleClickSaveDraft = () => {
    setIsDraftModalOpen(true);
  };

  const handleClickSendRfq = () => {
    const isAbroad = pathName === EFacPathName.CREATE_RFQ_ABROAD;

    validateAndSubmitRfq({
      schema: isAbroad ? createRfqAbroadSchema : createRfqOneWaySchema,
      data: {
        ...(isAbroad
          ? {}
          : {
              vehicleSize: selectedVehicleSize,
              vehicleType: selectedVehicleType,
            }),
        contactStart,
        contactEnd,
        selectedCompany,
        oilRatePrice,
        priceRateUp,
        priceRateDown,
      },
    });
  };

  const handleRfqResponse = (
    res: IBaseResponseData<IRfqById>,
    successMsg: string,
    errorMsg: string
  ) => {
    if (res.statusCode === EHttpStatusCode.CREATED) {
      router.push(EFacPathName.RFQLIST);
      toast({
        icon: "ToastSuccess",
        variant: "success",
        description: `${successMsg} ตรวจสอบได้ที่ #${res.data.display_code}`,
      });
    } else {
      toast({
        icon: "ToastError",
        variant: "error",
        description: errorMsg,
      });
    }
  };

  const handleClickConfirmSaveDraft = async () => {
    // const res = await submitRfq(ERfqStatus.DRAFT);
    // handleRfqResponse(
    //   res,
    //   "บันทึกใบเสนอราคาสำเร็จ",
    //   "บันทึกใบเสนอราคาไม่สำเร็จ"
    // );
  };

  const handleConfirmCreateRfq = async () => {
    const res = await submitRfq();
    handleRfqResponse(res, "สร้างใบเสนอราคาสำเร็จ", "สร้างใบเสนอราคาไม่สำเร็จ");
  };

  return {
    // const
    sendBidText,

    // states
    truckSizes,
    truckTypes,
    companies,
    handleSearchCompany,
    sendRfqTo,
    setSendRfqTo,
    setSelectedVehicleSize,
    setSelectedVehicleType,
    contactStart,
    setContactStart,
    contactEnd,
    setContactEnd,
    selectedCompany,
    setSelectedCompany,
    oilRatePrice,
    setOilRatePrice,
    setPriceRateUp,
    setPriceRateDown,
    setAddOnEmp,
    setEmpCost,
    setReason,
    routesDetails,
    setRoutesDetails,
    isDraftModalOpen,
    setIsDraftModalOpen,
    isSignatureModalOpen,
    setIsSignatureModalOpen,
    isSendRfqModalOpen,
    setIsSendRfqModalOpen,
    setSelectedSignature,
    errors,
    setErrors,

    // functions
    getError,
    clearFieldError,
    handleClickSaveDraft,
    handleClickSendRfq,
    handleClickConfirmSaveDraft,
    handleConfirmCreateRfq,
  };
}
