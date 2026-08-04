import { app } from 'electron'
import fs from 'node:fs/promises'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import { parseFile } from 'music-metadata'

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

const AUDIO_EXTENSIONS = new Set([
  '.mp3',
  '.wav',
  '.flac',
  '.m4a',
  '.aac',
  '.ogg',
  '.opus',
  '.wma',
  '.aiff',
  '.aif'
])

const DB_FILENAME = 'library.json'

function getDbPath(): string {
  return path.join(app.getPath('userData'), DB_FILENAME)
}

const defaultState: LibraryState = {
  tracks: [],
  lastUpdated: new Date().toISOString()
}

async function writeState(state: LibraryState): Promise<void> {
  const dbPath = getDbPath()
  await fs.mkdir(path.dirname(dbPath), { recursive: true })
  await fs.writeFile(dbPath, JSON.stringify(state, null, 2), 'utf8')
}

async function readState(): Promise<LibraryState> {
  const dbPath = getDbPath()
  try {
    const raw = await fs.readFile(dbPath, 'utf8')
    const parsed = JSON.parse(raw) as LibraryState
    return {
      ...defaultState,
      ...parsed,
      tracks: Array.isArray(parsed.tracks) ? parsed.tracks : []
    }
  } catch (error: unknown) {
    if (error instanceof Error && (error as { code?: string }).code === 'ENOENT') {
      await writeState(defaultState)
      return defaultState
    }
    throw error
  }
}

async function extractMetadata(
  filePath: string,
  fallbackTitle: string
): Promise<Omit<Track, 'id' | 'filePath' | 'folder' | 'relativePath' | 'addedAt'>> {
  try {
    const metadata = await parseFile(filePath, { duration: true })
    const { common, format } = metadata

    const artist =
      common.artist ??
      (common.artists && common.artists.length > 0 ? common.artists.join(', ') : '') ??
      'Unknown Artist'

    const album = common.album ?? 'Unknown Album'
    const albumArtist = common.albumartist ?? artist
    const title = common.title ?? fallbackTitle
    const genre = common.genre?.[0] ?? ''
    const year = common.year ?? null
    const trackNumber = common.track?.no ?? null
    const duration = format.duration ?? 0

    return {
      title,
      artist,
      album,
      albumArtist,
      duration,
      genre,
      year,
      trackNumber
    }
  } catch {
    return {
      title: fallbackTitle,
      artist: 'Unknown Artist',
      album: 'Unknown Album',
      albumArtist: 'Unknown Artist',
      duration: 0,
      genre: '',
      year: null,
      trackNumber: null
    }
  }
}

async function scanFolder(folder: string, rootFolder: string): Promise<Track[]> {
  const tracks: Track[] = []
  let items

  try {
    items = await fs.readdir(folder, { withFileTypes: true })
  } catch {
    return tracks
  }

  for (const item of items) {
    const itemPath = path.join(folder, item.name)

    if (item.isDirectory()) {
      tracks.push(...(await scanFolder(itemPath, rootFolder)))
      continue
    }

    if (!item.isFile()) {
      continue
    }

    const ext = path.extname(item.name).toLowerCase()
    if (!AUDIO_EXTENSIONS.has(ext)) {
      continue
    }

    const fallbackTitle = path.basename(item.name, ext)
    const meta = await extractMetadata(itemPath, fallbackTitle)

    tracks.push({
      id: randomUUID(),
      ...meta,
      filePath: itemPath,
      folder,
      relativePath: path.relative(rootFolder, itemPath),
      addedAt: new Date().toISOString()
    })
  }

  return tracks
}

export async function getLibraryState(): Promise<LibraryState> {
  const state = await readState()
  if (state.musicFolder && state.tracks.length === 0) {
    return await rescanLibrary(state.musicFolder)
  }
  return state
}

export async function rescanLibrary(folder: string): Promise<LibraryState> {
  const tracks = await scanFolder(folder, folder)
  tracks.sort((a, b) => a.relativePath.localeCompare(b.relativePath))

  const state: LibraryState = {
    musicFolder: folder,
    tracks,
    lastUpdated: new Date().toISOString()
  }
  await writeState(state)
  return state
}

export async function setMusicFolderAndScan(folder: string): Promise<LibraryState> {
  return await rescanLibrary(folder)
}
