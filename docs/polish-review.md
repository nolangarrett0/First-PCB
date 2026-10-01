# Beginner experience and polish review

Reviewed 2026-09-30. This pass covers the in-app course, diagram models, browser interactions, responsive layout and Electron runtime. It preserves lesson IDs, task answers, saved records and the existing visual direction.

## Changes

| Area | Problem found | Result |
| --- | --- | --- |
| First action | The next activity shortcut disappeared when the right sidebar was hidden. | The main course header now has a start, continue or resume button on every screen size. |
| Lesson navigation | Only the small round icon opened a lesson. | The entire lesson row, including its title, opens the activity. Locked rows remain disabled. |
| Course sequence | Capacitors, transistors and chips interrupted the LED fundamentals before symbols and series connections. | The opening order is E.1, E.2, E.3, E.4, E.8, E.9, then E.5–E.7. The last three are clearly described as knowledge for other boards. Stable IDs preserve earlier work. |
| Early vocabulary | The first circuit drawing introduced anode/cathode before the diode lesson. PCB and CAD were absent from the glossary. | The first two circuit drawings use component names; polarity labels appear after the polarity lesson. PCB and CAD have definitions, and conventional current is explained before its diagram arrow is used. |
| Lesson orientation | An unlabeled progress bar and lesson codes gave little indication of the learner's place. | Lessons show their position within the unit and the current learn, practice or finish step. |
| Worked examples | Ordering explanations described dependencies without spelling out the actual order. Help displayed a general paragraph instead of a solved case. | Worked examples show the exact order or selected choice, calculation workings, selected points, and modeled observations at the appropriate step. Practice help opens a different solved case and records support use. |
| Label explanations | Diagram and lesson labels need the same meanings even when a worked case mentions only some components. | A shared label key covers the lesson text and visible diagram labels beside the worked example. |
| Circuit drawings | Unintended gaps appeared at LED and battery symbol connections, including a drawing described as a complete loop. | Symbol leads meet their intended terminals. Deliberate open faults remain visible. Switch contacts and the LED return path are clear. |
| Requested endpoints | The meter lesson lacked a visible cue for its named connection. | Amber rings identify the requested terminals; blue outlines identify selected points. |
| Breadboard | A jumper crossed rows in a way that could suggest unintended intermediate connections. The diagram also allowed selections absent from the answer list. | The jumper follows a clear path around the strips. Interactive points match the named answer choices. |
| Switch interaction | The contact diagram could not be used to answer its point-selection task. | Both mouse and keyboard selection update the same named switch contacts as the checkboxes. |
| Repeated tests | Clicking the diagram always edited the original endpoint answer. | Newly revealed endpoint questions receive diagram selections, with an explicit control to choose a different question. The previous setup remains intact. |
| PCB layers | Layer views needed a clear explanation of active features versus positional context. A placement label overlapped a candidate label. | Each layer has a visual legend; reference pads on outline and silkscreen views are pale. Placement labels do not overlap. Enlarged comparisons use the available width. |
| Diagram accessibility | A resolved junction retained an accessible description saying its dot was missing. The station's iron stand had a black fill behind its label. | The junction description reflects its state. The stand and its label are readable. |
| Answer checking | Invalid number entry left a disabled button unexplained. Failed submissions could leave an enabled check button that did nothing. Feedback could be above the viewport. | Missing answers and invalid numbers receive guidance. After checking, focus moves to a feedback summary. A retry requires an edited answer. |
| Number presentation | Pin numbers displayed a quantity unit, and some voltage tables displayed floating-point artifacts. | Pin questions have a pin-number field. Displayed decimals are readable while stored values, case identity and filenames remain unchanged. |
| Reference | A search with no matches left an empty panel. Background scrolling remained possible behind the dialog. | The glossary explains an empty search, and closing the dialog restores scrolling and focus. |
| Readability | Small, pale trail text made future lessons difficult to scan. | Lesson titles and supporting text are more readable. Reduced-motion preferences are respected. |

## Teaching and source checks

The project sequence still follows electronics fundamentals, preparation and safety, circuit calculations, part selection, prototyping and measurements, schematic review, PCB layout, fabrication review, assembly, diagnosis, and a changed design. Changed cases, corrections, spaced reviews and demonstrated-skill records remain in place.

The schematic-to-PCB workflow and pad/track descriptions were checked against the [KiCad 10 getting-started guide](https://docs.kicad.org/10.0/en/getting_started_in_kicad/getting_started_in_kicad.html). Layer explanations were checked against the [PCB editor documentation](https://docs.kicad.org/10.0/en/pcbnew/pcbnew.html). Series-current and parallel-voltage relationships were checked against [OpenStax](https://openstax.org/books/university-physics-volume-2/pages/10-2-resistors-in-series-and-parallel).

The existing red LED exercise's 1.9 V typical and 2.3 V maximum forward-voltage values retain their 10 mA and 25 °C conditions, matching the electrical-characteristics table in [Kingbright WP7113ID revision V.14A](https://www.kingbrightusa.com/images/catalog/SPEC/WP7113ID.pdf). Source links and the distinction between source facts and teaching assumptions remain attached to the exercises.

## Verification

The final checks are summarized in the [verification record](learning-audit/evidence/polish-verification.json), with detailed polish output in `ui-previews/polish/verification.json`:

- `npm run lint`, `npm run check:course`, `npm run test:learning`, and `npm run build`.
- `npm run test:ui`: all 65 lessons, 11 unit checks and the six-task final review; mistakes, corrections, saved drafts, notes, backups, reviews and storage failure.
- `npm run test:language`: all 65 rendered lesson readings, inline label definitions, glossary searches and 390 px layout.
- `npm run test:recovery`: saved partial input, mid-check resume, enlarged diagrams, final statuses, unreadable records and session-only recovery.
- `npm run test:desktop`: hidden Electron window and separate temporary profile; production images, external sources, JSON download, legacy migration, reload and native close behavior.
- `npm run test:polish`: start/resume, diagram selection, keyboard controls, worked help, numeric guidance and reference behavior; 430 diagram/variant/layer views at 320 and 1280 px without page overflow or clipped/overlapping SVG labels.

`scripts/audit-polish.mjs` also captures every lesson's worked diagram and reports label overlaps for visual inspection. Review captures are in the ignored `ui-previews/polish/` directory. Tests use isolated records and profiles.

These checks verify the software and the reviewed explanations. Observed beginner use and a measured reference hardware build are still needed to establish learning outcomes and a validated physical build recipe; see the existing [beginner pilot plan](learning-audit/beginner-pilot.md). The course continues to label physical work as optional and self-reported.
