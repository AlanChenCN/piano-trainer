import type { NoteEvent } from '../music/noteEvent'
import { PracticeEvaluator } from './practiceEvaluator'
import {
  createNotePracticeTask,
  createPracticeSession,
  type PracticeResult,
  type PracticeSelection,
  type PracticeSession,
} from './practiceTypes'
import { createPracticeTimeline } from './timeline'

export interface PracticeControllerSnapshot {
  selection: PracticeSelection
  session: PracticeSession | null
  lastResult: PracticeResult | null
}

const freePlaySnapshot: PracticeControllerSnapshot = {
  selection: 'free-play',
  session: null,
  lastResult: null,
}

export class PracticeController {
  private readonly evaluator = new PracticeEvaluator()
  private readonly listeners = new Set<() => void>()
  private timelineNumber = 1
  private snapshot: PracticeControllerSnapshot = freePlaySnapshot

  getSnapshot = () => this.snapshot

  subscribe = (listener: () => void) => {
    this.listeners.add(listener)

    return () => {
      this.listeners.delete(listener)
    }
  }

  selectMode = (selection: PracticeSelection) => {
    if (selection === 'note-practice') {
      if (this.snapshot.selection === 'note-practice') {
        return
      }

      this.startNotePractice()
      return
    }

    if (this.snapshot.selection === 'free-play') {
      return
    }

    this.snapshot = freePlaySnapshot
    this.notify()
  }

  handleNoteEvent = (event: NoteEvent) => {
    const session = this.snapshot.session

    if (
      this.snapshot.selection !== 'note-practice' ||
      !session?.timeline ||
      !session.currentTask
    ) {
      return
    }

    const result = this.evaluator.evaluate(event, session.currentTask)
    const history = [...session.history, result]

    if (!result.correct) {
      this.snapshot = {
        ...this.snapshot,
        session: {
          ...session,
          history,
        },
        lastResult: result,
      }
      this.notify()
      return
    }

    const nextNoteIndex = session.cursor.noteIndex + 1

    if (nextNoteIndex >= session.timeline.notes.length) {
      const nextTimeline = this.createTimeline()
      this.snapshot = {
        selection: 'note-practice',
        session: this.sessionForTimeline(nextTimeline, history),
        lastResult: result,
      }
      this.notify()
      return
    }

    const nextTimelineNote = session.timeline.notes[nextNoteIndex]
    const nextTask = createNotePracticeTask(
      nextTimelineNote.note,
      nextTimelineNote.id,
    )

    this.snapshot = {
      selection: 'note-practice',
      session: {
        ...session,
        cursor: {
          noteIndex: nextNoteIndex,
          beatPosition: nextTimelineNote.beatPosition,
        },
        currentTask: {
          ...nextTask,
          status: 'active',
        },
        history,
      },
      lastResult: result,
    }
    this.notify()
  }

  private startNotePractice() {
    const timeline = this.createTimeline()

    this.snapshot = {
      selection: 'note-practice',
      session: this.sessionForTimeline(timeline, []),
      lastResult: null,
    }
    this.notify()
  }

  private sessionForTimeline(
    timeline: PracticeSession['timeline'],
    history: PracticeResult[],
  ): PracticeSession {
    if (!timeline) {
      throw new Error('A practice session requires a timeline')
    }

    const timelineNote = timeline.notes[0]
    const task = createNotePracticeTask(timelineNote.note, timelineNote.id)

    return {
      ...createPracticeSession(task, timeline),
      cursor: {
        noteIndex: 0,
        beatPosition: timelineNote.beatPosition,
      },
      currentTask: {
        ...task,
        status: 'active',
      },
      history,
    }
  }

  private createTimeline() {
    const timeline = createPracticeTimeline(
      `practice-timeline-${this.timelineNumber}`,
    )
    this.timelineNumber += 1
    return timeline
  }

  private notify() {
    this.listeners.forEach(listener => listener())
  }
}
