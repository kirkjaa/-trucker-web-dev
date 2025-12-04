import React, { useState, useEffect, useRef } from 'react'

const imgSwiftAvatar = "/assets/icons/chat/af05a999-851c-43be-b07d-bd3e795d9f63.png";

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

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 8L5.5 11.5L14 3" stroke="#00c188" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function PrivateChat({ onNavigateBack, onNavigateToSubMenu }) {
  const [message, setMessage] = useState('');
  const scrollRef = useRef(null);

  const messages = [
    {
      id: 1,
      type: 'incoming',
      text: "Hello, I would like to know what kind of shipping services the company currently offers?",
      time: '14:23',
      avatar: imgSwiftAvatar
    },
    {
      id: 2,
      type: 'outgoing',
      text: "Hello, we have both small parcel delivery services, full-load shipping services, and temperature-controlled shipping services. Are you interested in any particular type?",
      time: '14:23',
      read: true
    },
    {
      id: 3,
      type: 'incoming',
      text: "Perfect! ✅",
      time: '14:24',
      avatar: imgSwiftAvatar
    },
    {
      id: 4,
      type: 'incoming',
      text: "I'm interested in the full-load shipping service. I'd like to know how much area the service covers?",
      time: '14:24',
      avatar: imgSwiftAvatar
    },
    {
      id: 5,
      type: 'outgoing',
      text: "We can provide services nationwide. And we also have express delivery services in the Bangkok area.",
      time: '14:25',
      read: true
    },
    {
      id: 6,
      type: 'incoming',
      text: "That's great. Is there also a real-time package tracking service?",
      time: '14:26',
      avatar: imgSwiftAvatar
    },
    {
      id: 7,
      type: 'outgoing',
      text: "Yes, customers can track the status of their shipments through our online system 24 hours a day.",
      time: '14:27',
      read: true
    }
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

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
            <img src={imgSwiftAvatar} alt="Swift Cargo Solutions" />
          </div>
          <div className="chat-conv-header__text">
            <p className="chat-conv-header__name">Swift Cargo Solutions</p>
            <div className="chat-conv-header__status">
              <span className="chat-conv-header__status-dot chat-conv-header__status-dot--online" />
              <span>Online</span>
            </div>
          </div>
        </div>

        <div className="chat-conv-header__actions">
          <button className="chat-conv-header__action" onClick={onNavigateToSubMenu}>
            <MoreIcon />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="chat-messages">
        {messages.map((msg, index) => {
          const isOutgoing = msg.type === 'outgoing';
          const showAvatar = msg.type === 'incoming' && 
            (index === 0 || messages[index - 1].type !== 'incoming');
          
          return (
            <div 
              key={msg.id} 
              className={`chat-message-row ${isOutgoing ? 'chat-message-row--outgoing' : ''}`}
            >
              {!isOutgoing && (
                <div className="chat-message-avatar" style={{ visibility: showAvatar ? 'visible' : 'hidden' }}>
                  {showAvatar && <img src={msg.avatar} alt="" />}
                </div>
              )}
              
              <div className="chat-message-content">
                <span className="chat-message-time">{msg.time}</span>
                <div className={`chat-bubble ${isOutgoing ? 'chat-bubble--outgoing' : 'chat-bubble--incoming'}`}>
                  {msg.text}
                </div>
                {isOutgoing && msg.read && (
                  <div className="chat-message-status">
                    <CheckIcon />
                    <CheckIcon />
                  </div>
                )}
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
