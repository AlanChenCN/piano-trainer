import type { PianoLabelMode } from '../data/piano'
import {
  keyboardRangeIndex,
  keyboardRanges,
  type KeyboardRange,
} from '../input/keyboardMapper'

interface ToolbarProps {
  soundEnabled: boolean
  labelMode: PianoLabelMode
  keyboardRange: KeyboardRange
  onSoundChange: (enabled: boolean) => void
  onLabelModeChange: (mode: PianoLabelMode) => void
  onKeyboardRangeChange: (range: KeyboardRange) => void
}


function Toolbar({
  soundEnabled,
  labelMode,
  keyboardRange,
  onSoundChange,
  onLabelModeChange,
  onKeyboardRangeChange,
}: ToolbarProps) {
  const currentRangeIndex = keyboardRangeIndex(keyboardRange)

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

      <div className="keyboard-range-control" aria-label="Keyboard Range">
        <span>Keyboard Range</span>
        <button
          className="toolbar-arrow"
          type="button"
          aria-label="Previous keyboard range"
          disabled={currentRangeIndex <= 0}
          onClick={() =>
            onKeyboardRangeChange(keyboardRanges[currentRangeIndex - 1].value)
          }
        >
          ←
        </button>
        <output className="keyboard-range-value">{keyboardRange}</output>
        <button
          className="toolbar-arrow"
          type="button"
          aria-label="Next keyboard range"
          disabled={currentRangeIndex >= keyboardRanges.length - 1}
          onClick={() =>
            onKeyboardRangeChange(keyboardRanges[currentRangeIndex + 1].value)
          }
        >
          →
        </button>
      </div>

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
