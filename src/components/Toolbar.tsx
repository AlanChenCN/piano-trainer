import { useState } from 'react'
import type { PianoLabelMode } from '../data/piano'
import KeyLabelsModal from './KeyLabelsModal'

interface ToolbarProps {
  soundEnabled: boolean
  labelMode: PianoLabelMode
  onSoundChange: (enabled: boolean) => void
  onLabelModeChange: (mode: PianoLabelMode) => void
}

function Toolbar({
  soundEnabled,
  labelMode,
  onSoundChange,
  onLabelModeChange,
}: ToolbarProps) {
  const [keyLabelsModalOpen, setKeyLabelsModalOpen] = useState(false)

  return (
    <section className="toolbar" aria-label="Toolbar">
      <button className="app-button" type="button" disabled>
        Practice
      </button>

      <button
        className="app-button"
        type="button"
        aria-haspopup="dialog"
        aria-expanded={keyLabelsModalOpen}
        onClick={() => setKeyLabelsModalOpen(true)}
      >
        Key Labels
      </button>

      <button
        className="app-button"
        type="button"
        aria-pressed={soundEnabled}
        data-active={soundEnabled}
        onClick={() => onSoundChange(!soundEnabled)}
      >
        Sound
      </button>

      <button className="app-button" type="button" disabled>
        Metronome
      </button>

      <KeyLabelsModal
        isOpen={keyLabelsModalOpen}
        labelMode={labelMode}
        onClose={() => setKeyLabelsModalOpen(false)}
        onLabelModeChange={onLabelModeChange}
      />
    </section>
  )
}

export default Toolbar
