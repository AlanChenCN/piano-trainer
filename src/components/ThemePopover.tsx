import type { RefObject } from 'react'
import Modal from './Modal'
import type {
  NoteColorMode,
  ThemeDisplayPreset,
  ThemeMode,
  ThemeTokens,
} from '../theme/theme'

type ConfigurableThemeToken =
  | 'pageBackground'
  | 'scoreBackground'
  | 'staffColor'
  | 'activeNoteColor'
  | 'leftHandColor'
  | 'rightHandColor'

interface ThemePopoverProps {
  isOpen: boolean
  anchorRef: RefObject<HTMLElement | null>
  mode: ThemeMode
  activePreset: ThemeDisplayPreset
  tokens: ThemeTokens
  noteColorMode: NoteColorMode
  onClose: () => void
  onModeChange: (mode: ThemeMode) => void
  onTokenChange: (token: ConfigurableThemeToken, value: string) => void
  onNoteColorModeChange: (mode: NoteColorMode) => void
  onReset: () => void
}

const colorFields: Array<{
  key: ConfigurableThemeToken
  label: string
}> = [
  { key: 'pageBackground', label: 'Page Background' },
  { key: 'scoreBackground', label: 'Score Background' },
  { key: 'staffColor', label: 'Staff Color' },
  { key: 'activeNoteColor', label: 'Active Note Color' },
]

function ThemePopover({
  isOpen,
  anchorRef,
  mode,
  activePreset,
  tokens,
  noteColorMode,
  onClose,
  onModeChange,
  onTokenChange,
  onNoteColorModeChange,
  onReset,
}: ThemePopoverProps) {
  return (
    <Modal
      isOpen={isOpen}
      title="Theme"
      anchorRef={anchorRef}
      placement="bottom"
      size="wide"
      onClose={onClose}
    >
      <div className="theme-popover-content">
        <section className="theme-section" aria-labelledby="theme-preset-title">
          <h3 id="theme-preset-title">Preset</h3>
          <div className="theme-option-list" role="radiogroup" aria-label="Theme preset">
            {(['dark', 'light', 'custom'] as const).map(preset => (
              <button
                key={preset}
                className="app-button app-button--compact theme-option-button"
                type="button"
                aria-pressed={activePreset === preset}
                data-active={activePreset === preset}
                onClick={() => onModeChange(preset)}
              >
                {preset[0].toUpperCase() + preset.slice(1)}
              </button>
            ))}
          </div>
          {mode === 'system' && (
            <p className="theme-hint">Following system preference</p>
          )}
        </section>

        <section className="theme-section" aria-labelledby="theme-colors-title">
          <h3 id="theme-colors-title">Colors</h3>
          <div className="theme-color-list">
            {colorFields.map(field => (
              <label className="theme-color-field" key={field.key}>
                <span>{field.label}</span>
                <input
                  type="color"
                  value={tokens[field.key]}
                  aria-label={field.label}
                  onChange={event => onTokenChange(field.key, event.target.value)}
                />
                <code>{tokens[field.key]}</code>
              </label>
            ))}
          </div>
        </section>

        <section className="theme-section" aria-labelledby="theme-note-color-title">
          <h3 id="theme-note-color-title">Note Color Mode</h3>
          <div
            className="theme-option-list theme-note-mode-list"
            role="radiogroup"
            aria-label="Note color mode"
          >
            <button
              className="app-button app-button--compact theme-option-button"
              type="button"
              aria-pressed={noteColorMode === 'single'}
              data-active={noteColorMode === 'single'}
              onClick={() => onNoteColorModeChange('single')}
            >
              Single
            </button>
            <button
              className="app-button app-button--compact theme-option-button"
              type="button"
              aria-pressed={noteColorMode === 'left-right'}
              data-active={noteColorMode === 'left-right'}
              onClick={() => onNoteColorModeChange('left-right')}
            >
              Left / Right Hand
            </button>
          </div>
          <p className="theme-hint">
            Hand colors are reserved for future hand metadata. Current notes use
            Active Note Color.
          </p>
          <div className="theme-color-list theme-hand-color-list">
            {([
              ['leftHandColor', 'Left Hand Color'],
              ['rightHandColor', 'Right Hand Color'],
            ] as const).map(([key, label]) => (
              <label className="theme-color-field" key={key}>
                <span>{label}</span>
                <input
                  type="color"
                  value={tokens[key]}
                  aria-label={label}
                  disabled={noteColorMode === 'single'}
                  onChange={event => onTokenChange(key, event.target.value)}
                />
                <code>{tokens[key]}</code>
              </label>
            ))}
          </div>
        </section>

        <div className="theme-footer">
          <button
            className="app-button app-button--compact theme-reset-button"
            type="button"
            onClick={onReset}
          >
            Reset to System
          </button>
        </div>
      </div>
    </Modal>
  )
}

export type { ConfigurableThemeToken }
export default ThemePopover
