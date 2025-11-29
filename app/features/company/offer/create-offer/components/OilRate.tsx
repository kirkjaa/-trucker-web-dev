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
import { Input } from "@/app/components/ui/input";
import ModalNotification from "@/app/components/ui/ModalNotification";
import { ControlledPaginate } from "@/app/components/ui/pagination/ControlledPagination";
import { Textarea } from "@/app/components/ui/textarea";
import usePagination from "@/app/hooks/usePagination";
import { Icons } from "@/app/icons";
import { useRfqStore } from "@/app/store/rfq/rfqStore";
import {
  IPriceColumn,
  IPriceOffer,
  IRouteOfferRfq,
} from "@/app/types/offer/offerType";
import formatDecimal from "@/app/utils/formatDecimal";

interface OilRateProps {
  priceOffers: IPriceOffer[];
  setPriceOffers: React.Dispatch<React.SetStateAction<IPriceOffer[]>>;
  setOfferReason: React.Dispatch<React.SetStateAction<string>>;
  offerOilRange: string;
  setOfferOilRange: React.Dispatch<React.SetStateAction<string>>;
  columnRanges: Omit<IPriceColumn, "id">[];
  setColumnRanges: React.Dispatch<
    React.SetStateAction<Omit<IPriceColumn, "id">[]>
  >;
}

export default function OilRate({
  priceOffers,
  setPriceOffers,
  setOfferReason,
  offerOilRange,
  setOfferOilRange,
  columnRanges,
  setColumnRanges,
}: OilRateProps) {
  // Global State
  const rfqReceivedById = useRfqStore((state) => state.rfqReceivedById);

  // Local State
  const [isEditBidPrice, setIsEditBidPrice] = useState<boolean>(false);
  const [editingSequence, setEditingSequence] = useState<number | null>(null);
  const [editingValues, setEditingValues] = useState<{
    [routeId: string]: { [sequence: number]: number | null };
  }>({});
  const [isSaveNewPriceModal, setIsSaveNewPriceModal] =
    useState<boolean>(false);
  const [isRestorePriceModal, setIsRestorePriceModal] =
    useState<boolean>(false);

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
  } = usePagination(rfqReceivedById?.routes);

  // Use Effect
  useEffect(() => {
    const ranges: Omit<IPriceColumn, "id">[] = [];

    for (let seq = 1; seq <= 10; seq++) {
      let min: number, max: number;
      const fuelPrice = rfqReceivedById?.fuel_price ?? 0;

      if (seq === 5) {
        min = fuelPrice;
        max = parseFloat((fuelPrice + Number(offerOilRange) - 0.01).toFixed(2));
      } else if (seq < 5) {
        const step = 5 - seq;
        min = parseFloat((fuelPrice - Number(offerOilRange) * step).toFixed(2));
        max = parseFloat(
          (fuelPrice - Number(offerOilRange) * (step - 1) - 0.01).toFixed(2)
        );
      } else {
        const step = seq - 5;
        min = parseFloat((fuelPrice + Number(offerOilRange) * step).toFixed(2));
        max = parseFloat(
          (fuelPrice + Number(offerOilRange) * (step + 1) - 0.01).toFixed(2)
        );
      }

      ranges.push({
        sequence: seq,
        range:
          seq === 1
            ? `<= ${max}`
            : seq === 10
              ? `>= ${min}`
              : `${min} - ${max}`,
        min: seq === 1 ? 0 : min,
        max: seq === 10 ? 100 : max,
      });
    }

    setColumnRanges(ranges);
  }, [rfqReceivedById?.fuel_price, offerOilRange]);

  // Function
  const handleEditClick = (sequence: number) => {
    setEditingSequence(sequence);
    setIsEditBidPrice(true);
  };

  const handleEditChange = (
    routeId: number,
    sequence: number,
    value: number | null
  ) => {
    setEditingValues((prev) => ({
      ...prev,
      [routeId]: {
        ...prev[routeId],
        [sequence]: value,
      },
    }));
  };

  const handleSave = () => {
    const updatedOffers = priceOffers.map((offer) => {
      const routeId = offer.organization_route_id;
      const edited = editingValues[routeId];

      if (!edited) return offer;

      const updatedSeq = offer.offers.map((seqOffer) => {
        const newPrice = edited[seqOffer.sequence];
        return {
          ...seqOffer,
          price:
            newPrice !== null && newPrice !== undefined
              ? newPrice
              : seqOffer.price,
        };
      });

      return {
        ...offer,
        offers: updatedSeq,
      };
    });

    setPriceOffers(updatedOffers);
    setEditingValues({});
    setEditingSequence(null);
    setIsEditBidPrice(false);
  };

  const handleClickResetValues = () => {
    setEditingSequence(null);
    setEditingValues({});
    setIsEditBidPrice(false);
  };

  return (
    <>
      <div className="flex flex-col gap-5">
        <div className="border border-neutral-02"></div>

        <div className="flex flex-col gap-2 w-fit">
          <p className="title3 text-secondary-indigo-main">
            ปรับแต่งระยะห่างของเรทราคาน้ำมัน{" "}
            <span className="text-neutral-06">(บาท)</span>
          </p>
          <Input
            value={offerOilRange ?? ""}
            className="h-10 w-full border border-neutral-03"
            type="number"
            placeholder="0.00"
            min={1}
            onWheel={(e) => (e.target as HTMLElement).blur()}
            onChange={(e) => {
              const value = e.target.value;
              setOfferOilRange(value);
            }}
          />
        </div>

        {/* Search Bar */}
        {/* <OilRateSearchBar
        isEditBidPrice={isEditBidPrice}
        handleSave={handleSave}
        handleClickResetValues={handleClickResetValues}
      /> */}

        {/* Button */}
        <div className="flex gap-2">
          {isEditBidPrice && (
            <>
              <Button
                variant="main-light"
                onClick={() => setIsRestorePriceModal(true)}
              >
                <p>คืนค่าเริ่มต้น</p>
              </Button>
              <Button
                variant="main"
                onClick={() => setIsSaveNewPriceModal(true)}
              >
                <p>บันทึก</p>
              </Button>
            </>
          )}
        </div>

        <div className="flex gap-2 max-w-full h-fit overflow-x-auto">
          {/* Table */}
          <TableCustom className="text-sm w-[850px]">
            <TableHeader>
              <TableRowHead className="bg-neutral-01 h-20">
                <TableHead className="w-[1%]">#</TableHead>
                <TableHead className="w-[26%]">ต้นทาง</TableHead>
                <TableHead className="w-[26%]">ปลายทาง</TableHead>
              </TableRowHead>
            </TableHeader>
            <TableBody>
              {paginatedRows?.map((route: IRouteOfferRfq, index: number) => (
                <TableRow className="hover:border-none h-full" key={index}>
                  <TableCell className="w-[1%]">
                    {indexPaginate + index + 1}
                  </TableCell>
                  <TableCell className="w-[26%]">{`${route?.organization_route?.master_route?.origin_province.name_th}/${route?.organization_route?.master_route?.origin_district.name_th}`}</TableCell>
                  <TableCell className="w-[26%]">{`${route?.organization_route?.master_route?.destination_province.name_th}/${route?.organization_route?.master_route?.destination_district.name_th}`}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </TableCustom>

          <div className="flex flex-col w-full">
            {/* <div className="flex flex-col w-full" key={route.routeId}> */}
            <div className="flex gap-2">
              {columnRanges.map((col) => (
                <TableCustom
                  className="h-fit min-w-[118px] w-full"
                  key={col.sequence}
                >
                  {/* {routeIndex === 0 && ( */}
                  <TableHeader>
                    <TableRowHead
                      className={clsx(
                        "bg-neutral-01 h-20 w-full justify-center text-main-01",
                        {
                          "bg-secondary-indigo-main text-white":
                            col.sequence === 5,
                        },
                        {
                          "bg-secondary-teal-green-main text-white":
                            editingSequence === col.sequence &&
                            isEditBidPrice === true,
                        }
                      )}
                    >
                      <TableHead className="flex flex-col gap-1 justify-center items-center text-sm">
                        <p>{col.range}</p>
                        {col.sequence === 5 ? (
                          <p>(เรทปัจจุบัน)</p>
                        ) : (
                          <Icons
                            name="EditSquare"
                            className="w-4 h-4 cursor-pointer"
                            onClick={() => handleEditClick(col.sequence)}
                          />
                        )}
                      </TableHead>
                    </TableRowHead>
                  </TableHeader>
                  {/* )} */}
                </TableCustom>
              ))}
            </div>

            {paginatedRows.map((route: IRouteOfferRfq, routeIndex: number) => {
              const routeId = route.organization_route.id;

              const matchedOffer = priceOffers.find(
                (offer) => offer.organization_route_id === routeId
              );

              return (
                <div className="flex gap-2 w-full" key={routeId}>
                  {matchedOffer?.offers.map((offer, index) => (
                    <div
                      className={clsx("flex w-full", {
                        "mt-2": routeIndex === 0,
                      })}
                      key={index}
                    >
                      <TableCustom className="h-fit min-w-[118px] w-full">
                        <TableBody>
                          <TableRowCustom
                            className={clsx(
                              "text-sm h-full text-neutral-06",
                              {
                                "bg-primary-blue-03 text-secondary-indigo-main":
                                  offer.is_base_price,
                              },
                              {
                                "border-2 border-secondary-teal-green-main":
                                  editingSequence === offer.sequence &&
                                  isEditBidPrice === true,
                              }
                            )}
                          >
                            <TableCell className="h-full w-full flex justify-center">
                              {editingSequence === offer.sequence ? (
                                <Input
                                  type="number"
                                  className="w-full text-center h-4 border-0"
                                  value={
                                    (editingValues[routeId]?.[
                                      offer.sequence
                                    ] !== undefined
                                      ? editingValues[routeId][offer.sequence]
                                      : offer.price) ?? ""
                                  }
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    handleEditChange(
                                      routeId,
                                      offer.sequence,
                                      value === ""
                                        ? null
                                        : Number(e.target.value)
                                    );
                                  }}
                                />
                              ) : (
                                <p>{formatDecimal(offer.price)}</p>
                              )}
                            </TableCell>
                          </TableRowCustom>
                        </TableBody>
                      </TableCustom>
                    </div>
                  ))}
                </div>
              );
            })}
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

        <div className="flex flex-col gap-2 w-full">
          <p className="body2 text-secondary-indigo-main">หมายเหตุ</p>
          <Textarea
            className="h-24 w-full border border-neutral-03 resize-none"
            onChange={(e) => setOfferReason(e.target.value)}
          />
        </div>
      </div>

      <ModalNotification
        open={isSaveNewPriceModal}
        setOpen={setIsSaveNewPriceModal}
        title="บันทึกเรทราคาน้ำมัน"
        description="ข้อมูลที่บันทึกจะไม่สามารถกลับไปเป็นค่าเริ่มต้นได้"
        description2="หากท่านแน่ใจและต้องการบันทึกข้อมูลนี้"
        description3="กรุณากด"
        description4="ยืนยัน"
        buttonText="ยืนยัน"
        isConfirmOnly={false}
        icon={<Icons name="DialogInfo" className="w-16 h-16" />}
        onConfirm={() => {
          handleSave();
        }}
        // onCancel={() => setIsEditBidPrice(false)}
      />

      <ModalNotification
        open={isRestorePriceModal}
        setOpen={setIsRestorePriceModal}
        title="ยืนยันคืนค่าเริ่มต้น"
        description="ข้อมูลทั้งหมดจะกลับไปเป็นค่าเริ่มต้นที่กำหนดไว"
        description2="และข้อมูลที่ได้ทำการแก้ไขไว้จะถูกลบออก"
        description3="หากท่านแน่ใจและต้องการบันทึกกรุณากด"
        description4="ยืนยัน"
        buttonText="ยืนยัน"
        isConfirmOnly={false}
        icon={<Icons name="Restore" className="w-16 h-16" />}
        onConfirm={() => {
          handleClickResetValues();
        }}
        // onCancel={() => setIsEditBidPrice(false)}
      />
    </>
  );
}
