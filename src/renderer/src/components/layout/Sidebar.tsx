import type { SidebarView } from '../../types'

type SidebarProps = {
  activeView: SidebarView
  onViewChange: (view: SidebarView) => void
  trackCount: number
  artistCount: number
  albumCount: number
  musicFolder?: string
  onSelectFolder: () => void
  onRescan: () => void
}

const navItems: { id: SidebarView; label: string; icon: string }[] = [
  { id: 'all', label: 'All Tracks', icon: '♫' },
  { id: 'artists', label: 'Artists', icon: '◎' },
  { id: 'albums', label: 'Albums', icon: '▣' },
  { id: 'folders', label: 'Folders', icon: '▤' }
]

function Sidebar({
  activeView,
  onViewChange,
  trackCount,
  artistCount,
  albumCount,
  musicFolder,
  onSelectFolder,
  onRescan
}: SidebarProps): React.JSX.Element {
  const folderName = musicFolder?.split('/').pop() ?? 'Not set'

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="sidebar-logo">♪</span>
        <div>
          <p className="sidebar-app-name">Shark</p>
          <p className="sidebar-app-tagline">Music Player</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`sidebar-nav-item${activeView === item.id ? ' active' : ''}`}
            onClick={() => onViewChange(item.id)}
          >
            <span className="sidebar-nav-icon">{item.icon}</span>
            <span className="sidebar-nav-label">{item.label}</span>
            {item.id === 'all' && <span className="sidebar-nav-count">{trackCount}</span>}
            {item.id === 'artists' && <span className="sidebar-nav-count">{artistCount}</span>}
            {item.id === 'albums' && <span className="sidebar-nav-count">{albumCount}</span>}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <p className="sidebar-folder-label">Music folder</p>
        <p className="sidebar-folder-name" title={musicFolder}>
          {folderName}
        </p>
        <div className="sidebar-actions">
          <button type="button" className="sidebar-action-btn" onClick={onSelectFolder}>
            Change
          </button>
          <button type="button" className="sidebar-action-btn" onClick={onRescan}>
            Rescan
          </button>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
