# First PCB

An interactive course about how to design, fabricate, assemble, test, and debug a first PCB. Learners can complete it with the guided examples; making a physical board is optional.

The opening chapter teaches circuits, voltage/current, resistors, LEDs, drawing labels, and series/parallel connections before introducing capacitors, transistors, and chips.

Symbols and the complete LED path now precede the introductions to other component families. The [polish review](docs/polish-review.md) records the navigation, teaching, diagram and interaction improvements and their checks.

The app has a trail-map path with 65 lessons, eleven integrated unit checks, and a six-task changed-design review. Learners select actual connection points, calculate with units, inspect layer comparisons, extract part data, sort procedures, and plan safe tests before seeing modeled results. Specific feedback leads to a changed case after corrections. The existing interface has been extended with a searchable reference, skill reviews, and readable learning records.

Answers, mistakes, support, prior case exposure, drafts, notes, and optional work records are saved locally. Old progress is migrated conservatively. A fresh correct task is recorded separately from corrected or repeated practice; XP rewards participation. JSON export/import provides backups, and storage failures explicitly identify work held only in the current session.

These are guided lessons about the PCB workflow. CAD and bench work can be marked pending, and the app does not inspect real KiCad files or hardware. The lessons explain the process; they do not provide a tested board design or an order-ready parts list. Anyone who chooses to build must verify their exact parts, files, tool instructions, and fabrication rules. See the [beginner course review](docs/beginner-course-review.md) and [lesson quality review](docs/lesson-quality-review.md).

## Windows desktop app

Build a standalone app with `npm run package:win`, or an installer with `npm run installer:win`. The resulting `.exe` is in `release/`. Double-click the portable app to run First PCB without opening a browser. The installed version adds a Start menu entry and desktop shortcut. Course progress is stored locally in the app's Windows profile.

For development, run `npm run desktop` to build and open the Electron app.

## Run in a browser

```powershell
npm install
npm run dev
```

Run `npm run lint`, `npm run check:course`, `npm run test:learning`, and `npm run build` to check the project. Use Node 24 or later for the TypeScript data tests.

`npm run test:polish` checks the beginner controls and all diagram families across five variants and the layer views at phone and desktop widths. Set `LEARNING_TEST_URL` to the local preview URL; captures and its verification report are written to `ui-previews/polish/`.

For isolated browser tests, install Chromium once with `npx playwright install chromium`. Start `npm run preview -- --host 127.0.0.1 --port 5174 --strictPort` after building, then run `$env:LEARNING_TEST_URL='http://127.0.0.1:5174'; npm run test:ui` in another PowerShell window. `npm run test:language` checks all 65 rendered lesson readings and the beginner label explanations. `npm run test:recovery` checks resume and storage recovery after the UI test creates its synthetic baseline. `npm run test:desktop` checks the built app in a hidden Electron window with a separate temporary profile. Neither test uses your real learning records. Stop the preview server afterward.

## Product direction

- Teach through short, practical challenges tied to one example board.
- Explain electrical claims with links to authoritative sources and component datasheets.
- Give immediate feedback through calculations and, where appropriate, simulation.
- Record first attempts and corrections; revisit ideas in later unit checks.
- Explain schematic and PCB review, fabrication files, assembly, and physical testing; support optional hands-on work.

The current curriculum implements the [learning-audit improvements](docs/learning-audit/implementation.md). Version 0.3.1 is a public beta with the recorded software checks. A [beginner pilot](docs/learning-audit/beginner-pilot.md) is still needed before claiming proven learning outcomes, and the KiCad procedures need an observed beginner walkthrough. An exact purchasing/manufacturing recipe requires selected parts, real CAD/output checks, and a measured reference build; the present SVG models do not supply that validation. See the [curriculum plan](docs/curriculum-plan.md), [research](docs/research.md), [learning design](docs/learning-design.md), and [engagement policy](docs/engagement-and-visuals.md).

## Project guidance

Agent instructions are in [AGENTS.md](AGENTS.md). The UI comparison skill and Git checkpoint workflow are under `.agents/`.
