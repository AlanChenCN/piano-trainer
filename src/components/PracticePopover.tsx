import type { RefObject } from 'react'
import {
  type PracticeNotePool,
  type PracticeSelection,
  type PracticeSettings,
} from '../practice/practiceTypes'
import type { PracticeNoteNameMode } from '../music/noteDisplay'
import { practiceRangeOptions } from '../practice/timeline'
import Modal from './Modal'

interface PracticePopoverProps {
  isOpen: boolean
  selection: PracticeSelection
  settings: PracticeSettings
  anchorRef: RefObject<HTMLElement | null>
  onClose: () => void
  onSelectionChange: (selection: PracticeSelection) => void
  onSettingsChange: (updates: Partial<PracticeSettings>) => void
}

const practiceModes: Array<{
  value: PracticeSelection
  label: string
}> = [
  { value: 'free-play', label: 'Free Play' },
  { value: 'note-practice', label: 'Note Practice' },
]

const notePools: Array<{ value: PracticeNotePool; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'white-only', label: 'White Only' },
  { value: 'black-only', label: 'Black Only' },
]

const noteNameModes: Array<{
  value: PracticeNoteNameMode
  label: string
}> = [
  { value: 'hidden', label: 'Hide' },
  { value: 'letter', label: 'C' },
  { value: 'full', label: 'C4' },
]

function PracticePopover({
  isOpen,
  selection,
  settings,
  anchorRef,
  onClose,
  onSelectionChange,
  onSettingsChange,
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
      size="wide"
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

      <section className="practice-settings" aria-label="Practice Settings">
        <h3>Practice Settings</h3>

        <label className="practice-setting-field">
          <span>Note Range</span>
          <select
            value={settings.range}
            onChange={event =>
              onSettingsChange({
                range: event.target.value as PracticeSettings['range'],
              })
            }
          >
            {practiceRangeOptions.map(range => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </label>

        <PracticeSettingOptions
          label="Note Pool"
          value={settings.notePool}
          options={notePools}
          onChange={value => onSettingsChange({ notePool: value })}
        />

        <PracticeSettingOptions
          label="Note Names"
          value={settings.noteNameMode}
          options={noteNameModes}
          onChange={value => onSettingsChange({ noteNameMode: value })}
        />
      </section>
    </Modal>
  )
}

interface PracticeSettingOptionsProps<Value extends string> {
  label: string
  value: Value
  options: Array<{ value: Value; label: string }>
  onChange: (value: Value) => void
}

function PracticeSettingOptions<Value extends string>({
  label,
  value,
  options,
  onChange,
}: PracticeSettingOptionsProps<Value>) {
  return (
    <div className="practice-setting-options">
      <span>{label}</span>
      <div className="modal-option-list" role="radiogroup" aria-label={label}>
        {options.map(option => (
          <button
            key={option.value}
            className="app-button app-button--compact modal-option-button"
            type="button"
            aria-pressed={value === option.value}
            data-active={value === option.value}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default PracticePopover
