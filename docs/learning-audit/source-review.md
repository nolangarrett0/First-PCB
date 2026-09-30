# Source and calculation review

Checked 2026-09-29. All 17 app source URLs returned HTTP 200 during the audit. That establishes reachability, not the correctness of every statement on those sites. The table below records the relevant material inspected and its limits. [Fetch metadata](evidence/source-fetch.json) contains retrieval dates, final URLs, document sizes, and SHA-256 fingerprints. Full publisher documents were kept in a temporary review cache and are not redistributed here.

The component PDFs were extracted and their relevant tables/drawings were visually inspected. Web guidance was compared with the lesson claims and procedures. No physical board, exact switch, holder, resistor, or fabrication order was validated.

## All 17 course sources

| ID / source | What the reviewed source supports | Boundary or necessary improvement |
| --- | --- | --- |
| F1 — [OpenStax: Ohm's law, §20.2](https://openstax.org/books/college-physics-2e/pages/20-2-ohms-law-resistance-and-simple-circuits) | The resistor relationship V = IR and current calculated from a voltage across a known resistance. | Apply this to the resistor. The app correctly avoids treating an LED as an ohmic resistor. A voltage must identify two endpoints; connect the formula to an actual circuit drawing. |
| F2 — [OpenStax: Series and parallel resistors, §10.2](https://openstax.org/books/university-physics-volume-2/pages/10-2-resistors-in-series-and-parallel) | Series current and the distinction between series and parallel connections. | Add a complete single-path teaching schematic and changed open/bypass cases. A description of a series circuit alone does not teach learners to recognize the connection in a drawing. |
| F3 — [OpenStax: Electric power, §20.4](https://openstax.org/books/college-physics-2e/pages/20-4-electric-power-and-energy) | P = IV and, for a resistor, P = I²R and V²/R. | Calculated dissipation is distinct from choosing a part rating under specified conditions. A margin is a design choice; ground the selected resistor's rating and derating in its own documentation. |
| C1 — [Kingbright WP7113ID datasheet](https://www.kingbrightusa.com/images/catalog/SPEC/WP7113ID.pdf) | Reviewed Rev. V.14A, date printed 01/08/2026. Page 1 identifies package dimensions and cathode. Page 2 specifies 1.9 V typical and 2.3 V maximum forward voltage at 10 mA, with the stated ambient condition of 25 °C. Page 3 includes typical characteristic curves and derating. | The current lesson quotes the forward-voltage values and conditions correctly. They do not guarantee the same drop at a 4–5 mA target. A typical curve is not a guaranteed production bound. Absolute maximum DC current of 30 mA is not a recommended learning-project target. Use the exact drawing for pin/footprint work and the handling limits for an actual assembly recipe. |
| C2 — [Energizer E91 datasheet](https://data.energizer.com/pdfs/e91.pdf) | Reviewed single-page form E91NA1018. Gives nominal 1.5 V, alkaline chemistry, dimensions, and load-dependent discharge curves with stated conditions. | The app's nominal-voltage qualification is correct. Two nominal cells do not establish an exact loaded 3.0 V supply. Identify the reviewed document revision; a reachable old PDF is not evidence that it is the newest manufacturer specification. |
| B1 — [Adafruit: Breadboards](https://learn.adafruit.com/breadboards-for-beginners/breadboards) | Internal terminal strips, the center separation, and power rails. | The split-rail point used by lessons 3.1/3.6 is supported more directly by [Other Breadboard Sizes](https://learn.adafruit.com/breadboards-for-beginners/other-breadboard-sizes), which explains midpoint breaks and checking with a meter. Link that section too. Never infer a learner's actual rail topology solely from its colored stripe. |
| B2 — [Energizer: Battery care](https://energizer.com/about-batteries/battery-care/) | Short-circuit precautions, correct installation, avoiding mixed cells, and handling primary cells appropriately. | Keep cell removal before wiring and continuity tasks. This page does not establish the compatibility of an unspecified holder or a soldering procedure for a cell. Exact hardware instructions require the selected product's documentation. |
| K2 — [KiCad 10.0: Getting started](https://docs.kicad.org/10.0/en/getting_started_in_kicad/getting_started_in_kicad.html) | Creating a project, schematic/board workflow, checks, and fabrication outputs. It explicitly limits what electrical rule checking establishes. | The current app links a versioned manual, which is useful. Teach short procedures in the app, with expected files/results. The documented project/template flow should be checked against the chosen installed version before screenshots and click instructions are published. |
| K3 — [KiCad 10.0: Schematic editor](https://docs.kicad.org/10.0/en/eeschema/eeschema.html) | Wire/junction connectivity, net highlighting, footprint assignment, symbol pins, and ERC. | Add exact sections and artifact examples. A rule-clean schematic can still have incorrect intended connections or physical pin mapping; the current lessons appropriately retain a human review. |
| K4 — [KiCad 10.0: PCB editor](https://docs.kicad.org/10.0/en/pcbnew/pcbnew.html) | Board layers, footprints, routing, configured design rules, unconnected items, schematic parity, and separate plotting/drill outputs. | DRC checks configured rules; those settings must match the project/service. Schematic parity is an explicit option and has no effect in standalone PCB-editor mode. Preserve that condition. Use [Generating outputs](https://docs.kicad.org/10.0/en/pcbnew/pcbnew.html#generating_outputs) for export instruction. |
| K5 — [KiCad 10.0: GerbView](https://docs.kicad.org/10.0/en/gerbview/gerbview.html) | Independent viewing of Gerber and Excellon drill data, using their loading commands and layer display. | The app's export-inspection principle is correct. Give learners an actual inspection artifact. A correct editor view, a file's existence, or the viewer opening successfully does not establish that the package matches the approved design. |
| M1 — [Adafruit: Multimeters](https://learn.adafruit.com/multimeters?view=all) | Two-point voltage measurements, probe sign, voltage/current modes, current in series, and unpowered continuity. | Link the individual voltage/current/continuity sections. Generic guidance cannot prescribe the exact jacks, ranges, fuse, or limitations of every meter. The course's resistor-voltage method is a useful way to practice branch-current inference. |
| M2 — [Fluke: Continuity testing](https://www.fluke.com/en-gb/learn/blog/digital-multimeters/how-to-test-for-continuity) | Removing power, isolating the path as needed, and interpreting a continuity result. | A beep threshold is meter-dependent; the article's threshold example is not universal. Installed components can supply other paths. The app correctly asks learners to investigate a legitimate path before declaring a solder bridge. Supply diagrams so that reasoning can actually be practiced. |
| A1 — [Adafruit: Excellent soldering, Tools](https://learn.adafruit.com/adafruit-guide-excellent-soldering) | The opened Tools page includes a stand and ventilation, along with station/tool preparation. | Its checked sections do not explicitly substantiate every control listed in lesson 7.2, including eye protection. Add precise equipment/material instructions and primary safety guidance. Do not reduce solder-fume control to an unsupported generic sentence. |
| A2 — [Adafruit: Making a good solder joint](https://learn.adafruit.com/adafruit-guide-excellent-soldering/making-a-good-solder-joint) | Heating pad and lead, applying solder, allowing flow/cooling, and trimming. | This is useful source material for a worked in-app procedure. Link to the exact component's temperature/time handling restrictions for a real build. Do not present one generic iron setting as safe for all parts. |
| A3 — [Adafruit: Common soldering problems](https://learn.adafruit.com/adafruit-guide-excellent-soldering/common-problems) | Joint defects, inadequate wetting, disturbed/cold joints, bridges, and corrective examples. | Use licensed/reference photographs for recognition practice. The app's advice to inspect an uncertain joint does not claim every dull joint is defective; retain that distinction and avoid a shine-only grading rule. |
| P1 — [JLCPCB: Capabilities](https://jlcpcb.com/capabilities/Capab) | Published manufacturing capabilities differentiated by service, material, layer count, copper, and related conditions. | A listed minimum is not a universal recommended beginner rule. A future numeric rule exercise must capture the exact service and retrieval date. This audit does not recommend a vendor, place an order, or approve a geometry for manufacture. |

## Independent calculation check

The following seven effective typed-answer keys are mathematically correct under the supplied assumptions. The programmed tolerances are authoring choices, not component tolerances or measurement uncertainty.

| Lesson | Independent calculation | Stored answer / tolerance |
| --- | --- | --- |
| 1.3 | 10 mA ÷ 1000 = 0.01 A | 0.01 A ± 0.00001 A |
| 1.5 | 2 V ÷ 100 Ω = 0.02 A | 0.02 A ± 0.00001 A |
| 2.4 | (3 − 2) V ÷ 0.005 A = 200 Ω | 200 Ω ± 0.5 Ω |
| 2.5 | (0.005 A)² × 200 Ω = 0.005 W | 0.005 W ± 0.00001 W |
| 3.4 | 0.9 V ÷ 300 Ω = 0.003 A = 3 mA | 3 mA ± 0.01 mA |
| 8.3 | 0.5 V ÷ 100 Ω = 0.005 A = 5 mA | 5 mA ± 0.01 mA |
| 9.2 | (3 − 1.8) V ÷ 0.004 A = 300 Ω | 300 Ω ± 0.5 Ω |

The four numerical unit-check keys also agree: Unit 2, 1 V ÷ 0.01 A = 100 Ω; Unit 3, (0.008 A)² × 150 Ω = 0.0096 W; Unit 9, 0.4 V ÷ 200 Ω = 2 mA; Unit 10, (3.2 − 2.0) V ÷ 0.006 A = 200 Ω. Unit labels here are the UI's one-based numbering; source assessment indices start at zero.

The [runtime audit](evidence/runtime.json) exercised numeric correction, accepted decimal/exponent forms, and checked representative input boundaries. It did not establish that the current feedback distinguishes a conversion mistake from a formula mistake. [Revision A](lesson-revisions.md#revision-a-15--calculate-current-from-the-right-voltage) addresses that teaching gap.

## Educational grounding and design choices

[Dunlosky et al. (2013)](https://doi.org/10.1177/1529100612453266) reviews practice testing and distributed practice across learning contexts. It supports giving learners retrieval opportunities separated in time. It does not validate CircuitLab's present question bank, specify optimal PCB review intervals, or prove that a learner can solder or debug from completing it. The [authors' publisher summary](https://www.psychologicalscience.org/journals/pspi/1529100612453266/) was checked and fingerprinted as E1.

[How People Learn II (2018), chapter 7, “Implications for Learning in School”](https://www.nationalacademies.org/read/24783/chapter/9), discusses specific actionable feedback, supported challenge, conceptual models, and assessment aligned with learning goals. Those general principles inform this audit's proposed activities. Its school-focused synthesis is not a trial of this app. E2 in the fetch manifest identifies that chapter; the URL's `/chapter/9` is a site index, not the printed chapter number.

The recommended problem variants, evidence labels, skill groupings, hints, acceptance thresholds, and review intervals remain product decisions. [The beginner pilot](beginner-pilot.md) tests whether those decisions help this audience.

For the physical soldering branch, [HSE's solderer guidance](https://www.hse.gov.uk/asthma/solderers.htm) specifically addresses rosin flux fumes, extraction, avoiding the plume, and avoiding overheating. It is a useful primary supplement to A1. Its occupational setting must be stated; it does not certify a home workstation or replace the selected materials' and equipment's instructions.

## Source ledger to add with revised lessons

Each revised lesson should retain a compact record beside its content:

- The supported claim, source URL, page/section, document revision where present, and checked date.
- The exact component/tool/service scope and conditions that change interpretation.
- The lesson's supplied measurement or simulation assumptions, separately labeled.
- The author-selected target, margin, tolerance, or review interval, separately labeled.
- The artifact version and an independently checked answer key using those assumptions.

For example, “WP7113ID: 1.9 V typical at 10 mA” belongs to C1 page 2 and its conditions. “Use 4 mA as this hypothetical exercise's target” belongs to the lesson's design assumptions. Neither should silently become a guaranteed 4 mA physical circuit. The source link should support the sentence the learner is reading, rather than merely decorate the bottom of the lesson.
