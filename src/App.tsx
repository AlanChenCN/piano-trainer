import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react'
import GrandStaff from './components/GrandStaff'
import Header from './components/Header'
import BluetoothMidiPanel from './components/BluetoothMidiPanel'
import InputPianoDock from './components/InputPianoDock'
import type { InputConnectionState } from './components/InputDeviceButton'
import MidiMonitor from './components/MidiMonitor'
import type { NoteDisplayMode } from './music/noteDisplay'
import StatusBar from './components/StatusBar'
import Toolbar from './components/Toolbar'
import type { ConfigurableThemeToken } from './components/ThemePopover'
import { setAudioEnabled, startNote, stopNote } from './audio/sound'
import {
  pianoNoteToMidiNumber,
  pianoNotes,
  type PianoLabelMode,
} from './data/piano'
import {
  InputLayer,
  type InputNoteContext,
} from './input/inputLayer'
import { KeyboardController } from './input/keyboardController'
import { MidiInputController } from './input/midiController'
import { BluetoothMidiController } from './input/bluetoothMidiController'
import {
  defaultKeyboardBaseNote,
  type KeyboardBaseNote,
} from './input/keyboardMapper'
import {
  applyThemeToDocument,
  createThemeSettings,
  getSystemThemePreset,
  resolveThemeDisplayPreset,
  resolveThemeTokens,
  selectThemeMode,
  updateThemeToken,
  type ThemePreset,
  type ThemeMode,
} from './theme/theme'
import { NoteEventFactory } from './music/noteEvent'
import { PracticeController } from './practice/practiceController'
import './App.css'

function App() {
  const [pressedNotes, setPressedNotes] = useState<string[]>([])
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [labelMode, setLabelMode] = useState<PianoLabelMode>("white")
  const [noteDisplayMode, setNoteDisplayMode] =
    useState<NoteDisplayMode>('letter')
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
  const midiButtonRef = useRef<HTMLButtonElement>(null)
  const bluetoothButtonRef = useRef<HTMLButtonElement>(null)
  const [systemThemePreset, setSystemThemePreset] = useState<ThemePreset>(
    getSystemThemePreset,
  )
  const [themeSettings, setThemeSettings] = useState(() =>
    createThemeSettings(getSystemThemePreset()),
  )
  const themeTokens = useMemo(
    () => resolveThemeTokens(themeSettings, systemThemePreset),
    [systemThemePreset, themeSettings],
  )
  const activeThemePreset = resolveThemeDisplayPreset(
    themeSettings.mode,
    systemThemePreset,
  )

  const [keyboardBaseNote, setKeyboardBaseNote] = useState<KeyboardBaseNote>(
    defaultKeyboardBaseNote,
  )
  const noteEventFactory = useMemo(() => new NoteEventFactory(), [])
  const practiceController = useMemo(() => new PracticeController(), [])
  const practiceSnapshot = useSyncExternalStore(
    practiceController.subscribe,
    practiceController.getSnapshot,
    practiceController.getSnapshot,
  )

  const pressNote = useCallback((
    noteName: string,
    context: InputNoteContext = { source: 'mouse' },
  ) => {
    const note = pianoNotes.find(item => item.name === noteName)

    if (!note) {
      return
    }

    const event = noteEventFactory.create({
      note,
      source: context.source,
      velocity: context.velocity,
    })

    if (event) {
      practiceController.handleNoteEvent(event)
    }

    setPressedNotes(prev => {
      if (prev.includes(noteName)) {
        return prev
      }

      return [...prev, noteName]
    })

    startNote(note.name, note.frequency)
  }, [noteEventFactory, practiceController])

  const releaseNote = useCallback((
    noteName: string,
    context: InputNoteContext = { source: 'mouse' },
  ) => {
    const note = pianoNotes.find(item => item.name === noteName)

    if (note) {
      const midiNumber = pianoNoteToMidiNumber(note)

      if (midiNumber !== undefined) {
        noteEventFactory.close({
          midiNumber,
          source: context.source,
        })
      }
    }

    setPressedNotes(prev => prev.filter(item => item !== noteName))
    stopNote(noteName)
  }, [noteEventFactory])

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

  const pressMouseNote = useCallback(
    (noteName: string) => inputLayer.pressNote(noteName, { source: 'mouse' }),
    [inputLayer],
  )

  const releaseMouseNote = useCallback(
    (noteName: string) => inputLayer.releaseNote(noteName, { source: 'mouse' }),
    [inputLayer],
  )

  const handleThemeModeChange = useCallback(
    (mode: ThemeMode) => {
      setThemeSettings(settings =>
        selectThemeMode(settings, mode, systemThemePreset),
      )
    },
    [systemThemePreset],
  )

  const handleThemeTokenChange = useCallback(
    (token: ConfigurableThemeToken, value: string) => {
      setThemeSettings(settings =>
        updateThemeToken(settings, token, value, systemThemePreset),
      )
    },
    [systemThemePreset],
  )

  const handleNoteColorModeChange = useCallback(
    (mode: 'single' | 'left-right') => {
      setThemeSettings(settings => ({ ...settings, noteColorMode: mode }))
    },
    [],
  )

  const handleThemeReset = useCallback(() => {
    setThemeSettings(createThemeSettings(systemThemePreset))
  }, [systemThemePreset])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleSystemThemeChange = (event: MediaQueryListEvent) => {
      setSystemThemePreset(event.matches ? 'dark' : 'light')
    }

    mediaQuery.addEventListener('change', handleSystemThemeChange)

    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange)
    }
  }, [])

  useEffect(() => {
    applyThemeToDocument(themeTokens)
  }, [themeTokens])

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
      noteEventFactory.reset()
      practiceController.selectMode('free-play')
    }
  }, [
    bluetoothMidiController,
    midiInputController,
    noteEventFactory,
    practiceController,
  ])

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
        themeMode={themeSettings.mode}
        activePreset={activeThemePreset}
        themeTokens={themeTokens}
        noteColorMode={themeSettings.noteColorMode}
        onThemeModeChange={handleThemeModeChange}
        onThemeTokenChange={handleThemeTokenChange}
        onNoteColorModeChange={handleNoteColorModeChange}
        onThemeReset={handleThemeReset}
        noteDisplayMode={noteDisplayMode}
        onNoteDisplayModeChange={setNoteDisplayMode}
        practiceSelection={practiceSnapshot.selection}
        practiceSettings={practiceSnapshot.settings}
        onPracticeSelectionChange={practiceController.selectMode}
        onPracticeSettingsChange={practiceController.updateSettings}
      />

      <main className="main-content">
        <GrandStaff
          pressedNotes={pressedNotes}
          targetNotes={
            practiceSnapshot.session?.currentTask?.targetNotes ?? []
          }
          practicePhrase={practiceSnapshot.session?.phrase ?? null}
          currentTargetIndex={
            practiceSnapshot.session?.cursor.noteIndex ?? -1
          }
          noteDisplayMode={noteDisplayMode}
          practiceNoteNameMode={practiceSnapshot.settings.noteNameMode}
        />

        <StatusBar
          keyboardBaseNote={keyboardBaseNote}
          midiDeviceName={midiDeviceName}
          bluetoothMidiDeviceName={bluetoothMidiDeviceName}
        />
      </main>

      <InputPianoDock
        pressedNotes={pressedNotes}
        labelMode={labelMode}
        onLabelModeChange={handleLabelModeChange}
        soundEnabled={soundEnabled}
        onSoundChange={handleSoundChange}
        onPress={pressMouseNote}
        onRelease={releaseMouseNote}
        keyboardBaseNote={keyboardBaseNote}
        onKeyboardBaseNoteChange={setKeyboardBaseNote}
        midiButtonRef={midiButtonRef}
        midiConnectionState={midiConnectionState}
        midiDeviceName={midiDeviceName}
        onMidiConnect={() => setMidiPanelOpen(true)}
        bluetoothButtonRef={bluetoothButtonRef}
        bluetoothConnectionState={bluetoothConnectionState}
        bluetoothMidiDeviceName={bluetoothMidiDeviceName}
        onBluetoothConnect={() => setBluetoothPanelOpen(true)}
      />

      <MidiMonitor
        isOpen={midiPanelOpen}
        onClose={() => setMidiPanelOpen(false)}
        anchorRef={midiButtonRef}
        onConnectionChange={handleMidiConnectionChange}
        onConnectionStateChange={setMidiConnectionState}
        onMidiMessage={midiInputController.handleMessage}
      />

      <BluetoothMidiPanel
        isOpen={bluetoothPanelOpen}
        onClose={() => setBluetoothPanelOpen(false)}
        anchorRef={bluetoothButtonRef}
        onConnect={handleBluetoothConnect}
        onDisconnect={handleBluetoothDisconnect}
        connectedDeviceName={bluetoothMidiDeviceName}
        onConnectionStateChange={setBluetoothConnectionState}
      />
    </div>
  )
}

export default App
