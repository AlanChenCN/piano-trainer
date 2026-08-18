import {
  midiNumberToPianoNote,
} from '../data/piano'
import { InputLayer } from './inputLayer'
import {
  parseMidiNoteMessage,
  type MidiNoteMessage,
} from '../midi/webMidi'

/**
 * Converts MIDI messages into the shared Input Layer calls.
 * MIDI-specific state and cleanup stay outside the Input Layer.
 */
export class MidiInputController {
  private readonly activeNotes = new Map<number, string>()
  private readonly inputLayer: InputLayer

  constructor(inputLayer: InputLayer) {
    this.inputLayer = inputLayer
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
    this.handleNoteMessage(message)
  }

  reset = () => {
    for (const noteName of this.activeNotes.values()) {
      this.inputLayer.releaseNote(noteName)
    }

    this.activeNotes.clear()
  }

  private handleNoteMessage(message: MidiNoteMessage) {
    const note = midiNumberToPianoNote(message.noteNumber)

    if (!note) {
      return
    }

    if (message.type === "Note On") {
      if (this.activeNotes.has(message.noteNumber)) {
        return
      }

      this.activeNotes.set(message.noteNumber, note.name)
      this.inputLayer.pressNote(note.name)
      return
    }

    const activeNoteName = this.activeNotes.get(message.noteNumber)

    if (!activeNoteName) {
      return
    }

    this.activeNotes.delete(message.noteNumber)
    this.inputLayer.releaseNote(activeNoteName)
  }
}
