import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { PackageForm, packageSchema } from "../validate/package";

import usePackageListTable from "./usePackageListTable";

import { useToast } from "@/app/components/ui/toast/use-toast";
import { packageApi } from "@/app/services/package/packageApi";
import { usePackageStore } from "@/app/store/package/packageStore";
import { EHttpStatusCode } from "@/app/types/enum";

export default function usePackageForm() {
  //Global State
  const setOpenPackageModal = usePackageStore(
    (state) => state.setOpenPackageModal
  );

  //Hook
  const {
    register,
    setValue,
    formState: { errors },
    handleSubmit,
    control,
    watch,
    reset,
  } = useForm<PackageForm>({
    resolver: zodResolver(packageSchema),
    defaultValues: {
      is_active: false,
      name_th: "",
      description_th: "",
      period: "",
      price: "",
      start_date: undefined,
      end_date: undefined,
    },
  });
  const { toast } = useToast();
  const { fetchDataList } = usePackageListTable();

  //Function
  const handleCreatePackage = async (data: PackageForm) => {
    const response = await packageApi.createPackage(data);
    if (response.statusCode === EHttpStatusCode.CREATED) {
      toast({
        icon: "ToastSuccess",
        variant: "success",
        description: "สร้างแพ็คเกจใหม่เสร็จสมบูรณ์",
      });
      setOpenPackageModal(false);
      fetchDataList();
    } else {
      toast({
        icon: "ToastError",
        variant: "error",
        description: response.message.th,
      });
    }
  };

  const handleUpdatePackage = async (data: PackageForm) => {
    const response = await packageApi.updatePackage(data.id!, data);
    if (response.statusCode === EHttpStatusCode.SUCCESS) {
      toast({
        icon: "ToastSuccess",
        variant: "success",
        description: "อัพเดทแพ็คเกจใหม่เสร็จสมบูรณ์",
      });
      setOpenPackageModal(false);
      fetchDataList();
    } else {
      toast({
        icon: "ToastError",
        variant: "error",
        description: response.message.th,
      });
    }
  };

  const onSubmit = (data: PackageForm) => {
    if (data.id) {
      handleUpdatePackage(data);
    } else {
      handleCreatePackage(data);
    }
  };

  return {
    register,
    errors,
    control,
    setValue,
    watch,
    reset,
    onSubmit,
    handleSubmit,
  };
}
