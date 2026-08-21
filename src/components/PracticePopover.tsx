import type { RefObject } from 'react'
import type { PracticeSelection } from '../practice/practiceTypes'
import Modal from './Modal'

interface PracticePopoverProps {
  isOpen: boolean
  selection: PracticeSelection
  anchorRef: RefObject<HTMLElement | null>
  onClose: () => void
  onSelectionChange: (selection: PracticeSelection) => void
}

const practiceModes: Array<{
  value: PracticeSelection
  label: string
}> = [
  { value: 'free-play', label: 'Free Play' },
  { value: 'note-practice', label: 'Note Practice' },
]

function PracticePopover({
  isOpen,
  selection,
  anchorRef,
  onClose,
  onSelectionChange,
}: PracticePopoverProps) {
  function handleSelectionChange(nextSelection: PracticeSelection) {
    onSelectionChange(nextSelection)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      title="Practice"
      anchorRef={anchorRef}
      placement="bottom"
      onClose={onClose}
    >
      <div
        className="modal-option-list"
        role="radiogroup"
        aria-label="Practice mode"
      >
        {practiceModes.map(practiceMode => (
          <button
            key={practiceMode.value}
            className="app-button app-button--compact modal-option-button"
            type="button"
            aria-pressed={selection === practiceMode.value}
            data-active={selection === practiceMode.value}
            onClick={() => handleSelectionChange(practiceMode.value)}
          >
            {practiceMode.label}
          </button>
        ))}
      </div>
    </Modal>
  )
}

export default PracticePopover
