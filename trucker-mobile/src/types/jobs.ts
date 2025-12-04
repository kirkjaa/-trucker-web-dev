export type CurrentJobCheckpointStatus = 'done' | 'current' | 'upcoming'

export type CurrentJobCheckpoint = {
  label: string
  time: string
  status: CurrentJobCheckpointStatus
  stopId?: string
}

export type CurrentJobStopStatus = 'pending' | 'ready' | 'completed'

export type CurrentJobStop = {
  id: string
  name: string
  contact: string
  route: string
  cargo: string
  arrival: string
  note?: string
  status: CurrentJobStopStatus
}

export type CurrentJobTone = 'teal' | 'blue' | 'violet'
export type CurrentJobBadgeTone = 'mint' | 'sky' | 'plum'

export type CurrentJob = {
  id: string
  customer: string
  route: string
  status: string
  progress: number
  eta: string
  driver: string
  trailer: string
  temperature: string
  badge: string
  tone: CurrentJobTone
  badgeTone: CurrentJobBadgeTone
  cargo?: string
  notes?: string
  checkpoints: CurrentJobCheckpoint[]
  stops: CurrentJobStop[]
}

