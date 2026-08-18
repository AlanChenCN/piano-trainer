import {
  keyboardRangeLabel,
  type KeyboardBaseNote,
} from '../input/keyboardMapper'

interface StatusBarProps {
  keyboardBaseNote: KeyboardBaseNote
  midiDeviceName: string | null
}

function StatusBar({ keyboardBaseNote, midiDeviceName }: StatusBarProps) {
  const midiStatus = midiDeviceName
    ? `🎹 ${midiDeviceName} Connected`
    : "MIDI: Not Connected"

  return (
    <footer className="status-bar">
      Ready | Keyboard: {keyboardRangeLabel(keyboardBaseNote)} | Base: {keyboardBaseNote} | {midiStatus} | v0.2.0-dev
    </footer>
  )
}

export default StatusBar
