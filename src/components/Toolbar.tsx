import type { PianoLabelMode } from '../data/piano'
import {
  keyboardBaseNotes,
  shiftKeyboardBaseNote,
  type KeyboardBaseNote,
} from '../input/keyboardMapper'

interface ToolbarProps {
  soundEnabled: boolean
  labelMode: PianoLabelMode
  keyboardBaseNote: KeyboardBaseNote
  onSoundChange: (enabled: boolean) => void
  onLabelModeChange: (mode: PianoLabelMode) => void
  onKeyboardBaseNoteChange: (baseNote: KeyboardBaseNote) => void
  onMidiConnect: () => void
}


function Toolbar({
  soundEnabled,
  labelMode,
  keyboardBaseNote,
  onSoundChange,
  onLabelModeChange,
  onKeyboardBaseNoteChange,
  onMidiConnect,
}: ToolbarProps) {
  const lowerBaseNote = shiftKeyboardBaseNote(keyboardBaseNote, -12)
  const higherBaseNote = shiftKeyboardBaseNote(keyboardBaseNote, 12)

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

      <div className="keyboard-base-control" aria-label="Keyboard Base Note">
        <span>Keyboard Base</span>
        <button
          className="toolbar-arrow"
          type="button"
          aria-label="Lower keyboard base by one octave"
          disabled={lowerBaseNote === keyboardBaseNote}
          onClick={() =>
            onKeyboardBaseNoteChange(
              shiftKeyboardBaseNote(keyboardBaseNote, -12),
            )
          }
        >
          ←
        </button>
        <select
          className="keyboard-base-select"
          value={keyboardBaseNote}
          aria-label="Keyboard base note"
          onChange={event => onKeyboardBaseNoteChange(event.target.value)}
        >
          {keyboardBaseNotes.map(baseNote => (
            <option key={baseNote} value={baseNote}>
              {baseNote}
            </option>
          ))}
        </select>
        <button
          className="toolbar-arrow"
          type="button"
          aria-label="Raise keyboard base by one octave"
          disabled={higherBaseNote === keyboardBaseNote}
          onClick={() =>
            onKeyboardBaseNoteChange(
              shiftKeyboardBaseNote(keyboardBaseNote, 12),
            )
          }
        >
          →
        </button>
      </div>

      <button className="toolbar-control" type="button" onClick={onMidiConnect}>
        MIDI Connect
      </button>

      <button className="toolbar-control" type="button" disabled>
        Metronome (Disabled)
      </button>
    </section>
  )
}

export default Toolbar
