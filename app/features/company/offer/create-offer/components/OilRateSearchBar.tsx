import { Button } from "@/app/components/ui/button";

interface OilRateSearchBarProps {
  isEditBidPrice: boolean;
  handleSave: () => void;
  handleClickResetValues: () => void;
}

export default function OilRateSearchBar({
  isEditBidPrice,
  handleSave,
  handleClickResetValues,
}: OilRateSearchBarProps) {
  return (
    <>
      {isEditBidPrice && (
        <div className="flex gap-2">
          <Button variant="main-light" onClick={handleClickResetValues}>
            <p>คืนค่าเริ่มต้น</p>
          </Button>
          <Button variant="main" onClick={handleSave}>
            <p>บันทึก</p>
          </Button>
        </div>
      )}
    </>
  );
}
