import { Button } from "@/app/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { IResponseCheckDupRoute } from "@/app/types/routesType";

interface ModalProps {
  title?: string;
  open?: boolean;
  description?: string;
  description2?: string;
  description3?: string;
  description4?: string;
  iconDescription?: JSX.Element;
  buttonText?: string;
  setOpen: (open: boolean) => void;
  onConfirm?: () => void;
  isConfirmOnly?: boolean;
  icon?: JSX.Element;
  removeConfirmButton?: boolean;
  treatmentDescription?: string;
  secondTreatmentDescription?: string;
  isTreatment?: boolean;
  isDelete?: boolean;
  routeData?: Partial<IResponseCheckDupRoute[]>;
  onCancel?: () => void;
}

export default function ModalNotification({
  title,
  open,
  description,
  description2,
  description3,
  description4,
  routeData,
  setOpen,
  onConfirm,
  isConfirmOnly = true,
  buttonText = "OK",
  icon,
  removeConfirmButton = false,
  isDelete = false,
  onCancel,
}: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="max-w-[500px] z-[100]"
        outlineCloseButton
        removeCloseBtn
      >
        <DialogHeader className="w-full pb-[1rem]">
          <DialogTitle className="hidden font-semibold text-xl text-secondary-indigo-main items-center">
            {title}
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="hidden">{description}</DialogDescription>
        <div className="w-full flex flex-col items-center text-center py-2 gap-4">
          {icon}
          <p className="font-bold text-2xl text-secondary-indigo-main">
            {title}
          </p>
          <div>
            <p className="body1 text-secondary-indigo-main">{description}</p>
            <p className="body1 text-secondary-indigo-main">{description2}</p>
            <p className="body1 text-secondary-indigo-main">
              {description3}
              <span className="text-secondary-teal-green-main">
                {description4}
              </span>
            </p>
            {routeData && (
              <div className="bg-neutral-02 rounded-lg px-4 py-2 mt-2">
                {routeData.map((data, index) => (
                  <p className="body1 text-neutral-09 text-start" key={index}>
                    {`${index + 1}. ${data?.origin.province}/${data?.origin.district} - ${data?.destination.province}/${data?.destination.district}`}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
        {!removeConfirmButton && (
          <div className="flex w-full justify-center gap-4">
            {isDelete && (
              <Button
                className="min-w-[147px]"
                variant="delete"
                onClick={() => {
                  if (onConfirm) {
                    onConfirm();
                  }
                  setOpen(false);
                }}
                type="submit"
              >
                {buttonText}
              </Button>
            )}
            {!isConfirmOnly && (
              <DialogClose onClick={onCancel}>
                <p className="min-w-[147px] h-11 px-6 py-2.5 w-28 rounded-[1.25rem] bg-white border border-secondary-indigo-main text-secondary-indigo-main hover:bg-secondary-indigo-hover hover:border-none disabled:border-neutral-04 disabled:text-neutral-04">
                  ยกเลิก
                </p>
              </DialogClose>
            )}
            {!isDelete && (
              <Button
                className="min-w-[147px]"
                variant="main"
                onClick={() => {
                  if (onConfirm) {
                    onConfirm();
                  }
                  setOpen(false);
                }}
                type="submit"
              >
                {buttonText}
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
