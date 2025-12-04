import { useState } from 'react'

type JobHistoryRouteScreenProps = {
  jobId: string
  companyName: string
  amount: number
  onBack: () => void
}

type RouteStop = {
  id: string
  type: 'pickup' | 'delivery'
  name: string
  status: 'completed' | 'pending'
  statusLabel: string
  contactName: string
  route: string
  productType: string
  arrivalTime: string
  note?: string
}

type ExpenseItem = {
  id: string
  category: string
  amount: number
  receiptImage: string
}

const MOCK_EXPENSE_DATA: ExpenseItem[] = [
  {
    id: '1',
    category: 'Toll Fees',
    amount: 75,
    receiptImage: '/assets/images/vehicle-registration.png',
  },
  {
    id: '2',
    category: 'Port Expenses',
    amount: 75,
    receiptImage: '/assets/images/vehicle-registration.png',
  },
]

const MOCK_ROUTE_DATA: RouteStop[] = [
  {
    id: '1',
    type: 'pickup',
    name: 'Factory1',
    status: 'completed',
    statusLabel: 'SOP Complete',
    contactName: 'Khun Nattapong (Warehouse Staff)',
    route: 'BKK001 Ladprao/Bangkok',
    productType: 'Sugar (30 boxes)',
    arrivalTime: '15/08/2025 | 09.00',
    note: 'ID card required to enter premises',
  },
  {
    id: '2',
    type: 'delivery',
    name: 'Chai Namtan Co., Ltd.',
    status: 'completed',
    statusLabel: 'POD Complete',
    contactName: 'Khun Thongchai',
    route: 'SAM001 Mueang/Samut Prakan',
    productType: 'Sugar (10 boxes)',
    arrivalTime: '15/08/2025 | 09.00',
  },
  {
    id: '3',
    type: 'delivery',
    name: 'Thai Sugar Factory Rung Ruang',
    status: 'completed',
    statusLabel: 'POD Complete',
    contactName: 'Khun Arun Saengthong',
    route: 'SAM001 Mueang/Samut Prakan',
    productType: 'Sugar (10 boxes)',
    arrivalTime: '15/08/2025 | 09.00',
  },
  {
    id: '4',
    type: 'delivery',
    name: 'Good Sugar Company Limited',
    status: 'pending',
    statusLabel: 'Pending',
    contactName: 'Khun Pornthip Nilchan',
    route: 'SAM002 Phra Pradaeng/Samut Prakan',
    productType: 'Sugar (10 boxes)',
    arrivalTime: '15/08/2025 | 13.00',
  },
]

const BACK_ICON = '/assets/icons/back.svg'
const CHECK_ICON = '/assets/icons/revenue-check.svg'
const LOCATION_ICON = '/assets/icons/transportation-location.svg'
const COINS_ICON = '/assets/icons/expenses-coins.svg'
const ROUTE_ICON = '/assets/icons/detail-route.svg'
const BOX_ICON = '/assets/icons/box.svg'
const PHONE_ICON = '/assets/icons/transportation-detail-phone.svg'
const DIRECTIONS_ICON = '/assets/icons/detail-route-action.svg'
const UPDATE_ICON = '/assets/icons/transportation-detail-doc.svg'
const CAMERA_ICON = '/assets/icons/camera.svg'

export function JobHistoryRouteScreen({ jobId, companyName, amount, onBack }: JobHistoryRouteScreenProps) {
  const [selectedTab, setSelectedTab] = useState<'route' | 'expenses'>('route')

  const totalExpenses = MOCK_EXPENSE_DATA.reduce((sum, expense) => sum + expense.amount, 0)

  const handleViewReceipt = (receiptImage: string) => {
    // Open image in a modal or new window
    window.open(receiptImage, '_blank')
  }

  return (
    <div className="job-history-route-screen" role="presentation">
      {/* Status Bar */}
      <div className="job-history-route-screen__status-bar" aria-hidden="true">
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
      <header className="job-history-route-screen__header">
        <button type="button" className="job-history-route-screen__back-btn" onClick={onBack} aria-label="Back">
          <img src={BACK_ICON} alt="" aria-hidden="true" />
        </button>
        <h1>{companyName}</h1>
      </header>

      {/* Tabs */}
      <div className="job-history-route-screen__tabs">
        <button
          type="button"
          className={`job-history-route-screen__tab ${selectedTab === 'route' ? 'job-history-route-screen__tab--active' : ''}`}
          onClick={() => setSelectedTab('route')}
        >
          Route
        </button>
        <button
          type="button"
          className={`job-history-route-screen__tab ${selectedTab === 'expenses' ? 'job-history-route-screen__tab--active' : ''}`}
          onClick={() => setSelectedTab('expenses')}
        >
          Expenses
        </button>
      </div>

      {/* Content */}
      <div className="job-history-route-screen__content">
        {selectedTab === 'route' ? (
          <>
            {/* Summary Card */}
            <div className="job-history-route-screen__summary-card">
          <div className="job-history-route-screen__summary-stats">
            <div className="job-history-route-screen__stat job-history-route-screen__stat--amount">
              <img src={COINS_ICON} alt="" aria-hidden="true" />
              <span className="job-history-route-screen__stat-value">฿ {amount.toLocaleString()}</span>
            </div>
            <div className="job-history-route-screen__stat">
              <img src={ROUTE_ICON} alt="" aria-hidden="true" />
              <span className="job-history-route-screen__stat-label">Pickup/Delivery: 4</span>
            </div>
            <div className="job-history-route-screen__stat">
              <img src={BOX_ICON} alt="" aria-hidden="true" />
              <span className="job-history-route-screen__stat-label">Total Products: 60</span>
            </div>
          </div>
          <div className="job-history-route-screen__status-badge">
            <span className="job-history-route-screen__status-dot" />
            <span>Paid</span>
          </div>
        </div>

        {/* Job Details Section */}
        <div className="job-history-route-screen__job-details">
          <div className="job-history-route-screen__employer">
            <span className="job-history-route-screen__label">Employer:</span>
            <span className="job-history-route-screen__value">Thai PM Charter Co., Ltd.</span>
          </div>

          {/* Route Stops */}
          <div className="job-history-route-screen__stops">
            {MOCK_ROUTE_DATA.map((stop, index) => (
              <div key={stop.id} className="job-history-route-screen__stop-item">
                <div className="job-history-route-screen__stop-indicator">
                  {stop.status === 'completed' ? (
                    <>
                      <img src={CHECK_ICON} alt="" className="job-history-route-screen__stop-icon" />
                      {index < MOCK_ROUTE_DATA.length - 1 && <div className="job-history-route-screen__stop-line" />}
                    </>
                  ) : (
                    <>
                      <img src={LOCATION_ICON} alt="" className="job-history-route-screen__stop-icon" />
                      {index < MOCK_ROUTE_DATA.length - 1 && <div className="job-history-route-screen__stop-line" />}
                    </>
                  )}
                </div>

                <div className="job-history-route-screen__stop-content">
                  <div className="job-history-route-screen__stop-card">
                    <div className="job-history-route-screen__stop-header">
                      <h3 className="job-history-route-screen__stop-title">
                        {stop.type === 'pickup' ? 'Pickup Point' : 'Delivery Point'} {stop.name}
                      </h3>
                      {stop.status === 'completed' && (
                        <span className="job-history-route-screen__stop-status">{stop.statusLabel}</span>
                      )}
                    </div>

                    <div className="job-history-route-screen__stop-details">
                      <div className="job-history-route-screen__detail-row">
                        <span className="job-history-route-screen__detail-label">Contact Name:</span>
                        <span className="job-history-route-screen__detail-value">{stop.contactName}</span>
                      </div>
                      <div className="job-history-route-screen__detail-row">
                        <span className="job-history-route-screen__detail-label">Route:</span>
                        <span className="job-history-route-screen__detail-value">{stop.route}</span>
                      </div>
                      <div className="job-history-route-screen__detail-row">
                        <span className="job-history-route-screen__detail-label">Product Type:</span>
                        <span className="job-history-route-screen__detail-value">{stop.productType}</span>
                      </div>
                      <div className="job-history-route-screen__detail-row">
                        <span className="job-history-route-screen__detail-label">Pickup Time:</span>
                        <span className="job-history-route-screen__detail-value">{stop.arrivalTime}</span>
                      </div>
                      {stop.note && (
                        <div className="job-history-route-screen__detail-row">
                          <span className="job-history-route-screen__detail-label">Note:</span>
                          <span className="job-history-route-screen__detail-value">{stop.note}</span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons for last stop */}
                    {index === MOCK_ROUTE_DATA.length - 1 && (
                      <div className="job-history-route-screen__stop-actions">
                        <button type="button" className="job-history-route-screen__action-btn job-history-route-screen__action-btn--primary">
                          <img src={PHONE_ICON} alt="" aria-hidden="true" />
                          <span>Call</span>
                        </button>
                        <button type="button" className="job-history-route-screen__action-btn job-history-route-screen__action-btn--primary">
                          <img src={DIRECTIONS_ICON} alt="" aria-hidden="true" />
                          <span>Route</span>
                        </button>
                        <button type="button" className="job-history-route-screen__action-btn job-history-route-screen__action-btn--disabled" disabled>
                          <img src={UPDATE_ICON} alt="" aria-hidden="true" />
                          <span>Update Job</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
          </>
        ) : (
          <>
            {/* Expenses Summary Card */}
            <div className="job-history-route-screen__expenses-card">
              <div className="job-history-route-screen__expenses-total">
                <img src={COINS_ICON} alt="" aria-hidden="true" />
                <span className="job-history-route-screen__expenses-total-amount">฿ {totalExpenses.toLocaleString()}</span>
              </div>

              <div className="job-history-route-screen__expenses-list">
                {MOCK_EXPENSE_DATA.map((expense, index) => (
                  <div key={expense.id} className="job-history-route-screen__expense-item">
                    <div className="job-history-route-screen__expense-header">
                      <span className="job-history-route-screen__expense-category">{expense.category}:</span>
                      <span className="job-history-route-screen__expense-amount">฿ {expense.amount.toLocaleString()}</span>
                    </div>
                    <button
                      type="button"
                      className="job-history-route-screen__receipt-button"
                      onClick={() => handleViewReceipt(expense.receiptImage)}
                    >
                      <div className="job-history-route-screen__receipt-image">
                        <img src={expense.receiptImage} alt={`Receipt for ${expense.category}`} />
                        <div className="job-history-route-screen__receipt-overlay">
                          <span className="job-history-route-screen__receipt-text">Click here to view image</span>
                        </div>
                        <div className="job-history-route-screen__receipt-camera">
                          <img src={CAMERA_ICON} alt="" aria-hidden="true" />
                        </div>
                      </div>
                    </button>
                    {index < MOCK_EXPENSE_DATA.length - 1 && <div className="job-history-route-screen__expense-divider" />}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Home Indicator */}
      <div className="home-indicator" aria-hidden="true">
        <span />
      </div>
    </div>
  )
}

