# Beginner pilot and learning evaluation

This is a plan, not a completed human study. The audit did not recruit participants, contact anyone, or observe real beginners. Software checks establish that activities run and records behave; the pilot must establish whether learners can use the ideas on unfamiliar problems.

Begin after the three [representative lesson revisions](lesson-revisions.md) have working interactions, relevant artifacts, and reliable records. Testing the current app can still identify confusion, but it cannot show the benefit of activities that have not been implemented.

## Questions to answer

1. Can a beginner perform the lesson's actual decision using its in-app explanation and example?
2. Does feedback help them correct the idea on a changed problem, rather than repeat a revealed answer?
3. Can they perform a different case without task-specific assistance immediately and on a later visit?
4. Can they find useful records, references, and the right next review when interrupted?
5. Can conceptual success support later CAD/bench work, with physical performance measured separately?

These questions follow general evidence for retrieval and distributed practice, and for aligned tasks with actionable feedback. [Dunlosky et al.](https://doi.org/10.1177/1529100612453266), [How People Learn II, chapter 7](https://www.nationalacademies.org/read/24783/chapter/9). The exact pilot timing, participant count, and success criteria below are product choices.

## Participants and scope

Start with approximately five to eight adults who are new to PCB design, including several without soldering/KiCad experience. This is a proposed small usability/learning pilot, not a statistically representative effectiveness study. Record prior electronics, algebra, tool, and PCB experience rather than assuming everyone is equivalent. Include people who use keyboard navigation or need larger text where possible.

Use the app's conceptual branch first. No equipment purchase is required. A separate CAD session can use the selected KiCad version. A later physical branch needs a validated build package, suitable equipment/material instructions, and an experienced observer; do not use an unresolved prototype as a novice test exercise.

Keep participants' records separate from the owner's profile. Use consent for observation/recording, store only the data needed, and identify participants by a local code. Do not collect account credentials or publish individual notes. Recruitment and any external communication would require the owner's explicit instruction; this plan makes no contacts.

## First session: approximately 45–70 minutes

The timing is a planning allowance. Avoid treating slower arithmetic, reading, or interface navigation as lack of electrical understanding.

| Stage | Learner activity | Observer records |
| --- | --- | --- |
| Background and baseline, 5–10 minutes | Explain prior experience; try one simple path/probe question and one unit conversion without lesson instruction | Existing knowledge; distinguish “unfamiliar” from a specific misconception |
| Calculation sequence, 10–15 minutes | Read revision A; choose measurement endpoints, voltage, current value/unit; use feedback if needed | First decision, reason, references/hints, error type, changed-case outcome |
| Export inspection, 10–15 minutes | Use revision B overlays and approved reference to decide whether a sample package can be released | What was actually inspected; located defect; evidence; whether filenames alone were trusted |
| Diagnosis, 10–15 minutes | Use revision C to choose a test, predict both outcomes, inspect the observation, and infer | Power state/mode/points; prediction; interpretation; unsupported certainty; retest choice |
| Changed task and records, 5–10 minutes | Complete a fresh case; leave/resume; find a prior note and a suggested review | Independent performance, navigation/storage obstacles, whether the evidence labels make sense |

Use reviewed variants that were not the worked examples. Counterbalance variant order across participants where feasible. Have an answer key and misconception rubric before observing; do not invent a grading rule to fit each person's response.

Let the learner attempt the task before intervening. They may use references as they naturally would; record that as supported performance. Avoid task-specific coaching such as “look at the silkscreen.” If they are stuck, ask a neutral prompt such as “What are you trying to find?” Record any later hint and the point at which it was given. For arithmetic, distinguish a calculator-access issue from choosing the wrong voltage or unit.

Think-aloud can help diagnose the interface, but it also changes the task. Use it for the exploratory portion. Run the short independent task with minimal interruption so its outcome does not depend on the observer's prompts.

## Independent task keys and scoring

Use decision-level outcomes, rather than one overall score that hides a safety or concept error.

| Skill / example unfamiliar task | Required evidence |
| --- | --- |
| Current from measurement: 0.66 V across 330 Ω | Correct resistor endpoints, V/R, and 2 mA or 0.002 A; no substitution of full supply voltage |
| Output inspection: changed footprint spacing with stale drill data | Inspect drills relative to current pad centers/revision, locate discrepancy, hold release, regenerate matching outputs |
| Diagnostic inference: new connection location and a reviewed fault seed | Unpowered continuity setup, relevant endpoints, differing predictions, conclusion limited to the returned evidence, relevant retest |

Do not reuse these same cases as the delayed test. Author and independently check additional variants that target the same skill. Keep the model's assumptions visible, particularly the absence of parallel paths in a simplified continuity task.

Suggested labels: independently correct on this case; correct with reference/hint; corrected after solution; unresolved; interface-blocked. Record separate sub-decisions when, for example, the number is right but the endpoints are wrong. Never classify a self-reported physical result as app-observed performance.

A conceptual safety error should produce immediate correction before a simulated physical action continues. In an actual bench session, the observer stops an unsafe action; that stopped trial cannot count as independent safe performance. Record the decision and correction without using harm as an assessment technique.

## Later check: about one week after the first session

Offer a short new calculation, new export discrepancy, and new diagnostic case without displaying the original solutions first. A week is an initial testing interval, not an evidence-based optimum for PCB learning. Record whether the person used the app or practiced electronics between sessions. Provide feedback and further teaching after the independent check.

Measure what was retained and transferred by skill, including support used. Someone who remembers “inspect the files” but cannot find the relevant discrepancy has retained a slogan, not demonstrated the intended inspection skill. Ask which record or reference would help them next, and observe whether they can find it.

## Report useful evidence

For each skill, report the count who succeeded independently out of those who attempted it, and the count who required each kind of support. Retain the before-feedback answer, changed-case answer, and delayed answer separately. State missing follow-ups and prior-experience differences.

Supporting measures: task time, navigation errors, repeated wrong choices, help/reference use, interrupted-work recovery, confidence before/after the task, and whether the learner can explain the observation's limits. Completion and enjoyment can show willingness to continue, but do not establish skill. Avoid a single “learning percentage” from mixed MC, calculation, and physical outcomes.

Prioritize revisions when multiple beginners hit the same conceptual or navigation blocker, when required evidence cannot be produced with the supplied instruction, or when the app's feedback leads to a confidently wrong conclusion. Treat an observed unsafe setup or silent record loss as a release blocker for that affected interaction. These are product gates, not statistical claims.

The initial pilot's aim is to identify and repair recurring failures. A claim that a revision improves learning over the original requires a subsequent comparison using equivalent unfamiliar tasks, controlled assistance, and a justified sample/design. Do not turn five successful users into proof of broad educational effectiveness.

## Separate CAD and physical follow-through

After the conceptual pilot, have new users follow one selected-version KiCad procedure using only the in-app instructions. Observe creation, net inspection, footprint mapping, export, and independent output review. Record external searching and observer help. This tests whether the procedural lessons are sufficient, not just whether users can answer their accompanying questions.

Only after an exact build package is validated, run a separate assembly/measurement pilot. Record the learner's actual pre-power inspection, soldering decisions, meter setup, measured versus predicted values, and a safe diagnostic sequence. Use naturally occurring or safely prepared faults under expert supervision; never instruct beginners to create a battery short, bypass current limiting, or perform powered continuity to test knowledge.

Keep the conceptual, CAD, and physical outcomes distinct in both the app and report. Together they can support the product's mission. None should be inferred from XP or a generic completion message.
