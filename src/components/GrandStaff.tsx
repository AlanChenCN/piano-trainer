import {
  pianoNoteToMidiNumber,
  pianoNotes,
  type PianoNote,
} from '../data/piano'
import NoteInfo from './NoteInfo'
import {
  getLedgerLineSteps,
  getStaffNotePosition,
  isSharp,
  type StaffName,
} from '../data/staff'
import type { NoteDisplayMode } from '../music/noteDisplay'

interface GrandStaffProps {
  pressedNotes: string[]
  noteDisplayMode: NoteDisplayMode
}

interface PositionedNote {
  note: PianoNote
  midiNumber: number
  staff: StaffName
  staffStep: number
}

interface RenderedNote extends PositionedNote {
  x: number
}

interface LedgerLine {
  staff: StaffName
  step: number
  x1: number
  x2: number
}

const staffLineSteps = [0, 2, 4, 6, 8]
const staffScale = 1.2
const baseViewBoxCenterY = 240
const viewBoxCenterY = 320
const baseStaffBottomY: Record<StaffName, number> = {
  treble: 245,
  bass: 341,
}
const baseStepHeight = 8

function scaleX(value: number) {
  return 800 + (value - 800) * staffScale
}

function scaleY(value: number) {
  return viewBoxCenterY + (value - baseViewBoxCenterY) * staffScale
}

const staffBottomY: Record<StaffName, number> = {
  treble: scaleY(baseStaffBottomY.treble),
  bass: scaleY(baseStaffBottomY.bass),
}
const staffLeft = scaleX(220)
const staffRight = scaleX(1380)
const staffConnectorX = scaleX(185)
const noteCenterX = scaleX(800)
const noteCollisionOffset = 26 * staffScale
const noteHeadRadiusX = 10 * staffScale
const noteHeadRadiusY = 8 * staffScale
const ledgerLinePadding = 18 * staffScale
const stepHeight = baseStepHeight * staffScale

function noteY(staff: StaffName, step: number) {
  return staffBottomY[staff] - step * stepHeight
}

function layoutStaffNotes(notes: PositionedNote[]): RenderedNote[] {
  const sortedNotes = [...notes].sort(
    (left, right) => left.staffStep - right.staffStep || left.midiNumber - right.midiNumber,
  )
  const renderedNotes: RenderedNote[] = []
  let collisionCluster: PositionedNote[] = []

  function flushCluster() {
    if (collisionCluster.length === 0) {
      return
    }

    collisionCluster.forEach((positionedNote, index) => {
      const offset =
        (index - (collisionCluster.length - 1) / 2) * noteCollisionOffset

      renderedNotes.push({
        ...positionedNote,
        x: noteCenterX + offset,
      })
    })

    collisionCluster = []
  }

  sortedNotes.forEach(note => {
    const previousNote = collisionCluster[collisionCluster.length - 1]

    if (previousNote && note.staffStep - previousNote.staffStep > 1) {
      flushCluster()
    }

    collisionCluster.push(note)
  })

  flushCluster()

  return renderedNotes
}

function collectLedgerLines(renderedNotes: RenderedNote[]): LedgerLine[] {
  const ledgerLineMap = new Map<
    string,
    { staff: StaffName; step: number; xPositions: number[] }
  >()

  renderedNotes.forEach(note => {
    getLedgerLineSteps(note.staffStep).forEach(step => {
      const key = `${note.staff}-${step}`
      const existingLine = ledgerLineMap.get(key)

      if (existingLine) {
        existingLine.xPositions.push(note.x)
      } else {
        ledgerLineMap.set(key, {
          staff: note.staff,
          step,
          xPositions: [note.x],
        })
      }
    })
  })

  return Array.from(ledgerLineMap.values()).map(line => ({
    staff: line.staff,
    step: line.step,
    x1: Math.min(...line.xPositions) - noteHeadRadiusX - ledgerLinePadding,
    x2: Math.max(...line.xPositions) + noteHeadRadiusX + ledgerLinePadding,
  }))
}

function collectAccidentalPositions(renderedNotes: RenderedNote[]) {
  const accidentalMap = new Map<string, { staff: StaffName; step: number; x: number }>()

  renderedNotes.forEach(note => {
    if (!isSharp(note.note)) {
      return
    }

    const key = `${note.staff}-${note.staffStep}`

    if (accidentalMap.has(key)) {
      return
    }

    const sameStepNotes = renderedNotes.filter(
      otherNote =>
        otherNote.staff === note.staff &&
        otherNote.staffStep === note.staffStep,
    )

    accidentalMap.set(key, {
      staff: note.staff,
      step: note.staffStep,
      x: Math.min(...sameStepNotes.map(sameStepNote => sameStepNote.x)) - 24,
    })
  })

  return Array.from(accidentalMap.values())
}

function GrandStaff({ pressedNotes, noteDisplayMode }: GrandStaffProps) {
  const positionedNotes: PositionedNote[] = pressedNotes
    .map(noteName => pianoNotes.find(note => note.name === noteName))
    .filter((note): note is PianoNote => note !== undefined)
    .map(note => {
      const position = getStaffNotePosition(note)
      const midiNumber = pianoNoteToMidiNumber(note)

      return midiNumber === undefined
        ? undefined
        : {
            note,
            midiNumber,
            staff: position.staff,
            staffStep: position.staffStep,
          }
    })
    .filter((note): note is PositionedNote => note !== undefined)

  const renderedNotes = (['treble', 'bass'] as StaffName[]).flatMap(staff =>
    layoutStaffNotes(positionedNotes.filter(note => note.staff === staff)),
  )
  const ledgerLines = collectLedgerLines(renderedNotes)
  const accidentalPositions = collectAccidentalPositions(renderedNotes)

  return (
    <section className="grand-staff" aria-label="Grand Staff">
      <svg
        className="grand-staff-svg"
        viewBox="0 40 1600 560"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Grand staff with currently pressed notes"
      >
        {(['treble', 'bass'] as StaffName[]).map(staff => (
          <g key={`${staff}-staff`}>
            {staffLineSteps.map(step => (
              <line
                key={`${staff}-staff-line-${step}`}
                className="staff-line"
                x1={staffLeft}
                x2={staffRight}
                y1={noteY(staff, step)}
                y2={noteY(staff, step)}
              />
            ))}
          </g>
        ))}

        <line
          className="staff-connector"
          x1={staffConnectorX}
          x2={staffConnectorX}
          y1={noteY('treble', 8)}
          y2={noteY('bass', 0)}
        />

        <text
          className="staff-clef staff-clef-treble"
          x="110"
          y={noteY('treble', 4) + 30}
          aria-label="Treble Clef"
        >
          𝄞
        </text>

        <text
          className="staff-clef staff-clef-bass"
          x="110"
          y={noteY('bass', 4) + 24}
          aria-label="Bass Clef"
        >
          𝄢
        </text>

        {ledgerLines.map(line => (
          <line
            key={`ledger-line-${line.staff}-${line.step}`}
            className="staff-ledger-line"
            x1={line.x1}
            x2={line.x2}
            y1={noteY(line.staff, line.step)}
            y2={noteY(line.staff, line.step)}
          />
        ))}

        {accidentalPositions.map(accidental => (
          <text
            key={`accidental-${accidental.staff}-${accidental.step}`}
            className="staff-accidental"
            x={accidental.x}
            y={noteY(accidental.staff, accidental.step) + 6}
          >
            ♯
          </text>
        ))}

        {renderedNotes.map(note => (
          <ellipse
            key={`note-${note.note.name}`}
            className="staff-note"
            cx={note.x}
            cy={noteY(note.staff, note.staffStep)}
            rx={noteHeadRadiusX}
            ry={noteHeadRadiusY}
          />
        ))}
      </svg>

      <NoteInfo pressedNotes={pressedNotes} mode={noteDisplayMode} />
    </section>
  )
}

export default GrandStaff
