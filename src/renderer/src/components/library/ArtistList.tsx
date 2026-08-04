import { useState } from 'react'
import type { ArtistGroup, Track } from '../../types'
import { formatTotalDuration } from '../../utils/library'
import TrackTable from './TrackTable'

type ArtistListProps = {
  artists: ArtistGroup[]
  currentTrackId?: string
  onPlayTrack: (track: Track, queue: Track[]) => void
}

function ArtistList({ artists, currentTrackId, onPlayTrack }: ArtistListProps): React.JSX.Element {
  const [selectedName, setSelectedName] = useState<string | null>(null)

  const selectedArtist = artists.find((a) => a.name === selectedName)

  if (selectedArtist) {
    return (
      <div className="artist-detail">
        <button type="button" className="back-btn" onClick={() => setSelectedName(null)}>
          ← Back to artists
        </button>
        <TrackTable
          tracks={selectedArtist.tracks}
          currentTrackId={currentTrackId}
          onPlayTrack={onPlayTrack}
          title={selectedArtist.name}
          subtitle={`${selectedArtist.tracks.length} tracks · ${formatTotalDuration(selectedArtist.tracks)}`}
        />
      </div>
    )
  }

  if (artists.length === 0) {
    return (
      <div className="content-empty">
        <p>No artists found</p>
      </div>
    )
  }

  return (
    <div className="artist-list-container">
      <header className="content-header">
        <h1 className="content-title">Artists</h1>
        <p className="content-subtitle">{artists.length} artists in your library</p>
      </header>

      <div className="artist-list">
        {artists.map((artist) => (
          <button
            key={artist.name}
            type="button"
            className="artist-row"
            onClick={() => setSelectedName(artist.name)}
          >
            <div className="artist-avatar">
              <span>{artist.name.charAt(0).toUpperCase()}</span>
            </div>
            <div className="artist-info">
              <p className="artist-name">{artist.name}</p>
              <p className="artist-meta">
                {artist.tracks.length} tracks · {formatTotalDuration(artist.tracks)}
              </p>
            </div>
            <span className="artist-chevron">›</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default ArtistList
