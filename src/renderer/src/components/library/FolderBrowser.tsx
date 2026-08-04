import { useState } from 'react'
import type { FolderNode, Track } from '../../types'
import { formatTotalDuration, getTracksInFolder } from '../../utils/library'
import TrackTable from './TrackTable'

type FolderBrowserProps = {
  root: FolderNode
  currentTrackId?: string
  onPlayTrack: (track: Track, queue: Track[]) => void
}

function FolderTreeItem({
  node,
  depth,
  selectedPath,
  onSelect
}: {
  node: FolderNode
  depth: number
  selectedPath: string
  onSelect: (path: string) => void
}): React.JSX.Element | null {
  const [expanded, setExpanded] = useState(depth < 2)
  const hasChildren = node.children.length > 0
  const trackCount = getTracksInFolder(node).length
  const isSelected = selectedPath === node.path

  if (depth === 0) {
    return (
      <>
        {node.children.map((child) => (
          <FolderTreeItem
            key={child.path}
            node={child}
            depth={depth + 1}
            selectedPath={selectedPath}
            onSelect={onSelect}
          />
        ))}
      </>
    )
  }

  return (
    <div className="folder-tree-branch">
      <button
        type="button"
        className={`folder-tree-item${isSelected ? ' selected' : ''}`}
        style={{ paddingLeft: `${(depth - 1) * 16 + 8}px` }}
        onClick={() => {
          onSelect(node.path)
          if (hasChildren) setExpanded((e) => !e)
        }}
      >
        {hasChildren && (
          <span className="folder-tree-chevron">{expanded ? '▾' : '▸'}</span>
        )}
        {!hasChildren && <span className="folder-tree-chevron spacer" />}
        <span className="folder-tree-icon">📁</span>
        <span className="folder-tree-name">{node.name}</span>
        <span className="folder-tree-count">{trackCount}</span>
      </button>

      {expanded &&
        node.children.map((child) => (
          <FolderTreeItem
            key={child.path}
            node={child}
            depth={depth + 1}
            selectedPath={selectedPath}
            onSelect={onSelect}
          />
        ))}
    </div>
  )
}

function findNodeByPath(root: FolderNode, targetPath: string): FolderNode | null {
  if (root.path === targetPath) return root

  for (const child of root.children) {
    const found = findNodeByPath(child, targetPath)
    if (found) return found
  }

  return null
}

function FolderBrowser({ root, currentTrackId, onPlayTrack }: FolderBrowserProps): React.JSX.Element {
  const firstChild = root.children[0]
  const [selectedPath, setSelectedPath] = useState(firstChild?.path ?? '')

  const selectedNode = selectedPath ? findNodeByPath(root, selectedPath) : null
  const tracks = selectedNode ? getTracksInFolder(selectedNode) : []

  return (
    <div className="folder-browser">
      <aside className="folder-tree-panel">
        <p className="folder-tree-heading">Browse folders</p>
        <div className="folder-tree">
          <FolderTreeItem
            node={root}
            depth={0}
            selectedPath={selectedPath}
            onSelect={setSelectedPath}
          />
        </div>
      </aside>

      <div className="folder-content">
        <TrackTable
          tracks={tracks}
          currentTrackId={currentTrackId}
          onPlayTrack={onPlayTrack}
          title={selectedNode?.name ?? 'Folders'}
          subtitle={`${tracks.length} tracks · ${formatTotalDuration(tracks)}`}
        />
      </div>
    </div>
  )
}

export default FolderBrowser
