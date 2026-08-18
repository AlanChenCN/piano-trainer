import { InputLayer } from './inputLayer'
import {
  defaultKeyboardRange,
  mapKeyToNote,
  type KeyboardRange,
} from './keyboardMapper'

/**
 * Owns browser keyboard events and their active physical-key state.
 * Keyboard-specific release behavior stays here, outside the Input Layer.
 */
export class KeyboardController {
  private readonly activeKeys = new Map<string, string>()
  private readonly inputLayer: InputLayer
  private range: KeyboardRange
  private started = false

  constructor(inputLayer: InputLayer, initialRange: KeyboardRange = defaultKeyboardRange) {
    this.inputLayer = inputLayer
    this.range = initialRange
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

  setRange(range: KeyboardRange) {
    if (range === this.range) {
      return
    }

    this.releaseActiveKeys()
    this.range = range
  }

  private readonly handleKeyDown = (event: KeyboardEvent) => {
    const key = event.key.toLowerCase()

    if (this.activeKeys.has(key)) {
      return
    }

    const noteName = mapKeyToNote(key, this.range)

    if (!noteName) {
      return
    }

    this.activeKeys.set(key, noteName)
    this.inputLayer.pressNote(noteName)
  }

  private readonly handleKeyUp = (event: KeyboardEvent) => {
    const key = event.key.toLowerCase()
    const noteName = this.activeKeys.get(key)

    if (!noteName) {
      return
    }

    this.activeKeys.delete(key)
    this.inputLayer.releaseNote(noteName)
  }

  private readonly handleWindowBlur = () => {
    this.releaseActiveKeys()
  }

  private releaseActiveKeys() {
    for (const noteName of this.activeKeys.values()) {
      this.inputLayer.releaseNote(noteName)
    }

    this.activeKeys.clear()
  }
}
