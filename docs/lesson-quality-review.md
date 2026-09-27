# Lesson quality review

Reviewed 2026-09-27 for the **conceptual learning course**. The optional physical build is a separate activity. This review covers the 56 lesson screens, 30 unit-check questions, the final course review, source links, and the full in-app path.

## What a useful beginner lesson needs

- **Start from prior knowledge and define new terms.** Prior knowledge affects how much attention a learner needs for new material ([National Academies, *How People Learn II*](https://www.nationalacademies.org/read/24783/chapter/7)). In this app, each lesson introduces the few terms needed for its task before practice.
- **Show a worked example, then change the case.** Studying examples helps novices learn problem-solving procedures ([van Gog, Kester, and Paas, 2011](https://eric.ed.gov/?id=EJ927458)). The learner should then apply the idea to different values, a different connection, or a different fault. The example should explain the decision, not state the later answer.
- **Make practice diagnostic.** Questions should expose a likely misconception or calculation error, not ask learners to repeat a noun from the preceding sentence. Formative assessment is useful when feedback shows where the learner is relative to the target and helps them revise ([National Academies, *How People Learn II*, chapter 8](https://www.nationalacademies.org/read/24783/chapter/9)).
- **Revisit ideas later.** Practice testing and distributed practice have evidence for improving retention across many settings ([Dunlosky and colleagues, 2013](https://www.psychologicalscience.org/publications/journals/pspi/learning-techniques.html)). The unit checks revisit earlier lessons; the app does not yet schedule later sessions or claim to measure long-term retention.

These sources support the lesson design choices. They do not prove that this particular course improves a beginner’s learning.

## Findings and changes

| Finding in the previous draft | Change made |
| --- | --- |
| 44 of 55 post-intro lesson answers were in the first position and none in the third. | The answer order now varies deterministically by activity and question; correctness still uses the original answer key. |
| Many alternatives were implausible, such as changing a board color when a drill was missing. | Rewrote 38 lesson questions or answer sets around plausible mistaken decisions, then reviewed the unchanged questions for a clear target and distinct alternatives. |
| Wrong-answer feedback often repeated the correct-answer explanation without addressing the selected mistake. | Added a specific correction for every wrong multiple-choice option in all 48 nonnumeric lessons and all 30 unit questions. Numeric questions retain their calculation and unit explanation. |
| Five unit checks repeated a decision already tested within the same unit. | Replaced these with resistor-power, exported-silkscreen, in-circuit continuity, current-inference, and revised-resistor cases. |
| Several lesson questions reused the worked example’s exact situation or answer. | Changed the loop, probe, resistance, meter-sign, current, vendor-preview, diagnostic, and design-claim cases. |
| Every ordinary activity required a 12-character note after a correct answer, inviting filler. | Notes are now optional for lessons and unit checks. The answer remains recorded; optional hands-on claims are self-reported. The final course review still asks for a written summary. |
| A completion record could not distinguish an answer reached on the first attempt from one corrected with feedback. | Each lesson and unit check now saves first-attempt correctness for each question and retains that history when the learner revisits the activity. The app still calls this practice, not mastery. |
| The continuity lesson treated a beep between differently named nets as if it identified a solder bridge. | It now teaches that the meter reports a low-resistance path, which may run through an installed component, and asks the learner to trace the circuit before diagnosing a bridge. [Fluke’s continuity guide](https://www.fluke.com/en-gb/learn/blog/digital-multimeters/how-to-test-for-continuity) supports the power-off and path interpretation. |

## Source and software checks

All 17 lesson-source URLs were opened during this review. The central example claims were checked against the linked primary sources: the [Kingbright WP7113ID datasheet](https://www.kingbrightusa.com/images/catalog/SPEC/WP7113ID.pdf) states 1.9 V typical and 2.3 V maximum forward voltage **at 10 mA**; the [Energizer E91 datasheet](https://data.energizer.com/pdfs/e91.pdf) gives **1.5 V nominal** per cell; the [KiCad 10 guide](https://docs.kicad.org/10.0/en/getting_started_in_kicad/getting_started_in_kicad.html) describes the schematic-to-board-to-fabrication workflow; and the [KiCad PCB editor manual](https://docs.kicad.org/10.0/en/pcbnew/pcbnew.html) describes configured DRC and schematic-parity checks. [Energizer battery care](https://energizer.com/about-batteries/battery-care/) supports the short-circuit warning, and [Fluke](https://www.fluke.com/en-gb/learn/blog/digital-multimeters/how-to-test-for-continuity) says to de-energize the circuit for continuity tests. Exact part choices and an order-ready design are outside this course.

The course data check validates every lesson ID, teaching article, source link, answer key, numeric answer, and choice-specific correction. `npm run lint`, `npm run check:course`, and `npm run build` pass. An isolated headless browser run completed the 55 post-intro lessons, ten three-question checks, and the final review, including wrong-answer corrections, blank optional notes, and local progress persistence. A separate replay checked that first-attempt history records both an initial mistake and later success. The revised reading and practice screens were also checked at 390 px width without horizontal overflow. The custom first lesson was exercised in the earlier [walkthrough audit](course-walkthrough-audit.md).

## Publication claim

The app can be offered as a **guided introductory course or public beta** about the PCB workflow. It should not claim that completion proves the learner can independently design a manufacturable PCB, that a board has been physically tested, or that long-term learning has been established. A short observation with new beginners is still the direct way to find misunderstood terms, misleading diagrams, and questions answerable by guessing. Their results should guide subsequent revisions.
