# Implementation roadmap

This is the original proposal. The owner approved implementation; [the current handoff](implementation.md) records the delivered software and the remaining human/physical validation.

This is a proposed implementation sequence for the authorized audit. No production changes have been made. It is a substantial curriculum and interaction project; a cosmetic refresh or a single pass rewriting prose would leave the main learning gaps intact.

The first milestone should make three representative lessons work from explanation through later retrieval. [The lesson specifications](lesson-revisions.md) give their actual problems, answer keys, feedback, and checks. Then extend the tested pattern through [every lesson and unit check](coverage.md). Complete the core conceptual course without requiring hardware, while making optional physical work well supported and honestly recorded.

## 1. Establish the teaching project and protect learning records

These two workstreams can proceed together. Both are prerequisites for collecting trustworthy evidence from new activities.

### A consistent project

Create a versioned educational project with BT1, S1, R1, D1, named nets, numbered terminals, and explicit assumptions. Carry the same design through schematic, breadboard model, PCB view, export overlays, and measurement/fault cases. Author corrected and deliberately faulty artifact versions. Mark simulations and illustrative outputs clearly.

Resolve enough of the switch/holder/pin contract to make the teaching examples unambiguous. An educational contact diagram can be labeled as such. An exact purchasing/building package needs selected parts, datasheet checks, actual CAD files, and physical validation; track that as a separate deliverable. Do not silently turn a simulated example into an approved board recipe.

Expected artifacts: a complete schematic; connectivity table; pin-to-pad mapping; dimensioned board view; matching export-role manifest and overlays; sample measurement log; reviewed fault/observation table; source ledger. Use SVG for authored electrical/PCB models. Give each artifact a version and make its relationships inspectable without relying on color alone.

Acceptance: every claimed connection resolves to a known pair of terminals; visuals, calculations, and observations agree; seeded defects have a documented solution; the learner can see the reference against which a comparison is requested.

Likely code/content boundaries: replace broad unit fallback use in [ConceptVisual.tsx](../../src/ConceptVisual.tsx); introduce separate project/artifact data rather than placing geometry and diagnosis prose inside `CourseActivity.tsx`.

### Reliable records and resume

Move persistence behind a small storage interface with explicit saved/session-only/error results. Save submissions when they happen. Checkpoint the current activity, stage, question, problem version, selected/typed answers, assistance, and feedback state. Resume the same case instead of giving an abandoned mistake a new first attempt.

Migrate existing `circuitlab.course.v2` and introduction records conservatively. Preserve completion, XP, notes, timestamps, and Boolean history. Label old records as legacy evidence; do not infer previously unrecorded unaided performance. Preserve data until a new-format save succeeds. Provide local export/import so notes and attempts can be recovered across devices or storage resets.

Expose whether work was saved durably. “Practice recorded” must not imply a persistent save when only memory was updated. Add the main-process native-close decision documented for Electron and verify it with a separate profile. Unify meaningful introduction records with shared activities without losing its ordering exercise.

Acceptance: a submitted wrong answer survives exit/reload; a partially completed check resumes its actual position and case; a failed write is visible and exportable; migration retains old notes and awards; desktop close offers a clear decision and follows it. Test these failure/migration scenarios, rather than adding tests that merely assert type shapes.

Likely files: [App.tsx](../../src/App.tsx), [CourseActivity.tsx](../../src/CourseActivity.tsx), [electron/main.cjs](../../electron/main.cjs), plus a dedicated record/storage module.

## 2. Build three reusable practice interactions

Start with the following complete sequences. They sample different teaching needs and should reveal whether the underlying activity contract is sufficient.

| Lesson | New decision the learner performs | Useful evidence |
| --- | --- | --- |
| 1.5, resistor current | Select resistor endpoints, choose the voltage, calculate with units | Correct points, relationship, number/unit, and a fresh calculation after assistance |
| 6.2, output inspection | Inspect layers and compare the package with its approved reference | Located discrepancy, relevant layer/revision evidence, correct release action |
| 8.5, diagnosis | Choose a safe discriminating test, predict, observe, infer, and retest | Test setup, differentiated predictions, supported conclusion, and repeated relevant result |

Author finite reviewed variants before introducing generated practice. Every numeric variant needs an independent solution. Every circuit/fault variant needs consistent connectivity and observations. Randomizing answer positions alone does not create a new learning problem.

Separate the focused explanation from the actual task; show the relevant visual during practice. Supply an optional worked example/reference. Record opening that support, and keep assisted practice valuable. After revealing a solution, use a changed task. A later independent task should change values, locations, or evidence enough to test the intended relationship without introducing an untaught prerequisite.

Use accessible interactions from the outset: named terminal controls alongside SVG selection; numeric value and unit fields; keyboard layer controls; selected-state semantics; stage focus and announced feedback. Keep icons SVG with fixed centered button dimensions. Test all new interactions in an isolated headless browser and pertinent desktop behavior in Electron.

Acceptance: all cases in the lesson specifications behave as described; wrong answers get relevant corrections; changed retries use a fresh case; assistance and prior exposure are recorded; keyboard users can complete every required decision. A learner can explain what was checked in each lesson without being shown the answer first.

## 3. Introduce a small evidence model and visible review

Begin with a manageable set of skill IDs tied to the mission, for example: trace a closed path; identify measurement endpoints; calculate/convert; extract datasheet conditions; map physical pins; inspect nets; check a footprint; interpret configured rules; inspect exported files; plan an unpowered connection test; infer from evidence. Refine this list during authoring; avoid a separate score for every sentence.

An authored task contract should include:

| Field | Purpose |
| --- | --- |
| `taskId`, `taskVersion`, `variantId`, `skillIds` | Identify exactly what was attempted and which ability it samples |
| `artifactId` / revision, assumptions, source references | Make the displayed case and answer key reproducible |
| Interaction and expected decisions | Represent the actual skill, not only a prose prompt |
| Independently checked key and misconception feedback | Diagnose known mistakes without arbitrary grading |
| Hint/reference/solution exposure | Distinguish supported practice from a fresh unaided decision |
| Changed retry and later transfer variant | Test applying the correction and retrieving it later |

Store answer events with a submission ID, timestamp, actual answer, outcome, and support used. Derive review needs from those events; avoid rewriting history when the learner retries. Notes and self-reported hardware observations are separate fields. A migrated Boolean is not equivalent to the richer new record.

Show the learner prior notes, recent evidence, and a specific next review directly from the path. Keep “completed,” “practiced with help,” “demonstrated on a fresh task,” and “physical work reported” understandable. An isolated correct task is evidence for that task/skill, not a permanent mastery certificate. XP can continue to reward participation without becoming the competence metric.

Start with a few changed questions when a skill returns in the project and at a later visit. Pilot any initial one-day/one-week review intervals as choices. Do not make progress depend on returning at a particular clock time. A weak answer should select useful practice; a missing hardware record should not prevent conceptual review.

Acceptance: a learner can find an old note without retaking its question; a corrected answer and an unaided fresh answer are visibly distinguishable; a known weak skill gets a relevant changed review; resuming or changing the date does not duplicate submissions or awards; old completions stay accessible.

## 4. Extend the pattern through the complete curriculum

Use the per-lesson backlog, working in prerequisite order. The groups below use the content-unit prefixes in lesson IDs (0–9); the path displays units 1–10.

1. **Units 0–1:** actual safe-state choices, loop tracing, probe selection, units, and changed calculations. Keep the opening workflow activity and improve its saved evidence.
2. **Units 2–3:** datasheet extraction with conditions; current/power/range decisions; physical pin mapping; breadboard connectivity; observed-versus-predicted measurements. Supply the comparison artifacts currently absent.
3. **Units 4–6:** short KiCad procedures paired with schematic/board/output inspection. Add junction, symbol/footprint, ERC, routing, rule, outline, and release cases. Check procedures from a clean selected-version installation, with expected results and recovery steps.
4. **Units 7–8:** sourced station preparation, a worked joint-making sequence, licensed joint/board images, pre-power inspection, and measurement-driven fault tasks. Keep physical execution optional and separate from demonstrated conceptual decisions.
5. **Unit 9 and final:** a changed LED/design case that requires integrated review instead of restating the original answer. Retain pending-work reflection alongside the assessed conceptual task.

Rewrite unit checks to sample the skills just practiced and retrieve earlier prerequisites. Use plausible choices or direct artifact decisions, with no defect announced unless identifying that defect is outside the objective. Check whether wording cues make the right answer obvious. Rotate independently reviewed variants and record exposure.

Add an in-app reference for terms, units, meter modes, and the running project's connections. Reuse existing useful vocabulary, but make it reachable during a task. Keep procedures and explanations short by focusing each lesson on one job; do not omit the steps that let a beginner carry it out.

Acceptance for each revised lesson: the stated outcome is required in practice; a relevant worked example and visual exist; the feedback repairs an identifiable error; at least one changed case is available; sources support the used claim; evidence is saved and reviewable. Include these as authoring checks, with human review for instructional/visual adequacy.

## 5. Validate independent transfer and real use

Implement a final task with a new component excerpt, changed circuit values, a physical mapping implication, a flawed output package, and a diagnostic observation. Score the separate decisions using known artifacts/keys. Ask for a concise explanation or a choice among specific inferences where free-form grading would be unreliable. Let an unresolved physical build remain pending.

Run [the beginner pilot](beginner-pilot.md) on the initial three sequences before completing all rewrites, and again on the integrated curriculum. Fix observed blockers and repeated misconceptions, then use unfamiliar tasks and delayed checks. Report numerator/denominator, assistance, and uncertainty. Course completion and enjoyment are supporting measures; they are not substitutes for being able to perform the mission's decisions.

If an exact build package becomes part of the product, separately verify its selected parts, CAD, fabrication outputs, assembly instructions, physical current/power, switch behavior, and debug cases. Record deviations from predictions. An automated conceptual course run cannot supply that validation.

## Scope discipline and handoff

The first milestone can fit within the existing lesson layout. If implementation expands into a major UI change, ask the owner whether they want five options and follow the comparison skill if they do, as AGENTS.md requires.

A full KiCad clone, unrestricted circuit simulator, and live AI tutor are unnecessary prerequisites for these improvements. Finite reviewed diagrams, cases, and feedback can cover the initial mission. Any later AI explanation or generation feature should be constrained by the same reviewed task contracts and evaluated separately; this audit found a fixed authored course, not an adaptive AI learning engine.

For each delivered milestone, run the relevant course/build/lint checks and meaningful interaction tests. Keep an evidence note for exactly what was verified. Stop app development servers and confirm port 1420 is free at handoff. Do not claim the whole course is educationally validated merely because its automated checks pass.
