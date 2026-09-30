// Fetch the source URLs for review. Keep full publisher documents in a temporary
// cache; the repository receives only status, fingerprints, and review notes.
import { createHash } from 'node:crypto'
import { mkdir, mkdtemp, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { sources } from '../src/courseContent.ts'

const cache = await mkdtemp(path.join(tmpdir(), 'circuitlab-source-review-'))
const evidence = path.resolve('docs/learning-audit/evidence')
await mkdir(evidence, { recursive: true })
const extra = {
  E1: { title: 'Dunlosky et al., effective learning techniques', url: 'https://www.psychologicalscience.org/journals/pspi/1529100612453266/' },
  E2: { title: 'How People Learn II, implications for learning', url: 'https://www.nationalacademies.org/read/24783/chapter/9' },
}
const reviewed = await Promise.all(Object.entries({ ...sources, ...extra }).map(async ([id, source]) => {
  try {
    const response = await fetch(source.url, { signal: AbortSignal.timeout(45000) })
    const data = Buffer.from(await response.arrayBuffer())
    const type = response.headers.get('content-type')
    const file = path.join(cache, `${id}.${type?.includes('pdf') ? 'pdf' : 'html'}`)
    await writeFile(file, data)
    if (!type?.includes('pdf')) {
      const plain = data.toString().replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, ' ').replace(/<[^>]*>/g, ' ').replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n))).replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&[a-z]+;/g, ' ').replace(/\s+/g, ' ').trim()
      await writeFile(path.join(cache, `${id}.txt`), plain)
    }
    return { id, ...source, status: response.status, finalUrl: response.url, contentType: type, bytes: data.length, sha256: createHash('sha256').update(data).digest('hex'), retrievedAt: new Date().toISOString(), cacheFile: file }
  } catch (error) { return { id, ...source, error: error.message, retrievedAt: new Date().toISOString() } }
}))
const manifest = reviewed.map(({ cacheFile: _cacheFile, ...source }) => source)
await writeFile(path.join(evidence, 'source-fetch.json'), JSON.stringify({ sources: manifest }, null, 2))
console.log(JSON.stringify({ cache, sources: reviewed.map(({ id, status, bytes, error }) => ({ id, status, bytes, error })) }, null, 2))
