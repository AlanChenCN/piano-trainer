import { useRef, useState, type RefObject } from 'react'
import type { PianoLabelMode } from '../data/piano'
import {
  keyboardRangeLabel,
  shiftKeyboardBaseNote,
  type KeyboardBaseNote,
} from '../input/keyboardMapper'
import InputDeviceButton, {
  type InputConnectionState,
} from './InputDeviceButton'
import KeyboardBaseModal from './KeyboardBaseModal'
import KeyLabelsModal from './KeyLabelsModal'
import Piano from './Piano'

interface InputPianoDockProps {
  pressedNotes: string[]
  labelMode: PianoLabelMode
  onLabelModeChange: (mode: PianoLabelMode) => void
  soundEnabled: boolean
  onSoundChange: (enabled: boolean) => void
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
    case 'letter':
    case 'c':
      return 'Letter'
    case 'solfege':
      return 'Solfege'
    default:
      return 'All'
  }
}

function InputPianoDock({
  pressedNotes,
  labelMode,
  onLabelModeChange,
  soundEnabled,
  onSoundChange,
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
  const [keyboardBasePopoverOpen, setKeyboardBasePopoverOpen] = useState(false)
  const [keyLabelsPopoverOpen, setKeyLabelsPopoverOpen] = useState(false)
  const keyboardBaseButtonRef = useRef<HTMLButtonElement>(null)
  const keyLabelsButtonRef = useRef<HTMLButtonElement>(null)
  const lowerBaseNote = shiftKeyboardBaseNote(keyboardBaseNote, -12)
  const higherBaseNote = shiftKeyboardBaseNote(keyboardBaseNote, 12)

  return (
    <div className="piano-dock input-piano-dock" aria-label="Input and Piano Dock">
      <div className="piano-dock-inner">
        <div className="input-controls" role="toolbar" aria-label="Input controls">
          <div className="input-control-group input-control-group-left">
            <div
              className="keyboard-mapping-control input-dock-control"
              aria-label="Keyboard Mapping"
            >
              <span className="button-label">Keyboard Mapping</span>
              <div className="keyboard-mapping-row">
                <button
                  className="app-button app-button--compact keyboard-mapping-button keyboard-mapping-arrow"
                  type="button"
                  aria-label="Lower keyboard base by one octave"
                  disabled={lowerBaseNote === keyboardBaseNote}
                  onClick={() =>
                    onKeyboardBaseNoteChange(
                      shiftKeyboardBaseNote(keyboardBaseNote, -12),
                    )
                  }
                >
                  ◀
                </button>
                <button
                  ref={keyboardBaseButtonRef}
                  className="app-button app-button--compact keyboard-mapping-button keyboard-mapping-range-button"
                  type="button"
                  aria-label={`Keyboard Mapping Range: ${keyboardRangeLabel(
                    keyboardBaseNote,
                  )}`}
                  aria-haspopup="dialog"
                  aria-expanded={keyboardBasePopoverOpen}
                  data-active={keyboardBasePopoverOpen}
                  onClick={() => setKeyboardBasePopoverOpen(true)}
                >
                  {keyboardRangeLabel(keyboardBaseNote)}
                </button>
                <button
                  className="app-button app-button--compact keyboard-mapping-button keyboard-mapping-arrow"
                  type="button"
                  aria-label="Raise keyboard base by one octave"
                  disabled={higherBaseNote === keyboardBaseNote}
                  onClick={() =>
                    onKeyboardBaseNoteChange(
                      shiftKeyboardBaseNote(keyboardBaseNote, 12),
                    )
                  }
                >
                  ▶
                </button>
              </div>
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
          </div>

          <div className="input-control-group input-control-group-right">
            <button
              className="app-button"
              type="button"
              aria-pressed={soundEnabled}
              data-active={soundEnabled}
              onClick={() => onSoundChange(!soundEnabled)}
            >
              <span className="button-label">Web Sound</span>
              <span className="button-status">
                {soundEnabled ? 'On' : 'Off'}
              </span>
            </button>

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

      <KeyboardBaseModal
        isOpen={keyboardBasePopoverOpen}
        keyboardBaseNote={keyboardBaseNote}
        anchorRef={keyboardBaseButtonRef}
        onClose={() => setKeyboardBasePopoverOpen(false)}
        onKeyboardBaseNoteChange={onKeyboardBaseNoteChange}
      />

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
