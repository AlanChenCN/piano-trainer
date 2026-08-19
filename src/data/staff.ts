import {
  pianoNoteToMidiNumber,
  type PianoNote,
  type PitchClass,
} from './piano'

export type StaffName = 'treble' | 'bass'

export interface StaffNotePosition {
  staff: StaffName
  staffStep: number
}

type NaturalPitchClass = Exclude<PitchClass, `${string}#`>

const naturalPitchSteps: Record<NaturalPitchClass, number> = {
  C: 0,
  D: 1,
  E: 2,
  F: 3,
  G: 4,
  A: 5,
  B: 6,
}

/**
 * Absolute diatonic pitch step, with C0 as step 0.
 * Sharps share the natural note's diatonic step.
 */
export function diatonicStepFor(note: PianoNote) {
  const naturalPitchClass = note.pitchClass.replace('#', '') as NaturalPitchClass

  return note.octave * 7 + naturalPitchSteps[naturalPitchClass]
}

const staffBottomLineSteps: Record<StaffName, number> = {
  // E4 is the bottom line of the treble staff.
  treble: 30,
  // G2 is the bottom line of the bass staff.
  bass: 18,
}

const middleCMidiNumber = pianoNoteToMidiNumber('C4') ?? 60

export function getStaffAssignment(note: PianoNote): StaffName {
  const midiNumber = pianoNoteToMidiNumber(note)

  return midiNumber !== undefined && midiNumber >= middleCMidiNumber
    ? 'treble'
    : 'bass'
}

export function getStaffStep(
  note: PianoNote,
  staff: StaffName = getStaffAssignment(note),
) {
  return diatonicStepFor(note) - staffBottomLineSteps[staff]
}

export function getStaffNotePosition(note: PianoNote): StaffNotePosition {
  const staff = getStaffAssignment(note)

  return {
    staff,
    staffStep: getStaffStep(note, staff),
  }
}

export function isSharp(note: PianoNote) {
  return note.pitchClass.endsWith('#')
}

/**
 * Return every ledger-line step required to reach the note.
 * Staff lines are even steps: 0, 2, 4, 6, and 8.
 */
export function getLedgerLineSteps(staffStep: number): number[] {
  if (staffStep < 0) {
    const steps: number[] = []

    for (let step = -2; step >= staffStep; step -= 2) {
      steps.push(step)
    }

    return steps
  }

  if (staffStep > 8) {
    const steps: number[] = []

    for (let step = 10; step <= staffStep; step += 2) {
      steps.push(step)
    }

    return steps
  }

  return []
}
