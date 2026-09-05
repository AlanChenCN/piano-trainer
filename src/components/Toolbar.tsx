import { useRef, useState } from 'react'
import type { NoteDisplayMode } from '../music/noteDisplay'
import type { PracticeSelection, PracticeSettings } from '../practice/practiceTypes'
import NoteDisplaySettings from './NoteDisplaySettings'
import PracticePopover from './PracticePopover'

interface ToolbarProps { noteDisplayMode: NoteDisplayMode; onNoteDisplayModeChange: (mode: NoteDisplayMode) => void; practiceSelection: PracticeSelection; practiceSettings: PracticeSettings; onPracticeSelectionChange: (selection: PracticeSelection) => void; onPracticeSettingsChange: (updates: Partial<PracticeSettings>) => void }

function Toolbar({ noteDisplayMode, onNoteDisplayModeChange, practiceSelection, practiceSettings, onPracticeSelectionChange, onPracticeSettingsChange }: ToolbarProps) {
  const [noteDisplayOpen, setNoteDisplayOpen] = useState(false); const [practiceOpen, setPracticeOpen] = useState(false)
  const noteDisplayButton = useRef<HTMLButtonElement>(null); const practiceButton = useRef<HTMLButtonElement>(null)
  return <section className="toolbar" aria-label="Trainer toolbar">
    <button ref={noteDisplayButton} className="app-button" type="button" aria-haspopup="dialog" aria-expanded={noteDisplayOpen} onClick={() => setNoteDisplayOpen(true)}><span className="button-label">Display Settings</span><span className="button-status">{noteDisplayMode === 'hidden' ? 'Off' : noteDisplayMode === 'letter' ? 'Letter' : 'Solfege'}</span></button>
    <button ref={practiceButton} className="app-button" type="button" aria-haspopup="dialog" aria-expanded={practiceOpen} onClick={() => setPracticeOpen(true)}><span className="button-label">Practice</span><span className="button-status">{practiceSelection === 'note-practice' ? practiceSettings.practiceType === 'chord' ? 'Chord Practice' : 'Practice' : 'Free Play'}</span></button>
    <button className="app-button" type="button" disabled><span className="button-label">Metronome</span><span className="button-status">Disabled</span></button>
    <NoteDisplaySettings isOpen={noteDisplayOpen} mode={noteDisplayMode} anchorRef={noteDisplayButton} onClose={() => setNoteDisplayOpen(false)} onModeChange={onNoteDisplayModeChange} />
    <PracticePopover isOpen={practiceOpen} selection={practiceSelection} settings={practiceSettings} anchorRef={practiceButton} onClose={() => setPracticeOpen(false)} onSelectionChange={onPracticeSelectionChange} onSettingsChange={onPracticeSettingsChange} />
  </section>
}
export default Toolbar
