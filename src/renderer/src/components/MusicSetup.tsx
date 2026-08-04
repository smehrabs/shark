type MusicSetupProps = {
  defaultFolder: string
  loading: boolean
  onSelectFolder: () => Promise<void>
  emptyFolder?: boolean
}

function MusicSetup({
  defaultFolder,
  loading,
  onSelectFolder,
  emptyFolder = false
}: MusicSetupProps): React.JSX.Element {
  return (
    <section className="setup-panel">
      <div className="setup-card">
        <p className="setup-title">Welcome to Shark</p>
        <p className="setup-description">
          {emptyFolder
            ? 'No audio files were found in the selected folder. Choose a different folder or add music files and rescan.'
            : 'Your music library is empty. Select a Music folder to scan your tracks and get started.'}
        </p>
        <p className="setup-hint">
          Default location: <strong>{defaultFolder}</strong>
        </p>
        <button type="button" className="primary-button" onClick={onSelectFolder} disabled={loading}>
          {loading ? 'Scanning…' : 'Choose music folder'}
        </button>
      </div>
    </section>
  )
}

export default MusicSetup
