import { useState } from 'react'
import type { AlbumGroup, Track } from '../../types'
import { formatTotalDuration } from '../../utils/library'
import TrackTable from './TrackTable'

type AlbumGridProps = {
  albums: AlbumGroup[]
  currentTrackId?: string
  onPlayTrack: (track: Track, queue: Track[]) => void
}

function AlbumGrid({ albums, currentTrackId, onPlayTrack }: AlbumGridProps): React.JSX.Element {
  const [selectedKey, setSelectedKey] = useState<string | null>(null)

  const selectedAlbum = albums.find((a) => a.key === selectedKey)

  if (selectedAlbum) {
    return (
      <div className="album-detail">
        <button type="button" className="back-btn" onClick={() => setSelectedKey(null)}>
          ← Back to albums
        </button>
        <TrackTable
          tracks={selectedAlbum.tracks}
          currentTrackId={currentTrackId}
          onPlayTrack={onPlayTrack}
          title={selectedAlbum.album}
          subtitle={`${selectedAlbum.albumArtist}${selectedAlbum.year ? ` · ${selectedAlbum.year}` : ''} · ${selectedAlbum.tracks.length} tracks · ${formatTotalDuration(selectedAlbum.tracks)}`}
        />
      </div>
    )
  }

  if (albums.length === 0) {
    return (
      <div className="content-empty">
        <p>No albums found</p>
      </div>
    )
  }

  return (
    <div className="album-grid-container">
      <header className="content-header">
        <h1 className="content-title">Albums</h1>
        <p className="content-subtitle">{albums.length} albums in your library</p>
      </header>

      <div className="album-grid">
        {albums.map((album) => (
          <button
            key={album.key}
            type="button"
            className="album-card"
            onClick={() => setSelectedKey(album.key)}
          >
            <div className="album-artwork">
              <span>♫</span>
            </div>
            <p className="album-name">{album.album}</p>
            <p className="album-artist">{album.albumArtist}</p>
            <p className="album-meta">
              {album.tracks.length} tracks
              {album.year ? ` · ${album.year}` : ''}
            </p>
          </button>
        ))}
      </div>
    </div>
  )
}

export default AlbumGrid
