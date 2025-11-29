import React from "react";

import { Button } from "@/app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import DraggableMap from "@/app/components/ui/maps/DraggableMap";
import { IPoolLatLng } from "@/app/types/poolType";

type PoolDragMapModalProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setLatLng: React.Dispatch<React.SetStateAction<IPoolLatLng | undefined>>;
  latLng?: IPoolLatLng;
  startAddress?: string;
};

export default function PoolDragMapModal({
  open,
  setOpen,
  setLatLng,
  latLng,
  startAddress,
}: PoolDragMapModalProps) {
  const [markerPosition, setMarkerPosition] = React.useState<{
    lat: number;
    lng: number;
  }>();
  const onChangeMap = (latlng: { lat: number; lng: number }) => {
    setMarkerPosition(latlng);
  };
  const onSubmit = () => {
    if (markerPosition) {
      const latLng: IPoolLatLng = {
        latitude: markerPosition.lat,
        longitude: markerPosition.lng,
      };
      setLatLng(latLng);
      setOpen(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[600px]" outlineCloseButton>
        <DialogHeader className="w-full pb-[1rem]">
          <DialogTitle>ตําแหน่ง</DialogTitle>
        </DialogHeader>
        <DraggableMap
          onSelect={onChangeMap}
          startPosition={
            latLng && {
              lat: latLng?.latitude,
              lng: latLng?.longitude,
            }
          }
          startAddress={startAddress}
        />
        <DialogFooter>
          <Button onClick={onSubmit}>ยืนยัน</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
