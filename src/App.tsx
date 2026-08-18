import { useState, useEffect, useRef } from 'react'
import GrandStaff from './components/GrandStaff'
import Header from './components/Header'
import Piano from './components/Piano'
import StatusBar from './components/StatusBar'
import Toolbar from './components/Toolbar'
import { setAudioEnabled, startNote, stopNote } from './audio/sound'
import { pianoNotes, type PianoLabelMode } from './data/piano'
import { keyboardMap } from './data/keyboard'
import './App.css'

function App() {
  const [pressedNotes, setPressedNotes] = useState<string[]>([])
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [labelMode, setLabelMode] = useState<PianoLabelMode>("all")

  const activeKeys = useRef<string[]>([])

  function pressNote(noteName: string) {
    const note = pianoNotes.find(item => item.name === noteName)

    if (!note) {
      return
    }

    setPressedNotes(prev => {
      if (prev.includes(noteName)) {
        return prev
      }

      return [...prev, noteName]
    })

    startNote(note.name, note.frequency)
  }

  function releaseNote(noteName: string) {
    setPressedNotes(prev => prev.filter(item => item !== noteName))
    stopNote(noteName)
  }

  function handleSoundChange(enabled: boolean) {
    setSoundEnabled(enabled)
    setAudioEnabled(enabled)
  }

  function handleLabelModeChange(mode: PianoLabelMode) {
    setLabelMode(mode)
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const key = event.key.toLowerCase()

      if (activeKeys.current.includes(key)) {
        return
      }

      const noteName = keyboardMap[key]

      if (noteName) {
        activeKeys.current.push(key)
        pressNote(noteName)
      }
    }

    function handleKeyUp(event: KeyboardEvent) {
      const key = event.key.toLowerCase()
      const noteName = keyboardMap[key]

      if (noteName) {
        releaseNote(noteName)

        activeKeys.current = activeKeys.current.filter(
          activeKey => activeKey !== key
        )
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [])

  return (
    <div className="piano-trainer">
      <Header />

      <Toolbar
        soundEnabled={soundEnabled}
        labelMode={labelMode}
        onSoundChange={handleSoundChange}
        onLabelModeChange={handleLabelModeChange}
      />

      <GrandStaff pressedNotes={pressedNotes} />

      <Piano
        pressedNotes={pressedNotes}
        labelMode={labelMode}
        onPress={pressNote}
        onRelease={releaseNote}
      />

      <StatusBar />
    </div>
  )
}

export default App
