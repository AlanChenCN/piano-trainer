import { useRef, useState } from 'react'
import type { PianoLabelMode } from '../data/piano'
import type { AppSettings } from '../settings/settings'
import SettingsPopover from './SettingsPopover'
import ThemePopover, { type ConfigurableThemeToken } from './ThemePopover'
import type { NoteColorMode, ThemeDisplayPreset, ThemeMode, ThemeTokens } from '../theme/theme'

interface Props {
  themeMode: ThemeMode
  activePreset: ThemeDisplayPreset
  themeTokens: ThemeTokens
  noteColorMode: NoteColorMode
  settings: AppSettings
  onThemeModeChange: (mode: ThemeMode) => void
  onThemeTokenChange: (token: ConfigurableThemeToken, value: string) => void
  onNoteColorModeChange: (mode: NoteColorMode) => void
  onThemeReset: () => void
  onAutoSaveChange: (enabled: boolean) => void
  onSoundChange: (enabled: boolean) => void
  onLabelModeChange: (mode: PianoLabelMode) => void
  onSaveSettings: () => void
  onResetSettings: () => void
}

export default function GlobalControls(props: Props) {
  const [themeOpen, setThemeOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const themeButton = useRef<HTMLButtonElement>(null)
  const settingsButton = useRef<HTMLButtonElement>(null)

  return <div className="global-controls" aria-label="Global controls">
    <button ref={themeButton} className="app-button app-button--compact" type="button" aria-haspopup="dialog" aria-expanded={themeOpen} onClick={() => setThemeOpen(true)}>
      <span className="button-label">Theme</span>
      <span className="button-status">{props.activePreset[0].toUpperCase() + props.activePreset.slice(1)}</span>
    </button>
    <button ref={settingsButton} className="app-button app-button--compact" type="button" aria-haspopup="dialog" aria-expanded={settingsOpen} onClick={() => setSettingsOpen(true)}>
      <span className="button-label">Settings</span>
      <span className="button-status">{props.settings.autoSave ? 'Auto Save' : 'Manual Save'}</span>
    </button>
    <ThemePopover isOpen={themeOpen} anchorRef={themeButton} mode={props.themeMode} tokens={props.themeTokens} noteColorMode={props.noteColorMode} onClose={() => setThemeOpen(false)} onModeChange={props.onThemeModeChange} onTokenChange={props.onThemeTokenChange} onNoteColorModeChange={props.onNoteColorModeChange} onReset={props.onThemeReset} />
    <SettingsPopover isOpen={settingsOpen} anchorRef={settingsButton} settings={props.settings} onClose={() => setSettingsOpen(false)} onAutoSaveChange={props.onAutoSaveChange} onSoundChange={props.onSoundChange} onLabelModeChange={props.onLabelModeChange} onSaveSettings={props.onSaveSettings} onResetSettings={props.onResetSettings} />
  </div>
}
