# CircuitLab learning audit

**Historical review of the pre-implementation app.** The approved changes are now described in [Implementation and beta handoff](implementation.md). The findings and original evidence below are preserved for comparison.

Reviewed 2026-09-29. Scope: the complete First PCB app at `031511488e3a188c78b9baa2fd250d98beb9cc56`, its authored content, learning records, browser interactions, and relevant Electron behavior. The audit itself added review documents and reproducible audit tools; implementation followed separately.

**The app provides useful orientation to the PCB workflow, but it does not yet give a beginner enough supported practice to become independently capable of that workflow.** Its most important improvement is to make learners perform the decisions described by the lessons: trace connections, interpret a datasheet, configure a measurement, inspect an output package, and diagnose a fault. More prose or a larger lesson count would not resolve the central gap.

The current material has strengths worth preserving. It defines vocabulary, separates a hypothetical calculation from an exact part recommendation, explains the limits of ERC and DRC, gives specific feedback for incorrect choices, and labels physical claims as self-reported. This is a workable foundation. The concern is the distance between the lesson's practical task and the evidence its single question collects.

The accompanying review documents provide the details needed to act on these findings:

- [All 56 lessons, ten unit checks, and supporting app areas](coverage.md).
- [Three revised lesson specifications with problems, answer keys, and feedback](lesson-revisions.md).
- [Source verification and independent calculations](source-review.md).
- [Implementation sequence, dependencies, and acceptance criteria](implementation-roadmap.md).
- [Beginner pilot and delayed learning evaluation](beginner-pilot.md).

The app currently follows a fixed course. A learner's mistakes affect feedback and result wording; they do not select subsequent practice or review. Completion opens the next activity regardless of whether the answer was unaided or obtained after corrections. That can be appropriate for introductory practice, but the app needs separate evidence of independent ability.

## What was reviewed

- All 56 lessons, including the custom opening lesson; all ten three-question unit checks; the final review; the complete path and progress UI.
- Every teaching article, vocabulary entry, worked example, effective question after overrides, answer key, source assignment, and feedback entry.
- All 85 questions in the shared activity component: 48 lesson multiple-choice questions, seven typed calculations, and 30 unit questions. The custom introduction's ordering and application tasks were exercised separately.
- Both incorrect choices for every one of those 78 multiple-choice questions: 156 feedback paths, plus seven numeric corrections.
- Completion, unlocking, XP, completed-attempt history, abandoned attempts, note drafts, assessment resume, reload persistence, numeric input boundaries, and mobile readings at 390 and 320 pixels.
- A hidden Electron runtime with a separate profile: the actual app protocol, saved progress, source-link routing, in-app exit, and native close cancellation.
- All 17 source URLs, with downloaded document fingerprints; datasheet tables and drawings; relevant sections of tool, meter, breadboard, fabrication, and soldering guidance. [Source review](source-review.md) distinguishes checked claims from recommendations.
- Existing curriculum, learning-design, research, engagement, and previous audit documents. Their intended behavior was compared with the present implementation.

The automated runs establish software behavior and coverage. They are not measurements of a human beginner's comprehension, retention, or physical competence. [The pilot plan](beginner-pilot.md) specifies how to obtain that evidence.

## Findings, in priority order

Priority 1 means a gap that prevents the intended learning outcome. Priority 2 means an important improvement to reliability, access, or instructional precision. These priorities are review judgments, not scientific scores.

### 1. Practical tasks are usually replaced by recognition questions — Priority 1

The shared activity component offers one answer selection or one number, followed by an optional note. For example:

| Lesson | Stated practical task | What is actually checked |
| --- | --- | --- |
| 2.1, LED direction | Mark anode and cathode on the physical part and symbol | Choose to consult the drawing and resolve a mismatch |
| 3.1, Breadboard connections | Sketch the connected groups | Choose a midpoint continuity check; no holes or strips are selected |
| 4.3, Wire the nets | Trace supply to return and name nets | Choose to repair a described junction; no net is traced |
| 5.5, Route copper | Record unrouted count and trace a net | Choose to inspect a described connection; no copper is inspected |
| 7.4, Inspect joints | Identify and record a joint concern and repair | Choose to remove a bridge already identified in the prompt |
| 8.5, Diagnose a new fault | Choose a test, use evidence, and explain uncertainty | Select the test for a named broken trace; no reading or diagnostic sequence occurs |

These questions teach checking habits. They do not demonstrate the underlying perceptual, procedural, or diagnostic skill. The optional note is neither evaluated nor structured enough to supply the missing evidence.

**Recommended change:** use a small set of real teaching interactions: selecting probe points on an SVG, tracing a connectivity graph, calculating with a chosen unit, extracting fields from a source excerpt, comparing an artifact with requirements, and selecting a test before revealing a reading. Require the conceptual task while keeping physical work optional. See [three concrete lesson revisions](lesson-revisions.md).

Code: [CourseActivity.tsx](../../src/CourseActivity.tsx), [courseContent.ts](../../src/courseContent.ts), [practiceEdits.ts](../../src/practiceEdits.ts).

### 2. Diagrams do not match the lesson's job — Priority 1

Forty-six post-intro lessons in Units 2–9 use eight graphics, one per unit. Reusing a diagram is useful when it teaches the same relationship, but many of these graphics cannot explain the lesson beside them.

- The [breadboard lesson](evidence/lesson-3.1.png) displays a voltmeter across a resistor. It does not show internal breadboard strips, the central gap, or split rails.
- The [junction lesson](evidence/lesson-4.3.png) displays a resistor-to-footprint illustration without crossings or junction dots.
- The [routing lesson](evidence/lesson-5.5.png) displays a PCB layer cross-section without pads, copper routing, net labels, or a ratsnest.
- The [joint-inspection lesson](evidence/lesson-7.4.png) displays three assembly stages without a solder joint.
- The [diagnosis lesson](evidence/lesson-8.5.png) displays a generic process flow without a circuit or observations.

The Unit 4 illustration also maps a resistor symbol to two pads joined by a drawn line. As an electrical example, that suggests connecting together the resistor's two distinct terminal nets. A revised drawing should show corresponding pin numbers and separate copper connections to each pad. This is a diagram ambiguity, not an observed defect in any real PCB file.

**Recommended change:** match each visual to the thing the learner must notice. Label it with the same parts, nets, and values used by the example. For a joint-recognition exercise, obtain actual reference photographs with permission or an appropriate license. Preserve SVG for schematic, connectivity, and PCB teaching models.

Code: [ConceptVisual.tsx](../../src/ConceptVisual.tsx), [StageVisual.tsx](../../src/StageVisual.tsx).

### 3. The running board is too abstract to support cumulative work — Priority 1

The course names a two-AA LED circuit, but does not supply a consistent worked schematic, numbered pins, defined connections, a sample PCB, a sample release package, or sample measurements that develop together through the course. Exact switch and holder choices remain unresolved. A beginner repeatedly receives instructions to compare something with a drawing or approved design that the app has not supplied.

The opening stage drawings are orientation graphics, not a complete battery–switch–resistor–LED schematic. Later descriptions often supply the diagnosis verbally rather than showing the circuit that would let a learner discover it.

**Recommended change:** introduce a versioned teaching project with stable references and net names. Carry it through schematic, layout, export inspection, and an explicitly labeled sample measurement record. Supply intentionally faulty variations. Educational artifacts can be simulated and clearly labeled; an exact order-and-build recipe requires separate physical validation. The existing documentation already makes that distinction correctly.

### 4. The final activity collects confidence rather than testing transfer — Priority 1

The final review presents seven “Present/Pending” selections and a note. It has no scored problem or integrated artifact. Runtime testing marked all seven Pending and entered `aaaaaaaaaaaa`; the app accepted the record, awarded 20 XP, and displayed all activities recorded. Screenshot: [final pending record](evidence/final-pending-filler.png).

This behavior is honest about pending topics and optional hardware. It is insufficient evidence for the learner's ability to handle a new LED or complete an engineering review. A twelve-character threshold measures length, not reasoning.

**Recommended change:** retain self-report as a separate reflection, then add a short changed-design task. Have the learner extract unfamiliar LED data, compute resistor current/power under stated assumptions, identify a footprint implication, reject a stale output package, and justify a safe diagnostic test. Score those decisions individually. Physical work can remain pending without substituting for the conceptual check.

Code: `finalReviewItems`, `canSave`, and `reviewStatuses` in the shared course files.

### 5. Corrections are followed by the identical problem — Priority 1

Wrong answers generally receive good explanations, but the learner then selects or types the revealed answer to the same question. Reopening the lesson or unit check also repeats the same problem and the same deterministic choice order. A first-try correct retake after seeing its answer is stored as a new true result without context identifying the prior exposure.

The bank also regularly tells the learner what defect exists, then offers one relevant checking action alongside shortcuts. Examples include a wrong clearance setting, a missing outline, an old drill file, and a reversed pad mark. This can train the pattern “choose the answer that says inspect or correct.” A post-hoc [wording diagnostic](evidence/question-cues.json) found that a simple fixed action/shortcut word score chose the correct answer on 39 of the 40 questions with a unique top score. This is a warning about cues, not a blind learner test or a validated difficulty estimate.

**Recommended change:** use parallel problem versions with independently checked solutions. After a correction, ask the learner to apply it to changed values, connections, or evidence. Keep plausible alternatives and avoid relying on a repeated verbal pattern. Retrieval practice has research support, but this specific bank still needs beginner evaluation. [Dunlosky et al.](https://doi.org/10.1177/1529100612453266)

### 6. Review is suggested but not organized — Priority 1

Result messages tell learners that a later check will revisit an idea or suggest reviewing later. The app has no skill IDs, due reviews, review queue, time-dependent practice selection, or retained/needs-review state. Some ideas recur in later units, which is useful; the system does not ensure a delay or react to individual difficulties.

**Recommended change:** map questions to a small set of PCB-related skills. Offer a few changed tasks when those skills return in the project and after a later visit. Schedule from actual submitted evidence, with additional practice for weak skills. Any initial interval is a product choice to test; published spacing findings do not establish an optimal electronics schedule.

### 7. The learning record is not usable as a learning record — Priority 1

Completed shared activities save a timestamp, note, evidence label, and Boolean first-try result per question. Completed retries preserve earlier Booleans, which passed the runtime check. However:

- The path displays completion and XP, not which ideas were difficult or what the learner previously wrote.
- Opening a recorded lesson starts at its explanation; the learner must answer again before reaching the saved note.
- No submitted answer, problem revision, misconception, assistance/exposure, or correction sequence is retained.
- An abandoned submitted mistake never reaches the completed record. A learner can leave and return to get a fresh first attempt.
- The custom introduction stores completion, session count, and XP only. Its first-try result is shown transiently but not saved.

**Recommended change:** save answer events as they occur, including problem version and whether the solution was revealed. Provide direct access to prior notes and specific review needs. Keep completed, practiced, independently demonstrated, and self-reported physical outcomes distinct. Avoid inferring competence from one Boolean.

### 8. Some procedural lessons are reminders rather than instruction — Priority 1

“Create a project,” “run ERC,” “route the net,” and “export the layers” do not tell a new KiCad user how to perform those actions. Assembly lessons similarly lack a worked joint-making sequence and useful joint images. Links to an entire manual provide grounding, but leave substantial instruction to an external site.

**Recommended change:** provide a short, version-checked procedure beside a concrete artifact, including how to recognize the expected result and recover from a common failure. Keep an optional worked example for learners without the tool or hardware. A tool lesson should be tested from a clean installation by someone following only the supplied instructions.

### 9. Numeric feedback reveals the solution without diagnosing the error — Priority 2

The seven answers and tolerances are internally correct. Decimal and exponent forms were accepted; values outside the tested tolerance were rejected. The UI supplies the unit and accepts a bare number. It cannot distinguish a wrong unit choice from a wrong calculation, and every wrong numeric response receives the full same solution.

**Recommended change:** collect value and unit; recognize likely thousandfold, inverse-formula, and supply-versus-resistor-voltage mistakes. Give the smallest useful correction, then a changed case. Do not reject reasonable equivalent units. Independently check every authored numerical variant.

### 10. Useful persistence exists, but interrupted learning still loses work — Priority 2

Notes resume after exit and reload. Submitted question results and assessment position do not. Completing question one of a unit check, leaving, and reopening starts question one again. Going Back to the explanation also removes the unfinished-attempt warning, even though practice has begun.

A separate simulated storage failure showed a stronger reliability issue: `localStorage.setItem` threw, the app still showed “Practice recorded,” and the new note existed only in memory. It was absent in a reopened page. The failure is currently swallowed without a visible saved-state distinction.

**Recommended change:** checkpoint stage, problem version, submitted answers, and feedback state. Base exit warnings on actual unsaved work. Show whether a record is saved on the device or temporarily held in this session; offer export/retry when durable storage is unavailable.

### 11. Selected answers and stage transitions need accessible state — Priority 2

The answer controls expose ordinary buttons inside a group. The selected state is a CSS class without `aria-pressed`, `aria-checked`, or radio semantics. A tested stage transition left focus on BODY, with no focusable new heading. Exit dialogs do place initial focus and support Escape, which passed.

**Recommended change:** expose a single-choice selection as accessible radio controls or an equivalent well-tested pattern. Move focus to the new stage heading and announce feedback. Add a compact reference/glossary so forgotten terminology can be recovered during a task. The tested mobile reading screens had no horizontal overflow at either width.

### 12. Source precision and desktop exit need follow-up — Priority 2

All linked source URLs responded, and the central electrical claims checked out. Several links are still whole manuals or point to an adjacent section. For example, the split-rail explanation is in Adafruit's “Other Breadboard Sizes” page, while B1 points to “Breadboards.” Add page/section, revision, check date, and a short statement of what the source supports.

Electron correctly routed a KiCad source link to the external-shell boundary, and in-app exit worked. A native close during practice triggered cancellation and left the window alive. The main process supplies no `will-prevent-unload` choice handler. Add an explicit save/leave decision so closing an unfinished desktop lesson does not appear unresponsive. [Electron's documented close event](https://www.electronjs.org/docs/latest/api/web-contents#event-will-prevent-unload) explains the required distinction.

## Recommended implementation order

First make one complete learning sequence work: explanation → actual decision → specific correction → changed problem → later retrieval → visible evidence. Use the foundational calculation, fabrication inspection, and debugging lessons in [the revision document](lesson-revisions.md) as representative cases. Then extend the pattern across the [full coverage backlog](coverage.md). [The roadmap](implementation-roadmap.md) supplies dependencies and acceptance criteria.

This can begin within the existing lesson layout. A major UI direction change would require the owner's five-options decision under the project instructions.

## Verification and limits

`npm run lint`, `npm run check:course`, and `npm run build` passed for the current app. The audit harness completed the course and recorded the scenarios in [runtime.json](evidence/runtime.json); additional probes are in [probes.json](evidence/probes.json). Source fingerprints are in [source-fetch.json](evidence/source-fetch.json), and the effective content is archived in [course-snapshot.json](evidence/course-snapshot.json).

Browser screenshots show the shared UI. Hidden Electron compositor screenshots were unreliable, so the desktop check inspected its actual renderer state and main-process behavior. Playwright emitted “No dialog is showing” protocol warnings around Electron's beforeunload cancellation; those are retained as automation diagnostics, not reported as app-rendering errors. Packaged installer behavior, real user-profile migration, physical hardware, and delayed human learning were not tested.

The existing course data check verifies content presence and answer consistency. It does not evaluate instructional sufficiency, visual relevance, independent transfer, or long-term retention. Those require the changed tasks and beginner observations proposed here.

## Reproducing the software audit

The reviewed checkout began at commit `031511488e3a188c78b9baa2fd250d98beb9cc56`. Production-file fingerprints in the runtime evidence identify the exact inspected content. The records in these evidence files belong to isolated automated sessions, not to the owner's learning profile.

The audit tools require Node 24 and a prepared local Playwright/Chromium environment. Playwright was already available in this workspace; it is not declared in this app's package dependencies. A fresh checkout needs that audit dependency prepared separately. The Electron check uses the project's installed Electron and isolates both its user-data path and the legacy-migration app-data path.

With the development server running on `127.0.0.1:5173` and a current `npm run build` output, run:

```powershell
node --experimental-strip-types scripts/audit-learning.mjs
node --experimental-strip-types scripts/audit-probes.mjs
node --experimental-strip-types scripts/audit-sources.mjs
```

Run the first two in that order: the probes use the course record from the completed harness. `CIRCUITLAB_AUDIT_URL` can change the main harness URL; the supplemental probe currently uses port 5173. These tools overwrite audit evidence and screenshots when rerun. Source fetching prints the location of its temporary cache for manual document inspection; remove that cache when the review is finished. Reaching a URL does not automate the claim review documented here.

Stop the development server after verification. The delivered audit leaves no server running and port 1420 free. It does not include a packaged installer test or a human/physical learning trial.
