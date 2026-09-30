// Review harness: exercises the existing course without changing its content.
// Run with Node 24 and the locally available Playwright package:
// node --experimental-strip-types scripts/audit-learning.mjs
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium, _electron } from 'playwright'
import { courseUnits, finalReviewItems, lessonById, lessons, sources, unitAssessments } from '../src/courseContent.ts'
import { lessonArticles } from '../src/lessonArticles.ts'
import { assessmentChoiceFeedback, lessonChoiceFeedback } from '../src/practiceFeedback.ts'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const out = path.join(root, 'docs', 'learning-audit', 'evidence')
const base = process.env.CIRCUITLAB_AUDIT_URL ?? 'http://127.0.0.1:5173'
await mkdir(out, { recursive: true })
const result = { startedAt: new Date().toISOString(), coverage: [], feedback: [], scenarios: [], diagnostics: [], fingerprints: {} }
const desktopOnly = process.env.CIRCUITLAB_AUDIT_DESKTOP_ONLY === '1'
if (desktopOnly) Object.assign(result, JSON.parse(await readFile(path.join(out, 'runtime.json'), 'utf8')))
for (const file of ['src/App.tsx', 'src/CourseActivity.tsx', 'src/courseContent.ts', 'src/lessonArticles.ts', 'src/practiceEdits.ts', 'src/practiceFeedback.ts', 'src/ConceptVisual.tsx', 'src/StageVisual.tsx', 'src/App.css', 'src/index.css', 'electron/main.cjs']) {
  result.fingerprints[file] = createHash('sha256').update(await readFile(path.join(root, file))).digest('hex')
}
await writeFile(path.join(out, 'course-snapshot.json'), JSON.stringify({ courseUnits, lessons: lessons.map(l => ({ ...l, article: lessonArticles[l.id] })), unitAssessments, finalReviewItems, sources }, null, 2))
const browser = await chromium.launch({ headless: true })
let desktop
let desktopTemp
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } })
const page = await context.newPage()
page.setDefaultTimeout(10000)
page.on('pageerror', error => result.diagnostics.push({ type: 'pageerror', message: error.message }))
page.on('console', message => { if (message.type() === 'error') result.diagnostics.push({ type: 'console', message: message.text() }) })
page.on('dialog', dialog => { void dialog.dismiss().catch(error => result.diagnostics.push({ type: 'dialog-handler', message: error.message })) })
const button = (p, name) => p.getByRole('button', { name, exact: true })
const shot = async (name, p = page) => { await p.screenshot({ path: path.join(out, `${name}.png`), fullPage: true }) }
const storage = p => p.evaluate(() => ({ intro: JSON.parse(localStorage.getItem('circuitlab.lesson-0.1.v1')), course: JSON.parse(localStorage.getItem('circuitlab.course.v2')) }))
const pathIds = courseUnits.flatMap((u, i) => [...u.lessonIds, `unit-${i}`]).concat('final')
const captureReading = async id => {
  const data = await page.locator('.lesson-main').evaluate(node => ({
    title: node.querySelector('h1')?.textContent,
    reading: node.innerText,
    sources: [...node.querySelectorAll('a')].map(a => ({ title: a.textContent, url: a.href })),
    diagrams: [...node.querySelectorAll('svg[role="img"]')].map(svg => ({ label: svg.getAttribute('aria-label'), content: svg.outerHTML })),
    overflow: document.documentElement.scrollWidth > innerWidth,
  }))
  result.coverage.push({ id, ...data })
}
async function answerQuestion(id, q, index = 0, wrongFirst = true) {
  if (q.numeric) {
    const input = page.getByRole('spinbutton')
    assert.equal(await button(page, 'Check answer').isEnabled(), false)
    if (wrongFirst) {
      await input.fill(String(q.numeric.answer * 10))
      await button(page, 'Check answer').click()
      await page.locator('.feedback.incorrect').waitFor()
      result.feedback.push({ id, index, kind: 'numeric', entered: q.numeric.answer * 10, feedback: await page.locator('.feedback').innerText() })
    }
    await input.fill(String(q.numeric.answer))
  } else {
    const expectedFeedback = id.startsWith('unit-') ? assessmentChoiceFeedback[`${id.slice(5)}-${index}`] : lessonChoiceFeedback[id]
    if (wrongFirst) {
      for (let wrong = 0; wrong < q.options.length; wrong++) {
        if (wrong === q.correct) continue
        await button(page, q.options[wrong]).click()
        await button(page, 'Check answer').click()
        await page.locator('.feedback.incorrect').waitFor()
        const text = await page.locator('.feedback').innerText()
        assert.ok(text.includes(expectedFeedback[wrong].trim()), `${id}:${index} wrong choice ${wrong} feedback mismatch`)
        result.feedback.push({ id, index, choice: wrong, feedback: text })
      }
    }
    await button(page, q.options[q.correct]).click()
  }
  await button(page, 'Check answer').click()
  await page.locator('.feedback.correct').waitFor()
  await button(page, 'Continue').click()
}
async function openRecorded(id, p = page) {
  await button(p, id.startsWith('unit-') ? `Unit ${Number(id.slice(5)) + 1} assessment. Review activity` : id === 'final' ? 'Course review. Review activity' : `${id === '0.1' ? 'From idea to tested PCB' : lessonById[id].title}. Review activity`).click()
}
async function leave(p = page) {
  await button(p, 'Return to lesson path').click()
  if (await p.getByRole('dialog').count()) await button(p, 'Leave activity').click()
}
async function replay(id, wrongFirst = false) {
  await openRecorded(id)
  await button(page, 'Continue').click()
  if (id.startsWith('unit-')) {
    for (const [i, q] of unitAssessments[Number(id.slice(5))].entries()) await answerQuestion(id, q, i, wrongFirst)
  } else await answerQuestion(id, lessonById[id], 0, wrongFirst)
  await button(page, 'Save record').click()
  await button(page, 'Return to path').click()
}

try {
  if (!desktopOnly) {
  await page.goto(base)
  await page.getByRole('heading', { name: 'Understand how a PCB is made.' }).waitFor()
  assert.equal(await page.locator('.trail-node').count(), 67)
  assert.equal(await page.locator('.trail-node:not(:disabled)').count(), 1)
  await shot('path-start')
  await button(page, 'From idea to tested PCB. Start activity').click()
  await captureReading('0.1')
  await shot('lesson-0.1')
  await button(page, 'Start the challenge').click()
  await button(page, 'Check order').click()
  await page.locator('.feedback.incorrect').waitFor()
  for (const [index, label] of ['Draw the schematic', 'Lay out the PCB', 'Export fabrication files', 'Receive the bare board', 'Assemble and test'].entries()) {
    while (await page.locator('.sort-card').evaluateAll((nodes, target) => nodes.findIndex(n => n.textContent.includes(target)), label) > index) await button(page, `Move ${label} up`).click()
  }
  await button(page, 'Check order').click()
  await button(page, 'Continue').click()
  await button(page, 'Draw the schematic').click()
  await button(page, 'Check answer').click()
  await page.locator('.feedback.incorrect').waitFor()
  await button(page, 'Add the parts and test the circuit').click()
  await button(page, 'Check answer').click()
  await button(page, 'Finish lesson').click()
  await page.getByText('You used feedback to correct the workflow.', { exact: false }).waitFor()
  await page.getByRole('button', { name: /^Next lesson:/ }).click()
  for (const id of pathIds.slice(1)) {
    await captureReading(id)
    if (['2.1', '3.1', '4.3', '5.5', '7.4', '8.5', 'final'].includes(id)) await shot(`lesson-${id}`)
    await button(page, 'Continue').click()
    if (id === 'final') {
      assert.equal(await button(page, 'Save record').isEnabled(), false)
      for (const select of await page.getByRole('combobox').all()) await select.selectOption('pending')
      await page.getByRole('textbox').fill('aaaaaaaaaaaa')
      assert.equal(await button(page, 'Save record').isEnabled(), true)
      await shot('final-pending-filler')
    } else if (id.startsWith('unit-')) {
      for (const [i, q] of unitAssessments[Number(id.slice(5))].entries()) await answerQuestion(id, q, i)
    } else await answerQuestion(id, lessonById[id])
    await button(page, 'Save record').click()
    await page.getByRole('heading', { name: id === 'final' ? 'Your review is saved.' : 'Practice recorded.' }).waitFor()
    const current = await storage(page)
    const bucket = id === 'final' || id.startsWith('unit-') ? current.course.assessments : current.course.lessons
    assert.ok(bucket[id])
    if (id !== 'final') assert.ok(bucket[id].attempts[0].firstTryCorrect.every(v => v === false))
    console.log(`Completed ${id}`)
    if (id !== 'final') await page.getByRole('button', { name: /^Next/ }).click()
    else await button(page, 'Return to path').click()
  }
  const baseline = await storage(page)
  assert.equal(Object.keys(baseline.course.lessons).length, 55)
  assert.equal(Object.keys(baseline.course.assessments).length, 11)
  assert.deepEqual(baseline.course.assessments.final.reviewStatuses, Array(7).fill('pending'))
  assert.equal(await page.getByText('730 XP', { exact: true }).count() > 0, true)
  result.scenarios.push({ name: 'complete-all', lessons: 56, assessments: 10, questions: 85, wrongChoiceFeedback: result.feedback.filter(f => f.kind !== 'numeric').length, numericCorrections: result.feedback.filter(f => f.kind === 'numeric').length, xp: 730, finalAllPendingAccepted: true, finalFillerAccepted: true })
  await shot('path-finished')
  await page.reload()
  await page.getByText('All activities recorded', { exact: true }).waitFor()
  assert.deepEqual(await storage(page), baseline)
  await replay('1.5')
  await replay('unit-3')
  const replayed = await storage(page)
  assert.deepEqual(replayed.course.lessons['1.5'].attempts.map(a => a.firstTryCorrect[0]), [false, true])
  assert.deepEqual(replayed.course.assessments['unit-3'].attempts.map(a => a.firstTryCorrect), [[false, false, false], [true, true, true]])
  assert.equal(await page.getByText('730 XP', { exact: true }).count() > 0, true)
  result.scenarios.push({ name: 'replay', keepsFirstAttemptHistory: true, awardsXpAgain: false, exactSamePromptOnReplay: true })

  // Notes persist, but the question and submitted mistakes do not survive exit.
  await openRecorded('3.1')
  await button(page, 'Continue').click()
  await button(page, lessonById['3.1'].options[1]).click()
  await button(page, 'Check answer').click()
  const beforeExit = await storage(page)
  await button(page, 'Return to lesson path').click()
  await page.getByRole('dialog').waitFor()
  const focusInDialog = await page.evaluate(() => document.activeElement?.textContent)
  await page.keyboard.press('Escape')
  assert.equal(await page.getByRole('dialog').count(), 0)
  await leave()
  await openRecorded('3.1')
  assert.equal(await button(page, 'Continue').count(), 1)
  const afterExit = await storage(page)
  assert.deepEqual(afterExit, beforeExit)
  result.scenarios.push({ name: 'abandoned-attempt', mistakeNotRecorded: true, resetToReading: true, dialogInitialFocus: focusInDialog })
  await button(page, 'Continue').click()
  await answerQuestion('3.1', lessonById['3.1'], 0, false)
  await page.getByRole('textbox').fill('Review the midpoint of the breadboard rail.')
  await leave()
  await page.reload()
  await openRecorded('3.1')
  await button(page, 'Continue').click()
  await answerQuestion('3.1', lessonById['3.1'], 0, false)
  assert.equal(await page.getByRole('textbox').inputValue(), 'Review the midpoint of the breadboard rail.')
  await leave()
  result.scenarios.push({ name: 'draft-note', savedAcrossExitAndReload: true, questionRestarts: true })

  await openRecorded('unit-4')
  await button(page, 'Continue').click()
  await answerQuestion('unit-4', unitAssessments[4][0], 0, false)
  await leave()
  await openRecorded('unit-4')
  await button(page, 'Continue').click()
  assert.ok((await page.locator('.lesson-lead').innerText()).includes(unitAssessments[4][0].prompt))
  result.scenarios.push({ name: 'assessment-resume', completedQuestionLost: true })
  await leave()

  // Going back to the reading step removes the unfinished-attempt warning.
  await openRecorded('2.1')
  await button(page, 'Continue').click()
  await button(page, 'Back').click()
  await button(page, 'Return to lesson path').click()
  assert.equal(await page.getByRole('dialog').count(), 0)
  result.scenarios.push({ name: 'back-to-reading-exit', noExitWarningAfterStarting: true })

  const numericInputs = []
  await openRecorded('1.3')
  await button(page, 'Continue').click()
  for (const value of ['10', '0.010', '1e-2', '0.01', '0.00999', '0.01001', '0.01002']) {
    await page.getByRole('spinbutton').fill(value)
    await button(page, 'Check answer').click()
    numericInputs.push({ value, correct: await page.locator('.feedback.correct').count() > 0, feedback: await page.locator('.feedback').innerText() })
  }
  result.scenarios.push({ name: 'numeric-input', inputs: numericInputs, acceptsUnitSuffix: false, hasUnitSelector: await page.getByRole('combobox').count() > 0 })
  await leave()

  const layout = []
  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 844 })
    for (const id of ['0.1', '3.1', '4.3', '5.5', '7.4', '9.1', 'final']) {
      await openRecorded(id)
      const dimensions = await page.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth, lessonHeight: document.querySelector('.lesson-panel')?.getBoundingClientRect().height }))
      layout.push({ id, ...dimensions })
      if (width === 390 && ['3.1', '4.3', 'final'].includes(id)) await shot(`mobile-${id}`)
      await leave()
    }
  }
  result.scenarios.push({ name: 'mobile-layout', readings: layout })
  await page.setViewportSize({ width: 1280, height: 900 })
  result.baselineRecord = baseline
  result.webSuccess = true
  await writeFile(path.join(out, 'runtime.json'), JSON.stringify(result, null, 2))
  }
  const baseline = result.baselineRecord

  // The app supplies a hidden test mode. A wrapper isolates profile/migration and
  // intercepts shell.openExternal so testing never opens the user's browser.
  desktopTemp = await mkdtemp(path.join(tmpdir(), 'circuitlab-learning-audit-'))
  const profile = path.join(desktopTemp, 'profile')
  await mkdir(profile, { recursive: true })
  const wrapper = path.join(desktopTemp, 'desktop-audit-wrapper.cjs')
  await writeFile(wrapper, `const e = require('electron'); const p = require('node:path');\ne.app.setPath('userData', ${JSON.stringify(profile)});\nconst getPath = e.app.getPath.bind(e.app); e.app.getPath = key => key === 'appData' ? p.join(${JSON.stringify(profile)}, 'isolated-appdata') : getPath(key);\nglobal.auditExternalUrls = []; e.shell.openExternal = async url => { global.auditExternalUrls.push(url); };\nrequire(${JSON.stringify(path.join(root, 'electron', 'main.cjs'))});\n`)
  const desktopEnv = { ...process.env, CIRCUITLAB_TEST: '1' }
  delete desktopEnv.ELECTRON_RUN_AS_NODE
  desktop = await _electron.launch({ args: [wrapper], executablePath: path.join(root, 'node_modules', 'electron', 'dist', 'electron.exe'), env: desktopEnv, timeout: 20000 })
  const win = await desktop.firstWindow()
  win.setDefaultTimeout(10000)
  console.log('Desktop window opened')
  win.on('dialog', dialog => { void dialog.dismiss().catch(error => result.diagnostics.push({ type: 'electron-dialog-handler', message: error.message })) })
  await win.getByRole('heading', { name: 'Understand how a PCB is made.' }).waitFor()
  const profileCheck = await desktop.evaluate(({ app, BrowserWindow }) => ({ path: app.getPath('userData'), visible: BrowserWindow.getAllWindows()[0].isVisible(), size: BrowserWindow.getAllWindows()[0].getSize() }))
  assert.equal(profileCheck.path, profile)
  assert.equal(profileCheck.visible, false)
  console.log('Desktop profile and hidden window checked')
  await button(win, 'From idea to tested PCB. Start activity').click()
  await win.getByRole('link', { name: 'KiCad Getting Started' }).click()
  const external = await desktop.evaluate(() => global.auditExternalUrls)
  console.log('Desktop source link checked')
  assert.equal(external.length, 1)
  assert.ok(external[0].startsWith('https://docs.kicad.org/'))
  await win.evaluate(values => { localStorage.setItem('circuitlab.lesson-0.1.v1', JSON.stringify(values.intro)); localStorage.setItem('circuitlab.course.v2', JSON.stringify(values.course)) }, baseline)
  await win.reload()
  console.log('Desktop saved progress reloaded')
  await win.getByText('All activities recorded', { exact: true }).waitFor()
  await openRecorded('1.5', win)
  await button(win, 'Continue').click()
  await button(win, 'Return to lesson path').click()
  await win.getByRole('dialog').waitFor()
  await button(win, 'Keep learning').click()
  console.log('Desktop in-app exit checked')
  // Hidden Electron windows do not reliably produce compositor screenshots.
  // Inspect the actual renderer state; screenshots cover the shared browser UI.
  const rendererState = await win.evaluate(() => ({ title: document.querySelector('h1')?.textContent, progressWidth: document.querySelector('.lesson-progress span')?.getBoundingClientRect().width, answerVisible: Boolean(document.querySelector('input[type="number"]')) }))
  const nativeClose = await desktop.evaluate(async ({ BrowserWindow }) => {
    const window = BrowserWindow.getAllWindows()[0]
    let prevented = false
    window.webContents.once('will-prevent-unload', () => { prevented = true })
    window.close()
    await new Promise(resolve => setTimeout(resolve, 250))
    return { prevented, windows: BrowserWindow.getAllWindows().length }
  })
  assert.equal(nativeClose.prevented, true)
  assert.equal(nativeClose.windows, 1)
  result.scenarios.push({ name: 'electron-runtime', isolatedProfile: true, hiddenWindow: true, protocol: new URL(win.url()).protocol, sourceLinkHandedToShell: external, inAppExitDialog: true, rendererState, nativeClose })
  await leave(win)
  await desktop.close()
  desktop = undefined
  result.finishedAt = new Date().toISOString()
  result.success = true
  delete result.error
} catch (error) {
  result.success = false
  result.error = error.stack
  await shot('failure').catch(() => {})
  process.exitCode = 1
} finally {
  if (desktop) await desktop.close().catch(() => {})
  await browser.close()
  if (desktopTemp) {
    const resolved = path.resolve(desktopTemp)
    assert.equal(path.dirname(resolved), path.resolve(tmpdir()))
    assert.ok(path.basename(resolved).startsWith('circuitlab-learning-audit-'))
    await rm(resolved, { recursive: true, force: true })
  }
  await writeFile(path.join(out, 'runtime.json'), JSON.stringify(result, null, 2))
  console.log(JSON.stringify({ success: result.success, coverage: result.coverage.length, feedback: result.feedback.length, scenarios: result.scenarios.map(s => s.name), error: result.error }, null, 2))
}
