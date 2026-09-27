# First PCB: beginner-to-PCB curriculum plan

Status: course blueprint with playable draft lessons. Researched 2026-09-25. The linked sources and what each supports are recorded in [research.md](research.md). Lesson IDs are stable planning IDs. No numerical component recommendation, footprint, or manufacturing limit is approved by this plan alone.

## Promise and boundary

The learner starts with no electronics or CAD experience. By the end, they can explain the steps used to design, prototype, document, lay out, order, assemble, measure, and debug **one simple low-voltage PCB**, then reason through a change to a different LED. Making or ordering a board is optional. Topics such as mains power, lithium charging, RF, high speed layout, complex power converters, and microcontroller programming are outside the core course.

The anchor example is a hand-solderable, two-layer, through-hole board with a red LED, current-limiting resistor, on/off switch, and connection to an external two-AA alkaline holder. It illustrates decisions in the workflow; it is not an approved design to order. Two AA cells have 3 V *nominal* total voltage when using the cited 1.5 V nominal E91 cells; nominal is not a fixed measured voltage. The red LED candidate is Kingbright WP7113ID. Its datasheet specifies 1.9 V typical and 2.3 V maximum forward voltage **at 10 mA**, so those figures must not be presented as a universal voltage at other currents. Exact resistor, switch, holder, connector, footprints, and fabricator remain to be selected and checked if a tested build recipe is offered. See [research.md](research.md#reference-design-decisions-and-unresolved-work).

### Course shape

| Unit | Mission | Lessons | Tangible output | Gate to next unit |
| --- | --- | ---: | --- | --- |
| 0 | Prepare the project and work safely | 4 | Project brief and safe-work checklist | Identify allowed supply and stop conditions |
| 1 | Understand a circuit | 6 | Annotated battery–resistor–LED loop | Predict current and voltage in a new simple circuit |
| 2 | Choose the parts | 7 | Source-backed component and calculation sheet | Explain a resistor choice and its uncertainty |
| 3 | Prototype and measure | 6 | Breadboard test record | Reconcile prediction with measured voltages |
| 4 | Draw the schematic | 6 | Reviewed KiCad schematic | ERC plus independent connectivity/polarity review |
| 5 | Lay out the PCB | 8 | Reviewed two-layer board | DRC, schematic parity, footprint and physical review |
| 6 | Prepare fabrication | 4 | Inspectable manufacturing package | Independent Gerber/drill review before ordering |
| 7 | Assemble and test | 6 | Assembled board and measurement record | Unpowered checks, controlled first power, measured behavior |
| 8 | Debug and explain | 5 | Fault log and repaired board or diagnosis | Diagnose an unfamiliar seeded fault from evidence |
| 9 | Make one independent change | 4 | Revised design and design note | Recalculate, update, recheck, and explain tradeoffs |

**Total: 56 lessons.** Most concept/practice lessons should be short enough for one sitting (target 5–10 minutes; a product design target, not a research-derived optimum). The table describes the full workflow; its tangible outputs and gates apply to learners who choose hands-on work. Every unit must also have an in-app route using the example. The course must never present a digital quiz as proof that a physical board works.

### Assessment path

Add **one unit assessment after each of the 10 units**, then a **final course review** after Unit 9. These are 11 checkpoints in addition to the 56 teaching lessons. Each unit assessment uses at least one changed example and asks for an unaided decision before feedback. Show specific corrections and a retry with a different case. A failed attempt identifies what to review; it does not erase completed lessons or XP. Safety and release checks apply before a learner chooses to handle power or order hardware.

Unit assessments should use a brief in-app task; an artifact or bench record is optional. For example, Unit 1 uses a new circuit diagram and calculations, while Unit 5 can ask how to review a footprint and DRC result. The app must label any physical results as self-reported. A passing quiz alone cannot mark a board manufactured, assembled, or working.

The **final review** asks the learner to explain component choices, schematic and board checks, fabrication outputs, assembly and measurement checks, and an independent LED change. The learner marks topics they can explain and topics to revisit, then records any optional design or physical work they attempted. Completing the review records learning activity; it does not certify a manufactured or working board or professional engineering competence.

## Prerequisite graph

```text
safe low-voltage work → closed loop → voltage/current/resistance → Ohm's law
                   → LED polarity + datasheet → resistor/current/power choice
                   → breadboard + measurement → schematic → ERC + human review
                   → footprint match + fabricator rules → layout → DRC + human review
                   → Gerber/drill inspection → bare-board inspection → assembly
                   → unpowered check → first power + measurement → diagnosis
                   → independent LED substitution and full recheck
```

The conceptual path follows the order of the physical workflow. A learner can revisit any completed lesson or reference. A gate applies only if the learner chooses a physical or financial step; a missed recall question sends the learner to a short correction and retry, not back to the start of the unit.

## Lesson map

In the tables, **evidence** describes the full hands-on version of an activity. The app should provide a parallel example-based exercise when a learner has no design file or hardware. `App` means an in-app prediction, calculation, annotation, or fault exercise that can receive immediate deterministic feedback. `Artifact` means an optional saved design file or record. `Bench` means an optional physical observation or measurement, recorded by the learner and labelled self-reported. Source codes resolve in [research.md](research.md#source-ledger).

### Unit 0 — Prepare the mission

| ID | Learner outcome | Practice and feedback | Evidence | Sources |
| --- | --- | --- | --- | --- |
| 0.1 | Explain the route from circuit idea to tested PCB. | Sort schematic, PCB, fabrication files, bare board, and assembled board into order; explain each wrong placement. | App sequence and one-sentence destination | K1, K2 |
| 0.2 | Set boundaries for the first build. | Classify two-AA alkaline, wall outlet, lithium cell, and unknown supply scenarios; show why only the approved battery setup belongs in this course. | Correctly reject unsafe/out-of-scope supplies | B2, B3 |
| 0.3 | Identify the tools and physical parts. | Match meter, breadboard, soldering iron, LED, resistor, switch, battery holder, and PCB to their jobs; show an itemized kit before bench work. | Tool checklist; missing items remain visible | M1, A1; project choice |
| 0.4 | Plan a safe first-power routine. | Order: remove cells, inspect, continuity check, set switch off, insert cells, observe, remove on heat/odor; correct dangerous order immediately. | App procedure check; repeat before Unit 7 | B2, M1; project procedure |

**Unit check:** on an unfamiliar beginner project scenario, identify the safe supply, put the five design/build stages in order, select the required tools, and state when to stop before applying power. Unsafe supply or first-power choices require correction before moving to physical work.

### Unit 1 — Understand the loop

| ID | Learner outcome | Practice and feedback | Evidence | Sources |
| --- | --- | --- | --- | --- |
| 1.1 | Trace a closed current path. | Complete and break a battery–lamp loop; feedback highlights the interruption, not just “wrong.” | Trace the path on an unseen diagram | F1 |
| 1.2 | Distinguish voltage from current. | Place voltage and current labels on two points and one branch; address the misconception that voltage “flows.” | Explain what each meter reading would describe | F1, M1 |
| 1.3 | Use volts, amperes, milliamperes, ohms, and metric prefixes. | Convert A ↔ mA and Ω ↔ kΩ in design-sized examples; show unit-specific correction. | Correct conversions with units | F1 |
| 1.4 | Predict the effect of changing resistance. | Change resistor value in an ideal resistive circuit and predict direction of current change before seeing calculation. | Prediction plus explanation | F1 |
| 1.5 | Calculate one unknown using Ohm’s law. | Solve I = V/R, then V = IR and R = V/I; check arithmetic and units separately. | Two fresh calculations without prompts | F1 |
| 1.6 | Distinguish a series path, parallel branch, open circuit, and short. | Sort and troubleshoot simple diagrams; explain why a direct battery short is a stop condition. | Diagnose an unseen connection diagram | F2, B2 |

**Unit check:** given a different battery-and-resistor diagram, the learner predicts current, marks the closed loop, and names what a break or bypass changes. No formula selector is shown on the first attempt.

### Unit 2 — Choose a real circuit

| ID | Learner outcome | Practice and feedback | Evidence | Sources |
| --- | --- | --- | --- | --- |
| 2.1 | Recognize LED polarity and non-ohmic behavior. | Orient an LED in three circuits; feedback traces current and shows why the LED is not modeled as a fixed resistor. | Correct orientation on unseen package and symbol | C1, F1 |
| 2.2 | Read the battery and LED datasheets. | Find chemistry, nominal voltage, LED test current, forward-voltage range, current rating, and package dimensions; distinguish typical from maximum. | Cite page/condition for each extracted fact | C1, C2 |
| 2.3 | Set a target current as a design choice. | Compare brightness/current tradeoffs qualitatively, then select a modest target inside the reviewed reference design’s limits. | State target and reason; no “one correct brightness” | C1; design choice |
| 2.4 | Choose and justify the resistor. | Calculate with battery and LED assumptions, compare standard values, check low/high cases; feedback reveals each assumption and consequence. | Calculation sheet with units and range | F1, C1, C2 |
| 2.5 | Check resistor power and tolerance. | Use P = IV or I²R; decide whether candidate resistor rating leaves margin and how tolerance changes current. | Worked power check and stated margin | F3; resistor datasheet pending |
| 2.6 | Specify switch, holder, and connection. | Compare contact operation and mechanical fit; identify polarity and where strain relief or a connector is needed. | Source-backed component requirements, not yet a part number | K3; switch/holder datasheets pending |
| 2.7 | Review plausible failure cases. | Given reversed LED, missing resistor, open switch, and shorted rails, predict what happens and where to stop. | Correct diagnosis and safe action in a new case | C1, B2, F1 |

**Unit check:** use datasheet information to explain a sample part choice, calculations, and what remains unresolved. Exact parts and values need further verification only if the course later offers a build recipe.

### Unit 3 — Prototype and measure before committing to copper

| ID | Learner outcome | Practice and feedback | Evidence | Sources |
| --- | --- | --- | --- | --- |
| 3.1 | Read breadboard connectivity. | Mark connected groups, rail breaks, and accidental shorts on a breadboard diagram; feedback reveals hidden internal strips. | Place parts correctly on a fresh layout | B1, M1; specific board must be verified |
| 3.2 | Assemble the approved low-voltage prototype. | Guided build with cells absent until inspection; compare every node with the schematic before power. | Bench photo or signed build checklist, labelled self-reported | B2; project procedure |
| 3.3 | Measure DC voltage and polarity. | Choose meter mode, jacks, and two probe points; predict sign and approximate reading before touching hardware. | Recorded battery, resistor, and LED voltages | M1 |
| 3.4 | Infer current without moving the meter lead. | Calculate I from measured resistor voltage and measured resistor value; explain why a current-mode meter across a source is hazardous. | Calculation tied to actual measurements | F1, M1 |
| 3.5 | Compare measured and predicted results. | Enter values with units and uncertainty; feedback asks whether a difference is explained by battery voltage, LED variation, resistor tolerance, or wiring. | Observation–prediction–explanation record | C1, C2, F1 |
| 3.6 | Find one seeded breadboard fault. | Diagnose an open rail, reversed LED, or wrong resistor by proposing a measurement first; feedback follows the selected test. | Fault, discriminating test, correction, retest | M1, C1 |

**Unit check:** use a sample measurement record to check whether supply, resistor, and LED voltages are mutually consistent. Learners who build a prototype can record their own readings. The app can check arithmetic and plausible ranges; it cannot verify an unobserved physical result.

### Unit 4 — Make a schematic in KiCad

| ID | Learner outcome | Practice and feedback | Evidence | Sources |
| --- | --- | --- | --- | --- |
| 4.1 | Create a KiCad project and distinguish schematic from board. | Identify file roles and make a named project; feedback catches work saved outside the project. | Artifact: project and schematic | K1, K2 |
| 4.2 | Choose symbols for the exact parts. | Match LED, resistor, switch, and battery connection to their schematic symbols; inspect pin numbers. | Correct part list and symbols | K2, K3; part datasheets |
| 4.3 | Wire nets and junctions deliberately. | Repair crossed-but-unconnected and joined-but-unintended wires; show highlighted net after each action. | Complete circuit with named supply and return nets | K2, K3 |
| 4.4 | Set values and assign footprints. | Add resistor value, manufacturer part numbers, and candidate footprints; compare pin numbering and dimensions against datasheets. | Artifact with every physical part mapped | K2, K3; part datasheets |
| 4.5 | Run and interpret ERC. | Repair an intentionally missing power indication or unconnected pin; explain the difference between a rule warning and a circuit-function proof. | ERC report and reasoned disposition of each warning | K2, K3 |
| 4.6 | Independently review the schematic. | Trace the loop, polarity, switch behavior, supply, and component ratings without relying on ERC. | Signed checklist and exported schematic | K2, C1, C2 |

**Unit check:** ERC has no unresolved errors relevant to the design; every warning is fixed or documented; a separate logical review confirms the intended topology. KiCad explicitly says ERC cannot guarantee that a schematic will work [K2].

### Unit 5 — Turn the schematic into a board

| ID | Learner outcome | Practice and feedback | Evidence | Sources |
| --- | --- | --- | --- | --- |
| 5.1 | Name the board layers and the role of pads, holes, traces, solder mask, and silkscreen. | Label a two-layer cross-section and locate a through-hole pad on both sides. | Annotated board view | K1, K4 |
| 5.2 | Confirm each footprint against a physical part. | Compare hole size, pin spacing, body outline, polarity marks, and courtyard to exact datasheet drawings. | Footprint-to-part verification table | K3, K4; part datasheets |
| 5.3 | Set conservative rules from the chosen fabricator. | Read limits for width, spacing, drills, copper-to-edge, and board outline; enter project rules, distinguish capability minimum from design target. | Rules table with fabricator URL and check date | K4, P1 |
| 5.4 | Place parts for assembly and use. | Arrange the LED, switch, battery connection, and resistor; check hand clearance, accessibility, and polarity readability. | Placement explanation and top-view screenshot | K4; project design review |
| 5.5 | Route each net and understand unrouted connections. | Route a short path, then identify an intentionally unconnected net; feedback points to ratsnest/net mismatch. | Fully routed board | K4 |
| 5.6 | Complete outline, mounting, and markings. | Close the Edge.Cuts outline; label polarity, switch state, and component references; inspect readability and dimensions. | Board drawing and 3D view | K2, K4 |
| 5.7 | Run DRC and schematic parity. | Diagnose clearance, unconnected pad, and outline errors; inspect rule settings before claiming a clean result. | DRC report with parity enabled and no unexplained violations | K4 |
| 5.8 | Perform a human board review. | Follow each schematic net through the copper; inspect orientation, footprint fit, connector polarity, board edge, holes, and assembly access. | Review checklist plus revision note | K4, C1, P1 |

**Unit check:** explain why a clean, configured DRC and a human inspection answer different questions. Learners who create a board can run both checks on their own files. DRC tests the configured rules and net connections; it cannot validate a selected part, footprint dimensions, or electrical intent by itself [K4].

### Unit 6 — Prepare fabrication and ordering

| ID | Learner outcome | Practice and feedback | Evidence | Sources |
| --- | --- | --- | --- | --- |
| 6.1 | Generate fabrication outputs. | Export required copper, solder mask, silkscreen, outline, and Excellon drill files from the approved KiCad project. | Versioned fabrication folder | K2, K4, P1 |
| 6.2 | Inspect outputs independently. | Open Gerbers and drills in GerbView; locate an intentionally missing outline or shifted drill in sample data. | Layer-by-layer inspection record | K5, P1 |
| 6.3 | Prepare an order and build kit. | Check fabricator preview, board options, quantity, cost/shipping shown at order time, BOM part numbers, tool and spare-part list. | Order-ready package and BOM | P1; vendor terms must be current |
| 6.4 | Complete the pre-order release gate. | Reconcile schematic revision, PCB revision, DRC report, Gerbers, drills, and BOM; another review pass signs off before money is spent. | Release checklist and immutable package hash/version | K4, K5, P1 |

**Unit check:** inspect an example package and explain which files and checks a fabricator would need. A learner who chooses to order a board must verify their own package, current prices, vendor capabilities, and ordering screens. Ordering is never required to finish the course.

### Unit 7 — Assemble and power the board

| ID | Learner outcome | Practice and feedback | Evidence | Sources |
| --- | --- | --- | --- | --- |
| 7.1 | Inspect the bare PCB. | Check outline, holes, copper, mask, and silkscreen against the approved files before adding parts. | Bare-board inspection record | K5, P1 |
| 7.2 | Prepare a safe soldering station. | Identify hot tip, stable stand, ventilation, eye protection, and clean workspace; practice a joint on scrap material first. | Procedure check; scrap-joint photo optional | A1, A2 |
| 7.3 | Solder through-hole components in a planned order. | Install lower parts first, then polarized LED and connector/switch as appropriate; inspect each joint as built. | Assembly checklist and part orientation record | A2, C1; part handling notes |
| 7.4 | Recognize and correct weak joints or bridges. | Sort joint photos by fault; rehearse repair, then inspect the learner’s board. | Repair explanation and final joint inspection | A2, A3 |
| 7.5 | Check unpowered continuity and polarity. | With cells removed, test intended connections and absence of supply short; verify the meter on a known connection first. | Recorded expected vs observed continuity | M1, B2 |
| 7.6 | Apply first power and measure. | Follow the pre-power gate, insert cells, operate switch, measure supply and resistor voltage; stop on heat, smell, or unexpected behavior. | Bench record with predicted and actual readings | M1, B2, C1 |

**Unit check:** a lit LED alone is insufficient evidence. The learner records an inspected assembly, unpowered checks, and voltage readings consistent with the design. Do not ask a beginner to put a meter in current mode across a battery or live circuit [M1].

### Unit 8 — Debug with evidence

| ID | Learner outcome | Practice and feedback | Evidence | Sources |
| --- | --- | --- | --- | --- |
| 8.1 | Turn a symptom into possible causes. | For “LED does not light,” rank no supply, open switch, reversed LED, wrong part, and bad joint; choose the next safe test. | Test choice with a reason | M1, C1 |
| 8.2 | Localize an open or short systematically. | Use node voltages and unpowered continuity in a branching diagnosis; feedback distinguishes observation from inference. | Fault location and supporting readings | M1, F1 |
| 8.3 | Diagnose an unexpected current or brightness. | Compare measured resistor voltage and value to design expectation; inspect wrong resistor, supply variance, or LED orientation. | Cause hypothesis with calculation | F1, C1, C2 |
| 8.4 | Rework and retest without hiding the failure. | Plan a safe correction; log before/after measurements and whether the diagnosis was confirmed. | Fault log and retest | A3, M1 |
| 8.5 | Explain a new fault without a hint. | Seed one unfamiliar fault in a virtual board, or use a real board fault; require a discriminating test before revealing it. | Independent diagnostic argument | M1, A3 |

**Unit check:** competence is shown by a repeatable diagnostic process, including cases where the board still does not work. “I fixed it” without a recorded observation and test does not mark debugging mastery.

### Unit 9 — Transfer the skill to a new design

| ID | Learner outcome | Practice and feedback | Evidence | Sources |
| --- | --- | --- | --- | --- |
| 9.1 | Choose a different compatible LED from its datasheet. | Find forward-voltage conditions, current limits, polarity, dimensions, and footprint implications without prefilled highlights. | Source-backed alternative part note | C1 as model; new manufacturer datasheet |
| 9.2 | Recalculate and predict changed behavior. | Choose a resistor using the new LED and battery range; calculate resistor power and identify uncertainty. | Fresh calculations and prediction | F1, F3, C2; new datasheet |
| 9.3 | Update schematic, board, and outputs coherently. | Change the design, rerun ERC/DRC/parity, and compare Gerbers to the previous revision. | Revised artifacts and checks | K2–K5 |
| 9.4 | Defend the design as a small engineering review. | Explain assumptions, evidence, failure risks, measurements to make, and what remains unverified until built. | Short design review and record of demonstrated skills | All relevant source records |

**Course completion:** the learner has worked through the lessons, unit checks, and final review, and can identify what changes when a new LED is used. A physical build is optional and, if reported, remains self-reported. Do not claim a working board or professional PCB design competence from course completion alone.

## Retrieval and transfer threads

The app should revisit skills in later, different contexts. The examples below are **scheduling choices to test**, not scientifically proven optimal intervals. Research supports retrieval and distributed practice in general [E1, E2]; it does not establish a perfect schedule for PCB skill acquisition.

| Skill | First demonstration | Later retrieval, without answer cues | Transfer |
| --- | --- | --- | --- |
| Closed loop / open / short | 1.1, 1.6 | 2.7, 3.6, 4.6 | 8.2 |
| Units and Ohm’s law | 1.3–1.5 | 2.4, 3.4, 7.6 | 9.2 |
| LED polarity and ratings | 2.1–2.2 | 3.2, 4.6, 7.3 | 9.1 |
| Source interpretation | 2.2 | 4.4, 5.2, 6.3 | 9.1 |
| Measurement choice | 3.3–3.4 | 7.5–7.6, 8.2 | 9.4 |
| ERC/DRC limits | 4.5, 5.7 | 6.4 | 9.3 |
| Debugging | 3.6 | 7.6, 8.1–8.5 | 9.4 |

Each retrieval should ask for a prediction or action before showing feedback. A prior correct answer is not enough to mark stable mastery; require a later success on a changed example. The exact number of repetitions and intervals should be evaluated with learners, not asserted as a known optimum.

## Optional bridges after the core course

These are future paths, not prerequisites for the first board: a transistor-controlled LED; capacitors and transient behavior; regulated supplies; sensor input; microcontroller GPIO; and surface-mount assembly. Each path requires its own part-specific sources and safety review. The core course should be completed and tested with beginners before expanding into these topics.
