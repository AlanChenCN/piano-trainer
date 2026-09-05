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
import {
  practiceNoteNameFor,
  type NoteDisplayMode,
  type PracticeNoteNameMode,
} from '../music/noteDisplay'
import { formatChordName, type Chord } from '../music/chord'
import { analyzeChord } from '../music/chordAnalyzer'
import type {
  PracticeMode,
  PracticePhrase,
} from '../practice/practiceTypes'
import ChordInfo from './ChordInfo'
import {
  createGrandStaffGeometry,
  staffLineSteps,
} from '../data/staffGeometry'

interface GrandStaffProps {
  pressedNotes: string[]
  targetNotes: PianoNote[]
  practicePhrase: PracticePhrase | null
  currentTargetIndex: number
  playbackBeat: number
  playbackActive: boolean
  practiceType: PracticeMode
  noteDisplayMode: NoteDisplayMode
  practiceNoteNameMode: PracticeNoteNameMode
  chord: Chord | null
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

  const { noteY } = createGrandStaffGeometry(
  scaleY(baseStaffBottomY.treble),
  baseStepHeight * staffScale,
)
const staffLeft = scaleX(220)
const staffRight = scaleX(1380)
const staffConnectorX = scaleX(185)
const noteCenterX = scaleX(800)
const noteCollisionOffset = 26 * staffScale
const noteHeadRadiusX = 10 * staffScale
const noteHeadRadiusY = 8 * staffScale
const ledgerLinePadding = 18 * staffScale

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

function renderPhraseNotes(
  phrase: PracticePhrase | null,
  currentTargetIndex: number,
) {
  if (!phrase) {
    return []
  }

  return phrase.notes.flatMap(phraseNote => {
    if (phraseNote.index === currentTargetIndex) {
      return []
    }

    const targetX = timelineNoteX(phraseNote.index, phrase.notes.length)
    const status =
      phraseNote.index < currentTargetIndex ? 'completed' : 'future'

    return (['treble', 'bass'] as StaffName[]).flatMap(staff =>
      layoutStaffNotes(
        positionNotes(phraseNote.targetNotes).filter(
          note => note.staff === staff,
        ),
        targetX,
      ).map(positionedNote => ({
        ...positionedNote,
        index: phraseNote.index,
        status,
      })),
    )
  })
}

function measureLineXs(phrase: PracticePhrase | null) {
  if (!phrase) {
    return []
  }

  return Array.from(
    { length: phrase.measureCount - 1 },
    (_, measureIndex) => {
      const leftIndex =
        (measureIndex + 1) * phrase.beatsPerMeasure - 1
      const rightIndex = leftIndex + 1

      return (
        timelineNoteX(leftIndex, phrase.notes.length) +
        timelineNoteX(rightIndex, phrase.notes.length)
      ) / 2
    },
  )
}

function GrandStaff({
  pressedNotes,
  targetNotes,
  practicePhrase,
  currentTargetIndex,
  playbackBeat,
  playbackActive,
  practiceType,
  noteDisplayMode,
  practiceNoteNameMode,
  chord,
}: GrandStaffProps) {
  const positionedNotes = positionNotes(
    pressedNotes
      .map(noteName => pianoNotes.find(note => note.name === noteName))
      .filter((note): note is PianoNote => note !== undefined),
  )
  const currentTargetX =
    practicePhrase && currentTargetIndex >= 0
      ? timelineNoteX(currentTargetIndex, practicePhrase.notes.length)
      : noteCenterX

  const renderedNotes = (['treble', 'bass'] as StaffName[]).flatMap(staff =>
    layoutStaffNotes(
      positionedNotes.filter(note => note.staff === staff),
      currentTargetX,
    ),
  )
  const renderedPhraseNotes = renderPhraseNotes(
    practicePhrase,
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
  const phraseLedgerLines = collectLedgerLines(renderedPhraseNotes, true)
  const phraseAccidentalPositions = collectAccidentalPositions(
    renderedPhraseNotes,
    true,
  )
  const currentTargetLedgerLines = collectLedgerLines(
    renderedCurrentTargetNotes,
  )
  const currentTargetAccidentalPositions = collectAccidentalPositions(
    renderedCurrentTargetNotes,
  )
  const practiceNoteNames =
    practiceType === 'note' &&
    practicePhrase &&
    practiceNoteNameMode !== 'hidden'
      ? practicePhrase.notes.map(phraseNote => ({
          phraseNote,
          label: phraseNote.targetNotes
            .map(note => practiceNoteNameFor(note, practiceNoteNameMode))
            .join(' · '),
        }))
      : []
  const practiceChordNames = practicePhrase
    ? practicePhrase.notes.flatMap(phraseNote => {
        const chord = analyzeChord(phraseNote.targetNotes)

        return chord
          ? [{ phraseNote, label: formatChordName(chord) }]
          : []
      })
    : []
  const measureLines = measureLineXs(practicePhrase)
  const practiceNoteNameY = noteY('treble', 8) - 32
  const practiceChordNameY = practiceNoteNameY - 28

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

        {practiceChordNames.map(({ phraseNote, label }) => (
          <text
            key={`practice-chord-name-${phraseNote.id}`}
            className={`practice-chord-name${
              phraseNote.index === currentTargetIndex
                ? ' practice-chord-name--current'
                : ''
            }`}
            x={timelineNoteX(phraseNote.index, practicePhrase?.notes.length ?? 1)}
            y={practiceChordNameY}
          >
            {label}
          </text>
        ))}

        {practiceNoteNames.map(({ phraseNote, label }) => (
          <text
            key={`practice-note-name-${phraseNote.id}`}
            className={`practice-note-name${
              phraseNote.index === currentTargetIndex
                ? ' practice-note-name--current'
                : ''
            }`}
            x={timelineNoteX(phraseNote.index, practicePhrase?.notes.length ?? 1)}
            y={practiceNoteNameY}
          >
            {label}
          </text>
        ))}

        {measureLines.map((x, index) => (
          <line
            key={`practice-measure-line-${index}`}
            className="practice-measure-line"
            x1={x}
            x2={x}
            y1={noteY('treble', 8) - 16}
            y2={noteY('bass', 0) + 16}
          />
        ))}

        {playbackActive && practicePhrase && <line className="practice-playback-cursor" x1={timelineNoteX(Math.min(practicePhrase.notes.length - 1, playbackBeat), practicePhrase.notes.length)} x2={timelineNoteX(Math.min(practicePhrase.notes.length - 1, playbackBeat), practicePhrase.notes.length)} y1={noteY('treble', 8) - 22} y2={noteY('bass', 0) + 22} />}

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
          {phraseLedgerLines.map(line => (
            <line
              key={`phrase-ledger-line-${line.staff}-${line.step}-${line.x1}`}
              className="staff-target-ledger-line"
              x1={line.x1}
              x2={line.x2}
              y1={noteY(line.staff, line.step)}
              y2={noteY(line.staff, line.step)}
            />
          ))}

          {phraseAccidentalPositions.map(accidental => (
            <text
              key={`phrase-accidental-${accidental.staff}-${accidental.step}-${accidental.x}`}
              className="staff-target-accidental"
              x={accidental.x}
              y={noteY(accidental.staff, accidental.step) + 6}
            >
              ♯
            </text>
          ))}

          {renderedPhraseNotes.map(note => (
            <ellipse
              key={`phrase-note-${note.note.name}-${note.x}`}
              className={`staff-target-note staff-target-note--${note.status}`}
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

      <div className="grand-staff-info">
        <NoteInfo pressedNotes={pressedNotes} mode={noteDisplayMode} />
        <ChordInfo chord={chord} />
      </div>
    </section>
  )
}

export default GrandStaff
