import {activityTasks,makeTask,VARIANTS} from './learningTasks.ts'
import {COURSE_VERSION,type ActivityDraft,type LearningRecord,type Answer} from './learningStore.ts'
import type {TaskCase} from './taskTypes.ts'
export function freshVariant(record:LearningRecord,id:string,preferred=0,avoid?:string,finalCase=false){for(let i=0;i<VARIANTS;i++){const v=(preferred+i)%VARIANTS,task=makeTask(id,v,finalCase);if(task.variantId!==avoid&&!record.exposures[task.variantId]&&!record.submissions.some(s=>s.variantId===task.variantId))return v}return Array.from({length:VARIANTS},(_,i)=>(preferred+i)%VARIANTS).find(v=>makeTask(id,v,finalCase).variantId!==avoid)??preferred%VARIANTS}
export function createDraft(record:LearningRecord,id:string):ActivityDraft {
  const prior=record.drafts[id],completed=record.completions[id];const taskId=activityTasks(id)[0]
  if(prior&&prior.taskVersion===COURSE_VERSION&&prior.index<activityTasks(id).length)return prior
  const preferred=id==='final'?4:id.startsWith('unit-')?3:id.startsWith('review:')?2:0
  return {stage:'learn',index:0,variant:freshVariant(record,taskId,preferred,undefined,id==='final'),answers:{},helped:false,checked:false,note:prior?.note??completed?.note??'',physical:prior?.physical??completed?.physical??'pending',fields:prior?.fields??completed?.fields??{},reviewStatuses:prior?.reviewStatuses??completed?.reviewStatuses??{},startedAt:new Date().toISOString(),taskVersion:COURSE_VERSION,caseId:crypto.randomUUID(),revealed:false,retested:false,followup:false}
}
export function initialAnswers(task:TaskCase):Record<string,Answer>{return Object.fromEntries(task.parts.filter(p=>p.kind==='order').map(p=>{const ids=p.options!.map(x=>x.id);return[p.id,[...ids.slice(1),ids[0]]]}))}
