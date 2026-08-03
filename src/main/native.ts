import { app } from 'electron'
import path from 'node:path'

const addonPath = app.isPackaged
  ? path.join(process.resourcesPath, 'native', 'shark_native.node')
  : path.join(
      process.cwd(),
      'native',
      'build',
      'Release',
      'shark_native.node'
    )

export default require(addonPath)