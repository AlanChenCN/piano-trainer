import { pianoNotes } from '../data/piano'
import {
  noteDisplayLabel,
  type NoteDisplayMode,
} from '../music/noteDisplay'

interface NoteInfoProps {
  pressedNotes: string[]
  mode: NoteDisplayMode
}

function NoteInfo({ pressedNotes, mode }: NoteInfoProps) {
  const currentNotes = pressedNotes
    .map(noteName => pianoNotes.find(note => note.name === noteName))
    .filter(note => note !== undefined)

  if (mode === 'hidden' || currentNotes.length === 0) {
    return null
  }

  const values = currentNotes.map(note => noteDisplayLabel(note, mode))
  const label = values.length > 1 ? 'Current Notes:' : 'Current Note:'

  return (
    <aside className="note-info" aria-label="Current Note" aria-live="polite">
      <span className="note-info-label">{label}</span>
      <span className="note-info-value">
        {values.join(' · ')}
      </span>
    </aside>
  )
}

export default NoteInfo
