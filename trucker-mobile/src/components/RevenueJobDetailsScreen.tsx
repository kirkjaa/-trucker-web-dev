import { useState } from 'react'

const BACK_ICON = '/assets/icons/back.svg'
const COINS_ICON = '/assets/icons/revenue-coins.svg'
const ROUTE_ICON = '/assets/icons/revenue-route.svg'
const BOX_ICON = '/assets/icons/revenue-box.svg'

type RevenueJobDetailsScreenProps = {
  jobId: string
  onBack: () => void
}

type StopInfo = {
  id: string
  type: 'pickup' | 'delivery'
  locationName: string
  route: string
  destination: string
  scheduledDate: string
  scheduledTime: string
  note?: string
  sopStatus?: 'completed' | null
  podStatus?: 'completed' | null
}

const MOCK_JOB_DATA = {
  companyName: 'Thai PM Charter Co., Ltd.',
  amount: 3000,
  totalStops: 4,
  cargoWeight: 60,
  status: 'paid' as const,
  stops: [
    {
      id: 'stop-1',
      type: 'pickup' as const,
      locationName: 'Sugar Production Factory1',
      route: 'BKK001 Lat Krabang / Krung Thep Maha Nakhon',
      destination: 'Warehouse in Khun Boriphot (Entrance requires ID card)',
      scheduledDate: '15/08/2025',
      scheduledTime: '09.00',
      note: 'Must show ID at entrance',
      sopStatus: 'completed' as const,
    },
    {
      id: 'stop-2',
      type: 'delivery' as const,
      locationName: 'Sugar Outlet Center, Phuying Market',
      route: 'SAM001 City/Samut Prakan',
      destination: 'Warehouse in Khun Boriphot (Entrance requires ID card)',
      scheduledDate: '15/08/2025',
      scheduledTime: '10.00',
      note: '',
      podStatus: 'completed' as const,
    },
    {
      id: 'stop-3',
      type: 'delivery' as const,
      locationName: 'CP ALL Store, Robinson Water Gate',
      route: 'SAM001 City/Samut Prakan',
      destination: 'Warehouse in Khun Boriphot (Entrance requires ID card)',
      scheduledDate: '15/08/2025',
      scheduledTime: '11.00',
      note: '',
      podStatus: 'completed' as const,
    },
  ] as StopInfo[],
}

export function RevenueJobDetailsScreen({ jobId, onBack }: RevenueJobDetailsScreenProps) {
  const [selectedTab, setSelectedTab] = useState<'route' | 'payment'>('route')
  
  const jobData = MOCK_JOB_DATA // In real app, fetch by jobId

  return (
    <div className="revenue-job-details" role="presentation">
      {/* Status Bar */}
      <div className="revenue-job-details__status-bar" aria-hidden="true">
        <span className="status-time">9:41</span>
        <div className="status-icons">
          <svg width="18" height="10" viewBox="0 0 18 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 9H15.5C14.67 9 14 8.33 14 7.5V2.5C14 1.67 14.67 1 15.5 1H17V9Z" fill="#153860" />
            <path d="M12.5 9H11C10.17 9 9.5 8.33 9.5 7.5V4.5C9.5 3.67 10.17 3 11 3H12.5V9Z" fill="#153860" />
            <path d="M8 9H6.5V6H8V9Z" fill="#153860" />
            <path d="M3.5 9H2V7.5H3.5V9Z" fill="#153860" />
          </svg>
          <svg width="15" height="11" viewBox="0 0 15 11" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.5 0C4.74 0 2.24 1.06 0.5 2.8L1.91 4.21C3.25 2.87 5.26 2 7.5 2C9.74 2 11.75 2.87 13.09 4.21L14.5 2.8C12.76 1.06 10.26 0 7.5 0ZM7.5 4C5.84 4 4.33 4.67 3.24 5.76L4.65 7.17C5.44 6.38 6.42 5.9 7.5 5.9C8.58 5.9 9.56 6.38 10.35 7.17L11.76 5.76C10.67 4.67 9.16 4 7.5 4ZM7.5 8C6.95 8 6.45 8.22 6.08 8.58L7.5 10L8.92 8.58C8.55 8.22 8.05 8 7.5 8Z" fill="#153860" />
          </svg>
          <svg width="27" height="13" viewBox="0 0 27 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="1" y="3" width="21" height="10" rx="1.5" stroke="#153860" strokeWidth="1.2" />
            <path d="M23 6V10H25.5C25.78 10 26 9.78 26 9.5V6.5C26 6.22 25.78 6 25.5 6H23Z" fill="#153860" />
            <rect x="3" y="5" width="17" height="6" rx="0.5" fill="#153860" />
          </svg>
        </div>
      </div>

      {/* Header */}
      <header className="revenue-job-details__header">
        <button type="button" className="revenue-job-details__back-btn" onClick={onBack} aria-label="Back">
          <img src={BACK_ICON} alt="" aria-hidden="true" />
        </button>
        <h1>{jobData.companyName}</h1>
      </header>

      {/* Tabs */}
      <div className="revenue-job-details__tabs">
        <button
          type="button"
          className={`revenue-job-details__tab ${selectedTab === 'route' ? 'revenue-job-details__tab--active' : ''}`}
          onClick={() => setSelectedTab('route')}
        >
          Route
        </button>
        <button
          type="button"
          className={`revenue-job-details__tab ${selectedTab === 'payment' ? 'revenue-job-details__tab--active' : ''}`}
          onClick={() => setSelectedTab('payment')}
        >
          Payment
        </button>
      </div>

      {/* Content */}
      <main className="revenue-job-details__content">
        {selectedTab === 'route' ? (
          <>
            {/* Summary Cards */}
            <div className="revenue-job-details__summary">
              <div className="revenue-job-details__summary-card revenue-job-details__summary-card--primary">
                <img src={COINS_ICON} alt="" className="revenue-job-details__summary-icon" />
                <span className="revenue-job-details__summary-amount">฿ {jobData.amount.toLocaleString()}</span>
              </div>
              <div className="revenue-job-details__summary-card">
                <img src={ROUTE_ICON} alt="" className="revenue-job-details__summary-icon" />
                <span className="revenue-job-details__summary-text">Pickup/Delivery: {jobData.totalStops}</span>
              </div>
              <div className="revenue-job-details__summary-card">
                <img src={BOX_ICON} alt="" className="revenue-job-details__summary-icon" />
                <span className="revenue-job-details__summary-text">Weight: {jobData.cargoWeight}</span>
              </div>
            </div>

            {/* Status Badge */}
            <div className="revenue-job-details__status-badge">
              <div className="revenue-job-details__status-dot" />
              <span>Paid</span>
            </div>

            {/* Route Header */}
            <div className="revenue-job-details__route-header">
              <h2>Sender: {jobData.stops[0]?.locationName || 'N/A'}</h2>
            </div>

            {/* Stops Timeline */}
            <div className="revenue-job-details__timeline">
              {jobData.stops.map((stop, index) => (
                <div key={stop.id} className="revenue-job-details__stop">
                  <div className="revenue-job-details__stop-marker">
                    <div className={`revenue-job-details__stop-icon ${stop.sopStatus === 'completed' || stop.podStatus === 'completed' ? 'revenue-job-details__stop-icon--completed' : ''}`}>
                      {stop.sopStatus === 'completed' || stop.podStatus === 'completed' ? (
                        <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 5L4.5 8.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : null}
                    </div>
                    {index < jobData.stops.length - 1 && (
                      <div className="revenue-job-details__stop-line" />
                    )}
                  </div>

                  <div className="revenue-job-details__stop-content">
                    <div className="revenue-job-details__stop-header">
                      <h3>{stop.locationName}</h3>
                      {(stop.sopStatus === 'completed' || stop.podStatus === 'completed') && (
                        <span className="revenue-job-details__stop-status">
                          {stop.sopStatus === 'completed' ? 'SOP Success' : 'POD Success'}
                        </span>
                      )}
                    </div>

                    <div className="revenue-job-details__stop-details">
                      <div className="revenue-job-details__detail-row">
                        <span className="revenue-job-details__detail-label">Location:</span>
                        <span className="revenue-job-details__detail-value">{stop.destination}</span>
                      </div>
                      <div className="revenue-job-details__detail-row">
                        <span className="revenue-job-details__detail-label">Route:</span>
                        <span className="revenue-job-details__detail-value">{stop.route}</span>
                      </div>
                      <div className="revenue-job-details__detail-row">
                        <span className="revenue-job-details__detail-label">Scheduled:</span>
                        <span className="revenue-job-details__detail-value">
                          {stop.scheduledDate} ({stop.scheduledTime})
                        </span>
                      </div>
                      <div className="revenue-job-details__detail-row">
                        <span className="revenue-job-details__detail-label">Pickup Time:</span>
                        <span className="revenue-job-details__detail-value">
                          {stop.scheduledDate} | {stop.scheduledTime}
                        </span>
                      </div>
                      {stop.note && (
                        <div className="revenue-job-details__detail-row">
                          <span className="revenue-job-details__detail-label">Note:</span>
                          <span className="revenue-job-details__detail-value">{stop.note}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="revenue-job-details__payment-tab">
            <p>Payment information coming soon...</p>
          </div>
        )}
      </main>

      {/* Home Indicator */}
      <div className="home-indicator" aria-hidden="true">
        <span />
      </div>
    </div>
  )
}









