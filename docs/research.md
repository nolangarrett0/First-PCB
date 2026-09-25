# Research and source policy

The goal is a learner who can design, fabricate, assemble, and debug a simple PCB. Curriculum claims must be checked before lessons are published.

## Source hierarchy

1. Component behavior and limits: the exact manufacturer's datasheet and application notes.
2. Tool workflows and file formats: current official tool and fabricator documentation.
3. Circuit fundamentals: established engineering courses and textbooks.
4. Teaching methods: peer-reviewed learning research.

Every lesson should record the source URL, the exact claim it supports, the date checked, and any assumptions such as supply voltage, component variant, or tool version. Check calculations independently. Label uncertain or project-specific recommendations as design choices.

## Initial sources

| Source | Use |
| --- | --- |
| [MIT 6.002 syllabus](https://ocw.mit.edu/courses/6-002-circuits-and-electronics-spring-2007/pages/syllabus/) | Sequence of introductory circuit concepts, design, and measurement |
| [KiCad getting started](https://docs.kicad.org/10.0/en/getting_started_in_kicad/getting_started_in_kicad.html) | Schematic, ERC, PCB layout, DRC, and fabrication workflow |
| [KiCad schematic editor](https://docs.kicad.org/10.0/en/eeschema/eeschema.html) | Simulation capabilities and model requirements |
| [Roediger and Karpicke (2006)](https://pubmed.ncbi.nlm.nih.gov/16507066/) | Retrieval practice |
| [Cepeda et al. (2006)](https://pubmed.ncbi.nlm.nih.gov/16719566/) | Distributed practice |

These are starting references, not approval for specific component values or manufacturing instructions. Those need project-specific research and review.

## Research for the full beginner course

Checked 2026-09-25. The companion [curriculum plan](curriculum-plan.md) maps these source codes to each of 56 proposed lessons. The claims below are limited to what each linked source supports. Where the source is a textbook or guide, the app will write its own explanations and examples rather than copy large passages or images.

### Source ledger

| Code | Primary or direct source | What it supports | Boundary for course content |
| --- | --- | --- | --- |
| F1 | [OpenStax College Physics 2e, 20.2: Ohm’s law and simple circuits](https://openstax.org/books/college-physics-2e/pages/20-2-ohms-law-resistance-and-simple-circuits) | Closed path, voltage source, resistance, Ohm’s law for ohmic materials | An LED is non-ohmic; do not apply `I = V/R` across an LED as if it were a resistor. |
| F2 | [OpenStax University Physics 2, 10.2: series and parallel](https://openstax.org/books/university-physics-volume-2/pages/10-2-resistors-in-series-and-parallel) | Same current in a series path; voltage and current relationships in simple branches | Course needs only basic cases required to identify opens, shorts, and the LED series path. |
| F3 | [OpenStax College Physics 2e, 20.4: electric power](https://openstax.org/books/college-physics-2e/pages/20-4-electric-power-and-energy) | `P = IV`, `P = I²R`, and `P = V²/R` for suitable components | A resistor’s actual rated power still comes from its own datasheet. |
| F4 | [MIT 6.002 course and syllabus](https://ocw.mit.edu/courses/6-002-circuits-and-electronics-spring-2007/) | Circuit models, analysis, design, and lab measurements belong together in an introductory course | MIT’s full EE course is broader and more mathematical than this first-PCB mission. The sequence here is a product design choice. |
| C1 | [Kingbright WP7113ID LED datasheet, Rev. 14A](https://www.kingbrightusa.com/images/catalog/SPEC/WP7113ID.pdf) | Candidate 5 mm red LED: package drawing, polarity, current limits; 1.9 V typical and 2.3 V maximum forward voltage specified at **10 mA** and 25 °C | The forward voltage is condition-dependent. The graph is typical, not a guaranteed min/max at every current. Do not prescribe an exact resistor based only on one typical point. Check availability and physical footprint before approval. |
| C2 | [Energizer E91 AA alkaline datasheet](https://data.energizer.com/pdfs/e91.pdf) | Candidate cell: alkaline chemistry, 1.5 V nominal, discharge curves and dimensions | Two cells make a 3 V *nominal* pack. Actual loaded voltage depends on state, load, temperature, and cells. Do not assume 3.000 V in an assessment or design limit. |
| B1 | [Adafruit Breadboards for Beginners](https://learn.adafruit.com/breadboards-for-beginners/breadboards) | Internal terminal strips, power rails, and the possibility of split rails | The learner must inspect or test their specific breadboard; a generic drawing cannot establish its rail continuity. |
| B2 | [Energizer battery care](https://energizer.com/about-batteries/battery-care/) and [alkaline safety data](https://data.energizer.com/pdfs/alkaline-12-23-Energizer.pdf) | Avoid shorts, reversed installation, mixed cells, recharging primary cells, and soldering directly to cells | Low voltage does not make an accidental battery short harmless. The course uses a holder and removes cells for assembly and continuity tests. |
| B3 | [Energizer electricity experiments](https://energizer.com/science-center/the-principles-of-electricity/) | Low-voltage battery-powered experiments and battery precautions | This supports the conservative project scope, not a blanket safety certification for arbitrary circuits. |
| K1 | [KiCad 10 introduction](https://docs.kicad.org/10.0/en/introduction/introduction.html) | Current project/tool concepts: schematic, PCB, footprint, Gerber viewer, integrated workflow | Lock lesson screenshots and steps to the KiCad version actually used; old tutorials may describe obsolete netlist steps. |
| K2 | [KiCad 10 Getting Started](https://docs.kicad.org/10.0/en/getting_started_in_kicad/getting_started_in_kicad.html) | End-to-end schematic, ERC, update PCB, layout, DRC, 3D view, Gerber and drill generation | KiCad states ERC cannot ensure the circuit works. Examples in its tutorial are not automatically suitable for this course’s exact parts. |
| K3 | [KiCad 10 Schematic Editor manual](https://docs.kicad.org/10.0/en/eeschema/eeschema.html) | Symbols, pins, nets, footprints, ERC, and integrated ngspice simulation | Simulation needs suitable models and does not replace measurements. Do not make SPICE a core gate for this simple first board. |
| K4 | [KiCad 10 PCB Editor manual](https://docs.kicad.org/10.0/en/pcbnew/pcbnew.html) | Board setup, routing, footprint handling, DRC, schematic parity, fabrication exports | DRC checks configured rules and connectivity. It does not prove the schematic’s intent, part selection, board usability, or assembly quality. |
| K5 | [KiCad 10 GerbView manual](https://docs.kicad.org/10.0/en/gerbview/gerbview.html) | Independent inspection of Gerber and Excellon drill files | Viewing files is an additional review, not a manufacturing guarantee. |
| P1 | [JLCPCB KiCad Gerber/drill preparation](https://jlcpcb.com/help/article/how-to-generate-gerber-and-drill-files-in-kicad-8), [capabilities](https://jlcpcb.com/capabilities/Capab), and [Gerber preparation](https://jlcpcb.com/help/article/gerber-files-preparation) | Example fabricator documentation: set rules before routing, export and inspect outline/layers/drills, confirm capabilities | Vendor pages and requirements can change. KiCad 8-specific instructions must not be copied into a KiCad 10 lesson without checking. The learner may choose another fabricator. No numeric minimum is locked here. |
| M1 | [Adafruit multimeter guide](https://learn.adafruit.com/multimeters?view=all) | DC voltage measurement, current measurement in series with the correct jack, unpowered continuity/resistance checks, meter fault patterns | Meter models differ. Each physical lesson must show the learner how to consult their own meter manual; the core design can infer current from resistor voltage instead of requiring current mode. |
| A1 | [Adafruit soldering tools and safety](https://learn.adafruit.com/adafruit-guide-excellent-soldering) | Stable iron stand, tools, ventilation, appropriate electronics solder and preparation | Do not turn a short checklist into a guarantee of safety. Local instruction and the solder/iron manufacturers’ directions still apply. |
| A2 | [Adafruit: making a good solder joint](https://learn.adafruit.com/adafruit-guide-excellent-soldering/making-a-good-solder-joint) | Heat pad and lead, flow solder into joint, cool without movement, trim through-hole leads | Part datasheets may limit soldering time and temperature; check selected parts. |
| A3 | [Adafruit: common soldering problems](https://learn.adafruit.com/adafruit-guide-excellent-soldering/common-problems) | Visual recognition and correction of disturbed, cold, and other poor joints | A photo cannot prove an invisible connection is sound; use continuity and functional tests too. |
| E1 | [Roediger and Karpicke (2006)](https://pubmed.ncbi.nlm.nih.gov/16507066/) | Retrieval testing can improve delayed retention compared with rereading in studied material | It does not establish that a PCB learner should receive a specific daily streak or exact quiz count. |
| E2 | [Cepeda et al. (2006)](https://pubmed.ncbi.nlm.nih.gov/16719566/) | Distributed practice generally improves retention in verbal recall studies; interval and desired retention period interact | Specific review timing for electronics tasks needs testing; do not claim an optimal fixed interval. |
| E3 | [Hattie and Timperley (2007)](https://journals.sagepub.com/doi/10.3102/003465430298487) | Feedback should help learners understand task performance and next action | The app’s explanation format is an instructional design choice to evaluate with learners. |

### Verified findings and curriculum consequences

1. **The first project can have a real endpoint without becoming an entire EE survey.** OpenStax supports the core current/voltage/resistance relationships [F1–F3]. MIT’s introductory course shows analysis, design, and measurement as connected activities [F4]. We use just enough of those fundamentals to reason about the selected board.
2. **The part data cannot be compressed to “an LED drops 2 V.”** The candidate LED’s stated forward voltage is tied to 10 mA and 25 °C [C1]. The app must display test conditions and uncertainty. The battery’s 1.5 V figure is nominal [C2]. This is why the final resistor is a design review gate, not an answer copied from the HTML comparison preview.
3. **A rule-check pass is necessary but incomplete.** KiCad distinguishes schematic ERC, board DRC, and visual review [K2–K4]. The curriculum therefore has separate logical, physical, and fabrication-output inspections.
4. **The learner needs physical feedback.** Bench measurement exposes incorrect assumptions and assembly errors that a calculator or simulation can miss [M1]. Physical results are learner-reported until reviewed; calculations can be checked by the app.
5. **Learning needs later retrieval and new contexts.** The research supports revisiting ideas after a delay [E1, E2], and feedback that points to the next correction [E3]. It does not support treating streaks, completion clicks, or a rigid interval as mastery.

### Reference-design decisions and unresolved work

| Decision / question | Current position | Required evidence before release |
| --- | --- | --- |
| Supply | Two **alkaline** AA cells in an external holder; no soldering directly to cells | Exact holder/connector datasheets, polarity scheme, measured fresh-cell range, and reference build test [C2, B2] |
| LED | Candidate: Kingbright WP7113ID red through-hole LED | Exact package/footprint match, purchase availability, bench check of visible brightness at proposed current, and worst-case current analysis [C1] |
| Resistor | Choose after LED current target and operating range are reviewed | Exact resistance, tolerance, package, power rating, manufacturer datasheet, and worst-case calculations [F1, F3, C1, C2] |
| Switch | Simple mechanical on/off in series | Exact part, contact behavior/rating, pinout, package, footprint, orientation, and assembly test |
| Battery connection | Off-board holder with appropriately retained connection | Connector or wire-entry part, strain relief plan, polarity markings, and short-prevention check |
| PCB | Two copper layers, through-hole hand assembly | Exact fabricator rules, verified board dimensions, clearances, drill sizes, outline, Gerber/drill inspection [K4, K5, P1] |
| Soldering | Beginner through-hole work; practice on scrap first | Selected solder and iron instructions, part soldering limits, clear ventilation and hot-tool procedure [A1–A3, C1] |
| Meter | DC voltage and unpowered continuity are required; current is inferred from resistor drop | Specific meter manual or a general workflow that makes learners verify jacks, modes, and range [M1] |
| Software | KiCad 10 is the planning target as of this check | Recheck the current stable release and all screenshots/menu steps before writing tool lessons [K1–K5] |
| Fabricator | Vendor-neutral principles, with one documented example if useful | Choose a vendor only for a tested reference order; recheck capabilities and order flow at publication [P1] |

### Source approval process for each publishable lesson

For every factual claim: save the claim, direct source URL, document title/revision, exact page/section or data-sheet condition, check date, and reviewer. For every calculation: save inputs, units, assumptions, expected range, and an independent second calculation. Label design choices separately. If source and lesson disagree after a tool or part revision, withdraw the lesson from release until corrected. Preserve the old source revision with the old design record so a learner can understand a previous board.

No physical instructions should go live solely because they passed an app test. The reference circuit should be built, measured, assembled on the designed PCB, and intentionally fault-tested by the course team before learners are asked to order it.
