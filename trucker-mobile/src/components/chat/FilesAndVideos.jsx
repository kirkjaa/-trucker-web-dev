import React, { useState } from 'react'

// Image assets from Figma (updated from latest design)
const imgEllipse1113 = "/assets/icons/chat/6ab14e80-5b01-43da-982c-ff64c0e6056e.png";
const imgImage41 = "/assets/icons/chat/75b579db-3ca2-4afe-a011-2e3afee5b674.png";
const imgRectangle = "/assets/icons/chat/386cb888-1e81-429d-a06e-558aacd535a2.svg";
const imgClose = "/assets/icons/chat/5b199593-dcf4-46e4-b79b-9720a3275976.svg";
const img = "/assets/icons/chat/5cae8282-1290-4bce-93ec-60d84b312489.svg";
const img1 = "/assets/icons/chat/05d9edad-7a60-4c59-901e-e14f4cdc0b4d.svg";
const img2 = "/assets/icons/chat/23e9b010-0b69-49f5-99c1-819af172b409.svg";
const img3 = "/assets/icons/chat/da5ac0f5-0e04-4900-a708-a91aa6c8ef64.svg";
const img4 = "/assets/icons/chat/61a6a99f-d941-424d-85ed-ad2abe10c241.svg";
const img5 = "/assets/icons/chat/c20a9bc9-26a7-4b7d-ad0d-ab93d8aa002b.svg";
const img6 = "/assets/icons/chat/8f1b6d09-317a-41b8-a5af-91cecc4d43d9.svg";
const img7 = "/assets/icons/chat/86c565ac-06be-4798-a0be-31bf37c3af2c.svg";
const img8 = "/assets/icons/chat/399f0c1f-fed6-48ad-8198-151ffbf26813.svg";
const imgIconlyBulkMoreCircle = "/assets/icons/chat/73c43edf-cf77-4249-8a69-d7411357b8bc.svg";
const img9 = "/assets/icons/chat/581979d7-ff8c-49d4-80bc-d4e82c169c6f.svg";
const img10 = "/assets/icons/chat/afac83a7-dafc-411d-bff3-e960c7f7fc78.svg";
const img11 = "/assets/icons/chat/8a56db31-cf23-410a-8445-4eee29ceb26b.svg";
const img12 = "/assets/icons/chat/0ec1c254-a2b0-43ea-9af5-a066519973c2.svg";
const img13 = "/assets/icons/chat/2f138579-95d6-443a-971d-8ce4bdeed429.svg";
const img14 = "/assets/icons/chat/c78c32e5-c126-40e3-89e4-cfe12ad380f9.svg";
const img15 = "/assets/icons/chat/6de5b5ce-5a1c-4c9b-bc4a-53fe03ff2bbd.svg";
const img16 = "/assets/icons/chat/d2967f59-c367-4715-86f8-70150760fb08.svg";
const img17 = "/assets/icons/chat/979b58fd-8dd4-4b0b-8ad2-299af53f0720.svg";
const img18 = "/assets/icons/chat/a658f581-acc3-4fb0-ad9d-9eb9c5a6931d.svg";
const img19 = "/assets/icons/chat/e08e9a02-e9b3-4cbb-9bc5-d12b01f6e31c.svg";
const img20 = "/assets/icons/chat/cdd7b111-451c-4096-aa0d-64f8edb9ab06.svg";

function NativeHomeIndicator({ className }) {
  return (
    <div className={className}>
      <div className="absolute bottom-[8px] h-[5px] left-[calc(50%+0.5px)] translate-x-[-50%] w-[148px]">
        <img alt="" className="block size-full object-contain" src={imgRectangle} />
      </div>
    </div>
  );
}

function IconlyLightClose({ className, onClick }) {
  return (
    <div className={className} onClick={onClick}>
      <div className="absolute inset-[20.83%_20.83%_20.91%_20.91%]">
        <img alt="" className="block size-full object-contain" src={imgClose} />
      </div>
    </div>
  );
}

export default function FilesAndVideos({ onNavigateBack }) {
  const [activeTab, setActiveTab] = useState('files');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="chat-screen">
      {/* Header */}
      <div className="chat-conv-header">
        <div className="relative shrink-0 size-[24px] cursor-pointer" onClick={onNavigateBack}>
          <div className="absolute flex inset-[26.04%_19.79%_23.76%_17.71%] items-center justify-center">
            <div className="flex-none h-[15px] rotate-[90deg] w-[12.049px]">
              <div className="relative size-full">
                <div className="absolute inset-[-5%_-6.22%]">
                  <img alt="" className="block size-full object-contain" src={img6} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="content-stretch flex gap-[10px] items-center justify-center relative shrink-0">
          <div className="content-stretch flex gap-[5px] items-center relative shrink-0">
            <div className="relative shrink-0 size-[32px] overflow-hidden rounded-full">
              <img alt="" className="block max-w-none size-full object-cover" height="32" src={imgEllipse1113} width="32" />
            </div>
            <div className="box-border content-stretch flex flex-col items-start pb-[4px] pt-0 px-0 relative shrink-0">
              <p className="font-normal leading-[18px] relative shrink-0 text-[#292929] text-[12px]">
                Work Contact Group (4)
              </p>
            </div>
          </div>
        </div>
        <div className="content-stretch flex flex-[1_0_0] gap-[10px] items-center justify-end min-h-px min-w-px relative shrink-0">
          <div className="relative shrink-0 size-[24px]">
            <div className="absolute contents inset-[8.33%_8.33%_55.72%_55.83%]">
              <div className="absolute inset-[8.33%_8.33%_55.72%_55.83%]">
                <img alt="" className="block size-full object-contain" src={img7} />
              </div>
            </div>
            <div className="absolute inset-[12.5%_12.5%_8.33%_8.33%]">
              <img alt="" className="block size-full object-contain" src={img8} />
            </div>
          </div>
          <div className="relative shrink-0 size-[24px] cursor-pointer" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <img alt="" className="block size-full object-contain" src={imgIconlyBulkMoreCircle} />
          </div>
        </div>
      </div>

      {/* Files and Videos Panel */}
      <div className="absolute bg-white content-stretch flex flex-col gap-[173px] h-[768px] items-start left-0 overflow-hidden rounded-tl-[8px] rounded-tr-[8px] top-[44px] w-[375px] z-20">
        <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-[375px]">
          {/* Header with Title and Close */}
          <div className="bg-[#ddedff] border-[#e1e4f1] border-b border-l-0 border-r-0 border-solid border-t-0 box-border content-stretch flex gap-[6px] items-center px-[14px] py-[12px] relative rounded-tl-[8px] rounded-tr-[8px] shrink-0 w-[375px]">
            <div className="box-border content-stretch flex flex-[1_0_0] gap-[10px] items-center justify-center min-h-px min-w-px pl-[24px] pr-0 py-0 relative shrink-0">
              <div className="flex flex-[1_0_0] flex-col font-['Noto_Sans_Thai:SemiBold','Noto_Sans:Bold',sans-serif] font-semibold justify-center leading-[0] min-h-px min-w-px relative shrink-0 text-[#153860] text-[length:var(--font/size/web/body/lg,16px)] text-center" style={{ fontVariationSettings: "'wdth' 100" }}>
                <p className="leading-[var(--font/line-height/s16,24px)] whitespace-pre-wrap">Files, Photos, and Videos</p>
              </div>
            </div>
            <IconlyLightClose className="overflow-clip relative shrink-0 size-[24px] cursor-pointer" onClick={onNavigateBack} />
          </div>

          {/* Tabs */}
          <div className="content-stretch flex flex-col gap-[10px] items-center overflow-y-auto relative shrink-0 w-[347px] max-h-[calc(100vh-250px)]">
            <div className="bg-white content-stretch flex flex-col items-start relative shrink-0 w-full">
              <div className="content-stretch flex items-start relative shrink-0 w-full">
                <div className={`bg-white content-stretch flex flex-[1_0_0] flex-col h-[48px] items-center justify-end min-h-px min-w-px overflow-hidden relative shrink-0 ${activeTab === 'files' ? '' : ''}`}>
                  <div className="box-border content-stretch flex flex-col items-center justify-center overflow-hidden px-[16px] py-[14px] relative shrink-0 w-full cursor-pointer" onClick={() => setActiveTab('files')}>
                    <div className="content-stretch flex gap-[4px] h-[20px] items-center justify-center relative shrink-0">
                      <div className="flex flex-col font-['Noto_Sans_Thai:SemiBold','Noto_Sans:Bold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#454545] text-[14px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
                        <p className="leading-[var(--font/line-height/s16,24px)]">Files (5)</p>
                      </div>
                    </div>
                    {activeTab === 'files' && (
                      <div className="absolute bg-[#0a8778] bottom-0 h-[2px] left-0 right-[-0.5px]" />
                    )}
                  </div>
                </div>
                <div className={`bg-white content-stretch flex flex-[1_0_0] flex-col h-[48px] items-center justify-end min-h-px min-w-px overflow-hidden relative shrink-0 ${activeTab === 'photos' ? '' : ''}`}>
                  <div className="box-border content-stretch flex flex-[1_0_0] flex-col items-center justify-center min-h-px min-w-px overflow-hidden px-[16px] py-[14px] relative shrink-0 w-full cursor-pointer" onClick={() => setActiveTab('photos')}>
                    <div className="content-stretch flex flex-[1_0_0] gap-[4px] items-center justify-center min-h-px min-w-px relative shrink-0">
                      <div className="flex flex-col font-['Noto_Sans_Thai:SemiBold','Noto_Sans:Bold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#454545] text-[14px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
                        <p className="leading-[var(--font/line-height/s16,24px)]">Photos & Videos (0)</p>
                      </div>
                    </div>
                    {activeTab === 'photos' && (
                      <div className="absolute bg-[#0a8778] bottom-0 h-[2px] left-0 right-[-0.5px]" />
                    )}
                  </div>
                </div>
              </div>
              <div className="content-stretch flex flex-col items-start justify-center relative shrink-0 w-full">
                <div className="h-0 relative shrink-0 w-full">
                  <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
                    <img alt="" className="block size-full object-contain" src={img9} />
                  </div>
                </div>
              </div>
            </div>

            {/* File List */}
            {activeTab === 'files' && (
              <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
                {/* File 1: i9.pdf */}
                <div className="box-border content-stretch flex gap-[16px] items-center overflow-hidden p-[12px] relative shrink-0 w-full">
                  <div className="bg-[#fff5f5] box-border content-stretch flex flex-col gap-[10px] items-center justify-center overflow-hidden p-[17px] relative rounded-[12px] shrink-0 size-[48px]">
                    <div className="overflow-clip relative shrink-0 size-[24px]">
                      <div className="absolute inset-[8.33%_33.33%_32.5%_33.33%]">
                        <div className="absolute inset-[-5.28%_-9.38%]">
                          <img alt="" className="block size-full object-contain" src={img10} />
                        </div>
                      </div>
                      <div className="absolute inset-[16.75%_12.5%_8.33%_12.5%]">
                        <div className="absolute inset-[-4.17%]">
                          <img alt="" className="block size-full object-contain" src={img11} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px relative shrink-0">
                    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
                      <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full">
                        <p className="flex-[1_0_0] font-['Noto_Sans_Thai:SemiBold','Noto_Sans:Bold',sans-serif] font-semibold leading-[var(--font/line-height/s16,24px)] min-h-px min-w-px relative shrink-0 text-[#292929] text-[14px] whitespace-pre-wrap" style={{ fontVariationSettings: "'wdth' 100" }}>
                          i9.pdf
                        </p>
                      </div>
                      <div className="content-stretch flex font-['Noto_Sans_Thai:SemiBold','Noto_Sans:Bold',sans-serif] font-semibold gap-[10px] items-start leading-[var(--font/line-height/s16,24px)] relative shrink-0 text-[14px] text-[rgba(0,0,0,0.4)]" style={{ fontVariationSettings: "'wdth' 100" }}>
                        <p className="relative shrink-0">PDF</p>
                        <p className="relative shrink-0">9mb</p>
                      </div>
                    </div>
                  </div>
                  <div className="overflow-clip relative shrink-0 size-[24px] cursor-pointer">
                    <div className="absolute inset-[8.33%]">
                      <div className="absolute inset-[-3.75%]">
                        <img alt="" className="block size-full object-contain" src={img12} />
                      </div>
                    </div>
                    <div className="absolute bottom-[27.15%] left-1/4 right-1/4 top-[27.13%]">
                      <div className="absolute inset-[-6.83%_-6.25%]">
                        <img alt="" className="block size-full object-contain" src={img13} />
                      </div>
                    </div>
                  </div>
                  <div className="relative shrink-0 size-[24px] cursor-pointer">
                    <div className="absolute inset-[11.46%_13.72%_11.46%_15.63%]">
                      <div className="absolute inset-[-4.05%_-4.42%]">
                        <img alt="" className="block size-full object-contain" src={img14} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* File 2: Screenshot.png */}
                <div className="box-border content-stretch flex gap-[16px] items-center overflow-hidden p-[12px] relative shrink-0 w-full">
                  <div className="bg-[#f0fff4] box-border content-stretch flex flex-col gap-[10px] items-center justify-center overflow-hidden p-[17px] relative rounded-[12px] shrink-0 size-[48px]">
                    <div className="overflow-clip relative shrink-0 size-[24px]">
                      <div className="absolute inset-[8.33%]">
                        <div className="absolute inset-[-3.75%]">
                          <img alt="" className="block size-full object-contain" src={img15} />
                        </div>
                      </div>
                      <div className="absolute bottom-[21.04%] left-[11.13%] right-[8.33%] top-1/4">
                        <div className="absolute inset-[-5.79%_-3.88%]">
                          <img alt="" className="block size-full object-contain" src={img16} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px relative shrink-0">
                    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
                      <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full">
                        <p className="flex-[1_0_0] font-['Noto_Sans_Thai:SemiBold','Noto_Sans:Bold',sans-serif] font-semibold leading-[var(--font/line-height/s16,24px)] min-h-px min-w-px relative shrink-0 text-[#292929] text-[14px] whitespace-pre-wrap" style={{ fontVariationSettings: "'wdth' 100" }}>
                          Screenshot.png
                        </p>
                      </div>
                      <div className="content-stretch flex font-['Noto_Sans_Thai:SemiBold','Noto_Sans:Bold',sans-serif] font-semibold gap-[10px] items-start leading-[var(--font/line-height/s16,24px)] relative shrink-0 text-[14px] text-[rgba(0,0,0,0.4)]" style={{ fontVariationSettings: "'wdth' 100" }}>
                        <p className="relative shrink-0">PNG</p>
                        <p className="relative shrink-0">4mb</p>
                      </div>
                    </div>
                  </div>
                  <div className="overflow-clip relative shrink-0 size-[24px] cursor-pointer">
                    <div className="absolute inset-[8.33%]">
                      <div className="absolute inset-[-3.75%]">
                        <img alt="" className="block size-full object-contain" src={img12} />
                      </div>
                    </div>
                    <div className="absolute bottom-[27.15%] left-1/4 right-1/4 top-[27.13%]">
                      <div className="absolute inset-[-6.83%_-6.25%]">
                        <img alt="" className="block size-full object-contain" src={img13} />
                      </div>
                    </div>
                  </div>
                  <div className="relative shrink-0 size-[24px] cursor-pointer">
                    <div className="absolute inset-[11.46%_13.72%_11.46%_15.63%]">
                      <div className="absolute inset-[-4.05%_-4.42%]">
                        <img alt="" className="block size-full object-contain" src={img14} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* File 3: sharefile.docx */}
                <div className="box-border content-stretch flex gap-[16px] items-center overflow-hidden p-[12px] relative shrink-0 w-full">
                  <div className="bg-[#ebf8ff] box-border content-stretch flex flex-col gap-[10px] items-center justify-center overflow-hidden p-[17px] relative rounded-[12px] shrink-0 size-[48px]">
                    <div className="overflow-clip relative shrink-0 size-[24px]">
                      <div className="absolute inset-[8.33%_12.5%]">
                        <div className="absolute inset-[-3.75%_-4.17%]">
                          <img alt="" className="block size-full object-contain" src={img17} />
                        </div>
                      </div>
                      <div className="absolute inset-[18.75%_22.92%_29.17%_33.33%]">
                        <div className="absolute inset-[-6%_-7.14%]">
                          <img alt="" className="block size-full object-contain" src={img18} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px relative shrink-0">
                    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
                      <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full">
                        <p className="flex-[1_0_0] font-['Noto_Sans_Thai:SemiBold','Noto_Sans:Bold',sans-serif] font-semibold leading-[var(--font/line-height/s16,24px)] min-h-px min-w-px relative shrink-0 text-[#292929] text-[14px] whitespace-pre-wrap" style={{ fontVariationSettings: "'wdth' 100" }}>
                          sharefile.docx
                        </p>
                      </div>
                      <div className="content-stretch flex font-['Noto_Sans_Thai:SemiBold','Noto_Sans:Bold',sans-serif] font-semibold gap-[10px] items-start leading-[var(--font/line-height/s16,24px)] relative shrink-0 text-[14px] text-[rgba(0,0,0,0.4)]" style={{ fontVariationSettings: "'wdth' 100" }}>
                        <p className="relative shrink-0">DOC</p>
                        <p className="relative shrink-0">555kb</p>
                      </div>
                    </div>
                  </div>
                  <div className="overflow-clip relative shrink-0 size-[24px] cursor-pointer">
                    <div className="absolute inset-[8.33%]">
                      <div className="absolute inset-[-3.75%]">
                        <img alt="" className="block size-full object-contain" src={img12} />
                      </div>
                    </div>
                    <div className="absolute bottom-[27.15%] left-1/4 right-1/4 top-[27.13%]">
                      <div className="absolute inset-[-6.83%_-6.25%]">
                        <img alt="" className="block size-full object-contain" src={img13} />
                      </div>
                    </div>
                  </div>
                  <div className="relative shrink-0 size-[24px] cursor-pointer">
                    <div className="absolute inset-[11.46%_13.72%_11.46%_15.63%]">
                      <div className="absolute inset-[-4.05%_-4.42%]">
                        <img alt="" className="block size-full object-contain" src={img14} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* File 4: Jerry-2020_I-9.xxl */}
                <div className="box-border content-stretch flex gap-[16px] items-center overflow-hidden p-[12px] relative shrink-0 w-full">
                  <div className="bg-[#faf5ff] box-border content-stretch flex flex-col gap-[10px] items-center justify-center overflow-hidden p-[17px] relative rounded-[12px] shrink-0 size-[48px]">
                    <div className="overflow-clip relative shrink-0 size-[24px]">
                      <div className="absolute inset-[8.33%_12.5%]">
                        <div className="absolute inset-[-3.75%_-4.17%]">
                          <img alt="" className="block size-full object-contain" src={img19} />
                        </div>
                      </div>
                      <div className="absolute inset-[18.75%_22.92%_29.17%_33.33%]">
                        <div className="absolute inset-[-6%_-7.14%]">
                          <img alt="" className="block size-full object-contain" src={img20} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px relative shrink-0">
                    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
                      <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full">
                        <p className="flex-[1_0_0] font-['Noto_Sans_Thai:SemiBold','Noto_Sans:Bold',sans-serif] font-semibold leading-[var(--font/line-height/s16,24px)] min-h-px min-w-px relative shrink-0 text-[#292929] text-[14px] whitespace-pre-wrap" style={{ fontVariationSettings: "'wdth' 100" }}>
                          Jerry-2020_I-9.xxl
                        </p>
                      </div>
                      <div className="content-stretch flex font-['Noto_Sans_Thai:SemiBold','Noto_Sans:Bold',sans-serif] font-semibold gap-[10px] items-start leading-[var(--font/line-height/s16,24px)] relative shrink-0 text-[14px] text-[rgba(0,0,0,0.4)]" style={{ fontVariationSettings: "'wdth' 100" }}>
                        <p className="relative shrink-0">XXL</p>
                        <p className="relative shrink-0">24mb</p>
                      </div>
                    </div>
                  </div>
                  <div className="overflow-clip relative shrink-0 size-[24px] cursor-pointer">
                    <div className="absolute inset-[8.33%]">
                      <div className="absolute inset-[-3.75%]">
                        <img alt="" className="block size-full object-contain" src={img12} />
                      </div>
                    </div>
                    <div className="absolute bottom-[27.15%] left-1/4 right-1/4 top-[27.13%]">
                      <div className="absolute inset-[-6.83%_-6.25%]">
                        <img alt="" className="block size-full object-contain" src={img13} />
                      </div>
                    </div>
                  </div>
                  <div className="relative shrink-0 size-[24px] cursor-pointer">
                    <div className="absolute inset-[11.46%_13.72%_11.46%_15.63%]">
                      <div className="absolute inset-[-4.05%_-4.42%]">
                        <img alt="" className="block size-full object-contain" src={img14} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* File 5: i9.pdf (duplicate) */}
                <div className="box-border content-stretch flex gap-[16px] items-center overflow-hidden p-[12px] relative shrink-0 w-full">
                  <div className="bg-[#fff5f5] box-border content-stretch flex flex-col gap-[10px] items-center justify-center overflow-hidden p-[17px] relative rounded-[12px] shrink-0 size-[48px]">
                    <div className="overflow-clip relative shrink-0 size-[24px]">
                      <div className="absolute inset-[8.33%_33.33%_32.5%_33.33%]">
                        <div className="absolute inset-[-5.28%_-9.38%]">
                          <img alt="" className="block size-full object-contain" src={img10} />
                        </div>
                      </div>
                      <div className="absolute inset-[16.75%_12.5%_8.33%_12.5%]">
                        <div className="absolute inset-[-4.17%]">
                          <img alt="" className="block size-full object-contain" src={img11} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px relative shrink-0">
                    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
                      <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full">
                        <p className="flex-[1_0_0] font-['Noto_Sans_Thai:SemiBold','Noto_Sans:Bold',sans-serif] font-semibold leading-[var(--font/line-height/s16,24px)] min-h-px min-w-px relative shrink-0 text-[#292929] text-[14px] whitespace-pre-wrap" style={{ fontVariationSettings: "'wdth' 100" }}>
                          i9.pdf
                        </p>
                      </div>
                      <div className="content-stretch flex font-['Noto_Sans_Thai:SemiBold','Noto_Sans:Bold',sans-serif] font-semibold gap-[10px] items-start leading-[var(--font/line-height/s16,24px)] relative shrink-0 text-[14px] text-[rgba(0,0,0,0.4)]" style={{ fontVariationSettings: "'wdth' 100" }}>
                        <p className="relative shrink-0">PDF</p>
                        <p className="relative shrink-0">9mb</p>
                      </div>
                    </div>
                  </div>
                  <div className="overflow-clip relative shrink-0 size-[24px] cursor-pointer">
                    <div className="absolute inset-[8.33%]">
                      <div className="absolute inset-[-3.75%]">
                        <img alt="" className="block size-full object-contain" src={img12} />
                      </div>
                    </div>
                    <div className="absolute bottom-[27.15%] left-1/4 right-1/4 top-[27.13%]">
                      <div className="absolute inset-[-6.83%_-6.25%]">
                        <img alt="" className="block size-full object-contain" src={img13} />
                      </div>
                    </div>
                  </div>
                  <div className="relative shrink-0 size-[24px] cursor-pointer">
                    <div className="absolute inset-[11.46%_13.72%_11.46%_15.63%]">
                      <div className="absolute inset-[-4.05%_-4.42%]">
                        <img alt="" className="block size-full object-contain" src={img14} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Home Indicator */}
      <NativeHomeIndicator className="absolute bottom-0 h-[34px] left-0 rounded-tl-[8px] rounded-tr-[8px] w-[375px]" />
    </div>
  );
}

