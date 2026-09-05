/** Musical time is measured in quarter-note beats, independent of notation. */
export interface ScoreEvent {
  id: string
  startBeat: number
  duration: number
  pitches: number[] // MIDI pitches; empty means a rest, all pitches share duration.
}
export interface ScoreDocument {
  version: 1
  title: string
  tempo: number
  timeSignature: [number, number]
  events: ScoreEvent[]
}
export const timeSignaturePresets = [[2, 4], [3, 4], [4, 4], [5, 4], [6, 8], [9, 8], [12, 8]] as const
export const measureBeats = ([numerator, denominator]: [number, number]) => numerator * 4 / denominator
export function isSupportedTimeSignature(value: unknown): value is [number, number] {
  return Array.isArray(value) && value.length === 2 && timeSignaturePresets.some(([numerator, denominator]) => value[0] === numerator && value[1] === denominator)
}
export const durations = [0.25, 0.5, 1, 2, 4] as const
export const durationLabels = ['十六分', '八分', '四分', '二分', '全音符']
export const createScore = (): ScoreDocument => ({
  version: 1, title: '未命名乐谱', tempo: 90, timeSignature: [4, 4], events: [],
})
export const scoreLength = (score: ScoreDocument) => score.events.reduce((end, event) => Math.max(end, event.startBeat + event.duration), 0)
export function reflow(events: ScoreEvent[]): ScoreEvent[] {
  let beat = 0
  return events.map(event => {
    const next = { ...event, startBeat: beat }
    beat += event.duration
    return next
  })
}
export function insertEvent(score: ScoreDocument, index: number, pitches: number[], duration: number): ScoreDocument {
  const events = [...score.events]
  events.splice(index, 0, { id: crypto.randomUUID(), startBeat: 0, duration, pitches: [...new Set(pitches)].sort((a, b) => a - b) })
  return { ...score, events: reflow(events) }
}
export function replaceEvent(score: ScoreDocument, id: string, patch: Partial<Pick<ScoreEvent, 'pitches' | 'duration'>>): ScoreDocument {
  return { ...score, events: reflow(score.events.map(event => event.id === id ? { ...event, ...patch } : event)) }
}
export function deleteEvent(score: ScoreDocument, id: string): ScoreDocument {
  return { ...score, events: reflow(score.events.filter(event => event.id !== id)) }
}
export function parseScore(text: string): ScoreDocument {
  if (text.length > 2_000_000) throw new Error('文件过大，请使用小于 2 MB 的乐谱。')
  const value = JSON.parse(text.replace(/^\uFEFF/, ''))
  if (!value || value.version !== 1 || typeof value.title !== 'string' || value.title.length > 120 ||
      !Number.isFinite(value.tempo) || value.tempo < 30 || value.tempo > 240 ||
      !isSupportedTimeSignature(value.timeSignature) ||
      !Array.isArray(value.events) || value.events.length > 2000) throw new Error('乐谱格式无效或版本不支持。')
  const ids = new Set<string>()
  let end = 0
  for (const event of value.events) {
    if (!event || typeof event.id !== 'string' || !event.id || ids.has(event.id) ||
        !durations.includes(event.duration) || event.startBeat !== end ||
        !Array.isArray(event.pitches) || event.pitches.length > 12 ||
        event.pitches.some((pitch: unknown) => typeof pitch !== 'number' || !Number.isInteger(pitch) || pitch < 21 || pitch > 108) ||
        new Set(event.pitches).size !== event.pitches.length) throw new Error('音符数据无效：需为连续单声部、A0–C8 音域的乐谱。')
    ids.add(event.id)
    end += event.duration
  }
  // Only retain documented fields from imported files.
  return { version: 1, title: value.title, tempo: value.tempo, timeSignature: [value.timeSignature[0], value.timeSignature[1]],
    events: value.events.map((event: ScoreEvent) => ({ id: event.id, startBeat: event.startBeat, duration: event.duration, pitches: [...event.pitches].sort((a, b) => a - b) })) }
}
export function soundingPitches(score: ScoreDocument, beat: number): number[] {
  return score.events.find(event => beat >= event.startBeat && beat < event.startBeat + event.duration)?.pitches ?? []
}
