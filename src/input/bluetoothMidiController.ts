import { parseBleMidiPacket } from '../midi/bleMidiParser'
import { connectBluetoothMidi } from '../midi/webBluetooth'
import { InputLayer } from './inputLayer'
import { MidiNoteController } from './midiNoteController'

type BluetoothConnectionChangeHandler = (deviceName: string | null) => void

/**
 * Owns the Bluetooth MIDI connection and translates notifications into the
 * shared MIDI note controller.
 */
export class BluetoothMidiController {
  private readonly midiNoteController: MidiNoteController
  private disconnectActiveConnection: (() => Promise<void>) | null = null
  private onConnectionChange: BluetoothConnectionChangeHandler | null = null

  constructor(inputLayer: InputLayer) {
    this.midiNoteController = new MidiNoteController(inputLayer)
  }

  connect = async (onConnectionChange: BluetoothConnectionChangeHandler) => {
    this.onConnectionChange = onConnectionChange
    await this.disconnect()

    const connection = await connectBluetoothMidi(
      this.handleData,
      this.handleDisconnected,
    )

    this.disconnectActiveConnection = connection.disconnect
    onConnectionChange(connection.deviceName)

    return connection.deviceName
  }

  disconnect = async () => {
    const disconnect = this.disconnectActiveConnection
    this.disconnectActiveConnection = null
    await disconnect?.()
    this.reset()

    if (disconnect) {
      this.onConnectionChange?.(null)
    }
  }

  handleData = (data: DataView) => {
    const messages = parseBleMidiPacket(data)

    for (const message of messages) {
      this.midiNoteController.handleMessage(message)
    }
  }

  reset = () => {
    this.midiNoteController.reset()
  }

  private handleDisconnected = () => {
    this.disconnectActiveConnection = null
    this.reset()
    this.onConnectionChange?.(null)
  }
}
