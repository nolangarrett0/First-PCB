import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { courseUnits, finalReviewItems, lessons, sources, unitAssessments } from '../src/courseContent.ts'
import { lessonArticles } from '../src/lessonArticles.ts'
import { assessmentChoiceFeedback, lessonChoiceFeedback } from '../src/practiceFeedback.ts'
import { assessmentPracticeEdits, lessonPracticeEdits } from '../src/practiceEdits.ts'
import {makeTask,activityTasks,VARIANTS} from '../src/learningTasks.ts'
import {lessonPlans} from '../src/lessonPlans.ts'
import {sourceLedger} from '../src/sourceLedger.ts'
import {basicsChoiceFeedback} from '../src/electronicsBasics.ts'

const ids = courseUnits.flatMap(unit => unit.lessonIds)
const planned = [...readFileSync(new URL('../docs/curriculum-plan.md', import.meta.url), 'utf8').matchAll(/^\| ((?:E|\d+)\.\d+) \|/gm)].map(match => match[1])
assert.equal(courseUnits.length, 11, 'Expected basics plus ten project units')
assert.equal(ids.length, 65, 'Expected 65 course lessons')
assert.equal(new Set(ids).size, 65, 'Lesson IDs must be unique')
assert.deepEqual(ids, planned, 'App lesson order must match the curriculum plan')
assert.deepEqual(ids.filter(id=>id!=='0.1'), lessons.map(item => item.id), 'Every post-intro lesson needs playable content')
assert.deepEqual(Object.keys(lessonArticles).sort(), ids.filter(id=>id!=='0.1').sort(), 'Every post-intro lesson needs a teaching article')

for (const item of lessons) {
  assert.ok(item.title && item.learn.length > 60 && item.prompt && item.evidence, `${item.id}: missing teaching or practice text`)
  assert.equal(item.options.length, 3, `${item.id}: expected three answer options`)
  assert.ok(item.correct >= 0 && item.correct < item.options.length, `${item.id}: invalid answer index`)
  assert.ok(item.why && item.sources.length, `${item.id}: missing feedback or source`)
  const article = lessonArticles[item.id]
  assert.ok(article.terms.length && article.terms.every(([term, meaning]) => term && meaning.length > 25), `${item.id}: missing beginner vocabulary`)
  assert.ok(article.workedExample.length > 90, `${item.id}: missing worked example`)
  for (const id of item.sources) assert.ok(sources[id]?.url.startsWith('https://'), `${item.id}: missing source ${id}`)
  if (item.numeric) {
    assert.ok(item.numeric.answer > 0 && item.numeric.tolerance > 0 && item.numeric.unit, `${item.id}: invalid numeric exercise`)
    assert.ok(Math.abs(Number.parseFloat(item.options[item.correct]) - item.numeric.answer) <= item.numeric.tolerance, `${item.id}: numeric answer disagrees with the displayed choice`)
  }
  else {
    const feedback = lessonChoiceFeedback[item.id] ?? basicsChoiceFeedback[item.id]
    assert.ok(feedback, `${item.id}: missing choice-specific feedback`)
    assert.equal(feedback[item.correct], null, `${item.id}: correct choice should not have error feedback`)
    for (const [index, explanation] of feedback.entries()) if (index !== item.correct) assert.ok(explanation?.length > 15, `${item.id}: choice ${index} needs useful correction`)
  }
}
for (const id of Object.keys(lessonPracticeEdits)) assert.ok(lessons.some(item => item.id === id), `Unknown lesson edit ${id}`)
assert.equal(unitAssessments.length, 10, 'Each unit needs an assessment')
for (const [index, checks] of unitAssessments.entries()) {
  assert.equal(checks.length, 3, `Unit ${index + 1}: expected three assessment questions`)
  assert.equal(new Set(checks.map(check => check.prompt.toLowerCase())).size, 3, `Unit ${index + 1}: duplicate assessment prompt`)
  for (const [questionIndex, check] of checks.entries()) {
    assert.ok(check.prompt && check.why && check.options[check.correct], `Unit ${index + 1}: incomplete check`)
    const feedback = assessmentChoiceFeedback[`${index}-${questionIndex}`]
    assert.ok(feedback, `Unit ${index + 1}, question ${questionIndex + 1}: missing choice-specific feedback`)
    assert.equal(feedback[check.correct], null, `Unit ${index + 1}, question ${questionIndex + 1}: correct choice should not have error feedback`)
    for (const [optionIndex, explanation] of feedback.entries()) if (optionIndex !== check.correct) assert.ok(explanation?.length > 15, `Unit ${index + 1}, question ${questionIndex + 1}: choice ${optionIndex} needs useful correction`)
  }
}
for (const key of Object.keys(assessmentPracticeEdits)) assert.ok(assessmentChoiceFeedback[key], `Unknown assessment edit ${key}`)
assert.equal(finalReviewItems.length, 7, 'Course review topic list changed unexpectedly')
for(const id of ids){assert.ok(lessonPlans[id]?.outcome&&lessonPlans[id].steps.length>=3);const cases=Array.from({length:VARIANTS},(_,v)=>makeTask(id,v));assert.ok(new Set(cases.map(t=>t.variantId)).size>=2,`${id}: needs changed practice`);for(const t of cases){assert.ok(t.parts.length>=2);for(const source of t.sources)assert.ok(sources[source]&&sourceLedger[source])}}
for(const unit of courseUnits)assert.equal(activityTasks(unit.checkId).length,3)
assert.equal(activityTasks('final').length,6)
console.log('65 lesson contracts with changed practice, eleven integrated checks, six final tasks, and source metadata match the course. Legacy data remains valid.')
