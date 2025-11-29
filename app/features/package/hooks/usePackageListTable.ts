/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";

import { useToast } from "@/app/components/ui/toast/use-toast";
import { usePackagesStore } from "@/app/store/packagesStore";
import { EHttpStatusCode } from "@/app/types/enum";
import { IMeta } from "@/app/types/global";
import { IPackagesData } from "@/app/types/packagesType";

export default function usePackageListTable() {
  //#region State
  const [dataList, setDataList] = useState<IPackagesData[]>([]);
  const [selectedData, setSelectedData] = useState<IPackagesData>();
  const [pagination, setPagination] = useState<IMeta>({
    page: 1,
    limit: 10,
    total: 0,
  });
  const [openActiveModal, setOpenActiveModal] = useState<boolean>(false);
  const { toast } = useToast();

  //#endregion State
  const { getFactoryCompanyPackesList, updateActiveFactoryCompanyPackes } =
    usePackagesStore();
  //#region Store
  //#endregion Store
  //#region Fucntion
  const fetchDataList = async () => {
    const response = await getFactoryCompanyPackesList(pagination);
    setDataList(response.data.filter((x) => x.isActive));
  };

  const handleClickSelectPackage = (data: IPackagesData) => {
    setSelectedData(data);
    setOpenActiveModal(true);
  };

  const handleConfirmActive = async () => {
    if (selectedData) {
      const response = await updateActiveFactoryCompanyPackes(selectedData.id);
      if (response.statusCode === EHttpStatusCode.SUCCESS) {
        toast({
          icon: "ToastSuccess",
          variant: "success",
          description: "บันทึกสำเร็จ",
          descriptionTwo: "'รายการดำเนินการอยู่'",
        });
        setOpenActiveModal(false);
      } else {
        toast({
          icon: "ToastError",
          variant: "error",
          description: response.message.th,
        });
      }
    }
  };

  //#endregion Fucntion
  return {
    fetchDataList,
    openActiveModal,
    setOpenActiveModal,
    dataList,
    handleClickSelectPackage,
    handleConfirmActive,
    selectedData,
  };
}
