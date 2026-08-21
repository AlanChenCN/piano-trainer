import type { NoteEventSource } from '../music/noteEvent'

export interface InputNoteContext {
  source: NoteEventSource
  velocity?: number
}

export interface InputLayerHandlers {
  pressNote: (noteName: string, context: InputNoteContext) => void
  releaseNote: (noteName: string, context: InputNoteContext) => void
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

  pressNote = (
    noteName: string,
    context: InputNoteContext = { source: 'mouse' },
  ) => {
    this.handlers.pressNote(noteName, context)
  }

  releaseNote = (
    noteName: string,
    context: InputNoteContext = { source: 'mouse' },
  ) => {
    this.handlers.releaseNote(noteName, context)
  }
}
