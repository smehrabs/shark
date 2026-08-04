import type { Track } from '../../types'
import { formatDuration } from '../../utils/library'

type PlayerBarProps = {
  currentTrack: Track | null
  isPlaying: boolean
  currentTime: number
  volume: number
  onTogglePlay: () => void
  onNext: () => void
  onPrevious: () => void
  onSeek: (time: number) => void
  onVolumeChange: (volume: number) => void
}

function PlayerBar({
  currentTrack,
  isPlaying,
  currentTime,
  volume,
  onTogglePlay,
  onNext,
  onPrevious,
  onSeek,
  onVolumeChange
}: PlayerBarProps): React.JSX.Element {
  const duration = currentTrack?.duration ?? 0
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (!currentTrack || duration <= 0) return
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = (e.clientX - rect.left) / rect.width
    onSeek(ratio * duration)
  }

  return (
    <footer className="player-bar">
      <div className="player-track-info">
        <div className="player-artwork">
          <span>♪</span>
        </div>
        <div className="player-meta">
          <p className="player-title">{currentTrack?.title ?? 'No track selected'}</p>
          <p className="player-artist">
            {currentTrack ? `${currentTrack.artist} · ${currentTrack.album}` : 'Select a track to play'}
          </p>
        </div>
      </div>

      <div className="player-controls">
        <div className="player-buttons">
          <button type="button" className="player-btn" onClick={onPrevious} disabled={!currentTrack}>
            ⏮
          </button>
          <button type="button" className="player-btn player-btn-main" onClick={onTogglePlay} disabled={!currentTrack}>
            {isPlaying ? '⏸' : '▶'}
          </button>
          <button type="button" className="player-btn" onClick={onNext} disabled={!currentTrack}>
            ⏭
          </button>
        </div>

        <div className="player-progress-row">
          <span className="player-time">{formatDuration(currentTime)}</span>
          <div className="player-progress" onClick={handleProgressClick}>
            <div className="player-progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="player-time">{formatDuration(duration)}</span>
        </div>
      </div>

      <div className="player-volume">
        <span className="player-volume-icon">🔊</span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => onVolumeChange(Number(e.target.value))}
          className="player-volume-slider"
        />
      </div>
    </footer>
  )
}

export default PlayerBar
