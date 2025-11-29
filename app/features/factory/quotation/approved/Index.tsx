import SearchBar from "../../rfq/SearchBar";
import CountDetailCard from "../components/CountDetailCard";
import ListTable from "../components/ListTable";

import Header from "@/app/components/ui/featureComponents/Header";

export default function QuotationApprovedRender() {
  return (
    <div className="flex flex-col gap-4">
      <Header icon="SidebarClockBulk" title="รายการดำเนินการอยู่" />
      <CountDetailCard />
      <SearchBar />
      <ListTable />
    </div>
  );
}
