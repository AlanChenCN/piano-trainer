import { useState } from 'react'
import { isWebBluetoothSupported } from '../midi/webBluetooth'

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
  onConnect: () => Promise<string>
  onDisconnect: () => Promise<void>
  connectedDeviceName: string | null
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
  onConnect,
  onDisconnect,
  connectedDeviceName,
}: BluetoothMidiPanelProps) {
  const [status, setStatus] = useState<BluetoothStatus>(() =>
    isWebBluetoothSupported() ? "idle" : "unsupported",
  )
  const [errorMessage, setErrorMessage] = useState("")

  async function handleConnect() {
    if (!isWebBluetoothSupported()) {
      setStatus("unsupported")
      return
    }

    setStatus("connecting")
    setErrorMessage("")

    try {
      await onConnect()
      setStatus("connected")
    } catch (error) {
      const errorName = error instanceof DOMException ? error.name : "UnknownError"
      setStatus(errorName === "NotFoundError" ? "idle" : "error")
      setErrorMessage(`Bluetooth connection failed: ${errorName}`)
    }
  }

  async function handleDisconnect() {
    await onDisconnect()
    setStatus("disconnected")
  }

  if (!isOpen) {
    return null
  }

  const currentStatus = connectedDeviceName
    ? "connected"
    : status === "connected"
      ? "disconnected"
      : status

  return (
    <section className="bluetooth-midi-panel" aria-label="Bluetooth MIDI">
      <div className="bluetooth-midi-header">
        <h2>Bluetooth MIDI</h2>
        <button className="toolbar-control" type="button" onClick={onClose}>
          Close
        </button>
      </div>

      <p className="midi-status">{statusText(currentStatus)}</p>

      {connectedDeviceName && <p>Device: {connectedDeviceName}</p>}
      {errorMessage && <p className="midi-error">{errorMessage}</p>}

      {status === "unsupported" && (
        <p>Use a supported desktop browser such as Chrome or Edge over HTTPS.</p>
      )}

      {currentStatus !== "unsupported" && currentStatus !== "connected" && (
        <button
          className="toolbar-control"
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
          className="toolbar-control"
          type="button"
          onClick={handleDisconnect}
        >
          Disconnect
        </button>
      )}
    </section>
  )
}

export default BluetoothMidiPanel
