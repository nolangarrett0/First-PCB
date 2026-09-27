import { useEffect, useRef, useState, type ReactNode } from 'react'
import { StageVisual } from './StageVisual'
import { CourseActivity, type ActivityRecord, type CourseRecord } from './CourseActivity'
import { courseUnits, firstLessonTitle, lessonById } from './courseContent'
import './App.css'

type IconName = 'chip' | 'book' | 'check' | 'lock' | 'arrow' | 'close' | 'up' | 'down' | 'file' | 'board' | 'tool' | 'target'
type StageId = 'schematic' | 'layout' | 'files' | 'bare' | 'tested'
type Step = 'intro' | 'order' | 'apply' | 'result'
type Feedback = { correct: boolean; message: string } | null
type Progress = { completed: boolean; sessions: number; xpAwards: string[] }

const STORAGE_KEY = 'circuitlab.lesson-0.1.v1'
const COURSE_STORAGE_KEY = 'circuitlab.course.v2'
const emptyProgress: Progress = { completed: false, sessions: 0, xpAwards: [] }
const emptyCourseRecord: CourseRecord = { lessons: {}, assessments: {} }
const LESSON_XP_AWARD = 'lesson:0.1:first-completion'
const XP_PER_LESSON = 10
const getXp = (progress: Progress, course: CourseRecord) => (progress.xpAwards.includes(LESSON_XP_AWARD) ? XP_PER_LESSON : 0) + Object.keys(course.lessons).length * 10 + Object.keys(course.assessments).reduce((sum, id) => sum + (id === 'final' ? 20 : 15), 0)
const initialOrder: StageId[] = ['files', 'schematic', 'bare', 'layout', 'tested']
const stages: { id: StageId; title: string; description: string; hint: string; icon: IconName }[] = [
  { id: 'schematic', title: 'Draw the schematic', description: 'Show parts and electrical connections.', hint: 'records connections before physical placement.', icon: 'book' },
  { id: 'layout', title: 'Lay out the PCB', description: 'Place parts and route copper.', hint: 'turns the schematic into a physical design.', icon: 'board' },
  { id: 'files', title: 'Export fabrication files', description: 'Provide copper, outline, and drill data.', hint: 'is exported from the completed board layout.', icon: 'file' },
  { id: 'bare', title: 'Receive the bare board', description: 'Inspect it before adding components.', hint: 'comes back from fabrication without components.', icon: 'board' },
  { id: 'tested', title: 'Assemble and test', description: 'Add parts and measure the real circuit.', hint: 'comes after receiving the bare board.', icon: 'tool' },
]
const pathIds = courseUnits.flatMap((unit, index) => [...unit.lessonIds, `unit-${index}`]).concat('final')
function readCourseRecord(): CourseRecord {
  try {
    const saved = JSON.parse(localStorage.getItem(COURSE_STORAGE_KEY) ?? 'null')
    if (saved && saved.lessons && saved.assessments && typeof saved.lessons === 'object' && typeof saved.assessments === 'object' && !Array.isArray(saved.lessons) && !Array.isArray(saved.assessments)) {
      const valid = (record: unknown): record is ActivityRecord => Boolean(record && typeof record === 'object' && 'note' in record && typeof record.note === 'string' && 'completedAt' in record && typeof record.completedAt === 'string')
      return { lessons: Object.fromEntries(Object.entries(saved.lessons).filter(([id, record]) => Boolean(lessonById[id]) && valid(record))) as Record<string, ActivityRecord>, assessments: Object.fromEntries(Object.entries(saved.assessments).filter(([id, record]) => (id === 'final' || /^unit-[0-9]$/.test(id)) && valid(record))) as Record<string, ActivityRecord> }
    }
  } catch { /* Storage may be unavailable; keep this session in memory. */ }
  return emptyCourseRecord
}

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    chip: <><rect x="6" y="6" width="12" height="12" rx="2" /><path d="M9 2v4m6-4v4M9 18v4m6-4v4M2 9h4m-4 6h4m12-6h4m-4 6h4" /></>,
    book: <><path d="M4 5c3-1 6-.5 8 1 2-1.5 5-2 8-1v14c-3-1-6-.5-8 1-2-1.5-5-2-8-1z" /><path d="M12 6v14" /></>,
    check: <path d="m4 12 5 5L20 6" />,
    lock: <><rect x="5" y="10" width="14" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>,
    arrow: <path d="M4 12h16m-7-7 7 7-7 7" />,
    close: <path d="M5 5 19 19M19 5 5 19" />,
    up: <path d="m6 14 6-6 6 6" />,
    down: <path d="m6 10 6 6 6-6" />,
    file: <><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v5h4M9 12h6m-6 4h6" /></>,
    board: <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M8 3v5h5v5h8M3 16h7v5" /><circle cx="8" cy="11" r="1" /></>,
    tool: <path d="M14 5a5 5 0 0 0-6 6L3 16l5 5 5-5a5 5 0 0 0 6-6l-4 3-4-4z" />,
    target: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4" /><path d="M12 3v3m0 12v3M3 12h3m12 0h3" /></>,
  }
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>
}

function readProgress(): Progress {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null')
    if (saved && typeof saved.completed === 'boolean' && typeof saved.sessions === 'number') {
      return { completed: saved.completed, sessions: saved.sessions, xpAwards: Array.isArray(saved.xpAwards) ? saved.xpAwards : saved.completed ? [LESSON_XP_AWARD] : [] }
    }
  } catch { /* Storage may be unavailable; this session still works. */ }
  return emptyProgress
}

function Path({ progress, course, openLesson }: { progress: Progress; course: CourseRecord; openLesson: (id: string) => void }) {
  const completed = (progress.completed ? 1 : 0) + Object.keys(course.lessons).length
  const isDone = (id: string) => id === '0.1' ? progress.completed : id.startsWith('unit-') || id === 'final' ? Boolean(course.assessments[id]) : Boolean(course.lessons[id])
  const isReady = (id: string) => { const index = pathIds.indexOf(id); return index === 0 || isDone(pathIds[index - 1]) || isDone(id) }
  const nextId = pathIds.find(id => !isDone(id)) ?? 'final'
  const nextTitle = course.assessments.final ? 'All activities recorded' : nextId === 'final' ? 'Course review' : nextId.startsWith('unit-') ? `Unit ${Number(nextId.slice(5)) + 1} assessment` : nextId === '0.1' ? firstLessonTitle : lessonById[nextId]?.title
  const node = (id: string, title: string, ordinal: string, sway: number) => {
    const done = isDone(id), ready = isReady(id)
    return <li className={`trail-item sway-${sway}`} key={id}><span className="trail-line" aria-hidden="true" /><button type="button" className={`trail-node ${ready ? 'ready' : 'locked'} ${done ? 'done' : ''}`} disabled={!ready} onClick={() => openLesson(id)} aria-label={`${title}. ${ready ? done ? 'Review activity' : 'Start activity' : 'Locked activity'}`}><Icon name={done ? 'check' : ready ? 'arrow' : 'lock'} size={ready ? 27 : 20} /></button><div className="trail-text"><small>{ordinal}</small><strong>{title}</strong><em>{done ? 'Recorded · review anytime' : ready ? 'Ready to start' : 'Complete the previous activity'}</em></div></li>
  }
  return <div className="app-grid">
    <aside className="left-rail"><div className="brand"><Icon name="chip" size={26} />First PCB</div><span className="mobile-xp">{getXp(progress, course)} XP</span><div className="rail-label">YOUR COURSE</div><div className="rail-current"><Icon name="book" size={19} /> Lesson path</div><div className="rail-mission"><Icon name="target" size={22} /><span><strong>First PCB mission</strong><small>Learn the design process</small></span></div><p className="rail-note">Learn with examples and questions. Making a physical board is optional.</p></aside>
    <main className="path-main"><header className="path-hero"><div><span className="kicker">YOUR FIRST PCB</span><h1>Understand how a PCB is made.</h1><p>Use a simple LED board to learn design, fabrication, and testing. Making a physical board is optional.</p><div className="progress-track"><span style={{ width: `${completed / 56 * 100}%` }} /></div><small>{completed} of 56 lessons recorded</small></div><div className="hero-art" aria-hidden="true"><span className="art-chip"><Icon name="chip" size={36} /></span><span className="art-led" /><span className="art-line a" /><span className="art-line b" /><span className="art-label">LED 01</span></div></header>
      <div className="path-intro"><div><span className="kicker">THE COURSE PATH</span><h2>Continue learning</h2></div><span>10 units · 56 lessons · 11 checks</span></div>
      {courseUnits.map((unit, unitIndex) => <section className={`unit-section ${isReady(unit.lessonIds[0]) ? '' : 'future-unit'}`} key={unit.title} aria-labelledby={`unit-${unitIndex}`}><div className="unit-banner"><span className="unit-number">{String(unitIndex + 1).padStart(2, '0')}</span><div><small>UNIT {unitIndex + 1}</small><h3 id={`unit-${unitIndex}`}>{unit.title}</h3><p>{unit.lessonIds.length} lessons + assessment</p></div><b>{course.assessments[`unit-${unitIndex}`] ? 'RECORDED' : isReady(unit.lessonIds[0]) ? 'IN PROGRESS' : 'UP NEXT'}</b></div><ol className="trail-list">{unit.lessonIds.map((id, lessonIndex) => node(id, id === '0.1' ? firstLessonTitle : lessonById[id].title, id, lessonIndex % 3))}{node(`unit-${unitIndex}`, `Unit ${unitIndex + 1} assessment`, 'CHECK', unit.lessonIds.length % 3)}</ol></section>)}
      <section className="unit-section"><div className="unit-banner"><span className="unit-number"><Icon name="target" size={23} /></span><div><small>COURSE FINISH</small><h3>Course review</h3><p>Review what you learned and what you tried</p></div></div><ol className="trail-list">{node('final', 'Course review', 'FINAL', 1)}</ol></section>
    </main>
    <aside className="right-rail"><div className="profile"><span>FP</span><div><strong>Learning record</strong><small>Saved on this device</small></div></div><div className="xp-chip" aria-label={`${getXp(progress, course)} experience points`}><Icon name="target" size={18} /><strong>{getXp(progress, course)} XP</strong><span>Earned from activities</span></div><div className="side-card"><small>COURSE PROGRESS</small><strong className="big-stat">{completed} <span>/ 56</span></strong><p>Lessons recorded</p><div className="progress-track"><span style={{ width: `${completed / 56 * 100}%` }} /></div></div><div className="side-card"><small>{course.assessments.final ? 'COURSE RECORD' : 'NEXT ACTIVITY'}</small><h3>{nextTitle}</h3><p>Follow the path and record what you learned. Hands-on work is optional.</p><button className="side-link" onClick={() => openLesson(nextId)} type="button">{course.assessments.final ? 'Review final record' : 'Open activity'} <Icon name="arrow" size={16} /></button></div><p className="source-note">Examples use stated assumptions and link to sources. If you choose to build, check exact parts, tool instructions, and current fabrication rules.</p></aside>
  </div>
}

function Lesson({ exit, next, complete, prior }: { exit: () => void; next: () => void; complete: () => void; prior: Progress }) {
  const [step, setStep] = useState<Step>('intro')
  const [started, setStarted] = useState(false)
  const [exitOpen, setExitOpen] = useState(false)
  const [earnedXp, setEarnedXp] = useState(0)
  const keepButton = useRef<HTMLButtonElement>(null)
  const leaveButton = useRef<HTMLButtonElement>(null)
  const closeButton = useRef<HTMLButtonElement>(null)
  const [order, setOrder] = useState<StageId[]>(initialOrder)
  const [orderChecks, setOrderChecks] = useState(0)
  const [applyChecks, setApplyChecks] = useState(0)
  const [orderFeedback, setOrderFeedback] = useState<Feedback>(null)
  const [applyFeedback, setApplyFeedback] = useState<Feedback>(null)
  const [answer, setAnswer] = useState<string | null>(null)
  const [firstTry, setFirstTry] = useState(false)
  const hasUnsavedAttempt = started && step !== 'result'
  useEffect(() => {
    if (!hasUnsavedAttempt) return
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = true }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [hasUnsavedAttempt])
  useEffect(() => { if (exitOpen) keepButton.current?.focus() }, [exitOpen])
  function requestExit() { if (hasUnsavedAttempt) setExitOpen(true); else exit() }
  function keepLearning() { setExitOpen(false); requestAnimationFrame(() => closeButton.current?.focus()) }
  function modalKeys(event: React.KeyboardEvent) {
    if (event.key === 'Escape') { event.preventDefault(); keepLearning() }
    if (event.key === 'Tab') { event.preventDefault(); (event.shiftKey ? document.activeElement === keepButton.current ? leaveButton : keepButton : document.activeElement === leaveButton.current ? keepButton : leaveButton).current?.focus() }
  }
  function move(id: StageId, direction: -1 | 1) { const index = order.indexOf(id); const target = index + direction; if (target < 0 || target >= order.length) return; const next = [...order]; [next[index], next[target]] = [next[target], next[index]]; setOrder(next); setOrderFeedback(null) }
  function checkOrder() { const mismatch = order.findIndex((id, index) => id !== stages[index].id); setOrderChecks(n => n + 1); if (mismatch < 0) setOrderFeedback({ correct: true, message: 'The schematic defines connections. Layout turns them into a board. Fabrication makes the bare board. Assembly and testing show what the circuit actually does.' }); else { const expected = stages[mismatch]; const actual = stages.find(s => s.id === order[mismatch])!; setOrderFeedback({ correct: false, message: `At step ${mismatch + 1}, move “${expected.title}” into place. “${actual.title}” ${actual.hint}` }) } }
  function checkApply() { if (!answer) return; setApplyChecks(n => n + 1); setApplyFeedback(answer === 'assemble' ? { correct: true, message: 'Yes. A bare board has copper and holes, but still needs components and a real test.' } : { correct: false, message: answer === 'schematic' ? 'The schematic already guided the layout. The next step is to add parts and test.' : 'Those files were used to make this board. Now it needs parts and a test.' }) }
  function finish() { setFirstTry(orderChecks === 1 && applyChecks === 1); setEarnedXp(prior.xpAwards.includes(LESSON_XP_AWARD) ? 0 : XP_PER_LESSON); complete(); setStep('result') }
  const stepNumber = step === 'intro' ? 1 : step === 'order' ? 2 : 3
  return <div className="lesson-page"><header className="lesson-header"><div><button className="icon-button" onClick={requestExit} ref={closeButton} type="button" aria-label="Return to lesson path"><Icon name="close" size={21} /></button><div className="lesson-progress" aria-label={`Lesson step ${stepNumber} of 3`}><span style={{ width: `${stepNumber * 100 / 3}%` }} /></div><strong>01 / 56</strong></div></header><main className="lesson-main">
    {step === 'intro' && <article className="lesson-panel">
      <span className="lesson-eyebrow">UNIT 1 · LESSON 1</span><h1>From idea to tested PCB</h1>
      <div className="lesson-reading"><p className="reading-goal"><strong>Your task</strong>Explain the route from a circuit idea to a tested physical board.</p>
        <h2>Words you need</h2><dl className="reading-terms">
          <div><dt>Schematic</dt><dd>A drawing of the parts and their electrical connections.</dd></div>
          <div><dt>PCB layout</dt><dd>The physical placement of parts and copper connections on a printed circuit board.</dd></div>
          <div><dt>Fabrication files</dt><dd>The layer and drill data sent to a manufacturer to make the bare board.</dd></div>
          <div><dt>Assembly and test</dt><dd>Adding the parts, then checking that the real circuit behaves as intended.</dd></div>
        </dl><h2>How it works</h2><p>This course uses a small battery-powered LED circuit as its running example. The schematic says what connects. Layout puts those connections on a board. Fabrication produces the board without components. Assembly and testing reveal how the real circuit behaves if you choose to build it.</p>
        <div className="journey-preview" aria-label="Five stages from schematic to tested board">{stages.map((stage, index) => <figure className="journey-stage" key={stage.id}><StageVisual id={stage.id} /><figcaption><small>{String(index + 1).padStart(2, "0")}</small><strong>{stage.title}</strong></figcaption></figure>)}</div>
        <h2>Walk through an example</h2><p>Suppose you have drawn a battery, switch, resistor, and LED in a schematic, but have no physical board design. The next job is to place those parts and route their copper connections in the PCB layout before you can make fabrication files.</p>
      </div><div className="lesson-callout"><Icon name="target" size={22} /><p><strong>Your goal:</strong> put the five project stages in order, then decide what a newly fabricated board still needs.</p></div><button className="primary-button" type="button" onClick={() => { setStarted(true); setStep('order') }}>Start the challenge <Icon name="arrow" size={19} /></button><p className="lesson-source">Workflow reference: <a href="https://docs.kicad.org/10.0/en/getting_started_in_kicad/getting_started_in_kicad.html" target="_blank" rel="noreferrer">KiCad Getting Started</a>.</p>
    </article>}
    {step === 'order' && <article className="lesson-panel"><span className="lesson-eyebrow">PRACTICE · 2 OF 3</span><h1>Put the build in order</h1><p className="lesson-lead">Use the arrows to move each stage. What happens first, and what must happen before a board can be tested?</p><ol className="sort-list">{order.map((id, index) => { const stage = stages.find(s => s.id === id)!; return <li className="sort-card" key={id}><span className="sort-index">{String(index + 1).padStart(2, '0')}</span><span className="sort-visual"><StageVisual id={stage.id} /></span><span className="sort-copy"><strong>{stage.title}</strong><small>{stage.description}</small></span><span className="sort-controls"><button type="button" onClick={() => move(id, -1)} disabled={index === 0} aria-label={`Move ${stage.title} up`}><Icon name="up" size={19} /></button><button type="button" onClick={() => move(id, 1)} disabled={index === order.length - 1} aria-label={`Move ${stage.title} down`}><Icon name="down" size={19} /></button></span></li> })}</ol>{orderFeedback && <div className={`feedback ${orderFeedback.correct ? 'correct' : 'incorrect'}`} role="status"><strong>{orderFeedback.correct ? 'Correct order' : 'Try one change'}</strong><p>{orderFeedback.message}</p></div>}<div className="lesson-actions"><button className="text-button" type="button" onClick={() => setStep('intro')}>Back</button>{orderFeedback?.correct ? <button className="primary-button" type="button" onClick={() => setStep('apply')}>Continue <Icon name="arrow" size={19} /></button> : <button className="primary-button" type="button" onClick={checkOrder}>Check order <Icon name="check" size={19} /></button>}</div></article>}
    {step === 'apply' && <article className="lesson-panel"><span className="lesson-eyebrow">APPLY IT · 3 OF 3</span><h1>The bare board arrives. What next?</h1><p className="lesson-lead">Copper traces and drilled holes are in place, but there are no components on the board yet. Choose the next step toward a working circuit.</p><div className="bare-board-art" aria-hidden="true"><div><i /><i /><i /><i /><span /></div><b>BARE PCB</b></div><div className="answer-options" role="group" aria-label="Choose the next step">{[['schematic', 'Draw the schematic'], ['files', 'Export fabrication files'], ['assemble', 'Add the parts and test the circuit']].map(([id, label]) => <button className={answer === id ? 'selected' : ''} type="button" key={id} onClick={() => { setAnswer(id); setApplyFeedback(null) }}>{label}</button>)}</div>{applyFeedback && <div className={`feedback ${applyFeedback.correct ? 'correct' : 'incorrect'}`} role="status"><strong>{applyFeedback.correct ? 'That’s the next step' : 'Look at what you have'}</strong><p>{applyFeedback.message}</p></div>}<div className="lesson-actions"><button className="text-button" type="button" onClick={() => setStep('order')}>Back</button>{applyFeedback?.correct ? <button className="primary-button" type="button" onClick={finish}>Finish lesson <Icon name="arrow" size={19} /></button> : <button className="primary-button" type="button" onClick={checkApply} disabled={!answer}>Check answer <Icon name="check" size={19} /></button>}</div><p className="lesson-source">References: <a href="https://docs.kicad.org/10.0/en/getting_started_in_kicad/getting_started_in_kicad.html" target="_blank" rel="noreferrer">KiCad workflow</a> · <a href="https://learn.adafruit.com/adafruit-guide-excellent-soldering/making-a-good-solder-joint" target="_blank" rel="noreferrer">assembly</a> · <a href="https://learn.adafruit.com/multimeters?view=all" target="_blank" rel="noreferrer">testing</a></p></article>}
    {step === 'result' && <article className="lesson-panel result-panel"><div className="result-mark"><Icon name="check" size={42} /></div><span className="lesson-eyebrow">LESSON COMPLETE</span><h1>You’ve practiced the route.</h1><p className="lesson-lead">A schematic records connections. Layout turns them into a board. Fabrication makes the bare board. Assembly and measurement test the circuit.</p><div className="result-record"><Icon name="book" size={23} /><div><strong>Practice recorded</strong><p>{firstTry ? 'You finished both tasks on the first try. A later unit assessment will check the workflow in a new situation.' : 'You used feedback to correct the workflow. A later unit assessment will check it in a new situation.'}</p></div></div><div className="xp-result"><Icon name="target" size={19} />{earnedXp ? `+${earnedXp} XP earned for your first completion` : "XP already earned for this lesson"}</div><div className="result-actions"><button className="primary-button" type="button" onClick={next}>Next lesson: Work safely <Icon name="arrow" size={19} /></button><button className="secondary-button" type="button" onClick={exit}>Return to path</button></div></article>}
  </main>{exitOpen && <div className="exit-backdrop"><div className="exit-dialog" role="dialog" aria-modal="true" aria-labelledby="exit-title" onKeyDown={modalKeys}><span className="exit-icon"><Icon name="book" size={25} /></span><h2 id="exit-title">Leave this lesson?</h2><p>Your current answers and place in this lesson are not saved until you finish. Completed lessons and XP stay saved.</p><div className="exit-actions"><button className="primary-button" type="button" ref={keepButton} onClick={keepLearning}>Keep learning</button><button className="secondary-button" type="button" ref={leaveButton} onClick={exit}>Leave lesson</button></div></div></div>}</div>
}

function App() {
  const [progress, setProgress] = useState<Progress>(readProgress)
  const [course, setCourse] = useState<CourseRecord>(readCourseRecord)
  const [activityId, setActivityId] = useState<string | null>(null)
  function complete() { setProgress(current => { const next = { completed: true, sessions: current.sessions + 1, xpAwards: current.xpAwards.includes(LESSON_XP_AWARD) ? current.xpAwards : [...current.xpAwards, LESSON_XP_AWARD] }; try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch { /* Keep in-memory progress. */ } return next }) }
  function saveActivity(id: string, record: ActivityRecord) { setCourse(current => { const bucket = id.startsWith('unit-') || id === 'final' ? 'assessments' : 'lessons'; const next = { ...current, [bucket]: { ...current[bucket], [id]: record } }; try { localStorage.setItem(COURSE_STORAGE_KEY, JSON.stringify(next)) } catch { /* Keep in-memory progress. */ } return next }) }
  if (activityId === '0.1') return <Lesson exit={() => setActivityId(null)} next={() => setActivityId('0.2')} complete={complete} prior={progress} />
  if (activityId) return <CourseActivity key={activityId} activityId={activityId} close={() => setActivityId(null)} nextId={pathIds[pathIds.indexOf(activityId) + 1]} openNext={setActivityId} save={saveActivity} prior={activityId.startsWith('unit-') || activityId === 'final' ? course.assessments[activityId] : course.lessons[activityId]} />
  return <Path progress={progress} course={course} openLesson={setActivityId} />
}

export default App
