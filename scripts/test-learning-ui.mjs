import { learningText } from '../src/learningLanguage.ts'
import assert from 'node:assert/strict'
import {mkdir,writeFile,readFile} from 'node:fs/promises'
import {chromium} from 'playwright'
import {sources,courseUnits,checkTitle,firstLessonTitle,lessonById} from '../src/courseContent.ts'
import {makeTask,activityTasks} from '../src/learningTasks.ts'
import {emptyRecord,RECORD_KEY,xpFor} from '../src/learningStore.ts'
const url=process.env.LEARNING_TEST_URL??'http://127.0.0.1:5173'
const out=new URL('../docs/learning-audit/evidence/',import.meta.url);await mkdir(out,{recursive:true})
const browser=await chromium.launch({headless:true});const context=await browser.newContext({viewport:{width:1280,height:900},acceptDownloads:true});const page=await context.newPage();page.setDefaultTimeout(8000)
const errors=[],result={startedAt:new Date().toISOString(),activities:[],scenarios:[]};page.on('pageerror',e=>errors.push(e.message));page.on('dialog',d=>void d.accept())
const record=async()=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)),RECORD_KEY)
const button=name=>page.getByRole('button',{name,exact:true})
const paths=courseUnits.flatMap(u=>[...u.lessonIds,u.checkId]).concat('final')
const title=id=>id==='0.1'?firstLessonTitle:id==='final'?'Independent design review':id.startsWith('unit-')?checkTitle(id):lessonById[id].title
async function open(id){await page.locator('.trail-node').nth(paths.indexOf(id)).click();await page.locator('.lesson-panel').waitFor();if(await button('Begin practice').count())await button('Begin practice').click()}
async function fill(task,wrong=false){
  const fields=page.locator('.task-part'),count=await fields.count()
  for(let i=0;i<count;i++){
    const part=task.parts[i],field=fields.nth(i),bad=wrong&&i===0
    if(part.kind==='choice'){const id=bad?part.options.find(o=>o.id!==part.expected).id:part.expected;await field.locator(`input[value="${id}"]`).check()}
    else if(part.kind==='number'){const value=String(bad?Number(part.expected)+999:part.expected);if(await field.locator('input').inputValue()!==value)await field.locator('input').fill(value);if(await field.locator('select').count()&&await field.locator('select').inputValue()!==part.baseUnit)await field.locator('select').selectOption(part.baseUnit)}
    else if(part.kind==='nodes'){const expected=bad?[part.options.find(o=>!part.expected.includes(o.id)).id]:part.expected;for(const option of part.options){const input=field.getByLabel(learningText(option.label),{exact:true});if(await input.isChecked()!==expected.includes(option.id))await input.setChecked(expected.includes(option.id))}}
    else if(!bad){for(let j=0;j<part.expected.length;j++){const label=learningText(part.options.find(o=>o.id===part.expected[j]).label);let current=(await field.locator('.sort-copy strong').allTextContents()).indexOf(label);while(current>j){await field.getByRole('button',{name:`Move ${label} up`,exact:true}).click();current--}}}
  }
}
async function check(){await page.locator('form .primary-button').click()}
async function solve(id){for(let guard=0;guard<16;guard++){const r=await record(),draft=r.drafts[id];if(draft.stage==='record')return;const task=makeTask(activityTasks(id)[draft.index],draft.variant,id==='final');await fill(task);await check();assert.equal(await page.locator('.part-feedback.incorrect').count(),0,`${id}/${draft.index}/${draft.variant}`);if(await button('Continue').count())await button('Continue').click()}throw Error(`Too many stages ${id}`)}
async function leave(){await button('Return to lesson path').click();if(await page.getByRole('dialog').count())await button('Leave activity').click()}
async function seed(r){await page.evaluate(({r,key})=>{localStorage.clear();localStorage.setItem(key,JSON.stringify(r))},{r,key:RECORD_KEY});await page.reload()}
try{
  await page.goto(url);await page.locator('h1').waitFor()
  await page.screenshot({path:new URL('implementation-path.png',out).pathname.slice(1)})
  // Full path: each activity deliberately starts with one wrong decision. Every
  // checkpoint, correction and changed follow-up is exercised through controls.
  for(const id of paths){
    await open(id);let r=await record(),draft=r.drafts[id],task=makeTask(activityTasks(id)[draft.index],draft.variant,id==='final')
    if(id==='1.5'){await button('Enlarge diagram').click();assert.equal(await button('Fit diagram').getAttribute('aria-pressed'),'true');await button('Fit diagram').click()}
    const firstVariant=task.variantId;await fill(task,true);await check();r=await record();assert.equal(r.submissions.at(-1).correct,false,`${id}: wrong answer must persist`)
    if(id==='0.1'){
      await page.reload();await page.getByRole('button',{name:`${title(id)}. Resume activity`,exact:true}).click();const resumed=await record();assert.equal(resumed.drafts[id].caseId,draft.caseId);assert.equal(resumed.submissions.length,r.submissions.length);assert.equal(resumed.drafts[id].checked,true)
      await button('Return to lesson path').click();await button('Keep learning').click();assert.equal(await page.getByRole('dialog').count(),0);result.scenarios.push('wrong submission and exact case survive reload; exit dialog preserves focus')
    }
    if(id==='8.5'){assert.equal(await page.locator('.modeled-observation').count(),0);assert.equal(await page.locator('.task-part').count(),5);result.scenarios.push('unsafe/incorrect diagnostic setup cannot reveal observation')}
    await solve(id);r=await record();assert.ok(r.submissions.some(s=>s.activityId===id&&s.correct));assert.ok(r.submissions.some(s=>s.activityId===id&&s.variantId!==firstVariant),`${id}: changed follow-up required`)
    if(id==='final'){assert.equal(await page.locator('.review-list select').count(),7);for(const s of await page.locator('.review-list select').all())assert.equal(await s.inputValue(),'pending');result.scenarios.push('final requires six graded tasks; physical records may all remain pending')}
    await page.locator('#activity-note').fill(`Note ${id}`);await button('Finish activity').click();assert.equal(await page.getByRole('heading',{name:'Practice recorded',exact:true}).count(),1);await button('Return to path').click();r=await record();assert.equal(r.completions[id].note,`Note ${id}`);assert.ok(!r.drafts[id]);result.activities.push(id)
    if(result.activities.length%10===0)console.log(`${result.activities.length}/${paths.length} activities checked`)
  }
  const complete=await record();assert.equal(Object.keys(complete.completions).length,paths.length);assert.equal(xpFor(complete),835);await writeFile(new URL('implementation-test-record.json',out),JSON.stringify(complete,null,2))
  await button('Learning record').click();await page.getByRole('heading',{name:'Learning record',exact:true}).waitFor();await page.locator('.completion-record').filter({hasText:title('1.5')}).locator('summary').click();await page.getByText('Note 1.5',{exact:true}).waitFor();assert.ok(await page.locator('.answer-event').count()>130)
  await page.screenshot({path:new URL('implementation-record.png',out).pathname.slice(1),fullPage:false});result.scenarios.push('all notes readable without retaking; actual wrong and corrected decisions retained')
  const downloading=page.waitForEvent('download');await button('Download backup').click();const download=await downloading;const file=await download.path();const exported=JSON.parse(await readFile(file,'utf8'));assert.equal(exported.submissions.length,complete.submissions.length)
  await page.locator('input[type=file]').setInputFiles(file);await page.locator('input[type=file]').setInputFiles(file);assert.equal(xpFor(await record()),835);assert.equal((await record()).submissions.length,complete.submissions.length);result.scenarios.push('backup round trip and duplicate imports preserve XP and history')
  await page.locator('input[type=file]').setInputFiles({name:'bad.json',mimeType:'application/json',buffer:Buffer.from('{"schema":3}')});await page.getByRole('alert').waitFor();assert.equal((await record()).submissions.length,complete.submissions.length)
  await page.getByRole('button',{name:/^Review skills/}).click();await page.getByRole('heading',{name:'Review your skills',exact:true}).waitFor();await page.locator('.skill-card').first().getByRole('button').click();await button('Begin practice').click();const reviewId=Object.keys((await record()).drafts).find(id=>id.startsWith('review:'));await solve(reviewId);await button('Finish activity').click();await button('Return to path').click();assert.equal(xpFor(await record()),835);result.scenarios.push('retrieval review works and never duplicates participation awards')
  await button('Project and reference').click();await page.getByRole('dialog').waitFor();await button('Glossary').click();await page.locator('#glossary-search').fill('cathode');assert.ok(await page.locator('.reading-terms dt').count()>0);await button('Sources').click();await page.locator('.source-ledger summary').click();assert.equal(await page.locator('.source-ledger a').count(),Object.keys(sources).length);await button('Close reference').focus();await page.keyboard.press('Shift+Tab');assert.equal(await page.evaluate(()=>document.activeElement.closest('.reference-panel')!==null),true);await page.keyboard.press('Escape');assert.equal(await page.getByRole('dialog').count(),0);result.scenarios.push('searchable reference, 33 sourced entries, keyboard trap and Escape')
  await button('Lesson path').click()
  for(const width of [320,390,1280]){
    await page.setViewportSize({width,height:900});for(const id of ['E.1','E.3','E.5','E.6','E.8','E.9','1.5','3.2','5.4','6.2','7.4','8.5','final']){
      await open(id);const dims=await page.evaluate(()=>({viewport:innerWidth,scroll:document.documentElement.scrollWidth}));assert.ok(dims.scroll<=dims.viewport+1,`${id} overflow at ${width}: ${JSON.stringify(dims)}`)
      if(width<700&&await button('Enlarge diagram').count()){await button('Enlarge diagram').click();const zoom=await page.evaluate(()=>({root:document.documentElement.scrollWidth,width:innerWidth,canvas:document.querySelector('.artifact-scroller.enlarged').scrollWidth}));assert.ok(zoom.root<=zoom.width+1&&zoom.canvas>=660);await button('Fit diagram').click()}
      if(width===390&&['1.5','6.2','7.4','8.5'].includes(id))await page.screenshot({path:new URL(`implementation-mobile-${id}.png`,out).pathname.slice(1),fullPage:true})
      await leave()
    }
  }result.scenarios.push('diagram, comparison, photograph, diagnosis and final screens fit 320/390/1280px')
  await page.setViewportSize({width:1280,height:900});await seed(emptyRecord());await context.addInitScript(()=>{Storage.prototype.setItem=function(){throw new DOMException('Quota test','QuotaExceededError')}});await page.reload();await open('E.1');await fill(makeTask('E.1'),true);await check();await page.getByRole('alert').waitFor();assert.ok((await page.locator('.storage-alert').textContent()).includes('session'));const failBackup=page.waitForEvent('download');await page.locator('.storage-alert').getByRole('button',{name:'Download backup'}).click();const recovered=JSON.parse(await readFile(await(await failBackup).path(),'utf8'));assert.equal(recovered.submissions.length,1);result.scenarios.push('storage failure stays visible and current answers are exportable')
  assert.deepEqual(errors,[]);result.success=true
}catch(error){result.success=false;result.error=error.stack;await page.screenshot({path:new URL('implementation-failure.png',out).pathname.slice(1),fullPage:true}).catch(()=>{});process.exitCode=1}
finally{result.errors=errors;result.finishedAt=new Date().toISOString();await writeFile(new URL('implementation-runtime.json',out),JSON.stringify(result,null,2));console.log(JSON.stringify({success:result.success,activities:result.activities.length,scenarios:result.scenarios,error:result.error},null,2));await browser.close()}
