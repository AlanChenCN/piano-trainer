export interface MidiInputInfo {
  id: string
  name: string
  manufacturer: string
  state: string
  connection: string
  input: MIDIInput
}

export interface MidiNoteMessage {
  type: "Note On" | "Note Off"
  status: string
  channel: number
  noteNumber: number
  velocity: number
}

export function isWebMidiSupported() {
  return (
    typeof navigator !== "undefined" &&
    typeof navigator.requestMIDIAccess === "function"
  )
}

export function requestMidiAccess() {
  return navigator.requestMIDIAccess()
}

export function listMidiInputs(access: MIDIAccess): MidiInputInfo[] {
  return Array.from(access.inputs.values()).map(input => ({
    id: input.id,
    name: input.name ?? "Unknown MIDI Device",
    manufacturer: input.manufacturer ?? "Unknown Manufacturer",
    state: input.state,
    connection: input.connection,
    input,
  }))
}

export async function connectMidiInput(
  input: MIDIInput,
  onMessage: (event: MIDIMessageEvent) => void,
) {
  input.onmidimessage = onMessage

  try {
    await input.open()
  } catch (error) {
    input.onmidimessage = null
    throw error
  }

  return async () => {
    input.onmidimessage = null

    if (input.connection !== "closed") {
      await input.close()
    }
  }
}

export function parseMidiNoteMessage(
  data: Uint8Array,
): MidiNoteMessage | null {
  const statusByte = data[0]
  const noteNumber = data[1]
  const velocity = data[2]

  if (
    statusByte === undefined ||
    noteNumber === undefined ||
    velocity === undefined
  ) {
    return null
  }

  const command = statusByte & 0xf0
  const type =
    command === 0x80 || (command === 0x90 && velocity === 0)
      ? "Note Off"
      : command === 0x90 && velocity > 0
        ? "Note On"
        : null

  if (!type) {
    return null
  }

  return {
    type,
    status: `0x${statusByte.toString(16).padStart(2, "0")}`,
    channel: (statusByte & 0x0f) + 1,
    noteNumber,
    velocity,
  }
}
