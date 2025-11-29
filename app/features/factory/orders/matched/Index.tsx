import OrderTable from "../components/OrderTable";
import SearchBar from "../SearchBar";

import Header from "@/app/components/ui/featureComponents/Header";

export default function MatchedOrderRender() {
  return (
    <div className="flex flex-col gap-4">
      <Header icon="SidebarClockBulk" title="รอดำเนินการ" />
      <SearchBar />
      <OrderTable />
    </div>
  );
}
