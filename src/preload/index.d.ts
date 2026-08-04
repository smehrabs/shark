import { ElectronAPI } from '@electron-toolkit/preload'
import type { LibraryState, ThemeState } from '../renderer/src/types'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      getLibraryState: () => Promise<LibraryState>
      selectMusicFolder: () => Promise<LibraryState>
      rescanLibrary: () => Promise<LibraryState>
      getTheme: () => Promise<ThemeState>
      onThemeChanged: (callback: (theme: ThemeState) => void) => () => void
      getDefaultMusicFolder: () => Promise<string>
      getMediaUrl: (filePath: string) => string
    }
  }
}

export {}
