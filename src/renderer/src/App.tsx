import { useEffect, useState } from 'react'
import type { LibraryState } from './types'
import MusicSetup from './components/MusicSetup'
import AppShell from './components/AppShell'

const safeApi = () => {
  if (window.api && typeof window.api.getLibraryState === 'function') {
    return window.api
  }
  throw new Error('API bridge is not available')
}

function App(): React.JSX.Element {
  const [library, setLibrary] = useState<LibraryState | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [defaultFolder, setDefaultFolder] = useState('~/Music')

  const loadLibrary = async (): Promise<void> => {
    setLoading(true)
    setError(null)
    try {
      const state = await safeApi().getLibraryState()

      if (state.tracks.length === 0 && !state.musicFolder) {
        const selected = await safeApi().selectMusicFolder()
        setLibrary(selected)
      } else {
        setLibrary(state)
      }
    } catch {
      setError('Unable to load your music library.')
    } finally {
      setLoading(false)
    }
  }

  const handleSelectFolder = async (): Promise<void> => {
    setLoading(true)
    setError(null)
    try {
      const state = await safeApi().selectMusicFolder()
      setLibrary(state)
    } catch {
      setError('Could not select a music folder.')
    } finally {
      setLoading(false)
    }
  }

  const handleRescan = async (): Promise<void> => {
    setLoading(true)
    setError(null)
    try {
      const state = await safeApi().rescanLibrary()
      setLibrary(state)
    } catch {
      setError('Unable to rescan the music folder.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadLibrary()
    void safeApi()
      .getDefaultMusicFolder()
      .then(setDefaultFolder)
      .catch(() => {})
  }, [])

  if (loading && !library) {
    return (
      <div className="app-loading">
        <div className="loading-spinner" />
        <p>Scanning your music library…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="app-error">
        <p>{error}</p>
        <button type="button" onClick={loadLibrary}>
          Retry
        </button>
      </div>
    )
  }

  if (!library || (library.tracks.length === 0 && !library.musicFolder)) {
    return (
      <MusicSetup defaultFolder={defaultFolder} loading={loading} onSelectFolder={handleSelectFolder} />
    )
  }

  if (library.tracks.length === 0) {
    return (
      <MusicSetup
        defaultFolder={library.musicFolder ?? defaultFolder}
        loading={loading}
        onSelectFolder={handleSelectFolder}
        emptyFolder
      />
    )
  }

  return <AppShell library={library} onRescan={handleRescan} onSelectFolder={handleSelectFolder} />
}

export default App
