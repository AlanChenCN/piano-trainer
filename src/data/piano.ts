export interface PianoNote {
  name: string
  type: "white" | "black"
  frequency: number
  position?: number
}


export const pianoNotes: PianoNote[] = [
  {
    name: "C",
    type: "white",
    frequency: 261.63
  },
  {
    name: "C#",
    type: "black",
    frequency: 277.18,
    position:0
  },
  {
    name: "D",
    type: "white",
    frequency: 293.66
  },
  {
    name: "D#",
    type: "black",
    frequency: 311.13,
    position:1
  },
  {
    name: "E",
    type: "white",
    frequency: 329.63
  },
  {
    name: "F",
    type: "white",
    frequency: 349.23
  },
  {
    name: "F#",
    type: "black",
    frequency: 369.99,
    position:3
  },
  {
    name: "G",
    type: "white",
    frequency: 392.00
  },
  {
    name: "G#",
    type: "black",
    frequency: 415.30,
    position:4
  },
  {
    name: "A",
    type: "white",
    frequency: 440.00
  },
  {
    name: "A#",
    type: "black",
    frequency: 466.16,
    position:5
  },
  {
    name: "B",
    type: "white",
    frequency: 493.88
  }
]