import {
  pianoNoteToMidiNumber,
  type PianoNote,
} from '../data/piano'

export type NoteEventSource =
  | 'keyboard'
  | 'mouse'
  | 'usb-midi'
  | 'bluetooth-midi'

export interface RawNoteMessage {
  note: PianoNote
  source: NoteEventSource
  velocity?: number
}

export interface NoteEvent {
  id: string
  note: PianoNote
  midiNumber: number
  velocity?: number
  startTime: number
  endTime?: number
  duration?: number
  source: NoteEventSource
}

export interface NoteReleaseMessage {
  midiNumber: number
  source: NoteEventSource
}

function timestampNow() {
  return typeof performance === 'undefined' ? Date.now() : performance.now()
}

export function createNoteEvent(
  message: RawNoteMessage,
  id: string,
  startTime = timestampNow(),
): NoteEvent {
  const midiNumber = pianoNoteToMidiNumber(message.note)

  if (midiNumber === undefined) {
    throw new Error(`Cannot create a NoteEvent for ${message.note.name}`)
  }

  return {
    id,
    note: message.note,
    midiNumber,
    velocity: message.velocity,
    startTime,
    source: message.source,
  }
}

export function closeNoteEvent(
  event: NoteEvent,
  endTime = timestampNow(),
): NoteEvent {
  const normalizedEndTime = Math.max(endTime, event.startTime)

  return {
    ...event,
    endTime: normalizedEndTime,
    duration: normalizedEndTime - event.startTime,
  }
}

/**
 * Creates and closes NoteEvents for all input sources in one place.
 * Input controllers only provide raw note data and never own event lifetime.
 */
export class NoteEventFactory {
  private readonly activeEvents = new Map<string, NoteEvent>()
  private nextId = 1

  create = (message: RawNoteMessage, startTime?: number) => {
    const midiNumber = pianoNoteToMidiNumber(message.note)

    if (midiNumber === undefined) {
      return undefined
    }

    const key = this.keyFor(message.source, midiNumber)
    const existingEvent = this.activeEvents.get(key)

    if (existingEvent) {
      // An already active Note On does not start a second lifecycle. This
      // also prevents early input from being replayed after Practice Cursor
      // advances to a new target.
      return undefined
    }

    const event = createNoteEvent(
      message,
      `note-event-${this.nextId}`,
      startTime,
    )
    this.nextId += 1
    this.activeEvents.set(key, event)

    return event
  }

  close = (message: NoteReleaseMessage, endTime?: number) => {
    const key = this.keyFor(message.source, message.midiNumber)
    const event = this.activeEvents.get(key)

    if (!event) {
      return undefined
    }

    this.activeEvents.delete(key)
    return closeNoteEvent(event, endTime)
  }

  reset = () => {
    const events = Array.from(this.activeEvents.values())
    this.activeEvents.clear()
    return events.map(event => closeNoteEvent(event))
  }

  private keyFor(source: NoteEventSource, midiNumber: number) {
    return `${source}:${midiNumber}`
  }
}
