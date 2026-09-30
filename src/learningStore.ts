import { courseUnits } from './courseContent.ts'
import { skillNames } from './teachingProject.ts'
import {makeTask,finalTaskIds,VARIANTS} from './learningTasks.ts'
export const RECORD_KEY = 'circuitlab.learning.v3'
export const COURSE_VERSION = '2026-09-learning-2'
export type Answer = string | string[] | { value: string; unit: string }
export type Submission = {
  id: string; attemptId: string; phase: 'setup' | 'retest' | 'complete'; activityId: string; taskId: string; taskVersion: string; variantId: string; variantIndex?:number; artifactId: string;
  skillIds: string[]; at: string; answers: Record<string, Answer>; correct: boolean; mistakes: string[];
  assisted: boolean; repeated: boolean; firstSubmission: boolean; purpose: 'lesson' | 'check' | 'review' | 'final'
}
export type ActivityDraft = {
  stage: 'learn' | 'practice' | 'record'; index: number; variant: number; answers: Record<string, Answer>;
  helped: boolean; checked: boolean; note: string; physical: 'pending' | 'reported'; fields: Record<string, string>;
  reviewStatuses: Record<string, string>; startedAt: string; taskVersion: string
  caseId: string; revealed: boolean; retested:boolean; followup: boolean
}
export type Completion = { at: string; note: string; physical: 'pending' | 'reported'; fields: Record<string, string>; legacy?: boolean; legacyAttempts?: unknown[]; reviewStatuses?: Record<string, string> }
export type LearningRecord = { schema: 3; courseVersion: string; completions: Record<string, Completion>; drafts: Record<string, ActivityDraft>; submissions: Submission[]; exposures:Record<string,{taskId:string;at:string;taskVersion:string}>; awards: string[]; legacyIntroSessions: number }
export type StorageResult = { durable: boolean; error?: string }
export const emptyRecord = (): LearningRecord => ({ schema: 3, courseVersion: COURSE_VERSION, completions: {}, drafts: {}, submissions: [], exposures:{}, awards: [], legacyIntroSessions: 0 })
const plainObject = (x: unknown): x is Record<string, unknown> => Boolean(x && typeof x === 'object' && !Array.isArray(x))
const validAnswer = (x: unknown): x is Answer => typeof x === 'string' || Array.isArray(x) && x.every(v => typeof v === 'string') || plainObject(x) && typeof x.value === 'string' && typeof x.unit === 'string'
const lessonIds=new Set(courseUnits.flatMap(u=>u.lessonIds))
const knownId=(id:string)=>lessonIds.has(id)||id==='final'||/^unit-[0-9]$/.test(id)||id.startsWith('review:')&&Object.hasOwn(skillNames,id.slice(7))
const stringFields=(x:unknown)=>plainObject(x)&&Object.values(x).every(v=>typeof v==='string')
const currentProblems=new Map<string,Set<string>>()
function currentProblem(s:Submission){const key=`${s.taskId}:${s.purpose==='final'}`;if(!currentProblems.has(key)){if(!lessonIds.has(s.taskId)||s.purpose==='final'&&!finalTaskIds.includes(s.taskId))return false;currentProblems.set(key,new Set(Array.from({length:VARIANTS},(_,i)=>makeTask(s.taskId,i,s.purpose==='final').variantId)))}return currentProblems.get(key)!.has(s.variantId)}

export function validateRecord(raw: unknown): LearningRecord {
  if (!plainObject(raw) || raw.schema !== 3 || !plainObject(raw.completions) || !plainObject(raw.drafts) || !Array.isArray(raw.submissions) || !Array.isArray(raw.awards)) throw Error('This file is not a First PCB learning record (format 3).')
  const completions: LearningRecord['completions'] = {}
  for (const [id, value] of Object.entries(raw.completions)) {
    if (!knownId(id) || !plainObject(value) || typeof value.at !== 'string' || !Number.isFinite(Date.parse(value.at)) || typeof value.note !== 'string' || !plainObject(value.fields)) throw Error('The record contains an invalid completion.')
    completions[id] = { at: value.at, note: value.note, physical: value.physical === 'reported' ? 'reported' : 'pending', fields: Object.fromEntries(Object.entries(value.fields).filter((pair): pair is [string, string] => typeof pair[1] === 'string')), ...(value.legacy ? { legacy: true } : {}), ...(Array.isArray(value.legacyAttempts) ? { legacyAttempts: value.legacyAttempts } : {}), ...(plainObject(value.reviewStatuses) ? { reviewStatuses: Object.fromEntries(Object.entries(value.reviewStatuses).filter((pair): pair is [string, string] => typeof pair[1] === 'string')) } : {}) }
  }
  const drafts: LearningRecord['drafts'] = {}
  for (const [id, value] of Object.entries(raw.drafts)) {
    if (!knownId(id) || !plainObject(value) || !['learn','practice','record'].includes(String(value.stage)) || !Number.isInteger(value.index) || Number(value.index) < 0 || Number(value.index)>=(id==='final'?6:id.startsWith('unit-')?3:1) || !Number.isInteger(value.variant) || Number(value.variant) < 0 || Number(value.variant)>=5 || !plainObject(value.answers) || !Object.values(value.answers).every(validAnswer) || typeof value.note !== 'string' || !stringFields(value.fields) || !stringFields(value.reviewStatuses) || !Object.values(value.reviewStatuses as object).every(v=>['pending','present'].includes(v)) || typeof value.startedAt !== 'string' || !Number.isFinite(Date.parse(value.startedAt)) || typeof value.taskVersion !== 'string' || typeof value.helped!=='boolean' || typeof value.checked!=='boolean' || !['pending','reported'].includes(String(value.physical))) throw Error('The record contains an invalid unfinished activity.')
    drafts[id] = { ...(value as unknown as ActivityDraft), caseId: typeof value.caseId==='string'?value.caseId:crypto.randomUUID(), revealed: value.revealed===true, retested:value.retested===true, followup:value.followup===true }
  }
  const submissions: Submission[] = []
  for (const value of raw.submissions) {
    if (!plainObject(value) || !['id','activityId','taskId','taskVersion','variantId','artifactId','at'].every(k => typeof value[k] === 'string') || !Number.isFinite(Date.parse(String(value.at))) || !Array.isArray(value.skillIds) || !value.skillIds.every(x=>typeof x==='string') || !plainObject(value.answers) || !Object.values(value.answers).every(validAnswer) || typeof value.correct !== 'boolean' || !Array.isArray(value.mistakes) || !value.mistakes.every(x=>typeof x==='string') || !['assisted','repeated','firstSubmission'].every(k=>typeof value[k]==='boolean') || !['lesson','check','review','final'].includes(String(value.purpose))) throw Error('The record contains an invalid answer event.')
    submissions.push({ ...(value as unknown as Submission), attemptId: typeof value.attemptId==='string'?value.attemptId:String(value.id),phase:value.phase==='setup'?'setup':value.phase==='retest'?'retest':'complete' })
    if(!knownId(String(value.activityId))||!lessonIds.has(String(value.taskId))||!value.skillIds.every(x=>Object.hasOwn(skillNames,x)))throw Error('The record contains an unknown activity or skill.')
    if(value.variantIndex!==undefined&&(!Number.isInteger(value.variantIndex)||Number(value.variantIndex)<0||Number(value.variantIndex)>=5))throw Error('The record has an invalid displayed case index.')
  }
  if (new Set(submissions.map(s=>s.id)).size !== submissions.length) throw Error('The record contains duplicate answer events.')
  if (!raw.awards.every(x=>typeof x==='string' && knownId(x) && !x.startsWith('review:') && Object.hasOwn(completions,x))) throw Error('The record contains an invalid completion award.')
  const exposures:LearningRecord['exposures']={}
  if(raw.exposures!==undefined){if(!plainObject(raw.exposures))throw Error('The record has invalid example exposure history.');for(const[id,v]of Object.entries(raw.exposures)){if(!plainObject(v)||!lessonIds.has(String(v.taskId))||typeof v.at!=='string'||!Number.isFinite(Date.parse(v.at))||typeof v.taskVersion!=='string'||!/^([0-9]\.[0-9]:)?problem-[0-9a-f]+$/.test(id))throw Error('The record has invalid example exposure history.');exposures[id]={taskId:String(v.taskId),at:v.at,taskVersion:v.taskVersion}}}
  return { schema: 3, courseVersion: typeof raw.courseVersion === 'string' ? raw.courseVersion : COURSE_VERSION, completions, drafts, submissions, exposures, awards: [...new Set(raw.awards as string[])], legacyIntroSessions: typeof raw.legacyIntroSessions === 'number' ? raw.legacyIntroSessions : 0 }
}

export function readRecord(storage: Pick<Storage, 'getItem'>): { record: LearningRecord; status: StorageResult } {
  try {
    const current = storage.getItem(RECORD_KEY)
    if (current) return { record: validateRecord(JSON.parse(current)), status: { durable: true } }
    const record = emptyRecord()
    const parse = (key: string): unknown => { const value = storage.getItem(key); return value ? JSON.parse(value) : null }
    const intro = parse('circuitlab.lesson-0.1.v1')
    if (plainObject(intro)) {
      record.legacyIntroSessions = typeof intro.sessions === 'number' ? intro.sessions : 0
      if (intro.completed===true) { record.completions['0.1'] = { at: new Date().toISOString(), note: '', physical: 'pending', fields: {}, legacy: true }; if(!Array.isArray(intro.xpAwards)||intro.xpAwards.includes('lesson:0.1:first-completion'))record.awards.push('0.1') }
    }
    const course = parse('circuitlab.course.v2')
    if (plainObject(course)) for (const group of ['lessons', 'assessments']) if (plainObject(course[group])) for (const [id, value] of Object.entries(course[group])) {
      if (!knownId(id) || id.startsWith('review:') || !plainObject(value) || typeof value.note !== 'string' || typeof value.completedAt !== 'string') continue
      record.completions[id] = { at: Number.isFinite(Date.parse(value.completedAt)) ? value.completedAt : new Date().toISOString(), note: value.note, physical: value.evidence === 'self-reported' && value.note ? 'reported' : 'pending', fields: {}, legacy: true, ...(Array.isArray(value.attempts) ? { legacyAttempts: value.attempts } : {}), ...(Array.isArray(value.reviewStatuses) ? { reviewStatuses: Object.fromEntries(value.reviewStatuses.map((v,i)=>[String(i),String(v)])) } : {}) }
      record.awards.push(id)
    }
    // Legacy keys remain intact. A new-format save is attempted only by the app.
    record.awards=[...new Set(record.awards)]
    return { record, status: { durable: true } }
  } catch { return { record: emptyRecord(), status: { durable: false, error: 'The saved record could not be read. Existing stored data has been kept. Export this session before closing, or import a known backup.' } } }
}
export function persistRecord(storage: Pick<Storage,'setItem'>, record: LearningRecord): StorageResult {
  try { storage.setItem(RECORD_KEY, JSON.stringify(record)); return { durable: true } }
  catch { return { durable: false, error: 'Storage is unavailable. Your work is held in this session. Download a backup before closing, then retry saving.' } }
}
export function mergeRecords(current: LearningRecord, imported: LearningRecord): LearningRecord {
  const completions = { ...current.completions }
  for (const [id, value] of Object.entries(imported.completions)) if (!completions[id] || Date.parse(value.at) > Date.parse(completions[id].at)) completions[id] = value
  const submissions = [...new Map([...imported.submissions, ...current.submissions].map(s=>[s.id,s])).values()].sort((a,b)=>Date.parse(a.at)-Date.parse(b.at))
  return { ...current, completions, submissions, exposures:{...imported.exposures,...current.exposures}, drafts: { ...imported.drafts, ...current.drafts }, awards: [...new Set([...current.awards, ...imported.awards])], legacyIntroSessions: Math.max(current.legacyIntroSessions, imported.legacyIntroSessions) }
}
export function xpFor(record: LearningRecord) { return record.awards.reduce((sum,id)=>sum+(id==='final'?20:id.startsWith('unit-')?15:id.startsWith('review:')?0:10),0) }
export function addSubmission(record: LearningRecord, submission: Submission) { return record.submissions.some(s=>s.id===submission.id) ? record : { ...record, submissions: [...record.submissions, submission] } }
export function skillEvidence(record: LearningRecord, skillId: string, now = Date.now()) {
  const events = record.submissions.filter(s=>s.phase==='complete' && s.skillIds.includes(skillId) && s.taskVersion===COURSE_VERSION && currentProblem(s)).sort((a,b)=>Date.parse(a.at)-Date.parse(b.at))
  const latest = events.at(-1)
  const independent = events.filter(s=>s.correct && !s.assisted && !s.repeated && s.firstSubmission)
  const lastIndependent = independent.at(-1)
  // Initial spacing is a product choice: 1 day after supported work, 7 after a
  // fresh success, 21 after a successful later review. Never gate the course.
  const interval = latest?.correct && !latest.assisted && !latest.repeated && latest.firstSubmission ? latest.purpose==='review'&&independent.length>1?21:7 : 1
  const dueAt = latest ? Date.parse(latest.at) + interval * 86400000 : undefined
  return { events, latest, lastIndependent, independentCount: independent.length, dueAt, due: dueAt !== undefined && dueAt <= now, needsPractice: Boolean(latest && (!latest.correct || latest.assisted || latest.repeated || !latest.firstSubmission)), label: !latest ? 'No current evidence' : !latest.correct ? 'Needs practice' : latest.assisted ? 'Practiced with support' : latest.repeated ? 'Repeated case practiced' : !latest.firstSubmission ? 'Corrected practice' : 'Fresh task demonstrated' }
}
