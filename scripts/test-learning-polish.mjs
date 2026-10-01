import assert from 'node:assert/strict'
import {mkdir, writeFile} from 'node:fs/promises'
import {chromium} from 'playwright'
import {coursePathIds} from '../src/courseContent.ts'
import {createDraft, initialAnswers} from '../src/activityState.ts'
import {emptyRecord, RECORD_KEY} from '../src/learningStore.ts'
import {makeTask} from '../src/learningTasks.ts'
import {learningText} from '../src/learningLanguage.ts'

const out = 'ui-previews/polish'
await mkdir(out, {recursive: true})
const browser = await chromium.launch({headless: true})
const page = await browser.newPage({viewport: {width: 1280, height: 900}})
page.setDefaultTimeout(8000)
page.on('dialog', dialog => void dialog.accept())
const result = {scenarios: [], diagrams: 0, errors: []}
page.on('pageerror', error => result.errors.push(error.message))
const button = name => page.getByRole('button', {name, exact: true})
const record = () => page.evaluate(key => JSON.parse(localStorage.getItem(key)), RECORD_KEY)

async function seedActivity(id, variant=0, extra={}) {
  const seed = emptyRecord()
  for (const pathId of coursePathIds) seed.completions[pathId] = {at: new Date().toISOString(), note: '', fields: {}, physical: 'pending'}
  const task = makeTask(id, variant)
  seed.drafts[id] = {...createDraft(seed, id), variant, stage: 'practice', answers: initialAnswers(task), ...extra}
  await page.evaluate(({seed, key}) => {localStorage.clear(); localStorage.setItem(key, JSON.stringify(seed))}, {seed, key: RECORD_KEY})
  await page.reload()
  await page.locator('.trail-node').nth(coursePathIds.indexOf(id)).click()
  await page.locator('.task-runner').waitFor()
  return task
}

async function checkLayout(label) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)
  assert.ok(overflow <= 1, `${label}: page overflows by ${overflow}px`)
  const problems = await page.locator('.task-artifact svg').evaluateAll(svgs => svgs.flatMap(svg => {
    const bounds = svg.getBoundingClientRect()
    const labels = [...svg.querySelectorAll('text')].map(node => ({text: node.textContent, r: node.getBoundingClientRect()}))
    return labels.flatMap((a,i) => {
      const clipped = a.r.x < bounds.x-1 || a.r.right > bounds.right+1 || a.r.y < bounds.y-1 || a.r.bottom > bounds.bottom+1
      const overlaps = labels.slice(i+1).filter(b => Math.min(a.r.right,b.r.right)-Math.max(a.r.x,b.r.x)>2 && Math.min(a.r.bottom,b.r.bottom)-Math.max(a.r.y,b.r.y)>2)
      return [...(clipped?[`${a.text} clipped`]:[]), ...overlaps.map(b => `${a.text} overlaps ${b.text}`)]
    })
  }))
  assert.deepEqual(problems, [], label)
  result.diagrams++
}

try {
  await page.goto(process.env.LEARNING_TEST_URL ?? 'http://127.0.0.1:5174')
  await page.setViewportSize({width: 320, height: 900})
  const start = page.getByRole('button', {name: /^Start first lesson:/})
  assert.ok((await start.boundingBox()).y < 900)
  await start.click()
  await button('Begin practice').click()
  await button('Return to lesson path').click()
  await button('Leave activity').click()
  await page.reload()
  await page.getByRole('button', {name: /^Resume activity:/}).click()
  assert.equal(await page.locator('.task-runner').count(), 1)
  result.scenarios.push('320px start/resume action opens the saved activity directly')

  await page.setViewportSize({width: 1280, height: 900})
  await seedActivity('0.3')
  assert.equal(await page.locator('.requested-ring').count(), 2)
  await page.getByRole('button', {name: 'Select resistor pin 2 (R1.2)', exact: true}).click()
  await page.getByRole('button', {name: 'Select LED pin 2 (D1.2)', exact: true}).click()
  assert.deepEqual((await record()).drafts['0.3'].answers.points, ['R1.2','D1.2'])
  result.scenarios.push('requested terminals are visible and diagram clicks save the named endpoints')

  let task = await seedActivity('E.7')
  assert.equal(await page.locator('.task-part').first().locator('select').count(), 0)
  await page.locator('.task-part').first().locator('input').fill(String(task.parts[0].expected))
  assert.equal((await record()).drafts['E.7'].answers.pin.unit, 'pins')
  result.scenarios.push('chip pin numbers have a number field without a misleading quantity unit')

  task = await seedActivity('1.3')
  await page.locator('.task-part').first().locator('input').fill('1,5')
  assert.equal(await page.locator('input[aria-invalid=true]').count(), 1)
  await page.getByText('Enter a number using digits and a decimal point, for example 0.005.', {exact:true}).waitFor()
  assert.equal(await button('Check decisions').isDisabled(), true)
  for (let i=0; i<task.parts.length; i++) await page.locator('.task-part').nth(i).locator('input').fill(String(i===0?999:task.parts[i].expected))
  await button('Check decisions').click()
  assert.equal(await page.evaluate(() => document.activeElement.className), 'feedback-summary')
  assert.equal(await button('Check decisions').isDisabled(), true)
  await page.locator('.task-part').first().locator('input').fill(String(task.parts[0].expected))
  assert.equal(await button('Check decisions').isEnabled(), true)
  await button('Check decisions').click()
  await button('Continue').waitFor()
  result.scenarios.push('invalid numbers get guidance; failed checking focuses feedback and requires a changed answer')

  await seedActivity('1.5')
  await button('Show worked example').click()
  await page.getByRole('heading', {name:'Worked example: a different case', exact:true}).waitFor()
  assert.ok(await page.locator('#practice-example .example-content').innerText())
  assert.equal((await record()).drafts['1.5'].helped, true)
  await page.screenshot({path:`${out}/help.png`,fullPage:true})
  await button('Hide worked example').click()
  assert.equal(await page.locator('#practice-example').count(), 0)
  result.scenarios.push('practice help opens a solved different case and records support')

  await seedActivity('3.2')
  assert.equal(await page.locator('.diagram-point[role=button]').count(), 12)
  await page.setViewportSize({width:390,height:850})
  await page.screenshot({path:`${out}/breadboard-mobile.png`,fullPage:true})
  await page.setViewportSize({width:1280,height:900})
  await seedActivity('2.6',1)
  await page.getByRole('button',{name:'Select switch pin 1 (S1.1)',exact:true}).first().click()
  await page.getByRole('button',{name:'Select switch pin 3 (S1.3)',exact:true}).first().focus()
  await page.keyboard.press('Space')
  assert.deepEqual((await record()).drafts['2.6'].answers.contacts,['S1.1','S1.3'])
  result.scenarios.push('diagram points match checkbox choices; switch contacts support keyboard selection')

  task=makeTask('8.5',1)
  const setup=Object.fromEntries(task.parts.slice(0,5).map(part=>[part.id,part.expected]))
  await seedActivity('8.5',1,{revealed:true,answers:setup})
  await page.getByRole('button',{name:'Select switch pin 2 (S1.2)',exact:true}).click()
  await page.getByRole('button',{name:'Select resistor pin 1 (R1.1)',exact:true}).click()
  assert.deepEqual((await record()).drafts['8.5'].answers['retest-points'],['S1.2','R1.1'])
  assert.deepEqual((await record()).drafts['8.5'].answers.points,setup.points)
  result.scenarios.push('repeated-test diagram selections fill the new answer without changing the submitted setup')

  await button('Reference').click()
  await button('Glossary').click()
  await page.locator('#glossary-search').fill('no-such-term')
  await page.getByText('No terms match.',{exact:false}).waitFor()
  await page.locator('#glossary-search').fill('PCB')
  assert.ok(await page.locator('.reference-panel .reading-terms dt').count())
  assert.equal(await page.evaluate(()=>document.body.style.overflow),'hidden')
  await page.keyboard.press('Escape')
  assert.equal(await page.getByRole('dialog').count(),0)
  assert.equal(await page.evaluate(()=>document.body.style.overflow),'')
  result.scenarios.push('glossary explains PCB and an empty search; dialog restores background scrolling')

  const ids=['E.1','E.2','E.3','E.4','E.5','E.6','E.7','E.8','E.9','0.3','1.1','1.6','2.6','3.1','3.2','4.3','4.6','5.4','5.5','5.8','6.2','6.3','7.2']
  for (const width of [320,1280]) {
    await page.setViewportSize({width,height:900})
    for (const id of ids) for (let v=0;v<5;v++) {
      await seedActivity(id,v)
      await checkLayout(`${id}/${v}/${width}`)
      if (await page.locator('.layer-controls').count()) for (const layer of ['Mask','Silkscreen','Outline','Drills']) {
        await page.locator('.layer-controls').getByRole('button',{name:layer,exact:true}).click()
        await checkLayout(`${id}/${v}/${width}/${layer}`)
      }
    }
    console.log(`Diagram variants and layers checked at ${width}px`)
  }
  assert.equal(learningText('Range supply: 3.4000000000000004 V'),'Range supply: 3.4 V')
  assert.equal(learningText('LED_A-3.4000000000000004.gbr'),'LED_A-3.4000000000000004.gbr')
  assert.deepEqual(result.errors,[])
  result.scenarios.push('all diagram families, five variants and layer comparisons fit without clipped or overlapping labels at 320/1280px')
  result.success=true
} catch(error) {
  result.success=false
  result.error=error.stack
  await page.screenshot({path:`${out}/failure.png`,fullPage:true}).catch(()=>{})
  process.exitCode=1
} finally {
  await browser.close()
  result.finishedAt=new Date().toISOString()
  await writeFile(`${out}/verification.json`,JSON.stringify(result,null,2))
  console.log(JSON.stringify(result,null,2))
}
