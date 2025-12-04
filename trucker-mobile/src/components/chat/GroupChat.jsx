import React, { useState, useEffect, useRef } from 'react'

const imgEllipse1113 = "/assets/icons/chat/506652bb-5e38-4dc4-9eda-c1b7b02a7af4.png";
const imgImage41 = "/assets/icons/chat/80eb67b2-3b3a-4057-9027-b7d31be88531.png";

function BackIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 18L9 12L15 6" stroke="#153860" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function MoreIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="6" r="1.5" fill="#153860"/>
      <circle cx="12" cy="12" r="1.5" fill="#153860"/>
      <circle cx="12" cy="18" r="1.5" fill="#153860"/>
    </svg>
  );
}

function VideoCallIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M23 7L16 12L23 17V7Z" stroke="#153860" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="1" y="5" width="15" height="14" rx="2" stroke="#153860" strokeWidth="2"/>
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 2L9 11M18 2L12 18L9 11M18 2L2 9L9 11" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function AttachIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.5 9.5833L10.0833 17C8.92917 18.1542 7.3875 18.8045 5.78333 18.8045C4.17917 18.8045 2.6375 18.1542 1.48333 17C0.329167 15.8458 -0.321167 14.3042 -0.321167 12.7C-0.321167 11.0958 0.329167 9.55417 1.48333 8.4L8.9 0.983333C9.67083 0.2125 10.7083 -0.224167 11.7917 -0.224167C12.875 -0.224167 13.9125 0.2125 14.6833 0.983333C15.4542 1.75417 15.8908 2.79167 15.8908 3.875C15.8908 4.95833 15.4542 5.99583 14.6833 6.76667L7.25833 14.1833C6.87292 14.5688 6.35417 14.7875 5.8125 14.7875C5.27083 14.7875 4.75208 14.5688 4.36667 14.1833C3.98125 13.7979 3.7625 13.2792 3.7625 12.7375C3.7625 12.1958 3.98125 11.6771 4.36667 11.2917L11.2 4.46667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function MicIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 1.66667C9.11594 1.66667 8.26809 2.01786 7.64297 2.64298C7.01785 3.2681 6.66666 4.11595 6.66666 5V10C6.66666 10.8841 7.01785 11.7319 7.64297 12.357C8.26809 12.9822 9.11594 13.3333 10 13.3333C10.884 13.3333 11.7319 12.9822 12.357 12.357C12.9821 11.7319 13.3333 10.8841 13.3333 10V5C13.3333 4.11595 12.9821 3.2681 12.357 2.64298C11.7319 2.01786 10.884 1.66667 10 1.66667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16.6667 8.33333V10C16.6667 11.7681 15.9643 13.4638 14.714 14.714C13.4638 15.9643 11.7681 16.6667 10 16.6667C8.23189 16.6667 6.5362 15.9643 5.28595 14.714C4.03571 13.4638 3.33333 11.7681 3.33333 10V8.33333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10 16.6667V18.3333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.75 15.75V14.25C12.75 13.4544 12.4339 12.6913 11.8713 12.1287C11.3087 11.5661 10.5456 11.25 9.75 11.25H3.75C2.95435 11.25 2.19129 11.5661 1.62868 12.1287C1.06607 12.6913 0.75 13.4544 0.75 14.25V15.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="6.75" cy="5.25" r="3" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M17.25 15.75V14.25C17.2495 13.5853 17.0283 12.9393 16.621 12.4143C16.2138 11.8893 15.6436 11.5146 15 11.3475" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 2.34753C12.6453 2.51371 13.2173 2.88871 13.6257 3.41463C14.0342 3.94055 14.2558 4.58811 14.2558 5.25378C14.2558 5.91946 14.0342 6.56702 13.6257 7.09294C13.2173 7.61886 12.6453 7.99386 12 8.16003" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function FilesIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10.5 1.5H4.5C3.90326 1.5 3.33097 1.73705 2.90901 2.15901C2.48705 2.58097 2.25 3.15326 2.25 3.75V14.25C2.25 14.8467 2.48705 15.419 2.90901 15.841C3.33097 16.2629 3.90326 16.5 4.5 16.5H13.5C14.0967 16.5 14.669 16.2629 15.091 15.841C15.5129 15.419 15.75 14.8467 15.75 14.25V6.75L10.5 1.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10.5 1.5V6.75H15.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.25 4.5H15.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6 4.5V3C6 2.60218 6.15804 2.22064 6.43934 1.93934C6.72064 1.65804 7.10218 1.5 7.5 1.5H10.5C10.8978 1.5 11.2794 1.65804 11.5607 1.93934C11.842 2.22064 12 2.60218 12 3V4.5M14.25 4.5V15C14.25 15.3978 14.092 15.7794 13.8107 16.0607C13.5294 16.342 13.1478 16.5 12.75 16.5H5.25C4.85218 16.5 4.47064 16.342 4.18934 16.0607C3.90804 15.7794 3.75 15.3978 3.75 15V4.5H14.25Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function UserPlusIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 15.75V14.25C12 13.4544 11.6839 12.6913 11.1213 12.1287C10.5587 11.5661 9.79565 11.25 9 11.25H3.75C2.95435 11.25 2.19129 11.5661 1.62868 12.1287C1.06607 12.6913 0.75 13.4544 0.75 14.25V15.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="6.375" cy="5.25" r="3" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M15 6V10.5M12.75 8.25H17.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function GroupChat({ onNavigateBack, onNavigateToSubMenu, onNavigateToAddMember, onNavigateToMembers, onNavigateToFiles, onNavigateToDelete }) {
  const [message, setMessage] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const scrollRef = useRef(null);
  const dropdownRef = useRef(null);

  const messages = [
    {
      id: 1,
      type: 'incoming',
      sender: 'John Smith',
      senderInitials: 'JS',
      text: "Hey everyone! The delivery schedule for tomorrow has been updated.",
      time: '09:30',
      color: 'linear-gradient(135deg, #d7e3ff 0%, #b3c7ff 100%)'
    },
    {
      id: 2,
      type: 'outgoing',
      text: "Thanks for the update! I'll review it now.",
      time: '09:32',
      read: true
    },
    {
      id: 3,
      type: 'incoming',
      sender: 'Sarah Chen',
      senderInitials: 'SC',
      text: "Can we also discuss the new route optimization?",
      time: '09:35',
      color: 'linear-gradient(135deg, #ffe4f0 0%, #ffc4dd 100%)'
    },
    {
      id: 4,
      type: 'incoming',
      sender: 'Mike Johnson',
      senderInitials: 'MJ',
      text: "Sure! I've prepared some data on fuel savings.",
      time: '09:36',
      color: 'linear-gradient(135deg, #daf5ea 0%, #b8e9d3 100%)'
    },
    {
      id: 5,
      type: 'outgoing',
      text: "Perfect. Let's schedule a call for 2 PM.",
      time: '09:38',
      read: true
    }
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        if (!event.target.closest('[data-dropdown-trigger]')) {
          setIsDropdownOpen(false);
        }
      }
    };

    if (isDropdownOpen) {
      const timeoutId = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 0);
      
      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isDropdownOpen]);

  const handleSend = () => {
    if (message.trim()) {
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-screen">
      {/* Header */}
      <div className="chat-conv-header">
        <button className="chat-conv-header__back" onClick={onNavigateBack}>
          <BackIcon />
        </button>
        
        <div className="chat-conv-header__info">
          <div className="chat-conv-header__avatar">
            <img src={imgEllipse1113} alt="Work Contact Group" />
          </div>
          <div className="chat-conv-header__text">
            <p className="chat-conv-header__name">Work Contact Group (4)</p>
            <div className="chat-conv-header__status">
              <span>4 members</span>
            </div>
          </div>
        </div>

        <div className="chat-conv-header__actions">
          <button className="chat-conv-header__action">
            <VideoCallIcon />
          </button>
          <div style={{ position: 'relative' }}>
            <button 
              className="chat-conv-header__action" 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              data-dropdown-trigger
            >
              <MoreIcon />
            </button>
            
            {isDropdownOpen && (
              <div ref={dropdownRef} className="chat-dropdown">
                <button className="chat-dropdown__item" onClick={onNavigateToMembers}>
                  <UsersIcon />
                  <span>View Members</span>
                </button>
                <button className="chat-dropdown__item" onClick={onNavigateToAddMember}>
                  <UserPlusIcon />
                  <span>Add Member</span>
                </button>
                <button className="chat-dropdown__item" onClick={onNavigateToFiles}>
                  <FilesIcon />
                  <span>Files & Media</span>
                </button>
                <button className="chat-dropdown__item chat-dropdown__item--danger" onClick={onNavigateToDelete}>
                  <TrashIcon />
                  <span>Delete Group</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="chat-messages">
        {messages.map((msg) => {
          const isOutgoing = msg.type === 'outgoing';
          
          return (
            <div 
              key={msg.id} 
              className={`chat-message-row ${isOutgoing ? 'chat-message-row--outgoing' : ''}`}
            >
              {!isOutgoing && (
                <div 
                  className="chat-message-avatar" 
                  style={{ 
                    background: msg.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: '600',
                    color: '#153860'
                  }}
                >
                  {msg.senderInitials}
                </div>
              )}
              
              <div className="chat-message-content">
                {!isOutgoing && (
                  <span style={{ 
                    fontSize: '11px', 
                    fontWeight: '600', 
                    color: '#153860',
                    paddingLeft: '4px'
                  }}>
                    {msg.sender}
                  </span>
                )}
                <span className="chat-message-time">{msg.time}</span>
                <div className={`chat-bubble ${isOutgoing ? 'chat-bubble--outgoing' : 'chat-bubble--incoming'}`}>
                  {msg.text}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input Area */}
      <div className="chat-input-area">
        <div className="chat-input-wrapper">
          <input 
            type="text" 
            placeholder="Type message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        
        <button className="chat-action-btn">
          <AttachIcon />
        </button>
        
        <button className="chat-action-btn">
          <MicIcon />
        </button>
        
        <button 
          className="chat-send-btn" 
          onClick={handleSend}
          disabled={!message.trim()}
        >
          <SendIcon />
        </button>
      </div>

      {/* Home Indicator */}
      <div className="chat-screen__home-indicator">
        <div style={{ width: '134px', height: '5px', background: 'rgba(255,255,255,0.3)', borderRadius: '100px' }} />
      </div>
    </div>
  );
}
