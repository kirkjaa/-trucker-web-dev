import OrderTable from "../components/OrderTable";
import SearchBar from "../SearchBar";

import Header from "@/app/components/ui/featureComponents/Header";

export default function CompletedOrderRender() {
  return (
    <div className="flex flex-col gap-4">
      <Header icon="ListPrimary" title="ประวัติการขนส่ง" />
      <SearchBar />
      <OrderTable />
    </div>
  );
}
