import { useState } from 'react'
import { JobHistoryRouteScreen } from './JobHistoryRouteScreen'
import { useRevenue } from '../hooks/useFinance'

const BACK_ICON = '/assets/icons/back.svg'
const CHECK_ICON = '/assets/icons/revenue-check.svg'
const CLOCK_ICON = '/assets/icons/revenue-clock.svg'

type RevenueScreenProps = {
  onBack: () => void
}

type ViewState = 'list' | 'job-detail'

type RevenueEntry = {
  id: string
  companyName: string
  amount: number
  status: 'paid' | 'pending'
  month: string
}

// Fallback mock data
const MOCK_REVENUE_DATA: RevenueEntry[] = [
  { id: '1', companyName: 'Thai PM Charter Co., Ltd.', amount: 3000, status: 'paid', month: 'January' },
  { id: '2', companyName: 'CP All Public Company Limited', amount: 2000, status: 'paid', month: 'January' },
  { id: '3', companyName: 'Thai PM Charter Co., Ltd.', amount: 3000, status: 'pending', month: 'February' },
]

export function RevenueScreen({ onBack }: RevenueScreenProps) {
  const [viewState, setViewState] = useState<ViewState>('list')
  const [selectedJob, setSelectedJob] = useState<RevenueEntry | null>(null)
  const [selectedTab, setSelectedTab] = useState<'all' | 'paid' | 'unpaid'>('all')
  const [selectedPeriod] = useState('Every month')

  // Fetch real revenue data from API
  const { revenues: apiRevenues, loading } = useRevenue()

  // Use API data if available, otherwise fall back to mock data
  const revenueData = apiRevenues.length > 0 ? apiRevenues : MOCK_REVENUE_DATA

  const filteredData = revenueData.filter((entry) => {
    if (selectedTab === 'paid') return entry.status === 'paid'
    if (selectedTab === 'unpaid') return entry.status === 'pending'
    return true
  })

  // Group by month
  const groupedByMonth = filteredData.reduce((acc, entry) => {
    if (!acc[entry.month]) {
      acc[entry.month] = []
    }
    acc[entry.month].push(entry)
    return acc
  }, {} as Record<string, RevenueEntry[]>)

  const handleViewJobDetails = (entry: RevenueEntry) => {
    setSelectedJob(entry)
    setViewState('job-detail')
  }

  const handleBackToList = () => {
    setViewState('list')
    setSelectedJob(null)
  }

  // Show job detail screen if a job is selected
  if (viewState === 'job-detail' && selectedJob) {
    return (
      <JobHistoryRouteScreen
        jobId={selectedJob.id}
        companyName={selectedJob.companyName}
        amount={selectedJob.amount}
        onBack={handleBackToList}
      />
    )
  }

  return (
    <div className="revenue-screen" role="presentation">
      {/* Status Bar */}
      <div className="revenue-screen__status-bar" aria-hidden="true">
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
      <header className="revenue-screen__header">
        <button type="button" className="revenue-screen__back-btn" onClick={onBack} aria-label="Back">
          <img src={BACK_ICON} alt="" aria-hidden="true" />
        </button>
        <h1>My Revenue</h1>
      </header>

      {/* Tabs */}
      <div className="revenue-screen__tabs">
        <button
          type="button"
          className={`revenue-screen__tab ${selectedTab === 'all' ? 'revenue-screen__tab--active' : ''}`}
          onClick={() => setSelectedTab('all')}
        >
          All
        </button>
        <button
          type="button"
          className={`revenue-screen__tab ${selectedTab === 'paid' ? 'revenue-screen__tab--active' : ''}`}
          onClick={() => setSelectedTab('paid')}
        >
          Paid
        </button>
        <button
          type="button"
          className={`revenue-screen__tab ${selectedTab === 'unpaid' ? 'revenue-screen__tab--active' : ''}`}
          onClick={() => setSelectedTab('unpaid')}
        >
          Unpaid
        </button>
      </div>

      {/* Period Selector */}
      <div className="revenue-screen__period-selector">
        <select className="revenue-screen__period-select" value={selectedPeriod} disabled>
          <option>Every month</option>
          <option>This month</option>
          <option>Last month</option>
        </select>
        <svg className="revenue-screen__dropdown-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 9L12 15L18 9" stroke="#454545" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Content */}
      <main className="revenue-screen__content">
        {Object.entries(groupedByMonth).map(([month, entries]) => (
          <div key={month} className="revenue-screen__month-section">
            <div className="revenue-screen__month-header">
              <span className="revenue-screen__month-label">{month}</span>
              <div className="revenue-screen__month-divider" />
            </div>

            {entries.map((entry) => (
              <div key={entry.id} className="revenue-screen__entry">
                <div className="revenue-screen__entry-header">
                  <h3 className="revenue-screen__company-name">{entry.companyName}</h3>
                  <div className="revenue-screen__entry-amount">
                    {entry.status === 'paid' ? (
                      <img src={CHECK_ICON} alt="" className="revenue-screen__status-icon" />
                    ) : (
                      <img src={CLOCK_ICON} alt="" className="revenue-screen__status-icon" />
                    )}
                    <span className={`revenue-screen__amount ${entry.status === 'paid' ? 'revenue-screen__amount--paid' : 'revenue-screen__amount--pending'}`}>
                      ฿ {entry.amount.toLocaleString()}
                    </span>
                  </div>
                </div>
                <button type="button" className="revenue-screen__view-job-btn" onClick={() => handleViewJobDetails(entry)}>
                  View Job Details
                </button>
              </div>
            ))}
          </div>
        ))}
      </main>

      {/* Home Indicator */}
      <div className="home-indicator" aria-hidden="true">
        <span />
      </div>
    </div>
  )
}

