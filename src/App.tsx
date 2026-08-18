import { useCallback, useEffect, useMemo, useState } from 'react'
import GrandStaff from './components/GrandStaff'
import Header from './components/Header'
import Piano from './components/Piano'
import StatusBar from './components/StatusBar'
import Toolbar from './components/Toolbar'
import { setAudioEnabled, startNote, stopNote } from './audio/sound'
import { pianoNotes, type PianoLabelMode } from './data/piano'
import { InputLayer } from './input/inputLayer'
import { KeyboardController } from './input/keyboardController'
import {
  defaultKeyboardRange,
  type KeyboardRange,
} from './input/keyboardMapper'
import './App.css'

function App() {
  const [pressedNotes, setPressedNotes] = useState<string[]>([])
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [labelMode, setLabelMode] = useState<PianoLabelMode>("all")

  const [keyboardRange, setKeyboardRange] = useState<KeyboardRange>(
    defaultKeyboardRange,
  )

  const pressNote = useCallback((noteName: string) => {
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
  }, [])

  const releaseNote = useCallback((noteName: string) => {
    setPressedNotes(prev => prev.filter(item => item !== noteName))
    stopNote(noteName)
  }, [])

  const inputLayer = useMemo(
    () => new InputLayer({ pressNote, releaseNote }),
    [pressNote, releaseNote],
  )

  const keyboardController = useMemo(
    () => new KeyboardController(inputLayer, defaultKeyboardRange),
    [inputLayer],
  )

  function handleSoundChange(enabled: boolean) {
    setSoundEnabled(enabled)
    setAudioEnabled(enabled)
  }

  function handleLabelModeChange(mode: PianoLabelMode) {
    setLabelMode(mode)
  }

  useEffect(() => {
    keyboardController.start()

    return () => {
      keyboardController.stop()
    }
  }, [keyboardController])

  useEffect(() => {
    keyboardController.setRange(keyboardRange)
  }, [keyboardController, keyboardRange])

  return (
    <div className="piano-trainer">
      <Header />

      <Toolbar
        soundEnabled={soundEnabled}
        labelMode={labelMode}
        keyboardRange={keyboardRange}
        onSoundChange={handleSoundChange}
        onLabelModeChange={handleLabelModeChange}
        onKeyboardRangeChange={setKeyboardRange}
      />

      <GrandStaff pressedNotes={pressedNotes} />

      <Piano
        pressedNotes={pressedNotes}
        labelMode={labelMode}
        onPress={inputLayer.pressNote}
        onRelease={inputLayer.releaseNote}
      />

      <StatusBar keyboardRange={keyboardRange} />
    </div>
  )
}

export default App
