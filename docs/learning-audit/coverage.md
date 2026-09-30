# Complete learning coverage and revision backlog

This is the **historical baseline backlog**. See [implementation status](implementation.md) for the current lessons, interactions and verification.

Reviewed 2026-09-29 against the effective authored content and the in-app path. Every row below was inspected in source and visited in the isolated browser. Every shared activity's incorrect and correct answer paths were exercised. [Runtime coverage](evidence/runtime.json) and [the content snapshot](evidence/course-snapshot.json) preserve the reviewed version.

“Keep” identifies useful material to retain. “Strengthen” means the current question is useful but incomplete. “Rebuild practice” means the stated ability needs an activity the app currently does not supply. These are instructional review judgments; they are not learner-performance scores.

## All 56 lessons

| ID / lesson | Judgment and material to keep | Concrete next improvement |
| --- | --- | --- |
| 0.1 From idea to tested PCB | Strengthen. Clear stage vocabulary and ordering feedback. | Add a changed project-state decision later; save the two first-attempt results instead of only displaying them. Use a complete reference schematic when the actual circuit is introduced. |
| 0.2 Work safely | Keep and strengthen. Cells removed for wiring/continuity; battery-short warning. | Rehearse a change to a pictured circuit by selecting the safe power state before moving a wire. Retrieve it again before first power. |
| 0.3 Know your tools | Strengthen. Distinguishes voltage and continuity and introduces tool roles. | Show usable meter mode/jack examples; ask learners to match a task to a tool and setup. Make the equipment inventory accessible outside the optional note. |
| 0.4 Plan first power | Strengthen. Resolves a suspected short before applying power. | Present an actual polarity/connection checklist with a fault to find; rehearse the stop action, not only its wording. |
| 1.1 Trace a closed loop | Rebuild practice. Correct distinction between an open path and retained battery voltage. | Let learners trace the circuit through numbered terminals, then locate an open in a changed diagram. |
| 1.2 Voltage and current | Strengthen. Correct two-point voltage definition. | Select two LED probe points on the circuit; distinguish a branch-current statement from a voltage comparison. The current question never tests current directly. |
| 1.3 Units that matter | Strengthen. Worked conversions and typed mA-to-A calculation. | Require both A/mA and ohm/kilo-ohm conversions with unit choice; give targeted scale-error feedback. The current kilo-ohm exercise is only an optional reflection. |
| 1.4 Change a resistor | Strengthen. Fixed-voltage assumption and non-ohmic LED boundary are explicit. | Ask for a prediction, change the model's resistor, then calculate/check the consequence. Use a fresh resistance ratio after a correction. |
| 1.5 Use Ohm's law | Strengthen. Useful worked calculation followed by different numbers. | Identify the voltage across the resistor on a circuit before calculating. Accept equivalent units and diagnose supply-voltage and scale mistakes. See the proposed revision. |
| 1.6 Series, open, and short | Rebuild practice. Correctly explains the resistor bypass risk. | Supply closed, open, and bypass diagrams; ask learners to mark the path and identify which part loses current limiting. |
| 2.1 LED direction | Rebuild practice. Checks the exact part instead of trusting a generic lead convention. | Teach anode/cathode roles with the physical drawing and schematic symbol; require actual identification and pin mapping. The unit's datasheet-summary graphic cannot show polarity. |
| 2.2 Read the datasheets | Rebuild practice. Correct 1.9/2.3 V, 10 mA, 25 °C and nominal-voltage qualifications. | Have learners find the row, typical/maximum columns, conditions, and revision in the original document; then use a different parameter. |
| 2.3 Set a current target | Strengthen. Frames target current as a visibility/rating tradeoff. | Provide a bounded comparison of sample visibility observations, current targets, and component constraints; require a justified design choice. The reference visibility evidence currently does not exist. |
| 2.4 Choose the resistor | Strengthen. Correct supply-minus-LED calculation and hypothetical label. | Add an explicit supply/LED range exercise and discuss limited voltage headroom. A nominal arithmetic answer alone does not teach the promised range check. |
| 2.5 Check power and tolerance | Strengthen. Correct I²R calculation. | Include an actual resistor specification excerpt and a tolerance/rating decision. The present numeric question tests power but not tolerance or rating selection. |
| 2.6 Switch and battery holder | Rebuild practice. Correctly separates physical fit from electrical mapping. | Supply an exact teaching switch contact diagram, holder/connector arrangement, and symbol pins; map the selected contact pair. |
| 2.7 Review failure cases | Strengthen. Useful distinction between symptom and cause; rejects resistor bypass. | Ask for one discriminating test, its prediction, and a conclusion from the returned observation. Supply a circuit so polarity and opens can be inspected. |
| 3.1 Breadboard connections | Rebuild practice. Recognizes split rails and removes power for continuity. | Replace the resistor-voltage graphic with actual connected strips and a split-rail model; choose holes and infer their connection. Link the exact split-rail source section. |
| 3.2 Build the prototype | Rebuild practice. Cell-free connection inspection is appropriate. | Supply the complete schematic, numbered breadboard rows, and a worked connection sequence. Let learners find a misplaced jumper in the example. |
| 3.3 Measure voltage | Rebuild practice. Probe-polarity sign explanation is correct. | Select mode, leads, and two probe points on a pictured meter/circuit; predict and interpret the sign. Reference the learner's own meter manual for physical use. |
| 3.4 Infer current | Strengthen. Fresh typed calculation; safer resistor-voltage method. | Make the learner choose the resistor probe points before calculating and record value/unit. Preserve the explicit current-mode-across-battery prohibition. |
| 3.5 Compare results | Rebuild practice. Measured supply replaces an unsupported nominal assumption. | Supply a predicted/observed table with supply, LED, resistor, and uncertainty; require the revised calculation and a supported conclusion. |
| 3.6 Find a wiring fault | Rebuild practice. Tests a rail hypothesis rather than swapping parts. | Return a result from a chosen test and require the next decision. Use a different rail layout from lesson 3.1. |
| 4.1 Create a KiCad project | Rebuild practice. Project revision consistency is worth teaching. | Provide version-checked creation steps and expected project/schematic/PCB files. The current task primarily tests choosing between existing folders. |
| 4.2 Choose symbols | Rebuild practice. Exact switch pin mapping matters. | Show the real contact diagram beside two candidate symbols; map pins and justify the choice. Include a worked symbol-placement procedure. |
| 4.3 Wire the nets | Rebuild practice. Net highlighting is the right verification action. | Supply joined and unjoined crossings, have learners trace highlighted pins, and repair one connection. Replace the unrelated mapping illustration. |
| 4.4 Assign footprints | Rebuild practice. Physical fit does not fix numbered-pad errors. | Match dimensions and numbered pads against an exact part drawing; save a structured mapping rather than a free-form optional note. |
| 4.5 Run ERC | Rebuild practice. ERC's limits are accurately described. | Include an actual warning, its location, and a justified fix or disposition; then show a rule-clean functional error. Teach the run/check steps. |
| 4.6 Review the schematic | Rebuild practice. Human loop and polarity review complements ERC. | Inspect a complete schematic containing an unannounced defect. Require the learner to locate it, explain it, and retrace the corrected loop. |
| 5.1 Read board layers | Strengthen. Copper, mask, and silkscreen roles are correct. | Add a labeled pad/through-hole view and actual layer toggles; distinguish a hole opening from board material. Retrieve layer identity on a real routing view. |
| 5.2 Check footprints | Rebuild practice. Exact dimensions are stronger evidence than a 3D preview. | Compare a part's lead spacing, recommended holes, and polarity against two footprint candidates. Show the measurements and their source. |
| 5.3 Set fabrication rules | Rebuild practice. Vendor minima and design targets are distinguished. | Supply a dated, service-specific capability excerpt and a project-rule table to configure. Require a rule mismatch to be found; do not invent universal numeric minima. |
| 5.4 Place parts | Rebuild practice. Assembly/use access is a real placement constraint. | Show dimensioned alternatives and switch-actuator access. The verbal “rotate under the holder” alternative is hard to judge without geometry. |
| 5.5 Route copper | Rebuild practice. Net assignments and unrouted count are appropriate checks. | Use a top-view net/pad model with a missing route; require finding and completing the actual connection. A cross-section cannot teach this job. |
| 5.6 Outline and markings | Rebuild practice. Actual edge closure matters more than a rendered appearance. | Show an Edge.Cuts gap and hidden polarity mark; locate and repair them, then inspect at actual scale. |
| 5.7 Run DRC | Rebuild practice. Configured rules and schematic parity are correctly distinguished. | Interpret an actual rule/violation report, turn on parity, and identify a deliberately wrong configured value. Record the source/service of the rule. |
| 5.8 Review the board | Rebuild practice. Checks polarity and assembly guidance independently. | Provide the board, schematic, and part drawing; discover the mismatched mark without being told where it is. Supply a concrete checklist. |
| 6.1 Generate files | Rebuild practice. Matching Gerber/drill revision is essential. | Teach the plot/drill steps and expected output inventory, then inspect a sample folder with a stale file. |
| 6.2 Inspect Gerbers | Rebuild practice. Independent exported-layer inspection is the right principle. | Provide aligned overlays, missing-layer variations, and layer controls; locate the defect in the exported package. See the proposed revision. |
| 6.3 Prepare the order | Rebuild practice. Resolves the uploaded preview before payment. | Compare a dimensioned local package with an example vendor preview and BOM. Keep actual prices and ordering outside fixed lesson facts. |
| 6.4 Release the design | Rebuild practice. Freezes matching files and exact parts. | Reconcile an explicit revision/file/BOM manifest; determine what must be regenerated. The current mismatch is announced in the question. |
| 7.1 Inspect the bare board | Rebuild practice. Checks actual part/hole against designed output. | Supply useful board photographs and approved drawing details; identify a receiving discrepancy and explain the next comparison. |
| 7.2 Prepare to solder | Strengthen. Stand, clear workspace, and preparation precede soldering. | Show the station setup and a concrete pause/correction. Add exact safety/manufacturer references, including eye protection and appropriate fume control. |
| 7.3 Install the parts | Rebuild practice. Resolves the exact polarity mapping before soldering. | Include a worked joint-making sequence (pad/lead heating, solder flow, cooling, trimming) plus orientation inspection and exact-part handling constraints. |
| 7.4 Inspect joints | Rebuild practice. Visual appearance alone is insufficient. | Use reference photographs to identify bridges and inadequate wetting; connect the finding to a safe recheck. A generic assembly flow supplies no recognition practice. |
| 7.5 Check continuity | Strengthen. Preserves the important in-circuit-path qualification. | Interpret several expected/observed paths, including a legitimate component path. Make the meter-dependent beep threshold and known-connection check clear. |
| 7.6 Apply first power | Rebuild practice. Heat/odor stop conditions and measurement requirements are clear. | Rehearse the actual pre-power gate, stop action, and a sample supply/resistor reading record. Separate safe shutdown from any later powered measurement. |
| 8.1 Start with the symptom | Rebuild practice. Hypotheses precede changing hardware. | Choose a test from a circuit, predict the different hypotheses' readings, and use the result to choose a next step. |
| 8.2 Localize the fault | Rebuild practice. Chooses measurement mode based on the question. | Supply node readings or an unpowered connectivity result and require locating the open; account for alternative paths in the example topology. |
| 8.3 Explain unusual current | Strengthen. Correct fresh numeric current inference. | Compare the result with an explicit target and competing causes. The current activity calculates current but never requires an explanation of why it is unusual. |
| 8.4 Repair and retest | Rebuild practice. Repeating the original test is sound evidence. | Use a structured before/test/change/retest log with sample data; require a conclusion when the predicted result fails to change. |
| 8.5 Diagnose a new fault | Rebuild practice. Tests the suspected trace directly. | Use an unfamiliar circuit arrangement and a branching fault model; require a prediction before revealing each observation. See the proposed revision. |
| 9.1 Choose another LED | Rebuild practice. A matching visible diameter does not establish compatibility. | Supply an unfamiliar exact datasheet and require electrical/physical extraction; include a case with insufficient supply headroom. C1 currently links the original example part. |
| 9.2 Recalculate | Strengthen. Correct 300-ohm hypothetical revision. | Require changed supply/LED range, resistor power, and a reasoned comparison with the previous design. The current typed question tests one nominal resistance only. |
| 9.3 Update and recheck | Rebuild practice. Preserves consistency through checks and exports. | Compare old/new manifests and artifacts; find stale files and an affected footprint dimension without an announced answer. |
| 9.4 Defend the design | Rebuild practice. Keeps evidence and unsupported physical claims separate. | Require a short structured defense tied to an actual calculation and artifact review; distinguish a justified prediction from a verified measurement. |

## All ten unit checks and the final review

Unit numbers below use the app's displayed 1–10 labels. Planning IDs remain 0–9.

| Activity | Actual tested content | Improvement needed |
| --- | --- | --- |
| unit-0 / Check 1 | Remove cells before inspection; unpowered continuity setup; stop for odor. | First two questions largely repeat the same power-removal skill. Use a changed setup that requires choosing mode and probe points, plus the stop action. |
| unit-1 / Check 2 | Open switch with remaining voltage; inverse Ohm's law; direct battery bypass. | Add unit-scale retrieval and actual loop/path identification. Make the calculation constructed rather than recognized from three choices. |
| unit-2 / Check 3 | LED test conditions; loaded supply value; resistor power. | Extract unfamiliar data and perform the range/rating decision. The revised power question supplies useful different numbers. |
| unit-3 / Check 4 | Compare actual/model voltages; infer current method; split-rail test. | Include the actual readings, compute current, and interpret the discrepancy. Change the rail arrangement from the lesson. |
| unit-4 / Check 5 | Switch contact mapping; LED symbol/footprint polarity; ERC limits. | All three focus on a rule-clean mapping/orientation problem. Add reading a net and an actual ERC finding in an unseen schematic. |
| unit-5 / Check 6 | Switch access; hole fit; remaining ratsnest connection. | Show the geometry and part drawing, then require the defect to be found. Add a configuration/parity decision. |
| unit-6 / Check 7 | Stale drills; missing exported silkscreen mark; missing outline. | Inspect a package whose defects are unannounced. Require the evidence layer/file and the correct regeneration decision. |
| unit-7 / Check 8 | Limits of a lit LED; unpowered pre-power check; alternate continuity paths. | Use a measurement and inspection record to justify safe continuation. Preserve the nuanced beep interpretation. |
| unit-8 / Check 9 | Direct switch test; repeated continuity after repair; 2 mA inference. | Require an actual diagnostic sequence, predicted results, and a conclusion under uncertainty. |
| unit-9 / Check 10 | Limits of CAD claims; changed 200-ohm estimate; footprint pitch change. | Integrate the unfamiliar part, math, footprint, and file revision into one case. Current calculation is changed but multiple-choice. |
| final / Course review | Seven self-reported statuses and a note of at least twelve characters. | Add independent transfer decisions; keep the statuses as reflection and optional hands-on tracking. All Pending plus filler currently passes. |

## Supporting screens, interactions, and code

| Area | Verified behavior / finding | Next improvement |
| --- | --- | --- |
| Course path | 67 activity nodes; first is initially enabled; completed predecessors unlock the next. Completion and XP persist. | Add access to reference material and specific review needs. A fixed linear path supplies no performance-driven review. |
| Reading screen | Task, terms, explanation, static visual, example, and source links. No reading/practice requirement is checked before Continue. | Match the example to an actual teaching artifact. Let learners recover forgotten vocabulary during practice. |
| Choice feedback | All 156 incorrect-choice paths matched their authored correction after display rotation. | Keep the selected-mistake specificity; follow a correction with a changed task. |
| Numeric feedback | Seven correct answers; exponent form and tested boundaries accepted/rejected as expected. | Collect units and diagnose error classes. |
| Learning-note screen | Notes are optional in ordinary lessons/checks; retained drafts resume. | Make evidence fields specific to the task and provide direct access to old notes. Do not require filler. |
| Attempt history | Completed retries append Boolean first-try arrays; earlier false results remain. | Save submitted mistakes and question revisions immediately; normalize the custom introduction's record. |
| Results and XP | 730 XP after first completion of all activities; replay awards none. | Keep XP as participation. Show an actionable weak skill instead of only a generic review suggestion. |
| In-app exit | Dialog initially focuses Keep learning; Escape returns to practice; Leave resets question state. | Checkpoint the actual place and submitted work. Track unsaved work even after Back to reading. |
| Reload and resume | Completed progress and draft notes persist; assessment position resets. | Preserve stage and question, with explicit revision handling if course content changes. |
| Storage failure | Simulated failure is silently swallowed; saved wording still appears; note is lost on reopening. | Distinguish durable save from session-only state and provide a recovery route. |
| Keyboard/accessibility | Selected answer is a CSS class only; new-stage focus falls to BODY. | Add single-choice semantics, visible/announced selection, and stage focus. |
| Mobile reading | Selected lessons and final reading had no horizontal overflow at 390/320 px. | Keep responsiveness; check future diagram labels and interactions at those widths. |
| Electron | Separate hidden profile; app protocol loads; source link reaches allowed external-shell boundary; in-app exit works; native close is cancelled. | Add a native leave/stay decision. Check packaged installer and migration separately before promising those behaviors. |
| Content data check | Confirms lesson/article/source/feedback presence and key consistency. | Add independent variant solutions and checks for skill coverage, problem revision, reference artifacts, and relevant visuals. Content presence alone cannot assess learning quality. |

All listed improvements remain proposals. Implementation should follow the sequence and acceptance criteria in [the roadmap](implementation-roadmap.md).
