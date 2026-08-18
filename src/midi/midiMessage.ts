export interface MidiNoteMessage {
  type: "Note On" | "Note Off"
  status: string
  channel: number
  noteNumber: number
  velocity: number
}
