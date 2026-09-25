import { useEffect, useRef, useState } from 'react'
import { ConceptVisual } from './ConceptVisual'
import { courseUnits, finalReviewItems, lessonById, sources, unitAssessments } from './courseContent'

export type ActivityRecord = { note: string; completedAt: string; evidence: 'practice' | 'self-reported'; reviewStatuses?: ('present' | 'pending')[] }
export type CourseRecord = { lessons: Record<string, ActivityRecord>; assessments: Record<string, ActivityRecord> }

const closeMark = <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 5 19 19M19 5 5 19" /></svg>
const arrowMark = <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 12h16m-7-7 7 7-7 7" /></svg>
const draftKey = (id: string) => `circuitlab.activity-draft.${id}.v1`
function readDraft(id: string): { note?: string; statuses?: ('unreviewed' | 'present' | 'pending')[] } {
  try {
    const draft = JSON.parse(localStorage.getItem(draftKey(id)) ?? 'null')
    if (!draft || typeof draft !== 'object') return {}
    return { note: typeof draft.note === 'string' ? draft.note : undefined, statuses: Array.isArray(draft.statuses) ? draft.statuses.map((status: unknown) => status === 'present' || status === 'pending' ? status : 'unreviewed') : undefined }
  } catch { return {} }
}

export function CourseActivity({ activityId, close, save, prior }: { activityId: string; close: () => void; save: (id: string, record: ActivityRecord) => void; prior?: ActivityRecord }) {
  const isFinal = activityId === 'final'
  const isAssessment = activityId.startsWith('unit-')
  const unitIndex = isAssessment ? Number(activityId.slice(5)) : -1
  const item = lessonById[activityId]
  const unit = courseUnits[unitIndex]
  const [draft] = useState(() => readDraft(activityId))
  const [step, setStep] = useState<'learn' | 'practice' | 'record' | 'done'>('learn')
  const [selected, setSelected] = useState<number | null>(null)
  const [numberAnswer, setNumberAnswer] = useState('')
  const [checked, setChecked] = useState(false)
  const [questionIndex, setQuestionIndex] = useState(0)
  const check = unitAssessments[unitIndex]?.[questionIndex]
  const [note, setNote] = useState(typeof draft.note === 'string' ? draft.note : prior?.note ?? '')
  const [reviewStatuses, setReviewStatuses] = useState<('unreviewed' | 'present' | 'pending')[]>(finalReviewItems.map((_, index) => draft.statuses?.[index] ?? prior?.reviewStatuses?.[index] ?? 'unreviewed'))
  const [exitOpen, setExitOpen] = useState(false)
  const [earned, setEarned] = useState(false)
  const closeRef = useRef<HTMLButtonElement>(null)
  const keepRef = useRef<HTMLButtonElement>(null)
  const leaveRef = useRef<HTMLButtonElement>(null)
  const dirty = step !== 'learn' && step !== 'done'
  useEffect(() => {
    if (!dirty) return
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = true }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])
  useEffect(() => { if (exitOpen) keepRef.current?.focus() }, [exitOpen])
  useEffect(() => { if (step !== 'done') { try { localStorage.setItem(draftKey(activityId), JSON.stringify({ note, statuses: reviewStatuses })) } catch { /* In-memory editing still works. */ } } }, [activityId, note, reviewStatuses, step])
  const dismissExit = () => { setExitOpen(false); requestAnimationFrame(() => closeRef.current?.focus()) }
  const requestClose = () => dirty ? setExitOpen(true) : close()
  const options = isAssessment ? check.options : item?.options
  const correct = isAssessment ? check.correct : item?.correct
  const numeric = isAssessment ? undefined : item?.numeric
  const hasAnswer = numeric ? numberAnswer.trim() !== '' && Number.isFinite(Number(numberAnswer)) : selected !== null
  const answerCorrect = numeric ? hasAnswer && Math.abs(Number(numberAnswer) - numeric.answer) <= numeric.tolerance : selected === correct
  const title = isFinal ? 'Final design review' : isAssessment ? `Unit ${unitIndex + 1} assessment` : item?.title ?? 'Lesson'
  const recordPrompt = isFinal ? 'Summarize what the evidence shows, what is self-reported, and what remains unverified.' : isAssessment ? 'Describe your answer in your own words or point to the relevant unit artifact.' : item?.evidence ?? ''
  const hasNote = note.trim().length >= 12
  const canSave = hasNote && (!isFinal || reviewStatuses.every(status => status !== 'unreviewed'))
  const evidence: ActivityRecord['evidence'] = item?.work || isFinal ? 'self-reported' : 'practice'
  const pendingCount = reviewStatuses.filter(status => status === 'pending').length
  const reviewList = isFinal && <div className="review-list">{finalReviewItems.map((label, index) => <label key={label}><span>{label}</span><select aria-label={`${label} status`} value={reviewStatuses[index]} onChange={event => setReviewStatuses(current => current.map((status, i) => i === index ? event.target.value as 'unreviewed' | 'present' | 'pending' : status))}><option value="unreviewed">Select status</option><option value="present">Present</option><option value="pending">Pending</option></select></label>)}</div>
  function finish() {
    if (!canSave) return
    save(activityId, { note: note.trim(), completedAt: new Date().toISOString(), evidence, ...(isFinal ? { reviewStatuses: reviewStatuses as ('present' | 'pending')[] } : {}) })
    try { localStorage.removeItem(draftKey(activityId)) } catch { /* Saved record remains in memory. */ }
    setEarned(!prior)
    setStep('done')
  }
  function nextQuestion() {
    if (isAssessment && questionIndex < unitAssessments[unitIndex].length - 1) { setQuestionIndex(index => index + 1); setSelected(null); setChecked(false) }
    else setStep('record')
  }
  function trapKeys(event: React.KeyboardEvent) {
    if (event.key === 'Escape') { event.preventDefault(); dismissExit() }
    if (event.key === 'Tab') { event.preventDefault(); (event.shiftKey ? document.activeElement === keepRef.current ? leaveRef : keepRef : document.activeElement === leaveRef.current ? keepRef : leaveRef).current?.focus() }
  }
  return <div className="lesson-page"><header className="lesson-header"><div><button ref={closeRef} className="icon-button" type="button" onClick={requestClose} aria-label="Return to lesson path">{closeMark}</button><div className="lesson-progress" aria-label={`Activity stage ${step === 'learn' ? 1 : step === 'practice' ? 2 : 3} of 3`}><span style={{ width: `${step === 'learn' ? 33 : step === 'practice' ? 66 : 100}%` }} /></div><strong>{isFinal ? 'FINAL' : isAssessment ? `CHECK ${unitIndex + 1}/10` : `${item.id} / 56`}</strong></div></header><main className="lesson-main"><article className="lesson-panel activity-panel">
    {step === 'learn' && <><span className="lesson-eyebrow">{isFinal ? 'COURSE REVIEW' : isAssessment ? `UNIT ${unitIndex + 1} · CHECK` : `LESSON ${item.id}`}</span><h1>{title}</h1>{isFinal ? <><p className="lesson-lead">Review the evidence from your original board and independent LED change. Mark each item Present or Pending. This app has not inspected your hardware or KiCad files, so the result remains self-reported.</p><div className="activity-visual"><ConceptVisual id="final" /></div></> : isAssessment ? <><p className="lesson-lead">Use a new situation to check the most important idea from {unit.title.toLowerCase()}. The check also asks for a short explanation or artifact note. A correct choice does not verify physical hardware.</p><div className="activity-visual"><ConceptVisual id={activityId} /></div></> : <><p className="lesson-lead">{item.learn}</p><div className="activity-visual"><ConceptVisual id={item.id} /></div>{item.work && <div className="activity-caution"><strong>{item.work === 'bench' ? 'Physical work' : 'Design file work'}</strong><p>The app records your notes as self-reported. It cannot inspect your hardware or KiCad files. Exact part and fabrication choices in the reference design still require review.</p></div>}<div className="activity-sources"><strong>Sources for this lesson</strong>{item.sources.map(id => <a key={id} href={sources[id].url} target="_blank" rel="noreferrer">{sources[id].title} ↗</a>)}</div></>}<div className="lesson-actions"><span className="activity-helper">{isFinal ? 'Review the evidence and pending work.' : 'Read the explanation, then try a question.'}</span><button className="primary-button" type="button" onClick={() => setStep(isFinal ? 'record' : 'practice')}>Continue {arrowMark}</button></div></>}
    {step === 'practice' && options && <><span className="lesson-eyebrow">{isAssessment ? `UNIT CHECK · ${questionIndex + 1} OF 3` : 'PRACTICE'}</span><h1>{isAssessment ? `Check Unit ${unitIndex + 1}` : `Try it: ${title}`}</h1><p className="lesson-lead">{isAssessment ? check.prompt : item.prompt}</p>{numeric ? <label className="numeric-answer">Your answer <span><input aria-label={`Answer in ${numeric.unit}`} type="number" step="any" inputMode="decimal" value={numberAnswer} onChange={event => { setNumberAnswer(event.target.value); setChecked(false) }} /><strong>{numeric.unit}</strong></span></label> : <div className="answer-options" role="group" aria-label="Choose an answer">{options.map((option, index) => <button key={option} className={selected === index ? 'selected' : ''} type="button" onClick={() => { setSelected(index); setChecked(false) }}>{option}</button>)}</div>}{checked && hasAnswer && <div className={`feedback ${answerCorrect ? 'correct' : 'incorrect'}`} role="status"><strong>{answerCorrect ? 'Correct' : 'Check the reasoning'}</strong><p>{answerCorrect ? isAssessment ? check.why : item.why : `Consider the source-backed explanation: ${isAssessment ? check.why : item.why}`}</p></div>}<div className="lesson-actions"><button className="text-button" type="button" onClick={() => setStep('learn')}>Back</button>{checked && answerCorrect ? <button className="primary-button" type="button" onClick={nextQuestion}>Continue {arrowMark}</button> : <button className="primary-button" type="button" disabled={!hasAnswer} onClick={() => setChecked(true)}>Check answer</button>}</div></>}
    {step === 'record' && <><span className="lesson-eyebrow">{isFinal ? 'FINAL EVIDENCE' : isAssessment ? 'ASSESSMENT RECORD' : 'LEARNING RECORD'}</span><h1>{isFinal ? 'Review your evidence' : 'Record what you learned'}</h1><p className="lesson-lead">{recordPrompt}</p>{reviewList}<label className="record-label" htmlFor="activity-note">Your note</label><textarea id="activity-note" value={note} onChange={event => setNote(event.target.value)} placeholder={item?.work ? 'Describe what you actually did, or write “pending” and what you still need.' : 'Write at least one sentence in your own words.'} rows={5} /><p className="record-help">Draft note saved on this device as you type. {evidence === 'self-reported' ? 'Physical and design evidence is self-reported until independently reviewed.' : 'This is a practice note, not a mastery certificate.'}</p>{isFinal && <p className="record-help">{pendingCount} of {finalReviewItems.length} evidence items pending. Describe the missing work in your note.</p>}<div className="lesson-actions"><button className="text-button" type="button" onClick={() => setStep(isFinal ? 'learn' : 'practice')}>Back</button><button className="primary-button" type="button" disabled={!canSave} onClick={finish}>Save record {arrowMark}</button></div></>}
    {step === 'done' && <div className="result-panel"><div className="result-mark"><svg aria-hidden="true" width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m4 12 5 5L20 6" /></svg></div><span className="lesson-eyebrow">{isFinal ? 'REVIEW RECORDED' : isAssessment ? 'UNIT CHECK RECORDED' : 'LESSON COMPLETE'}</span><h1>{isFinal ? 'Your review is saved.' : 'Practice recorded.'}</h1><p className="lesson-lead">{isFinal ? `${pendingCount} of ${finalReviewItems.length} evidence items remain pending. Your review is self-reported; a real design and build review is still needed to verify physical results.` : isAssessment ? 'These changed-case answers and your note are saved. Revisit the unit if you want more practice.' : 'Your answer and note are saved. Later checks will revisit this skill in a new situation.'}</p><div className="xp-result">{earned ? `+${isFinal ? 20 : isAssessment ? 15 : 10} XP for this first completion` : 'XP already earned for this activity'}</div><button className="primary-button" type="button" onClick={close}>Return to path {arrowMark}</button></div>}
  </article></main>{exitOpen && <div className="exit-backdrop"><div className="exit-dialog" role="dialog" aria-modal="true" aria-labelledby="course-exit-title" onKeyDown={trapKeys}><h2 id="course-exit-title">Leave this activity?</h2><p>Your current question and place will reset. Your draft note stays saved on this device, and previous completions remain.</p><div className="exit-actions"><button ref={keepRef} className="primary-button" type="button" onClick={dismissExit}>Keep learning</button><button ref={leaveRef} className="secondary-button" type="button" onClick={close}>Leave activity</button></div></div></div>}</div>
}
