import { useEffect, useState } from "react";
import clsx from "clsx";

import { Button } from "@/app/components/ui/button";
import {
  TableBody,
  TableCell,
  TableCustom,
  TableHead,
  TableHeader,
  TableRow,
  TableRowCustom,
  TableRowHead,
} from "@/app/components/ui/data-table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { ControlledPaginate } from "@/app/components/ui/pagination/ControlledPagination";
import usePagination from "@/app/hooks/usePagination";
import { useQuotationsStore } from "@/app/store/quotationsStore";
import { IBidDetailForBidById } from "@/app/types/bidsType";
import formatDecimal from "@/app/utils/formatDecimal";

interface EditOilPriceModalProps {
  isModalEditOilPriceOpen: boolean;
  setIsModalEditOilPriceOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function EditOilPriceModal({
  isModalEditOilPriceOpen,
  setIsModalEditOilPriceOpen,
}: EditOilPriceModalProps) {
  // Global State
  const { quotationById } = useQuotationsStore();

  // Local State
  const [newOilPrice, setNewOilPrice] = useState<number>(0);
  const [bidDetailForEdit, setBidDetailForEdit] = useState<
    IBidDetailForBidById[]
  >([]);

  // Hook
  const {
    page,
    setPage,
    limit,
    setLimit,
    total,
    totalPages,
    paginatedRows,
    indexPaginate,
  } = usePagination(bidDetailForEdit ?? []);

  // Use Effect
  useEffect(() => {
    const fetchAndSetData = async () => {
      if (!quotationById) return;

      await setNewOilPrice(quotationById?.bidsData.rfqData.oilRatePrice);
    };

    fetchAndSetData();
  }, [quotationById]);

  useEffect(() => {
    if (quotationById && quotationById?.bidsData?.bidDetail) {
      const updatedBidDetails = quotationById?.bidsData?.bidDetail.map(
        (detail) => {
          const bidBasePrice = detail?.bidBasePrice;
          const priceRateDown = quotationById?.rfqData?.priceRateDown;
          const priceRateUp = quotationById?.rfqData?.priceRateUp;

          const oils = Array.from({ length: 10 }, (_, index) => {
            const rangeStart =
              newOilPrice +
              (index - 4) * (quotationById?.bidsData?.oilRange ?? 0);
            const rangeEnd =
              rangeStart + (quotationById?.bidsData?.oilRange ?? 0) - 0.01;

            const oilPrice =
              index === 0
                ? `<= ${(newOilPrice - 3 * (quotationById?.bidsData?.oilRange ?? 0) - 0.01).toFixed(2)}`
                : index === 9
                  ? `>= ${(newOilPrice + 5 * (quotationById?.bidsData?.oilRange ?? 0)).toFixed(2)}`
                  : `${rangeStart.toFixed(2)} - ${rangeEnd.toFixed(2)}`;

            const calculatedBidPrice =
              (bidBasePrice *
                (100 +
                  (index < 4
                    ? (4 - index) * -priceRateDown
                    : (index - 4) * priceRateUp))) /
              100;

            return {
              sequence: index + 1,
              oilPrice,
              bidPrice: parseFloat(calculatedBidPrice.toFixed(2)),
            };
          });

          return {
            ...detail,
            oils,
          };
        }
      );
      console.log(updatedBidDetails);
      // Update bidDetails state
      setBidDetailForEdit(updatedBidDetails);
    }
  }, [quotationById, newOilPrice]);

  // Function
  const handleClickCancelEditOilPrice = () => {
    setIsModalEditOilPriceOpen(false);
    setNewOilPrice(quotationById?.bidsData.rfqData.oilRatePrice ?? 0);
  };

  const handleClickConfirmEditOilPrice = () => {
    console.log(bidDetailForEdit);
    setIsModalEditOilPriceOpen(false);
  };

  return (
    <Dialog
      open={isModalEditOilPriceOpen}
      onOpenChange={setIsModalEditOilPriceOpen}
    >
      <DialogContent
        className="text-secondary-indigo-main w-full max-w-[85rem] px-5 overflow-x-auto"
        removeCloseBtn
      >
        <DialogHeader>
          <DialogTitle>
            <p className="text-xl font-bold">กำหนดราคาน้ำมัน</p>
          </DialogTitle>

          {/* Oil Price Edit */}
          <div className="bg-neutral-01 w-full p-4 flex flex-col gap-2">
            <p className="text-sm font-semibold">
              ราคาน้ำมัน{" "}
              <span className="text-neutral-06">
                (บาท/ลิตร) <span className="text-urgent-fail-02">*</span>
              </span>
            </p>

            <Input
              value={newOilPrice}
              type="number"
              className="h-10 w-full border border-neutral-03"
              placeholder="0.00"
              min={1}
              onWheel={(e) => (e.target as HTMLElement).blur()}
              onChange={(e) => {
                const value = e.target.value;
                setNewOilPrice(Number(value));
              }}
            />
          </div>

          {/* Content */}
          <div className="flex flex-col gap-4">
            <div className="flex gap-2 max-w-full h-fit overflow-x-auto">
              {/* Table */}
              <TableCustom className="text-sm w-[480px]">
                <TableHeader>
                  <TableRowHead className="bg-neutral-01 h-20">
                    <TableHead className="w-[2%]">#</TableHead>
                    <TableHead className="w-[49%]">ต้นทาง</TableHead>
                    <TableHead className="w-[49%]">ปลายทาง</TableHead>
                  </TableRowHead>
                </TableHeader>
                <TableBody>
                  {paginatedRows?.map(
                    (bid: IBidDetailForBidById, index: number) => (
                      <TableRow
                        className="hover:border-none h-full"
                        key={index}
                      >
                        <TableCell className="w-[2%]">
                          {indexPaginate + index + 1}
                        </TableCell>
                        <TableCell className="w-[49%]">{`${bid.routes.origin.province}/${bid.routes.origin.district}`}</TableCell>
                        <TableCell className="w-[49%]">{`${bid.routes.destination.province}/${bid.routes.destination.district}`}</TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </TableCustom>

              <div className="flex flex-col w-full">
                {paginatedRows?.map(
                  (bid: IBidDetailForBidById, bidIndex: number) => (
                    <div className="flex flex-col w-full" key={bidIndex}>
                      <div className="flex gap-2">
                        {bid.oils.map((oil) => (
                          <TableCustom
                            className="h-fit min-w-[118px] w-full"
                            key={oil.sequence}
                          >
                            {bidIndex === 0 && (
                              <TableHeader>
                                <TableRowHead
                                  className={clsx(
                                    "bg-neutral-01 h-20 w-full justify-center text-main-01",
                                    {
                                      "bg-secondary-indigo-main text-white":
                                        oil.sequence === 5, // Current rate styling
                                    }
                                  )}
                                >
                                  <TableHead className="flex flex-col gap-1 justify-center items-center text-sm">
                                    <p>{oil.oilPrice}</p>
                                    {oil.sequence === 5 && <p>(เรทปัจจุบัน)</p>}
                                  </TableHead>
                                </TableRowHead>
                              </TableHeader>
                            )}
                          </TableCustom>
                        ))}
                      </div>

                      <div className="flex gap-2 w-full">
                        {bid.oils.map((oil, index) => (
                          <div
                            className={clsx("flex w-full", {
                              "mt-2": bidIndex === 0,
                            })}
                            key={index}
                          >
                            <TableCustom
                              className="h-fit min-w-[118px] w-full"
                              key={oil.sequence}
                            >
                              <TableBody>
                                <TableRowCustom
                                  className={clsx(
                                    "text-sm h-full text-neutral-06",
                                    {
                                      "bg-primary-blue-03 text-secondary-indigo-main":
                                        oil.sequence === 5, // Current rate styling
                                    }
                                  )}
                                >
                                  <TableCell className="h-full w-full flex justify-center">
                                    <p>{formatDecimal(oil.bidPrice)}</p>
                                  </TableCell>
                                </TableRowCustom>
                              </TableBody>
                            </TableCustom>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            <ControlledPaginate
              configPagination={{
                page,
                limit,
                totalPages,
                total,
              }}
              setPage={(page) => setPage(page)}
              setLimit={(limit) => {
                setLimit(limit);
                setPage(1);
              }}
              className="bg-white rounded-lg p-4 shadow-table"
            />

            <div className="w-full flex gap-2">
              <Button
                variant="main-light"
                className="w-28 h-8"
                onClick={handleClickCancelEditOilPrice}
              >
                ยกเลิก
              </Button>
              <Button
                className="w-28 h-8"
                onClick={handleClickConfirmEditOilPrice}
              >
                ยืนยัน
              </Button>
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
