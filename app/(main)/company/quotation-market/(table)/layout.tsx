import Header from "@/app/components/ui/featureComponents/Header";
import SelectedList from "@/app/features/company/rfq/quotation-market/components/SelectedList";
import SearchBar from "@/app/features/company/rfq/SearchBar";

export default function QuotationMarketDataLayOut({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4">
      <Header icon="SidebarPriceList" title="รายการเสนอราคา (ตลาด)" />
      <SearchBar />
      <SelectedList />
      {children}
    </div>
  );
}
