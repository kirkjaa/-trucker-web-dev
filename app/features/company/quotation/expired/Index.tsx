import SearchBar from "../../rfq/SearchBar";
import ListTable from "../components/ListTable";

import Header from "@/app/components/ui/featureComponents/Header";

export default function QuotationExpiredRender() {
  return (
    <div className="flex flex-col gap-4">
      <Header icon="SidebarWarningBulk" title="รายการหมดอายุ" />
      <SearchBar />
      <ListTable />
    </div>
  );
}
