import { InputLayer } from './inputLayer'
import {
  createKeyboardMap,
  defaultKeyboardBaseNote,
  type KeyboardBaseNote,
} from './keyboardMapper'

/**
 * Owns browser keyboard events and their active physical-key state.
 * Keyboard-specific release behavior stays here, outside the Input Layer.
 */
export class KeyboardController {
  private readonly activeKeys = new Map<string, string>()
  private readonly inputLayer: InputLayer
  private baseNote: KeyboardBaseNote
  private keyboardMap: Record<string, string>
  private started = false

  constructor(
    inputLayer: InputLayer,
    initialBaseNote: KeyboardBaseNote = defaultKeyboardBaseNote,
  ) {
    this.inputLayer = inputLayer
    this.baseNote = initialBaseNote
    this.keyboardMap = createKeyboardMap(initialBaseNote)
  }

  start() {
    if (this.started) {
      return
    }

    window.addEventListener("keydown", this.handleKeyDown)
    window.addEventListener("keyup", this.handleKeyUp)
    window.addEventListener("blur", this.handleWindowBlur)
    this.started = true
  }

  stop() {
    if (!this.started) {
      return
    }

    window.removeEventListener("keydown", this.handleKeyDown)
    window.removeEventListener("keyup", this.handleKeyUp)
    window.removeEventListener("blur", this.handleWindowBlur)
    this.releaseActiveKeys()
    this.started = false
  }

  setBaseNote(baseNote: KeyboardBaseNote) {
    if (baseNote === this.baseNote) {
      return
    }

    this.releaseActiveKeys()
    this.baseNote = baseNote
    this.keyboardMap = createKeyboardMap(baseNote)
  }

  private readonly handleKeyDown = (event: KeyboardEvent) => {
    const key = event.key.toLowerCase()

    if (this.activeKeys.has(key)) {
      return
    }

    const noteName = this.keyboardMap[key]

    if (!noteName) {
      return
    }

    this.activeKeys.set(key, noteName)
    this.inputLayer.pressNote(noteName, { source: 'keyboard' })
  }

  private readonly handleKeyUp = (event: KeyboardEvent) => {
    const key = event.key.toLowerCase()
    const noteName = this.activeKeys.get(key)

    if (!noteName) {
      return
    }

    this.activeKeys.delete(key)
    this.inputLayer.releaseNote(noteName, { source: 'keyboard' })
  }

  private readonly handleWindowBlur = () => {
    this.releaseActiveKeys()
  }

  private releaseActiveKeys() {
    for (const noteName of this.activeKeys.values()) {
      this.inputLayer.releaseNote(noteName, { source: 'keyboard' })
    }

    this.activeKeys.clear()
  }
}
