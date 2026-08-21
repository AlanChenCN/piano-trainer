import type { NoteEvent } from '../music/noteEvent'
import type { PracticeNoteNameMode } from '../music/noteDisplay'
import type { PianoNote } from '../data/piano'

export type PracticeMode = 'note'
export type PracticeSelection = 'free-play' | 'note-practice'
export type PracticeSessionStatus = 'idle' | 'active' | 'completed'
export type PracticeTaskStatus = 'pending' | 'active' | 'completed' | 'failed'
export type PracticeRangePreset = 'c3-c5' | 'c4-c6'
export type PracticeNotePool = 'all' | 'white-only' | 'black-only'

export interface PracticeSettings {
  range: PracticeRangePreset
  notePool: PracticeNotePool
  noteNameMode: PracticeNoteNameMode
}

export const defaultPracticeSettings: PracticeSettings = {
  range: 'c3-c5',
  notePool: 'all',
  noteNameMode: 'full',
}

export function createPracticeSettings(): PracticeSettings {
  return { ...defaultPracticeSettings }
}

export interface PracticeTimelineNote {
  id: string
  index: number
  note: PianoNote
  midiNumber: number
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

export interface PracticeTask {
  type: PracticeMode
  targetNotes: PianoNote[]
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
  return {
    type: 'note',
    targetNotes: [note],
    timelineNoteId,
    status: 'pending',
  }
}

export function createPracticeSession(
  task: PracticeTask | null = null,
  phrase: PracticePhrase | null = null,
): PracticeSession {
  return {
    mode: 'note',
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
