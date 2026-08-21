export type PitchClass =
  | "C"
  | "C#"
  | "D"
  | "D#"
  | "E"
  | "F"
  | "F#"
  | "G"
  | "G#"
  | "A"
  | "A#"
  | "B"

export type PianoLabelMode =
  | "hidden"
  | "white"
  | "letter"
  | "solfege"
  | "all"
  /** @deprecated Kept as a compatibility alias for the former C Notes mode. */
  | "c"

export interface PianoNote {
  /** Full note name, for example A0 or C#4. */
  name: string
  pitchClass: PitchClass
  octave: number
  type: "white" | "black"
  frequency: number
  /** Index of the white key to the left of this black key. */
  position?: number
}

const pitchClasses: PitchClass[] = [
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

const firstMidiNumber = 21
const lastMidiNumber = 108

function frequencyFor(midiNumber: number) {
  return 440 * Math.pow(2, (midiNumber - 69) / 12)
}

let whiteKeyIndex = 0

export const pianoNotes: PianoNote[] = []

for (
  let midiNumber = firstMidiNumber;
  midiNumber <= lastMidiNumber;
  midiNumber += 1
) {
  const pitchClass = pitchClasses[midiNumber % 12]
  const type = pitchClass.endsWith("#") ? "black" : "white"
  const note: PianoNote = {
    name: `${pitchClass}${Math.floor(midiNumber / 12) - 1}`,
    pitchClass,
    octave: Math.floor(midiNumber / 12) - 1,
    type,
    frequency: frequencyFor(midiNumber),
  }

  if (type === "black") {
    note.position = whiteKeyIndex - 1
  } else {
    whiteKeyIndex += 1
  }

  pianoNotes.push(note)
}

/** Convert a standard MIDI note number to the matching piano data object. */
export function midiNumberToPianoNote(
  midiNumber: number,
): PianoNote | undefined {
  const noteIndex = midiNumber - firstMidiNumber

  return pianoNotes[noteIndex]
}

/** Convert a piano data object or note name to its standard MIDI number. */
export function pianoNoteToMidiNumber(
  note: PianoNote | string,
): number | undefined {
  const noteName = typeof note === "string" ? note : note.name
  const noteIndex = pianoNotes.findIndex(item => item.name === noteName)

  if (noteIndex === -1) {
    return undefined
  }

  return firstMidiNumber + noteIndex
}
