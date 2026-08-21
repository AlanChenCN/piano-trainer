import { midiNumberToPianoNote } from '../data/piano'
import type { MidiNoteMessage } from '../midi/midiMessage'
import type { NoteEventSource } from '../music/noteEvent'
import { InputLayer } from './inputLayer'

/**
 * Shared MIDI note behavior for each independent MIDI input source.
 */
export class MidiNoteController {
  private readonly activeNotes = new Map<number, string>()
  private readonly inputLayer: InputLayer
  private readonly source: NoteEventSource

  constructor(inputLayer: InputLayer, source: NoteEventSource) {
    this.inputLayer = inputLayer
    this.source = source
  }

  handleMessage = (message: MidiNoteMessage) => {
    const note = midiNumberToPianoNote(message.noteNumber)

    if (!note) {
      return
    }

    if (message.type === "Note On" && message.velocity > 0) {
      if (this.activeNotes.has(message.noteNumber)) {
        return
      }

      this.activeNotes.set(message.noteNumber, note.name)
      this.inputLayer.pressNote(note.name, {
        source: this.source,
        velocity: message.velocity,
      })
      return
    }

    const activeNoteName = this.activeNotes.get(message.noteNumber)

    if (!activeNoteName) {
      return
    }

    this.activeNotes.delete(message.noteNumber)
    this.inputLayer.releaseNote(activeNoteName, { source: this.source })
  }

  reset = () => {
    for (const noteName of this.activeNotes.values()) {
      this.inputLayer.releaseNote(noteName, { source: this.source })
    }

    this.activeNotes.clear()
  }
}
