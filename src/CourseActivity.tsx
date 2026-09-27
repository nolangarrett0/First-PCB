import { useEffect, useRef, useState } from 'react'
import { ConceptVisual } from './ConceptVisual'
import { courseUnits, finalReviewItems, lessonById, sources, unitAssessments, type LessonContent } from './courseContent'
import { lessonArticles } from './lessonArticles'
import { assessmentChoiceFeedback, lessonChoiceFeedback } from './practiceFeedback'

export type ActivityRecord = { note: string; completedAt: string; evidence: 'practice' | 'self-reported'; reviewStatuses?: ('present' | 'pending')[]; attempts?: { completedAt: string; firstTryCorrect: boolean[] }[] }
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

function LessonReading({ item }: { item: LessonContent }) {
  const article = lessonArticles[item.id]
  return <section className="lesson-reading" aria-label="Lesson article">
    <p className="reading-goal"><strong>{item.work ? 'Optional hands-on task' : 'Your task'}</strong>{item.evidence}</p>
    <h2>Words you need</h2>
    <dl className="reading-terms">{article.terms.map(([term, meaning]) => <div key={term}><dt>{term}</dt><dd>{meaning}</dd></div>)}</dl>
    <h2>How it works</h2>
    <p>{item.learn}</p>
    <div className="activity-visual"><ConceptVisual id={item.id} /></div>
    <h2>Walk through an example</h2>
    <p>{article.workedExample}</p>
  </section>
}

export function CourseActivity({ activityId, close, nextId, openNext, save, prior }: { activityId: string; close: () => void; nextId?: string; openNext: (id: string) => void; save: (id: string, record: ActivityRecord) => void; prior?: ActivityRecord }) {
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
  const [firstTryCorrect, setFirstTryCorrect] = useState<(boolean | null)[]>(() => Array(isAssessment ? 3 : isFinal ? 0 : 1).fill(null))
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
  const optionOffset = ([...`${activityId}:${questionIndex}`].reduce((hash, char) => Math.imul(hash ^ char.charCodeAt(0), 16777619) >>> 0, 2166136261) >>> 0) % 3
  const presentedOptions = options?.map((_, displayIndex) => { const originalIndex = (displayIndex + optionOffset) % 3; return { label: options[originalIndex], originalIndex } })
  const numeric = isAssessment ? undefined : item?.numeric
  const hasAnswer = numeric ? numberAnswer.trim() !== '' && Number.isFinite(Number(numberAnswer)) : selected !== null
  const answerCorrect = numeric ? hasAnswer && Math.abs(Number(numberAnswer) - numeric.answer) <= numeric.tolerance : selected === correct
  const choiceFeedback = isAssessment ? assessmentChoiceFeedback[`${unitIndex}-${questionIndex}`] : lessonChoiceFeedback[item?.id ?? '']
  let answerExplanation = ''
  if (answerCorrect) answerExplanation = isAssessment ? check.why : item.why
  else if (numeric) answerExplanation = `Check the calculation and units: ${item.why}`
  else if (selected !== null) answerExplanation = choiceFeedback?.[selected] ?? `Review the lesson idea: ${isAssessment ? check.why : item.why}`
  const title = isFinal ? 'Course review' : isAssessment ? `Unit ${unitIndex + 1} assessment` : item?.title ?? 'Lesson'
  const recordPrompt = isFinal ? 'Summarize what you learned, what you tried, and any hands-on work you chose to leave pending.' : isAssessment ? 'Optional: explain one decision you made in this check or note a topic to revisit.' : item?.work ? `Optional hands-on activity: ${item.evidence}` : `Optional reflection: ${item?.evidence ?? ''}`
  const hasNote = note.trim().length >= 12
  const canSave = !isFinal || (hasNote && reviewStatuses.every(status => status !== 'unreviewed'))
  const evidence: ActivityRecord['evidence'] = isFinal || (item?.work && note.trim()) ? 'self-reported' : 'practice'
  const pendingCount = reviewStatuses.filter(status => status === 'pending').length
  const resultMessage = isFinal
    ? `${pendingCount} of ${finalReviewItems.length} topics remain pending. Completing the course does not require a physical board.`
    : isAssessment
      ? firstTryCorrect.every(value => value === true)
        ? 'Your first answers were correct in these changed cases. Revisit the unit later to check retention.'
        : 'You corrected at least one answer using feedback. Revisit the idea in a later session.'
      : firstTryCorrect[0]
        ? 'Your first answer was correct. A later check will revisit the idea.'
        : 'You corrected your answer using feedback. A later check will revisit the idea.'
  const reviewList = isFinal && <div className="review-list">{finalReviewItems.map((label, index) => <label key={label}><span>{label}</span><select aria-label={`${label} status`} value={reviewStatuses[index]} onChange={event => setReviewStatuses(current => current.map((status, i) => i === index ? event.target.value as 'unreviewed' | 'present' | 'pending' : status))}><option value="unreviewed">Select status</option><option value="present">Present</option><option value="pending">Pending</option></select></label>)}</div>
  function finish() {
    if (!canSave) return
    const completedAt = new Date().toISOString()
    save(activityId, { note: note.trim(), completedAt, evidence, ...(isFinal ? { reviewStatuses: reviewStatuses as ('present' | 'pending')[] } : { attempts: [...(Array.isArray(prior?.attempts) ? prior.attempts : []), { completedAt, firstTryCorrect: firstTryCorrect.map(value => value === true) }] }) })
    try { localStorage.removeItem(draftKey(activityId)) } catch { /* Saved record remains in memory. */ }
    setEarned(!prior)
    setStep('done')
  }
  function nextQuestion() {
    if (isAssessment && questionIndex < unitAssessments[unitIndex].length - 1) { setQuestionIndex(index => index + 1); setSelected(null); setChecked(false) }
    else setStep('record')
  }
  function submitAnswer() {
    setFirstTryCorrect(current => current.map((result, index) => index === questionIndex && result === null ? answerCorrect : result))
    setChecked(true)
  }
  function trapKeys(event: React.KeyboardEvent) {
    if (event.key === 'Escape') { event.preventDefault(); dismissExit() }
    if (event.key === 'Tab') { event.preventDefault(); (event.shiftKey ? document.activeElement === keepRef.current ? leaveRef : keepRef : document.activeElement === leaveRef.current ? keepRef : leaveRef).current?.focus() }
  }
  return <div className="lesson-page"><header className="lesson-header"><div><button ref={closeRef} className="icon-button" type="button" onClick={requestClose} aria-label="Return to lesson path">{closeMark}</button><div className="lesson-progress" aria-label={`Activity stage ${step === 'learn' ? 1 : step === 'practice' ? 2 : 3} of 3`}><span style={{ width: `${step === 'learn' ? 33 : step === 'practice' ? 66 : 100}%` }} /></div><strong>{isFinal ? 'FINAL' : isAssessment ? `CHECK ${unitIndex + 1}/10` : `${item.id} / 56`}</strong></div></header><main className="lesson-main"><article className="lesson-panel activity-panel">
    {step === 'learn' && <><span className="lesson-eyebrow">{isFinal ? 'COURSE REVIEW' : isAssessment ? `UNIT ${unitIndex + 1} · CHECK` : `LESSON ${item.id}`}</span><h1>{title}</h1>{isFinal ? <><p className="lesson-lead">For each topic, mark Present if you can explain it, or Pending if you want to review it. In your note, say which hands-on work, if any, you tried. You can complete the course without making a physical board.</p><div className="activity-visual"><ConceptVisual id="final" /></div></> : isAssessment ? <><p className="lesson-lead">Use a new situation to check the most important idea from {unit.title.toLowerCase()}. The check also asks for a short explanation or artifact note. A correct choice does not verify physical hardware.</p><div className="activity-visual"><ConceptVisual id={activityId} /></div></> : <><LessonReading item={item} />{item.work && <div className="activity-caution"><strong>{item.work === 'bench' ? 'Physical work' : 'Design file work'}</strong><p>You can complete this lesson using the example; the hands-on note is optional. If you choose to build, verify exact parts, tool instructions, and safety before acting.</p></div>}<div className="activity-sources"><strong>Sources for this lesson</strong>{item.sources.map(id => <a key={id} href={sources[id].url} target="_blank" rel="noreferrer">{sources[id].title} ↗</a>)}</div></>}<div className="lesson-actions"><span className="activity-helper">{isFinal ? 'Review the topics and any pending work.' : 'Read the explanation, then try a question.'}</span><button className="primary-button" type="button" onClick={() => setStep(isFinal ? 'record' : 'practice')}>Continue {arrowMark}</button></div></>}
    {step === 'practice' && options && <><span className="lesson-eyebrow">{isAssessment ? `UNIT CHECK · ${questionIndex + 1} OF 3` : 'PRACTICE'}</span><h1>{isAssessment ? `Check Unit ${unitIndex + 1}` : `Try it: ${title}`}</h1><p className="lesson-lead">{isAssessment ? check.prompt : item.prompt}</p>{numeric ? <label className="numeric-answer">Your answer <span><input aria-label={`Answer in ${numeric.unit}`} type="number" step="any" inputMode="decimal" value={numberAnswer} onChange={event => { setNumberAnswer(event.target.value); setChecked(false) }} /><strong>{numeric.unit}</strong></span></label> : <div className="answer-options" role="group" aria-label="Choose an answer">{presentedOptions?.map(({ label, originalIndex }) => <button key={originalIndex} className={selected === originalIndex ? 'selected' : ''} type="button" onClick={() => { setSelected(originalIndex); setChecked(false) }}>{label}</button>)}</div>}{checked && hasAnswer && <div className={`feedback ${answerCorrect ? 'correct' : 'incorrect'}`} role="status"><strong>{answerCorrect ? 'Correct' : 'Check the reasoning'}</strong><p>{answerExplanation}</p></div>}<div className="lesson-actions"><button className="text-button" type="button" onClick={() => setStep('learn')}>Back</button>{checked && answerCorrect ? <button className="primary-button" type="button" onClick={nextQuestion}>Continue {arrowMark}</button> : <button className="primary-button" type="button" disabled={!hasAnswer} onClick={submitAnswer}>Check answer</button>}</div></>}
    {step === 'record' && <><span className="lesson-eyebrow">{isFinal ? 'COURSE REVIEW' : isAssessment ? 'ASSESSMENT RECORD' : 'LEARNING RECORD'}</span><h1>{isFinal ? 'Review your learning' : 'Record what you learned'}</h1><p className="lesson-lead">{recordPrompt}</p>{reviewList}<label className="record-label" htmlFor="activity-note">Your note</label><textarea id="activity-note" value={note} onChange={event => setNote(event.target.value)} placeholder={isFinal ? 'Summarize the topics you can explain and what you want to revisit.' : item?.work ? 'If you tried the hands-on activity, note what you observed. Otherwise, leave this blank.' : 'Add a note if it would help you remember this decision.'} rows={5} /><p className="record-help">{isFinal ? 'Your review note is saved on this device as you type.' : 'A note is optional. Your practice answer is recorded when you save.'} {item?.work ? 'Any files or hardware you describe are self-reported; this app does not inspect them.' : ''}</p>{isFinal && <p className="record-help">{pendingCount} of {finalReviewItems.length} topics pending. Describe what you want to review later.</p>}<div className="lesson-actions"><button className="text-button" type="button" onClick={() => setStep(isFinal ? 'learn' : 'practice')}>Back</button><button className="primary-button" type="button" disabled={!canSave} onClick={finish}>Save record {arrowMark}</button></div></>}
    {step === 'done' && <div className="result-panel"><div className="result-mark"><svg aria-hidden="true" width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m4 12 5 5L20 6" /></svg></div><span className="lesson-eyebrow">{isFinal ? 'REVIEW RECORDED' : isAssessment ? 'UNIT CHECK RECORDED' : 'LESSON COMPLETE'}</span><h1>{isFinal ? 'Your review is saved.' : 'Practice recorded.'}</h1><p className="lesson-lead">{resultMessage}</p><div className="xp-result">{earned ? `+${isFinal ? 20 : isAssessment ? 15 : 10} XP for this first completion` : 'XP already earned for this activity'}</div><div className="result-actions">{nextId && <button className="primary-button" type="button" onClick={() => openNext(nextId)}>{nextId.startsWith('unit-') ? 'Next: Unit assessment' : nextId === 'final' ? 'Next: Course review' : `Next lesson: ${lessonById[nextId].title}`} {arrowMark}</button>}<button className={nextId ? 'secondary-button' : 'primary-button'} type="button" onClick={close}>Return to path</button></div></div>}
  </article></main>{exitOpen && <div className="exit-backdrop"><div className="exit-dialog" role="dialog" aria-modal="true" aria-labelledby="course-exit-title" onKeyDown={trapKeys}><h2 id="course-exit-title">Leave this activity?</h2><p>Your current question and place will reset. Your draft note stays saved on this device, and previous completions remain.</p><div className="exit-actions"><button ref={keepRef} className="primary-button" type="button" onClick={dismissExit}>Keep learning</button><button ref={leaveRef} className="secondary-button" type="button" onClick={close}>Leave activity</button></div></div></div>}</div>
}
