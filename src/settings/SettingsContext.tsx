import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { createDefaultSettings } from './defaultSettings'
import { loadSettings, saveSettings } from './settingsStorage'
import { normalizeSettings, type AppSettings } from './settings'
import { SettingsContext } from './context'

interface SettingsProviderProps {
  children: ReactNode
}

export function SettingsProvider({ children }: SettingsProviderProps) {
  const [settings, setSettings] = useState<AppSettings>(loadSettings)
  const settingsRef = useRef(settings)
  const skipNextAutoSaveRef = useRef(false)

  useEffect(() => {
    settingsRef.current = settings
  }, [settings])

  useEffect(() => {
    if (skipNextAutoSaveRef.current) {
      skipNextAutoSaveRef.current = false
      return
    }

    if (settings.autoSave) {
      saveSettings(settings)
    }
  }, [settings])

  const updateSettings = useCallback(
    (updater: (current: AppSettings) => AppSettings) => {
      setSettings(current => {
        const next = normalizeSettings(updater(current), createDefaultSettings())
        settingsRef.current = next
        return next
      })
    },
    [],
  )

  const saveCurrentSettings = useCallback(() => {
    saveSettings(settingsRef.current)
  }, [])

  const resetSettings = useCallback(() => {
    const defaults = createDefaultSettings()
    skipNextAutoSaveRef.current = !settingsRef.current.autoSave
    settingsRef.current = defaults
    setSettings(defaults)
  }, [])

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        saveCurrentSettings,
        resetSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}
