import React, { useState } from 'react'

// Image assets from Figma (updated from latest design)
const imgEllipse1113 = "/assets/icons/chat/92f69c46-bdae-4cfe-ba7c-49ee7c639a25.png";
const imgImage41 = "/assets/icons/chat/a9e9f468-1d03-4208-b04e-320f74012351.png";
const imgEllipse1112 = "/assets/icons/chat/c485d757-122f-4fcf-ac70-0a27977b38af.png";
const imgEllipse1114 = "/assets/icons/chat/fd08bd94-b93c-432b-bc1d-796112b93218.png";
const imgRectangle = "/assets/icons/chat/1c869447-7c3c-4a27-bcdf-5cc68c977017.svg";
const img = "/assets/icons/chat/0d848ea5-71d7-42d4-8df0-8a1b9cf72aa1.svg";
const imgShape = "/assets/icons/chat/4026895d-e5ec-45cd-bb47-b7aaae50df19.svg";
const imgClose = "/assets/icons/chat/ba77850d-3a2f-4883-8acd-bbdcc5d2b226.svg";
const img1 = "/assets/icons/chat/87079bb1-4e49-48fb-b25d-4f121bc62858.svg";
const img2 = "/assets/icons/chat/dad99da3-1d9c-4078-a36e-38e9cd83c43c.svg";
const img3 = "/assets/icons/chat/4cea3f5c-5cb5-4951-8392-b0058ea1f97b.svg";
const img4 = "/assets/icons/chat/5b63e8c7-97f6-4011-8d32-963d62199390.svg";
const img5 = "/assets/icons/chat/d99d45b8-b72e-485a-ac1e-a041f6be86b4.svg";
const img6 = "/assets/icons/chat/edc979d2-a58b-4031-96c3-248cd3b9a98a.svg";
const img7 = "/assets/icons/chat/7dd63e25-b749-4377-bdc7-ce5b40c86f89.svg";
const img8 = "/assets/icons/chat/a31ee07d-16e9-4dd8-819b-b2e5668e96f9.svg";
const img9 = "/assets/icons/chat/ae6d931e-31f5-4708-bb7f-545ba83f44df.svg";
const imgIconlyBulkMoreCircle = "/assets/icons/chat/dc612554-b7b6-4a07-8cf4-7dad1ae117a7.svg";
const img10 = "/assets/icons/chat/3fb4af99-5b7e-4467-a9f2-3a4aff8ddd6b.svg";

function NativeHomeIndicator({ className }) {
  return (
    <div className={className}>
      <div className="absolute bottom-[8px] h-[5px] left-[calc(50%+0.5px)] translate-x-[-50%] w-[148px]">
        <img alt="" className="block size-full object-contain" src={imgRectangle} />
      </div>
    </div>
  );
}

function Checkbox({ className, state = true, onClick }) {
  if (!state) {
    return (
      <div className={className} onClick={onClick}>
        <div className="bg-white border-[#c7c7c7] border-[1.5px] border-solid box-border content-stretch flex items-center rounded-[22px] shrink-0 size-[24px]" />
      </div>
    );
  }
  return (
    <div className={className} onClick={onClick}>
      <div className="bg-[#00c188] content-stretch flex items-center relative rounded-[16px] shrink-0 size-[24px]">
        <div className="overflow-clip relative shrink-0 size-[24px]">
          <div className="absolute bottom-1/4 left-[12.5%] right-[12.5%] top-[20.83%]">
            <div className="absolute inset-0">
              <img alt="" className="block size-full object-contain" src={img} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function KeyboardArrowUp({ className, onClick }) {
  return (
    <div className={className} onClick={onClick}>
      <div className="absolute bottom-[35.83%] left-1/4 right-1/4 top-[33.33%]">
        <div className="absolute inset-0">
          <img alt="" className="block size-full object-contain" src={imgShape} />
        </div>
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

export default function AddMember({ onNavigateBack }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFriendsExpanded, setIsFriendsExpanded] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFriends, setSelectedFriends] = useState({
    friend1: false,
    friend2: true
  });

  const toggleFriend = (friendId) => {
    setSelectedFriends(prev => ({
      ...prev,
      [friendId]: !prev[friendId]
    }));
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
                  <img alt="" className="block size-full object-contain" src={img7} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="box-border content-stretch flex flex-[1_0_0] gap-[10px] items-center justify-center min-h-px min-w-px pl-0 pr-[24px] py-0 relative shrink-0">
          <div className="content-stretch flex flex-[1_0_0] gap-[5px] items-center min-h-px min-w-px relative shrink-0">
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
                <img alt="" className="block size-full object-contain" src={img8} />
              </div>
            </div>
            <div className="absolute inset-[12.5%_12.5%_8.33%_8.33%]">
              <img alt="" className="block size-full object-contain" src={img9} />
            </div>
          </div>
          <div className="relative shrink-0 size-[24px] cursor-pointer" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <img alt="" className="block size-full object-contain" src={imgIconlyBulkMoreCircle} />
          </div>
        </div>
      </div>

      {/* Add Member Panel */}
      <div className="absolute bg-white content-stretch flex flex-col gap-[173px] h-[768px] items-center left-0 overflow-hidden rounded-tl-[8px] rounded-tr-[8px] top-[44px] w-[375px] z-20">
        <div className="content-stretch flex flex-col gap-[8px] items-center relative shrink-0 w-[375px]">
          {/* Header with Title and Close */}
          <div className="bg-[#ddedff] border-[#e1e4f1] border-b border-l-0 border-r-0 border-solid border-t-0 box-border content-stretch flex gap-[6px] items-center px-[14px] py-[12px] relative rounded-tl-[8px] rounded-tr-[8px] shrink-0 w-[375px]">
            <div className="box-border content-stretch flex flex-[1_0_0] gap-[10px] items-center justify-center min-h-px min-w-px pl-[24px] pr-0 py-0 relative shrink-0">
              <div className="flex flex-[1_0_0] flex-col font-['Noto_Sans_Thai:SemiBold','Noto_Sans:Bold',sans-serif] font-semibold justify-center leading-[0] min-h-px min-w-px relative shrink-0 text-[#153860] text-[length:var(--font/size/web/body/lg,16px)] text-center" style={{ fontVariationSettings: "'wdth' 100" }}>
                <p className="leading-[var(--font/line-height/s16,24px)] whitespace-pre-wrap">Add Member</p>
              </div>
            </div>
            <IconlyLightClose className="overflow-clip relative shrink-0 size-[24px] cursor-pointer" onClick={onNavigateBack} />
          </div>

          {/* Content */}
          <div className="bg-white content-stretch flex flex-col items-center overflow-y-auto relative shrink-0 w-[347px] max-h-[calc(100vh-200px)]">
            <div className="bg-white content-stretch flex flex-col items-start relative shrink-0 w-[347px]">
              {/* Search Bar */}
              <div className="box-border content-stretch flex flex-col gap-[10px] items-start px-0 py-[12px] relative shrink-0 w-full">
                <div className="bg-[#f3f3f3] box-border content-stretch flex gap-[4px] items-center overflow-clip px-[20px] py-[10px] relative rounded-[12px] shrink-0 w-full">
                  <div className="opacity-40 relative shrink-0 size-[18px]">
                    <div className="absolute inset-[11.58%_10.24%_8.33%_11.58%]">
                      <div className="absolute inset-[-3.9%_-4%]">
                        <img alt="" className="block size-full object-contain" src={img10} />
                      </div>
                    </div>
                  </div>
                  <input 
                    type="text" 
                    placeholder="Search by name"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent border-none outline-none font-normal leading-[20px] flex-1 text-[#292929] text-[14px] placeholder:opacity-40 placeholder:text-[#292929]"
                  />
                </div>
              </div>

              {/* Friends Section */}
              <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full cursor-pointer" onClick={() => setIsFriendsExpanded(!isFriendsExpanded)}>
                <p className="flex-[1_0_0] font-['Noto_Sans_Thai:SemiBold','Noto_Sans:Bold',sans-serif] font-semibold leading-[var(--font/line-height/s16,24px)] min-h-px min-w-px relative shrink-0 text-[#153860] text-[14px] whitespace-pre-wrap" style={{ fontVariationSettings: "'wdth' 100" }}>
                  Friends (2)
                </p>
                <KeyboardArrowUp className={`overflow-clip relative shrink-0 size-[24px] transition-transform ${isFriendsExpanded ? '' : 'rotate-180'}`} />
              </div>

              {/* Friends List */}
              {isFriendsExpanded && (
                <div className="content-stretch flex flex-col gap-[2px] items-start relative shrink-0 w-full">
                  {/* Friend 1 */}
                  <div className="box-border content-stretch flex items-center px-0 py-[10px] relative shrink-0 w-full">
                    <div className="content-stretch flex flex-[1_0_0] gap-[14px] items-center min-h-px min-w-px relative shrink-0">
                      <div className="relative shrink-0 size-[34px] overflow-hidden rounded-full">
                        <img alt="" className="block max-w-none size-full object-cover" height="34" src={imgEllipse1112} width="34" />
                      </div>
                      <p className="flex-[1_0_0] font-['Noto_Sans_Thai:Regular','Noto_Sans:Regular',sans-serif] font-normal leading-[var(--font/line-height/s16,24px)] min-h-px min-w-px relative shrink-0 text-[#153860] text-[length:var(--font/size/web/body/lg,16px)] whitespace-pre-wrap" style={{ fontVariationSettings: "'wdth' 100" }}>
                        Apichat Pongsiri
                      </p>
                      <Checkbox 
                        state={selectedFriends.friend1} 
                        className="cursor-pointer"
                        onClick={() => toggleFriend('friend1')}
                      />
                    </div>
                  </div>

                  {/* Friend 2 */}
                  <div className="bg-white box-border content-stretch flex items-center px-0 py-[10px] relative rounded-[33px] shrink-0 w-full">
                    <div className="content-stretch flex flex-[1_0_0] gap-[14px] items-center min-h-px min-w-px relative shrink-0">
                      <div className="relative shrink-0 size-[34px] overflow-hidden rounded-full">
                        <img alt="" className="block max-w-none size-full object-cover" height="34" src={imgEllipse1114} width="34" />
                      </div>
                      <p className="flex-[1_0_0] font-['Noto_Sans_Thai:Regular','Noto_Sans:Regular',sans-serif] font-normal leading-[var(--font/line-height/s16,24px)] min-h-px min-w-px relative shrink-0 text-[#414668] text-[length:var(--font/size/web/body/lg,16px)] whitespace-pre-wrap" style={{ fontVariationSettings: "'wdth' 100" }}>
                        Phutthiphong Phanthawatchai
                      </p>
                      <Checkbox 
                        state={selectedFriends.friend2} 
                        className="cursor-pointer"
                        onClick={() => toggleFriend('friend2')}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Button */}
      <div className="absolute bg-gradient-to-r border border-solid border-white from-[#245d9e] left-1/2 rounded-[10px] to-[#1a4271] top-[710px] translate-x-[-50%] w-[347px] z-20 cursor-pointer hover:opacity-90">
        <div className="box-border content-stretch flex gap-[10px] items-center justify-center overflow-clip px-[24px] py-[11px] relative rounded-[inherit] w-[347px]">
          <p className="font-['Noto_Sans_Thai:SemiBold','Noto_Sans:Bold',sans-serif] font-semibold leading-[24px] relative shrink-0 text-[14px] text-center text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
            Confirm
          </p>
        </div>
      </div>

      {/* Home Indicator */}
      <NativeHomeIndicator className="absolute bottom-0 h-[34px] left-0 rounded-tl-[8px] rounded-tr-[8px] w-[375px]" />
    </div>
  );
}

