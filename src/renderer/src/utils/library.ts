import type { Track, AlbumGroup, ArtistGroup, FolderNode, SortField, SortDirection } from '../types'

export function formatDuration(seconds: number): string {
  if (!seconds || !Number.isFinite(seconds)) {
    return '—'
  }

  const total = Math.floor(seconds)
  const hours = Math.floor(total / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  const secs = total % 60

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  return `${minutes}:${String(secs).padStart(2, '0')}`
}

export function formatTotalDuration(tracks: Track[]): string {
  const total = tracks.reduce((sum, track) => sum + (track.duration || 0), 0)
  return formatDuration(total)
}

export function sortTracks(
  tracks: Track[],
  field: SortField,
  direction: SortDirection
): Track[] {
  const sorted = [...tracks].sort((a, b) => {
    let cmp = 0

    switch (field) {
      case 'title':
        cmp = a.title.localeCompare(b.title)
        break
      case 'artist':
        cmp = a.artist.localeCompare(b.artist)
        break
      case 'album':
        cmp = a.album.localeCompare(b.album)
        break
      case 'duration':
        cmp = a.duration - b.duration
        break
      case 'year':
        cmp = (a.year ?? 0) - (b.year ?? 0)
        break
    }

    return direction === 'asc' ? cmp : -cmp
  })

  return sorted
}

export function filterTracks(tracks: Track[], query: string): Track[] {
  const q = query.trim().toLowerCase()
  if (!q) return tracks

  return tracks.filter(
    (track) =>
      track.title.toLowerCase().includes(q) ||
      track.artist.toLowerCase().includes(q) ||
      track.album.toLowerCase().includes(q) ||
      track.genre.toLowerCase().includes(q) ||
      track.relativePath.toLowerCase().includes(q)
  )
}

export function groupByArtist(tracks: Track[]): ArtistGroup[] {
  const map = new Map<string, Track[]>()

  for (const track of tracks) {
    const key = track.artist || 'Unknown Artist'
    const existing = map.get(key) ?? []
    existing.push(track)
    map.set(key, existing)
  }

  return Array.from(map.entries())
    .map(([name, groupTracks]) => ({
      name,
      tracks: groupTracks.sort((a, b) => a.album.localeCompare(b.album) || a.title.localeCompare(b.title))
    }))
    .sort((a, b) => a.name.localeCompare(b.name))
}

export function groupByAlbum(tracks: Track[]): AlbumGroup[] {
  const map = new Map<string, AlbumGroup>()

  for (const track of tracks) {
    const key = `${track.albumArtist}::${track.album}`
    const existing = map.get(key)

    if (existing) {
      existing.tracks.push(track)
    } else {
      map.set(key, {
        key,
        album: track.album,
        albumArtist: track.albumArtist,
        year: track.year,
        tracks: [track]
      })
    }
  }

  return Array.from(map.values())
    .map((group) => ({
      ...group,
      tracks: group.tracks.sort((a, b) => (a.trackNumber ?? 0) - (b.trackNumber ?? 0) || a.title.localeCompare(b.title))
    }))
    .sort((a, b) => a.albumArtist.localeCompare(b.albumArtist) || a.album.localeCompare(b.album))
}

export function buildFolderTree(tracks: Track[], musicFolder?: string): FolderNode {
  const root: FolderNode = { name: 'Library', path: musicFolder ?? '', children: [], tracks: [] }

  for (const track of tracks) {
    const parts = track.relativePath.split('/')
    const fileName = parts.pop()
    if (!fileName) continue

    let current = root

    for (const part of parts) {
      let child = current.children.find((c) => c.name === part)
      if (!child) {
        child = {
          name: part,
          path: current.path ? `${current.path}/${part}` : part,
          children: [],
          tracks: []
        }
        current.children.push(child)
      }
      current = child
    }

    current.tracks.push(track)
  }

  const sortNodes = (node: FolderNode): void => {
    node.children.sort((a, b) => a.name.localeCompare(b.name))
    node.tracks.sort((a, b) => a.title.localeCompare(b.title))
    node.children.forEach(sortNodes)
  }

  sortNodes(root)
  return root
}

export function getTracksInFolder(node: FolderNode): Track[] {
  const tracks = [...node.tracks]

  for (const child of node.children) {
    tracks.push(...getTracksInFolder(child))
  }

  return tracks
}

export function getFolderDisplayPath(relativePath: string): string {
  const parts = relativePath.split('/')
  parts.pop()
  return parts.join('/') || '/'
}
