import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react'
import ScoreEditor from './score/ScoreEditor'
import GrandStaff from './components/GrandStaff'
import Header from './components/Header'
import BluetoothMidiPanel from './components/BluetoothMidiPanel'
import InputPianoDock from './components/InputPianoDock'
import type { InputConnectionState } from './components/InputDeviceButton'
import MidiMonitor from './components/MidiMonitor'
import StatusBar from './components/StatusBar'
import Toolbar from './components/Toolbar'
import type { ConfigurableThemeToken } from './components/ThemePopover'
import { setAudioEnabled, startNote, stopNote } from './audio/sound'
import {
  midiNumberToPianoNote,
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
import { analyzeChord } from './music/chordAnalyzer'
import { PracticeController } from './practice/practiceController'
import {
  createPracticeSettings,
  type PracticeSettings,
} from './practice/practiceTypes'
import { useSettings } from './settings/useSettings'
import './App.css'

function App() {
  const {
    settings,
    updateSettings,
    saveCurrentSettings,
    resetSettings,
  } = useSettings()
  const [workspace, setWorkspace] = useState<'trainer' | 'score'>('trainer')
  const workspaceRef = useRef<'trainer' | 'score'>('trainer')
  const heldAudition = useRef(new Set<string>())
  const [audition, setAudition] = useState<number[]>([])
  const [playbackNotes, setPlaybackNotes] = useState<string[]>([])
  const [pressedNotes, setPressedNotes] = useState<string[]>([])
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
  const themeSettings = settings.theme
  const labelMode = settings.piano.labelMode
  const soundEnabled = settings.audio.soundEnabled
  const noteDisplayMode = settings.grandStaff.noteDisplayMode
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
  const practiceSettingsSynced = useRef(false)

  useEffect(() => {
    if (practiceSettingsSynced.current) {
      return
    }

    practiceSettingsSynced.current = true
    practiceController.updateSettings(settings.practice)
  }, [practiceController, settings.practice])
  const currentChord = useMemo(
    () =>
      analyzeChord(
        pressedNotes
          .map(noteName => pianoNotes.find(note => note.name === noteName))
          .filter((note): note is (typeof pianoNotes)[number] => note !== undefined),
      ),
    [pressedNotes],
  )

  const pressNote = useCallback((
    noteName: string,
    context: InputNoteContext = { source: 'mouse' },
  ) => {
    const note = pianoNotes.find(item => item.name === noteName)

    if (!note) {
      return
    }

    if (context.source === 'playback') {
      startNote(`score:${note.name}`, note.frequency)
      setPlaybackNotes(prev => prev.includes(noteName) ? prev : [...prev, noteName])
      return
    }
    if (workspaceRef.current === 'score') {
      heldAudition.current.add(`${context.source}:${noteName}`)
      const pitches = [...heldAudition.current].map(key => pianoNoteToMidiNumber(key.slice(key.indexOf(':') + 1))!)
      setAudition([...new Set(pitches)].sort((a, b) => a - b))
    }
    const event = noteEventFactory.create({
      note,
      source: context.source,
      velocity: context.velocity,
    })

    if (event && workspaceRef.current === 'trainer') {
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
    if (context.source === 'playback') {
      stopNote(`score:${noteName}`)
      setPlaybackNotes(prev => prev.filter(name => name !== noteName))
      return
    }
    heldAudition.current.delete(`${context.source}:${noteName}`)
    const note = pianoNotes.find(item => item.name === noteName)

    if (note) {
      const midiNumber = pianoNoteToMidiNumber(note)

      if (midiNumber !== undefined) {
        const event = noteEventFactory.close({
          midiNumber,
          source: context.source,
        })

        if (event && workspaceRef.current === 'trainer') {
          practiceController.handleNoteRelease(event)
        }
      }
    }

    setPressedNotes(prev => prev.filter(item => item !== noteName))
    stopNote(noteName)
  }, [noteEventFactory, practiceController])

  const inputLayer = useMemo(
    // InputLayer only stores callbacks; it never invokes them during construction.
    // eslint-disable-next-line react-hooks/refs
    () => new InputLayer({ pressNote, releaseNote }),
    [pressNote, releaseNote],
  )

  const playScoreNote = useCallback((pitch: number) => {
    const note = midiNumberToPianoNote(pitch)
    if (note) inputLayer.pressNote(note.name, { source: 'playback' })
  }, [inputLayer])
  const stopScoreNote = useCallback((pitch: number) => {
    const note = midiNumberToPianoNote(pitch)
    if (note) inputLayer.releaseNote(note.name, { source: 'playback' })
  }, [inputLayer])

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
    updateSettings(current => ({
      ...current,
      audio: {
        ...current.audio,
        soundEnabled: enabled,
      },
    }))
    setAudioEnabled(enabled)
  }

  const handleLabelModeChange = useCallback((mode: PianoLabelMode) => {
    updateSettings(current => ({
      ...current,
      piano: {
        ...current.piano,
        labelMode: mode,
      },
    }))
  }, [updateSettings])

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
      updateSettings(current => ({
        ...current,
        theme: selectThemeMode(current.theme, mode, systemThemePreset),
      }))
    },
    [systemThemePreset, updateSettings],
  )

  const handleThemeTokenChange = useCallback(
    (token: ConfigurableThemeToken, value: string) => {
      updateSettings(current => ({
        ...current,
        theme: updateThemeToken(current.theme, token, value, systemThemePreset),
      }))
    },
    [systemThemePreset, updateSettings],
  )

  const handleNoteColorModeChange = useCallback(
    (mode: 'single' | 'left-right') => {
      updateSettings(current => ({
        ...current,
        theme: {
          ...current.theme,
          noteColorMode: mode,
        },
      }))
    },
    [updateSettings],
  )

  const handleThemeReset = useCallback(() => {
    updateSettings(current => ({
      ...current,
      theme: createThemeSettings(systemThemePreset),
    }))
  }, [systemThemePreset, updateSettings])

  const handleNoteDisplayModeChange = useCallback((mode: typeof noteDisplayMode) => {
    updateSettings(current => ({
      ...current,
      grandStaff: {
        ...current.grandStaff,
        noteDisplayMode: mode,
      },
    }))
  }, [updateSettings])

  const handlePracticeSettingsChange = useCallback(
    (updates: Partial<PracticeSettings>) => {
      updateSettings(current => ({
        ...current,
        practice: {
          ...current.practice,
          ...updates,
        },
      }))
      practiceController.updateSettings(updates)
    },
    [practiceController, updateSettings],
  )

  const handleAutoSaveChange = useCallback(
    (enabled: boolean) => {
      updateSettings(current => ({ ...current, autoSave: enabled }))
    },
    [updateSettings],
  )

  useEffect(() => {
    setAudioEnabled(settings.audio.soundEnabled)
  }, [settings.audio.soundEnabled])

  const handleResetSettings = useCallback(() => {
    resetSettings()
    practiceController.updateSettings(createPracticeSettings())
  }, [practiceController, resetSettings])

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

  const handleWorkspaceChange = useCallback((nextWorkspace: 'trainer' | 'score') => {
    workspaceRef.current = nextWorkspace
    heldAudition.current.clear()
    setWorkspace(nextWorkspace)
  }, [])

  return (
    <div className={`piano-trainer${workspace === 'score' ? ' piano-trainer--score' : ''}`}>
      <Header
        workspace={workspace}
        disabled={pressedNotes.length > 0}
        onWorkspaceChange={handleWorkspaceChange}
      />
      <div hidden={workspace !== 'trainer'}>
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
        onNoteDisplayModeChange={handleNoteDisplayModeChange}
        practiceSelection={practiceSnapshot.selection}
        practiceSettings={settings.practice}
        onPracticeSelectionChange={practiceController.selectMode}
        onPracticeSettingsChange={handlePracticeSettingsChange}
        settings={settings}
        onAutoSaveChange={handleAutoSaveChange}
        onSoundChange={handleSoundChange}
        onLabelModeChange={handleLabelModeChange}
        onSaveSettings={saveCurrentSettings}
        onResetSettings={handleResetSettings}
      />

      </div>
      <main className="main-content">
        <div className="trainer-panel" id="trainer-panel" role="tabpanel" aria-labelledby="trainer-tab" hidden={workspace !== 'trainer'}>
        <GrandStaff
          pressedNotes={pressedNotes}
          targetNotes={
            practiceSnapshot.session?.currentTask?.targetNotes ?? []
          }
          practicePhrase={practiceSnapshot.session?.phrase ?? null}
          currentTargetIndex={
            practiceSnapshot.session?.cursor.noteIndex ?? -1
          }
          practiceType={settings.practice.practiceType}
          noteDisplayMode={noteDisplayMode}
          practiceNoteNameMode={settings.practice.noteNameMode}
          chord={currentChord}
        />

        </div>
        <ScoreEditor active={workspace === 'score'} audition={audition} onPlayNote={playScoreNote} onStopNote={stopScoreNote} />
        <StatusBar
          keyboardBaseNote={keyboardBaseNote}
          midiDeviceName={midiDeviceName}
          bluetoothMidiDeviceName={bluetoothMidiDeviceName}
        />
      </main>

      <InputPianoDock
        pressedNotes={[...new Set([...pressedNotes, ...playbackNotes])]}
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
