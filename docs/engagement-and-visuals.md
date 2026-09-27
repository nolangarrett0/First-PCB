# Lesson exit, XP, and visual learning policy

Status: evidence-informed pilot, checked 2026-09-25. This document describes the 56-lesson draft implementation and rules to test with beginners. XP is a participation signal; the learning record remains the evidence of skill.

## What the research supports

| Source | Finding relevant to First PCB | Limit |
| --- | --- | --- |
| [Duolingo's explanation of its app](https://blog.duolingo.com/duolingo-101-how-to-learn-a-language-on-duolingo/) | Duolingo grants XP for completing lessons and other activities, combines it with leaderboards, and lets learners opt out of competition. | This describes Duolingo's current product, not evidence that copying all of its mechanics would teach PCB design. |
| [Sailer and Homner, gamification meta-analysis](https://link.springer.com/article/10.1007/s10648-019-09498-w) | Across included studies, gamification showed positive average effects on cognitive, motivational, and behavioral outcomes. Motivational and behavioral effects were less stable under high-rigor subgroup analysis. | Designs, learners, and subjects varied; the review does not isolate a universal XP formula. |
| [Deci, Koestner, and Ryan, reward meta-analysis](https://selfdeterminationtheory.org/wp-content/uploads/2014/04/1999_DeciKoestnerRyan_Meta.pdf) | Reward design can affect intrinsic motivation; reward type and context matter. | It does not mean all points are harmful or all praise is beneficial. We should measure the actual course effects. |
| [Mayer, multimedia learning review](https://onlinelibrary.wiley.com/doi/10.1111/jcal.12197) | Words paired with relevant graphics can improve learning; signaling, spatial closeness, coherence, and self-paced segments matter. | Adding more decoration is not the same as adding more explanatory visuals. |
| [MDN, `beforeunload`](https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event) | A browser can show a generic confirmation on attempted close/reload when there is unsaved work. | Custom text is not shown by modern browsers, and the event is unreliable on some mobile exits. |

## Current product rules

1. **In-app exit:** once a challenge begins, the close button opens a clear confirmation. The first lesson discards its unfinished attempt. Later activities save draft notes and final-review statuses as the learner types; the current question and place reset on exit. “Keep learning” returns to the same state. Completed lessons and XP remain saved.
2. **Browser close or reload:** while an unfinished attempt exists, register `beforeunload` and request the browser's generic confirmation. Remove the listener on completion or after leaving. This is best-effort, especially on mobile. Do not claim that a warning is guaranteed for every exit route.
3. **XP pilot:** grant **10 XP once per lesson**, **15 XP once per unit check**, and **20 XP once for the final review record**. Saved activity IDs prevent replay from awarding points again. The XP total is personal and visible on the path and result screen. Completion with corrections or pending physical work can still earn XP because it tracks participation, not verified competence.
4. **No XP penalty:** mistakes and retakes do not subtract XP. XP cannot unlock a safety gate, substitute for a measurement, or imply competence.
5. **Visual explanation:** the first lesson shows five SVG stages of the workflow. Later lessons use concept diagrams for the supply, closed loop, voltage measurement, datasheet conditions, board layers, manufacturing files, assembly, diagnosis, and revision. SVGs are accompanied by text and do not carry essential information only through color. These are instructional diagrams, not manufacturing drawings.

## Possible XP extensions

The current app derives XP from unique completed activity IDs. Further rewards should use unique award keys and be tested against actual learning outcomes. Proposed values below are **product choices to pilot**, not research-derived optimal numbers.

| Event | Proposed XP | Guardrail |
| --- | ---: | --- |
| Scheduled retrieval that includes a changed task | 5 | Once per scheduled review, after feedback; do not pay for unlimited repeats. |
| Independently reviewed design or measurement milestone | 15–20 | Only after a reviewer verifies the required artifact or measurement; keep it distinct from the current self-reported record. |
| Unguided transfer challenge | 20 | Requires a changed problem and ordinary skill evidence. |

Keep XP and skill evidence as separate data. A learner may have high XP through practice while still needing review on a skill. Keep the visible goal tied to the board: schematic checked, board inspected, measurement explained. Avoid leaderboards, streak-loss pressure, timed challenges, and bonus multipliers during the beginner pilot. These mechanics can change behavior, and speed or repeated easy tasks are poor proxies for safe hardware decisions. If social features are later considered, make them optional and evaluate them separately.

## How to evaluate the pilot

The main outcome is whether beginners retain and apply the skill, not just whether they stay in the app longer. Compare first-try performance on changed tasks, later retrieval, completion of the physical board, error rates at safety gates, and voluntary return after a break. Also examine abandonment during long CAD/bench tasks and whether the exit warning helps or irritates learners. Keep XP earned and session count as secondary engagement measures. If XP increases activity without improving the board-related outcomes, revise or remove it.

## Visual lesson authoring checklist

For each lesson, choose visuals that answer a concrete question: which parts connect, what changed, where to probe, how a footprint matches a part, or what error the learner should locate. Put labels adjacent to what they name. Highlight one relevant change at a time. Let the learner control animation or step changes. Provide a text description of every essential relationship and never rely on color alone. Avoid decorative circuit art that implies a real topology or rating before the reference design has been checked against datasheets.

For long CAD and bench tasks, draft notes now resume after exit. The current question and position do not resume. A future version should save step-level checkpoints and, if supported, versioned CAD artifact links. The first lesson still saves only on completion and warns accurately about an unfinished attempt.
