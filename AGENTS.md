# CircuitLab agent instructions

- The product goal is to teach a beginner to design, fabricate, assemble, and debug a simple PCB.
- Ground electrical and PCB teaching claims in reputable sources. Prefer official tool documentation, component datasheets, standards, and established course material. Keep source links with lesson content and distinguish verified facts from design choices.
- Use ideas from Matt Pocock's `teach` skill: short lessons tied to the learner's mission, immediate practice feedback, spaced retrieval, and learning records based on demonstrated ability. Deliver lessons in the app; standalone HTML is only for UI previews.
- Before a major UI change, ask if the owner wants five options. If yes, use `.agents/skills/compare-ui-options/SKILL.md` and wait for a choice.
- Keep interface text useful to the task. Avoid decorative captions and quips.
- For HTML prototypes, serve the file locally, verify it loads, and provide a clickable link. Keep preview servers running during review, then stop them.
- Use SVG icons. Give icon buttons fixed dimensions and centered content.
- Test new interactions and reported UI bugs in an isolated headless browser. If a desktop app is added, check desktop-only behavior in its runtime. Do not use Computer Use.
- Stop app development servers before handoff. If port 1420 is used, verify it is free.
- For “git checkpoint,” follow `.agents/workflows/git-checkpoint.md`.
- Before editing this file later, show a short draft and wait for approval.
