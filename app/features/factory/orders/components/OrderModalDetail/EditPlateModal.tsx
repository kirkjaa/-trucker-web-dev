"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { Button } from "@/app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import OrderMenuButton from "@/app/components/ui/featureComponents/OrderMenuButton";
import { Input } from "@/app/components/ui/input";
// import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group";
import { useToast } from "@/app/components/ui/toast/use-toast";
import { Icons } from "@/app/icons";
import { useCompanyStore } from "@/app/store/companyStore";
import { useOrderStore } from "@/app/store/ordersStore";
// import type { ICompanyById } from "@/app/types/companyType";

interface EditPlateModalProps {
  isEditPlateModalOpen: boolean;
  setIsEditPlateModalOpen: Dispatch<SetStateAction<boolean>>;
  orderId: string;
}

const EditPlateModal: React.FC<EditPlateModalProps> = ({
  isEditPlateModalOpen,
  setIsEditPlateModalOpen,
  orderId,
}) => {
  const { toast: showToast } = useToast();
  // const [activeTab, setActiveTab] = useState("company");
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  // const [isLoading, setIsLoading] = useState(false); // For submit loading
  // const [isFetchingCompanies, setIsFetchingCompanies] = useState(false); // For company list loading

  // const [fetchCompaniesError, setFetchCompaniesError] = useState<string | null>(
  //   null
  // ); // For company list fetch error

  const updateOrderCompany = useOrderStore((state) => state.updateOrderCompany);

  const allCompanyList = useCompanyStore((state) => state.allCompanyList);
  const getAllCompanyList = useCompanyStore((state) => state.getAllCompanyList);
  const companyParams = useCompanyStore((state) => state.companyParams);

  useEffect(() => {
    if (isEditPlateModalOpen && !allCompanyList) {
      // setIsFetchingCompanies(true);
      // setFetchCompaniesError(null);
      getAllCompanyList(companyParams)
        .catch(() => {
          // setFetchCompaniesError("Failed to load companies.");
        })
        .finally(() => {
          // setIsFetchingCompanies(false);
        });
    }
  }, [isEditPlateModalOpen, allCompanyList, getAllCompanyList, companyParams]);

  // useEffect(() => {
  //   if (isOpen && orderId) {
  //     // Placeholder for any order-specific logic if needed in the future
  //   }
  // }, [isOpen, orderId]);

  const handleSubmit = async () => {
    if (!selectedCompany) {
      // setError("Please select a company.");
      showToast({
        title: "Selection Required",
        description: "Please select a company before confirming.",
        variant: "error",
      });
      return;
    }
    // setIsLoading(true);
    // setError(null);
    try {
      const payload = {
        orderId: orderId,
        companyId: selectedCompany as string,
      };

      await updateOrderCompany(payload);

      console.log("Company selection submitted:", payload);
      showToast({
        title: "Success",
        description: "Company selected successfully.",
        variant: "success",
      });
      setIsEditPlateModalOpen(false);
    } catch (err) {
      console.error("Error submitting company selection:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to select company. Please try again.";
      // setError(errorMessage);
      showToast({
        title: "Error",
        description: errorMessage,
        variant: "error",
      });
    } finally {
      // setIsLoading(false);
    }
  };
  console.log(selectedCompany);
  // const renderTabContent = () => {
  //   switch (activeTab) {
  //     case "company":
  //       if (isFetchingCompanies) {
  //         return (
  //           <div className="p-4 flex justify-center items-center">
  //             <p className="ml-2">Loading companies...</p>
  //           </div>
  //         );
  //       }
  //       if (fetchCompaniesError) {
  //         return (
  //           <div className="p-4 text-red-600 text-center">
  //             {fetchCompaniesError}
  //           </div>
  //         );
  //       }
  //       if (!allCompanyList || allCompanyList.length === 0) {
  //         return (
  //           <div className="p-4 text-gray-500 text-center">
  //             No companies found.
  //           </div>
  //         );
  //       }
  //       return (
  //         <RadioGroup
  //           className="grid grid-cols-1 md:grid-cols-2 gap-4 border rounded-3xl p-4 max-h-60 w-full overflow-y-auto"
  //           onValueChange={(value) => {
  //             setSelectedCompany(value);
  //           }}
  //         >
  //           {allCompanyList.map((company: ICompanyById) => (
  //             <div
  //               key={company.id}
  //               className={clsx(
  //                 "flex items-center justify-between py-3 px-6 border rounded-[1.25rem] hover:bg-gray-50 cursor-pointer",
  //                 {
  //                   "border border-component-green bg-component-green/10":
  //                     company.id === selectedCompany,
  //                 }
  //               )}
  //             >
  //               <p className="font-semibold text-sm">{company.name}</p>

  //               <RadioGroupItem value={company.id} />
  //             </div>
  //           ))}
  //         </RadioGroup>
  //       );
  //     case "partner":
  //       return (
  //         <div className="p-4 text-gray-500 text-center">
  //           Partner selection is not yet implemented.
  //         </div>
  //       );
  //     default:
  //       return null;
  //   }
  // };

  return (
    <Dialog
      open={isEditPlateModalOpen}
      onOpenChange={(open) => {
        if (!open) {
          setIsEditPlateModalOpen(false);
          setSelectedCompany(null);
          // setError(null);
          // setFetchCompaniesError(null);
        }
      }}
    >
      <DialogContent className="max-w-[40rem] px-5" outlineCloseButton>
        <DialogHeader>
          <DialogTitle className="flex flex-col gap-4">
            <p className="text-xl font-bold">เลือกบริษัทขนส่ง</p>

            <div className="flex">
              <Input
                className="h-11 w-full rounded-l-[1.25rem] rounded-r-none border-r-0 border-neutral-04"
                placeholder="ค้นหา"
              />

              <Button className="rounded-l-none">
                <Icons name="Search" className="w-6 h-6" />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="flex gap-10 border-b text-lg font-semibold">
          <OrderMenuButton step={1} title="บริษัทขนส่ง" />
        </div>
        {/* <div className="flex-grow overflow-y-auto">{renderTabContent()}</div> */}

        <Button className="w-full" onClick={handleSubmit}>
          ยืนยัน
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default EditPlateModal;
