import type { NoteEvent } from '../music/noteEvent'
import { pianoNoteToMidiNumber } from '../data/piano'
import { PracticeEvaluator } from './practiceEvaluator'
import {
  createNotePracticeTask,
  createPracticeSession,
  createPracticeSettings,
  type PracticePhrase,
  type PracticeResult,
  type PracticeSelection,
  type PracticeSession,
  type PracticeSettings,
  type PracticeTask,
} from './practiceTypes'
import { createPracticePhrase, hasPracticeNotes } from './timeline'

export interface PracticeControllerSnapshot {
  selection: PracticeSelection
  session: PracticeSession | null
  settings: PracticeSettings
  lastResult: PracticeResult | null
}

const freePlaySnapshot: PracticeControllerSnapshot = {
  selection: 'free-play',
  session: null,
  settings: createPracticeSettings(),
  lastResult: null,
}

export class PracticeController {
  private readonly evaluator = new PracticeEvaluator()
  private readonly listeners = new Set<() => void>()
  private phraseNumber = 1
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

    this.snapshot = {
      ...this.snapshot,
      selection: 'free-play',
      session: null,
      lastResult: null,
    }
    this.notify()
  }

  updateSettings = (updates: Partial<PracticeSettings>) => {
    const settings = {
      ...this.snapshot.settings,
      ...updates,
    }

    const shouldRegeneratePhrase =
      updates.rangeStart !== undefined ||
      updates.rangeEnd !== undefined ||
      updates.notePool !== undefined

    if (shouldRegeneratePhrase && !hasPracticeNotes(settings)) {
      settings.notePool = 'all'
    }

    if (
      this.snapshot.selection === 'note-practice' &&
      shouldRegeneratePhrase
    ) {
      const phrase = this.createPhrase(settings)

      this.snapshot = {
        selection: 'note-practice',
        session: this.sessionForPhrase(phrase, []),
        settings,
        lastResult: null,
      }
      this.notify()
      return
    }

    this.snapshot = {
      ...this.snapshot,
      settings,
    }
    this.notify()
  }

  handleNoteEvent = (event: NoteEvent) => {
    const session = this.snapshot.session

    if (
      this.snapshot.selection !== 'note-practice' ||
      !session?.phrase ||
      !session.currentTask
    ) {
      return
    }

    const task = session.currentTask
    const isRequiredNote = this.evaluator.isRequiredNote(event, task)

    // Once a target is complete, only additional ownership of the current
    // target is accepted. Early input for the next target is ignored.
    if (task.lifecycleState === 'waiting-release') {
      if (
        !isRequiredNote ||
        task.ownedEvents.some(ownedEvent => ownedEvent.eventId === event.id)
      ) {
        return
      }

      this.updateCurrentTask(session, this.withOwnership(task, event))
      return
    }

    const result = this.evaluator.evaluate(event, task)
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

    const matchedTask = this.withOwnership(task, event)
    const targetCompleted = this.evaluator.isTargetComplete(matchedTask)
    const lifecycleState = targetCompleted
      ? 'waiting-release'
      : 'matching'

    this.snapshot = {
      ...this.snapshot,
      session: {
        ...session,
        currentTask: {
          ...matchedTask,
          lifecycleState,
          // Completion is recorded before release, but Cursor still stays
          // on this target until handleNoteRelease advances it.
          status: targetCompleted ? 'completed' : 'active',
        },
        history,
      },
      lastResult: result,
    }
    this.notify()
  }

  handleNoteRelease = (event: NoteEvent) => {
    const session = this.snapshot.session

    if (
      this.snapshot.selection !== 'note-practice' ||
      !session?.phrase ||
      !session.currentTask
    ) {
      return
    }

    const task = session.currentTask
    const remainingOwnedEvents = task.ownedEvents.filter(
      ownedEvent => ownedEvent.eventId !== event.id,
    )

    if (remainingOwnedEvents.length === task.ownedEvents.length) {
      return
    }

    const taskAfterRelease: PracticeTask = {
      ...task,
      ownedEvents: remainingOwnedEvents,
      matchedNotes:
        task.lifecycleState === 'waiting-release'
          ? task.matchedNotes
          : this.matchedNotesFor(task.targetNotes, remainingOwnedEvents),
    }

    if (
      task.lifecycleState === 'waiting-release' &&
      this.evaluator.isTargetReleased(taskAfterRelease)
    ) {
      this.advanceCursor(session)
      return
    }

    const lifecycleState = task.lifecycleState === 'waiting-release'
      ? 'waiting-release'
      : remainingOwnedEvents.length > 0
        ? 'matching'
        : 'pending'

    this.updateCurrentTask(session, {
      ...taskAfterRelease,
      lifecycleState,
    })
  }

  private startNotePractice() {
    const phrase = this.createPhrase(this.snapshot.settings)

    this.snapshot = {
      selection: 'note-practice',
      session: this.sessionForPhrase(phrase, []),
      settings: this.snapshot.settings,
      lastResult: null,
    }
    this.notify()
  }

  private sessionForPhrase(
    phrase: PracticePhrase,
    history: PracticeResult[],
  ): PracticeSession {
    const phraseNote = phrase.notes[0]
    const task = createNotePracticeTask(phraseNote.note, phraseNote.id)

    return {
      ...createPracticeSession(task, phrase),
      cursor: {
        noteIndex: phraseNote.index,
        beatPosition: phraseNote.beatPosition,
      },
      currentTask: {
        ...task,
        status: 'active',
      },
      history,
    }
  }

  private withOwnership(task: PracticeTask, event: NoteEvent): PracticeTask {
    if (task.ownedEvents.some(ownedEvent => ownedEvent.eventId === event.id)) {
      return task
    }

    const ownedEvents = [
      ...task.ownedEvents,
      {
        eventId: event.id,
        midiNumber: event.midiNumber,
        source: event.source,
      },
    ]

    return {
      ...task,
      ownedEvents,
      matchedNotes: this.matchedNotesFor(task.targetNotes, ownedEvents),
    }
  }

  private matchedNotesFor(
    targetNotes: PracticeTask['targetNotes'],
    ownedEvents: PracticeTask['ownedEvents'],
  ) {
    const ownedMidiNumbers = new Set(
      ownedEvents.map(ownedEvent => ownedEvent.midiNumber),
    )

    return targetNotes.filter(note => {
      const midiNumber = pianoNoteToMidiNumber(note)
      return midiNumber !== undefined && ownedMidiNumbers.has(midiNumber)
    })
  }

  private updateCurrentTask(
    session: PracticeSession,
    currentTask: PracticeTask,
  ) {
    this.snapshot = {
      ...this.snapshot,
      session: {
        ...session,
        currentTask,
      },
    }
    this.notify()
  }

  private advanceCursor(session: PracticeSession) {
    const phrase = session.phrase

    if (!phrase) {
      return
    }

    const nextNoteIndex = session.cursor.noteIndex + 1

    if (nextNoteIndex >= phrase.notes.length) {
      const nextPhrase = this.createPhrase(this.snapshot.settings)

      this.snapshot = {
        ...this.snapshot,
        session: this.sessionForPhrase(nextPhrase, session.history),
        lastResult: null,
      }
      this.notify()
      return
    }

    const nextPhraseNote = phrase.notes[nextNoteIndex]
    const nextTask = createNotePracticeTask(
      nextPhraseNote.note,
      nextPhraseNote.id,
    )

    this.snapshot = {
      ...this.snapshot,
      session: {
        ...session,
        cursor: {
          noteIndex: nextNoteIndex,
          beatPosition: nextPhraseNote.beatPosition,
        },
        currentTask: {
          ...nextTask,
          status: 'active',
        },
      },
    }
    this.notify()
  }

  private createPhrase(settings: PracticeSettings) {
    const phrase = createPracticePhrase(
      `practice-phrase-${this.phraseNumber}`,
      settings,
    )
    this.phraseNumber += 1
    return phrase
  }

  private notify() {
    this.listeners.forEach(listener => listener())
  }
}
