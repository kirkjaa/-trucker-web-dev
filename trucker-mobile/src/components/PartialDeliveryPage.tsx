import { useState } from 'react'

// Asset paths
const DELIVERY_LOCATION_IMAGE = '/assets/images/delivery-location.png'
const VIEW_EXPENSES_ICON = '/assets/icons/view-expenses.svg'
const ADD_EXPENSE_ICON = '/assets/icons/add-expense.svg'
const REPORT_ISSUE_ICON = '/assets/icons/report-issue.svg'
const BACK_ICON = '/assets/icons/back.svg'
const DETAIL_CALL_ICON = '/assets/icons/detail-call.svg'
const DETAIL_ROUTE_ACTION_ICON = '/assets/icons/detail-route-action.svg'
const CHECKIN_ICON = '/assets/icons/checkin.svg'
const SUCCESS_ICON = '/assets/icons/success.svg'
const PAYMENT_SUCCESS_ICON = '/assets/icons/expenses-coins.svg'
const CAMERA_ICON = '/assets/icons/camera.svg'

type PartialDeliveryPageProps = {
  onBack: () => void
  onViewExpenses?: () => void
  onAddExpense?: () => void
  onReportIssue?: () => void
  onCall?: () => void
  onDirections?: () => void
  onCheckin?: () => void
  onPayment?: () => void
}

export function PartialDeliveryPage({
  onBack,
  onViewExpenses,
  onAddExpense,
  onReportIssue,
  onCall,
  onDirections,
  onCheckin,
  onPayment,
}: PartialDeliveryPageProps) {
  const [showReportIssueModal, setShowReportIssueModal] = useState(false)
  const [reportIssueView, setReportIssueView] = useState<'selection' | 'partial-delivery-form' | 'temporary-stoppage-form' | 'report-issue-form'>('selection')

  const handleReportIssue = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    console.log('Report Issue button clicked')
    setShowReportIssueModal(true)
    setReportIssueView('selection')
    onReportIssue?.()
  }

  const handleCloseModal = () => {
    setShowReportIssueModal(false)
    setReportIssueView('selection')
  }

  const handlePartialDeliverySelect = () => {
    setReportIssueView('partial-delivery-form')
  }

  const handleTemporaryStoppageSelect = () => {
    setReportIssueView('temporary-stoppage-form')
  }

  const handleReportIssueSelect = () => {
    setReportIssueView('report-issue-form')
  }

  return (
    <>
      <div className="partial-delivery-page" data-node-id="10199:110421">
        {/* Status Bar */}
        <div className="partial-delivery-page__status-bar" data-node-id="10199:110425">
          <div className="partial-delivery-page__time">9:41</div>
          <div className="partial-delivery-page__status-icons">
            <div className="partial-delivery-page__signal-icon">
              <svg width="18" height="10" viewBox="0 0 18 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 9H15.5C14.67 9 14 8.33 14 7.5V2.5C14 1.67 14.67 1 15.5 1H17V9Z" fill="#111827" />
                <path d="M12.5 9H11C10.17 9 9.5 8.33 9.5 7.5V4.5C9.5 3.67 10.17 3 11 3H12.5V9Z" fill="#111827" />
                <path d="M8 9H6.5V6H8V9Z" fill="#111827" />
                <path d="M3.5 9H2V7.5H3.5V9Z" fill="#111827" />
              </svg>
            </div>
            <div className="partial-delivery-page__wifi-icon">
              <svg width="15" height="11" viewBox="0 0 15 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.5 0C4.74 0 2.24 1.06 0.5 2.8L1.91 4.21C3.25 2.87 5.26 2 7.5 2C9.74 2 11.75 2.87 13.09 4.21L14.5 2.8C12.76 1.06 10.26 0 7.5 0ZM7.5 4C5.84 4 4.33 4.67 3.24 5.76L4.65 7.17C5.44 6.38 6.42 5.9 7.5 5.9C8.58 5.9 9.56 6.38 10.35 7.17L11.76 5.76C10.67 4.67 9.16 4 7.5 4ZM7.5 8C6.95 8 6.45 8.22 6.08 8.58L7.5 10L8.92 8.58C8.55 8.22 8.05 8 7.5 8Z" fill="#111827" />
              </svg>
            </div>
            <div className="partial-delivery-page__battery-icon">
              <svg width="27" height="13" viewBox="0 0 27 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="1" y="3" width="21" height="10" rx="1.5" stroke="#111827" strokeWidth="1.2" />
                <path d="M23 6V10H25.5C25.78 10 26 9.78 26 9.5V6.5C26 6.22 25.78 6 25.5 6H23Z" fill="#111827" />
                <rect x="3" y="5" width="17" height="6" rx="0.5" fill="#111827" />
              </svg>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="partial-delivery-page__header" data-node-id="10199:110426">
          <button type="button" onClick={onBack} className="partial-delivery-page__back-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="#153860" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className="partial-delivery-page__header-title">
            <h1>Delivery Point • Chai Sugar Co., Ltd.</h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="partial-delivery-page__content">
          {/* Action Buttons Card */}
          <div className="partial-delivery-page__action-card" data-node-id="10199:110435">
            <button
              type="button"
              className="partial-delivery-page__action-btn"
              onClick={onViewExpenses}
              data-node-id="10199:110436"
            >
              <div className="partial-delivery-page__action-icon">
                <img src={VIEW_EXPENSES_ICON} alt="" />
              </div>
              <span>View expenses</span>
            </button>
            <div className="partial-delivery-page__divider" />
            <button
              type="button"
              className="partial-delivery-page__action-btn"
              onClick={onAddExpense}
              data-node-id="10199:110441"
            >
              <div className="partial-delivery-page__action-icon">
                <img src={ADD_EXPENSE_ICON} alt="" />
              </div>
              <span>Add expense</span>
            </button>
            <div className="partial-delivery-page__divider" />
            <button
              type="button"
              className="partial-delivery-page__action-btn"
              onClick={handleReportIssue}
              data-node-id="10199:110446"
            >
              <div className="partial-delivery-page__action-icon">
                <img src={REPORT_ISSUE_ICON} alt="" />
              </div>
              <span>Report issue</span>
            </button>
          </div>

          {/* Payment Info Card */}
          <div className="partial-delivery-page__payment-card" data-node-id="10199:110450">
            <div className="partial-delivery-page__payment-header">
              <h3>Payment Information</h3>
              <div className="partial-delivery-page__status-tag">
                <div className="partial-delivery-page__status-dot" />
                <span>Payment successful</span>
              </div>
            </div>
            <div className="partial-delivery-page__payment-details">
              <div className="partial-delivery-page__payment-item">
                <span className="partial-delivery-page__payment-label">Payment Method</span>
                <span className="partial-delivery-page__payment-value">Cash on Delivery</span>
              </div>
              <div className="partial-delivery-page__payment-item">
                <span className="partial-delivery-page__payment-label">Amount (THB)</span>
                <span className="partial-delivery-page__payment-value">1,000</span>
              </div>
            </div>
            <button type="button" className="partial-delivery-page__payment-btn" onClick={onPayment}>
              Make Payment
            </button>
          </div>

          {/* Delivery Details Card */}
          <div className="partial-delivery-page__details-card" data-node-id="10199:110468">
            <div className="partial-delivery-page__details-section">
              <div className="partial-delivery-page__detail-item">
                <span className="partial-delivery-page__detail-label">Contact Name</span>
                <span className="partial-delivery-page__detail-value">Mr. Thongchai</span>
              </div>
              <div className="partial-delivery-page__detail-item">
                <span className="partial-delivery-page__detail-label">Route</span>
                <span className="partial-delivery-page__detail-value">SAM001 City/Samut Prakan</span>
              </div>
              <div className="partial-delivery-page__detail-item">
                <span className="partial-delivery-page__detail-label">Address</span>
                <span className="partial-delivery-page__detail-value">55/5 Soi Lat Phrao 101, Khlong Chan, Bangkok</span>
              </div>
              <div className="partial-delivery-page__detail-map">
                <img src={DELIVERY_LOCATION_IMAGE} alt="Delivery location" />
              </div>
              <div className="partial-delivery-page__detail-item">
                <span className="partial-delivery-page__detail-label">Product Type</span>
                <span className="partial-delivery-page__detail-value">Sugar (10 boxes)</span>
              </div>
              <div className="partial-delivery-page__detail-item">
                <span className="partial-delivery-page__detail-label">Pickup Time</span>
                <span className="partial-delivery-page__detail-value">15/08/2025 | 10:00</span>
              </div>
              <div className="partial-delivery-page__detail-item">
                <span className="partial-delivery-page__detail-label">Notes</span>
                <span className="partial-delivery-page__detail-value">Must show ID card at entrance</span>
              </div>
            </div>

            <div className="partial-delivery-page__action-buttons">
              <button type="button" className="partial-delivery-page__outline-btn" onClick={onCall}>
                <img src={DETAIL_CALL_ICON} alt="" />
                <span>Call</span>
              </button>
              <button type="button" className="partial-delivery-page__outline-btn" onClick={onDirections}>
                <img src={DETAIL_ROUTE_ACTION_ICON} alt="" />
                <span>Directions</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Action Button */}
        <div className="partial-delivery-page__bottom-action">
          <button type="button" className="partial-delivery-page__checkin-btn" onClick={onCheckin}>
            <img src={CHECKIN_ICON} alt="" />
            <span>Check In</span>
          </button>
        </div>
      </div>

      {/* Report Issue Modal */}
      {showReportIssueModal && (
        <>
          {reportIssueView === 'selection' ? (
            <ReportIssueSelectionModal 
              onClose={handleCloseModal}
              onSelectPartialDelivery={handlePartialDeliverySelect}
              onSelectTemporaryStoppage={handleTemporaryStoppageSelect}
              onSelectReportIssue={handleReportIssueSelect}
            />
          ) : reportIssueView === 'partial-delivery-form' ? (
            <PartialDeliveryFormModal
              onBack={() => setReportIssueView('selection')}
              onClose={handleCloseModal}
              onConfirm={() => {
                setShowReportIssueModal(false)
                setReportIssueView('selection')
                handleCloseModal()
              }}
            />
          ) : reportIssueView === 'temporary-stoppage-form' ? (
            <TemporaryWorkStoppageFormModal
              onBack={() => setReportIssueView('selection')}
              onClose={handleCloseModal}
              onConfirm={() => {
                setShowReportIssueModal(false)
                setReportIssueView('selection')
                handleCloseModal()
              }}
            />
          ) : (
            <ReportIssueFormModal
              onBack={() => setReportIssueView('selection')}
              onClose={handleCloseModal}
              onConfirm={() => {
                setShowReportIssueModal(false)
                setReportIssueView('selection')
                handleCloseModal()
              }}
            />
          )}
        </>
      )}
    </>
  )
}

type ReportIssueSelectionModalProps = {
  onClose: () => void
  onSelectPartialDelivery: () => void
  onSelectTemporaryStoppage: () => void
  onSelectReportIssue: () => void
}

function ReportIssueSelectionModal({ onClose, onSelectPartialDelivery, onSelectTemporaryStoppage, onSelectReportIssue }: ReportIssueSelectionModalProps) {
  const [selectedIssue, setSelectedIssue] = useState<string>('')

  const handleDownloadForm = () => {
    // Handle download of vehicle change form
    console.log('Downloading vehicle change form...')
    // In a real app, this would trigger a file download
  }

  const handleOptionSelect = (value: string) => {
    setSelectedIssue(value)
    if (value === 'partial-delivery') {
      onSelectPartialDelivery()
    } else if (value === 'temporary-stoppage') {
      onSelectTemporaryStoppage()
    } else if (value === 'report-issue') {
      onSelectReportIssue()
    }
  }

  return (
    <div 
      className="report-issue-modal-overlay" 
      data-node-id="10199:110525" 
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div className="report-issue-modal" data-node-id="10199:110527" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="report-issue-modal__header" data-node-id="10199:110529">
          <h2>Report Issue</h2>
          <button type="button" className="report-issue-modal__close" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="#153860" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Modal Content */}
        <div className="report-issue-modal__content" data-node-id="10199:110534">
          <h3>Report Issue / Incident</h3>
          
          <div className="report-issue-modal__options">
            <label className="report-issue-modal__option">
              <input
                type="radio"
                name="issue"
                value="partial-delivery"
                checked={selectedIssue === 'partial-delivery'}
                onChange={(e) => handleOptionSelect(e.target.value)}
              />
              <span>Partial delivery</span>
            </label>
            
            <label className="report-issue-modal__option">
              <input
                type="radio"
                name="issue"
                value="temporary-stoppage"
                checked={selectedIssue === 'temporary-stoppage'}
                onChange={(e) => handleOptionSelect(e.target.value)}
              />
              <span>Temporary work stoppage</span>
            </label>
            
            <label className="report-issue-modal__option">
              <input
                type="radio"
                name="issue"
                value="report-issue"
                checked={selectedIssue === 'report-issue'}
                onChange={(e) => handleOptionSelect(e.target.value)}
              />
              <span>Report issue</span>
            </label>
          </div>

          <button type="button" className="report-issue-modal__download-btn" onClick={handleDownloadForm}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 12.5L5 8.5H7.5V2.5H10.5V8.5H13L9 12.5Z" fill="#153860" />
              <path d="M2 15.5V16.5H16V15.5H2Z" fill="#153860" />
            </svg>
            <span>Download Vehicle Change Form</span>
          </button>
        </div>
      </div>
    </div>
  )
}

type PartialDeliveryFormModalProps = {
  onBack: () => void
  onClose: () => void
  onConfirm: () => void
}

function PartialDeliveryFormModal({ onBack, onClose, onConfirm }: PartialDeliveryFormModalProps) {
  const [boxCount, setBoxCount] = useState<string>('')
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setUploadedImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleConfirm = () => {
    // Validate partial delivery fields
    if (!boxCount || !uploadedImage) {
      alert('Please fill in all required fields')
      return
    }
    onConfirm()
    // In a real app, this would submit the issue report
    console.log('Partial delivery reported:', { boxCount, uploadedImage })
  }

  return (
    <div 
      className="report-issue-modal-overlay" 
      data-node-id="10199:110525" 
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div className="report-issue-modal" data-node-id="10199:110527" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="report-issue-modal__header" data-node-id="10199:110529">
          <button type="button" className="report-issue-modal__back" onClick={onBack}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="#153860" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <h2>Report Issue</h2>
          <button type="button" className="report-issue-modal__close" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="#153860" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Modal Content */}
        <div className="report-issue-modal__content" data-node-id="10199:110534">
          <h3>Report Issue / Incident</h3>
          
          <div className="report-issue-modal__options">
            <div className="report-issue-modal__selected-option">
              <div className="report-issue-modal__option-header">
                <input
                  type="radio"
                  name="issue"
                  value="partial-delivery"
                  checked={true}
                  readOnly
                />
                <span>Partial delivery</span>
              </div>
              <div className="report-issue-modal__partial-delivery-form">
                <div className="report-issue-modal__input-group">
                  <label className="report-issue-modal__input-label">
                    Specify number of boxes <span className="report-issue-modal__required">*</span>
                  </label>
                  <input
                    type="text"
                    className="report-issue-modal__text-input"
                    placeholder="Enter number of boxes"
                    value={boxCount}
                    onChange={(e) => setBoxCount(e.target.value)}
                  />
                </div>
                <div className="report-issue-modal__upload-group">
                  <label className="report-issue-modal__input-label">
                    Upload product image <span className="report-issue-modal__required">*</span>
                  </label>
                  <div className="report-issue-modal__upload-area">
                    {uploadedImage ? (
                      <div className="report-issue-modal__uploaded-image">
                        <img src={uploadedImage} alt="Uploaded product" />
                        <button
                          type="button"
                          className="report-issue-modal__remove-image"
                          onClick={() => setUploadedImage(null)}
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <label className="report-issue-modal__upload-label">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="report-issue-modal__file-input"
                        />
                        <div className="report-issue-modal__upload-icon-wrapper">
                          <img src={CAMERA_ICON} alt="Camera" className="report-issue-modal__camera-icon" />
                        </div>
                        <div className="report-issue-modal__upload-text">
                          <p>Tap to take or select</p>
                          <p>product image</p>
                        </div>
                      </label>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="report-issue-modal__footer">
          <button type="button" className="report-issue-modal__confirm-btn" onClick={handleConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}

type TemporaryWorkStoppageFormModalProps = {
  onBack: () => void
  onClose: () => void
  onConfirm: () => void
}

function TemporaryWorkStoppageFormModal({ onBack, onClose, onConfirm }: TemporaryWorkStoppageFormModalProps) {
  const [reason, setReason] = useState<string>('')

  const handleConfirm = () => {
    // Validate temporary work stoppage fields
    if (!reason.trim()) {
      alert('Please specify the reason')
      return
    }
    onConfirm()
    // In a real app, this would submit the issue report
    console.log('Temporary work stoppage reported:', { reason })
  }

  return (
    <div 
      className="report-issue-modal-overlay" 
      data-node-id="10199:110525" 
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div className="report-issue-modal" data-node-id="10199:110527" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="report-issue-modal__header" data-node-id="10199:110529">
          <button type="button" className="report-issue-modal__back" onClick={onBack}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="#153860" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <h2>Report Issue</h2>
          <button type="button" className="report-issue-modal__close" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="#153860" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Modal Content */}
        <div className="report-issue-modal__content" data-node-id="10199:110534">
          <h3>Report Issue / Incident</h3>
          
          <div className="report-issue-modal__options">
            <div className="report-issue-modal__selected-option">
              <div className="report-issue-modal__option-header">
                <input
                  type="radio"
                  name="issue"
                  value="temporary-stoppage"
                  checked={true}
                  readOnly
                />
                <span>Temporary work stoppage</span>
              </div>
              <div className="report-issue-modal__temporary-stoppage-form">
                <div className="report-issue-modal__input-group">
                  <label className="report-issue-modal__input-label">
                    Specify reason <span className="report-issue-modal__required">*</span>
                  </label>
                  <textarea
                    className="report-issue-modal__textarea-input"
                    placeholder="Enter reason for temporary work stoppage"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={6}
                  />
                </div>
              </div>
            </div>
          </div>

          <button type="button" className="report-issue-modal__download-btn" onClick={() => {
            console.log('Downloading vehicle change form...')
          }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 12.5L5 8.5H7.5V2.5H10.5V8.5H13L9 12.5Z" fill="#153860" />
              <path d="M2 15.5V16.5H16V15.5H2Z" fill="#153860" />
            </svg>
            <span>Download Vehicle Change Form</span>
          </button>
        </div>

        {/* Modal Footer */}
        <div className="report-issue-modal__footer">
          <button type="button" className="report-issue-modal__confirm-btn" onClick={handleConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}

type ReportIssueFormModalProps = {
  onBack: () => void
  onClose: () => void
  onConfirm: () => void
}

function ReportIssueFormModal({ onBack, onClose, onConfirm }: ReportIssueFormModalProps) {
  const [reason, setReason] = useState<string>('')

  const handleConfirm = () => {
    // Validate report issue fields
    if (!reason.trim()) {
      alert('Please specify the reason')
      return
    }
    onConfirm()
    // In a real app, this would submit the issue report
    console.log('Report issue submitted:', { reason })
  }

  return (
    <div 
      className="report-issue-modal-overlay" 
      data-node-id="10199:110525" 
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div className="report-issue-modal" data-node-id="10199:110527" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="report-issue-modal__header" data-node-id="10199:110529">
          <button type="button" className="report-issue-modal__back" onClick={onBack}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="#153860" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <h2>Report Issue</h2>
          <button type="button" className="report-issue-modal__close" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="#153860" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Modal Content */}
        <div className="report-issue-modal__content" data-node-id="10199:110534">
          <h3>Report Issue / Incident</h3>
          
          <div className="report-issue-modal__options">
            <div className="report-issue-modal__selected-option">
              <div className="report-issue-modal__option-header">
                <input
                  type="radio"
                  name="issue"
                  value="report-issue"
                  checked={true}
                  readOnly
                />
                <span>Report issue</span>
              </div>
              <div className="report-issue-modal__temporary-stoppage-form">
                <div className="report-issue-modal__input-group">
                  <label className="report-issue-modal__input-label">
                    Specify reason <span className="report-issue-modal__required">*</span>
                  </label>
                  <textarea
                    className="report-issue-modal__textarea-input"
                    placeholder="Enter reason for issue"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={6}
                  />
                </div>
              </div>
            </div>
          </div>

          <button type="button" className="report-issue-modal__download-btn" onClick={() => {
            console.log('Downloading vehicle change form...')
          }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 12.5L5 8.5H7.5V2.5H10.5V8.5H13L9 12.5Z" fill="#153860" />
              <path d="M2 15.5V16.5H16V15.5H2Z" fill="#153860" />
            </svg>
            <span>Download Vehicle Change Form</span>
          </button>
        </div>

        {/* Modal Footer */}
        <div className="report-issue-modal__footer">
          <button type="button" className="report-issue-modal__confirm-btn" onClick={handleConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}

