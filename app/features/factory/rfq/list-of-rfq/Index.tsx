import SearchBar from "../SearchBar";

import ListTable from "./components/ListTable";

import Header from "@/app/components/ui/featureComponents/Header";

export default function ListOfRfqRender() {
  return (
    <div className="flex flex-col gap-4">
      <Header icon="SidebarCashBulk" title="รายการเสนอราคา" />
      <SearchBar />
      <ListTable />
    </div>
  );
}
