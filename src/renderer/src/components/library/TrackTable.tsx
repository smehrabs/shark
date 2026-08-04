import { useMemo, useState } from 'react'
import type { Track, SortField, SortDirection } from '../../types'
import { formatDuration, sortTracks } from '../../utils/library'

type TrackTableProps = {
  tracks: Track[]
  currentTrackId?: string
  onPlayTrack: (track: Track, queue: Track[]) => void
  title?: string
  subtitle?: string
}

function TrackTable({
  tracks,
  currentTrackId,
  onPlayTrack,
  title,
  subtitle
}: TrackTableProps): React.JSX.Element {
  const [sortField, setSortField] = useState<SortField>('title')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  const sortedTracks = useMemo(
    () => sortTracks(tracks, sortField, sortDirection),
    [tracks, sortField, sortDirection]
  )

  const handleSort = (field: SortField): void => {
    if (sortField === field) {
      setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const sortIndicator = (field: SortField): string => {
    if (sortField !== field) return ''
    return sortDirection === 'asc' ? ' ↑' : ' ↓'
  }

  if (tracks.length === 0) {
    return (
      <div className="content-empty">
        <p>No tracks found</p>
      </div>
    )
  }

  return (
    <div className="track-table-container">
      {(title || subtitle) && (
        <header className="content-header">
          {title && <h1 className="content-title">{title}</h1>}
          {subtitle && <p className="content-subtitle">{subtitle}</p>}
        </header>
      )}

      <div className="track-table-scroll">
        <table className="track-table">
          <thead>
            <tr>
              <th className="col-num">#</th>
              <th className="col-title sortable" onClick={() => handleSort('title')}>
                Title{sortIndicator('title')}
              </th>
              <th className="col-artist sortable" onClick={() => handleSort('artist')}>
                Artist{sortIndicator('artist')}
              </th>
              <th className="col-album sortable" onClick={() => handleSort('album')}>
                Album{sortIndicator('album')}
              </th>
              <th className="col-duration sortable" onClick={() => handleSort('duration')}>
                Duration{sortIndicator('duration')}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedTracks.map((track, index) => (
              <tr
                key={track.id}
                className={`track-row${currentTrackId === track.id ? ' playing' : ''}`}
                onDoubleClick={() => onPlayTrack(track, sortedTracks)}
              >
                <td className="col-num">
                  {currentTrackId === track.id ? (
                    <span className="playing-indicator">♪</span>
                  ) : (
                    index + 1
                  )}
                </td>
                <td className="col-title">
                  <button
                    type="button"
                    className="track-play-btn"
                    onClick={() => onPlayTrack(track, sortedTracks)}
                    title="Play"
                  >
                    ▶
                  </button>
                  <span>{track.title}</span>
                </td>
                <td className="col-artist">{track.artist}</td>
                <td className="col-album">{track.album}</td>
                <td className="col-duration">{formatDuration(track.duration)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TrackTable
