import React, { useState } from 'react'

// Image assets from Figma (updated from latest design)
const imgEllipse1113 = "/assets/icons/chat/2a9acb15-caad-40b9-9b92-55018ce1bb74.png";
const imgImage41 = "/assets/icons/chat/efa47327-ef1f-47c6-8799-22e68a3403ae.png";
const imgRectangle = "/assets/icons/chat/46242ea3-48db-4cb9-8ae5-441b114966bc.svg";
const img = "/assets/icons/chat/910ed862-3825-4bb7-a39c-2011cb99e453.svg";
const img1 = "/assets/icons/chat/03f168d0-a3e0-40ce-8f1b-33b35d443f00.svg";
const img2 = "/assets/icons/chat/7eb80d07-662c-48a9-92b9-ff7894f12a9e.svg";
const img3 = "/assets/icons/chat/508b616c-08f2-4d74-9afa-885465acd230.svg";
const img4 = "/assets/icons/chat/8a76951b-1639-4eef-ba80-f0337ec095ef.svg";
const img5 = "/assets/icons/chat/64025560-f3e2-42a5-8777-557ad4933e62.svg";
const img6 = "/assets/icons/chat/bab1aab6-d94a-4882-af2b-f496bb835017.svg";
const imgMdiMute = "/assets/icons/chat/c1c0006f-cd00-41a5-ba67-abe86fd206a9.svg";
const img7 = "/assets/icons/chat/559c5387-75fb-4f56-8459-bcea2e68d221.svg";
const img8 = "/assets/icons/chat/c195edc4-b119-432b-9c66-10ab5d3922a0.svg";
const imgIconlyBulkMoreCircle = "/assets/icons/chat/ab56d556-c3c0-4ac1-858f-7fae03ddddfa.svg";
const imgInformation128644281 = "/assets/icons/chat/97264fcd-039b-4efd-8020-ccc95a928d99.svg";

function NativeHomeIndicator({ className }) {
  return (
    <div className={className}>
      <div className="absolute bottom-[8px] h-[5px] left-[calc(50%+0.5px)] translate-x-[-50%] w-[148px]">
        <img alt="" className="block size-full object-contain" src={imgRectangle} />
      </div>
    </div>
  );
}

export default function DeleteConversationDialog({ onNavigateBack, onCloseDialog }) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      // Here you would typically send the message
      console.log('Sending message:', message);
      setMessage(''); // Clear input after sending
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

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
              <img alt="Group avatar" className="block max-w-none size-full object-cover pointer-events-none" height="32" src={imgEllipse1113} width="32" loading="eager" />
            </div>
            <div className="box-border content-stretch flex flex-col items-start pb-[4px] pt-0 px-0 relative shrink-0">
              <p className="font-normal leading-[18px] relative shrink-0 text-[#292929] text-[12px]">
                Work Contact Group (4)
              </p>
            </div>
          </div>
        </div>
        <div className="relative shrink-0 size-[24px]">
          <img alt="" className="block size-full object-contain" src={imgMdiMute} />
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
        </div>
      </div>

      {/* Empty State */}
      <div className="absolute left-[167.5px] size-[40px] top-[120px] overflow-hidden">
        <img alt="Waving hand" className="block max-w-none size-full object-contain pointer-events-none" src={imgImage41} loading="eager" />
      </div>
      <div className="absolute content-stretch flex flex-col font-normal gap-[2px] items-start left-0 text-center top-[170px] w-[375px] whitespace-pre-wrap">
        <p className="leading-[24px] relative shrink-0 text-[#454545] text-[16px] w-full">
          Work Contact Group (4)
        </p>
        <p className="leading-[20px] relative shrink-0 text-[darkgrey] text-[14px] w-full">
          Start the conversation Work Contact Group now!
        </p>
      </div>

      {/* Message Input Box */}
      <div className="absolute bg-white border-[#e9e9e9] border-b-0 border-l-0 border-r-0 border-solid border-t bottom-0 box-border content-stretch flex gap-[10px] items-center left-0 pb-[52px] pt-[20px] px-[14px] w-[375px]">
        <div className="bg-white border-2 border-slate-300 border-solid flex-[1_0_0] h-[48px] min-h-px min-w-px relative rounded-[12px] shrink-0">
          <div className="box-border content-stretch flex h-[48px] items-center justify-between overflow-clip px-[20px] py-[10px] relative rounded-[inherit] w-[375px]">
            <input 
              type="text" 
              placeholder="Type message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-transparent border-none outline-none font-normal leading-[24px] flex-1 text-[#292929] text-[16px] placeholder:opacity-40 placeholder:text-[#292929]"
            />
            <div className="relative shrink-0 size-[24px] cursor-pointer" onClick={handleSend}>
              <div className="absolute inset-[8.33%_8.37%_8.88%_8.33%]">
                <img alt="" className="block size-full object-contain" src={img} />
              </div>
            </div>
          </div>
        </div>
        <div className="overflow-clip relative shrink-0 size-[24px]">
          <div className="absolute inset-[12.7%_14.59%_12.5%_16.66%]">
            <div className="absolute inset-[-4.18%_-4.55%]">
              <img alt="" className="block size-full object-contain" src={img1} />
            </div>
          </div>
        </div>
        <div className="overflow-clip relative shrink-0 size-[24px]">
          <div className="absolute inset-[8.33%]">
            <div className="absolute inset-[-3.75%]">
              <img alt="" className="block size-full object-contain" src={img2} />
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      <div className="absolute bg-[rgba(0,0,0,0.4)] h-[812px] left-0 top-0 w-[375px] z-20" onClick={onCloseDialog} />

      {/* Confirmation Dialog */}
      <div className="absolute bg-white box-border content-stretch flex flex-col items-end left-1/2 max-w-[560px] min-w-[280px] overflow-hidden rounded-[28px] shadow-[0px_5px_14px_0px_rgba(0,0,0,0.05)] top-1/2 translate-x-[-50%] translate-y-[-50%] w-[312px] z-30">
        <div className="box-border content-stretch flex flex-col gap-[20px] items-center justify-center overflow-hidden pb-0 pt-[24px] px-[24px] relative shrink-0 w-full">
          <div className="overflow-hidden relative shrink-0 size-[60px]">
            <img alt="" className="block max-w-none size-full object-contain" src={imgInformation128644281} />
          </div>
          <div className="content-stretch flex flex-col gap-[8px] items-center justify-center relative shrink-0 text-center w-full">
            <div className="flex flex-col font-semibold justify-center relative shrink-0 text-[#292929] text-[18px] w-full">
              <p className="leading-[30px] whitespace-pre-wrap">Confirm delete conversation</p>
            </div>
            <div className="flex flex-col font-normal justify-center relative shrink-0 text-[#454545] text-[14px] w-full">
              <p className="leading-[20px] whitespace-pre-wrap text-center">
                Do you want to delete the conversation?
                <br />
                Once deleted, the conversation cannot be recovered.
              </p>
            </div>
          </div>
        </div>
        <div className="content-stretch flex flex-col items-end overflow-hidden relative shrink-0 w-full">
          <div className="box-border content-stretch cursor-pointer flex gap-[8px] items-center justify-end overflow-hidden pl-[8px] pr-[24px] py-[20px] relative shrink-0 w-full">
            <div className="content-stretch flex flex-col gap-[8px] h-[40px] items-center justify-center overflow-hidden relative rounded-[100px] shrink-0" data-name="Secondary button">
              <div className="box-border content-stretch flex gap-[8px] items-center justify-center px-[12px] py-[10px] relative shrink-0 cursor-pointer hover:bg-gray-50" onClick={onNavigateBack}>
                <div className="flex flex-col font-semibold justify-center leading-[0] relative shrink-0 text-[#e52622] text-[16px] text-center whitespace-nowrap">
                  <p className="leading-[24px]">Delete conversation</p>
                </div>
              </div>
            </div>
            <div className="content-stretch flex flex-col gap-[8px] h-[40px] items-center justify-center overflow-hidden relative rounded-[100px] shrink-0" data-name="Primary button">
              <div className="box-border content-stretch flex gap-[8px] items-center justify-center px-[12px] py-[10px] relative shrink-0 cursor-pointer hover:bg-gray-50" onClick={onCloseDialog}>
                <div className="flex flex-col font-semibold justify-center leading-[0] relative shrink-0 text-[#454545] text-[16px] text-center whitespace-nowrap">
                  <p className="leading-[24px]">Cancel</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Home Indicator */}
      <NativeHomeIndicator className="absolute bottom-0 h-[34px] left-0 rounded-tl-[8px] rounded-tr-[8px] w-[375px]" />
    </div>
  );
}

