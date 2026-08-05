import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const api = {
  getTheme: async () => ipcRenderer.invoke('theme:get'),
  onThemeChanged: (callback: (payload: { shouldUseDarkColors: boolean }) => void) => {
    const listener = (_: unknown, payload: { shouldUseDarkColors: boolean }) => callback(payload)
    ipcRenderer.on('theme:changed', listener)
    return () => ipcRenderer.removeListener('theme:changed', listener)
  },
  setThemeSource: async (source: 'system' | 'dark' | 'light') => ipcRenderer.invoke('theme:set', source)
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
