import { formatChordName, type Chord } from '../music/chord'

interface ChordInfoProps {
  chord: Chord | null
}

function ChordInfo({ chord }: ChordInfoProps) {
  if (!chord) {
    return null
  }

  return (
    <aside className="chord-info" aria-label="Current Chord" aria-live="polite">
      <span className="chord-info-label">Chord:</span>
      <span className="chord-info-value">{formatChordName(chord)}</span>
    </aside>
  )
}

export default ChordInfo
