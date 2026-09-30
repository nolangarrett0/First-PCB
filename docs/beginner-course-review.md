# Beginner course review — 2026-09-30

The course promised no prior electronics experience but started assessing electrical terminology and pin mappings before explaining the parts. The rendered reading also omitted each lesson’s main explanation. This revision adds an opening electronics chapter and rewrites the instructions for all 56 existing lessons.

| Finding | Change in the app |
| --- | --- |
| Resistor, diode, transistor, and chip knowledge was assumed. | Nine opening lessons teach circuits, voltage/current, resistors, diodes/LEDs, capacitors, transistors, ICs, drawing labels, and series/parallel paths. Each has an SVG diagram, immediate feedback, and changed practice. |
| The main lesson summary existed in data but was never rendered. | Show “The idea” before vocabulary and instructions. |
| The written worked example and the displayed diagram could describe different cases. | Use the displayed case’s context and answers together. Open the walkthrough initially so its reasoning is visible. Keep the practice case distinct and record example exposure. |
| Instructions used dense shorthand and vague references such as “this intended connection.” | Rewrite all 56 procedures. Name the part, terminal, row, layer, or output and explain the action and interpretation. Teach reference labels before introducing the project. |
| Expanding an already explained label could create “switch (switch (S1))”; one instruction became “resistor pins resistor pin 1 …”. | Preserve labels already paired with a name and edit redundant prose. Keep actual file names and stored answers intact. |
| Numeric feedback gave the answer without showing the arithmetic. | Show unit conversions, voltage subtraction, division, power calculations, and resistance-tolerance bounds for the calculation lessons and changed final calculations. |
| Some soldering summaries were less precise than the detailed instructions. | Specify appropriate local fume extraction; remove dullness as a standalone joint-quality criterion. |
| Course counts and check identities assumed ten units. | Derive displayed counts from the curriculum. Add `unit-basics` while retaining `unit-0` through `unit-9`, existing lesson IDs, saved notes, drafts, and awards. |
| New source domains would have been blocked in Electron. | Add the specific SparkFun and onsemi hosts to the existing external-link allowlist and verify all 33 source links in the desktop runtime. |

The course now has **65 lessons, 11 unit checks, and one final review**. Capacitors, transistors, and ICs teach component recognition and vocabulary; the first PCB remains the manually switched LED project. Physical pin orders, hypothetical chip specifications, visibility observations, and fabrication exercise limits are explicitly tied to their examples.

## Sources for the opening chapter

| Topic | Source and scope |
| --- | --- |
| Circuits and component roles | [SparkFun Education: What is a circuit?](https://blog.sparkfuneducation.com/what-is-a-circuit). Closed paths, loads, and shorts. |
| Voltage, current, resistance | [SparkFun’s introductory lesson](https://learn.sparkfun.com/tutorials/voltage-current-resistance-and-ohms-law) and [OpenStax’s Ohm’s law chapter](https://openstax.org/books/college-physics-2e/pages/20-2-ohms-law-resistance-and-simple-circuits). Use resistor voltage in the resistor calculation. |
| Resistors | [SparkFun: Resistors](https://learn.sparkfun.com/tutorials/resistors/all?print=1). Resistance, current limiting, units, and symbols. |
| Diodes and LEDs | [SparkFun: Diodes](https://learn.sparkfun.com/tutorials/diodes) and [Kingbright WP7113ID](https://www.kingbrightusa.com/images/catalog/SPEC/WP7113ID.pdf). Symbol terminology versus exact physical polarity. |
| Capacitors | [SparkFun: Capacitors](https://learn.sparkfun.com/tutorials/capacitors/all) and [OpenStax: Capacitors and dielectrics](https://openstax.org/books/college-physics-2e/pages/19-5-capacitors-and-dielectrics). Storage, capacitance, polarity, and rating distinctions. |
| Transistors | [SparkFun: Transistors](https://learn.sparkfun.com/tutorials/transistors/all), [SparkFun’s schematic guide](https://learn.sparkfun.com/tutorials/how-to-read-a-schematic/), and [onsemi 2N3903/2N3904 datasheet](https://www.onsemi.com/pdf/datasheet/2n3903-d.pdf). Control-terminal names and a manufacturer-specific pin map. No universal turn-on voltage or physical pin order is prescribed. |
| ICs | [SparkFun: Integrated circuits](https://learn.sparkfun.com/tutorials/integrated-circuits/all). Chip functions and package/pin distinctions; practice pin maps and supply ranges are hypothetical. |
| Drawing labels and connections | [SparkFun’s schematic guide](https://learn.sparkfun.com/tutorials/how-to-read-a-schematic/) and the existing [KiCad schematic documentation](https://docs.kicad.org/10.0/en/eeschema/eeschema.html). Reference labels, junctions, and connection names. |
| Series and parallel | [OpenStax: Resistors in series and parallel](https://openstax.org/books/university-physics-volume-2/pages/10-2-resistors-in-series-and-parallel). Equal series current and equal parallel endpoint voltage. |

New source metadata records the checked date, supported claims, and the boundary between documented facts and teaching assumptions. SparkFun material was reviewed through indexed excerpts from the original publisher; full-page retrieval returned HTTP 403 in the web tool. The onsemi manufacturer PDF was retrieved directly. Earlier project-source reviews remain in [source-review.md](learning-audit/source-review.md).

## Verification

- Course contracts: all 65 lessons, their changed cases, eleven integrated checks, final tasks, and source metadata match the curriculum.
- Learning tests: calculations, unit mistakes, example-exposure identities, saved records, legacy migration, review scheduling, and new chapter/check identity preservation.
- Isolated headless browser: all 77 activities, wrong submissions, corrections, changed follow-ups, notes, backup/import, glossary, source entries, and 320/390/1280 px layouts.
- Language check: all 65 lesson readings explain their labels; diagrams, endpoint choices, and glossary render in the app.
- Recovery check: unfinished answers and units, chapter-check position, photograph labels, final-review statuses, unreadable original data, and due reviews survive the relevant reload/export flows.
- Desktop runtime: all 33 source links, production images, earlier records, backup download, native close choices, and exact saved-case resume.
- Build and lint.

Runtime evidence is stored in [learning-audit/evidence](learning-audit/evidence). Representative readings: [opening circuit lesson](learning-audit/evidence/electronics-reading-E.1.png), [transistors](learning-audit/evidence/electronics-reading-E.6.png), and [mobile transistor lesson](learning-audit/evidence/electronics-transistors-mobile.png). These checks verify implemented behavior and content consistency; no new beginner pilot was conducted during this review.
