import {chromium} from 'playwright'
import {mkdir, writeFile} from 'node:fs/promises'
import {courseUnits, coursePathIds} from '../src/courseContent.ts'
import {emptyRecord, RECORD_KEY} from '../src/learningStore.ts'

const out = 'ui-previews/polish'
await mkdir(out, {recursive: true})
const browser = await chromium.launch({headless: true})
const page = await browser.newPage({viewport: {width: 1280, height: 900}})
const result = {lessons: [], errors: []}
page.on('pageerror', e => result.errors.push(e.message))
page.on('dialog', d => void d.accept())
try {
  await page.goto(process.env.LEARNING_TEST_URL ?? 'http://127.0.0.1:5174')
  await page.screenshot({path: `${out}/path.png`})
  const seed = emptyRecord()
  for (const id of coursePathIds) seed.completions[id] = {at: new Date().toISOString(), note: '', physical: 'pending', fields: {}}
  await page.evaluate(({key, seed}) => localStorage.setItem(key, JSON.stringify(seed)), {key: RECORD_KEY, seed})
  await page.reload()
  for (const id of courseUnits.flatMap(u => u.lessonIds)) {
    await page.locator('.trail-node').nth(coursePathIds.indexOf(id)).click()
    await page.getByRole('button', {name: 'Begin practice', exact: true}).waitFor()
    await page.locator('.task-artifact').screenshot({path: `${out}/diagram-${id}.png`})
    if (['E.1', 'E.6', '0.1', '1.5', '5.4'].includes(id)) await page.screenshot({path: `${out}/lesson-${id}.png`, fullPage: true})
    const reading = await page.locator('.lesson-reading').innerText()
    const svg = await page.locator('.task-artifact svg').evaluateAll(nodes => nodes.map(svg => {
      const bounds = svg.getBoundingClientRect()
      const labels = [...svg.querySelectorAll('text')].map(node => ({text: node.textContent, rect: node.getBoundingClientRect().toJSON()}))
      return {
        name: svg.getAttribute('aria-label'),
        clipped: labels.filter(({rect:r}) => r.x < bounds.x - 1 || r.right > bounds.right + 1 || r.y < bounds.y - 1 || r.bottom > bounds.bottom + 1).map(l => l.text),
        overlaps: labels.flatMap((a,i) => labels.slice(i+1).filter(b => Math.min(a.rect.right,b.rect.right)-Math.max(a.rect.x,b.rect.x)>2 && Math.min(a.rect.bottom,b.rect.bottom)-Math.max(a.rect.y,b.rect.y)>2).map(b => [a.text,b.text]))
      }
    }))
    result.lessons.push({id, reading, svg})
    await page.getByRole('button', {name: 'Return to lesson path', exact: true}).click()
  }
  console.log(JSON.stringify({errors: result.errors, diagrams: result.lessons.filter(l=>l.svg.some(s=>s.clipped.length||s.overlaps.length)).map(({id,svg})=>({id,svg}))},null,2))
} finally {
  await writeFile(`${out}/audit.json`, JSON.stringify(result, null, 2))
  await browser.close()
}
