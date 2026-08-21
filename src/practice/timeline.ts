import {
  pianoNoteToMidiNumber,
  pianoNotes,
  type PianoNote,
} from '../data/piano'
import type {
  PracticeNotePool,
  PracticePhrase,
  PracticeRangePreset,
  PracticeSettings,
  PracticeTimelineNote,
} from './practiceTypes'

export const practiceRangeOptions: Array<{
  value: PracticeRangePreset
  label: string
  startMidiNumber: number
  endMidiNumber: number
}> = [
  {
    value: 'c3-c5',
    label: 'C3-C5',
    startMidiNumber: 48,
    endMidiNumber: 72,
  },
  {
    value: 'c4-c6',
    label: 'C4-C6',
    startMidiNumber: 60,
    endMidiNumber: 84,
  },
]

const measureCount = 4
const beatsPerMeasure = 4
const noteCount = measureCount * beatsPerMeasure

function rangeForPreset(range: PracticeRangePreset) {
  return practiceRangeOptions.find(option => option.value === range)
    ?? practiceRangeOptions[0]
}

function noteMatchesPool(note: PianoNote, pool: PracticeNotePool) {
  if (pool === 'all') {
    return true
  }

  return pool === 'white-only'
    ? note.type === 'white'
    : note.type === 'black'
}

function practiceNotes(settings: PracticeSettings) {
  const range = rangeForPreset(settings.range)

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

function randomPracticeNote(notes: PianoNote[], random: () => number) {
  const randomIndex = Math.min(
    notes.length - 1,
    Math.floor(random() * notes.length),
  )

  return notes[randomIndex]
}

export function createPracticePhrase(
  phraseId: string,
  settings: PracticeSettings,
  random: () => number = Math.random,
): PracticePhrase {
  const availableNotes = practiceNotes(settings)

  if (availableNotes.length === 0) {
    throw new Error('Practice settings produced an empty note pool')
  }

  const notes: PracticeTimelineNote[] = Array.from(
    { length: noteCount },
    (_, index) => {
      const note = randomPracticeNote(availableNotes, random)
      const midiNumber = pianoNoteToMidiNumber(note)

      if (midiNumber === undefined) {
        throw new Error(`Cannot create a practice note for ${note.name}`)
      }

      return {
        id: `${phraseId}-note-${index}`,
        index,
        note,
        midiNumber,
        measureIndex: Math.floor(index / beatsPerMeasure),
        beatPosition: index % beatsPerMeasure,
      }
    },
  )

  return {
    id: phraseId,
    timeSignature: '4/4',
    measureCount,
    beatsPerMeasure,
    notes,
  }
}
