import { durations, type ScoreDocument } from './scoreModel'
export function notationSegments(score: ScoreDocument) {
  return score.events.flatMap(event => {
    const segments: { eventId: string; beat: number; duration: number; pitches: number[]; tiedFrom: boolean; tiedTo: boolean }[] = []
    let remaining = event.duration
    let beat = event.startBeat
    while (remaining > 0) {
      const available = Math.min(remaining, 4 - beat % 4)
      const duration = [...durations].reverse().find(value => value <= available)!
      segments.push({ eventId: event.id, beat, duration, pitches: event.pitches, tiedFrom: beat > event.startBeat, tiedTo: remaining > duration })
      remaining -= duration; beat += duration
    }
    return segments
  })
}
