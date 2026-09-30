// Additional review probes: wording cues, accessible state, and storage failure.
import assert from 'node:assert/strict'
import { readFile, writeFile } from 'node:fs/promises'
import { chromium } from 'playwright'
import { lessons, lessonById, unitAssessments } from '../src/courseContent.ts'

const evidence = 'docs/learning-audit/evidence/'
const score = text => (text.match(/\b(check|inspect|correct|resolve|remove|verify|review|recalculate|regenerate|reconcile|trace|measure)\b/gi) ?? []).length * 2
  - (text.match(/\b(only|trust|assume|ignore|immediately|without|regardless|guarantees)\b/gi) ?? []).length * 3
const rows = [...lessons.filter(l => !l.numeric).map(l => ({ ...l, group: 'lesson' })), ...unitAssessments.flatMap((u, i) => u.map((q, j) => ({ ...q, id: `unit-${i}:${j}`, group: 'unit' })))].map(q => {
  const scores = q.options.map(score)
  const top = scores.map((v, i) => v === Math.max(...scores) ? i : null).filter(i => i !== null)
  return { group: q.group, id: q.id, prompt: q.prompt, scores, top, expectedCorrectWithRandomTie: top.includes(q.correct) ? 1 / top.length : 0 }
})
const stats = Object.fromEntries(['lesson', 'unit'].map(group => {
  const items = rows.filter(x => x.group === group)
  return [group, { questions: items.length, uniqueHighestCorrect: items.filter(q => q.top.length === 1 && q.expectedCorrectWithRandomTie === 1).length, uniqueHighestTotal: items.filter(q => q.top.length === 1).length, expectedCorrect: items.reduce((n, q) => n + q.expectedCorrectWithRandomTie, 0) }]
}))
await writeFile(evidence + 'question-cues.json', JSON.stringify({ description: 'Static diagnostic chosen after reading the bank. Score check-action words +2 and shortcut words -3; average tied maxima equally. This is not a blind learner trial, browser score, or validated item-difficulty measure.', positive: 'check inspect correct resolve remove verify review recalculate regenerate reconcile trace measure', negative: 'only trust assume ignore immediately without regardless guarantees', stats, rows }, null, 2))
const runtime = JSON.parse(await readFile(evidence + 'runtime.json', 'utf8'))
const browser = await chromium.launch({ headless: true })
const context = await browser.newContext()
await context.addInitScript(values => {
  localStorage.setItem('circuitlab.lesson-0.1.v1', JSON.stringify(values.intro))
  localStorage.setItem('circuitlab.course.v2', JSON.stringify(values.course))
}, runtime.baselineRecord)
const page = await context.newPage()
const button = name => page.getByRole('button', { name, exact: true })
await page.goto('http://127.0.0.1:5173')
await button('Work safely. Review activity').click()
await button('Continue').click()
await button(lessonById['0.2'].options[1]).click()
const choiceStates = await page.locator('.answer-options button').evaluateAll(nodes => nodes.map(n => ({ text: n.textContent, selectedClass: n.classList.contains('selected'), ariaPressed: n.getAttribute('aria-pressed'), ariaChecked: n.getAttribute('aria-checked'), role: n.getAttribute('role') })))
await button('Check answer').click()
await button('Continue').click()
const focusAfterContinue = await page.evaluate(() => ({ tag: document.activeElement?.tagName, text: document.activeElement?.textContent?.slice(0,80), headingTabindex: document.querySelector('h1')?.getAttribute('tabindex') }))
await page.evaluate(() => { Storage.prototype.setItem = () => { throw Error('Audit: storage unavailable') } })
await page.getByRole('textbox').fill('Storage failure audit note')
await button('Save record').click()
await page.getByRole('heading', { name: 'Practice recorded.' }).waitFor()
const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('circuitlab.course.v2')))
assert.equal(saved.lessons['0.2'].note, '')
await button('Return to path').click()
await button('Work safely. Review activity').click()
await button('Continue').click()
await button(lessonById['0.2'].options[1]).click()
await button('Check answer').click()
await button('Continue').click()
assert.equal(await page.getByRole('textbox').inputValue(), 'Storage failure audit note')
// New page clears the in-memory record. Its saved record still has the old note.
const second = await context.newPage()
await second.goto('http://127.0.0.1:5173')
const persistedAfterReopen = await second.evaluate(() => JSON.parse(localStorage.getItem('circuitlab.course.v2')).lessons['0.2'].note)
assert.equal(persistedAfterReopen, '')
const sourceFollowups = []
for (const url of ['https://learn.adafruit.com/breadboards-for-beginners/other-breadboard-sizes', 'https://learn.adafruit.com/adafruit-guide-excellent-soldering/preparation']) {
  const response = await fetch(url)
  const html = await response.text()
  const text = html.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, ' ').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ')
  sourceFollowups.push({ url, status: response.status, excerpts: ['split', 'break', 'eyes', 'glasses', 'ventilat'].map(word => {
    const position = text.toLowerCase().indexOf(word)
    return { word, found: position >= 0, text: position >= 0 ? text.slice(Math.max(0, position - 80), position + 400) : '' }
  }) })
}
await writeFile(evidence + 'probes.json', JSON.stringify({ checkedAt: new Date().toISOString(), choiceStates, focusAfterContinue, storageFailure: { successMessageStillShown: true, noteAvailableInMemory: true, persistedAfterReopen, silentFailure: true }, sourceFollowups }, null, 2))
await browser.close()
console.log(JSON.stringify({ stats, choiceStates, focusAfterContinue, storageFailure: 'confirmed', sourceFollowups }, null, 2))
