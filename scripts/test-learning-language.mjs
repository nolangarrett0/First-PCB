import assert from 'node:assert/strict'
import {readFile, writeFile} from 'node:fs/promises'
import {chromium} from 'playwright'
import {courseUnits} from '../src/courseContent.ts'
import {RECORD_KEY} from '../src/learningStore.ts'
import {learningText, relevantLabelTerms} from '../src/learningLanguage.ts'

assert.equal(learningText('R1.2 → D1.2'), 'resistor pin 2 (R1.2) → LED pin 2 (D1.2)')
assert.equal(learningText('LED_A-F_Cu.gbr'), 'LED_A-F_Cu.gbr')
assert.ok(relevantLabelTerms('IF=20 mA; TA=25 °C').some(([t])=>t==='VF / IF / TA'))
const baseline=JSON.parse(await readFile(new URL('../docs/learning-audit/evidence/implementation-test-record.json',import.meta.url),'utf8'))
baseline.drafts={}
const browser=await chromium.launch({headless:true}),context=await browser.newContext({viewport:{width:1132,height:1199}}),page=await context.newPage()
page.setDefaultTimeout(8000)
const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())})
const result={lessons:[],scenarios:[]}
try {
  await page.goto(process.env.LEARNING_TEST_URL??'http://127.0.0.1:5173')
  await page.evaluate(({r,k})=>localStorage.setItem(k,JSON.stringify(r)),{r:baseline,k:RECORD_KEY});await page.reload()
  const paths=courseUnits.flatMap(u=>[...u.lessonIds,u.checkId]).concat('final')
  for(const id of courseUnits.flatMap(u=>u.lessonIds)) {
    await page.locator('.trail-node').nth(paths.indexOf(id)).click()
    await page.getByRole('button',{name:'Begin practice',exact:true}).waitFor()
    const reading=await page.locator('.lesson-reading').innerText()
    for(const [token,name] of [['BT1','battery holder'],['S1','switch'],['R1','resistor'],['VCC','supply positive'],['GND','battery-negative return'],['SW','switch output'],['ERC','electrical rules check'],['DRC','design rules check']]) {
      if(new RegExp(`\\b${token}\\b`).test(reading))assert.ok(reading.toLowerCase().includes(name),`${id} needs meaning for ${token}`)
    }
    if(id==='0.4') {
      assert.ok(reading.includes('Keep both cells out.'))
      assert.ok(reading.includes('Names such as supply positive (VCC)'))
      assert.ok((await page.locator('.teaching-table').innerText()).includes('connection after the switch (SW)'))
      await page.screenshot({path:'docs/learning-audit/evidence/beginner-language-lesson-0.4.png',fullPage:true})
      await page.getByRole('button',{name:'Begin practice',exact:true}).click()
      await page.getByLabel('battery holder positive contact (BT1 +)',{exact:true}).waitFor()
      await page.locator('.label-key').getByText('BT1',{exact:true}).waitFor()
      await page.setViewportSize({width:390,height:850})
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1))
      await page.screenshot({path:'docs/learning-audit/evidence/beginner-language-practice-mobile.png',fullPage:true})
      await page.getByRole('button',{name:'Return to lesson path',exact:true}).click()
      await page.getByRole('button',{name:'Leave activity',exact:true}).click()
      await page.setViewportSize({width:1132,height:1199})
    } else await page.getByRole('button',{name:'Return to lesson path',exact:true}).click()
    result.lessons.push(id)
  }
  await page.getByRole('button',{name:'Project and reference',exact:true}).click();await page.getByRole('button',{name:'Glossary',exact:true}).click()
  for(const term of ['BT1','SW','COM','IF','Edge.Cuts']) {
    await page.locator('#glossary-search').fill(term)
    assert.ok(await page.locator('.reference-panel .reading-terms dt').count(),`Glossary missing ${term}`)
  }
  assert.deepEqual(errors,[])
  result.scenarios=['65 lesson readings explain their labels','0.4 uses plain inspection instructions and table labels','Practice checkboxes name the parts and show an inline key','390px layout fits','Glossary includes circuit, meter, datasheet and layer shorthand']
  result.success=true
} finally {
  result.finishedAt=new Date().toISOString()
  await writeFile('docs/learning-audit/evidence/beginner-language-runtime.json',JSON.stringify(result,null,2))
  await browser.close()
}
console.log(JSON.stringify(result,null,2))
