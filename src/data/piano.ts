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


export interface PianoNote {
  /** Full note name, for example C4 or F#5. */
  name: string
  pitchClass: PitchClass
  octave: number
  type: "white" | "black"
  frequency: number
  /** Index of the white key to the left of this black key. */
  position?: number
}


interface NoteLayout {
  pitchClass: PitchClass
  type: PianoNote["type"]
  position?: number
}


const octaveLayout: NoteLayout[] = [
  { pitchClass: "C", type: "white" },
  { pitchClass: "C#", type: "black", position: 0 },
  { pitchClass: "D", type: "white" },
  { pitchClass: "D#", type: "black", position: 1 },
  { pitchClass: "E", type: "white" },
  { pitchClass: "F", type: "white" },
  { pitchClass: "F#", type: "black", position: 3 },
  { pitchClass: "G", type: "white" },
  { pitchClass: "G#", type: "black", position: 4 },
  { pitchClass: "A", type: "white" },
  { pitchClass: "A#", type: "black", position: 5 },
  { pitchClass: "B", type: "white" },
]


const pitchClassSemitones: Record<PitchClass, number> = {
  C: 0,
  "C#": 1,
  D: 2,
  "D#": 3,
  E: 4,
  F: 5,
  "F#": 6,
  G: 7,
  "G#": 8,
  A: 9,
  "A#": 10,
  B: 11,
}


function frequencyFor(pitchClass: PitchClass, octave: number) {
  const midiNumber = (octave + 1) * 12 + pitchClassSemitones[pitchClass]

  return 440 * Math.pow(2, (midiNumber - 69) / 12)
}


const octaves = [4, 5]


export const pianoNotes: PianoNote[] = octaves.flatMap((octave, octaveIndex) =>
  octaveLayout.map(note => ({
    name: `${note.pitchClass}${octave}`,
    pitchClass: note.pitchClass,
    octave,
    type: note.type,
    frequency: frequencyFor(note.pitchClass, octave),
    ...(note.position !== undefined
      ? { position: note.position + octaveIndex * 7 }
      : {}),
  }))
)
