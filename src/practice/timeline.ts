import { pianoNotes } from '../data/piano'
import type {
  PracticePhrase,
  PracticeSettings,
  PracticeTimelineNote,
} from './practiceTypes'
import {
  hasPracticeTargets,
  randomPracticeTarget,
} from './practiceGenerator'

export const practiceLowerBoundOptions = pianoNotes
  .filter(note => note.type === 'white' && (note.octave < 4 || note.name === 'C4'))
  .map(note => ({
    value: note.name,
    label: note.name,
  }))

export const practiceUpperBoundOptions = pianoNotes
  .filter(note => note.type === 'white' && note.octave >= 4)
  .map(note => ({
    value: note.name,
    label: note.name,
  }))

const measureCount = 4
const beatsPerMeasure = 4
const noteCount = measureCount * beatsPerMeasure

export { hasPracticeTargets }

export function createPracticePhrase(
  phraseId: string,
  settings: PracticeSettings,
  random: () => number = Math.random,
): PracticePhrase {
  const notes: PracticeTimelineNote[] = Array.from(
    { length: noteCount },
    (_, index) => {
      return {
        id: `${phraseId}-target-${index}`,
        index,
        targetNotes: randomPracticeTarget(settings, random),
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
