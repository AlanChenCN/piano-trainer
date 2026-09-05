import type { StaffName } from './staff'

export const staffLineSteps = [0, 2, 4, 6, 8] as const

/**
 * Both score surfaces use the same vertical relationship: the bass bottom line
 * sits twelve diatonic half-steps below the treble bottom line. This places C4
 * exactly between the two inner staff lines.
 */
export function createGrandStaffGeometry(
  trebleBottomY: number,
  stepHeight: number,
) {
  const staffBottomY: Record<StaffName, number> = {
    treble: trebleBottomY,
    bass: trebleBottomY + stepHeight * 12,
  }

  return {
    staffBottomY,
    stepHeight,
    noteY: (staff: StaffName, step: number) =>
      staffBottomY[staff] - step * stepHeight,
  }
}
