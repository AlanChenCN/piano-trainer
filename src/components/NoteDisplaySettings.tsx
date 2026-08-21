import type { RefObject } from 'react'
import type { NoteDisplayMode } from '../music/noteDisplay'
import Modal from './Modal'

interface NoteDisplaySettingsProps {
  isOpen: boolean
  mode: NoteDisplayMode
  anchorRef: RefObject<HTMLElement | null>
  onClose: () => void
  onModeChange: (mode: NoteDisplayMode) => void
}

const displayModes: Array<{ value: NoteDisplayMode; label: string }> = [
  { value: 'hidden', label: 'Off' },
  { value: 'letter', label: 'Letter' },
  { value: 'solfege', label: 'Solfege' },
]

function NoteDisplaySettings({
  isOpen,
  mode,
  anchorRef,
  onClose,
  onModeChange,
}: NoteDisplaySettingsProps) {
  function handleModeChange(nextMode: NoteDisplayMode) {
    onModeChange(nextMode)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      title="Note Display"
      anchorRef={anchorRef}
      placement="bottom"
      onClose={onClose}
    >
      <div
        className="modal-option-list"
        role="radiogroup"
        aria-label="Note display mode"
      >
        {displayModes.map(displayMode => (
          <button
            key={displayMode.value}
            className="app-button app-button--compact modal-option-button"
            type="button"
            aria-pressed={mode === displayMode.value}
            data-active={mode === displayMode.value}
            onClick={() => handleModeChange(displayMode.value)}
          >
            {displayMode.label}
          </button>
        ))}
      </div>
    </Modal>
  )
}

export default NoteDisplaySettings
