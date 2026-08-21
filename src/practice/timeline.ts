import {
  pianoNoteToMidiNumber,
  pianoNotes,
  type PianoNote,
} from '../data/piano'
import type { PracticeTimeline, PracticeTimelineNote } from './practiceTypes'

const firstPracticeMidiNumber = 48
const lastPracticeMidiNumber = 72
const notesPerTimeline = 4

function practiceNotes() {
  return pianoNotes.filter(note => {
    const midiNumber = pianoNoteToMidiNumber(note)

    return (
      midiNumber !== undefined &&
      midiNumber >= firstPracticeMidiNumber &&
      midiNumber <= lastPracticeMidiNumber
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

export function createPracticeTimeline(
  timelineId: string,
  random: () => number = Math.random,
): PracticeTimeline {
  const availableNotes = practiceNotes()
  const notes: PracticeTimelineNote[] = Array.from(
    { length: notesPerTimeline },
    (_, beatPosition) => {
      const note = randomPracticeNote(availableNotes, random)
      const midiNumber = pianoNoteToMidiNumber(note)

      if (midiNumber === undefined) {
        throw new Error(`Cannot create a practice note for ${note.name}`)
      }

      return {
        id: `${timelineId}-note-${beatPosition}`,
        note,
        midiNumber,
        beatPosition,
      }
    },
  )

  return {
    id: timelineId,
    timeSignature: '4/4',
    notes,
  }
}
