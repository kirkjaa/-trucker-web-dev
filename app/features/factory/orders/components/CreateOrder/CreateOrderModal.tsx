"use client";

import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { CardModal } from "@/app/components/ui/featureComponents/CardModal";
import { iconNames } from "@/app/icons";
import { EFacPathName } from "@/app/types/enum";
import { cn } from "@/lib/utils";

// interface MenuItem {
//   id: "csv" | "oneway" | "multiway" | "abroad";
//   title: string;
//   description: string;
//   icon: keyof typeof iconNames;
//   path: string;
// }

interface CreateOrderModalProps {
  isCreateOrderModalOpen: boolean;
  setIsCreateOrderModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

// const menuItems = [
//   {
//     id: "csv",
//     title: "นำเข้า CSV",
//     description: "นำเข้าข้อมูลการขนส่งจากไฟล์ CSV",
//     icon: "ImportCsv",
//     path: "/factory/orders/workorder/csv",
//   },
//   {
//     id: "oneway",
//     title: "ส่งเที่ยวเดียว",
//     description: "สร้างการขนส่งแบบจุดหมายเดียว",
//     icon: "OneWayIcon",
//     path: "/factory/orders/workorder/oneway",
//   },
//   // {
//   //   id: "multiway",
//   //   title: "ส่งหลายที่",
//   //   description: "สร้างการขนส่งแบบหลายจุดหมาย",
//   //   icon: "MultiWayIcon",
//   //   path: "/factory/orders/workorder/multiway",
//   // },
//   {
//     id: "abroad",
//     title: "ส่งนอกประเทศ",
//     description: "สร้างการขนส่งระหว่างประเทศ",
//     icon: "AbroadIcon",
//     path: "/factory/orders/workorder/abroad",
//   },
// ] as MenuItem[];

interface ICardModalDetailsProps {
  iconCard: keyof typeof iconNames;
  title: string;
  title2: string;
  onClick: EFacPathName;
}

export const cardModalDetails: ICardModalDetailsProps[] = [
  {
    iconCard: "OneWayIcon",
    title: "ส่งเที่ยวเดียว",
    title2: "สร้างรายการขนส่ง",
    onClick: EFacPathName.CREATE_ORDER_ONEWAY,
  },
  // {
  //   iconCard: "MultiWayIcon",
  //   title: "ส่งหลายที่",
  //   title2: "สร้างรายการขนส่ง",
  //   onClick: EFacPathName.CREATE_ORDER_MULTIWAY,
  // },
  // {
  //   iconCard: "AbroadIcon",
  //   title: "นอกประเทศ",
  //   title2: "สร้างรายการขนส่ง",
  //   onClick: EFacPathName.CREATE_ORDER_ABROAD,
  // },
];

export function CreateOrderModal({
  isCreateOrderModalOpen,
  setIsCreateOrderModalOpen,
}: CreateOrderModalProps) {
  const router = useRouter();
  // const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  // const [showFormModal, setShowFormModal] = useState(false);
  // const { getUserMe } = useUserStore();

  // useEffect(() => {
  //   if (isOpen) {
  //     // Load user data when modal opens
  //     getUserMe().catch(console.error);
  //   }
  // }, [isOpen, getUserMe]);

  // const handleItemClick = (item: MenuItem) => {
  //   setSelectedItem(item);
  //   setShowFormModal(true);
  // };

  // const handleCloseModal = () => {
  //   setSelectedItem(null);
  //   setShowFormModal(false);
  //   onClose();
  // };

  // const handleCloseFormModal = () => {
  //   setShowFormModal(false);
  //   setSelectedItem(null);
  // };

  // const renderForm = () => {
  //   if (!showFormModal || !selectedItem) return null;

  //   const handleFormBack = () => {
  //     setShowFormModal(false);
  //   };

  //   return (
  //     <Dialog
  //       open={showFormModal}
  //       onClose={handleCloseFormModal}
  //       className="relative z-[60]"
  //     >
  //       <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
  //       <div className="fixed inset-0 flex items-center justify-center p-4">
  //         <Dialog.Panel className="w-full max-w-7xl transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all">
  //           {selectedItem.id === "csv" && (
  //             <CSVImportForm
  //               onBack={handleFormBack}
  //               onClose={handleCloseFormModal}
  //             />
  //           )}
  //           {selectedItem.id === "oneway" && (
  //             <OneWayForm
  //               onBack={handleFormBack}
  //               onClose={handleCloseFormModal}
  //               selectedTruckSize={undefined} // Added selectedTruckSize
  //             />
  //           )}
  //           {selectedItem.id === "multiway" && (
  //             <MultiWayForm
  //               onBack={handleFormBack}
  //               onClose={handleCloseFormModal}
  //             />
  //           )}
  //           {selectedItem.id === "abroad" && (
  //             <AbroadForm
  //               onBack={handleFormBack}
  //               onClose={handleCloseFormModal}
  //             />
  //           )}
  //         </Dialog.Panel>
  //       </div>
  //     </Dialog>
  //   );
  // };

  return (
    <Dialog
      open={isCreateOrderModalOpen}
      onOpenChange={setIsCreateOrderModalOpen}
    >
      <DialogContent
        className={cn("max-w-[60rem] bg-white/80", {
          "max-w-[40rem]": cardModalDetails.length !== 3,
        })}
        outlineCloseButton
      >
        <DialogHeader>
          <DialogTitle>
            <p className="text-lg font-bold">เพิ่มรายการขนส่ง</p>
          </DialogTitle>
        </DialogHeader>

        {/* Content */}
        <div className="flex justify-between items-center gap-6">
          {cardModalDetails.map((detail, index) => (
            <CardModal
              key={index}
              iconCard={detail.iconCard}
              title={detail.title}
              title2={detail.title2}
              onClick={() => {
                router.push(detail.onClick);
              }}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
    // <Dialog open={isOpen} onClose={handleCloseModal} className="relative z-50">
    //   <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
    //   <div className="fixed inset-0 flex items-center justify-center p-4">
    //     <Dialog.Panel className="w-full max-w-5xl transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
    //       <div className="flex items-center justify-between mb-6">
    //         <Dialog.Title className="text-xl font-semibold text-gray-900">
    //           เพิ่มรายการขนส่ง
    //         </Dialog.Title>
    //         <button
    //           onClick={handleCloseModal}
    //           className="rounded-full p-1 hover:bg-gray-100 transition-colors"
    //         >
    //           <Icons
    //             name="CloseSquareBulkGray"
    //             className="w-6 h-6 text-gray-500"
    //           />
    //         </button>
    //       </div>

    //       <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
    //         {menuItems.map((item) => (
    //           <button
    //             key={item.id}
    //             onClick={() => handleItemClick(item)}
    //             className="group flex items-start p-4 rounded-xl border border-gray-200 hover:border-primary-500 hover:bg-primary-50 transition-all"
    //           >
    //             <div className="flex-shrink-0 mr-4">
    //               <Icons
    //                 name={item.icon}
    //                 className="w-20 h-20 cursor-pointer"
    //               />
    //             </div>
    //             <div className="flex-grow text-left">
    //               <h3 className="font-medium text-gray-900 group-hover:text-primary-600">
    //                 {item.title}
    //               </h3>
    //               <p className="mt-1 text-sm text-gray-500">
    //                 {item.description}
    //               </p>
    //             </div>
    //             <Icons
    //               name="ChevronRight"
    //               className="w-5 h-5 text-gray-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-transform"
    //             />
    //           </button>
    //         ))}
    //       </div>
    //       {renderForm()}
    //     </Dialog.Panel>
    //   </div>
    // </Dialog>
  );
}
