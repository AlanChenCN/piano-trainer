import type { ReactNode, RefObject } from 'react'
import type { PianoLabelMode } from '../data/piano'
import type { AppSettings } from '../settings/settings'
import Modal from './Modal'

interface SettingsPopoverProps {
  isOpen: boolean
  anchorRef: RefObject<HTMLElement | null>
  settings: AppSettings
  onClose: () => void
  onAutoSaveChange: (enabled: boolean) => void
  onSoundChange: (enabled: boolean) => void
  onLabelModeChange: (mode: PianoLabelMode) => void
  onSaveSettings: () => void
  onResetSettings: () => void
}

const labelModes: Array<{ value: PianoLabelMode; label: string }> = [
  { value: 'hidden', label: 'Hidden' },
  { value: 'white', label: 'White Keys' },
  { value: 'letter', label: 'Letter' },
  { value: 'solfege', label: 'Solfege' },
  { value: 'all', label: 'All' },
]

function SettingsPopover({ isOpen, anchorRef, settings, onClose, onAutoSaveChange, onSoundChange, onLabelModeChange, onSaveSettings, onResetSettings }: SettingsPopoverProps) {
  return <Modal isOpen={isOpen} title="Settings" anchorRef={anchorRef} placement="bottom" size="wide" onClose={onClose} headerActions={
    <div className="settings-header-actions">
      <button className="app-button app-button--compact settings-header-auto-save" type="button" aria-pressed={settings.autoSave} data-active={settings.autoSave} onClick={() => onAutoSaveChange(!settings.autoSave)}><span>Auto Save {settings.autoSave ? 'On' : 'Off'}</span><span className="settings-toggle-indicator" aria-hidden="true" /></button>
      <button className="app-button app-button--compact settings-header-button" type="button" aria-label="Save Settings" onClick={onSaveSettings}>Save</button>
      <button className="app-button app-button--compact settings-header-button" type="button" aria-label="Reset Settings" onClick={onResetSettings}>Reset</button>
    </div>
  }>
    <div className="settings-popover-content">
      <section className="settings-section settings-auto-save" aria-label="Web Sound">
        <div><h3>Web Sound</h3><p className="settings-hint">Enable browser audio for piano input.</p></div>
        <button className="app-button app-button--compact settings-toggle-button" type="button" aria-pressed={settings.audio.soundEnabled} data-active={settings.audio.soundEnabled} onClick={() => onSoundChange(!settings.audio.soundEnabled)}>{settings.audio.soundEnabled ? 'On' : 'Off'}</button>
      </section>
      <SettingsSection title="Key Labels">
        <SettingsOptions label="Key label display mode" value={settings.piano.labelMode === 'c' ? 'letter' : settings.piano.labelMode} options={labelModes} onChange={onLabelModeChange} />
      </SettingsSection>
    </div>
  </Modal>
}

function SettingsSection({ title, children }: { title: string; children: ReactNode }) {
  return <section className="settings-section" aria-label={title}><h3>{title}</h3>{children}</section>
}

function SettingsOptions<Value extends string>({ label, value, options, onChange }: { label: string; value: Value; options: Array<{ value: Value; label: string }>; onChange: (value: Value) => void }) {
  return <div className="settings-options"><span className="settings-label">{label}</span><div className="settings-option-list" role="radiogroup" aria-label={label}>{options.map(option => <button key={option.value} className="app-button app-button--compact settings-option-button" type="button" aria-pressed={value === option.value} data-active={value === option.value} onClick={() => onChange(option.value)}>{option.label}</button>)}</div></div>
}

export default SettingsPopover
