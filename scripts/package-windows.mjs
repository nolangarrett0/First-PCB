import { spawnSync } from 'node:child_process'
import { copyFileSync, mkdtempSync, mkdirSync, readdirSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

const target = process.argv[2]
if (!['portable', 'nsis'].includes(target)) {
  throw new Error('Expected portable or nsis packaging target')
}

// Windows may deny Electron Builder's temporary directory rename inside Documents.
// Package in the system temp directory, then copy the finished app into release/.
const stagingRoot = mkdtempSync(join(tmpdir(), 'first-pcb-builder-'))
const outputDir = join(stagingRoot, 'output')
const projectRoot = resolve(import.meta.dirname, '..')
const releaseDir = join(projectRoot, 'release')

try {
  const result = spawnSync(process.execPath, [
    join(projectRoot, 'node_modules', 'electron-builder', 'cli.js'),
    '--win', target, '--x64',
    `--config.directories.output=${outputDir}`,
  ], { cwd: projectRoot, stdio: 'inherit' })

  if (result.error) throw result.error
  if (result.status !== 0) process.exitCode = result.status || 1
  else {
    mkdirSync(releaseDir, { recursive: true })
    const artifacts = readdirSync(outputDir).filter((name) =>
      name.endsWith('.exe') && !name.includes('unpacked'))
    if (artifacts.length !== 1) throw new Error(`Expected one executable, found ${artifacts.length}`)
    copyFileSync(join(outputDir, artifacts[0]), join(releaseDir, artifacts[0]))
    console.log(`Ready: ${join(releaseDir, artifacts[0])}`)
  }
} finally {
  // The staging path is generated inside the system temp directory above.
  if (stagingRoot.startsWith(resolve(tmpdir()) + '\\')) {
    try {
      rmSync(stagingRoot, { recursive: true, force: true, maxRetries: 5, retryDelay: 1000 })
    } catch (error) {
      console.warn(`Could not remove temporary build files: ${error.message}`)
    }
  }
}
