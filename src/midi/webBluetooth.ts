export const BLE_MIDI_SERVICE_UUID =
  "03b80e5a-ede8-4b33-a751-6ce34ec4c700"
export const BLE_MIDI_CHARACTERISTIC_UUID =
  "7772e5db-3868-4112-a1a9-f2669d106bf3"

interface BluetoothRemoteGATTCharacteristicLike extends EventTarget {
  value?: DataView | null
  startNotifications: () => Promise<BluetoothRemoteGATTCharacteristicLike>
}

interface BluetoothRemoteGATTServiceLike {
  getCharacteristic: (
    uuid: string,
  ) => Promise<BluetoothRemoteGATTCharacteristicLike>
}

interface BluetoothRemoteGATTServerLike {
  getPrimaryService: (uuid: string) => Promise<BluetoothRemoteGATTServiceLike>
}

interface BluetoothDeviceLike extends EventTarget {
  name?: string | null
  gatt?: {
    connected: boolean
    connect: () => Promise<BluetoothRemoteGATTServerLike>
    disconnect: () => void
  }
}

interface BluetoothLike {
  requestDevice: (options: {
    filters: Array<{ services: string[] }>
  }) => Promise<BluetoothDeviceLike>
}

declare global {
  interface Navigator {
    bluetooth?: BluetoothLike
  }
}

export interface BluetoothMidiConnection {
  deviceName: string
  disconnect: () => Promise<void>
}

export function isWebBluetoothSupported() {
  return (
    typeof navigator !== "undefined" &&
    "bluetooth" in navigator &&
    typeof navigator.bluetooth?.requestDevice === "function" &&
    typeof isSecureContext !== "undefined" &&
    isSecureContext
  )
}

export async function connectBluetoothMidi(
  onData: (data: DataView) => void,
  onDisconnected: () => void,
): Promise<BluetoothMidiConnection> {
  const bluetooth = navigator.bluetooth

  if (!bluetooth) {
    throw new Error("WEB_BLUETOOTH_UNAVAILABLE")
  }

  const device = await bluetooth.requestDevice({
    filters: [{ services: [BLE_MIDI_SERVICE_UUID] }],
  })

  if (!device.gatt) {
    throw new Error("GATT_UNAVAILABLE")
  }

  let characteristic: BluetoothRemoteGATTCharacteristicLike | undefined

  try {
    const server = await device.gatt.connect()
    const service = await server.getPrimaryService(BLE_MIDI_SERVICE_UUID)
    characteristic = await service.getCharacteristic(
      BLE_MIDI_CHARACTERISTIC_UUID,
    )
  } catch (error) {
    device.gatt.disconnect()
    throw error
  }

  if (!characteristic) {
    device.gatt.disconnect()
    throw new Error("BLE_MIDI_CHARACTERISTIC_UNAVAILABLE")
  }

  const handleValueChanged = (event: Event) => {
    const value = (event.target as BluetoothRemoteGATTCharacteristicLike | null)
      ?.value

    if (value) {
      onData(value)
    }
  }

  let closed = false
  const handleDisconnected = () => {
    if (closed) {
      return
    }

    closed = true
    onDisconnected()
  }

  characteristic.addEventListener(
    "characteristicvaluechanged",
    handleValueChanged,
  )
  device.addEventListener("gattserverdisconnected", handleDisconnected)

  try {
    await characteristic.startNotifications()
  } catch (error) {
    characteristic.removeEventListener(
      "characteristicvaluechanged",
      handleValueChanged,
    )
    device.removeEventListener("gattserverdisconnected", handleDisconnected)
    device.gatt.disconnect()
    throw error
  }

  return {
    deviceName: device.name ?? "Unknown Bluetooth MIDI Device",
    disconnect: async () => {
      if (closed) {
        return
      }

      closed = true
      characteristic.removeEventListener(
        "characteristicvaluechanged",
        handleValueChanged,
      )
      device.removeEventListener("gattserverdisconnected", handleDisconnected)

      if (device.gatt?.connected) {
        device.gatt.disconnect()
      }
    },
  }
}
