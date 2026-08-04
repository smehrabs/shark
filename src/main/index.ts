import { app, shell, BrowserWindow, ipcMain, nativeTheme, protocol, net } from 'electron'
import { join } from 'path'
import { pathToFileURL } from 'node:url'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

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


function broadcastTheme(window: BrowserWindow): void {
  window.webContents.send('theme:changed', {
    shouldUseDarkColors: nativeTheme.shouldUseDarkColors,
    shouldUseHighContrastColors: nativeTheme.shouldUseHighContrastColors,
    shouldUseInvertedColorScheme: nativeTheme.shouldUseInvertedColorScheme,
    themeSource: nativeTheme.themeSource
  })
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
    backgroundColor: '#1a1a1a',
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
    // Keep the window background fixed to #1a1a1a regardless of theme
    mainWindow.setBackgroundColor('#1a1a1a')
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
