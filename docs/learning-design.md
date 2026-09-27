# Learning design

The [teach skill](https://github.com/mattpocock/skills/blob/main/skills/productivity/teach/SKILL.md) informs the teaching approach. First PCB uses in-app lessons and interactive circuit tasks rather than separate HTML lesson files.

## Learner mission

Understand the path from a simple circuit to a designed, fabricated, assembled, and tested PCB. Learners may follow the worked example throughout or choose to make and test a physical board.

## Lesson pattern

1. State one practical outcome tied to the board project.
2. Explain only the knowledge needed for that outcome, with sources.
3. Ask the learner to predict, calculate, connect, measure, or diagnose something.
4. Give specific feedback and let the learner revise.
5. Revisit the skill later in a different context.

The current in-app lesson screen follows a concrete sequence: state the PCB task, define the words needed for it, explain the idea, walk through one case, then ask the learner to solve a related but different case with feedback. Each of the 55 post-intro lessons has its own vocabulary and worked example; the opening workflow lesson uses the same structure. The unit assessments revisit ideas in changed cases. A saved note is still self-reported practice, not verified mastery.

This order reflects findings that prior knowledge affects new learning ([National Academies, *How People Learn II*](https://www.nationalacademies.org/read/24783/chapter/7)), worked examples support novices before independent problem solving ([van Gog, Kester, and Paas, 2011](https://eric.ed.gov/?id=EJ927458)), active work is more effective than passive lecture across STEM courses ([Freeman et al., 2014](https://doi.org/10.1073/pnas.1319030111)), and practice testing plus spaced review support retention ([Dunlosky et al., 2013](https://www.psychologicalscience.org/publications/journals/pspi/learning-techniques.html)). These studies guide the design; they do not establish that this app’s specific lessons have been validated with beginners.

Record mastery only when the learner demonstrates it. Exposure to a lesson is progress, but does not establish competence. Keep concise references and a glossary available for review.

The course blueprint covers prerequisite order, the first-board scope, simulation limits, fabrication checks, assembly, and assessment. Exact component and fabricator choices need the reference-design work in [research.md](research.md#reference-design-decisions-and-unresolved-work) only if we offer a specific board to order and build.

## Course application to the first PCB

The researched [56-lesson curriculum plan](curriculum-plan.md) starts at zero experience and follows one through-hole, two-AA LED board as an example through design, fabrication, assembly, debugging, and an independent variation. Physical work is optional. The [source ledger](research.md#source-ledger) gives the evidence and limits for the plan. The numbers of lessons and target lesson lengths are product decisions to validate with beginners.

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

**Unit and final assessments:** the [course plan](curriculum-plan.md#assessment-path) places a changed-case assessment after every unit and an integrated course review after Unit 9. Record conceptual answers separately from optional design files or bench results. A learner can retry after targeted feedback without losing lesson completion or XP. The final review records what the learner can explain and which hands-on activities they attempted; completing it does not certify a physical board.

### Feedback by task type

| Task | Immediate check | What the feedback explains | What still needs a person or real-world test |
| --- | --- | --- | --- |
| Unit conversion / Ohm’s law | Deterministic calculation with unit parsing and a tolerance for rounding | Which input or unit caused the difference | Whether the assumed source and LED values reflect actual hardware |
| Circuit tracing | Connectivity graph / known fault model | Current path and effect of open or short | Whether the real build matches the diagram |
| Component selection | Datasheet-backed constraints and assumptions | Tested parameter, rating, margin, and uncertainty | Availability, footprint fit, brightness, and reference-build validation |
| Schematic / PCB exercise | In-app teaching model or imported artifact check if supported | Exact net/connection/rule violation | Real KiCad file, tool version, and full human review |
| Measurement | Compare entered reading with plausible range and prior predictions | Which diagnoses the reading supports or rules out | Whether the probes, meter mode, and report are accurate |
| Solder joint / fault photo | Guided visual checklist; no definitive automatic verdict | Visible concerns and next safe test | Hidden joints, intermittent faults, or a reviewer’s inspection |

The first release need not contain a full SPICE simulator or a KiCad clone. A small deterministic circuit model can cover the initial resistor/LED lessons if it labels assumptions and avoids pretending to predict exact LED brightness. KiCad’s integrated simulator exists, but model selection and simulation validity are a separate content and engineering task [KiCad schematic manual](https://docs.kicad.org/10.0/en/eeschema/eeschema.html). Learners who choose hands-on design and measurement need real KiCad and a meter; conceptual course completion does not require either.

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

The learner path needs honest alternate states. A learner without a meter can finish the conceptual course while marking bench work pending. Someone waiting for a fabricated board can keep doing recall and fault simulations without being marked as having assembled it. If ordering or soldering is inaccessible, show which hands-on outcomes remain unverified without blocking course completion.

### Content production order

1. **Check the teaching claims.** Verify electrical explanations and calculations against the linked sources. Label the LED board as an example and avoid giving an untested parts list or files as a build recipe.
2. **Teach the course sequence.** Use short explanations, worked examples, changed-case questions, and feedback across the ten units. Explain fabrication, assembly, and measurement even when the learner has no hardware.
3. **Check tool lessons.** Review KiCad screenshots, shortcuts, and export steps in the target version. Make each hands-on task optional and provide a conceptual example when no file or meter is available.
4. **Pilot and revise.** Observe true beginners completing lessons; record confusing terms, unsafe interpretations, time spent, hint use, and failures. Revisit the course after a delay to see what they retain.
5. **Validate a separate build recipe if offered.** Before giving learners exact parts and files to order, select those parts, build and measure the circuit, fabricate and assemble the board, and document the results and faults.

No UI implementation or visual redesign is part of this planning document. The selected trail map can later display these units and states, but the course logic should be independent of how the path is drawn.
