import { pianoNoteToMidiNumber } from '../data/piano'
import type { NoteEvent } from '../music/noteEvent'
import type { PracticeResult, PracticeTask } from './practiceTypes'

export class PracticeEvaluator {
  isRequiredNote = (event: NoteEvent, task: PracticeTask) =>
    task.targetNotes.some(note => pianoNoteToMidiNumber(note) === event.midiNumber)

  isTargetComplete = (task: PracticeTask) => {
    const matchedMidiNumbers = new Set(
      task.matchedNotes
        .map(note => pianoNoteToMidiNumber(note))
        .filter((midiNumber): midiNumber is number => midiNumber !== undefined),
    )

    return task.targetNotes.every(note => {
      const midiNumber = pianoNoteToMidiNumber(note)
      return midiNumber !== undefined && matchedMidiNumbers.has(midiNumber)
    })
  }

  isTargetReleased = (task: PracticeTask) => {
    const ownedMidiNumbers = new Set(
      task.ownedEvents.map(ownedEvent => ownedEvent.midiNumber),
    )

    return task.targetNotes.every(note => {
      const midiNumber = pianoNoteToMidiNumber(note)
      return midiNumber !== undefined && !ownedMidiNumbers.has(midiNumber)
    })
  }

  evaluate = (event: NoteEvent, task: PracticeTask): PracticeResult => {
    const expectedMidiNumbers = task.targetNotes
      .map(note => pianoNoteToMidiNumber(note))
      .filter((midiNumber): midiNumber is number => midiNumber !== undefined)
    const receivedMidiNumbers = [event.midiNumber]
    const correct = this.isRequiredNote(event, task)

    return {
      correct,
      expectedNotes: task.targetNotes,
      receivedNotes: [event.note],
      expectedMidiNumbers,
      receivedMidiNumbers,
      eventId: event.id,
      timelineNoteId: task.timelineNoteId,
    }
  }
}
