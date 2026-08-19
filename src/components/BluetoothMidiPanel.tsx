import { useState, type RefObject } from 'react'
import { isWebBluetoothSupported } from '../midi/webBluetooth'
import Modal from './Modal'
import type { InputConnectionState } from './InputDeviceButton'

type BluetoothStatus =
  | "idle"
  | "connecting"
  | "connected"
  | "disconnected"
  | "unsupported"
  | "error"

interface BluetoothMidiPanelProps {
  isOpen: boolean
  onClose: () => void
  anchorRef: RefObject<HTMLElement | null>
  onConnect: () => Promise<string>
  onDisconnect: () => Promise<void>
  connectedDeviceName: string | null
  onConnectionStateChange: (state: InputConnectionState) => void
}

function statusText(status: BluetoothStatus) {
  switch (status) {
    case "connecting":
      return "Scanning for BLE MIDI devices..."
    case "connected":
      return "Bluetooth MIDI connected"
    case "disconnected":
      return "Bluetooth MIDI disconnected"
    case "unsupported":
      return "Web Bluetooth is not supported in this browser."
    case "error":
      return "Unable to connect to the Bluetooth MIDI device."
    default:
      return "Bluetooth MIDI is not connected."
  }
}

function BluetoothMidiPanel({
  isOpen,
  onClose,
  anchorRef,
  onConnect,
  onDisconnect,
  connectedDeviceName,
  onConnectionStateChange,
}: BluetoothMidiPanelProps) {
  const [status, setStatus] = useState<BluetoothStatus>(() =>
    isWebBluetoothSupported() ? "idle" : "unsupported",
  )
  const [errorMessage, setErrorMessage] = useState("")

  async function handleConnect() {
    if (!isWebBluetoothSupported()) {
      setStatus("unsupported")
      onConnectionStateChange('disconnected')
      return
    }

    setStatus("connecting")
    setErrorMessage("")
    onConnectionStateChange('connecting')

    try {
      await onConnect()
      setStatus("connected")
      onConnectionStateChange('connected')
    } catch (error) {
      const errorName = error instanceof DOMException ? error.name : "UnknownError"
      setStatus(errorName === "NotFoundError" ? "idle" : "error")
      setErrorMessage(`Bluetooth connection failed: ${errorName}`)
      onConnectionStateChange('disconnected')
    }
  }

  async function handleDisconnect() {
    await onDisconnect()
    setStatus("disconnected")
    onConnectionStateChange('disconnected')
  }

  const currentStatus = connectedDeviceName
    ? "connected"
    : status === "connected"
      ? "disconnected"
      : status

  return (
    <Modal
      isOpen={isOpen}
      title="Bluetooth MIDI"
      anchorRef={anchorRef}
      placement="top"
      onClose={onClose}
    >
      <div className="bluetooth-midi-panel">
        <p className="midi-status">{statusText(currentStatus)}</p>

        {connectedDeviceName && <p>Device: {connectedDeviceName}</p>}
        {errorMessage && <p className="midi-error">{errorMessage}</p>}

        {status === "unsupported" && (
          <p>Use a supported desktop browser such as Chrome or Edge over HTTPS.</p>
        )}

        {currentStatus !== "unsupported" && currentStatus !== "connected" && (
          <button
            className="app-button app-button--compact"
            type="button"
            disabled={currentStatus === "connecting"}
            onClick={handleConnect}
          >
            {currentStatus === "connecting"
              ? "Scanning..."
              : "Scan and Connect BLE MIDI"}
          </button>
        )}

        {currentStatus === "connected" && (
          <button
            className="app-button app-button--compact"
            type="button"
            onClick={handleDisconnect}
          >
            Disconnect
          </button>
        )}

      </div>
    </Modal>
  )
}

export default BluetoothMidiPanel
