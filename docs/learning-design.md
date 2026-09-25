# Learning design

The [teach skill](https://github.com/mattpocock/skills/blob/main/skills/productivity/teach/SKILL.md) informs the teaching approach. CircuitLab uses in-app lessons and interactive circuit tasks rather than separate HTML lesson files.

## Learner mission

Design a simple circuit, turn it into a PCB, obtain the board, assemble it, and verify its behavior with measurements.

## Lesson pattern

1. State one practical outcome tied to the board project.
2. Explain only the knowledge needed for that outcome, with sources.
3. Ask the learner to predict, calculate, connect, measure, or diagnose something.
4. Give specific feedback and let the learner revise.
5. Revisit the skill later in a different context.

Record mastery only when the learner demonstrates it. Exposure to a lesson is progress, but does not establish competence. Keep concise references and a glossary available for review.

The course blueprint covers prerequisite order, the first-board scope, simulation limits, fabrication checks, assembly, and assessment. Exact component and fabricator choices remain gated by the reference-design work listed in [research.md](research.md#reference-design-decisions-and-unresolved-work).

## Course application to the first PCB

The researched [56-lesson curriculum plan](curriculum-plan.md) starts at zero experience and follows one through-hole, two-AA LED board through a physical build, debug, and independent variation. The [source ledger](research.md#source-ledger) gives the evidence and limits for the plan. The numbers of lessons and target lesson lengths are product decisions to validate with beginners.

### Standard lesson contract

Every lesson draft should contain:

1. **Mission link:** one outcome that changes a decision, artifact, measurement, or diagnosis for the board.
2. **Prerequisites and vocabulary:** only terms needed for this task; a short optional reference for forgotten terms.
3. **Prediction before reveal:** ask the learner to choose, calculate, trace, or explain before exposing the result.
4. **One focused explanation:** include units, assumptions, and source links beside the claim they support.
5. **Practice in a changed case:** use different values or a different fault from the worked example.
6. **Specific feedback:** show the consequence of the chosen answer, the likely misconception, and the next action. Avoid only “correct/incorrect.”
7. **Evidence record:** store the attempt, correction, and any actual evidence of demonstrated skill. Preserve that “completed” and “demonstrated” are different states.
8. **Return point:** one later lesson that will retrieve the same skill in a new context.

For bench and CAD work, the contract also requires a save/resume point, safe stop conditions, the exact artifact expected, and a manual review checklist. Do not force a learner to take a photo or share a design file merely to continue; allow a self-reported record with an honest evidence label.

### Evidence and mastery model

| State | Meaning | Example |
| --- | --- | --- |
| Not started | No attempt recorded | No resistor lesson opened |
| Exposed | Explanation viewed or guided example completed | Followed the resistor worked example |
| Practiced | Attempted a related task and received feedback | Calculated current with hints |
| Demonstrated | Succeeded on an unseen or changed task without revealing the answer first | Calculated and justified a resistor from different input values |
| Retained | Repeated the skill successfully after a later interval and in another context | Recalled the calculation while checking a prototype |
| Applied | Used the skill in a real artifact or measurement | Chose the resistor and reconciled the measured current |
| Needs review | New evidence shows an error or a previous answer depended on a hint | Misread mA as A during board review |

“Mastery” is a summary of evidence, not a permanent badge. The app should retain attempt history, confidence (optional), hint use, the exact problem version, feedback, source revision, and later transfer results. A learner can finish an activity while the skill remains at *practiced*. Self-reported bench results and independently reviewed results should be distinguishable.

For a skill to reach *demonstrated*, require a correct, unaided attempt on a changed case with the relevant units or reasoning. For *retained*, require success later without showing the earlier solution. For *applied*, require a matching design artifact or measurement record and an explanation of the result. These are initial scoring rules to pilot, not a claim that two correct answers prove lifelong competence. Safety checks must be correct before a physical step, regardless of the aggregate score.

**Completion gates:** the learner can continue after receiving corrective feedback for ordinary recall errors; later retrieval decides retention. Before an expensive or physical step, the learner must pass the relevant safety and artifact checks. For example, an order-ready board requires an inspected schematic, a configured DRC with schematic parity, footprint checks against exact parts, and independently inspected Gerbers/drills. The app should present those checks as evidence to collect; it must not claim to have verified a file or physical board it has not examined.

**Unit and final assessments:** the [course plan](curriculum-plan.md#assessment-path) places a changed-case assessment after every unit and an integrated design review after Unit 9. Record passing evidence by skill and artifact, including whether a bench result is self-reported or independently reviewed. A learner can retry after targeted feedback without losing lesson completion or XP. The final assessment combines calculations, design files, manufacturing checks, physical measurements or an honest fault diagnosis, and an independent part change; no single multiple-choice score can replace those artifacts.

### Feedback by task type

| Task | Immediate check | What the feedback explains | What still needs a person or real-world test |
| --- | --- | --- | --- |
| Unit conversion / Ohm’s law | Deterministic calculation with unit parsing and a tolerance for rounding | Which input or unit caused the difference | Whether the assumed source and LED values reflect actual hardware |
| Circuit tracing | Connectivity graph / known fault model | Current path and effect of open or short | Whether the real build matches the diagram |
| Component selection | Datasheet-backed constraints and assumptions | Tested parameter, rating, margin, and uncertainty | Availability, footprint fit, brightness, and reference-build validation |
| Schematic / PCB exercise | In-app teaching model or imported artifact check if supported | Exact net/connection/rule violation | Real KiCad file, tool version, and full human review |
| Measurement | Compare entered reading with plausible range and prior predictions | Which diagnoses the reading supports or rules out | Whether the probes, meter mode, and report are accurate |
| Solder joint / fault photo | Guided visual checklist; no definitive automatic verdict | Visible concerns and next safe test | Hidden joints, intermittent faults, or a reviewer’s inspection |

The first release need not contain a full SPICE simulator or a KiCad clone. A small deterministic circuit model can cover the initial resistor/LED lessons if it labels assumptions and avoids pretending to predict exact LED brightness. KiCad’s integrated simulator exists, but model selection and simulation validity are a separate content and engineering task [KiCad schematic manual](https://docs.kicad.org/10.0/en/eeschema/eeschema.html). The learner must eventually use real KiCad and a meter, because those are course outcomes.

### Review rhythm

Research supports retrieval practice and spacing in general ([Roediger & Karpicke](https://pubmed.ncbi.nlm.nih.gov/16507066/), [Cepeda et al.](https://pubmed.ncbi.nlm.nih.gov/16719566/)); it does not provide a proven PCB-specific schedule. Start with a brief retrieval when a skill returns in the next unit, another during a later artifact, and one transfer task after the board works. Use actual performance to adjust future review. A streak can encourage a visit but should never substitute for evidence of skill.

The course should make mistakes recoverable. A wrong answer triggers a consequence and a smaller corrective example, then another attempt with changed values. When the learner is stuck in KiCad or at the bench, present a symptom-based hint ladder: inspect → measure → isolate → reveal. Do not reveal the complete solution before the learner has made a test choice unless the situation is unsafe.

### Misconceptions to probe deliberately

| Likely beginner interpretation | Diagnostic prompt | Corrective experience |
| --- | --- | --- |
| “Voltage flows around the circuit.” | Ask what a voltmeter compares and what an ammeter counts. | Mark two points for voltage and one branch for current. |
| “A 3 V pack always gives exactly 3 V.” | Compare the E91 nominal rating with a measured pack. | Recalculate using the measured value and explain the difference. |
| “Every LED drops exactly 2 V.” | Ask for the datasheet test current next to its forward-voltage figure. | Compare current conditions and a typical curve; keep uncertainty visible. |
| “A bigger resistor makes the LED brighter.” | Predict before changing resistance. | Calculate current and compare with a safe breadboard observation. |
| “A wire crossing is always connected.” | Show crossed wires with and without a junction. | Highlight actual nets in the schematic. |
| “ERC or DRC means the board will work.” | Present a rule-clean circuit with an intentionally wrong LED orientation or footprint. | Require independent logical and physical review. |
| “A continuity beep proves every component is correct.” | Show a low-resistance path that still has a wrong value. | Use component inspection and voltage measurement to discriminate. |
| “The light turning on proves the design is finished.” | Ask what has not been measured or inspected. | Record resistor voltage, inspect joints, and test switch behavior. |

### Lesson authoring record

Keep one reviewable record per lesson: stable ID and revision; learner outcome; prerequisite skill IDs; project state before/after; worked example; unaided practice variant; expected answers with units and accepted ranges; misconception-specific feedback; hint ladder; return lesson; source claims with page/section and check date; numerical assumptions; safety stop conditions; evidence type; and reviewer sign-off. Store factual claims and design choices in separate fields. This makes a source update or part substitution traceable across every affected lesson.

The learner path needs honest alternate states. A learner without a meter can study through part selection but cannot claim the bench measurement gate. Someone waiting for a fabricated board can keep doing recall and fault simulations without being marked as having assembled it. If ordering or soldering is inaccessible, offer a simulation-only pause and a clear account of which course outcomes remain unverified.

### Content production order

1. **Approve the reference hardware.** Select exact parts and fabricator rules, calculate operating ranges, build a breadboard version, create a KiCad reference board, fabricate it, assemble it, and log measured results and faults.
2. **Author the minimum vertical course slice.** Write Units 0–3 with source-tagged claims and deterministic feedback. Test whether zero-experience learners can reach a safe, measured breadboard circuit.
3. **Author CAD and fabrication lessons.** Use the approved project files and current KiCad documentation for Units 4–6. Review every screenshot, shortcut, and export setting in the target version.
4. **Author physical build and troubleshooting.** Use photos and measurements from the reference build for Units 7–8; test stop conditions and fault paths with beginners.
5. **Author transfer and retention.** Use a second real LED/part set for Unit 9. Evaluate whether learners can complete the change without copying the worked example.
6. **Pilot and revise.** Observe several true beginners completing each gate; record confusing terms, unsafe interpretations, time spent, hint use, and failures. Revise the lesson sequence and checks before claiming the course is ready.

No UI implementation or visual redesign is part of this planning document. The selected trail map can later display these units and states, but the course logic should be independent of how the path is drawn.
