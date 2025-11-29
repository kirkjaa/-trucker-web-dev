import { useEffect, useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import clsx from "clsx";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { Button } from "@/app/components/ui/button";
import { Checkbox } from "@/app/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import ModalNotification from "@/app/components/ui/ModalNotification";
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group";
import SelectedTypeSignaturePad from "@/app/components/ui/signature/SelectedTypeSignaturePad";
import SignaturePad from "@/app/components/ui/signature/SignaturePad";
import { Switch } from "@/app/components/ui/switch";
import { useToast } from "@/app/components/ui/toast/use-toast";
import { Icons } from "@/app/icons";
import { signatureApi } from "@/app/services/signature/signatureApi";
import { useSignatureStore } from "@/app/store/signature/signatureStore";
import { EHttpStatusCode } from "@/app/types/enum";
import { imageToUrl } from "@/app/utils/imgToUrl";

interface SignatureModalProps {
  isSignatureModalOpen: boolean;
  setIsSignatureModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isSendRfqModalOpen?: boolean;
  setIsSendRfqModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  handleConfirmCreateRfq?: () => void;
  setSelectedSignature: React.Dispatch<React.SetStateAction<number | null>>;
}

export default function SignatureModal({
  isSignatureModalOpen,
  setIsSignatureModalOpen,
  isSendRfqModalOpen,
  setIsSendRfqModalOpen,
  handleConfirmCreateRfq,
  setSelectedSignature,
}: SignatureModalProps) {
  // Global State
  const { signatures, setSignatures } = useSignatureStore((state) => ({
    signatures: state.signatures,
    setSignatures: state.setSignatures,
  }));

  // Local State
  const [addNewSignature, setAddNewSignature] = useState<boolean>(false);
  const [selectedType, setSelectedType] = useState<string>("Typing");
  const [signatureText, setSignatureText] = useState<string>("");
  const [signatureImage, setSignatureImage] = useState<File | null>(null);
  const [isNewSignMain, setIsNewSignMain] = useState<boolean>(false);
  const [fileKey, setFileKey] = useState(Date.now());
  const [signValueId, setSignValueId] = useState<number | null>(null);

  // Hook
  const sigPadRef = useRef<SignatureCanvas | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const pathName = usePathname();

  // Use Effect
  useEffect(() => {
    if (!signatures || signatures.length === 0) return;

    const sign = signatures.find((sign) => sign.is_default === "Y")?.id;
    setSignValueId(sign ?? 0);
  }, [signatures]);

  // Function
  const handleClickCancelSelectedSignature = () => {
    setSignValueId(null);
    setSelectedSignature?.(null);
    setIsSignatureModalOpen(false);
  };

  const handleClickComfirmSelectedSignature = (signId: number) => {
    if (pathName.startsWith("/factory")) {
      setIsSendRfqModalOpen!(true);
    }
    setIsSignatureModalOpen(false);
    setSelectedSignature?.(signId);
  };

  const handleClickUploadSignature = () => {
    fileInputRef.current?.click();
  };

  const handleClickCancelCreateNewSign = () => {
    sigPadRef.current?.clear();
    setSignatureImage(null);
    setSignatureText("");
    setAddNewSignature(false);
    setFileKey(Date.now());
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSignatureImage(file);
    }
  };

  const clearSignature = () => {
    sigPadRef.current?.clear();
    setSignatureImage(null);
    setSignatureText("");
    setFileKey(Date.now());
  };

  const saveSignature = async () => {
    const dataUrl = sigPadRef?.current?.toDataURL("image/png");
    const dataURLToBlob = (dataURL: string) => {
      const byteString = atob(dataURL.split(",")[1]);
      const mimeString = dataURL.split(",")[0].split(":")[1].split(";")[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      return new Blob([ab], { type: mimeString });
    };
    const formData = new FormData();

    try {
      if (selectedType === "Typing") {
        const isDuplicateText = signatures?.some(
          (sign) =>
            sign.is_image === "N" &&
            sign.text?.trim().toLowerCase() ===
              signatureText.trim().toLowerCase()
        );

        if (isDuplicateText) {
          toast({
            icon: "ToastError",
            variant: "error",
            description: "ไม่สามารถเพิ่มลายเซ็นที่ซ้ำกันได้",
          });

          return;
        }

        formData.append("text", signatureText);
      } else {
        if (dataUrl) {
          const blob = dataURLToBlob(dataUrl);
          formData.append(
            "image",
            new File([blob], "signature.png", { type: "image/png" })
          );
        } else if (signatureImage) {
          formData.append("image", signatureImage);
        }
      }

      formData.append("is_default", isNewSignMain.toString());

      const response = await signatureApi.createSignature(formData);

      if (response.statusCode === EHttpStatusCode.CREATED) {
        const res = await signatureApi.getSignatures();
        setSignatures(res.data);
        setSelectedSignature(
          res.data?.find((sig) => sig.is_default === "Y")?.id ?? 0
        );
        setAddNewSignature(false);
        setIsNewSignMain(false);
        clearSignature();
      }
    } catch (error) {
      console.error("Error uploading signature:", error);
    }
  };

  const handleDeleteSignature = async (signatureId: number) => {
    const response = await signatureApi.deleteSignature(signatureId);

    if (response.statusCode === EHttpStatusCode.SUCCESS) {
      const res = await signatureApi.getSignatures();
      setSignatures(res.data);
    }
  };

  const handleChangeIsMainSignatureStatus = async (
    signatureId: number,
    isMain: boolean
  ) => {
    const response = await signatureApi.updateSignatureStatus(
      signatureId,
      isMain
    );

    if (response.statusCode === EHttpStatusCode.SUCCESS) {
      const res = await signatureApi.getSignatures();
      setSignatures(res.data);
      setSelectedSignature(
        res.data?.find((sig) => sig.is_default === "Y")?.id ?? 0
      );
    }
  };

  return (
    <>
      <Dialog
        open={isSignatureModalOpen}
        onOpenChange={setIsSignatureModalOpen}
      >
        <DialogContent className="w-signatureModal" removeCloseBtn>
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <p className="text-xl font-bold text-neutral-09">
                ลายเซ็นผู้ใช้งาน{" "}
                <span className="text-primary-oxley-green-main">
                  {`(${signatures?.length || 0})`}
                </span>
              </p>
              <Button
                variant="secondary"
                onClick={() => setAddNewSignature(!addNewSignature)}
              >
                <Icons name="Plus" className="w-6 h-6" />
                เพิ่มลายเซ็น
              </Button>
            </DialogTitle>
          </DialogHeader>

          {/* Content */}
          <div className="flex flex-col gap-5">
            {/* New Signature */}
            {addNewSignature && (
              <div className="border flex flex-col gap-6 p-5 shadow-table rounded-2xl bg-accept-03/50">
                <div className="text-secondary-indigo-main flex flex-col gap-2">
                  <p className="button">เพิ่มลายเซ็นของคุณ</p>
                  <div className="flex gap-4">
                    <SelectedTypeSignaturePad
                      title="พิมพ์"
                      icon1="KeyboardGreen"
                      icon2="KeyboardBlue"
                      type="Typing"
                      selectedType={selectedType}
                      setSelectedType={setSelectedType}
                    />
                    <SelectedTypeSignaturePad
                      title="วาด"
                      icon1="DrawGreen"
                      icon2="DrawBlue"
                      type="Drawing"
                      selectedType={selectedType}
                      setSelectedType={setSelectedType}
                    />
                    <SelectedTypeSignaturePad
                      title="รูปภาพ"
                      icon1="ImageGreen"
                      icon2="ImageBlue"
                      type="Imaging"
                      selectedType={selectedType}
                      setSelectedType={setSelectedType}
                    />
                  </div>
                </div>

                <div className="border shadow-table h-32 px-4 rounded-lg bg-white flex flex-col items-center justify-center">
                  {selectedType === "Typing" && (
                    <Input
                      type="text"
                      className="w-full border-x-0 border-t-0 h-14 text-2xl text-center"
                      placeholder="พิมพ์ชื่อของคุณ"
                      value={signatureText}
                      onChange={(e) => setSignatureText(e.target.value)}
                    />
                  )}

                  {selectedType === "Drawing" && (
                    <SignaturePad ref={sigPadRef} />
                  )}

                  {selectedType === "Imaging" && (
                    <>
                      <input
                        key={fileKey}
                        ref={fileInputRef}
                        type="file"
                        accept=".jpg, .jpeg, .png"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                      <button
                        type="button"
                        onClick={handleClickUploadSignature}
                      >
                        {signatureImage ? (
                          <Image
                            src={URL.createObjectURL(signatureImage)}
                            width={200}
                            height={160}
                            className="w-32 h-20"
                            alt="sign img"
                          />
                        ) : (
                          <div className="w-full flex flex-col items-center justify-center gap-1">
                            <Icons name="CloudUpload" className="w-10 h-10" />
                            <p className="body2 text-neutral-09">เพิ่มรูปภาพ</p>
                            <p className="body3 text-neutral-05">
                              ขนาดไฟล์ไม่เกิน 5MB รองรับไฟล์ JPG, JPEG และ PNG
                            </p>
                          </div>
                        )}
                      </button>
                    </>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Checkbox
                      className="w-5 h-5"
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setIsNewSignMain(true);
                        } else {
                          setIsNewSignMain(false);
                        }
                      }}
                    />
                    <p className="body2 text-neutral-09">ตั้งเป็นลายเซ็นหลัก</p>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      className="w-28"
                      onClick={clearSignature}
                      variant="main-light"
                    >
                      ล้าง
                    </Button>
                    <Button
                      className="w-28"
                      onClick={handleClickCancelCreateNewSign}
                      variant="main-light"
                    >
                      ยกเลิก
                    </Button>
                    <Button className="w-28" onClick={saveSignature}>
                      บันทึก
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <RadioGroup
              defaultValue={signValueId?.toString()}
              className="flex flex-col gap-5"
              onValueChange={(value) => {
                setSignValueId(Number(value));
              }}
            >
              {signatures?.map((sign, index) =>
                sign.is_image === "Y" ? (
                  <div
                    className={clsx(
                      "flex items-center justify-between space-x-2 p-5 shadow-table rounded-2xl",
                      {
                        "border border-component-green bg-component-green/10":
                          signValueId === sign.id,
                      }
                    )}
                    key={index}
                  >
                    <div className="flex gap-4 items-center">
                      <RadioGroupItem value={sign.id.toString()} />
                      <Image
                        src={imageToUrl(sign.image_url)}
                        width={200}
                        height={160}
                        className="w-auto h-auto"
                        alt="sign img"
                      />
                    </div>

                    <div className="flex gap-4 items-center">
                      <Switch
                        checked={sign.is_default === "Y"}
                        onCheckedChange={() =>
                          handleChangeIsMainSignatureStatus(
                            sign.id,
                            sign.is_default === "Y" ? false : true
                          )
                        }
                      />
                      <p
                        className={clsx("body2 text-neutral-05", {
                          "text-secondary-caribbean-green-04":
                            sign.is_default === "Y",
                        })}
                      >
                        ลายเซ็นหลัก
                      </p>
                      <Icons
                        name="Bin"
                        className="w-6 h-6 text-urgent-fail-02 cursor-pointer"
                        onClick={() => handleDeleteSignature(sign.id)}
                      />
                    </div>
                  </div>
                ) : (
                  <div
                    className={clsx(
                      "flex items-center justify-between space-x-2 p-5 shadow-table rounded-2xl",
                      {
                        "border border-component-green bg-component-green/10":
                          signValueId === sign.id,
                      }
                    )}
                    key={index}
                  >
                    <div className="flex gap-4 items-center">
                      <RadioGroupItem value={sign.id.toString()} />
                      <h3>{sign.text}</h3>
                    </div>

                    <div className="flex gap-4 items-center">
                      <Switch
                        checked={sign.is_default === "Y"}
                        onCheckedChange={() =>
                          handleChangeIsMainSignatureStatus(
                            sign.id,
                            sign.is_default === "Y" ? false : true
                          )
                        }
                      />
                      <p
                        className={clsx("body2 text-neutral-05", {
                          "text-secondary-caribbean-green-04":
                            sign.is_default === "Y",
                        })}
                      >
                        ลายเซ็นหลัก
                      </p>
                      <Icons
                        name="Bin"
                        className="w-6 h-6 text-urgent-fail-02 cursor-pointer"
                        onClick={() => handleDeleteSignature(sign.id)}
                      />
                    </div>
                  </div>
                )
              )}
            </RadioGroup>

            <div className="flex justify-end gap-4">
              <Button
                variant="main-light"
                className="w-36"
                onClick={handleClickCancelSelectedSignature}
              >
                ยกเลิก
              </Button>
              <Button
                className="w-36"
                onClick={() =>
                  handleClickComfirmSelectedSignature(signValueId ?? 0)
                }
              >
                ยืนยัน
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirm Create Quotation Modal */}
      {setIsSendRfqModalOpen && (
        <ModalNotification
          open={isSendRfqModalOpen}
          setOpen={setIsSendRfqModalOpen}
          title="ยืนยันสร้างใบเสนอราคาใหม่"
          description="ใบเสนอราคาใหม่จะถูกบันทึกในระบบและพร้อมใช้งาน"
          description2="คุณต้องการดำเนินการต่อหรือไม่?"
          buttonText="ยืนยัน"
          isConfirmOnly={false}
          icon={<Icons name="DialogSuccess" className="w-16 h-16" />}
          onConfirm={() => {
            handleConfirmCreateRfq!();
          }}
        />
      )}
    </>
  );
}
