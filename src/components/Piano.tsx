import PianoKey from './PianoKey'
import { pianoNotes } from '../data/piano'

interface PianoProps {
  pressedNotes: string[]
  onPress: (noteName: string) => void
  onRelease: (noteName: string) => void
}


function Piano({ pressedNotes, onPress, onRelease }: PianoProps) {
  const whiteKeys = pianoNotes.filter(note => note.type === "white")
  const blackKeys = pianoNotes.filter(note => note.type === "black")

  return (
    <div className="piano">
      <div className="white-keys">
        {whiteKeys.map(note => (
          <PianoKey
            key={note.name}
            note={note.name}
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
            type={note.type}
            position={note.position}
            pressed={pressedNotes.includes(note.name)}
            onPress={() => onPress(note.name)}
            onRelease={() => onRelease(note.name)}
          />
        ))}
      </div>
    </div>
  )
}

export default Piano
