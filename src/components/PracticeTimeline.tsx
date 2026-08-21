import { noteDisplayLabel } from '../music/noteDisplay'
import type {
  PracticeCursor,
  PracticeTimeline as PracticeTimelineData,
} from '../practice/practiceTypes'

interface PracticeTimelineProps {
  timeline: PracticeTimelineData
  cursor: PracticeCursor
}

function PracticeTimeline({ timeline, cursor }: PracticeTimelineProps) {
  return (
    <section className="practice-timeline" aria-label="Practice Timeline">
      <div className="practice-timeline-header">
        <span className="practice-timeline-title">Timeline</span>
        <span className="practice-timeline-meter">
          {timeline.timeSignature}
        </span>
      </div>

      <div className="practice-timeline-grid">
        {timeline.notes.map((timelineNote, index) => {
          const isCurrent = cursor.noteIndex === index

          return (
            <div
              key={timelineNote.id}
              className={`practice-timeline-cell${
                isCurrent ? ' practice-timeline-cell--current' : ''
              }`}
              aria-current={isCurrent ? 'step' : undefined}
            >
              <span className="practice-timeline-beat">{index + 1}</span>
              <span className="practice-timeline-note">
                {noteDisplayLabel(timelineNote.note, 'letter')}
              </span>
              {isCurrent && (
                <span className="practice-timeline-cursor" aria-hidden="true">
                  ▲
                </span>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default PracticeTimeline
