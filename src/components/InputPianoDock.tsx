import type { PianoLabelMode } from '../data/piano'
import {
  keyboardBaseNotes,
  keyboardRangeLabel,
  shiftKeyboardBaseNote,
  type KeyboardBaseNote,
} from '../input/keyboardMapper'
import InputDeviceButton, {
  type InputConnectionState,
} from './InputDeviceButton'
import Piano from './Piano'

interface InputPianoDockProps {
  pressedNotes: string[]
  labelMode: PianoLabelMode
  onPress: (noteName: string) => void
  onRelease: (noteName: string) => void
  keyboardBaseNote: KeyboardBaseNote
  onKeyboardBaseNoteChange: (baseNote: KeyboardBaseNote) => void
  midiConnectionState: InputConnectionState
  midiDeviceName: string | null
  onMidiConnect: () => void
  bluetoothConnectionState: InputConnectionState
  bluetoothMidiDeviceName: string | null
  onBluetoothConnect: () => void
}

function InputPianoDock({
  pressedNotes,
  labelMode,
  onPress,
  onRelease,
  keyboardBaseNote,
  onKeyboardBaseNoteChange,
  midiConnectionState,
  midiDeviceName,
  onMidiConnect,
  bluetoothConnectionState,
  bluetoothMidiDeviceName,
  onBluetoothConnect,
}: InputPianoDockProps) {
  const lowerBaseNote = shiftKeyboardBaseNote(keyboardBaseNote, -12)
  const higherBaseNote = shiftKeyboardBaseNote(keyboardBaseNote, 12)

  return (
    <div className="piano-dock input-piano-dock" aria-label="Input and Piano Dock">
      <div className="piano-dock-inner">
        <div className="input-controls" role="toolbar" aria-label="Input controls">
          <div className="keyboard-base-control input-dock-control">
            <span className="input-control-label">Keyboard Base</span>
            <button
              className="app-button keyboard-base-arrow"
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
              onChange={event =>
                onKeyboardBaseNoteChange(event.target.value as KeyboardBaseNote)
              }
            >
              {keyboardBaseNotes.map(baseNote => (
                <option key={baseNote} value={baseNote}>
                  {baseNote}
                </option>
              ))}
            </select>
            <button
              className="app-button keyboard-base-arrow"
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
            <span className="keyboard-range">
              Range: {keyboardRangeLabel(keyboardBaseNote)}
            </span>
          </div>

          <InputDeviceButton
            label="USB MIDI"
            state={midiConnectionState}
            deviceName={midiDeviceName}
            onClick={onMidiConnect}
          />

          <InputDeviceButton
            label="Bluetooth"
            state={bluetoothConnectionState}
            deviceName={bluetoothMidiDeviceName}
            onClick={onBluetoothConnect}
          />
        </div>

        <Piano
          pressedNotes={pressedNotes}
          labelMode={labelMode}
          onPress={onPress}
          onRelease={onRelease}
        />
      </div>
    </div>
  )
}

export default InputPianoDock
