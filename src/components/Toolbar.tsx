import { useRef, useState } from 'react'
import type { PianoLabelMode } from '../data/piano'
import NoteDisplaySettings from './NoteDisplaySettings'
import ThemePopover, {
  type ConfigurableThemeToken,
} from './ThemePopover'
import type {
  NoteColorMode,
  ThemeDisplayPreset,
  ThemeMode,
  ThemeTokens,
} from '../theme/theme'
import type { NoteDisplayMode } from '../music/noteDisplay'
import type {
  PracticeSelection,
  PracticeSettings,
} from '../practice/practiceTypes'
import PracticePopover from './PracticePopover'
import SettingsPopover from './SettingsPopover'
import type { AppSettings } from '../settings/settings'

interface ToolbarProps {
  themeMode: ThemeMode
  activePreset: ThemeDisplayPreset
  themeTokens: ThemeTokens
  noteColorMode: NoteColorMode
  onThemeModeChange: (mode: ThemeMode) => void
  onThemeTokenChange: (token: ConfigurableThemeToken, value: string) => void
  onNoteColorModeChange: (mode: NoteColorMode) => void
  onThemeReset: () => void
  noteDisplayMode: NoteDisplayMode
  onNoteDisplayModeChange: (mode: NoteDisplayMode) => void
  practiceSelection: PracticeSelection
  practiceSettings: PracticeSettings
  onPracticeSelectionChange: (selection: PracticeSelection) => void
  onPracticeSettingsChange: (updates: Partial<PracticeSettings>) => void
  settings: AppSettings
  onAutoSaveChange: (enabled: boolean) => void
  onSoundChange: (enabled: boolean) => void
  onLabelModeChange: (mode: PianoLabelMode) => void
  onSaveSettings: () => void
  onResetSettings: () => void
}

function Toolbar({
  themeMode,
  activePreset,
  themeTokens,
  noteColorMode,
  onThemeModeChange,
  onThemeTokenChange,
  onNoteColorModeChange,
  onThemeReset,
  noteDisplayMode,
  onNoteDisplayModeChange,
  practiceSelection,
  practiceSettings,
  onPracticeSelectionChange,
  onPracticeSettingsChange,
  settings,
  onAutoSaveChange,
  onSoundChange,
  onLabelModeChange,
  onSaveSettings,
  onResetSettings,
}: ToolbarProps) {
  const [themePopoverOpen, setThemePopoverOpen] = useState(false)
  const [noteDisplayPopoverOpen, setNoteDisplayPopoverOpen] = useState(false)
  const [practicePopoverOpen, setPracticePopoverOpen] = useState(false)
  const [settingsPopoverOpen, setSettingsPopoverOpen] = useState(false)
  const themeButtonRef = useRef<HTMLButtonElement>(null)
  const noteDisplayButtonRef = useRef<HTMLButtonElement>(null)
  const practiceButtonRef = useRef<HTMLButtonElement>(null)
  const settingsButtonRef = useRef<HTMLButtonElement>(null)

  return (
    <section className="toolbar" aria-label="Toolbar">
      <button
        ref={themeButtonRef}
        className="app-button"
        type="button"
        aria-haspopup="dialog"
        aria-expanded={themePopoverOpen}
        onClick={() => setThemePopoverOpen(true)}
      >
        <span className="button-label">Theme</span>
        <span className="button-status">
          {activePreset[0].toUpperCase() + activePreset.slice(1)}
        </span>
      </button>

      <button
        ref={noteDisplayButtonRef}
        className="app-button"
        type="button"
        aria-haspopup="dialog"
        aria-expanded={noteDisplayPopoverOpen}
        onClick={() => setNoteDisplayPopoverOpen(true)}
      >
        <span className="button-label">Display Settings</span>
        <span className="button-status">
          {noteDisplayMode === 'hidden'
            ? 'Off'
            : noteDisplayMode === 'letter'
              ? 'Letter'
              : 'Solfege'}
        </span>
      </button>

      <button
        ref={practiceButtonRef}
        className="app-button"
        type="button"
        aria-haspopup="dialog"
        aria-expanded={practicePopoverOpen}
        onClick={() => setPracticePopoverOpen(true)}
      >
        <span className="button-label">Practice</span>
        <span className="button-status">
          {practiceSelection === 'note-practice'
            ? practiceSettings.practiceType === 'chord'
              ? 'Chord Practice'
              : 'Practice'
            : 'Free Play'}
        </span>
      </button>

      <button className="app-button" type="button" disabled>
        <span className="button-label">Metronome</span>
        <span className="button-status">Disabled</span>
      </button>

      <button
        ref={settingsButtonRef}
        className="app-button"
        type="button"
        aria-haspopup="dialog"
        aria-expanded={settingsPopoverOpen}
        onClick={() => setSettingsPopoverOpen(true)}
      >
        <span className="button-label">Settings</span>
        <span className="button-status">
          {settings.autoSave ? 'Auto Save' : 'Manual Save'}
        </span>
      </button>

      <ThemePopover
        isOpen={themePopoverOpen}
        anchorRef={themeButtonRef}
        mode={themeMode}
        activePreset={activePreset}
        tokens={themeTokens}
        noteColorMode={noteColorMode}
        onClose={() => setThemePopoverOpen(false)}
        onModeChange={onThemeModeChange}
        onTokenChange={onThemeTokenChange}
        onNoteColorModeChange={onNoteColorModeChange}
        onReset={onThemeReset}
      />

      <NoteDisplaySettings
        isOpen={noteDisplayPopoverOpen}
        mode={noteDisplayMode}
        anchorRef={noteDisplayButtonRef}
        onClose={() => setNoteDisplayPopoverOpen(false)}
        onModeChange={onNoteDisplayModeChange}
      />

      <PracticePopover
        isOpen={practicePopoverOpen}
        selection={practiceSelection}
        settings={practiceSettings}
        anchorRef={practiceButtonRef}
        onClose={() => setPracticePopoverOpen(false)}
        onSelectionChange={onPracticeSelectionChange}
        onSettingsChange={onPracticeSettingsChange}
      />

      <SettingsPopover
        isOpen={settingsPopoverOpen}
        anchorRef={settingsButtonRef}
        settings={settings}
        themeTokens={themeTokens}
        onClose={() => setSettingsPopoverOpen(false)}
        onAutoSaveChange={onAutoSaveChange}
        onSoundChange={onSoundChange}
        onThemeModeChange={onThemeModeChange}
        onThemeTokenChange={onThemeTokenChange}
        onNoteColorModeChange={onNoteColorModeChange}
        onLabelModeChange={onLabelModeChange}
        onNoteDisplayModeChange={onNoteDisplayModeChange}
        onPracticeSettingsChange={onPracticeSettingsChange}
        onSaveSettings={onSaveSettings}
        onResetSettings={onResetSettings}
      />
    </section>
  )
}

export default Toolbar
