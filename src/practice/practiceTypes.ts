import type { NoteEvent } from '../music/noteEvent'
import type { PianoNote } from '../data/piano'

export type PracticeMode = 'note'
export type PracticeSelection = 'free-play' | 'note-practice'
export type PracticeSessionStatus = 'idle' | 'active' | 'completed'
export type PracticeTaskStatus = 'pending' | 'active' | 'completed' | 'failed'

export interface PracticeTimelineNote {
  id: string
  note: PianoNote
  midiNumber: number
  beatPosition: number
  duration?: number
}

export interface PracticeTimeline {
  id: string
  timeSignature: '4/4'
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
  timeline: PracticeTimeline | null
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
  timeline: PracticeTimeline | null = null,
): PracticeSession {
  return {
    mode: 'note',
    status: task && timeline ? 'active' : 'idle',
    timeline,
    cursor: {
      noteIndex: 0,
      beatPosition: 0,
    },
    currentTask: task,
    history: [],
  }
}

export type PracticeEvent = NoteEvent
