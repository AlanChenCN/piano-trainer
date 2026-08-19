import { forwardRef } from 'react'

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

const InputDeviceButton = forwardRef<
  HTMLButtonElement,
  InputDeviceButtonProps
>(function InputDeviceButton(
  { label, state, deviceName, onClick },
  ref,
) {
  const connectionLabel = stateLabel(state)

  return (
    <button
      ref={ref}
      className="app-button input-device-button"
      type="button"
      data-connection-state={state}
      aria-label={`${label}: ${connectionLabel}`}
      title={deviceName ? `${label}: ${deviceName}` : connectionLabel}
      onClick={onClick}
    >
      <span className="button-label">
        {label}
        <span className="input-device-indicator" aria-hidden="true">
          ●
        </span>
      </span>
      <span className="button-status">{connectionLabel}</span>
    </button>
  )
})

export default InputDeviceButton
