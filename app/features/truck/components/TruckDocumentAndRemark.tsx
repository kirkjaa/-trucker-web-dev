import React from "react";

import FilesList from "@/app/components/ui/featureComponents/FilesList";

type TruckDocumentAndRemarkProps = {
  documentUrls?: string[];
  remark?: string;
};

export default function TruckDocumentAndRemark({
  documentUrls = [],
  remark,
}: TruckDocumentAndRemarkProps) {
  return (
    <React.Fragment>
      <div className="w-full flex justify-between min-h-36 p-4">
        <div className="w-1/2 border-r-2 mr-4">
          <p className="title3">เอกสารแนบ</p>
          {documentUrls.length > 0 &&
            documentUrls.map((item, index) => (
              <FilesList
                key={index}
                fileNames={item}
                fileType="file"
                maxWidth="w-full"
              />
            ))}
        </div>
        <div className="w-1/2">
          <p className="title3">หมายเหตุ</p>
          <p className="mt-4 text-sm">{remark}</p>
        </div>
      </div>
    </React.Fragment>
  );
}
