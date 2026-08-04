import { useMemo, useState } from 'react'
import type { LibraryState, SidebarView } from '../types'
import { useTheme } from '../hooks/useTheme'
import { usePlayer } from '../hooks/usePlayer'
import {
  buildFolderTree,
  filterTracks,
  groupByAlbum,
  groupByArtist,
  formatTotalDuration
} from '../utils/library'
import Sidebar from './layout/Sidebar'
import PlayerBar from './layout/PlayerBar'
import TrackTable from './library/TrackTable'
import ArtistList from './library/ArtistList'
import AlbumGrid from './library/AlbumGrid'
import FolderBrowser from './library/FolderBrowser'

type AppShellProps = {
  library: LibraryState
  onRescan: () => Promise<void>
  onSelectFolder: () => Promise<void>
}

function AppShell({ library, onRescan, onSelectFolder }: AppShellProps): React.JSX.Element {
  useTheme()

  const [activeView, setActiveView] = useState<SidebarView>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const player = usePlayer()

  const filteredTracks = useMemo(
    () => filterTracks(library.tracks, searchQuery),
    [library.tracks, searchQuery]
  )

  const artists = useMemo(() => groupByArtist(filteredTracks), [filteredTracks])
  const albums = useMemo(() => groupByAlbum(filteredTracks), [filteredTracks])
  const folderTree = useMemo(
    () => buildFolderTree(library.tracks, library.musicFolder),
    [library.tracks, library.musicFolder]
  )

  const allArtists = useMemo(() => groupByArtist(library.tracks), [library.tracks])
  const allAlbums = useMemo(() => groupByAlbum(library.tracks), [library.tracks])

  const handlePlayTrack = (track: typeof library.tracks[0], queue: typeof library.tracks): void => {
    const index = queue.findIndex((t) => t.id === track.id)
    player.playTrack(track, queue, index >= 0 ? index : 0)
  }

  const renderContent = (): React.JSX.Element => {
    switch (activeView) {
      case 'artists':
        return (
          <ArtistList
            artists={artists}
            currentTrackId={player.currentTrack?.id}
            onPlayTrack={handlePlayTrack}
          />
        )
      case 'albums':
        return (
          <AlbumGrid
            albums={albums}
            currentTrackId={player.currentTrack?.id}
            onPlayTrack={handlePlayTrack}
          />
        )
      case 'folders':
        return (
          <FolderBrowser
            root={folderTree}
            currentTrackId={player.currentTrack?.id}
            onPlayTrack={handlePlayTrack}
          />
        )
      default:
        return (
          <TrackTable
            tracks={filteredTracks}
            currentTrackId={player.currentTrack?.id}
            onPlayTrack={handlePlayTrack}
            title="All Tracks"
            subtitle={`${filteredTracks.length} tracks · ${formatTotalDuration(filteredTracks)}`}
          />
        )
    }
  }

  return (
    <div className="app-shell">
      <Sidebar
        activeView={activeView}
        onViewChange={setActiveView}
        trackCount={library.tracks.length}
        artistCount={allArtists.length}
        albumCount={allAlbums.length}
        musicFolder={library.musicFolder}
        onSelectFolder={() => void onSelectFolder()}
        onRescan={() => void onRescan()}
      />

      <main className="main-content">
        <header className="main-toolbar">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="search"
              placeholder="Search tracks, artists, albums…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        </header>

        <div className="main-viewport">{renderContent()}</div>
      </main>

      <PlayerBar
        currentTrack={player.currentTrack}
        isPlaying={player.isPlaying}
        currentTime={player.currentTime}
        volume={player.volume}
        onTogglePlay={player.togglePlay}
        onNext={player.playNext}
        onPrevious={player.playPrevious}
        onSeek={player.seek}
        onVolumeChange={player.setVolume}
      />
    </div>
  )
}

export default AppShell
