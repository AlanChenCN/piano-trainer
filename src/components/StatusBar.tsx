import type { KeyboardRange } from '../input/keyboardMapper'

interface StatusBarProps {
  keyboardRange: KeyboardRange
}

function StatusBar({ keyboardRange }: StatusBarProps) {
  return (
    <footer className="status-bar">
      Ready | Keyboard: {keyboardRange} | v0.2.0-dev
    </footer>
  )
}

export default StatusBar
