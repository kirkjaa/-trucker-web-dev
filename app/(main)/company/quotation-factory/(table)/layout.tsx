import Header from "@/app/components/ui/featureComponents/Header";
import SelectedList from "@/app/features/company/offer/SelectedList";
import SearchBar from "@/app/features/company/rfq/SearchBar";

export default function QuotationFactoryDataLayOut({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4">
      <Header icon="SidebarCashBulk" title="รายการเสนอราคา (โรงงาน)" />
      <SearchBar />
      <SelectedList />
      {children}
    </div>
  );
}
