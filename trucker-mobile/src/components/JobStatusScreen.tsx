import type { CurrentJob } from '../types/jobs'

type JobStatusScreenProps = {
  job: CurrentJob
  activeStopId?: string
  onBack: () => void
  onClose: () => void
}

export function JobStatusScreen({ job, activeStopId, onBack, onClose }: JobStatusScreenProps) {
  return (
    <div className="job-status-screen">
      <header className="job-status-screen__header">
        <button type="button" onClick={onBack} className="job-status-screen__back">
          ← Back
        </button>
        <span>{job.id}</span>
        <button type="button" onClick={onClose} className="job-status-screen__close" aria-label="Close">
          ×
        </button>
      </header>

      <section className="job-status-screen__card">
        <header>
          <div>
            <span className={`home-job-card__badge home-job-card__badge--${job.badgeTone}`}>{job.badge}</span>
            <h1>{job.customer}</h1>
            <p>{job.route}</p>
          </div>
          <div className="job-status-screen__progress">
            <strong>{job.status}</strong>
            <span>{job.progress}% complete</span>
          </div>
        </header>

        <div className="job-status-screen__layout">
          <aside className="job-status-screen__sidebar">
            <div className="job-status-map" aria-hidden="true">
              <span>{job.route}</span>
            </div>
            <div className="job-status-sidebar-card">
              <h3>Driver</h3>
              <strong>{job.driver}</strong>
              <span>{job.trailer}</span>
              <button type="button">Contact driver</button>
            </div>
            <div className="job-status-sidebar-card">
              <h3>Documents</h3>
              <button type="button">Proof of delivery.pdf</button>
              <button type="button">Bill of lading.pdf</button>
            </div>
            <div className="job-status-sidebar-card job-status-sidebar-card--actions">
              <button type="button" className="home-job-detail__action home-job-detail__action--primary">
                Update status
              </button>
              <button type="button" className="home-job-detail__action">Directions</button>
              <button type="button" className="home-job-detail__action">Call</button>
            </div>
          </aside>

            <div className="job-status-screen__content">
            <div className="job-status-screen__stops">
              <h2>Stops</h2>
              <ol>
                {job.stops.map((stop, index) => (
                  <li
                    key={stop.id}
                    className={`job-status-stop job-status-stop--${stop.status}${
                      activeStopId && stop.id === activeStopId ? ' job-status-stop--active' : ''
                    }`}
                  >
                    <div className="job-status-stop__header">
                      <span>{index === 0 ? 'Pickup' : `Stop ${index + 1}`}</span>
                      <strong>{stop.name}</strong>
                      <small>{stop.arrival}</small>
                    </div>
                    <div className="job-status-stop__body">
                      <div>
                        <span>Contact</span>
                        <strong>{stop.contact}</strong>
                      </div>
                      <div>
                        <span>Cargo</span>
                        <strong>{stop.cargo}</strong>
                      </div>
                      {stop.note ? (
                        <div className="job-status-stop__note">
                          <span>Note</span>
                          <p>{stop.note}</p>
                        </div>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

