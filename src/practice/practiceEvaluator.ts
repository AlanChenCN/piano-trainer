import { pianoNoteToMidiNumber } from '../data/piano'
import type { NoteEvent } from '../music/noteEvent'
import type { PracticeResult, PracticeTask } from './practiceTypes'

function sortedNumbers(numbers: number[]) {
  return [...numbers].sort((left, right) => left - right)
}

export class PracticeEvaluator {
  evaluate = (event: NoteEvent, task: PracticeTask): PracticeResult => {
    const expectedMidiNumbers = task.targetNotes
      .map(note => pianoNoteToMidiNumber(note))
      .filter((midiNumber): midiNumber is number => midiNumber !== undefined)
    const receivedMidiNumbers = [event.midiNumber]
    const sortedExpected = sortedNumbers(expectedMidiNumbers)
    const sortedReceived = sortedNumbers(receivedMidiNumbers)
    const correct =
      sortedExpected.length === sortedReceived.length &&
      sortedExpected.every(
        (midiNumber, index) => midiNumber === sortedReceived[index],
      )

    return {
      correct,
      expectedNotes: task.targetNotes,
      receivedNotes: [event.note],
      expectedMidiNumbers,
      receivedMidiNumbers,
      eventId: event.id,
    }
  }
}
