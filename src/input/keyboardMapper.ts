import type { PitchClass } from '../data/piano'
import { keyboardKeys } from '../data/keyboard'

export const keyboardRanges = [
  { value: "C3-E4", label: "C3-E4", baseOctave: 3 },
  { value: "C4-E5", label: "C4-E5", baseOctave: 4 },
  { value: "C5-E6", label: "C5-E6", baseOctave: 5 },
] as const

export type KeyboardRange = (typeof keyboardRanges)[number]["value"]

export const defaultKeyboardRange: KeyboardRange = "C4-E5"

const chromaticPitchClasses: PitchClass[] = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
]

export function mapKeyToNote(
  key: string,
  range: KeyboardRange,
): string | undefined {
  const keyIndex = keyboardKeys.indexOf(key.toLowerCase() as typeof keyboardKeys[number])

  if (keyIndex === -1) {
    return undefined
  }

  const rangeConfig = keyboardRanges.find(item => item.value === range)

  if (!rangeConfig) {
    return undefined
  }

  const pitchClass = chromaticPitchClasses[keyIndex % 12]
  const octave = rangeConfig.baseOctave + Math.floor(keyIndex / 12)

  return `${pitchClass}${octave}`
}

export function keyboardRangeIndex(range: KeyboardRange) {
  return keyboardRanges.findIndex(item => item.value === range)
}
