import type { PitchClass } from '../data/piano'

export type ChordQuality = 'major' | 'minor'

export interface Chord {
  root: PitchClass
  quality: ChordQuality
  intervals: number[]
}

/** Format the supported chord types for display without storing presentation data in Chord. */
export function formatChordName(chord: Chord): string {
  return chord.quality === 'minor' ? `${chord.root}m` : chord.root
}
