import { pianoNotes, type PianoNote } from '../data/piano'
import { staffPositionMap, type StaffNotePosition } from '../data/staff'

interface GrandStaffProps {
  pressedNotes: string[]
}

interface PositionedNote {
  note: PianoNote
  position: StaffNotePosition
}

interface StaffNoteGroup {
  noteHeadStep: number
  notes: PianoNote[]
}

const staffLineSteps = [0, 2, 4, 6, 8]
const staffLeft = 100
const staffRight = 740
const staffBottomY = 128
const stepHeight = 12
const noteCenterX = 420


function noteY(step: number) {
  return staffBottomY - step * stepHeight
}


function GrandStaff({ pressedNotes }: GrandStaffProps) {
  const positionedNotes: PositionedNote[] = pianoNotes
    .filter(note => pressedNotes.includes(note.name))
    .map(note => ({
      note,
      position: staffPositionMap[note.name],
    }))

  const noteGroups = positionedNotes.reduce<StaffNoteGroup[]>(
    (groups, positionedNote) => {
      const noteHeadStep = positionedNote.position.noteHeadStep
      const existingGroup = groups.find(
        group => group.noteHeadStep === noteHeadStep
      )

      if (existingGroup) {
        existingGroup.notes.push(positionedNote.note)
      } else {
        groups.push({
          noteHeadStep,
          notes: [positionedNote.note],
        })
      }

      return groups
    },
    []
  )

  const ledgerLineSteps = noteGroups
    .map(group => group.noteHeadStep)
    .filter(step => (step < 0 || step > 8) && step % 2 === 0)

  return (
    <section className="grand-staff" aria-label="Grand Staff">
      <svg
        className="grand-staff-svg"
        viewBox="0 0 840 180"
        role="img"
        aria-label="Treble staff with currently pressed notes"
      >
        {staffLineSteps.map(step => (
          <line
            key={`staff-line-${step}`}
            className="staff-line"
            x1={staffLeft}
            x2={staffRight}
            y1={noteY(step)}
            y2={noteY(step)}
          />
        ))}

        {ledgerLineSteps.map(step => (
          <line
            key={`ledger-line-${step}`}
            className="staff-line"
            x1={noteCenterX - 18}
            x2={noteCenterX + 18}
            y1={noteY(step)}
            y2={noteY(step)}
          />
        ))}

        {noteGroups.map(group => {
          const hasSharp = group.notes.some(note =>
            note.pitchClass.endsWith("#")
          )

          return (
            <g key={`note-group-${group.noteHeadStep}`}>
              {hasSharp && (
                <text
                  className="staff-accidental"
                  x={noteCenterX - 24}
                  y={noteY(group.noteHeadStep) + 7}
                >
                  ♯
                </text>
              )}

              <circle
                className="staff-note"
                cx={noteCenterX}
                cy={noteY(group.noteHeadStep)}
                r="8"
              />
            </g>
          )
        })}
      </svg>
    </section>
  )
}

export default GrandStaff
