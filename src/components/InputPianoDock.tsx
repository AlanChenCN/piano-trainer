import { useRef, useState, type RefObject } from 'react'
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
import KeyLabelsModal from './KeyLabelsModal'
import Piano from './Piano'

interface InputPianoDockProps {
  pressedNotes: string[]
  labelMode: PianoLabelMode
  onLabelModeChange: (mode: PianoLabelMode) => void
  onPress: (noteName: string) => void
  onRelease: (noteName: string) => void
  keyboardBaseNote: KeyboardBaseNote
  onKeyboardBaseNoteChange: (baseNote: KeyboardBaseNote) => void
  midiButtonRef: RefObject<HTMLButtonElement | null>
  midiConnectionState: InputConnectionState
  midiDeviceName: string | null
  onMidiConnect: () => void
  bluetoothButtonRef: RefObject<HTMLButtonElement | null>
  bluetoothConnectionState: InputConnectionState
  bluetoothMidiDeviceName: string | null
  onBluetoothConnect: () => void
}

function labelModeText(labelMode: PianoLabelMode) {
  switch (labelMode) {
    case 'hidden':
      return 'Hidden'
    case 'white':
      return 'White Keys'
    case 'c':
      return 'C Notes'
    default:
      return 'All'
  }
}

function InputPianoDock({
  pressedNotes,
  labelMode,
  onLabelModeChange,
  onPress,
  onRelease,
  keyboardBaseNote,
  onKeyboardBaseNoteChange,
  midiButtonRef,
  midiConnectionState,
  midiDeviceName,
  onMidiConnect,
  bluetoothButtonRef,
  bluetoothConnectionState,
  bluetoothMidiDeviceName,
  onBluetoothConnect,
}: InputPianoDockProps) {
  const [keyLabelsPopoverOpen, setKeyLabelsPopoverOpen] = useState(false)
  const keyLabelsButtonRef = useRef<HTMLButtonElement>(null)
  const lowerBaseNote = shiftKeyboardBaseNote(keyboardBaseNote, -12)
  const higherBaseNote = shiftKeyboardBaseNote(keyboardBaseNote, 12)

  return (
    <div className="piano-dock input-piano-dock" aria-label="Input and Piano Dock">
      <div className="piano-dock-inner">
        <div className="input-controls" role="toolbar" aria-label="Input controls">
          <div className="input-control-group input-control-group-left">
            <div className="keyboard-base-control input-dock-control">
              <span className="button-label">Keyboard Base</span>
              <button
                className="app-button app-button--compact keyboard-base-arrow"
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
                className="app-button app-button--compact keyboard-base-arrow"
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

            <button
              ref={keyLabelsButtonRef}
              className="app-button"
              type="button"
              aria-haspopup="dialog"
              aria-expanded={keyLabelsPopoverOpen}
              onClick={() => setKeyLabelsPopoverOpen(true)}
            >
              <span className="button-label">Key Labels</span>
              <span className="button-status">{labelModeText(labelMode)}</span>
            </button>

            <div className="keyboard-range" aria-label="Keyboard Range">
              <span className="button-label">Keyboard Range</span>
              <span className="button-status">
                {keyboardRangeLabel(keyboardBaseNote)}
              </span>
            </div>
          </div>

          <div className="input-control-group input-control-group-right">
            <InputDeviceButton
              ref={midiButtonRef}
              label="USB MIDI"
              state={midiConnectionState}
              deviceName={midiDeviceName}
              onClick={onMidiConnect}
            />

            <InputDeviceButton
              ref={bluetoothButtonRef}
              label="Bluetooth"
              state={bluetoothConnectionState}
              deviceName={bluetoothMidiDeviceName}
              onClick={onBluetoothConnect}
            />
          </div>
        </div>

        <Piano
          pressedNotes={pressedNotes}
          labelMode={labelMode}
          onPress={onPress}
          onRelease={onRelease}
        />
      </div>

      <KeyLabelsModal
        isOpen={keyLabelsPopoverOpen}
        labelMode={labelMode}
        anchorRef={keyLabelsButtonRef}
        onClose={() => setKeyLabelsPopoverOpen(false)}
        onLabelModeChange={onLabelModeChange}
      />
    </div>
  )
}

export default InputPianoDock
