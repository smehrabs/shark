import { app } from 'electron'
import { execSync } from 'node:child_process'
import { join } from 'node:path'
import fs from 'node:fs'

export function getDefaultMusicFolder(): string {
  if (process.platform === 'linux') {
    try {
      const xdgMusic = execSync('xdg-user-dir MUSIC', { encoding: 'utf8' }).trim()
      if (xdgMusic && fs.existsSync(xdgMusic)) {
        return xdgMusic
      }
    } catch {
      // fall through to ~/Music
    }
  }

  return join(app.getPath('home'), 'Music')
}
