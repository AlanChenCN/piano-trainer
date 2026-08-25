import { createContext } from 'react'
import type { AppSettings } from './settings'

export interface SettingsContextValue {
  settings: AppSettings
  updateSettings: (
    updater: (current: AppSettings) => AppSettings,
  ) => void
  saveCurrentSettings: () => void
  resetSettings: () => void
}

export const SettingsContext = createContext<SettingsContextValue | null>(null)
