import { InputLayer } from './inputLayer'
import { MidiNoteController } from './midiNoteController'
import {
  parseMidiNoteMessage,
} from '../midi/webMidi'

/**
 * Converts MIDI messages into the shared Input Layer calls.
 * MIDI-specific state and cleanup stay outside the Input Layer.
 */
export class MidiInputController {
  private readonly midiNoteController: MidiNoteController

  constructor(inputLayer: InputLayer) {
    this.midiNoteController = new MidiNoteController(inputLayer, 'usb-midi')
  }

  handleMessage = (event: MIDIMessageEvent) => {
    if (!event.data) {
      return
    }

    const message = parseMidiNoteMessage(event.data)

    if (!message) {
      return
    }

    console.log("[MIDI Monitor]", message)
    this.midiNoteController.handleMessage(message)
  }

  reset = () => {
    this.midiNoteController.reset()
  }
}
