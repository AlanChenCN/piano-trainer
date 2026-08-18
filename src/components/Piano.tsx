import PianoKey from './PianoKey'
import {
  pianoNotes,
  type PianoLabelMode,
  type PianoNote,
} from '../data/piano'

interface PianoProps {
  pressedNotes: string[]
  labelMode: PianoLabelMode
  onPress: (noteName: string) => void
  onRelease: (noteName: string) => void
}

function displayLabelFor(note: PianoNote, labelMode: PianoLabelMode) {
  if (labelMode === "hidden") {
    return ""
  }

  if (labelMode === "white") {
    return note.type === "white" ? note.name : ""
  }

  if (labelMode === "c") {
    return note.pitchClass === "C" ? note.name : ""
  }

  return note.name
}

function Piano({
  pressedNotes,
  labelMode,
  onPress,
  onRelease,
}: PianoProps) {
  const whiteKeys = pianoNotes.filter(note => note.type === "white")
  const blackKeys = pianoNotes.filter(note => note.type === "black")

  return (
    <div className="piano-viewport">
      <div className="piano">
        <div className="white-keys">
          {whiteKeys.map(note => (
            <PianoKey
              key={note.name}
              note={note.name}
              displayLabel={displayLabelFor(note, labelMode)}
              type={note.type}
              position={note.position}
              pressed={pressedNotes.includes(note.name)}
              onPress={() => onPress(note.name)}
              onRelease={() => onRelease(note.name)}
            />
          ))}
        </div>

        <div className="black-keys">
          {blackKeys.map(note => (
            <PianoKey
              key={note.name}
              note={note.name}
              displayLabel={displayLabelFor(note, labelMode)}
              type={note.type}
              position={note.position}
              pressed={pressedNotes.includes(note.name)}
              onPress={() => onPress(note.name)}
              onRelease={() => onRelease(note.name)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Piano
