export type InputConnectionState =
  | 'disconnected'
  | 'connecting'
  | 'connected'

interface InputDeviceButtonProps {
  label: string
  state: InputConnectionState
  deviceName: string | null
  onClick: () => void
}

function stateLabel(state: InputConnectionState) {
  switch (state) {
    case 'connecting':
      return 'Connecting'
    case 'connected':
      return 'Connected'
    default:
      return 'Disconnected'
  }
}

function InputDeviceButton({
  label,
  state,
  deviceName,
  onClick,
}: InputDeviceButtonProps) {
  const connectionLabel = stateLabel(state)

  return (
    <button
      className="app-button input-device-button"
      type="button"
      data-connection-state={state}
      aria-label={`${label}: ${connectionLabel}`}
      title={deviceName ? `${label}: ${deviceName}` : connectionLabel}
      onClick={onClick}
    >
      <span>{label}</span>
      <span
        className="input-device-indicator"
        aria-hidden="true"
      >
        ●
      </span>
      <span className="visually-hidden">{connectionLabel}</span>
    </button>
  )
}

export default InputDeviceButton
