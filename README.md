# CircuitLab

An interactive learning app for going from circuit fundamentals to a fabricated, assembled, and tested PCB.

The app has a trail-map course path with 56 playable lessons, ten unit checks, and a final design review. Each activity gives source-linked instruction, a visual, a practice question, and a saved learner note. Progress and one-time XP awards are stored on this computer; unfinished activities warn before discarding work.

These are guided course drafts. CAD and bench notes are self-reported, and the app has not inspected real KiCad files or a physical board. Exact components, fabrication rules, and a measured reference build still need engineering review before the physical instructions can be considered validated. See the [walkthrough audit](docs/course-walkthrough-audit.md).

## Windows desktop app

Build a standalone app with `npm run package:win`, or an installer with `npm run installer:win`. The resulting `.exe` is in `release/`. Double-click the portable app to run CircuitLab without opening a browser. The installed version adds a Start menu entry and desktop shortcut. Course progress is stored locally in the app's Windows profile.

For development, run `npm run desktop` to build and open the Electron app.

## Run in a browser

```powershell
npm install
npm run dev
```

Run `npm run lint`, `npm run check:course`, and `npm run build` to check the project.

## Product direction

- Teach through short, practical challenges that contribute to a real board.
- Explain electrical claims with links to authoritative sources and component datasheets.
- Give immediate feedback through calculations and, where appropriate, simulation.
- Track demonstrated skills and revisit them over time.
- Finish with schematic and PCB review, fabrication files, assembly, and physical testing.

The researched course blueprint covers 56 lessons across ten units, an assessment after each unit, and a final design review centered on a built and tested first board and an independent design variation. The implemented lessons remain drafts until their source claims, reference hardware, and beginner outcomes are reviewed. See the [curriculum plan](docs/curriculum-plan.md), [beginner walkthrough audit](docs/course-walkthrough-audit.md), [research and source ledger](docs/research.md), [learning design](docs/learning-design.md), and [engagement and visual learning policy](docs/engagement-and-visuals.md).

## Project guidance

Agent instructions are in [AGENTS.md](AGENTS.md). The UI comparison skill and Git checkpoint workflow are under `.agents/`.
