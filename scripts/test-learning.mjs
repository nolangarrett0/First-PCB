import assert from 'node:assert/strict'
import {test} from 'node:test'
import {courseUnits,sources} from '../src/courseContent.ts'
import {makeTask,unitTaskIds,finalTaskIds,VARIANTS} from '../src/learningTasks.ts'
import {lessonPlans} from '../src/lessonPlans.ts'
import {project,skillNames} from '../src/teachingProject.ts'
import {sourceLedger} from '../src/sourceLedger.ts'
import {gradePart} from '../src/taskTypes.ts'
import {emptyRecord,readRecord,persistRecord,validateRecord,mergeRecords,addSubmission,skillEvidence,xpFor,COURSE_VERSION,RECORD_KEY} from '../src/learningStore.ts'
import {freshVariant,createDraft} from '../src/activityState.ts'
const ids=courseUnits.flatMap(u=>u.lessonIds)
const at='2026-09-01T12:00:00.000Z'
function event(patch={}){return{id:'event-1',attemptId:'attempt-1',phase:'complete',activityId:'1.5',taskId:'1.5',taskVersion:COURSE_VERSION,variantId:makeTask('1.5').variantId,artifactId:'led-a',skillIds:['calculation'],at,answers:{},correct:true,mistakes:[],assisted:false,repeated:false,firstSubmission:true,purpose:'lesson',...patch}}
test('Every course job has instruction, decisions, feedback, distinct cases and supported sources',()=>{
  assert.equal(ids.length,56);assert.equal(unitTaskIds.length,10);assert.equal(finalTaskIds.length,6)
  for(const id of ids){
    const plan=lessonPlans[id];assert.ok(plan?.outcome&&plan.steps.length>=3&&plan.example,`${id} plan`)
    const cases=Array.from({length:VARIANTS},(_,v)=>makeTask(id,v));assert.ok(new Set(cases.map(c=>c.variantId)).size>=2,`${id} changed case`)
    for(const task of cases){
      assert.ok(task.parts.length>=2&&task.context&&task.artifact);assert.equal(new Set(task.parts.map(p=>p.id)).size,task.parts.length)
      for(const source of task.sources)assert.ok(sources[source]?.url&&sourceLedger[source]?.supports)
      for(const part of task.parts){assert.ok(part.prompt&&part.hint&&part.explanation&&part.skillIds.every(s=>skillNames[s]));const answer=part.kind==='number'?{value:String(part.expected),unit:part.baseUnit}:part.expected;assert.equal(gradePart(part,answer).correct,true,`${id}/${part.id} authored key`);if(part.options)assert.ok(part.options.every(o=>o.label)&&(part.kind==='choice'?part.options.some(o=>o.id===part.expected):part.expected.every(x=>part.options.some(o=>o.id===x))))}
    }
  }
})
test('Independent numeric solutions reject full supply and 1000-fold scale mistakes',()=>{
  for(let v=0;v<VARIANTS;v++){
    const task=makeTask('1.4',v),table=Object.fromEntries(task.artifact.rows.slice(1)),voltage=parseFloat(table['R1 voltage']),resistance=parseFloat(table['Changed R1']);assert.equal(gradePart(task.parts[1],{value:String(voltage/resistance),unit:'A'}).correct,true)
    const rule=makeTask('5.7',v),values=Object.fromEntries(rule.artifact.rows.slice(1)),min=parseFloat(values['Required minimum']),a=parseFloat(values['Gap A'])<min,b=parseFloat(values['Gap B'])<min;assert.equal(rule.parts[1].expected,a?b?'both':'a':b?'b':'none')
  }
  assert.equal(makeTask('1.6',4).parts[0].expected,'normal')
  for(let v=0;v<VARIANTS;v++)for(const id of ['1.5','3.4','8.3']){
    const task=makeTask(id,v),{voltage:vs,ledVoltage:vf,resistance:r}=task.artifact
    const current=task.parts.find(p=>p.id==='current'),drop=task.parts.find(p=>p.id==='voltage')
    const expected=(vs-vf)/r
    assert.equal(gradePart(drop,{value:String(vs-vf),unit:'V'}).correct,true)
    assert.equal(gradePart(current,{value:String(expected*1000),unit:'mA'}).correct,true)
    assert.equal(gradePart(current,{value:String(vs/r),unit:'A'}).correct,false)
    assert.equal(gradePart(current,{value:String(expected),unit:'mA'}).mistake,'unit-scale')
    for(const bad of ['','NaN','Infinity','one'])assert.equal(gradePart(current,{value:bad,unit:'A'}).correct,false)
    assert.equal(gradePart(current,{value:String(expected),unit:'V'}).correct,false)
  }
  for(let v=0;v<VARIANTS;v++)for(const id of ['2.4','9.2']){
    const t=makeTask(id,v),table=Object.fromEntries(t.artifact.rows.slice(1)),vs=parseFloat(table.Supply),vf=parseFloat(table['LED voltage']),i=parseFloat(table.Target)/1000,r=(vs-vf)/i
    assert.equal(gradePart(t.parts[0],{value:String(r),unit:'Ω'}).correct,true)
    assert.equal(gradePart(t.parts[1],{value:String((parseFloat(table['Range-case supply'])-parseFloat(table['Range-case LED voltage']))/r),unit:'A'}).correct,true)
  }
})
test('Exposure follows identical problems across lessons and ignores cosmetic photograph order',()=>{
  assert.equal(makeTask('1.5').variantId,makeTask('3.4').variantId)
  assert.equal(makeTask('2.1').variantId,makeTask('4.4').variantId)
  assert.equal(makeTask('7.4',0).variantId,makeTask('7.4',2).variantId)
  const r=emptyRecord(),seen=makeTask('1.5',0);r.exposures[seen.variantId]={taskId:'1.5',at,taskVersion:COURSE_VERSION}
  assert.notEqual(makeTask('3.4',freshVariant(r,'3.4')).variantId,seen.variantId)
  assert.equal(createDraft(r,'3.4').taskVersion,COURSE_VERSION)
})
test('The final uses new component, calculations, multi-discrepancy checks and a resistance diagnosis',()=>{
  const previous=new Set(ids.flatMap(id=>Array.from({length:VARIANTS},(_,v)=>makeTask(id,v).variantId)))
  for(const id of finalTaskIds)for(let v=0;v<VARIANTS;v++){
    const task=makeTask(id,v,true);assert.ok(!previous.has(task.variantId),`${id} must be an unfamiliar transfer case`)
    for(const p of task.parts)assert.equal(gradePart(p,p.kind==='number'?{value:String(p.expected),unit:p.baseUnit}:p.expected).correct,true)
  }
  assert.ok(makeTask('9.1',4,true).sources.includes('C4'))
  assert.equal(makeTask('8.5',4,true).parts[1].expected,'resistance')
  assert.equal(makeTask('6.2',4,true).artifact.fault,'multiple')
  assert.equal(makeTask('5.2',4,true).parts[1].expected.length,2)
})
test('The reference graph has four correct nets and one intended component loop',()=>{
  const byId=new Map(project.terminals.map(t=>[t.id,t]))
  for(const [a,b]of project.connections){assert.ok(byId.has(a)&&byId.has(b));assert.equal(byId.get(a).net,byId.get(b).net)}
  assert.deepEqual(project.connections,[['BT1+','S1.1'],['S1.2','R1.1'],['R1.2','D1.2'],['D1.1','BT1-']])
  assert.equal(byId.get('D1.1').net,'GND');assert.equal(byId.get('D1.2').net,'LED_A')
  const path=makeTask('1.1').parts[0].expected;assert.equal(path[0],'BT1+');assert.equal(path.at(-1),'BT1-');assert.equal(new Set(path).size,8)
})
test('Diagnosis demands removed cells, exact connection, distinct predictions and retest',()=>{
  for(const id of ['2.7','8.2','8.5'])for(let v=0;v<VARIANTS;v++){
    const t=makeTask(id,v);assert.equal(t.revealAfter,5);assert.equal(t.retestAfter,9);assert.ok(t.artifact.observation&&t.artifact.retestObservation)
    assert.equal(gradePart(t.parts[0],'off').correct,false);assert.equal(gradePart(t.parts[0],'on').correct,false)
    assert.equal(gradePart(t.parts[1],'current').correct,false)
    assert.notEqual(t.parts[3].expected,t.parts[4].expected)
    assert.deepEqual(t.parts[2].expected,t.parts[7].expected)
    assert.equal(t.parts.at(-1).expected,'path')
  }
})
test('Migration preserves legacy notes, attempts, XP and leaves existing keys intact',()=>{
  const data=new Map([['circuitlab.lesson-0.1.v1',JSON.stringify({completed:true,sessions:3,xpAwards:['lesson:0.1:first-completion']})],['circuitlab.course.v2',JSON.stringify({lessons:{'1.5':{completedAt:at,note:'my voltage note',evidence:'self-reported',attempts:[false,true]}},assessments:{'unit-0':{completedAt:at,note:'check note'}}})]])
  const {record,status}=readRecord({getItem:k=>data.get(k)??null});assert.equal(status.durable,true);assert.equal(xpFor(record),35);assert.equal(record.completions['1.5'].note,'my voltage note');assert.deepEqual(record.completions['1.5'].legacyAttempts,[false,true]);assert.equal(record.legacyIntroSessions,3);assert.equal(skillEvidence(record,'calculation').independentCount,0);assert.equal(data.size,2)
  const noAward=readRecord({getItem:k=>k.includes('0.1')?JSON.stringify({completed:true,xpAwards:[]}):null}).record;assert.equal(xpFor(noAward),0);assert.ok(noAward.completions['0.1'])
})
test('Storage failure is explicit; failed and setup submissions cannot manufacture fresh skill evidence',()=>{
  const r=addSubmission(emptyRecord(),event({correct:false}));assert.equal(persistRecord({setItem(){throw Error('quota')}},r).durable,false)
  assert.equal(addSubmission(r,r.submissions[0]).submissions.length,1)
  assert.equal(skillEvidence(r,'calculation').needsPractice,true)
  const setup=addSubmission(emptyRecord(),event({phase:'setup'}));assert.equal(skillEvidence(setup,'calculation').events.length,0)
  const supported=addSubmission(r,event({id:'e2',assisted:true,firstSubmission:false}));assert.equal(skillEvidence(supported,'calculation').independentCount,0)
  const repeated=addSubmission(supported,event({id:'e3',repeated:true}));assert.equal(skillEvidence(repeated,'calculation').independentCount,0)
  const fresh=addSubmission(repeated,event({id:'e4',variantId:makeTask('1.5',1).variantId}));assert.equal(skillEvidence(fresh,'calculation').independentCount,1)
  assert.equal(skillEvidence(addSubmission(emptyRecord(),event({taskVersion:'old'})),'calculation').events.length,0)
  assert.equal(skillEvidence(addSubmission(emptyRecord(),event({variantId:'problem-obsolete'})),'calculation').events.length,0)
})
test('Review intervals distinguish supported, fresh success, and later successful review',()=>{
  const oneDay=86400000,t=Date.parse(at);let r=addSubmission(emptyRecord(),event({assisted:true}));assert.equal(skillEvidence(r,'calculation',t).dueAt,t+oneDay)
  r=addSubmission(emptyRecord(),event());assert.equal(skillEvidence(r,'calculation',t).dueAt,t+7*oneDay);assert.equal(skillEvidence(r,'calculation',t+8*oneDay).due,true)
  r=addSubmission(r,event({id:'review',purpose:'review',at:new Date(t+8*oneDay).toISOString(),variantId:makeTask('1.5',1).variantId}));assert.equal(skillEvidence(r,'calculation',t).dueAt,t+29*oneDay)
})
test('Backup round trips and repeated imports preserve history and never duplicate XP',()=>{
  let r=emptyRecord();r.completions['1.5']={at,note:'repeatable backup',physical:'pending',fields:{}};r.awards=['1.5'];r=addSubmission(r,event());const imported=validateRecord(JSON.parse(JSON.stringify(r)));const merged=mergeRecords(mergeRecords(r,imported),imported);assert.equal(xpFor(merged),10);assert.equal(merged.submissions.length,1);assert.equal(merged.completions['1.5'].note,'repeatable backup')
  for(const bad of [null,{}, {...r,awards:['0.8']},{...r,awards:['unit-0']},{...r,submissions:[event({taskId:'3.8'})]},{...r,submissions:[event({skillIds:['made-up']})]}])assert.throws(()=>validateRecord(bad))
  assert.equal(readRecord({getItem:k=>k===RECORD_KEY?'bad JSON':null}).status.durable,false)
})
