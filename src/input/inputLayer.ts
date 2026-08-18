export interface InputLayerHandlers {
  pressNote: (noteName: string) => void
  releaseNote: (noteName: string) => void
}

/**
 * Source-agnostic boundary for note input.
 *
 * Input devices should only translate their events into these two methods.
 */
export class InputLayer {
  private readonly handlers: InputLayerHandlers

  constructor(handlers: InputLayerHandlers) {
    this.handlers = handlers
  }

  pressNote = (noteName: string) => {
    this.handlers.pressNote(noteName)
  }

  releaseNote = (noteName: string) => {
    this.handlers.releaseNote(noteName)
  }
}
