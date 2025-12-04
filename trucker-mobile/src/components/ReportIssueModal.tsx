import { useState } from 'react'

// Asset paths
const CAMERA_ICON = '/assets/icons/camera.svg'

export type ReportIssueModalProps = {
  isOpen: boolean
  onClose: () => void
}

export function ReportIssueModal({ isOpen, onClose }: ReportIssueModalProps) {
  const [reportIssueView, setReportIssueView] = useState<'selection' | 'partial-delivery-form' | 'temporary-stoppage-form' | 'report-issue-form'>('selection')

  const handleCloseModal = () => {
    onClose()
    // Reset view after a short delay to avoid flash when modal is closing
    setTimeout(() => setReportIssueView('selection'), 300)
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

  if (!isOpen) return null

  return (
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
            handleCloseModal()
          }}
        />
      ) : reportIssueView === 'temporary-stoppage-form' ? (
        <TemporaryWorkStoppageFormModal
          onBack={() => setReportIssueView('selection')}
          onClose={handleCloseModal}
          onConfirm={() => {
            handleCloseModal()
          }}
        />
      ) : (
        <ReportIssueFormModal
          onBack={() => setReportIssueView('selection')}
          onClose={handleCloseModal}
          onConfirm={() => {
            handleCloseModal()
          }}
        />
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

