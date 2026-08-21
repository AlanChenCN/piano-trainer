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
import type { PracticeTimelineNote } from '../practice/practiceTypes'

interface GrandStaffProps {
  pressedNotes: string[]
  targetNotes: PianoNote[]
  practiceTimelineNotes: PracticeTimelineNote[]
  currentTargetIndex: number
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

function layoutStaffNotes(
  notes: PositionedNote[],
  x = noteCenterX,
): RenderedNote[] {
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
        x: x + offset,
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

function collectLedgerLines(
  renderedNotes: RenderedNote[],
  separateByX = false,
): LedgerLine[] {
  const ledgerLineMap = new Map<
    string,
    { staff: StaffName; step: number; xPositions: number[] }
  >()

  renderedNotes.forEach(note => {
    getLedgerLineSteps(note.staffStep).forEach(step => {
      const key = separateByX
        ? `${note.staff}-${step}-${note.x}`
        : `${note.staff}-${step}`
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

function collectAccidentalPositions(
  renderedNotes: RenderedNote[],
  separateByX = false,
) {
  const accidentalMap = new Map<string, { staff: StaffName; step: number; x: number }>()

  renderedNotes.forEach(note => {
    if (!isSharp(note.note)) {
      return
    }

    const key = separateByX
      ? `${note.staff}-${note.staffStep}-${note.x}`
      : `${note.staff}-${note.staffStep}`

    if (accidentalMap.has(key)) {
      return
    }

    const sameStepNotes = renderedNotes.filter(
      otherNote =>
        otherNote.staff === note.staff &&
        otherNote.staffStep === note.staffStep &&
        (!separateByX || otherNote.x === note.x),
    )

    accidentalMap.set(key, {
      staff: note.staff,
      step: note.staffStep,
      x: Math.min(...sameStepNotes.map(sameStepNote => sameStepNote.x)) - 24,
    })
  })

  return Array.from(accidentalMap.values())
}

function positionNotes(notes: PianoNote[]): PositionedNote[] {
  return notes
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
}

function timelineNoteX(index: number, total: number) {
  const timelineLeft = staffLeft + 180
  const timelineRight = staffRight - 80

  if (total <= 1) {
    return noteCenterX
  }

  return timelineLeft + ((timelineRight - timelineLeft) * index) / (total - 1)
}

function renderTimelineNotes(
  timelineNotes: PracticeTimelineNote[],
  currentTargetIndex: number,
) {
  return timelineNotes.flatMap((timelineNote, index) => {
    if (index === currentTargetIndex) {
      return []
    }

    const positionedNote = positionNotes([timelineNote.note])[0]

    return positionedNote
      ? [{ ...positionedNote, x: timelineNoteX(index, timelineNotes.length) }]
      : []
  })
}

function GrandStaff({
  pressedNotes,
  targetNotes,
  practiceTimelineNotes,
  currentTargetIndex,
  noteDisplayMode,
}: GrandStaffProps) {
  const positionedNotes = positionNotes(
    pressedNotes
      .map(noteName => pianoNotes.find(note => note.name === noteName))
      .filter((note): note is PianoNote => note !== undefined),
  )
  const currentTargetX =
    currentTargetIndex >= 0 && practiceTimelineNotes.length > 0
      ? timelineNoteX(currentTargetIndex, practiceTimelineNotes.length)
      : noteCenterX

  const renderedNotes = (['treble', 'bass'] as StaffName[]).flatMap(staff =>
    layoutStaffNotes(
      positionedNotes.filter(note => note.staff === staff),
      currentTargetX,
    ),
  )
  const renderedTimelineNotes = renderTimelineNotes(
    practiceTimelineNotes,
    currentTargetIndex,
  )
  const renderedCurrentTargetNotes = (['treble', 'bass'] as StaffName[]).flatMap(
    staff =>
      layoutStaffNotes(
        positionNotes(targetNotes).filter(note => note.staff === staff),
        currentTargetX,
      ),
  )
  const ledgerLines = collectLedgerLines(renderedNotes)
  const accidentalPositions = collectAccidentalPositions(renderedNotes)
  const timelineLedgerLines = collectLedgerLines(renderedTimelineNotes, true)
  const timelineAccidentalPositions = collectAccidentalPositions(
    renderedTimelineNotes,
    true,
  )
  const currentTargetLedgerLines = collectLedgerLines(
    renderedCurrentTargetNotes,
  )
  const currentTargetAccidentalPositions = collectAccidentalPositions(
    renderedCurrentTargetNotes,
  )

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

        <g className="staff-target" aria-label="Practice target notes">
          {timelineLedgerLines.map(line => (
            <line
              key={`timeline-ledger-line-${line.staff}-${line.step}-${line.x1}`}
              className="staff-target-ledger-line"
              x1={line.x1}
              x2={line.x2}
              y1={noteY(line.staff, line.step)}
              y2={noteY(line.staff, line.step)}
            />
          ))}

          {timelineAccidentalPositions.map(accidental => (
            <text
              key={`timeline-accidental-${accidental.staff}-${accidental.step}-${accidental.x}`}
              className="staff-target-accidental"
              x={accidental.x}
              y={noteY(accidental.staff, accidental.step) + 6}
            >
              ♯
            </text>
          ))}

          {renderedTimelineNotes.map(note => (
            <ellipse
              key={`timeline-note-${note.note.name}-${note.x}`}
              className="staff-target-note staff-target-note--timeline"
              cx={note.x}
              cy={noteY(note.staff, note.staffStep)}
              rx={noteHeadRadiusX}
              ry={noteHeadRadiusY}
            />
          ))}

          {currentTargetLedgerLines.map(line => (
            <line
              key={`current-target-ledger-line-${line.staff}-${line.step}`}
              className="staff-target-ledger-line staff-target-ledger-line--current"
              x1={line.x1}
              x2={line.x2}
              y1={noteY(line.staff, line.step)}
              y2={noteY(line.staff, line.step)}
            />
          ))}

          {currentTargetAccidentalPositions.map(accidental => (
            <text
              key={`current-target-accidental-${accidental.staff}-${accidental.step}`}
              className="staff-target-accidental staff-target-accidental--current"
              x={accidental.x}
              y={noteY(accidental.staff, accidental.step) + 6}
            >
              ♯
            </text>
          ))}

          {renderedCurrentTargetNotes.map(note => (
            <ellipse
              key={`current-target-note-${note.note.name}`}
              className="staff-target-note staff-target-note--current"
              cx={note.x}
              cy={noteY(note.staff, note.staffStep)}
              rx={noteHeadRadiusX}
              ry={noteHeadRadiusY}
            />
          ))}
        </g>

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
