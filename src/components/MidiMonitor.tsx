import { useEffect, useRef, useState } from 'react'
import {
  connectMidiInput,
  isWebMidiSupported,
  listMidiInputs,
  parseMidiNoteMessage,
  requestMidiAccess,
  type MidiInputInfo,
} from '../midi/webMidi'

type MidiAccessStatus =
  | "idle"
  | "requesting"
  | "ready"
  | "unsupported"
  | "denied"
  | "error"

interface MidiMonitorProps {
  isOpen: boolean
  onClose: () => void
  onConnectionChange: (deviceName: string | null) => void
}

function statusText(status: MidiAccessStatus) {
  switch (status) {
    case "requesting":
      return "Requesting MIDI permission..."
    case "ready":
      return "MIDI access granted"
    case "unsupported":
      return "Web MIDI is not supported in this browser."
    case "denied":
      return "MIDI permission was denied."
    case "error":
      return "Unable to access MIDI devices."
    default:
      return "MIDI access has not been requested."
  }
}

function MidiMonitor({
  isOpen,
  onClose,
  onConnectionChange,
}: MidiMonitorProps) {
  const [status, setStatus] = useState<MidiAccessStatus>(() =>
    isWebMidiSupported() ? "idle" : "unsupported",
  )
  const [errorMessage, setErrorMessage] = useState("")
  const [midiAccess, setMidiAccess] = useState<MIDIAccess | null>(null)
  const [inputs, setInputs] = useState<MidiInputInfo[]>([])
  const [selectedInputId, setSelectedInputId] = useState("")
  const [connectedInputId, setConnectedInputId] = useState("")
  const disconnectActiveInput = useRef<(() => Promise<void>) | null>(null)

  useEffect(() => {
    return () => {
      void disconnectActiveInput.current?.()
    }
  }, [])

  useEffect(() => {
    if (!midiAccess) {
      return
    }

    const updateInputs = () => {
      const nextInputs = listMidiInputs(midiAccess)
      setInputs(nextInputs)
      setSelectedInputId(currentId =>
        nextInputs.some(input => input.id === currentId) ? currentId : "",
      )

      if (
        connectedInputId &&
        !nextInputs.some(input => input.id === connectedInputId)
      ) {
        void disconnectActiveInput.current?.()
        disconnectActiveInput.current = null
        setConnectedInputId("")
        onConnectionChange(null)
      }
    }

    updateInputs()
    midiAccess.addEventListener("statechange", updateInputs)

    return () => {
      midiAccess.removeEventListener("statechange", updateInputs)
    }
  }, [connectedInputId, midiAccess, onConnectionChange])

  async function handleRequestAccess() {
    if (!isWebMidiSupported()) {
      setStatus("unsupported")
      return
    }

    setStatus("requesting")
    setErrorMessage("")

    try {
      const access = await requestMidiAccess()
      setMidiAccess(access)
      setInputs(listMidiInputs(access))
      setStatus("ready")
    } catch (error) {
      const errorName = error instanceof DOMException ? error.name : "UnknownError"
      setStatus(errorName === "NotAllowedError" ? "denied" : "error")
      setErrorMessage(`MIDI access failed: ${errorName}`)
    }
  }

  async function handleConnectSelectedInput() {
    const selectedInput = inputs.find(input => input.id === selectedInputId)

    if (!selectedInput) {
      return
    }

    setErrorMessage("")

    try {
      const disconnectPreviousInput = disconnectActiveInput.current
      disconnectActiveInput.current = null
      await disconnectPreviousInput?.()
      setConnectedInputId("")
      onConnectionChange(null)

      const disconnect = await connectMidiInput(
        selectedInput.input,
        event => {
          if (!event.data) {
            return
          }

          const message = parseMidiNoteMessage(event.data)

          if (message) {
            console.log("[MIDI Monitor]", message)
          }
        },
      )

      disconnectActiveInput.current = disconnect
      setConnectedInputId(selectedInput.id)
      onConnectionChange(selectedInput.name)
    } catch (error) {
      const errorName = error instanceof DOMException ? error.name : "UnknownError"
      setErrorMessage(`MIDI connection failed: ${errorName}`)
      onConnectionChange(null)
    }
  }

  if (!isOpen) {
    return null
  }

  return (
    <section className="midi-monitor-panel" aria-label="MIDI Monitor">
      <div className="midi-monitor-header">
        <h2>MIDI Monitor</h2>
        <button className="toolbar-control" type="button" onClick={onClose}>
          Close
        </button>
      </div>

      <p className="midi-status">{statusText(status)}</p>

      {errorMessage && <p className="midi-error">{errorMessage}</p>}

      {status === "unsupported" && (
        <p>Use a supported desktop browser such as Chrome or Edge.</p>
      )}

      {(status === "idle" || status === "denied" || status === "error") && (
        <button
          className="toolbar-control"
          type="button"
          onClick={handleRequestAccess}
        >
          Request MIDI Access
        </button>
      )}

      {status === "ready" && (
        <>
          {inputs.length === 0 ? (
            <p>No MIDI Input devices found.</p>
          ) : (
            <>
              <table className="midi-device-table">
                <thead>
                  <tr>
                    <th>Select</th>
                    <th>Device Name</th>
                    <th>Manufacturer</th>
                    <th>Connection State</th>
                  </tr>
                </thead>
                <tbody>
                  {inputs.map(input => (
                    <tr key={input.id}>
                      <td>
                        <input
                          type="radio"
                          name="midi-input"
                          value={input.id}
                          checked={selectedInputId === input.id}
                          onChange={() => setSelectedInputId(input.id)}
                          aria-label={`Select ${input.name}`}
                        />
                      </td>
                      <td>{input.name}</td>
                      <td>{input.manufacturer}</td>
                      <td>{input.state}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <button
                className="toolbar-control"
                type="button"
                disabled={!selectedInputId}
                onClick={handleConnectSelectedInput}
              >
                Connect Selected Input
              </button>
            </>
          )}
        </>
      )}

      {connectedInputId && (
        <p className="midi-monitor-note">
          Note On / Note Off messages are logged to the browser Console.
        </p>
      )}
    </section>
  )
}

export default MidiMonitor
