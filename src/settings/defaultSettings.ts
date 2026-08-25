import { createPracticeSettings } from '../practice/practiceTypes'
import {
  createThemeSettings,
  getSystemThemePreset,
} from '../theme/theme'
import type { AppSettings } from './settings'
import { CURRENT_SETTINGS_VERSION } from './settings'

export function createDefaultSettings(): AppSettings {
  return {
    version: CURRENT_SETTINGS_VERSION,
    autoSave: true,
    theme: createThemeSettings(getSystemThemePreset()),
    piano: {
      labelMode: 'white',
    },
    audio: {
      soundEnabled: true,
    },
    grandStaff: {
      noteDisplayMode: 'letter',
    },
    practice: createPracticeSettings(),
  }
}
