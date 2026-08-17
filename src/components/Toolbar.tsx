interface ToolbarProps {
  soundEnabled: boolean
  onSoundChange: (enabled: boolean) => void
}


function Toolbar({ soundEnabled, onSoundChange }: ToolbarProps) {
  return (
    <section className="toolbar" aria-label="Toolbar">
      <button className="toolbar-control" type="button" disabled>
        Practice Mode
      </button>

      <label className="sound-control">
        <input
          type="checkbox"
          checked={soundEnabled}
          onChange={event => onSoundChange(event.target.checked)}
        />
        Browser Sound
      </label>

      <button className="toolbar-control" type="button" disabled>
        MIDI (Disabled)
      </button>

      <button className="toolbar-control" type="button" disabled>
        Metronome (Disabled)
      </button>
    </section>
  )
}

export default Toolbar
