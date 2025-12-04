import React, { useState } from 'react'

// Image assets from Figma
const imgEllipse1113 = "/assets/icons/chat/cf553291-7bf8-4969-a635-35a72f6a3fc2.svg";
const imgImage41 = "/assets/icons/chat/2a8e4471-8649-48a2-9b12-53e9d20a4a71.svg";
const imgRectangle = "/assets/icons/chat/d6ec400a-95b2-43cb-9a42-13fac2ac08aa.svg";
const img = "/assets/icons/chat/7862a199-b5c7-4aff-bafd-d31429f79887.svg";
const img1 = "/assets/icons/chat/f313dfc0-5a86-4c8e-ac97-e131caf6fea7.svg";
const img2 = "/assets/icons/chat/e6412801-f867-4544-9526-ec388eb9b635.svg";
const img3 = "/assets/icons/chat/73732323-087c-4c76-a0da-7669ddeb1fb5.svg";
const img4 = "/assets/icons/chat/f93c6891-69cc-4f1b-9f3e-1f41afe815e8.svg";
const img5 = "/assets/icons/chat/56b656a2-ec94-4191-b944-259f4e27296e.svg";
const img6 = "/assets/icons/chat/31fc769a-a856-4b41-9e0c-f8b69af83022.svg";
const imgMdiMute = "/assets/icons/chat/5a426b07-034a-478c-aec4-2bc857bdafd1.svg";
const img7 = "/assets/icons/chat/e3b372aa-7640-4cb5-95c5-b35152fa21ae.svg";
const img8 = "/assets/icons/chat/c325ef5d-1d58-44eb-b46f-2d3393759c55.svg";
const imgIconlyBulkMoreCircle = "/assets/icons/chat/e56f8ee6-a94c-40bb-baed-6e75126e2134.svg";

function NativeHomeIndicator({ className }) {
  return (
    <div className={className}>
      <div className="absolute bottom-[8px] h-[5px] left-[calc(50%+0.5px)] translate-x-[-50%] w-[148px]">
        <img alt="" className="block size-full object-contain" src={imgRectangle} />
      </div>
    </div>
  );
}

export default function ChatSubMenu({ onNavigateBack, onNavigateToDelete, onNavigateToFiles, onNavigateToMembers, onNavigateToAddMember }) {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
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
            <div className="relative shrink-0 size-[32px]">
              <img alt="" className="block size-full object-contain" height="32" src={imgEllipse1113} width="32" />
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
          <div className="relative shrink-0 size-[24px] cursor-pointer" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <img alt="" className="block size-full object-contain" src={imgIconlyBulkMoreCircle} />
          </div>
        </div>
      </div>

      {/* Empty State */}
      <div className="absolute left-[167.5px] size-[40px] top-[120px]">
        <img alt="" className="absolute inset-0 object-50%-50% object-cover pointer-events-none size-full" src={imgImage41} />
      </div>
      <div className="absolute content-stretch flex flex-col font-normal gap-[2px] items-start left-0 text-center top-[170px] w-[375px] whitespace-pre-wrap">
        <p className="leading-[24px] relative shrink-0 text-[#454545] text-[16px] w-[375px]">
          Work Contact Group (4)
        </p>
        <p className="leading-[20px] relative shrink-0 text-[darkgrey] text-[14px] w-[375px]">
          Start the conversation Work Contact Group now!
        </p>
      </div>

      {/* Dropdown Menu */}
      {isMenuOpen && (
        <div className="absolute bg-white box-border content-stretch flex flex-col items-start left-[187px] overflow-clip rounded-[8px] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_10px_10px_-5px_rgba(0,0,0,0.04)] top-[100px] w-[175px] z-10">
          <div className="bg-white box-border content-stretch flex gap-[8px] items-center px-[16px] py-[12px] relative shrink-0 w-[375px] cursor-pointer hover:bg-gray-50" onClick={onNavigateToAddMember}>
            <p className="font-semibold leading-[24px] relative shrink-0 text-[#414668] text-[14px]">
              Add member
            </p>
          </div>
          <div className="bg-white box-border content-stretch flex gap-[8px] items-center px-[16px] py-[12px] relative shrink-0 w-[375px] cursor-pointer hover:bg-gray-50" onClick={onNavigateToMembers}>
            <p className="font-semibold leading-[24px] relative shrink-0 text-[#414668] text-[14px]">
              Member list
            </p>
          </div>
          <div className="bg-white box-border content-stretch flex gap-[8px] items-center px-[16px] py-[12px] relative shrink-0 w-[375px] cursor-pointer hover:bg-gray-50" onClick={onNavigateToFiles}>
            <p className="font-semibold leading-[24px] relative shrink-0 text-[#414668] text-[14px]">
              Files, photos, and videos
            </p>
          </div>
          <div className="bg-white box-border content-stretch flex gap-[8px] items-center px-[16px] py-[12px] relative shrink-0 w-[375px] cursor-pointer hover:bg-gray-50">
            <p className="font-semibold leading-[24px] relative shrink-0 text-[#414668] text-[14px]">
              Turn on notifications
            </p>
          </div>
          <div className="bg-white box-border content-stretch flex gap-[8px] items-center px-[16px] py-[12px] relative shrink-0 w-[375px] cursor-pointer hover:bg-gray-50" onClick={onNavigateToDelete}>
            <p className="font-semibold leading-[24px] relative shrink-0 text-[#414668] text-[14px]">
              Delete conversation
            </p>
          </div>
        </div>
      )}

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

      {/* Home Indicator */}
      <NativeHomeIndicator className="absolute bottom-0 h-[34px] left-0 rounded-tl-[8px] rounded-tr-[8px] w-[375px]" />
    </div>
  );
}

