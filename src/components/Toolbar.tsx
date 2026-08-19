interface ToolbarProps {
  soundEnabled: boolean
  onSoundChange: (enabled: boolean) => void
}

function Toolbar({ soundEnabled, onSoundChange }: ToolbarProps) {
  return (
    <section className="toolbar" aria-label="Toolbar">
      <button className="app-button" type="button" disabled>
        <span className="button-label">Practice</span>
        <span className="button-status">Disabled</span>
      </button>

      <button
        className="app-button"
        type="button"
        aria-pressed={soundEnabled}
        data-active={soundEnabled}
        onClick={() => onSoundChange(!soundEnabled)}
      >
        <span className="button-label">Sound</span>
        <span className="button-status">{soundEnabled ? 'On' : 'Off'}</span>
      </button>

      <button className="app-button" type="button" disabled>
        <span className="button-label">Metronome</span>
        <span className="button-status">Disabled</span>
      </button>
    </section>
  )
}

export default Toolbar
