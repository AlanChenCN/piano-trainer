import { useRef, useState } from 'react'
import ThemePopover, {
  type ConfigurableThemeToken,
} from './ThemePopover'
import type {
  NoteColorMode,
  ThemeDisplayPreset,
  ThemeMode,
  ThemeTokens,
} from '../theme/theme'

interface ToolbarProps {
  themeMode: ThemeMode
  activePreset: ThemeDisplayPreset
  themeTokens: ThemeTokens
  noteColorMode: NoteColorMode
  onThemeModeChange: (mode: ThemeMode) => void
  onThemeTokenChange: (token: ConfigurableThemeToken, value: string) => void
  onNoteColorModeChange: (mode: NoteColorMode) => void
  onThemeReset: () => void
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
}: ToolbarProps) {
  const [themePopoverOpen, setThemePopoverOpen] = useState(false)
  const themeButtonRef = useRef<HTMLButtonElement>(null)

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

      <button className="app-button" type="button" disabled>
        <span className="button-label">Practice</span>
        <span className="button-status">Disabled</span>
      </button>

      <button className="app-button" type="button" disabled>
        <span className="button-label">Metronome</span>
        <span className="button-status">Disabled</span>
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
    </section>
  )
}

export default Toolbar
