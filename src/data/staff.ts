import { pianoNotes, type PitchClass } from './piano'

export interface StaffNotePosition {
  /** Diatonic step relative to the bottom line of the treble staff. */
  noteHeadStep: number
}


type NaturalPitchClass = Exclude<PitchClass, `${string}#`>


const naturalNoteSteps: Record<NaturalPitchClass, number> = {
  C: -2,
  D: -1,
  E: 0,
  F: 1,
  G: 2,
  A: 3,
  B: 4,
}


/**
 * Position Map for the current piano range.
 *
 * This map intentionally contains only note-head positions. Accidental
 * rendering is handled separately by GrandStaff.
 */
export const staffPositionMap: Record<string, StaffNotePosition> =
  Object.fromEntries(
    pianoNotes.map(note => [
      note.name,
      {
        noteHeadStep:
          naturalNoteSteps[
            note.pitchClass.replace("#", "") as NaturalPitchClass
          ]
          + (note.octave - 4) * 7,
      },
    ])
  )
