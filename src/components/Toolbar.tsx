import type { PianoLabelMode } from '../data/piano'

interface ToolbarProps {
  soundEnabled: boolean
  labelMode: PianoLabelMode
  onSoundChange: (enabled: boolean) => void
  onLabelModeChange: (mode: PianoLabelMode) => void
}


function Toolbar({
  soundEnabled,
  labelMode,
  onSoundChange,
  onLabelModeChange,
}: ToolbarProps) {
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

      <label className="label-control">
        Key Labels
        <select
          value={labelMode}
          onChange={event =>
            onLabelModeChange(event.target.value as PianoLabelMode)
          }
        >
          <option value="hidden">Hidden</option>
          <option value="white">White Keys</option>
          <option value="c">C Notes</option>
          <option value="all">All</option>
        </select>
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
