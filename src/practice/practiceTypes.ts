import type { NoteEvent } from '../music/noteEvent'
import type { PianoNote } from '../data/piano'

export type PracticeMode = 'note'
export type PracticeSessionStatus = 'idle' | 'active' | 'completed'
export type PracticeTaskStatus = 'pending' | 'active' | 'completed' | 'failed'

export interface PracticeTask {
  type: PracticeMode
  targetNotes: PianoNote[]
  status: PracticeTaskStatus
}

export interface PracticeSession {
  mode: PracticeMode
  status: PracticeSessionStatus
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
}

export function createNotePracticeTask(note: PianoNote): PracticeTask {
  return {
    type: 'note',
    targetNotes: [note],
    status: 'pending',
  }
}

export function createPracticeSession(
  task: PracticeTask | null = null,
): PracticeSession {
  return {
    mode: 'note',
    status: task ? 'active' : 'idle',
    currentTask: task,
    history: [],
  }
}

export type PracticeEvent = NoteEvent
