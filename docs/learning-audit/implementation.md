# Learning implementation and beta handoff

Implemented September 29–30, 2026, following the owner’s approval to make the audit changes and extend the existing interface. The audit in this folder describes the earlier app at `031511488e3a188c78b9baa2fd250d98beb9cc56`. This document describes the replacement learning flow.

## What changed

| Audit gap | Implemented behavior |
| --- | --- |
| Lessons described skills their questions did not require | All 56 lessons now have an explicit outcome, short procedure, worked case, relevant artifact, and multi-part practice contract. Practice includes terminal selection, numeric value/unit entry, procedure ordering, source extraction, and evidence-based decisions. |
| Broad graphics did not show the learner’s actual problem | A consistent revision A battery/switch/resistor/LED model has named terminals, nets and pads. SVG circuit, breadboard, junction, footprint, board, output-overlay, and station views represent the actual case. Diagrams can be enlarged without widening the page. |
| Corrections could be repeated without applying the idea | Wrong decisions have specific feedback. Correcting them leads to a different case. Optional examples and the reference remain available; support and correction are recorded. |
| “Fresh” work could be confused with an already-seen answer | Case identity follows material problem content across lesson names. Cosmetic photograph order does not create a new problem. Worked cases, prior submissions and displayed bank indices are retained. Repeated work remains useful practice, without being counted as fresh independent evidence. |
| Diagnostics named the answer before a meaningful test | Power state, meter mode, endpoints and predictions must be correct before the observation appears. Diagnostic sequences then require an inference, next action, and repeated modeled test. Unsafe continuity setup does not return a result. |
| Unit checks repeated slogans | Ten checks use three integrated tasks each, including earlier skills and changed evidence. They use the same accessible interactions and evidence rules as lessons. |
| The final could be completed with reflection alone | Six separate final contracts require a new yellow LED excerpt, changed resistance/range/power calculations, a footprint with two discrepancies, a package with two mismatches, a resistance-based fault test, and a bounded inference from a sample bench log. Pending physical statuses and optional notes cannot bypass these tasks. |
| Mistakes and unfinished work could disappear | Each submission is written immediately. The activity stage, question, case, actual answers, support, reveal state, feedback state, note, and optional records are checkpointed. Reopening resumes the same current-version case. |
| Old completion was mistaken for new capability | Legacy completion, XP, notes, timestamps and attempt arrays are preserved. Legacy records do not establish new task skills. Old source keys remain intact during migration. |
| Saving could fail silently | The app displays saved/device versus session-only status. Failed writes remain exportable. Unreadable original stored text is preserved and downloadable separately. Export/import validates records and merges events/awards without duplicating XP. |
| Notes and review needs were hard to find | The learning record exposes notes without retaking, actual submitted decisions, and 17 skill summaries. Review is suggested after supported or incorrect work and later fresh successes. Reviews do not lock the course and do not award repeat XP. |
| Desktop closing did not follow an explicit decision | Electron handles `will-prevent-unload` with Keep learning / Leave app. Source hosts include the new official library, soldering-safety, and image-license sources. The production protocol and CSP still isolate app content. |

The path, visual style, lesson layout and XP participation rewards remain recognizable. Required decisions are keyboard-accessible: named checkboxes accompany diagram points, order controls have labels, layer buttons expose their state, radios have selected semantics, and dialogs contain and restore focus. Photographs use descriptive alternatives and neutral choice labels.

## Curriculum and source boundaries

The required conceptual course can be completed without hardware. Optional CAD and bench fields now cover part identification, pin/pad mapping, rules, measured quantities, outputs, station preparation, and repair records. These fields explicitly store the learner’s report; their text is not AI-graded or treated as an observed physical result.

The reference gives the complete series schematic and net table, selected LED numbering, illustrative board geometry, teaching output inventory, glossary, units, meter distinctions, and source conditions. KiCad 10 procedures name the relevant project, schematic, footprint, rule-check, routing and export operations. The teaching switch uses common 1, ON 1–2 and OFF 1–3 as an explicit illustrative contact map. A real selected switch/symbol may have different numbering and must be mapped from its own documentation.

The source ledger has 23 entries. Manufacturer facts include:

- [WP7113ID](https://www.kingbrightusa.com/images/catalog/SPEC/WP7113ID.pdf): V.14A, printed 01/08/2026; forward-voltage row and package drawing.
- [WP7113SGC](https://www.kingbrightusa.com/images/catalog/SPEC/WP7113SGC.pdf): V.14B, 03/19/2025; the green replacement used in unit 9.
- [WP7113YD](https://www.kingbrightusa.com/images/catalog/SPEC/WP7113YD.pdf): V.11B, 01/08/2026; final yellow replacement. Page 2 lists 1.95 V typical and 2.4 V maximum at 10 mA and 25 °C. Page 1 shows 2.54 mm pitch and recommended 0.9 mm holes.
- [The official KiCad Device:LED library definition](https://gitlab.com/kicad/libraries/kicad-symbols/-/blob/master/Device.kicad_symdir/LED.kicad_sym) and the installed 10.0.6 library were checked for 1=K / 2=A. Symbol numbering is separate from physical footprint approval.

The red, green and yellow PDF tables/drawings were inspected directly. Manufacturer PDFs are linked, rather than redistributed. Resistor specifications, voltage ranges, service-policy values, visibility results, supplied readings, margin requirements, tolerances and review intervals are explicitly authored exercise choices. They are not vendor guarantees or measurements of a learner’s board.

Four unmodified soldering photographs are bundled with Bill Earl / Adafruit attribution and CC BY-SA 3.0 links. [Asset attribution](../../public/learning/ATTRIBUTION.md) identifies each original. Visual structure, rather than shine alone, determines the photograph task. Source principles include appropriate fume control and equipment/material instructions; institutional safety procedures are not presented as universal local rules.

## Evidence and persistence

Current task revision: `2026-09-learning-2`; learning-record format: 3. Answer events include task/content identity, display index, stage, actual answers, outcome, mistakes, assistance, prior exposure, first-submission status and purpose. Setup/retest events remain in history but do not count as complete demonstrations. Skill summaries use complete events from the current version and currently valid problem content. Earlier task revisions are retained without silently regrading them.

A fresh demonstration requires a correct first submission, without support/correction and without previous example/attempt exposure. This is evidence for the supplied case. It is not a permanent mastery certificate or proof of all PCB tasks. A whole multi-part event is conservatively treated as supported when any required decision needed correction.

Initial review spacing is a product choice: one day after supported/incorrect practice, seven after a fresh success, and twenty-one after a successful fresh later review. The finite reviewed bank can become exhausted. Previously seen cases remain available and are labeled as repeated practice; the app does not manufacture independent evidence by changing labels or randomizing choices.

XP remains participation: 10 per lesson, 15 per unit check, and 20 for the final, at most 730 for the course. Reviews and retakes do not duplicate awards. Notes have no minimum-length grade. The seven final physical/review statuses are self-reports, separate from the six required problem contracts.

## Verification

Reproducible checks:

| Check | Scope |
| --- | --- |
| `npm run lint` | Source and test scripts. |
| `npm run check:course` | Lesson/path coverage, changed cases, integrated checks, final contracts, source metadata, and retained legacy data. |
| `npm run test:learning` | Independent numeric solutions, unit failures, reference graph, safe diagnostic gates, case/exposure identity, unfamiliar final problems, migration, storage failure, evidence/version rules, spacing, and duplicate imports. |
| `npm run build` | TypeScript and production bundle. |
| `npm run test:ui` | Isolated headless Chromium: every activity with a deliberate wrong answer, correction and changed follow-up; reload, notes, final pending work, reviews, source/reference interactions, backups, failed writes, and 320/390/1280px layouts. |
| `npm run test:desktop` | Actual hidden Electron: separate profile, production app protocol/CSP, images, all source hosts, migration and 730 XP, real downloads, resumed wrong feedback, and both native close decisions. |
| `npm run test:recovery` | Partial unit-check resume including typed units; contained diagram enlargement; original-data recovery; photograph label reproduction; pending final status normalization; actionable due review; and the session-only unload guard after leaving an activity. Run after the full UI test creates its synthetic baseline. |

The complete course run covers **56 lessons, ten checks and the six-contract final activity: 67 activity routes**. It uses authored keys to verify application behavior. Independent numeric tests separately recompute the relationships and reject full-supply and scale errors. Neither method substitutes for a beginner’s unaided performance.

Latest run details are in [browser evidence](evidence/implementation-runtime.json), [desktop evidence](evidence/implementation-desktop.json), [recovery evidence](evidence/implementation-recovery.json), and the saved screenshots prefixed `implementation-`. The synthetic test record is entirely generated data, not the owner’s learning history. Tests never use the normal browser/Electron profile. Temporary source downloads and desktop test profiles stay outside the repository.

## Publication readiness

This is a **public-beta candidate for the conceptual course**, subject to the final recorded software checks. The app now supplies actual practice, intelligible feedback and honest evidence, rather than completion being a proxy for learning.

Before describing it as a proven finished course, run [the beginner pilot](beginner-pilot.md), including unfamiliar immediate tasks, delayed retrieval, and an observed KiCad walkthrough using only the in-app procedures. Record independent success, support, interface blockers and remaining misconceptions; completion alone is insufficient. No participants were recruited or contacted in this implementation task, and no pilot results are claimed.

Before offering exact parts/files as a tested build recipe, select and verify the holder, switch, resistor, component mapping, real schematic/PCB and fabrication outputs, then fabricate, assemble, measure and debug a reference board. The current drawings/output overlays are intentional teaching models. No actual board was ordered, soldered, or electrically measured here.

At the initial implementation handoff, no site was published, release uploaded, or Git commit created. Development and preview servers were stopped at that handoff; ports 5173, 5174 and 1420 were verified free. [Verification summary](evidence/verification-summary.json) records the checks and the unperformed human/physical work.

## Beginner language correction

Following the owner’s lesson 0.4 report, reviewed abbreviation use across all 56 lesson readings and the shared practice, checks, final and reference. Component and pin IDs now appear beside plain names in instructions, questions, options, table cells, feedback, and submitted decisions. Contextual visible keys explain circuit labels, nets, LED polarity, formulas, measurement units, tool checks, and datasheet/layer notation; the searchable glossary includes these labels. Compact SVG labels and actual filenames remain unchanged so learners can match them to KiCad. Lesson 0.4 now gives a plain-language inspection procedure and introduces nets and the reference revision. This presentation change preserves stored answers and case identities.

`npm run test:language` checks all 56 rendered lesson readings, the reported table, named practice controls, 390px layout and shorthand searches. See [language check evidence](evidence/beginner-language-runtime.json) and [corrected lesson](evidence/beginner-language-lesson-0.4.png). The complete 67-route interaction test, desktop test and recovery test also passed during this correction. At the language-correction handoff, the requested Git checkpoint was paused following the owner’s “wait”. The owner subsequently authorized a checkpoint and a new GitHub release; v0.2.0 packages these changes.
