# Beginner walkthrough and course readiness audit

Checked 2026-09-25. This audit began when [lesson 0.1](../src/App.tsx) was the only playable activity. All 56 lesson entries in the [curriculum plan](curriculum-plan.md) now have playable guided activities in the app. See the newer [lesson quality review](lesson-quality-review.md) for the 2026-09-27 question, feedback, and source pass. An automated playthrough cannot become a genuinely new learner or verify what another person retains after a delay.

## What was actually exercised

In an isolated headless browser at desktop and mobile widths, I opened lesson 0.1, read the five workflow diagrams, started the ordering task, submitted a wrong order, used its specific correction, finished the order, answered the bare-board question wrongly, corrected it, completed the lesson, replayed it without errors, exited during a new attempt, and reloaded the app. The app rendered, the controls worked, unfinished-exit warnings appeared, completed progress survived reload, and XP was awarded only once. Lint and build were also run separately.

The first lesson teaches the **names and sequence** of five stages. The diagrams and feedback are useful orientation, but the first ordering task repeats the same five stages just shown. The final multiple-choice question asks what a bare board needs after the introduction and ordering cards have already given that answer. Therefore first-try success is evidence of immediate guided practice, not independent transfer. The app records it as practice; the Unit 0 assessment uses changed questions. The later lessons teach their topics as short source-linked explanations and checks; optional CAD and bench records remain self-reported. The example board is not an order-ready design.

## Planned lesson walkthrough

All rows marked **playable draft** have an explanation, teaching visual, question, and source link; learner notes are now optional. The table below is an earlier backlog of potential improvements, including optional hands-on extensions. See the [lesson quality review](lesson-quality-review.md) for what has since been revised. Exact-part and physical validation is needed only before offering an order-ready build recipe; the course can teach the process without one. The source ledger and unresolved exact-part decisions are in [research.md](research.md).

| ID | Status at first audit | Possible next improvement or optional build check |
| --- | --- | --- |
| 0.1 | Playable | Add a later changed-case assessment; do not infer mastery from repeating the illustrated order. |
| 0.2 | Playable draft | Make the safe two-AA boundary unambiguous without suggesting every low-voltage setup is safe. |
| 0.3 | Playable draft | Show each tool and part at useful scale, identify substitutions, and check what a learner already owns. |
| 0.4 | Playable draft | Rehearse a safe first-power sequence with a wrong-order consequence and an explicit stop action. |
| 1.1 | Playable draft | Animate a closed path and an open path; test an unseen orientation rather than the identical diagram. |
| 1.2 | Playable draft | Show voltage measured **between two points** and current through a branch before asking for a reading. |
| 1.3 | Playable draft | Diagnose A/mA and Ω/kΩ errors independently; accept correct units and sensible rounding. |
| 1.4 | Playable draft | Let the learner predict before changing a resistor; show the model's assumptions. |
| 1.5 | Playable draft | Check arithmetic and units separately with fresh values and no formula picker on the unit test. |
| 1.6 | Playable draft | Distinguish an open from a short visually; make direct battery shorts an explicit stop condition. |
| 2.1 | Playable draft | Show both schematic symbol and physical LED orientation; check the exact candidate package. |
| 2.2 | Playable draft | Teach how to find page, test current, typical/maximum, and package data in the original datasheets. |
| 2.3 | Playable draft | State that brightness/current target is a design choice; explain the assumptions and limits of the example. |
| 2.4 | Playable draft | Finish the reference design and show the battery/LED range, not one nominal-voltage answer. |
| 2.5 | Playable draft | Select an exact resistor and rating before asking for a pass/fail power-margin decision. |
| 2.6 | Playable draft | Select exact switch, holder, and connection parts; verify pinout, fit, and polarity physically. |
| 2.7 | Playable draft | Use a changed fault, ask for a safe test first, then reveal the explanation. |
| 3.1 | Playable draft | Verify the specific breadboard's rail breaks; many beginners misread the strips. |
| 3.2 | Playable draft | Use a photographed reference build and require cell-free inspection before power. |
| 3.3 | Playable draft | Show meter dial, jacks, probe points, and sign; require the learner to check their own meter manual. |
| 3.4 | Playable draft | Teach current inference from resistor voltage; explicitly reject current mode across the source. |
| 3.5 | Playable draft | Compare predicted and measured ranges without declaring a normal variation to be a fault. |
| 3.6 | Playable draft | Seed a documented fault and test whether the learner chooses a discriminating measurement. |
| 4.1 | Playable draft | Lock KiCad version and screenshots; test a clean install and file-save location from scratch. |
| 4.2 | Playable draft | Pair symbols with the exact chosen parts; verify pin numbers against datasheets. |
| 4.3 | Playable draft | Show junction and crossover behavior in KiCad, then test unseen wire connections. |
| 4.4 | Playable draft | Verify each footprint on an actual part, including pin numbering and dimensions. |
| 4.5 | Playable draft | Supply a known ERC warning and explain why a clean ERC does not prove circuit function. |
| 4.6 | Playable draft | Have a second review trace power, return, switch, resistor, and LED independent of ERC. |
| 5.1 | Playable draft | Show real front/back layers and a cross-section; distinguish copper, mask, and silkscreen. |
| 5.2 | Playable draft | Print/check footprint scale against the exact physical parts, not just the 3D view. |
| 5.3 | Playable draft | Choose a fabricator, date its rules, and distinguish minimum capability from design target. |
| 5.4 | Playable draft | Check switch access, readable polarity, assembly clearance, and the learner's intended use. |
| 5.5 | Playable draft | Test net highlighting and an unrouted connection; do not treat a visually close trace as joined. |
| 5.6 | Playable draft | Validate outline closure, dimensions, hole placement, and markings in actual exported views. |
| 5.7 | Playable draft | Configure DRC and schematic parity first; make one intentionally wrong rule setting visible. |
| 5.8 | Playable draft | Review footprint fit, polarity, traces, edges, and assembly access against the real parts. |
| 6.1 | Playable draft | Generate known-good Gerbers/drills from the versioned reference board. |
| 6.2 | Playable draft | Include a sample missing/shifted layer and make the learner detect it in GerbView. |
| 6.3 | Playable draft | Recheck live vendor screens, costs, options, and component availability at release. |
| 6.4 | Playable draft | Compare schematic, PCB, outputs, and BOM revisions before any paid order. |
| 7.1 | Playable draft | Compare an actual bare PCB with the approved files; mark defects needing vendor contact. |
| 7.2 | Playable draft | Check solder/iron instructions, ventilation, eye protection, and a practice joint. |
| 7.3 | Playable draft | Photograph the exact assembly order, polarity, and soldering constraints of selected parts. |
| 7.4 | Playable draft | Use labeled fault photos plus electrical checks; photos alone cannot prove a joint sound. |
| 7.5 | Playable draft | Make cells absent, verify meter mode, and record expected and observed continuity. |
| 7.6 | Playable draft | Require controlled first power and recorded readings; a lit LED alone is insufficient. |
| 8.1 | Playable draft | Ask for the safest next discriminating test, not just a list of possible causes. |
| 8.2 | Playable draft | Use a branching fault model with readings that genuinely distinguish open from short. |
| 8.3 | Playable draft | Tie brightness/current diagnosis to measured resistor voltage and part value. |
| 8.4 | Playable draft | Keep pre-repair and post-repair evidence; ensure rework does not hide the original cause. |
| 8.5 | Playable draft | Use an unfamiliar fault and evaluate the reasoning even if repair is unsuccessful. |
| 9.1 | Playable draft | Choose a second exact LED and verify its datasheet and package without prehighlighted answers. |
| 9.2 | Playable draft | Recalculate using the new part and battery range; record what remains uncertain. |
| 9.3 | Playable draft | Update actual schematic, PCB, checks, and outputs without mixing old/new revisions. |
| 9.4 | Playable draft | Review the complete evidence and explain decisions unaided; do not substitute a quiz score. |

## Assessment readiness

The app now includes ten three-question unit checks and one final course review. These check principles and record learner notes; they do not inspect KiCad files, measurements, or hardware. The concept lessons need source checks and beginner testing before claims about learning effectiveness. A separate exact build recipe would need a fabricated, assembled, and measured reference before learners are given files and parts to order. A self-reported build is labeled as such; the final review does not certify a working board.

## Implementation check

An isolated headless Chrome playthrough completed the 56 lessons, all 30 unit-check questions, and the final review in path order. It exercised corrections, seven typed calculations, one-time XP, reload persistence, mobile layout, and unfinished-exit warnings. The course-data check compares all 56 app IDs with this plan and verifies that every drafted activity has feedback and a source. These checks establish that the software path works; they cannot establish learning effectiveness or physical correctness.

Research supports retrieval after learning and delayed practice ([Roediger and Karpicke](https://pubmed.ncbi.nlm.nih.gov/16507066/), [Cepeda and colleagues](https://pubmed.ncbi.nlm.nih.gov/16719566/)), but it cannot establish that this specific course works. Relevant labeled diagrams beside words are a sound starting design ([Mayer](https://onlinelibrary.wiley.com/doi/10.1111/jcal.12197)); their usefulness here still needs observation with new learners.

## Recommended evidence before claiming the course is effective

1. Have several people with no electronics or KiCad experience attempt each new unit without live coaching; record where they pause, misread a diagram, or make an unsafe choice.
2. Use an immediate changed-case unit assessment and a later retrieval task; compare first attempts and corrections, not only lesson completion.
3. For hardware units, check source-backed calculations, exact KiCad files, physical measurements, and whether a reviewer can reproduce the learner's result.
4. Revise each unit before building the next large block. Track how many learners independently reach a safe, measured board and can explain an unfamiliar fault or part change.
