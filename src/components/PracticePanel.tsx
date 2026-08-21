import { noteDisplayLabel } from '../music/noteDisplay'
import type {
  PracticeResult,
  PracticeSession,
} from '../practice/practiceTypes'
import PracticeTimeline from './PracticeTimeline'

interface PracticePanelProps {
  session: PracticeSession
  lastResult: PracticeResult | null
}

function PracticePanel({ session, lastResult }: PracticePanelProps) {
  const timeline = session.timeline
  const targetNote = session.currentTask?.targetNotes[0]

  if (!timeline || !targetNote) {
    return null
  }

  const feedback = lastResult
    ? lastResult.correct
      ? 'Correct'
      : 'Try Again'
    : 'Ready'
  const feedbackClass = lastResult
    ? lastResult.correct
      ? 'practice-feedback--correct'
      : 'practice-feedback--incorrect'
    : ''

  return (
    <section className="practice-panel" aria-label="Note Practice">
      <div className="practice-panel-header">
        <div>
          <span className="practice-panel-title">Note Practice</span>
          <span className="practice-panel-target">
            Target: {noteDisplayLabel(targetNote, 'letter')}
          </span>
        </div>
        <span className={`practice-feedback ${feedbackClass}`}>
          {feedback}
        </span>
      </div>

      <PracticeTimeline timeline={timeline} cursor={session.cursor} />
    </section>
  )
}

export default PracticePanel
