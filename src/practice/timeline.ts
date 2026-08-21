import {
  pianoNoteToMidiNumber,
  pianoNotes,
  type PianoNote,
} from '../data/piano'
import type {
  PracticeNotePool,
  PracticePhrase,
  PracticeSettings,
  PracticeTimelineNote,
} from './practiceTypes'

export const practiceLowerBoundOptions = pianoNotes
  .filter(note => note.type === 'white' && (note.octave < 4 || note.name === 'C4'))
  .map(note => ({
    value: note.name,
    label: note.name,
  }))

export const practiceUpperBoundOptions = pianoNotes
  .filter(note => note.type === 'white' && (note.octave > 4 || note.name === 'C4'))
  .map(note => ({
    value: note.name,
    label: note.name,
  }))

interface PracticeRange {
  label: string
  startMidiNumber: number
  endMidiNumber: number
}

function rangeForSettings(settings: PracticeSettings): PracticeRange {
  const startMidiNumber = pianoNoteToMidiNumber(settings.rangeStart)
  const endMidiNumber = pianoNoteToMidiNumber(settings.rangeEnd)

  if (startMidiNumber === undefined || endMidiNumber === undefined) {
    throw new Error('Practice settings contain an invalid note range')
  }

  return {
    label: `${settings.rangeStart}-${settings.rangeEnd}`,
    startMidiNumber,
    endMidiNumber,
  }
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

export function hasPracticeNotes(settings: PracticeSettings) {
  return practiceNotes(settings).length > 0
}

const measureCount = 4
const beatsPerMeasure = 4
const noteCount = measureCount * beatsPerMeasure

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
