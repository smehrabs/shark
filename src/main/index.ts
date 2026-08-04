import { app, shell, BrowserWindow, ipcMain, dialog, nativeTheme, protocol, net } from 'electron'
import { join } from 'path'
import { pathToFileURL } from 'node:url'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { getLibraryState, rescanLibrary, setMusicFolderAndScan } from './db.js'
import { getDefaultMusicFolder } from './paths.js'

protocol.registerSchemesAsPrivileged([
  {
    scheme: 'shark',
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
      stream: true,
      bypassCSP: true
    }
  }
])

const DEFAULT_MUSIC_FOLDER = getDefaultMusicFolder()

function broadcastTheme(window: BrowserWindow): void {
  window.webContents.send('theme:changed', {
    shouldUseDarkColors: nativeTheme.shouldUseDarkColors,
    shouldUseHighContrastColors: nativeTheme.shouldUseHighContrastColors,
    shouldUseInvertedColorScheme: nativeTheme.shouldUseInvertedColorScheme,
    themeSource: nativeTheme.themeSource
  })
}

async function ensureStartupLibrary(): Promise<void> {
  const state = await getLibraryState()
  if (state.tracks.length === 0 && !state.musicFolder) {
    const result = await dialog.showOpenDialog({
      title: 'Select your music folder',
      buttonLabel: 'Select folder',
      defaultPath: DEFAULT_MUSIC_FOLDER,
      properties: ['openDirectory']
    })

    if (!result.canceled && result.filePaths.length > 0) {
      await setMusicFolderAndScan(result.filePaths[0])
    }
  }
}

function createWindow(): BrowserWindow {
  nativeTheme.themeSource = 'system'

  const mainWindow = new BrowserWindow({
    width: 1100,
    height: 720,
    minWidth: 800,
    minHeight: 500,
    show: false,
    autoHideMenuBar: true,
    backgroundColor: nativeTheme.shouldUseDarkColors ? '#1a1a1a' : '#f5f5f5',
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    broadcastTheme(mainWindow)
  })

  nativeTheme.on('updated', () => {
    mainWindow.setBackgroundColor(
      nativeTheme.shouldUseDarkColors ? '#1a1a1a' : '#f5f5f5'
    )
    broadcastTheme(mainWindow)
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  return mainWindow
}

ipcMain.handle('library:getState', async () => {
  return await getLibraryState()
})

ipcMain.handle('library:selectFolder', async () => {
  const result = await dialog.showOpenDialog({
    title: 'Select music folder',
    buttonLabel: 'Select folder',
    defaultPath: DEFAULT_MUSIC_FOLDER,
    properties: ['openDirectory']
  })

  if (result.canceled || result.filePaths.length === 0) {
    return await getLibraryState()
  }

  return await setMusicFolderAndScan(result.filePaths[0])
})

ipcMain.handle('library:rescan', async () => {
  const state = await getLibraryState()
  if (!state.musicFolder) {
    return state
  }
  return await rescanLibrary(state.musicFolder)
})

ipcMain.handle('theme:get', () => {
  return {
    shouldUseDarkColors: nativeTheme.shouldUseDarkColors,
    shouldUseHighContrastColors: nativeTheme.shouldUseHighContrastColors,
    shouldUseInvertedColorScheme: nativeTheme.shouldUseInvertedColorScheme,
    themeSource: nativeTheme.themeSource
  }
})

ipcMain.handle('paths:defaultMusicFolder', () => {
  return DEFAULT_MUSIC_FOLDER
})

app.whenReady().then(async () => {
  electronApp.setAppUserModelId('com.electron')

  protocol.handle('shark', (request) => {
    const url = new URL(request.url)
    const filePath = decodeURIComponent(url.pathname)
    return net.fetch(pathToFileURL(filePath).href)
  })

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.on('ping', () => console.log('pong'))

  await ensureStartupLibrary()
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
