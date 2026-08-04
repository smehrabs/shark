export type Track = {
  id: string
  title: string
  artist: string
  album: string
  albumArtist: string
  duration: number
  genre: string
  year: number | null
  trackNumber: number | null
  filePath: string
  folder: string
  relativePath: string
  addedAt: string
}

export type LibraryState = {
  musicFolder?: string
  tracks: Track[]
  lastUpdated: string
}

export type ThemeState = {
  shouldUseDarkColors: boolean
  shouldUseHighContrastColors: boolean
  shouldUseInvertedColorScheme: boolean
  themeSource: 'system' | 'light' | 'dark'
}

export type SidebarView = 'all' | 'artists' | 'albums' | 'folders'

export type FolderNode = {
  name: string
  path: string
  children: FolderNode[]
  tracks: Track[]
}

export type AlbumGroup = {
  key: string
  album: string
  albumArtist: string
  year: number | null
  tracks: Track[]
}

export type ArtistGroup = {
  name: string
  tracks: Track[]
}

export type SortField = 'title' | 'artist' | 'album' | 'duration' | 'year'
export type SortDirection = 'asc' | 'desc'

export type PlayerState = {
  currentTrack: Track | null
  isPlaying: boolean
  currentTime: number
  volume: number
  queue: Track[]
  queueIndex: number
}
