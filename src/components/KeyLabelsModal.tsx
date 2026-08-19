import type { PianoLabelMode } from '../data/piano'
import type { RefObject } from 'react'
import Modal from './Modal'

interface KeyLabelsModalProps {
  isOpen: boolean
  labelMode: PianoLabelMode
  anchorRef: RefObject<HTMLElement | null>
  onClose: () => void
  onLabelModeChange: (mode: PianoLabelMode) => void
}

const labelModes: Array<{ value: PianoLabelMode; label: string }> = [
  { value: 'hidden', label: 'Hidden' },
  { value: 'white', label: 'White Keys' },
  { value: 'c', label: 'C Notes' },
  { value: 'all', label: 'All' },
]

function KeyLabelsModal({
  isOpen,
  labelMode,
  anchorRef,
  onClose,
  onLabelModeChange,
}: KeyLabelsModalProps) {
  function handleModeChange(mode: PianoLabelMode) {
    onLabelModeChange(mode)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      title="Key Labels"
      anchorRef={anchorRef}
      placement="top"
      onClose={onClose}
    >
      <div
        className="modal-option-list"
        role="radiogroup"
        aria-label="Key label display mode"
      >
        {labelModes.map(mode => (
          <button
            key={mode.value}
            className="app-button app-button--compact modal-option-button"
            type="button"
            aria-pressed={labelMode === mode.value}
            data-active={labelMode === mode.value}
            onClick={() => handleModeChange(mode.value)}
          >
            {mode.label}
          </button>
        ))}
      </div>
    </Modal>
  )
}

export default KeyLabelsModal
