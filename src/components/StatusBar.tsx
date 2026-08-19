import {
  keyboardRangeLabel,
  type KeyboardBaseNote,
} from '../input/keyboardMapper'

interface StatusBarProps {
  keyboardBaseNote: KeyboardBaseNote
  midiDeviceName: string | null
  bluetoothMidiDeviceName: string | null
}

function StatusBar({
  keyboardBaseNote,
  midiDeviceName,
  bluetoothMidiDeviceName,
}: StatusBarProps) {
  const connectedDevices = [
    midiDeviceName ? `🎹 ${midiDeviceName} Connected` : null,
    bluetoothMidiDeviceName
      ? `Bluetooth MIDI: ${bluetoothMidiDeviceName} Connected`
      : null,
  ].filter((device): device is string => device !== null)
  const midiStatus = connectedDevices.length
    ? connectedDevices.join(" | ")
    : "MIDI: Not Connected"
  const statusItems = [
    "Ready",
    `Keyboard: ${keyboardRangeLabel(keyboardBaseNote)}`,
    `Base: ${keyboardBaseNote}`,
    midiStatus,
    "v0.4.0-dev",
  ]

  return (
    <footer className="status-bar">
      {statusItems.map((item, index) => (
        <span className="status-item" key={`${item}-${index}`}>
          {index > 0 && (
            <span className="status-separator" aria-hidden="true">|</span>
          )}
          <span>{item}</span>
        </span>
      ))}
    </footer>
  )
}

export default StatusBar
