import { useRouter } from "next/navigation";

import { CardModal } from "@/app/components/ui/featureComponents/CardModal";
import { iconNames } from "@/app/icons";
import { EFacPathName } from "@/app/types/enum";

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
    title2: "สร้างใบเสนอราคา",
    onClick: EFacPathName.CREATE_RFQ_ONEWAY,
  },
  // {
  //   iconCard: "MultiWayIcon",
  //   title: "ส่งหลายที่",
  //   title2: "สร้างใบเสนอราคา",
  //   onClick: EFacPathName.CREATE_RFQ_MULTIWAY,
  // },
  {
    iconCard: "AbroadIcon",
    title: "นอกประเทศ",
    title2: "สร้างใบเสนอราคา",
    onClick: EFacPathName.CREATE_RFQ_ABROAD,
  },
];

export default function CardCreateRfqModal() {
  // Hook
  const router = useRouter();

  return (
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
  );
}
