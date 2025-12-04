import { useEffect, useMemo, useState } from 'react'
import type { CurrentJob } from '../types/jobs'

type JobDetailScreenProps = {
  job: CurrentJob
  onBack: () => void
  onUpdateStatus: (stopId?: string) => void
  onDirections: (stopId?: string) => void
  onCall: (stopId?: string) => void
}

export function JobDetailScreen({ job, onBack, onUpdateStatus, onDirections, onCall }: JobDetailScreenProps) {
  const defaultStopId = useMemo(() => {
    return job.checkpoints.find((checkpoint) => checkpoint.stopId)?.stopId ?? job.stops[0]?.id ?? null
  }, [job.checkpoints, job.stops])
  const [selectedStopId, setSelectedStopId] = useState<string | null>(defaultStopId)

  useEffect(() => {
    setSelectedStopId(defaultStopId)
  }, [defaultStopId])

  return (
    <div className="job-detail-screen">
      <header className="job-detail-screen__header">
        <button type="button" onClick={onBack} className="job-detail-screen__back">
          ← Back to current jobs
        </button>
        <span>{job.id}</span>
      </header>

      <section className="job-detail-screen__card">
        <div className="job-detail-screen__summary">
          <div>
            <span className={`home-job-card__badge home-job-card__badge--${job.badgeTone}`}>{job.badge}</span>
            <h1>{job.customer}</h1>
            <p>{job.route}</p>
          </div>
          <div className="job-detail-screen__status">
            <span>{job.status}</span>
            <strong>{job.eta}</strong>
          </div>
        </div>

        <div className="job-detail-screen__progress">
          <div className="home-job-card__progress-track" aria-hidden="true">
            <div className="home-job-card__progress-bar" style={{ width: `${job.progress}%` }} />
          </div>
          <div>
            <strong>{job.progress}% complete</strong>
            <span>{job.eta}</span>
          </div>
        </div>

        <div className="job-detail-screen__grid">
          <div>
            <span>Driver</span>
            <strong>{job.driver}</strong>
          </div>
          <div>
            <span>Trailer</span>
            <strong>{job.trailer}</strong>
          </div>
          {job.cargo ? (
            <div>
              <span>Cargo</span>
              <strong>{job.cargo}</strong>
            </div>
          ) : null}
          <div>
            <span>Temperature</span>
            <strong>{job.temperature}</strong>
          </div>
        </div>

        {job.notes ? (
          <div className="job-detail-screen__notes">
            <span>Notes</span>
            <p>{job.notes}</p>
          </div>
        ) : null}

        {job.stops?.length ? (
          <div className="job-detail-screen__stops">
            <h2>Stops overview</h2>
            <ol>
              {job.stops.map((stop, index) => (
                <li key={stop.id}>
                  <header>
                    <span className={`job-stop__status job-stop__status--${stop.status}`}>{index === 0 ? 'Pickup' : 'Drop-off'}</span>
                    <strong>{stop.name}</strong>
                    <small>{stop.route}</small>
                  </header>
                  <div className="job-stop__details">
                    <div>
                      <span>Contact</span>
                      <strong>{stop.contact}</strong>
                    </div>
                    <div>
                      <span>Cargo</span>
                      <strong>{stop.cargo}</strong>
                    </div>
                    <div>
                      <span>Arrival</span>
                      <strong>{stop.arrival}</strong>
                    </div>
                  </div>
                  {stop.note ? <p>{stop.note}</p> : null}
                  <div className="job-stop__actions">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedStopId(stop.id)
                        onUpdateStatus(stop.id)
                      }}
                    >
                      Update status
                    </button>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        ) : null}

        <div className="job-detail-screen__timeline">
          <span>Route checkpoints</span>
          <ul>
            {job.checkpoints.map((checkpoint) => {
              const isSelected = checkpoint.stopId && checkpoint.stopId === selectedStopId
              return (
                <li
                  key={checkpoint.label}
                  className={`home-job-detail__checkpoint home-job-detail__checkpoint--${checkpoint.status}${
                    isSelected ? ' home-job-detail__checkpoint--active' : ''
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedStopId(checkpoint.stopId ?? null)}
                    className="home-job-detail__checkpoint-button"
                  >
                    <strong>{checkpoint.label}</strong>
                    <small>{checkpoint.time}</small>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>

        <div className="job-detail-screen__actions">
          <button
            type="button"
            className="home-job-detail__action home-job-detail__action--primary"
            onClick={() => onUpdateStatus(selectedStopId ?? undefined)}
          >
            Update status
          </button>
          <button type="button" className="home-job-detail__action" onClick={() => onDirections(selectedStopId ?? undefined)}>
            Directions
          </button>
          <button type="button" className="home-job-detail__action" onClick={() => onCall(selectedStopId ?? undefined)}>
            Call
          </button>
        </div>
      </section>
    </div>
  )
}
