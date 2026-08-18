import { pianoNotes } from '../data/piano'
import {
  blackKeyboardKeys,
  whiteKeyboardKeys,
} from '../data/keyboard'

export type KeyboardBaseNote = string

const whitePianoNotes = pianoNotes.filter(note => note.type === "white")
const lastBaseNoteIndex = whitePianoNotes.length - whiteKeyboardKeys.length

export const keyboardBaseNotes = whitePianoNotes
  .slice(0, lastBaseNoteIndex + 1)
  .map(note => note.name)

export const defaultKeyboardBaseNote: KeyboardBaseNote = "E3"

function baseNoteIndex(baseNote: KeyboardBaseNote) {
  return keyboardBaseNotes.indexOf(baseNote)
}

/**
 * Creates a mapping from the fixed computer-key layout to a piano position.
 * White keys are mapped first; black-key candidates are then placed between
 * their neighboring white keys when that piano position exists.
 */
export function createKeyboardMap(
  baseNote: KeyboardBaseNote,
): Record<string, string> {
  const baseIndex = baseNoteIndex(baseNote)

  if (baseIndex === -1) {
    return {}
  }

  const mapping: Record<string, string> = {}

  whiteKeyboardKeys.forEach((key, index) => {
    mapping[key] = whitePianoNotes[baseIndex + index].name
  })

  blackKeyboardKeys.forEach((key, index) => {
    const leftWhiteIndex = baseIndex + index
    const blackNote = pianoNotes.find(
      note => note.type === "black" && note.position === leftWhiteIndex,
    )

    if (blackNote) {
      mapping[key] = blackNote.name
    }
  })

  return mapping
}

export function shiftKeyboardBaseNote(
  baseNote: KeyboardBaseNote,
  semitones: -12 | 12,
): KeyboardBaseNote {
  const currentIndex = baseNoteIndex(baseNote)

  if (currentIndex === -1) {
    return defaultKeyboardBaseNote
  }

  const currentPianoIndex = pianoNotes.findIndex(
    note => note.name === whitePianoNotes[currentIndex].name,
  )
  const shiftedNote = pianoNotes[currentPianoIndex + semitones]

  if (
    shiftedNote &&
    shiftedNote.type === "white" &&
    keyboardBaseNotes.includes(shiftedNote.name)
  ) {
    return shiftedNote.name
  }

  return baseNote
}

export function keyboardRangeLabel(baseNote: KeyboardBaseNote) {
  const mapping = createKeyboardMap(baseNote)
  const firstWhiteKey = whiteKeyboardKeys[0]
  const lastWhiteKey = whiteKeyboardKeys[whiteKeyboardKeys.length - 1]

  return `${mapping[firstWhiteKey]}-${mapping[lastWhiteKey]}`
}
