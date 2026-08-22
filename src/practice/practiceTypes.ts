import type { NoteEvent, NoteEventSource } from '../music/noteEvent'
import type { PracticeNoteNameMode } from '../music/noteDisplay'
import type { PianoNote } from '../data/piano'

export type PracticeMode = 'note' | 'chord'
export type PracticeSelection = 'free-play' | 'note-practice'
export type PracticeSessionStatus = 'idle' | 'active' | 'completed'
export type PracticeTaskStatus = 'pending' | 'active' | 'completed' | 'failed'
export type PracticeNotePool = 'all' | 'white-only' | 'black-only'
export type PracticeTargetLifecycleState =
  | 'pending'
  | 'matching'
  | 'completed'
  | 'waiting-release'

export interface PracticeSettings {
  practiceType: PracticeMode
  rangeStart: string
  rangeEnd: string
  notePool: PracticeNotePool
  noteNameMode: PracticeNoteNameMode
}

export const defaultPracticeSettings: PracticeSettings = {
  practiceType: 'note',
  rangeStart: 'C3',
  rangeEnd: 'C5',
  notePool: 'all',
  noteNameMode: 'full',
}

export function createPracticeSettings(): PracticeSettings {
  return { ...defaultPracticeSettings }
}

export interface PracticeTimelineNote {
  id: string
  index: number
  targetNotes: PianoNote[]
  measureIndex: number
  beatPosition: number
  duration?: number
}

export interface PracticePhrase {
  id: string
  timeSignature: '4/4'
  measureCount: 4
  beatsPerMeasure: 4
  notes: PracticeTimelineNote[]
}

export interface PracticeCursor {
  noteIndex: number
  beatPosition: number
}

export interface PracticeTargetOwnership {
  eventId: string
  midiNumber: number
  source?: NoteEventSource
}

export interface PracticeTarget {
  targetNotes: PianoNote[]
  matchedNotes: PianoNote[]
  ownedEvents: PracticeTargetOwnership[]
  lifecycleState: PracticeTargetLifecycleState
}

export interface PracticeTask extends PracticeTarget {
  type: PracticeMode
  timelineNoteId?: string
  status: PracticeTaskStatus
}

export interface PracticeSession {
  mode: PracticeMode
  status: PracticeSessionStatus
  phrase: PracticePhrase | null
  cursor: PracticeCursor
  currentTask: PracticeTask | null
  history: PracticeResult[]
}

export interface PracticeResult {
  correct: boolean
  expectedNotes: PianoNote[]
  receivedNotes: PianoNote[]
  expectedMidiNumbers: number[]
  receivedMidiNumbers: number[]
  eventId: string
  timelineNoteId?: string
}

export function createNotePracticeTask(
  note: PianoNote,
  timelineNoteId?: string,
): PracticeTask {
  return createPracticeTask('note', [note], timelineNoteId)
}

export function createPracticeTask(
  type: PracticeMode,
  targetNotes: PianoNote[],
  timelineNoteId?: string,
): PracticeTask {
  return {
    type,
    targetNotes,
    matchedNotes: [],
    ownedEvents: [],
    lifecycleState: 'pending',
    timelineNoteId,
    status: 'pending',
  }
}

export function createPracticeSession(
  task: PracticeTask | null = null,
  phrase: PracticePhrase | null = null,
): PracticeSession {
  return {
    mode: task?.type ?? 'note',
    status: task && phrase ? 'active' : 'idle',
    phrase,
    cursor: {
      noteIndex: 0,
      beatPosition: 0,
    },
    currentTask: task,
    history: [],
  }
}

export type PracticeEvent = NoteEvent
