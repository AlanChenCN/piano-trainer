import type { ReactNode, RefObject } from 'react'
import type { PianoLabelMode } from '../data/piano'
import type { NoteDisplayMode, PracticeNoteNameMode } from '../music/noteDisplay'
import {
  practiceLowerBoundOptions,
  practiceUpperBoundOptions,
} from '../practice/timeline'
import type {
  PracticeMode,
  PracticeNotePool,
  PracticeSettings,
} from '../practice/practiceTypes'
import type {
  NoteColorMode,
  ThemeMode,
  ThemeTokens,
} from '../theme/theme'
import type { ConfigurableThemeToken } from './ThemePopover'
import type { AppSettings } from '../settings/settings'
import Modal from './Modal'

interface SettingsPopoverProps {
  isOpen: boolean
  anchorRef: RefObject<HTMLElement | null>
  settings: AppSettings
  themeTokens: ThemeTokens
  onClose: () => void
  onAutoSaveChange: (enabled: boolean) => void
  onThemeModeChange: (mode: ThemeMode) => void
  onThemeTokenChange: (token: ConfigurableThemeToken, value: string) => void
  onNoteColorModeChange: (mode: NoteColorMode) => void
  onLabelModeChange: (mode: PianoLabelMode) => void
  onNoteDisplayModeChange: (mode: NoteDisplayMode) => void
  onPracticeSettingsChange: (updates: Partial<PracticeSettings>) => void
  onSaveSettings: () => void
  onResetSettings: () => void
}

const themeModes: Array<{ value: ThemeMode; label: string }> = [
  { value: 'system', label: 'Follow System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'custom', label: 'Custom' },
]

const labelModes: Array<{ value: PianoLabelMode; label: string }> = [
  { value: 'hidden', label: 'Hidden' },
  { value: 'white', label: 'White Keys' },
  { value: 'letter', label: 'Letter' },
  { value: 'solfege', label: 'Solfege' },
  { value: 'all', label: 'All' },
]

const displayModes: Array<{ value: NoteDisplayMode; label: string }> = [
  { value: 'hidden', label: 'Off' },
  { value: 'letter', label: 'Letter' },
  { value: 'solfege', label: 'Solfege' },
]

const colorFields: Array<{
  key: ConfigurableThemeToken
  label: string
}> = [
  { key: 'pageBackground', label: 'Page Background' },
  { key: 'scoreBackground', label: 'Score Background' },
  { key: 'staffColor', label: 'Staff Color' },
  { key: 'activeNoteColor', label: 'Active Note Color' },
]

const practiceTypes: Array<{ value: PracticeMode; label: string }> = [
  { value: 'note', label: 'Note' },
  { value: 'chord', label: 'Chord' },
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

function SettingsPopover({
  isOpen,
  anchorRef,
  settings,
  themeTokens,
  onClose,
  onAutoSaveChange,
  onThemeModeChange,
  onThemeTokenChange,
  onNoteColorModeChange,
  onLabelModeChange,
  onNoteDisplayModeChange,
  onPracticeSettingsChange,
  onSaveSettings,
  onResetSettings,
}: SettingsPopoverProps) {
  const { theme, piano, grandStaff, practice } = settings

  return (
    <Modal
      isOpen={isOpen}
      title="Settings"
      anchorRef={anchorRef}
      placement="bottom"
      size="wide"
      onClose={onClose}
    >
      <div className="settings-popover-content">
        <section className="settings-section settings-auto-save">
          <div>
            <h3>Auto Save</h3>
            <p className="settings-hint">
              Save preference changes to this browser immediately.
            </p>
          </div>
          <button
            className="app-button app-button--compact settings-toggle-button"
            type="button"
            aria-pressed={settings.autoSave}
            data-active={settings.autoSave}
            onClick={() => onAutoSaveChange(!settings.autoSave)}
          >
            {settings.autoSave ? 'On' : 'Off'}
          </button>
        </section>

        <SettingsSection title="Theme">
          <div className="settings-option-list" role="radiogroup" aria-label="Theme mode">
            {themeModes.map(option => (
              <button
                key={option.value}
                className="app-button app-button--compact settings-option-button"
                type="button"
                aria-pressed={theme.mode === option.value}
                data-active={theme.mode === option.value}
                onClick={() => onThemeModeChange(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="settings-color-list">
            {colorFields.map(field => (
              <label className="settings-color-field" key={field.key}>
                <span>{field.label}</span>
                <input
                  type="color"
                  value={themeTokens[field.key]}
                  aria-label={field.label}
                  onChange={event => onThemeTokenChange(field.key, event.target.value)}
                />
                <code>{themeTokens[field.key]}</code>
              </label>
            ))}
          </div>

          <div className="settings-subsection">
            <span className="settings-label">Note Color Mode</span>
            <div className="settings-option-list settings-option-list--two" role="radiogroup" aria-label="Note color mode">
              {(['single', 'left-right'] as const).map(mode => (
                <button
                  key={mode}
                  className="app-button app-button--compact settings-option-button"
                  type="button"
                  aria-pressed={theme.noteColorMode === mode}
                  data-active={theme.noteColorMode === mode}
                  onClick={() => onNoteColorModeChange(mode)}
                >
                  {mode === 'single' ? 'Single' : 'Left / Right Hand'}
                </button>
              ))}
            </div>
          </div>
        </SettingsSection>

        <SettingsSection title="Key Labels">
          <SettingsOptions
            label="Key label display mode"
            value={piano.labelMode === 'c' ? 'letter' : piano.labelMode}
            options={labelModes}
            onChange={onLabelModeChange}
          />
        </SettingsSection>

        <SettingsSection title="Note Display">
          <SettingsOptions
            label="Grand Staff note display mode"
            value={grandStaff.noteDisplayMode}
            options={displayModes}
            onChange={onNoteDisplayModeChange}
          />
        </SettingsSection>

        <SettingsSection title="Practice Settings">
          <div className="settings-range-fields">
            <label className="settings-field">
              <span>Lower Bound</span>
              <select
                value={practice.rangeStart}
                aria-label="Practice range lower bound"
                onChange={event => onPracticeSettingsChange({ rangeStart: event.target.value })}
              >
                {practiceLowerBoundOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="settings-field">
              <span>Upper Bound</span>
              <select
                value={practice.rangeEnd}
                aria-label="Practice range upper bound"
                onChange={event => onPracticeSettingsChange({ rangeEnd: event.target.value })}
              >
                {practiceUpperBoundOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <SettingsOptions
            label="Practice Type"
            value={practice.practiceType}
            options={practiceTypes}
            onChange={value => onPracticeSettingsChange({ practiceType: value })}
          />

          {practice.practiceType === 'note' && (
            <SettingsOptions
              label="Note Pool"
              value={practice.notePool}
              options={notePools}
              onChange={value => onPracticeSettingsChange({ notePool: value })}
            />
          )}

          <SettingsOptions
            label="Note Names"
            value={practice.noteNameMode}
            options={noteNameModes}
            onChange={value => onPracticeSettingsChange({ noteNameMode: value })}
          />
        </SettingsSection>

        <div className="settings-actions">
          <button className="app-button app-button--compact" type="button" onClick={onSaveSettings}>
            Save Settings
          </button>
          <button className="app-button app-button--compact" type="button" onClick={onResetSettings}>
            Reset Settings
          </button>
        </div>
      </div>
    </Modal>
  )
}

interface SettingsSectionProps {
  title: string
  children: ReactNode
}

function SettingsSection({ title, children }: SettingsSectionProps) {
  return (
    <section className="settings-section" aria-label={title}>
      <h3>{title}</h3>
      {children}
    </section>
  )
}

interface SettingsOptionsProps<Value extends string> {
  label: string
  value: Value
  options: Array<{ value: Value; label: string }>
  onChange: (value: Value) => void
}

function SettingsOptions<Value extends string>({
  label,
  value,
  options,
  onChange,
}: SettingsOptionsProps<Value>) {
  return (
    <div className="settings-options">
      <span className="settings-label">{label}</span>
      <div className="settings-option-list" role="radiogroup" aria-label={label}>
        {options.map(option => (
          <button
            key={option.value}
            className="app-button app-button--compact settings-option-button"
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

export default SettingsPopover
