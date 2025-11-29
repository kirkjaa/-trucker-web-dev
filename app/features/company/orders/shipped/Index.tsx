import OrderTable from "../components/OrderTable";
import SearchBar from "../SearchBar";

import Header from "@/app/components/ui/featureComponents/Header";

export default function ShippedOrderRender() {
  return (
    <div className="flex flex-col gap-4">
      <Header icon="LocationCheckBulk" title="ปิดงาน" />
      <SearchBar />
      <OrderTable />
    </div>
  );
}
