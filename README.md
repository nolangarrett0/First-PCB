# First PCB

An interactive course about how to design, fabricate, assemble, test, and debug a first PCB. Learners can complete it with the guided examples; making a physical board is optional.

The app has a trail-map course path with 56 playable lessons, ten unit checks, and a course review. Each activity gives source-linked instruction, a visual, a practice question, and a saved learner note. Progress and one-time XP awards are stored on this computer; unfinished activities warn before discarding work.

These are guided lessons about the PCB workflow. CAD and bench work can be marked pending, and the app does not inspect real KiCad files or hardware. The lessons explain the process; they do not provide a tested board design or an order-ready parts list. Anyone who chooses to build must verify their exact parts, files, tool instructions, and fabrication rules. See the [lesson quality review](docs/lesson-quality-review.md).

## Windows desktop app

Build a standalone app with `npm run package:win`, or an installer with `npm run installer:win`. The resulting `.exe` is in `release/`. Double-click the portable app to run First PCB without opening a browser. The installed version adds a Start menu entry and desktop shortcut. Course progress is stored locally in the app's Windows profile.

For development, run `npm run desktop` to build and open the Electron app.

## Run in a browser

```powershell
npm install
npm run dev
```

Run `npm run lint`, `npm run check:course`, and `npm run build` to check the project.

## Product direction

- Teach through short, practical challenges tied to one example board.
- Explain electrical claims with links to authoritative sources and component datasheets.
- Give immediate feedback through calculations and, where appropriate, simulation.
- Record first attempts and corrections; revisit ideas in later unit checks.
- Explain schematic and PCB review, fabrication files, assembly, and physical testing; support optional hands-on work.

The researched course blueprint covers 56 lessons across ten units, an assessment after each unit, and a final review centered on the example board and an independent design variation. The current version is suitable for a guided introduction or public beta; a beginner pilot is still needed before claiming proven learning outcomes. A measured reference board is needed only if we later offer exact parts and files as a tested build recipe. See the [curriculum plan](docs/curriculum-plan.md), [lesson quality review](docs/lesson-quality-review.md), [beginner walkthrough audit](docs/course-walkthrough-audit.md), [research and source ledger](docs/research.md), [learning design](docs/learning-design.md), and [engagement and visual learning policy](docs/engagement-and-visuals.md).

## Project guidance

Agent instructions are in [AGENTS.md](AGENTS.md). The UI comparison skill and Git checkpoint workflow are under `.agents/`.
