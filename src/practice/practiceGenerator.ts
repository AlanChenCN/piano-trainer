import {
  midiNumberToPianoNote,
  pianoNoteToMidiNumber,
  pianoNotes,
  type PianoNote,
} from '../data/piano'
import { analyzeChord } from '../music/chordAnalyzer'
import type {
  PracticeNotePool,
  PracticeSettings,
} from './practiceTypes'

const chordPatterns = [
  [0, 4, 7],
  [0, 3, 7],
]

interface PracticeRange {
  startMidiNumber: number
  endMidiNumber: number
}

function rangeForSettings(settings: PracticeSettings): PracticeRange {
  const startMidiNumber = pianoNoteToMidiNumber(settings.rangeStart)
  const endMidiNumber = pianoNoteToMidiNumber(settings.rangeEnd)

  if (
    startMidiNumber === undefined ||
    endMidiNumber === undefined ||
    startMidiNumber > endMidiNumber
  ) {
    throw new Error('Practice settings contain an invalid note range')
  }

  return { startMidiNumber, endMidiNumber }
}

function noteMatchesPool(note: PianoNote, pool: PracticeNotePool) {
  if (pool === 'all') {
    return true
  }

  return pool === 'white-only'
    ? note.type === 'white'
    : note.type === 'black'
}

/** Return the single-note candidates used by Note Practice only. */
export function practiceNotesForSettings(settings: PracticeSettings) {
  const range = rangeForSettings(settings)

  return pianoNotes.filter(note => {
    const midiNumber = pianoNoteToMidiNumber(note)

    return (
      midiNumber !== undefined &&
      midiNumber >= range.startMidiNumber &&
      midiNumber <= range.endMidiNumber &&
      noteMatchesPool(note, settings.notePool)
    )
  })
}

function chordTargetCandidates(settings: PracticeSettings) {
  const range = rangeForSettings(settings)

  return pianoNotes
    .filter(note => note.type === 'white')
    .flatMap(root => {
      const rootMidiNumber = pianoNoteToMidiNumber(root)

      if (rootMidiNumber === undefined) {
        return []
      }

      return chordPatterns.flatMap(intervals => {
        const targetNotes = intervals
          .map(interval => midiNumberToPianoNote(rootMidiNumber + interval))
          .filter((note): note is PianoNote => note !== undefined)

        if (
          targetNotes.length !== intervals.length ||
          targetNotes.some(note => note.type !== 'white')
        ) {
          return []
        }

        const targetMidiNumbers = targetNotes
          .map(note => pianoNoteToMidiNumber(note))
          .filter((midiNumber): midiNumber is number => midiNumber !== undefined)

        if (
          targetMidiNumbers.length !== targetNotes.length ||
          targetMidiNumbers.some(
            midiNumber =>
              midiNumber < range.startMidiNumber ||
              midiNumber > range.endMidiNumber,
          )
        ) {
          return []
        }

        return analyzeChord(targetNotes) ? [targetNotes] : []
      })
    })
}

export function hasPracticeNotes(settings: PracticeSettings) {
  return practiceNotesForSettings(settings).length > 0
}

export function hasPracticeTargets(settings: PracticeSettings) {
  return settings.practiceType === 'chord'
    ? chordTargetCandidates(settings).length > 0
    : hasPracticeNotes(settings)
}

export function randomPracticeTarget(
  settings: PracticeSettings,
  random: () => number,
) {
  const candidates =
    settings.practiceType === 'chord'
      ? chordTargetCandidates(settings)
      : practiceNotesForSettings(settings).map(note => [note])

  if (candidates.length === 0) {
    throw new Error('Practice settings produced no valid practice targets')
  }

  const randomIndex = Math.min(
    candidates.length - 1,
    Math.floor(random() * candidates.length),
  )

  return candidates[randomIndex]
}
