import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import type { LibraryState, ThemeState } from '../renderer/src/types.js'

const api = {
  getLibraryState: (): Promise<LibraryState> => ipcRenderer.invoke('library:getState'),
  selectMusicFolder: (): Promise<LibraryState> => ipcRenderer.invoke('library:selectFolder'),
  rescanLibrary: (): Promise<LibraryState> => ipcRenderer.invoke('library:rescan'),
  getTheme: (): Promise<ThemeState> => ipcRenderer.invoke('theme:get'),
  onThemeChanged: (callback: (theme: ThemeState) => void): (() => void) => {
    const listener = (_event: Electron.IpcRendererEvent, theme: ThemeState): void => {
      callback(theme)
    }
    ipcRenderer.on('theme:changed', listener)
    return () => ipcRenderer.removeListener('theme:changed', listener)
  },
  getDefaultMusicFolder: (): Promise<string> => ipcRenderer.invoke('paths:defaultMusicFolder'),
  getMediaUrl: (filePath: string): string =>
    `shark://media/${filePath.split('/').filter(Boolean).map(encodeURIComponent).join('/')}`
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
