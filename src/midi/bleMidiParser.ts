import type { MidiNoteMessage } from './midiMessage'

function dataLengthForStatus(status: number) {
  const command = status & 0xf0

  if (command === 0xc0 || command === 0xd0) {
    return 1
  }

  if (command >= 0x80 && command <= 0xe0) {
    return 2
  }

  switch (status) {
    case 0xf1:
    case 0xf3:
      return 1
    case 0xf2:
      return 2
    case 0xf6:
    case 0xf8:
    case 0xf9:
    case 0xfa:
    case 0xfb:
    case 0xfc:
    case 0xfd:
    case 0xfe:
    case 0xff:
      return 0
    default:
      return undefined
  }
}

function isRealtimeStatus(status: number) {
  return status >= 0xf8
}

function toBytes(data: DataView | Uint8Array) {
  if (data instanceof Uint8Array) {
    return data
  }

  return new Uint8Array(data.buffer, data.byteOffset, data.byteLength)
}

/**
 * Parses a BLE MIDI event packet into the note messages used by the input layer.
 * Timestamps are consumed but intentionally not exposed because this issue does
 * not implement timing or recording behavior.
 */
export function parseBleMidiPacket(
  data: DataView | Uint8Array,
): MidiNoteMessage[] {
  const bytes = toBytes(data)

  if (bytes.length < 2 || (bytes[0] & 0x80) === 0) {
    return []
  }

  const messages: MidiNoteMessage[] = []
  let index = 1
  let runningStatus: number | undefined

  while (index < bytes.length) {
    const timestamp = bytes[index]
    index += 1

    if (timestamp === undefined || (timestamp & 0x80) === 0) {
      break
    }

    const statusOrData = bytes[index]
    index += 1

    if (statusOrData === undefined) {
      break
    }

    let status = statusOrData
    let firstDataByte: number | undefined

    if ((statusOrData & 0x80) === 0) {
      if (runningStatus === undefined) {
        continue
      }

      status = runningStatus
      firstDataByte = statusOrData
    } else if (statusOrData >= 0x80 && statusOrData <= 0xef) {
      runningStatus = statusOrData
    } else if (isRealtimeStatus(statusOrData)) {
      continue
    } else {
      runningStatus = undefined
    }

    const dataLength = dataLengthForStatus(status)

    if (dataLength === undefined) {
      break
    }

    const dataBytes: number[] = []

    if (firstDataByte !== undefined) {
      dataBytes.push(firstDataByte)
    }

    while (dataBytes.length < dataLength && index < bytes.length) {
      const dataByte = bytes[index]

      if (dataByte === undefined || (dataByte & 0x80) !== 0) {
        break
      }

      dataBytes.push(dataByte)
      index += 1
    }

    if (dataBytes.length !== dataLength) {
      break
    }

    const command = status & 0xf0

    if ((command !== 0x80 && command !== 0x90) || dataBytes.length < 2) {
      continue
    }

    const noteNumber = dataBytes[0]
    const velocity = dataBytes[1]

    if (noteNumber === undefined || velocity === undefined) {
      continue
    }

    messages.push({
      type: command === 0x90 && velocity > 0 ? "Note On" : "Note Off",
      status: `0x${status.toString(16).padStart(2, "0")}`,
      channel: (status & 0x0f) + 1,
      noteNumber,
      velocity,
    })
  }

  return messages
}
