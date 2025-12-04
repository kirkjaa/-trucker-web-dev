import React, { useState } from 'react'

const imgFrame10 = "/assets/icons/chat/2d7dc0f6-fbc0-4fc2-b9a8-d3af94c832ea.png";
const imgFrame11 = "/assets/icons/chat/de0f8f9d-b360-431f-8e60-c05b22224ab3.png";
const imgFrame12 = "/assets/icons/chat/95666cd4-69c4-45ea-ad33-a8c7668c489d.png";
const imgFrame13 = "/assets/icons/chat/5c992a8f-d462-49b1-b828-ef4a384ef8cf.png";
const imgFrame14 = "/assets/icons/chat/298bf0ba-1dcd-4f00-9930-08ed5628d8b0.png";
const imgEllipse1113 = "/assets/icons/chat/b42cdab6-eef2-4786-8ba3-e7d64cfbc0a6.png";
const imgEllipse1112 = "/assets/icons/chat/7dec372e-1899-4f88-a267-a7b913c20e60.png";

const HOME_NAV_HOME_ICON = '/assets/icons/nav-home.svg';
const HOME_NAV_CONTROL_ICON = '/assets/icons/b9d09094-70f7-447b-8478-9f6a02bb6250.png';
const HOME_NAV_CHAT_ICON = '/assets/icons/nav-chat.svg';
const HOME_NAV_SETTINGS_ICON = '/assets/icons/nav-settings.svg';

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8" cy="8" r="5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M12 12L16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function ChevronIcon({ expanded }) {
  return (
    <svg 
      width="20" 
      height="20" 
      viewBox="0 0 20 20" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}
    >
      <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function Chat({ onNavigateToChat, onNavigateToGroup, onNavigateToSubMenu, onSelectTab }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState({
    companies: true,
    friends: true,
    groups: true
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const conversations = {
    companies: [
      { id: 1, name: 'Ocean Express Logistics', avatar: imgFrame10, message: 'Typing...', time: '16:02', unread: 2 },
      { id: 2, name: 'Swift Cargo Solutions', avatar: imgFrame11, message: "It's very good to use", time: '10:02', unread: 0 },
    ],
    friends: [
      { id: 3, name: 'James', avatar: imgFrame12, message: 'Typing...', time: '16:02', unread: 1 },
      { id: 4, name: 'Ryan', avatar: imgFrame13, message: 'Yes, we did it! 🔥', time: '14:23', unread: 0 },
      { id: 5, name: 'Lee', avatar: imgFrame14, message: "It's very good to use", time: '10:02', unread: 0 },
    ],
    groups: [
      { id: 6, name: 'Work Contact Group (4)', avatar: imgEllipse1113, isGroup: true },
      { id: 7, name: 'Work Contact Group (2)', avatar: imgEllipse1112, isGroup: true },
    ]
  };

  const filterConversations = (list) => {
    if (!searchQuery) return list;
    return list.filter(conv => 
      conv.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <div className="chat-screen">
      {/* Header */}
      <div className="chat-screen__header">
        <div className="chat-screen__header-title">Chat</div>
      </div>

      {/* Search & Content */}
      <div className="chat-screen__body">
        {/* Search Bar */}
        <div className="chat-screen__search">
          <div className="chat-screen__search-input">
            <span style={{ opacity: 0.4, color: '#153860' }}>
              <SearchIcon />
            </span>
            <input 
              type="text" 
              placeholder="Search messages"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Conversation Lists */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          
          {/* Companies Section */}
          <div>
            <button 
              className="chat-screen__section-title"
              onClick={() => toggleSection('companies')}
              style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '8px 0' }}
            >
              <span>Companies ({filterConversations(conversations.companies).length})</span>
              <ChevronIcon expanded={expandedSections.companies} />
            </button>
            
            {expandedSections.companies && filterConversations(conversations.companies).map(conv => (
              <div 
                key={conv.id}
                className="chat-screen__thread"
                onClick={onNavigateToChat}
              >
                <div className="chat-screen__avatar">
                  <img src={conv.avatar} alt={conv.name} />
                </div>
                <div className="chat-screen__thread-main">
                  <div className="chat-screen__thread-row">
                    <span className="chat-screen__thread-name">{conv.name}</span>
                    <span className="chat-screen__thread-time">{conv.time}</span>
                  </div>
                  <div className="chat-screen__thread-subrow">
                    <span className="chat-screen__thread-message">{conv.message}</span>
                    {conv.unread > 0 && (
                      <span className="chat-screen__badge chat-screen__badge--alert">{conv.unread}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Friends Section */}
          <div>
            <button 
              className="chat-screen__section-title"
              onClick={() => toggleSection('friends')}
              style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '8px 0' }}
            >
              <span>Friends ({filterConversations(conversations.friends).length})</span>
              <ChevronIcon expanded={expandedSections.friends} />
            </button>
            
            {expandedSections.friends && filterConversations(conversations.friends).map(conv => (
              <div 
                key={conv.id}
                className="chat-screen__thread"
                onClick={onNavigateToChat}
              >
                <div className="chat-screen__avatar">
                  <img src={conv.avatar} alt={conv.name} />
                </div>
                <div className="chat-screen__thread-main">
                  <div className="chat-screen__thread-row">
                    <span className="chat-screen__thread-name">{conv.name}</span>
                    <span className="chat-screen__thread-time">{conv.time}</span>
                  </div>
                  <div className="chat-screen__thread-subrow">
                    <span className="chat-screen__thread-message">{conv.message}</span>
                    {conv.unread > 0 && (
                      <span className="chat-screen__badge chat-screen__badge--alert">{conv.unread}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Groups Section */}
          <div>
            <button 
              className="chat-screen__section-title"
              onClick={() => toggleSection('groups')}
              style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '8px 0' }}
            >
              <span>Groups ({filterConversations(conversations.groups).length})</span>
              <ChevronIcon expanded={expandedSections.groups} />
            </button>
            
            {expandedSections.groups && filterConversations(conversations.groups).map(conv => (
              <div 
                key={conv.id}
                className="chat-screen__thread"
                onClick={onNavigateToGroup}
              >
                <div className="chat-screen__avatar">
                  <img src={conv.avatar} alt={conv.name} />
                </div>
                <div className="chat-screen__thread-main">
                  <div className="chat-screen__thread-row">
                    <span className="chat-screen__thread-name">{conv.name}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation - Same as other screens */}
      <nav className="home-bottom-nav" aria-label="Primary navigation">
        <button
          type="button"
          className="home-bottom-nav__item"
          onClick={() => onSelectTab && onSelectTab('home')}
        >
          <span className="home-bottom-nav__icon" aria-hidden="true">
            <img src={HOME_NAV_HOME_ICON} alt="" />
          </span>
          <span className="home-bottom-nav__label">Home</span>
        </button>

        <button
          type="button"
          className="home-bottom-nav__item"
          onClick={() => onSelectTab && onSelectTab('control')}
        >
          <span className="home-bottom-nav__icon" aria-hidden="true">
            <img src={HOME_NAV_CONTROL_ICON} alt="" />
          </span>
          <span className="home-bottom-nav__label">Control</span>
        </button>

        <button
          type="button"
          className="home-bottom-nav__item home-bottom-nav__item--active"
        >
          <span className="home-bottom-nav__icon" aria-hidden="true">
            <img src={HOME_NAV_CHAT_ICON} alt="" />
          </span>
          <span className="home-bottom-nav__label">Chat</span>
        </button>

        <button
          type="button"
          className="home-bottom-nav__item"
          onClick={() => onSelectTab && onSelectTab('settings')}
        >
          <span className="home-bottom-nav__icon" aria-hidden="true">
            <img src={HOME_NAV_SETTINGS_ICON} alt="" />
          </span>
          <span className="home-bottom-nav__label">Settings</span>
        </button>
      </nav>

      {/* Home Indicator */}
      <div className="home-indicator" aria-hidden="true">
        <span />
      </div>
    </div>
  );
}
