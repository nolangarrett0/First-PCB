import type { Answer } from './learningStore'
import type { SourceId } from './courseContent'
export type Choice = { id: string; label: string; feedback: string }
export type Part = {
  id: string; prompt: string; kind: 'choice' | 'number' | 'nodes' | 'order'; options?: Choice[]; expected: string | string[] | number;
  units?: string[]; baseUnit?: string; tolerance?: number; hint: string; explanation: string; skillIds: string[];
}
export type ArtifactKind = 'basics'|'circuit'|'workflow'|'breadboard'|'datasheet'|'switch'|'footprint'|'junction'|'board'|'package'|'rules'|'measurements'|'station'|'joints'|'files'
export type Artifact = { kind: ArtifactKind; fault?: string; variant: number; voltage?: number; resistance?: number; ledVoltage?: number; current?: number; pitch?: number; rows?: string[][]; observation?: string; retestObservation?:string; target?: string; caption?: string }
export type TaskCase = { id: string; variantId: string; title: string; context: string; artifact: Artifact; parts: Part[]; sources: SourceId[]; revealAfter?: number; retestAfter?:number }
export type LessonPlan = { id: string; outcome: string; steps: string[]; example: string; optionalSteps?: string[]; records?: string[]; prerequisites?: string[] }
export type Grade = { correct: boolean; feedback: string; mistake?: string }
const scale: Record<string,number> = { A:1,mA:0.001,V:1,mV:0.001,'Ω':1,'kΩ':1000,W:1,mW:0.001,mm:1,'°C':1,connections:1,pins:1 }
export function gradePart(part: Part, answer?: Answer): Grade {
  if (part.kind==='number') {
    if (!answer || typeof answer==='string' || Array.isArray(answer) || !answer.value.trim() || !Number.isFinite(Number(answer.value)) || !part.units?.includes(answer.unit)) return {correct:false,feedback:'Enter a finite value and choose its unit.',mistake:'missing-value-unit'}
    const value = Number(answer.value)*scale[answer.unit]/scale[part.baseUnit!]
    const expected = Number(part.expected)
    if (Math.abs(value-expected) <= (part.tolerance??0.00001)) return {correct:true,feedback:part.explanation}
    if (Math.abs(value-expected*1000)<Math.abs(expected)*0.02 || Math.abs(value-expected/1000)<Math.abs(expected)*0.00002) return {correct:false,feedback:'Check the unit scale: A and mA (or Ω and kΩ, W and mW) differ by 1000. Keep the number and its unit together.',mistake:'unit-scale'}
    return {correct:false,feedback:part.hint,mistake:'calculation'}
  }
  if (part.kind==='nodes' || part.kind==='order') {
    const got=Array.isArray(answer)?answer:[]; const wanted=part.expected as string[]
    const match=part.kind==='order' ? got.length===wanted.length && got.every((x,i)=>x===wanted[i]) : got.length===wanted.length && wanted.every(x=>got.includes(x)) && new Set(got).size===got.length
    return {correct:match,feedback:match?part.explanation:part.hint,...(!match?{mistake:part.kind==='order'?'sequence':'endpoints'}:{})}
  }
  const correct=answer===part.expected
  const choice=part.options?.find(o=>o.id===answer)
  return {correct,feedback:correct?part.explanation:choice?.feedback??'Choose one answer using the displayed artifact.',...(!correct?{mistake:choice?.id??'missing-choice'}:{})}
}
export function answerPresent(part: Part, answer?: Answer) {
  if(part.kind==='number') return Boolean(answer && typeof answer!=='string' && !Array.isArray(answer) && answer.value.trim() && Number.isFinite(Number(answer.value)) && answer.unit)
  if(part.kind==='nodes' || part.kind==='order') return Array.isArray(answer) && answer.length>0
  return typeof answer==='string' && Boolean(answer)
}
