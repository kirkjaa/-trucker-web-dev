import React, { useState } from 'react'

// Image assets from Figma (already downloaded)
const imgFrame10 = "/assets/icons/chat-new/frame10.png"
const imgFrame11 = "/assets/icons/chat-new/frame11.png"
const imgFrame12 = "/assets/icons/chat-new/frame12.png"
const imgFrame13 = "/assets/icons/chat-new/frame13.png"
const imgFrame14 = "/assets/icons/chat-new/frame14.png"
const imgGroupIcon1 = "/assets/icons/chat-new/group-icon-1.png"
const imgGroupIcon2 = "/assets/icons/chat-new/group-icon-2.png"
const imgArrowLeft = "/assets/icons/chat-new/arrow-left.svg"
const imgSearch = "/assets/icons/chat-new/search.svg"

// Bottom nav icons – match main app
const imgHome = "/assets/icons/nav-home.svg"
const imgDelivery = "/assets/icons/nav-shipping.svg"
const imgChat = "/assets/icons/nav-chat.svg"
const imgSettings = "/assets/icons/nav-settings.svg"
const imgControl =
  "data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M7 4.5V19.5' stroke='%235A6472' stroke-width='1.6' stroke-linecap='round'/%3E%3Cpath d='M12 4.5V19.5' stroke='%235A6472' stroke-width='1.6' stroke-linecap='round'/%3E%3Cpath d='M17 4.5V19.5' stroke='%235A6472' stroke-width='1.6' stroke-linecap='round'/%3E%3Ccircle cx='7' cy='9.5' r='2' fill='%23EEF2F7' stroke='%235A6472' stroke-width='1.2'/%3E%3Ccircle cx='12' cy='14.5' r='2' fill='%23EEF2F7' stroke='%235A6472' stroke-width='1.2'/%3E%3Ccircle cx='17' cy='8.5' r='2' fill='%23EEF2F7' stroke='%235A6472' stroke-width='1.2'/%3E%3C/svg%3E"
const imgHomeIndicator = "/assets/icons/chat-new/home-indicator.svg"

export default function ChatNew({
  onNavigateToChat,
  onNavigateToGroup,
  onNavigateToSubMenu,
  onSelectTab,
  userRole,
}) {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="chat-screen">
      {/* Header */}
      <header className="chat-screen__header">
        <button
          type="button"
          className="chat-screen__header-back"
          onClick={() => onSelectTab('home')}
        >
          <img src={imgArrowLeft} alt="Back" />
        </button>
        <h1 className="chat-screen__header-title">Chat</h1>
        <button
          type="button"
          className="chat-screen__header-back"
          onClick={onNavigateToSubMenu}
          aria-label="More"
        >
          {/* Placeholder – no icon in assets, keep empty/tap area */}
        </button>
      </header>

      {/* Body */}
      <main className="chat-screen__body">
        {/* Search */}
        <div className="chat-screen__search">
          <div className="chat-screen__search-input">
            <img src={imgSearch} alt="" width={18} height={18} />
            <input
              type="text"
              placeholder="Search messages"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Companies */}
        <section>
          <div className="chat-screen__section-title">
            <span>Companies (2)</span>
          </div>

          <div className="chat-screen__thread" onClick={onNavigateToChat}>
            <div className="chat-screen__avatar">
              <img src={imgFrame10} alt="Ocean Express Logistics" />
            </div>
            <div className="chat-screen__thread-main">
              <div className="chat-screen__thread-row">
                <span className="chat-screen__thread-name">Ocean Express Logistics</span>
                <span className="chat-screen__thread-time">16:02</span>
              </div>
              <div className="chat-screen__thread-subrow">
                <span>Typing...</span>
                <span className="chat-screen__badge">2</span>
              </div>
            </div>
          </div>

          <div className="chat-screen__thread" onClick={onNavigateToChat}>
            <div className="chat-screen__avatar">
              <img src={imgFrame11} alt="Swift Cargo Solutions" />
            </div>
            <div className="chat-screen__thread-main">
              <div className="chat-screen__thread-row">
                <span className="chat-screen__thread-name">Swift Cargo Solutions</span>
                <span className="chat-screen__thread-time">10:02</span>
              </div>
              <div className="chat-screen__thread-subrow">
                <span>It's very good to use</span>
              </div>
            </div>
          </div>
        </section>

        {/* Friends */}
        <section>
          <div className="chat-screen__section-title">
            <span>Friends (3)</span>
          </div>

          <div className="chat-screen__thread" onClick={onNavigateToChat}>
            <div className="chat-screen__avatar">
              <img src={imgFrame12} alt="James" />
            </div>
            <div className="chat-screen__thread-main">
              <div className="chat-screen__thread-row">
                <span className="chat-screen__thread-name">James</span>
                <span className="chat-screen__thread-time">16:02</span>
              </div>
              <div className="chat-screen__thread-subrow">
                <span>Typing...</span>
                <span className="chat-screen__badge">1</span>
              </div>
            </div>
          </div>

          <div className="chat-screen__thread" onClick={onNavigateToChat}>
            <div className="chat-screen__avatar">
              <img src={imgFrame13} alt="Ryan" />
            </div>
            <div className="chat-screen__thread-main">
              <div className="chat-screen__thread-row">
                <span className="chat-screen__thread-name">Ryan</span>
                <span className="chat-screen__thread-time">14:23</span>
              </div>
              <div className="chat-screen__thread-subrow">
                <span>Yes, we did it! 🔥</span>
              </div>
            </div>
          </div>

          <div className="chat-screen__thread" onClick={onNavigateToChat}>
            <div className="chat-screen__avatar">
              <img src={imgFrame14} alt="Lee" />
            </div>
            <div className="chat-screen__thread-main">
              <div className="chat-screen__thread-row">
                <span className="chat-screen__thread-name">Lee</span>
                <span className="chat-screen__thread-time">10:02</span>
              </div>
              <div className="chat-screen__thread-subrow">
                <span>It's very good to use</span>
              </div>
            </div>
          </div>
        </section>

        {/* Groups */}
        <section>
          <div className="chat-screen__section-title">
            <span>Groups (2)</span>
          </div>

          <div className="chat-screen__thread" onClick={onNavigateToGroup}>
            <div className="chat-screen__avatar">
              <img src={imgGroupIcon1} alt="Work contact group (4)" />
            </div>
            <div className="chat-screen__thread-main">
              <div className="chat-screen__thread-row">
                <span className="chat-screen__thread-name">Work contact group (4)</span>
              </div>
            </div>
          </div>

          <div className="chat-screen__thread" onClick={onNavigateToGroup}>
            <div className="chat-screen__avatar">
              <img src={imgGroupIcon2} alt="Work contact group (2)" />
            </div>
            <div className="chat-screen__thread-main">
              <div className="chat-screen__thread-row">
                <span className="chat-screen__thread-name">Work contact group (2)</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Bottom navigation */}
      <div className="chat-screen__bottom-nav-wrapper">
        <div className="chat-screen__bottom-nav">
          {/* Home is always first */}
          <button
            type="button"
            className="chat-screen__bottom-item"
            onClick={() => onSelectTab('home')}
          >
            <img src={imgHome} alt="" width={24} height={24} />
            <span className="chat-screen__bottom-label">Home</span>
          </button>

          {/* Second tab depends on role */}
          {userRole === 'shipping' && (
            <button
              type="button"
              className="chat-screen__bottom-item"
              onClick={() => onSelectTab('shipping')}
            >
              <img src={imgDelivery} alt="" width={24} height={24} />
              <span className="chat-screen__bottom-label">Transportation</span>
            </button>
          )}

          {userRole !== 'shipping' && userRole !== 'company' && userRole !== 'customer' && (
            <button
              type="button"
              className="chat-screen__bottom-item"
              onClick={() => onSelectTab('control')}
            >
              <img src={imgControl} alt="" width={24} height={24} />
              <span className="chat-screen__bottom-label">Control</span>
            </button>
          )}

          {/* Chat (always present, third overall) */}
          <button
            type="button"
            className="chat-screen__bottom-item"
            onClick={() => onSelectTab('chat')}
          >
            <div style={{ position: 'relative' }}>
              <img src={imgChat} alt="" width={24} height={24} />
              <span
                className="chat-screen__badge"
                style={{
                  position: 'absolute',
                  top: -6,
                  right: -10,
                  minWidth: 16,
                  height: 16,
                  fontSize: 10,
                }}
              >
                3
              </span>
            </div>
            <span className="chat-screen__bottom-label chat-screen__bottom-label--active">
              Chat
            </span>
          </button>

          {/* Settings – last, but only if role allows */}
          <button
            type="button"
            className="chat-screen__bottom-item"
            onClick={() => onSelectTab('settings')}
          >
            <img src={imgSettings} alt="" width={24} height={24} />
            <span className="chat-screen__bottom-label">Settings</span>
          </button>
        </div>

        <div className="chat-screen__home-indicator">
          <img src={imgHomeIndicator} alt="" height={5} />
        </div>
      </div>
    </div>
  )
}
