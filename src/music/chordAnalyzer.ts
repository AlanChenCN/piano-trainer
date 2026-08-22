import {
  pianoNoteToMidiNumber,
  type PianoNote,
  type PitchClass,
} from '../data/piano'
import type { Chord, ChordQuality } from './chord'

const pitchClassesByMidiNumber: PitchClass[] = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
]

const chordPatterns: { quality: ChordQuality; intervals: number[] }[] = [
  { quality: 'major', intervals: [0, 4, 7] },
  { quality: 'minor', intervals: [0, 3, 7] },
]

function intervalsFromRoot(pitchClasses: number[], root: number) {
  return pitchClasses
    .map(pitchClass => (pitchClass - root + 12) % 12)
    .sort((left, right) => left - right)
}

function sameIntervals(left: number[], right: number[]) {
  return (
    left.length === right.length &&
    left.every((interval, index) => interval === right[index])
  )
}

/** Analyze exactly three unique pitch classes as a supported triad. */
export function analyzeChord(notes: PianoNote[]): Chord | null {
  const midiNumbers = notes
    .map(note => pianoNoteToMidiNumber(note))
    .filter((midiNumber): midiNumber is number => midiNumber !== undefined)
  const pitchClasses = Array.from(
    new Set(midiNumbers.map(midiNumber => midiNumber % 12)),
  ).sort((left, right) => left - right)

  if (pitchClasses.length !== 3) {
    return null
  }

  for (const root of pitchClasses) {
    const intervals = intervalsFromRoot(pitchClasses, root)
    const pattern = chordPatterns.find(chordPattern =>
      sameIntervals(intervals, chordPattern.intervals),
    )

    if (pattern) {
      return {
        root: pitchClassesByMidiNumber[root],
        quality: pattern.quality,
        intervals: pattern.intervals,
      }
    }
  }

  return null
}
