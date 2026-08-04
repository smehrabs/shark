import { useEffect, useState } from 'react'
import type { ThemeState } from '../types'

export function useTheme(): ThemeState {
  const [theme, setTheme] = useState<ThemeState>({
    shouldUseDarkColors: true,
    shouldUseHighContrastColors: false,
    shouldUseInvertedColorScheme: false,
    themeSource: 'system'
  })

  useEffect(() => {
    const applyTheme = (state: ThemeState): void => {
      setTheme(state)
      document.documentElement.dataset.theme = state.shouldUseDarkColors ? 'dark' : 'light'
    }

    void window.api.getTheme().then(applyTheme)

    const unsubscribe = window.api.onThemeChanged(applyTheme)
    return unsubscribe
  }, [])

  return theme
}
