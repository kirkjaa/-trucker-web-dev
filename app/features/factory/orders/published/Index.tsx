import OrderTable from "../components/OrderTable";
import SearchBar from "../SearchBar";

import Header from "@/app/components/ui/featureComponents/Header";

export default function PublishOrderRender() {
  return (
    <div className="flex flex-col gap-4">
      <Header icon="WaitingBulk" title="รอการตอบกลับ" />
      <SearchBar />
      <OrderTable />
    </div>
  );
}
