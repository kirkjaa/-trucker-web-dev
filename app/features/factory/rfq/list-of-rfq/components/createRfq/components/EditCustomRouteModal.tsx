import { useState } from "react";
import { z } from "zod";

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Icons } from "@/app/icons";
import { ICreateRfqRoute } from "@/app/types/rfq/rfqType";

interface EditCustomRouteModalProps {
  setIsOpenEditCustomRouteModal: React.Dispatch<React.SetStateAction<boolean>>;
  editCustomRouteData: ICreateRfqRoute | null;
  handleUpdateCustomRoute: (updatedRoute: ICreateRfqRoute) => void;
}

export default function EditCustomRouteModal({
  setIsOpenEditCustomRouteModal,
  editCustomRouteData,
  // handleUpdateCustomRoute,
}: EditCustomRouteModalProps) {
  // Local State
  const [startLocation, setStartLocation] = useState<string>("");
  const [endLocation, setEndLocation] = useState<string>("");
  const [unitPrice, setUnitPrice] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [errors, setErrors] = useState<z.ZodIssue[]>([]);

  // Use Effect
  /* useEffect(() => { */
  /*   if (editCustomRouteData) { */
  /*     setStartLocation( */
  /*       `${editCustomRouteData.}/${editCustomRouteData.origin.district}` */
  /*     ); */
  /*     setEndLocation( */
  /*       `${editCustomRouteData.destination.province}/${editCustomRouteData.destination.district}` */
  /*     ); */
  /*     setUnitPrice(editCustomRouteData.unit); */
  /*     setPrice(+editCustomRouteData.offerPrice); */
  /*   } */
  /* }, [editCustomRouteData]); */

  // Function
  const getError = (field: string) => {
    return errors.find((error) => error.path[0] === field)?.message;
  };

  const clearFieldError = (field: string) => {
    setErrors((prev) => prev.filter((error) => error.path[0] !== field));
  };

  const handleClickCancelEdit = () => {
    setIsOpenEditCustomRouteModal(false);
  };

  const handleConfirmEdit = () => {
    if (!editCustomRouteData) return;
    setStartLocation("");
    setEndLocation("");
    /* const updatedRoute: { */
    /*   factoryRouteId: string; */
    /*   origin: Pick<ILocation, "province" | "district">; */
    /*   destination: Pick<ILocation, "province" | "district">; */
    /*   distance: IDistanceRoute; */
    /*   offerPrice: string; */
    /*   unit: string; */
    /* } = { */
    /*   ...editCustomRouteData, */
    /*   origin: { */
    /*     province: startLocation.split("/")[0], */
    /*     district: startLocation.split("/")[1], */
    /*   }, */
    /*   destination: { */
    /*     province: endLocation.split("/")[0], */
    /*     district: endLocation.split("/")[1], */
    /*   }, */
    /*   unit: unitPrice, */
    /*   offerPrice: price.toString(), */
    /* }; */
    /**/
    /* handleUpdateCustomRoute(updatedRoute); */
  };

  return (
    <div className="flex flex-col gap-5 text-neutral-08">
      <div className="flex flex-col gap-2 bg-modal-01 px-5 py-3 rounded-lg">
        <p className="text-base font-semibold">สถานที่จัดส่ง</p>

        <div className="flex justify-between gap-4 items-center rounded-lg px-5 py-2 border-2 border-dashed border-neutral-03">
          <div className="flex flex-col gap-1 w-full">
            <p className="text-sm font-semibold">
              ต้นทาง <span className="text-urgent-fail-02">*</span>
            </p>

            <Input
              className="h-10 w-full border-2 border-neutral-03 disabled:opacity-100"
              value={startLocation || ""}
              disabled
            />
          </div>

          <div className="mt-6">
            <Icons name="DoubleChevronRightGreen" className="w-14 h-14" />
          </div>

          <div className="flex flex-col gap-1 w-full">
            <p className="text-sm font-semibold ">
              ปลายทาง <span className="text-urgent-fail-02">*</span>
            </p>

            <Input
              className="h-10 w-full border-2 border-neutral-03 disabled:opacity-100"
              value={endLocation || ""}
              disabled
            />
          </div>
        </div>
        <div className="flex gap-2 rounded-lg">
          <div className="flex flex-col gap-1 w-full">
            <p className="text-sm font-semibold ">
              ระยะทาง <span className="text-urgent-fail-02">*</span>
            </p>

            <Input
              className="h-10 w-full border border-neutral-03 disabled:opacity-100"
              /* value={editCustomRouteData?.distance.value || ""} */
              disabled
            />
          </div>

          <div className="flex flex-col gap-1 w-full">
            <p className="text-sm font-semibold ">
              รูปแบบ <span className="text-urgent-fail-02">*</span>
            </p>

            <Select
              value={unitPrice || ""}
              onValueChange={(value) => {
                {
                  setUnitPrice(value);
                  clearFieldError("unitPrice");
                }
              }}
            >
              <SelectTrigger className="py-2 px-5 bg-white border-neutral-03">
                <SelectValue placeholder="ราคา" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="บาท/เที่ยว">บาท/เที่ยว</SelectItem>
                  <SelectItem value="บาท/ชิ้น">บาท/ชิ้น</SelectItem>
                  <SelectItem value="บาท/ตัน">บาท/ตัน</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            {getError("unitPrice") && (
              <p className="text-red-500 text-sm">{getError("unitPrice")}</p>
            )}
          </div>

          <div className="flex flex-col gap-1 w-full">
            <p className="text-sm font-semibold ">
              ราคา <span className="text-urgent-fail-02">*</span>
            </p>

            <Input
              value={price}
              type="number"
              className="h-10 w-full border border-neutral-03"
              placeholder="0.00"
              onWheel={(e) => (e.target as HTMLElement).blur()}
              onChange={(e) => {
                setPrice(+e.target.value);
                clearFieldError("price");
              }}
            />

            {getError("price") && (
              <p className="text-red-500 text-sm">{getError("price")}</p>
            )}
          </div>
        </div>
      </div>

      {/* Button */}
      <div className="flex justify-end gap-4">
        <Button
          variant="main-light"
          className="px-16"
          onClick={handleClickCancelEdit}
        >
          ยกเลิก
        </Button>
        <Button className="px-16" onClick={handleConfirmEdit}>
          ยืนยัน
        </Button>
      </div>
    </div>
  );
}
