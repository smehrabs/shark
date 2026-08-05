import { useEffect, useState } from 'react'
import './App.css'

type IconName = 'rewind' | 'play' | 'forward' | 'explore' | 'folder' | 'library' | 'playlist' | 'heart'

const navItems: { label: string; icon: IconName; active?: boolean }[] = [
  { label: 'Explore', icon: 'explore', active: true },
  { label: 'Files', icon: 'folder' },
  { label: 'Library', icon: 'library' },
  { label: 'Playlists', icon: 'playlist' },
  { label: 'Favorites', icon: 'heart' },
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

function AppIcon({ name, className }: { name: IconName; className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {name === 'rewind' && <path d="M14 4.5 8.5 10 14 15.5V4.5Z M7 4.5 1.5 10 7 15.5V4.5Z" fill="currentColor" />}
      {name === 'play' && <path d="M7 4.5 15.5 10 7 15.5V4.5Z" fill="currentColor" />}
      {name === 'forward' && <path d="M6 4.5 11.5 10 6 15.5V4.5Z M12.5 4.5 18 10 12.5 15.5V4.5Z" fill="currentColor" />}
      {name === 'explore' && (
        <>
          <circle cx="10" cy="10" r="6.5" stroke="currentColor" strokeWidth="1.8" />
          <path d="M10.5 5.5 13.5 10.5 9.5 12.5 6.5 9.5 10.5 5.5Z" fill="currentColor" />
        </>
      )}
      {name === 'folder' && <path d="M3.5 6.5C3.5 5.67 4.17 5 5 5H8.5L10 7H15C15.83 7 16.5 7.67 16.5 8.5V15.5C16.5 16.33 15.83 17 15 17H5C4.17 17 3.5 16.33 3.5 15.5V6.5Z" stroke="currentColor" strokeWidth="1.5" fill="none" />}
      {name === 'library' && (
        <>
          <rect x="4" y="5" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <path d="M7 8H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M7 11H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M7 14H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </>
      )}
      {name === 'playlist' && (
        <>
          <circle cx="6" cy="6" r="1.5" fill="currentColor" />
          <path d="M8.5 6H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="6" cy="10" r="1.5" fill="currentColor" />
          <path d="M8.5 10H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="6" cy="14" r="1.5" fill="currentColor" />
          <path d="M8.5 14H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </>
      )}
      {name === 'heart' && (
        <path
          d="M10 16s-5.5-3.1-7-5.9C1.5 7.9 3.7 5 6.5 5 8 5 10 6.3 10 6.3S12 5 13.5 5C16.3 5 18.5 7.9 17 10.1 15.5 12.9 10 16 10 16Z"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
        />
      )}
    </svg>
  )
}

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
          <button type="button" className="control-button" aria-label="Previous">
            <AppIcon name="rewind" className="control-icon" />
          </button>
          <button type="button" className="control-button" aria-label="Play">
            <AppIcon name="play" className="control-icon" />
          </button>
          <button type="button" className="control-button" aria-label="Next">
            <AppIcon name="forward" className="control-icon" />
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
            <div className="brand-icon brand-icon-placeholder">
              <AppIcon name="explore" className="brand-placeholder-icon" />
            </div>
            <h2>Shark Player</h2>
          </div>

        <div className="nav-group">
          {navItems.map((item) => (
            <div key={item.label} className={`nav-item${item.active ? ' active' : ''}`}>
              <AppIcon name={item.icon} className="nav-item-icon" />
              <span className="nav-item-label">{item.label}</span>
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
        {/* <section className="header-panel">
          <div>
            <h1>Music Player</h1>
          </div>

          <div className="hero-track-card">
            <div className="hero-art hero-art-placeholder">
              <AppIcon name="play" className="hero-art-icon" />
            </div>
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
        </section> */}

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
