import {
  keyboardRangeLabel,
  type KeyboardBaseNote,
} from '../input/keyboardMapper'

interface StatusBarProps {
  keyboardBaseNote: KeyboardBaseNote
}

function StatusBar({ keyboardBaseNote }: StatusBarProps) {
  return (
    <footer className="status-bar">
      Ready | Keyboard: {keyboardRangeLabel(keyboardBaseNote)} | Base: {keyboardBaseNote} | v0.2.0-dev
    </footer>
  )
}

export default StatusBar
