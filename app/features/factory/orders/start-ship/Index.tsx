import OrderTable from "../components/OrderTable";
import SearchBar from "../SearchBar";

import Header from "@/app/components/ui/featureComponents/Header";

export default function StartShipOrderRender() {
  return (
    <div className="flex flex-col gap-4">
      <Header icon="DeliveryBulk" title="เริ่มขนส่ง" />
      <SearchBar />
      <OrderTable />
    </div>
  );
}
