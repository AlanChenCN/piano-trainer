import { pianoNotes, type PianoLabelMode } from '../data/piano'
import type { NoteDisplayMode } from '../music/noteDisplay'
import type { ThemeSettings, ThemeTokens } from '../theme/theme'
import type { PracticeSettings } from '../practice/practiceTypes'

export const CURRENT_SETTINGS_VERSION = 1

export interface AppSettings {
  version: number
  autoSave: boolean
  theme: ThemeSettings
  piano: {
    labelMode: PianoLabelMode
  }
  grandStaff: {
    noteDisplayMode: NoteDisplayMode
  }
  practice: PracticeSettings
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isThemeMode(value: unknown): value is ThemeSettings['mode'] {
  return value === 'system' || value === 'dark' || value === 'light' || value === 'custom'
}

function isNoteColorMode(value: unknown): value is ThemeSettings['noteColorMode'] {
  return value === 'single' || value === 'left-right'
}

function isNoteDisplayMode(value: unknown): value is NoteDisplayMode {
  return value === 'hidden' || value === 'letter' || value === 'solfege'
}

function normalizeLabelMode(value: unknown, fallback: PianoLabelMode): PianoLabelMode {
  if (value === 'c') {
    return 'letter'
  }

  return value === 'hidden' ||
    value === 'white' ||
    value === 'letter' ||
    value === 'solfege' ||
    value === 'all'
    ? value
    : fallback
}

function mergeThemeTokens(
  value: unknown,
  fallback: ThemeTokens,
): ThemeTokens {
  if (!isRecord(value)) {
    return { ...fallback }
  }

  return Object.keys(fallback).reduce((tokens, key) => {
    const candidate = value[key]
    tokens[key as keyof ThemeTokens] =
      typeof candidate === 'string'
        ? candidate
        : fallback[key as keyof ThemeTokens]
    return tokens
  }, { ...fallback })
}

function normalizeThemeSettings(
  value: unknown,
  fallback: ThemeSettings,
): ThemeSettings {
  if (!isRecord(value)) {
    return {
      ...fallback,
      customTokens: { ...fallback.customTokens },
    }
  }

  return {
    mode: isThemeMode(value.mode) ? value.mode : fallback.mode,
    customTokens: mergeThemeTokens(value.customTokens, fallback.customTokens),
    noteColorMode: isNoteColorMode(value.noteColorMode)
      ? value.noteColorMode
      : fallback.noteColorMode,
  }
}

const validRangeStarts = new Set(
  pianoNotes
    .filter(note => note.type === 'white' && (note.octave < 4 || note.name === 'C4'))
    .map(note => note.name),
)
const validRangeEnds = new Set(
  pianoNotes
    .filter(note => note.type === 'white' && note.octave >= 4)
    .map(note => note.name),
)

function normalizePracticeSettings(
  value: unknown,
  fallback: PracticeSettings,
): PracticeSettings {
  if (!isRecord(value)) {
    return { ...fallback }
  }

  const rangeStart = validRangeStarts.has(String(value.rangeStart))
    ? String(value.rangeStart)
    : fallback.rangeStart
  const rangeEnd = validRangeEnds.has(String(value.rangeEnd))
    ? String(value.rangeEnd)
    : fallback.rangeEnd
  const startMidi = pianoNotes.find(note => note.name === rangeStart)
  const endMidi = pianoNotes.find(note => note.name === rangeEnd)
  const hasValidRange = startMidi && endMidi &&
    pianoNotes.indexOf(startMidi) <= pianoNotes.indexOf(endMidi)

  return {
    practiceType: value.practiceType === 'chord' ? 'chord' :
      value.practiceType === 'note' ? 'note' : fallback.practiceType,
    rangeStart: hasValidRange ? rangeStart : fallback.rangeStart,
    rangeEnd: hasValidRange ? rangeEnd : fallback.rangeEnd,
    notePool: value.notePool === 'white-only' || value.notePool === 'black-only'
      ? value.notePool
      : value.notePool === 'all'
        ? 'all'
        : fallback.notePool,
    noteNameMode: value.noteNameMode === 'hidden' ||
      value.noteNameMode === 'letter' ||
      value.noteNameMode === 'full'
      ? value.noteNameMode
      : fallback.noteNameMode,
  }
}

export function migrateSettings(value: unknown): unknown {
  if (!isRecord(value)) {
    return value
  }

  // Version 1 is the first persisted schema. Keeping this boundary explicit
  // allows future versions to migrate old settings without touching the UI.
  return value
}

export function normalizeSettings(
  value: unknown,
  fallback: AppSettings,
): AppSettings {
  const migrated = migrateSettings(value)

  if (!isRecord(migrated)) {
    return fallback
  }

  const piano = isRecord(migrated.piano) ? migrated.piano : {}
  const grandStaff = isRecord(migrated.grandStaff) ? migrated.grandStaff : {}

  return {
    version: CURRENT_SETTINGS_VERSION,
    autoSave: typeof migrated.autoSave === 'boolean'
      ? migrated.autoSave
      : fallback.autoSave,
    theme: normalizeThemeSettings(migrated.theme, fallback.theme),
    piano: {
      labelMode: normalizeLabelMode(piano.labelMode, fallback.piano.labelMode),
    },
    grandStaff: {
      noteDisplayMode: isNoteDisplayMode(grandStaff.noteDisplayMode)
        ? grandStaff.noteDisplayMode
        : fallback.grandStaff.noteDisplayMode,
    },
    practice: normalizePracticeSettings(migrated.practice, fallback.practice),
  }
}
