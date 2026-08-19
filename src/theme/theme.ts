export type ThemeMode = 'system' | 'dark' | 'light' | 'custom'
export type ThemePreset = 'dark' | 'light'
export type ThemeDisplayPreset = ThemePreset | 'custom'
export type NoteColorMode = 'single' | 'left-right'

export interface ThemeTokens {
  pageBackground: string
  surfaceBackground: string
  scoreBackground: string
  textColor: string
  headingColor: string
  borderColor: string
  accentColor: string
  accentBackground: string
  accentBorder: string
  staffColor: string
  activeNoteColor: string
  leftHandColor: string
  rightHandColor: string
  pianoWhite: string
  pianoWhiteText: string
  pianoWhiteHover: string
  pianoBlack: string
  pianoBlackText: string
  pianoBlackHover: string
  statusWarning: string
  statusSuccess: string
  statusError: string
  shadow: string
}

export interface ThemeSettings {
  mode: ThemeMode
  customTokens: ThemeTokens
  noteColorMode: NoteColorMode
}

const lightTokens: ThemeTokens = {
  pageBackground: '#f4f5f8',
  surfaceBackground: '#ffffff',
  scoreBackground: '#fbfaf7',
  textColor: '#5f6470',
  headingColor: '#1f2937',
  borderColor: '#d9dde5',
  accentColor: '#7c3aed',
  accentBackground: 'rgba(124, 58, 237, 0.1)',
  accentBorder: 'rgba(124, 58, 237, 0.5)',
  staffColor: '#596273',
  activeNoteColor: '#7c3aed',
  leftHandColor: '#2563eb',
  rightHandColor: '#db2777',
  pianoWhite: '#f8fafc',
  pianoWhiteText: '#475569',
  pianoWhiteHover: '#e2e8f0',
  pianoBlack: '#1f2937',
  pianoBlackText: '#f8fafc',
  pianoBlackHover: '#334155',
  statusWarning: '#b7791f',
  statusSuccess: '#15803d',
  statusError: '#b42318',
  shadow:
    'rgba(15, 23, 42, 0.12) 0 10px 15px -3px, rgba(15, 23, 42, 0.06) 0 4px 6px -2px',
}

const darkTokens: ThemeTokens = {
  pageBackground: '#151821',
  surfaceBackground: '#20242f',
  scoreBackground: '#1b202a',
  textColor: '#aab4c3',
  headingColor: '#f3f4f6',
  borderColor: '#394252',
  accentColor: '#a78bfa',
  accentBackground: 'rgba(167, 139, 250, 0.16)',
  accentBorder: 'rgba(167, 139, 250, 0.56)',
  staffColor: '#cbd5e1',
  activeNoteColor: '#60a5fa',
  leftHandColor: '#60a5fa',
  rightHandColor: '#f472b6',
  pianoWhite: '#e5e7eb',
  pianoWhiteText: '#1f2937',
  pianoWhiteHover: '#cbd5e1',
  pianoBlack: '#242936',
  pianoBlackText: '#f8fafc',
  pianoBlackHover: '#343b4a',
  statusWarning: '#f0b85c',
  statusSuccess: '#4ade80',
  statusError: '#f87171',
  shadow:
    'rgba(0, 0, 0, 0.42) 0 10px 15px -3px, rgba(0, 0, 0, 0.28) 0 4px 6px -2px',
}

export const themePresets: Record<ThemePreset, ThemeTokens> = {
  dark: darkTokens,
  light: lightTokens,
}

function copyTokens(tokens: ThemeTokens): ThemeTokens {
  return { ...tokens }
}

export function getSystemThemePreset(): ThemePreset {
  if (typeof window === 'undefined') {
    return 'light'
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

export function resolveThemePreset(
  mode: ThemeMode,
  systemPreset: ThemePreset,
): ThemePreset {
  return mode === 'system' ? systemPreset : mode === 'custom' ? systemPreset : mode
}

export function resolveThemeDisplayPreset(
  mode: ThemeMode,
  systemPreset: ThemePreset,
): ThemeDisplayPreset {
  return mode === 'custom' ? 'custom' : resolveThemePreset(mode, systemPreset)
}

export function resolveThemeTokens(
  settings: ThemeSettings,
  systemPreset: ThemePreset,
): ThemeTokens {
  return settings.mode === 'custom'
    ? copyTokens(settings.customTokens)
    : copyTokens(themePresets[resolveThemePreset(settings.mode, systemPreset)])
}

export function createThemeSettings(systemPreset: ThemePreset): ThemeSettings {
  return {
    mode: 'system',
    customTokens: copyTokens(themePresets[systemPreset]),
    noteColorMode: 'single',
  }
}

export function selectThemeMode(
  settings: ThemeSettings,
  mode: ThemeMode,
  systemPreset: ThemePreset,
): ThemeSettings {
  if (mode === 'custom') {
    return {
      ...settings,
      mode,
      customTokens: resolveThemeTokens(settings, systemPreset),
    }
  }

  return { ...settings, mode }
}

export function updateThemeToken(
  settings: ThemeSettings,
  token: keyof ThemeTokens,
  value: string,
  systemPreset: ThemePreset,
): ThemeSettings {
  return {
    ...settings,
    mode: 'custom',
    customTokens: {
      ...resolveThemeTokens(settings, systemPreset),
      [token]: value,
    },
  }
}

interface RgbColor {
  red: number
  green: number
  blue: number
}

interface HslColor {
  hue: number
  saturation: number
  lightness: number
}

function parseHexColor(value: string): RgbColor | null {
  const normalized = value.replace('#', '')
  const hex = normalized.length === 3
    ? normalized.split('').map(channel => `${channel}${channel}`).join('')
    : normalized

  if (!/^[0-9a-f]{6}$/i.test(hex)) {
    return null
  }

  return {
    red: Number.parseInt(hex.slice(0, 2), 16),
    green: Number.parseInt(hex.slice(2, 4), 16),
    blue: Number.parseInt(hex.slice(4, 6), 16),
  }
}

function rgbToHsl({ red, green, blue }: RgbColor): HslColor {
  const normalizedRed = red / 255
  const normalizedGreen = green / 255
  const normalizedBlue = blue / 255
  const max = Math.max(normalizedRed, normalizedGreen, normalizedBlue)
  const min = Math.min(normalizedRed, normalizedGreen, normalizedBlue)
  const delta = max - min
  const lightness = (max + min) / 2

  if (delta === 0) {
    return { hue: 0, saturation: 0, lightness }
  }

  const saturation = delta / (1 - Math.abs(2 * lightness - 1))
  const hue = max === normalizedRed
    ? 60 * (((normalizedGreen - normalizedBlue) / delta) % 6)
    : max === normalizedGreen
      ? 60 * ((normalizedBlue - normalizedRed) / delta + 2)
      : 60 * ((normalizedRed - normalizedGreen) / delta + 4)

  return {
    hue: hue < 0 ? hue + 360 : hue,
    saturation,
    lightness,
  }
}

function hslToHex({ hue, saturation, lightness }: HslColor): string {
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation
  const hueSector = hue / 60
  const secondary = chroma * (1 - Math.abs((hueSector % 2) - 1))
  const match = lightness - chroma / 2
  let red = 0
  let green = 0
  let blue = 0

  if (hueSector < 1) {
    red = chroma
    green = secondary
  } else if (hueSector < 2) {
    red = secondary
    green = chroma
  } else if (hueSector < 3) {
    green = chroma
    blue = secondary
  } else if (hueSector < 4) {
    green = secondary
    blue = chroma
  } else if (hueSector < 5) {
    red = secondary
    blue = chroma
  } else {
    red = chroma
    blue = secondary
  }

  const toHex = (channel: number) =>
    Math.round((channel + match) * 255)
      .toString(16)
      .padStart(2, '0')

  return `#${toHex(red)}${toHex(green)}${toHex(blue)}`
}

export function derivePianoHighlightVariants(activeNoteColor: string) {
  const rgb = parseHexColor(activeNoteColor)

  if (!rgb) {
    return {
      whiteKey: activeNoteColor,
      blackKey: activeNoteColor,
    }
  }

  const hsl = rgbToHsl(rgb)

  return {
    whiteKey: hslToHex({
      ...hsl,
      saturation: Math.min(1, hsl.saturation * 0.9),
      lightness: Math.min(0.82, hsl.lightness + 0.2),
    }),
    blackKey: hslToHex({
      ...hsl,
      saturation: Math.min(1, hsl.saturation * 1.05),
      lightness: Math.max(0.2, hsl.lightness - 0.18),
    }),
  }
}

function relativeLuminance(color: string) {
  const rgb = parseHexColor(color)

  if (!rgb) {
    return 1
  }

  const channels = [rgb.red, rgb.green, rgb.blue].map(channel => {
    const normalized = channel / 255
    return normalized <= 0.03928
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4
  })

  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722
}

export function applyThemeToDocument(tokens: ThemeTokens) {
  const root = document.documentElement
  const pianoHighlights = derivePianoHighlightVariants(tokens.activeNoteColor)
  const cssVariables: Record<string, string> = {
    '--theme-page-background': tokens.pageBackground,
    '--theme-surface-background': tokens.surfaceBackground,
    '--theme-score-background': tokens.scoreBackground,
    '--theme-text-color': tokens.textColor,
    '--theme-heading-color': tokens.headingColor,
    '--theme-border-color': tokens.borderColor,
    '--theme-accent-color': tokens.accentColor,
    '--theme-accent-background': tokens.accentBackground,
    '--theme-accent-border': tokens.accentBorder,
    '--theme-staff-color': tokens.staffColor,
    '--theme-note-color': tokens.activeNoteColor,
    '--theme-left-hand-color': tokens.leftHandColor,
    '--theme-right-hand-color': tokens.rightHandColor,
    '--theme-note-white-highlight': pianoHighlights.whiteKey,
    '--theme-note-black-highlight': pianoHighlights.blackKey,
    '--theme-piano-white': tokens.pianoWhite,
    '--theme-piano-white-text': tokens.pianoWhiteText,
    '--theme-piano-white-hover': tokens.pianoWhiteHover,
    '--theme-piano-black': tokens.pianoBlack,
    '--theme-piano-black-text': tokens.pianoBlackText,
    '--theme-piano-black-hover': tokens.pianoBlackHover,
    '--theme-status-warning': tokens.statusWarning,
    '--theme-status-success': tokens.statusSuccess,
    '--theme-status-error': tokens.statusError,
    '--theme-shadow': tokens.shadow,
  }

  Object.entries(cssVariables).forEach(([name, value]) => {
    root.style.setProperty(name, value)
  })

  root.style.colorScheme = relativeLuminance(tokens.pageBackground) < 0.4
    ? 'dark'
    : 'light'
}
