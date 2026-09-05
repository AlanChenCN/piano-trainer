import { useMemo } from 'react'
import { midiNumberToPianoNote } from '../data/piano'
import { getStaffNotePosition, getLedgerLineSteps } from '../data/staff'
import { notationSegments } from './notation'
import { scoreLength, type ScoreDocument } from './scoreModel'

interface Props { score: ScoreDocument; selected: string | null; beat: number; playing: boolean; onSelect: (id: string) => void; onEnd: () => void }
export default function ScoreStaff({ score, selected, beat, playing, onSelect, onEnd }: Props) {
  const { segments, widths, xs, offset, width, eventById } = useMemo(() => {
    const segments = notationSegments(score)
    const widths = segments.map(segment => Math.max(88, segment.pitches.length * 18 + 36, segment.duration * 54))
    const xs = [100]
    for (const width of widths) xs.push(xs[xs.length - 1] + width)
    const offset = xs[xs.length - 1]
    return { segments, widths, xs, offset, width: Math.max(800, offset + 80), eventById: new Map(score.events.map(event => [event.id, event])) }
  }, [score])
  const activeIndex = segments.findIndex(segment => beat >= segment.beat && beat < segment.beat + segment.duration)
  const playX = activeIndex < 0 ? offset : xs[activeIndex] + (beat - segments[activeIndex].beat) / segments[activeIndex].duration * widths[activeIndex]
  const notation = useMemo(() => <g>
      {[170, 270].map(bottom => <g key={bottom} stroke="var(--theme-staff-color)" strokeWidth="1">
        {[0, 1, 2, 3, 4].map(line => <line key={line} x1="20" x2={width - 20} y1={bottom - line * 12} y2={bottom - line * 12} />)}
      </g>)}
      <g fill="var(--theme-staff-color)" fontFamily="Segoe UI Symbol, serif">
        <text x="24" y="164" fontSize="62">𝄞</text><text x="24" y="265" fontSize="54">𝄢</text>
        <text x="70" y="141" fontSize="24">4</text><text x="70" y="165" fontSize="24">4</text>
        <text x="70" y="241" fontSize="24">4</text><text x="70" y="265" fontSize="24">4</text>
      </g>
      {!segments.length && <text x="180" y="205" fill="var(--theme-text-color)" fontSize="18">在底部琴键试音，然后点击「写入音符」</text>}
      {segments.map((segment, index) => {
        const x = xs[index] + Math.max(30, segment.pitches.length * 10 + 12)
        const chosen = selected === segment.eventId
        const event = eventById.get(segment.eventId)!
        const label = `${segment.beat + 1} 拍：${segment.pitches.map(pitch => midiNumberToPianoNote(pitch)?.name).join('、') || '休止符'}，${event.duration} 拍`
        return <g key={`${segment.eventId}-${segment.beat}`}>
          {segment.beat % 4 === 0 && <g fill="var(--theme-text-color)" stroke="var(--theme-border-color)">
            <line x1={xs[index] - 8} x2={xs[index] - 8} y1="116" y2="276" />
            <text x={xs[index]} y="36" stroke="none" fontSize="13">{segment.beat / 4 + 1}</text>
          </g>}
          <g role="button" tabIndex={0} aria-label={label} aria-pressed={chosen} onClick={() => onSelect(segment.eventId)} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(segment.eventId) } }} className="score-note-target">
            <title>{label}</title>
            <rect x={xs[index] - 4} y="4" width={widths[index] - 4} height="360" rx="8" fill={chosen ? 'var(--theme-accent-background)' : 'transparent'} stroke={chosen ? 'var(--theme-accent-color)' : 'transparent'} />
            <g pointerEvents="none" fill={chosen ? 'var(--theme-accent-color)' : 'var(--theme-heading-color)'} stroke={chosen ? 'var(--theme-accent-color)' : 'var(--theme-heading-color)'}>
              {!segment.pitches.length && <text x={x - 8} y="155" stroke="none" fontSize="30" fontFamily="Segoe UI Symbol, serif">{segment.duration === 4 ? '𝄻' : segment.duration === 2 ? '𝄼' : segment.duration === 1 ? '𝄽' : segment.duration === .5 ? '𝄾' : '𝄿'}</text>}
              {segment.pitches.map((pitch, noteIndex) => {
                const note = midiNumberToPianoNote(pitch)!
                const position = getStaffNotePosition(note)
                const bottom = position.staff === 'treble' ? 170 : 270
                const y = bottom - position.staffStep * 6
                const previous = midiNumberToPianoNote(segment.pitches[noteIndex - 1])
                const nearPrevious = previous && Math.abs(getStaffNotePosition(previous).staffStep - position.staffStep) <= 1 && getStaffNotePosition(previous).staff === position.staff
                const staffPositions = segment.pitches.map(value => getStaffNotePosition(midiNumberToPianoNote(value)!)).filter(value => value.staff === position.staff)
                const topStep = Math.max(...staffPositions.map(value => value.staffStep))
                const bottomStep = Math.min(...staffPositions.map(value => value.staffStep))
                const stemDown = (topStep + bottomStep) / 2 >= 4
                const nx = x + (nearPrevious && noteIndex % 2 ? (stemDown ? -13 : 13) : 0)
                const stemX = x + (stemDown ? -7 : 7)
                const stemEnd = stemDown ? bottom - bottomStep * 6 + 33 : bottom - topStep * 6 - 33
                const topNote = position.staffStep === topStep && !segment.pitches.slice(noteIndex + 1).some(value => {
                  const other = getStaffNotePosition(midiNumberToPianoNote(value)!)
                  return other.staff === position.staff && other.staffStep === topStep
                })
                return <g key={pitch}>
                  {getLedgerLineSteps(position.staffStep).map(step => <line key={step} x1={nx - 13} x2={nx + 13} y1={bottom - step * 6} y2={bottom - step * 6} />)}
                  {!segment.tiedFrom && <text x={x - 17 - noteIndex * 10} y={y + 5} fontSize="17" stroke="none">{note.type === 'black' ? '♯' : '♮'}</text>}
                  <ellipse cx={nx} cy={y} rx={segment.duration === 4 ? 10 : 8} ry="5.5" transform={`rotate(-15 ${nx} ${y})`} fill={segment.duration >= 2 ? 'var(--theme-score-background)' : undefined} strokeWidth="1.8" />
                  {segment.duration < 4 && topNote && <line x1={stemX} x2={stemX} y1={stemDown ? y + 2 : bottom - bottomStep * 6 - 2} y2={stemEnd} strokeWidth="1.5" />}
                  {segment.duration < 1 && topNote && <path d={`M ${stemX} ${stemEnd} q 17 ${stemDown ? -9 : 9} 8 ${stemDown ? -21 : 21}`} fill="none" strokeWidth="2.5" />}
                  {segment.duration === .25 && topNote && <path d={`M ${stemX} ${stemEnd + (stemDown ? -8 : 8)} q 17 ${stemDown ? -9 : 9} 8 ${stemDown ? -21 : 21}`} fill="none" strokeWidth="2.5" />}
                  {segment.tiedTo && <path d={`M ${nx + 5} ${y + 9} Q ${nx + widths[index] / 2} ${y + 25} ${x + widths[index] - 5} ${y + 9}`} fill="none" strokeWidth="1.5" />}
                </g>
              })}
            </g>
            <text x={xs[index] + 6} y="382" fill="var(--theme-text-color)" fontSize="12">{segment.duration} 拍{segment.tiedFrom && segment.pitches.length ? ' · 延音' : ''}</text>
          </g>
        </g>
      })}
      <g role="button" tabIndex={0} aria-label="在末尾继续写入" onClick={onEnd} onKeyDown={e => { if (e.key === 'Enter') onEnd() }} className="score-note-target">
        <rect x={offset} y="110" width="52" height="174" rx="8" fill={selected === null ? 'var(--theme-accent-background)' : 'transparent'} />
        <text x={offset + 17} y="207" fill="var(--theme-accent-color)" fontSize="24">+</text>
      </g>
    </g>, [segments, widths, xs, offset, width, eventById, selected, onSelect, onEnd])
  return <div className="score-paper" aria-label="乐谱五线谱，可横向滚动">
    <svg width={width} height="410" viewBox={`0 0 ${width} 410`} role="group" aria-label="4/4 乐谱">
      {notation}
      {scoreLength(score) > 0 && <line x1={playX} x2={playX} y1="48" y2="357" stroke="var(--theme-note-color)" strokeWidth="2" strokeDasharray={playing ? undefined : '5 5'} pointerEvents="none" />}
    </svg>
  </div>
}
