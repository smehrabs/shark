import { useEffect, useState } from 'react'
import './App.css'

const rewindIcon = new URL('../../../resources/icons8-rewind-button-round-50.png', import.meta.url).href
const playIcon = new URL('../../../resources/icons8-play-50.png', import.meta.url).href
const forwardIcon = new URL('../../../resources/icons8-fast-forward-round-50.png', import.meta.url).href
const brandIcon = new URL('../../../resources/icons8-classic-music-48.png', import.meta.url).href
const filesIcon = new URL('../../../resources/icons8-classic-music-doodle-32.png', import.meta.url).href
const libraryIcon = new URL('../../../resources/icons8-classic-music-48.png', import.meta.url).href
const playlistsIcon = new URL('../../../resources/icons8-circled-play-button-50.png', import.meta.url).href
const favoritesIcon = new URL('../../../resources/icons8-classic-music-doodle-16.png', import.meta.url).href
const albumArt = new URL('../../../resources/icons8-classic-music-70.png', import.meta.url).href

const navItems = [
  { label: 'Explore', icon: null, active: true },
  { label: 'Files', icon: filesIcon },
  { label: 'Library', icon: libraryIcon },
  { label: 'Playlists', icon: playlistsIcon },
  { label: 'Favorites', icon: favoritesIcon },
]

const recentlyPlayed = [
  { title: 'Late Night Waves', subtitle: '8 tracks' },
  { title: 'Retro Drive', subtitle: '12 tracks' },
  { title: 'Focus Session', subtitle: '6 tracks' },
]

const songs = [
  { title: 'Midnight Drive', artist: 'Neon Echo', duration: '3:41' },
  { title: 'Solar Pulse', artist: 'Luna Fields', duration: '4:02' },
  { title: 'Velvet Nights', artist: 'Aurora Drift', duration: '3:56' },
  { title: 'Pulse Horizon', artist: 'Stereo Skyline', duration: '4:24' },
  { title: 'Crystal Waves', artist: 'Echo Falls', duration: '3:29' },
  { title: 'City of Rhythms', artist: 'Neon District', duration: '5:08' },
  { title: 'Parallel Dreams', artist: 'Nova Pulse', duration: '4:11' },
  { title: 'Glasslight', artist: 'Astral Phase', duration: '3:52' },
]

function Home(): React.JSX.Element {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return true
  })

  useEffect(() => {
    const html = document.documentElement
    const applyTheme = (dark: boolean) => {
      setIsDark(dark)
      html.classList.toggle('dark', dark)
      html.classList.toggle('light', !dark)
    }

    applyTheme(isDark)

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const onMediaChange = (event: MediaQueryListEvent) => applyTheme(event.matches)

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', onMediaChange)
    } else {
      mediaQuery.addListener(onMediaChange)
    }

    if (typeof window !== 'undefined' && (window as any).api?.getTheme) {
      ;(window as any).api
        .getTheme()
        .then((payload: { shouldUseDarkColors: boolean }) => applyTheme(payload.shouldUseDarkColors))
        .catch(() => undefined)
    }

    const themeListener = (payload: { shouldUseDarkColors: boolean }) => applyTheme(payload.shouldUseDarkColors)
    const removeThemeListener = typeof window !== 'undefined' && (window as any).api?.onThemeChanged ? (window as any).api.onThemeChanged(themeListener) : undefined

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', onMediaChange)
      } else {
        mediaQuery.removeListener(onMediaChange)
      }
      if (typeof removeThemeListener === 'function') {
        removeThemeListener()
      }
    }
  }, [])

  return (
    <div className="app-shell">
      <header className="top-bar">
        <div className="top-bar-left">
          <button className="control-button" aria-label="Previous">
            <img src={rewindIcon} alt="Previous" />
          </button>
          <button className="control-button" aria-label="Play">
            <img src={playIcon} alt="Play" />
          </button>
          <button className="control-button" aria-label="Next">
            <img src={forwardIcon} alt="Next" />
          </button>
        </div>

        <div className="top-bar-center">
          <span className="track-info">Now Playing — Midnight Drive</span>
          <progress className="player-progress" value={38} max={100} />
        </div>

        <div className="top-bar-right">
          <input className="search-input" type="search" placeholder="Search tracks" />
        </div>
      </header>

      <aside className="sidebar">
        <div className="brand-panel">
          <img className="brand-icon" src={brandIcon} alt="Shark logo" />
          <h2>Shark Player</h2>
        </div>

        <div className="nav-group">
          {navItems.map((item) => (
            <div key={item.label} className={`nav-item${item.active ? ' active' : ''}`}>
              {item.icon && <img className="nav-item-icon" src={item.icon} alt={item.label} />}
              {item.label}
            </div>
          ))}
        </div>

        <div className="sidebar-footer">
          <p className="sidebar-footer-title">Recently Played</p>
          <div className="sidebar-recent">
            {recentlyPlayed.map((item) => (
              <div key={item.title} className="sidebar-recent-item">
                <span>{item.title}</span>
                <small>{item.subtitle}</small>
              </div>
            ))}
          </div>
        </div>
      </aside>

      <main className="main-body">
        <section className="header-panel">
          <div>
            <h1>Music Player</h1>
          </div>

          <div className="hero-track-card">
            <img className="hero-art" src={albumArt} alt="Album art" />
            <div>
              <p className="hero-current-label">Current track</p>
              <p className="hero-current-title">Midnight Drive</p>
              <p className="hero-current-subtitle">Neon Echo · 3:41</p>
            </div>
          </div>

          <div className="stats-bar">
            <div className="stat-card">
              <p className="stat-title">Now Playing</p>
              <p className="stat-value">Midnight Drive</p>
            </div>
            <div className="stat-card">
              <p className="stat-title">Total Tracks</p>
              <p className="stat-value">8</p>
            </div>
            <div className="stat-card">
              <p className="stat-title">Session Time</p>
              <p className="stat-value">2h 15m</p>
            </div>
          </div>
        </section>

        <section className="feature-panel">
          <div className="feature-card">
            <p className="feature-title">Queue</p>
          </div>
          <div className="feature-card">
            <p className="feature-title">Files</p>
          </div>
          <div className="feature-card">
            <p className="feature-title">Favorites</p>
          </div>
        </section>

        <section className="list-pane">
          <div className="list-actions">
            <div className="action-chip active">All Tracks</div>
            <div className="action-chip">Favorites</div>
            <div className="action-chip">Recent</div>
            <button className="action-button">Sort by Title</button>
          </div>
          <h2 className="list-title">Track List</h2>
          <table className="song-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Artist</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              {songs.map((song) => {
                const isActive = song.title === 'Midnight Drive'
                return (
                  <tr key={song.title} className={`song-row${isActive ? ' active' : ''}`}>
                    <td>
                      <div className="song-title">
                        <p className="song-name">{song.title}</p>
                        <p className="song-artist">{song.artist}</p>
                      </div>
                    </td>
                    <td>{song.artist}</td>
                    <td>{song.duration}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  )
}

function App(): React.JSX.Element {
  return <Home />
}

export default App
