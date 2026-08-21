import type { NoteEvent } from '../music/noteEvent'
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
} from './practiceTypes'
import { createPracticePhrase } from './timeline'

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
      updates.range !== undefined || updates.notePool !== undefined

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

    if (nextNoteIndex >= session.phrase.notes.length) {
      const nextPhrase = this.createPhrase(this.snapshot.settings)

      this.snapshot = {
        selection: 'note-practice',
        session: this.sessionForPhrase(nextPhrase, history),
        settings: this.snapshot.settings,
        lastResult: null,
      }
      this.notify()
      return
    }

    const nextPhraseNote = session.phrase.notes[nextNoteIndex]
    const nextTask = createNotePracticeTask(
      nextPhraseNote.note,
      nextPhraseNote.id,
    )

    this.snapshot = {
      selection: 'note-practice',
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
        history,
      },
      settings: this.snapshot.settings,
      lastResult: result,
    }
    this.notify()
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
