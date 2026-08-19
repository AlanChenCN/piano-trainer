import { useCallback, useEffect, useMemo, useState } from 'react'
import GrandStaff from './components/GrandStaff'
import Header from './components/Header'
import BluetoothMidiPanel from './components/BluetoothMidiPanel'
import InputPianoDock from './components/InputPianoDock'
import type { InputConnectionState } from './components/InputDeviceButton'
import MidiMonitor from './components/MidiMonitor'
import StatusBar from './components/StatusBar'
import Toolbar from './components/Toolbar'
import { setAudioEnabled, startNote, stopNote } from './audio/sound'
import { pianoNotes, type PianoLabelMode } from './data/piano'
import { InputLayer } from './input/inputLayer'
import { KeyboardController } from './input/keyboardController'
import { MidiInputController } from './input/midiController'
import { BluetoothMidiController } from './input/bluetoothMidiController'
import {
  defaultKeyboardBaseNote,
  type KeyboardBaseNote,
} from './input/keyboardMapper'
import './App.css'

function App() {
  const [pressedNotes, setPressedNotes] = useState<string[]>([])
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [labelMode, setLabelMode] = useState<PianoLabelMode>("all")
  const [midiPanelOpen, setMidiPanelOpen] = useState(false)
  const [midiDeviceName, setMidiDeviceName] = useState<string | null>(null)
  const [midiConnectionState, setMidiConnectionState] =
    useState<InputConnectionState>('disconnected')
  const [bluetoothPanelOpen, setBluetoothPanelOpen] = useState(false)
  const [bluetoothMidiDeviceName, setBluetoothMidiDeviceName] = useState<
    string | null
  >(null)
  const [bluetoothConnectionState, setBluetoothConnectionState] =
    useState<InputConnectionState>('disconnected')

  const [keyboardBaseNote, setKeyboardBaseNote] = useState<KeyboardBaseNote>(
    defaultKeyboardBaseNote,
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
    () => new KeyboardController(inputLayer, defaultKeyboardBaseNote),
    [inputLayer],
  )

  const midiInputController = useMemo(
    () => new MidiInputController(inputLayer),
    [inputLayer],
  )

  const bluetoothMidiController = useMemo(
    () => new BluetoothMidiController(inputLayer),
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
    keyboardController.setBaseNote(keyboardBaseNote)
  }, [keyboardController, keyboardBaseNote])

  useEffect(() => {
    return () => {
      midiInputController.reset()
      void bluetoothMidiController.disconnect()
    }
  }, [bluetoothMidiController, midiInputController])

  const handleMidiConnectionChange = useCallback(
    (deviceName: string | null) => {
      if (!deviceName) {
        midiInputController.reset()
      }

      setMidiDeviceName(deviceName)
    },
    [midiInputController],
  )

  const handleBluetoothConnectionChange = useCallback(
    (deviceName: string | null) => {
      setBluetoothMidiDeviceName(deviceName)
      setBluetoothConnectionState(
        deviceName ? 'connected' : 'disconnected',
      )
    },
    [],
  )

  const handleBluetoothConnect = useCallback(
    () => bluetoothMidiController.connect(handleBluetoothConnectionChange),
    [bluetoothMidiController, handleBluetoothConnectionChange],
  )

  const handleBluetoothDisconnect = useCallback(
    () => bluetoothMidiController.disconnect(),
    [bluetoothMidiController],
  )

  return (
    <div className="piano-trainer">
      <Header />

      <Toolbar
        soundEnabled={soundEnabled}
        labelMode={labelMode}
        onSoundChange={handleSoundChange}
        onLabelModeChange={handleLabelModeChange}
      />

      <main className="main-content">
        <GrandStaff pressedNotes={pressedNotes} />

        <StatusBar
          keyboardBaseNote={keyboardBaseNote}
          midiDeviceName={midiDeviceName}
          bluetoothMidiDeviceName={bluetoothMidiDeviceName}
        />
      </main>

      <InputPianoDock
        pressedNotes={pressedNotes}
        labelMode={labelMode}
        onPress={inputLayer.pressNote}
        onRelease={inputLayer.releaseNote}
        keyboardBaseNote={keyboardBaseNote}
        onKeyboardBaseNoteChange={setKeyboardBaseNote}
        midiConnectionState={midiConnectionState}
        midiDeviceName={midiDeviceName}
        onMidiConnect={() => setMidiPanelOpen(true)}
        bluetoothConnectionState={bluetoothConnectionState}
        bluetoothMidiDeviceName={bluetoothMidiDeviceName}
        onBluetoothConnect={() => setBluetoothPanelOpen(true)}
      />

      <MidiMonitor
        isOpen={midiPanelOpen}
        onClose={() => setMidiPanelOpen(false)}
        onConnectionChange={handleMidiConnectionChange}
        onConnectionStateChange={setMidiConnectionState}
        onMidiMessage={midiInputController.handleMessage}
      />

      <BluetoothMidiPanel
        isOpen={bluetoothPanelOpen}
        onClose={() => setBluetoothPanelOpen(false)}
        onConnect={handleBluetoothConnect}
        onDisconnect={handleBluetoothDisconnect}
        connectedDeviceName={bluetoothMidiDeviceName}
        onConnectionStateChange={setBluetoothConnectionState}
      />
    </div>
  )
}

export default App
