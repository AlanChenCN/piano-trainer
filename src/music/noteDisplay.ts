import type { PianoNote, PianoLabelMode } from '../data/piano'

export type NoteDisplayMode = 'hidden' | 'letter' | 'solfege'

const solfegeByPitchClass: Record<string, string> = {
  C: 'Do',
  'C#': 'Do#',
  D: 'Re',
  'D#': 'Re#',
  E: 'Mi',
  F: 'Fa',
  'F#': 'Fa#',
  G: 'Sol',
  'G#': 'Sol#',
  A: 'La',
  'A#': 'La#',
  B: 'Ti',
}

export function letterNameFor(note: PianoNote) {
  return note.pitchClass
}

export function solfegeNameFor(note: PianoNote) {
  return solfegeByPitchClass[note.pitchClass]
}

export function noteDisplayLabel(
  note: PianoNote,
  mode: NoteDisplayMode,
) {
  if (mode === 'hidden') {
    return ''
  }

  const name = mode === 'letter' ? letterNameFor(note) : solfegeNameFor(note)
  return `${name}${note.octave}`
}

export function pianoLabelFor(note: PianoNote, mode: PianoLabelMode) {
  switch (mode) {
    case 'hidden':
      return ''
    case 'white':
      return note.type === 'white' ? note.name : ''
    case 'letter':
    case 'c':
      return note.type === 'white' ? letterNameFor(note) : ''
    case 'solfege':
      return note.type === 'white' ? solfegeNameFor(note) : ''
    default:
      return note.name
  }
}
