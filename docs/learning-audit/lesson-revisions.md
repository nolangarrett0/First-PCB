# Three proposed lesson revisions

These original specifications are retained for comparison. The sequences are now implemented and extended through the course; see [implementation status](implementation.md).

These are concrete content and interaction specifications for the current app. They are not implemented lessons. All numbers and sample artifacts below are teaching cases, not a tested board recipe. Source-backed relationships are cited; problem values, hint order, scoring rules, and review timing are design choices to pilot.

The common pattern is: a focused explanation, a worked case, a related decision the learner must perform, a specific correction, a different task after assistance, and a later retrieval. Physical work remains optional. Corrected practice stays valuable, but is recorded separately from an unaided success on a fresh problem.

## Revision A: 1.5 — Calculate current from the right voltage

**Mission outcome:** use a voltage reading and a known resistor to estimate the LED branch current. The learner must identify the two measurement points, calculate, and express the result with the correct unit.

**Prerequisites:** a closed series loop (1.1), voltage compares two points (1.2), A/mA conversions (1.3), and the fixed-voltage resistor relationship (1.4). An optional reference gives these facts during practice; opening it is recorded as assistance for that task, without a penalty.

**What the app shows:** an SVG series circuit with BT1, closed S1, R1, and D1. Give R1 two named terminals and distinguish battery voltage from resistor voltage. In the worked case, a displayed measurement places 1.1 V across a known 220-ohm resistor. No exact LED behavior is inferred from a universal constant. Relevant voltage values are supplied measurements in the teaching case.

**Suggested learner explanation:**

> Voltage is a comparison between two points. For this calculation, use the voltage across R1. The battery's voltage includes the other parts of the loop. For the resistor, divide its measured voltage by its resistance: 1.1 V ÷ 220 Ω = 0.005 A. Multiply amperes by 1000 to express that as 5 mA. In this single series path, that is also the LED branch current.

The resistor relationship and series-current principle are supported by [OpenStax, Ohm's law](https://openstax.org/books/college-physics-2e/pages/20-2-ohms-law-resistance-and-simple-circuits) and [series circuits](https://openstax.org/books/university-physics-volume-2/pages/10-2-resistors-in-series-and-parallel). Physical voltage setup is grounded in [Adafruit's voltage guidance](https://learn.adafruit.com/multimeters/voltage). Physical meter use must follow the exact meter's jack/mode instructions.

**Practice case A:** the sample supply reading is 3.2 V; the LED-side node is 2.0 V relative to the return; R1 is 300 Ω.

1. Select the two R1 terminals for the voltage measurement. Keyboard users choose named terminals from the same finite set.
2. State the resistor voltage as a value and a unit.
3. Calculate current as a value and a unit, accepting amperes or milliamperes.
4. Choose the reason: this voltage belongs across the resistor whose resistance is known.

**Answer key:** the two R1 ends; 1.2 V; 0.004 A or 4 mA. A declared teaching tolerance accepts 1.20 V and equivalent numerical forms; current answers within 0.01 mA of 4 mA are accepted. Test these rules with beginners and avoid treating formatting as electronics understanding.

| Observed response | Feedback before a full solution | Follow-up decision |
| --- | --- | --- |
| Battery terminals selected | “That gives the supply voltage. Which two points are the ends of R1?” | Select R1 ends again before arithmetic. |
| Current near 10.67 mA | “Your value is consistent with dividing the full 3.2 V supply by 300 Ω. Part of the supply voltage is across the LED. Find the voltage across R1 first.” | Determine 1.2 V, then use a fresh calculation case. |
| 0.004 mA | “0.004 is the current in amperes. How many milliamperes are in one ampere?” | Convert a different A value to mA. |
| 4 A | “The unit makes this 1000 times the intended scale. Keep the A-to-mA conversion visible.” | Rework the unit conversion on a fresh case. |
| Uses R/V or a voltage unit as current | “Identify the requested quantity and the units in V/R. Volts divided by ohms gives amperes.” | Select the relationship, then calculate with changed values. |
| Correct points, arithmetic, and unit | “Your result is 4 mA from 1.2 V across 300 Ω. You used the resistor reading, rather than the supply reading.” | Continue or attempt the transfer variant. |

**Assisted retry:** R1 is 150 Ω and the supplied voltage across it is 0.9 V. Expected current is 0.006 A or 6 mA. Do not present the previous solution beside this question. If the learner opens a formula/reference, record the task as assisted practice.

**Later retrieval:** a sample measurement record gives 0.66 V across a known 330 Ω resistor. Expected current is 2 mA. Ask for the calculation without showing the original example. This can return in the prototype or first-power unit; a review after a later visit tests something different from an immediate retry.

**Optional physical task:** after a separate pre-power check, use DC voltage mode according to the meter manual to measure the two resistor ends. Record the known resistor value, measured resistor voltage, inferred current, and assumptions. Keep this record self-reported. The app must not claim that it observed the meter or verified the resistor's actual tolerance.

**Completion/evidence:** completing corrected practice lets the lesson continue. Store the actual selected points, value/unit, assistance, problem version, original error, and correction. An unaided fresh case supports this particular calculation skill; it does not establish all PCB-design competence.

**Acceptance checks:** selecting battery terminals must not pass the probe task; both 4 mA and 0.004 A must pass case A; 4 A and 0.004 mA must trigger different feedback; a revealed-answer retry must use different values; exiting after a submission must preserve the attempt and resume its problem version.

## Revision B: 6.2 — Find an error in exported manufacturing files

**Mission outcome:** decide whether an example fabrication package contains the expected layers and aligned drill data, and identify the evidence for a release problem.

**Prerequisites:** copper/mask/silkscreen roles (5.1), board outline (5.6), configured checks (5.7), and separate Gerber/drill export (6.1). The PCB editor view and exported output are shown as different artifacts.

**Teaching artifact contract:** create an illustrative two-copper-layer board view, a matching schematic/board revision label, and a sample package manifest. Show visible LED polarity marking and intended pad/hole centers. Provide separate SVG layer overlays for copper, mask, top silkscreen, outline, and drills. A legend identifies what is simplified. These are inspection exercises; they are not files to order.

An example package inventory can contain:

| Expected role | Example file | What the learner should inspect |
| --- | --- | --- |
| Front copper | LED_A_F_Cu.gbr | Intended traces and pads |
| Back copper | LED_A_B_Cu.gbr | Back-layer pads/connections expected by this teaching design |
| Front/back solder mask | LED_A_F_Mask.gbr; LED_A_B_Mask.gbr | Pad openings |
| Top silkscreen | LED_A_F_Silkscreen.gbr | D1 polarity mark and references |
| Board outline | LED_A_Edge_Cuts.gbr | Closed approved board boundary |
| Plated drill data | LED_A_PTH.drl | Hole positions and sizes matching the approved revision |

Filenames are examples. Actual required outputs depend on the design and chosen fabrication service. [KiCad's PCB output documentation](https://docs.kicad.org/10.0/en/pcbnew/pcbnew.html#generating_outputs) describes exports, and [GerbView](https://docs.kicad.org/10.0/en/gerbview/gerbview.html) supports Gerber and Excellon viewing.

**Suggested learner explanation:**

> The fabricator receives exported files. Open that package independently and inspect the layers together. Confirm the outline, copper, mask openings, printed assembly marks, and holes you intended to send. A correct editor view cannot establish that the exported package contains the same information.

**Worked case:** a sample package contains copper and drills but omits its intended outline. Toggle the outline layer, compare with the approved board boundary, and identify the absent output. Explain why the remedy is to fix the outline export and inspect a new package, rather than merely rename a file or point at the editor view.

**Practice case A:** the files are labeled revision A and include a top-silkscreen file. The approved reference has a D1 cathode mark. In the actual silkscreen overlay, the reference text is present but the cathode mark is absent. The learner is asked to inspect the package, without being told the missing feature.

Require four decisions:

1. Select the layer relevant to assembly polarity.
2. Mark the discrepancy on the exported view or choose its named location.
3. Identify what to check/change in the board and export settings.
4. Decide to hold release until regenerated output is inspected.

**Answer key:** top silkscreen; the missing D1 cathode mark; verify the mark's board layer/output inclusion and correct it; regenerate the affected approved outputs and inspect the complete matching package before release. The activity is about the missing intended feature, not whether every fabricator universally requires silkscreen.

| Response | Specific feedback |
| --- | --- |
| Chooses copper to restore the printed mark | “Copper describes the electrical pattern. Locate the assembly mark in the silkscreen output.” |
| Says the mark is present because it appears in the editor | “The editor is the design source. Inspect the layer that is in the package being sent.” |
| Orders because the silkscreen file exists | “A filename establishes that a file is present. Does that layer contain the required D1 mark?” |
| Renames the package without regenerating | “A new name does not change the exported content.” |
| Correctly holds release | “You located a specific missing mark in the exported layer. Correct it and inspect the regenerated matching package.” |

**Changed retry:** the silkscreen is now correct, but the drill overlay is visibly displaced from the copper pad centers. The manifest shows current Gerbers and an older drill revision. Require the drill/copper comparison and regeneration from the matching approved board. Expected evidence: displaced centers plus inconsistent revisions. Do not teach that every visual difference proves a manufacturing failure; the deliberately seeded teaching discrepancy is known.

**Later transfer:** after a footprint spacing change, inspect an unlabeled-error package whose Gerbers are new and drill file is old. Ask the learner to identify which design change affects the holes and what must be regenerated. A later vendor-preview exercise can supply a separate outline dimension discrepancy.

**Optional KiCad procedure:** open GerbView from the project workflow; load the actual Gerber files and the Excellon drill output with their appropriate loading commands; view layers separately and together; compare with the approved revision. Record a found discrepancy and the corrected output review. This draft workflow is checked against documentation; exact screenshots, labels, and a clean-install walkthrough still need implementation QA in the selected KiCad version.

**Completion/evidence:** record the inspected package version, selected layer, identified feature, release decision, and assistance. No note length can substitute for those decisions. Record any real-file review separately as self-reported unless an actual file inspection feature is later implemented.

**Acceptance checks:** a file-present answer must fail if the intended mark is missing; the right finding on the wrong layer must receive a specific correction; a changed retry must contain a different error; layer information must be available by keyboard and without color alone; replay must not silently reuse an already-solved inspection package as independent evidence.

## Revision C: 8.5 — Diagnose using a test and its result

**Mission outcome:** choose a safe measurement that separates two fault hypotheses, predict its outcomes, interpret the observation, and choose the next action without overstating the conclusion.

**Prerequisites:** closed path and polarity, unpowered continuity, voltage/current measurement distinctions, and hypothesis/test/retest reasoning from earlier units.

**Teaching model:** an SVG single series path, BT1 → S1 → R1 → D1 → return, with named test points on both ends of the R1-to-D1 connection. In this example the only candidate faults are an open in that connection and a reversed D1. The supply was checked earlier. The model contains no parallel route between the suspect connection's endpoints; state that simplification. Real in-circuit continuity can have alternative paths, and a beep threshold depends on the meter. [Fluke's continuity guidance](https://www.fluke.com/en-gb/learn/blog/digital-multimeters/how-to-test-for-continuity) supports these limits.

**Suggested learner explanation:**

> A dark LED does not tell you which part is wrong. Choose a test whose results differ between your candidate causes. To test the suspect connection, remove the cells and check its two intended ends in continuity mode. In this simple example, an open gives no continuity and an intact connection gives continuity. An intact connection directs attention to another hypothesis; it does not, by itself, prove that the LED is reversed.

**Worked case:** an open S1 or reversed D1 could explain a dark circuit. With cells removed and S1 set ON, check S1 contacts. If they remain open, that supports the switch hypothesis. If they connect, inspect D1 orientation next. Explain why remeasuring an already-confirmed supply does not distinguish these two causes.

**Practice case A:** the learner gets the different R1-to-D1 fault case above. Require:

1. Choose power state and meter mode.
2. Choose the two named endpoints of the suspect connection.
3. Predict the observation for each hypothesis before seeing the measurement.
4. Reveal a model observation only after submitting those predictions.
5. Choose a supported conclusion and a next inspection.

| Candidate cause | Predicted unpowered connection test in this model |
| --- | --- |
| R1-to-D1 connection is open | No continuity between its intended endpoints |
| D1 is reversed, but that connection is intact | Continuity between those endpoints |

For the first seed, return continuity. The correct conclusion is that the tested connection is intact in this model and the open-connection hypothesis is ruled out. LED polarity remains a candidate; inspect the exact LED drawing and its actual mapping before changing it. [Kingbright's package drawing](https://www.kingbrightusa.com/images/catalog/SPEC/WP7113ID.pdf#page=1) is a suitable original-part reference.

| Mistake | Feedback |
| --- | --- |
| Continuity with cells installed | “Remove the cells before this connection test. Continuity mode is for an unpowered circuit.” Do not provide a powered continuity reading. |
| Tests S1 contacts | “Both current hypotheses can have a working switch. Which two points bound the suspect R1-to-D1 connection?” |
| Tests the empty holder's voltage | “The removed cells leave no supply there. That result cannot distinguish these faults.” |
| Predicts the same reading for both hypotheses | “A useful test separates the causes. If the connection is intact but the LED is reversed, is this wire itself still connected?” |
| Declares the reversed LED proven from a continuity result | “The result rules out this open connection in the example. You still need the polarity inspection to support the other diagnosis.” |
| Proposes a resistor bypass to make the LED light | “The bypass removes the intended current limiting. Choose a non-destructive measurement that answers the connection question.” |

**Changed retry:** move the suspect open to a different named connection and return no continuity. Require locating the failed connection, removing power before a simulated repair, and repeating the same test. Return continuity after the corrected modeled connection. A result that does not change should prompt another hypothesis rather than an automatic success message.

**Later independent task:** supply a changed layout, a sample measurement log, and three candidate causes. Require a discriminating test and a defensible conclusion; avoid reusing the worked example's terminal pair. All observations must come from a reviewed fault/measurement table, not arbitrary text generation.

**Optional physical fault log:** symptom; candidate causes; power state; meter mode; probe locations; predicted result; observed result; inference; repair; repeated result; remaining uncertainty. Mark user-entered observations as self-reported. A suspected fault can remain unresolved while the learner still demonstrates a sound test choice.

**Completion/evidence:** record the chosen test, predictions, observation, supported conclusion, assistance, and fault-case version. Distinguish learning a procedure through corrections from selecting and interpreting a new test unaided. Safety-related selections must be corrected before a modeled physical action is allowed; conceptual course progress and optional hardware status remain separate.

**Acceptance checks:** unsafe continuity requests return a stop/correction, not a fabricated reading; measurements agree with the selected seed and circuit graph; a test that gives the same result under both hypotheses cannot earn independent diagnostic evidence; “proved reversed LED” cannot pass before polarity evidence; a retest uses the same relevant measurement; keyboard users can select all named nodes.

## Applying the pattern beyond these three lessons

Use the same behavior for datasheet extraction, footprint mapping, schematic-net repair, rule configuration, joint inspection, and the final changed-design review. Keep the source, problem assumptions, answer key, wrong-answer diagnosis, visual, and evidence requirements in one reviewed lesson contract. Shortness should come from focusing the task, while giving the learner enough information to carry it out.
