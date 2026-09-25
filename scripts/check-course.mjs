import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { courseUnits, finalReviewItems, lessons, sources, unitAssessments } from '../src/courseContent.ts'

const ids = courseUnits.flatMap(unit => unit.lessonIds)
const planned = [...readFileSync(new URL('../docs/curriculum-plan.md', import.meta.url), 'utf8').matchAll(/^\| (\d+\.\d+) \|/gm)].map(match => match[1])
assert.equal(courseUnits.length, 10, 'Expected ten units')
assert.equal(ids.length, 56, 'Expected 56 course lessons')
assert.equal(new Set(ids).size, 56, 'Lesson IDs must be unique')
assert.deepEqual(ids, planned, 'App lesson order must match the curriculum plan')
assert.deepEqual(ids.slice(1), lessons.map(item => item.id), 'Every post-intro lesson needs playable content')

for (const item of lessons) {
  assert.ok(item.title && item.learn.length > 60 && item.prompt && item.evidence, `${item.id}: missing teaching or practice text`)
  assert.equal(item.options.length, 3, `${item.id}: expected three answer options`)
  assert.ok(item.correct >= 0 && item.correct < item.options.length, `${item.id}: invalid answer index`)
  assert.ok(item.why && item.sources.length, `${item.id}: missing feedback or source`)
  for (const id of item.sources) assert.ok(sources[id]?.url.startsWith('https://'), `${item.id}: missing source ${id}`)
  if (item.numeric) assert.ok(item.numeric.answer > 0 && item.numeric.tolerance > 0 && item.numeric.unit, `${item.id}: invalid numeric exercise`)
}
assert.equal(unitAssessments.length, 10, 'Each unit needs an assessment')
for (const [index, checks] of unitAssessments.entries()) {
  assert.equal(checks.length, 3, `Unit ${index + 1}: expected three assessment questions`)
  for (const check of checks) assert.ok(check.prompt && check.why && check.options[check.correct], `Unit ${index + 1}: incomplete check`)
}
assert.equal(finalReviewItems.length, 7, 'Final review evidence list changed unexpectedly')
console.log('56 lessons, ten three-question assessments, sources, and final review match the curriculum plan.')
