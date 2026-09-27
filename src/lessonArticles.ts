export type LessonArticle = {
  terms: [term: string, meaning: string][]
  workedExample: string
}

// The existing lesson summary supplies the main idea. Each entry introduces the
// vocabulary needed for practice and works through a different case first.
export const lessonArticles: Record<string, LessonArticle> = {
  '0.2': {
    terms: [
      ['Power source', 'The part that supplies electrical energy. This course uses two AA cells in a removable external holder.'],
      ['Short circuit', 'An unintended low-resistance path that can let too much current flow.'],
      ['Continuity', 'A check for an electrical connection. Use the meter’s continuity setting only with power removed.'],
    ],
    workedExample: 'Suppose the assembled board needs an unpowered short check. Take both cells out of the holder before placing the meter probes on the supply contacts. An OFF switch alone does not remove power from every part of the board.',
  },
  '0.3': {
    terms: [
      ['Jumper wire', 'A short removable wire used to connect points on a breadboard.'],
      ['Breadboard', 'A reusable board with groups of holes joined inside, so you can test a circuit without soldering.'],
      ['Meter probes', 'The two pointed leads of a multimeter; place them on the two points you want to compare.'],
      ['Continuity mode', 'A meter setting that checks whether two points have a low-resistance connection. Use it with the cells removed.'],
    ],
    workedExample: 'Suppose a jumper should join two breadboard rows. Remove the cells, set the meter to continuity, and touch one probe to each end of that intended path. A beep or low reading suggests a connection; no beep means you should inspect the wire and rows. DC voltage mode answers a different question: the voltage between two points while powered.',
  },
  '0.4': {
    terms: [
      ['Polarity', 'Which connection is positive and which is negative. Reversing a polarized part can stop the circuit working.'],
      ['First power', 'The first time you insert cells into the assembled circuit. It comes after unpowered checks.'],
    ],
    workedExample: 'With the cells out, compare the LED direction and holder marks with the drawing. Check for an unintended connection across the supply. Only when those checks are resolved should you insert cells and watch for heat, odor, or unexpected behavior.',
  },
  '1.1': {
    terms: [
      ['Circuit loop', 'A complete conducting path from one battery terminal, through parts, and back to the other terminal.'],
      ['Open switch', 'A switch position that breaks the conducting path.'],
    ],
    workedExample: 'Trace a path from battery positive through the switch, resistor, and LED to battery negative. If the switch opens, your finger can no longer trace a continuous route through the parts. The battery can still have voltage even though current through that loop stops.',
  },
  '1.2': {
    terms: [
      ['Current', 'The rate of electric charge flow through a branch, measured in amperes.'],
      ['Voltage', 'The difference in electric potential between two points, measured in volts.'],
      ['Across a part', 'One probe on each side of that part, so the meter compares its two ends.'],
    ],
    workedExample: 'To learn the voltage across a resistor, place the two voltage probes on its two terminals. If you place them across the battery instead, you measure the supply voltage. Those are different measurements even in the same circuit.',
  },
  '1.3': {
    terms: [
      ['Milli', 'One thousandth: 1 mA is 0.001 A.'],
      ['Kilo', 'One thousand: 1 kΩ is 1000 Ω.'],
    ],
    workedExample: 'Convert 5 mA to amperes before using Ohm’s law: 5 ÷ 1000 = 0.005 A. Convert 2.2 kΩ to ohms by multiplying by 1000: 2200 Ω. Keep units beside every number so a thousandfold mistake is visible.',
  },
  '1.4': {
    terms: [
      ['Resistance', 'A measure of how strongly a resistor opposes current, in ohms (Ω).'],
      ['Ohmic resistor', 'A resistor modeled by V = IR over the conditions used here. An LED does not behave like this resistor.'],
    ],
    workedExample: 'If 2 V stays across a 100 Ω resistor, I = 2 ÷ 100 = 0.02 A. With 200 Ω at the same 2 V, I = 0.01 A. The larger resistance gives less current under the fixed-voltage assumption.',
  },
  '1.5': {
    terms: [
      ['Ohm’s law', 'For a resistor, voltage V equals current I times resistance R: V = IR.'],
      ['Rearrange', 'Solve the same relationship for the unknown: I = V/R or R = V/I.'],
    ],
    workedExample: 'Suppose a 220 Ω resistor has 1.1 V across it. Divide 1.1 V by 220 Ω to get 0.005 A, or 5 mA. This calculates resistor current from the voltage actually across the resistor, not from battery voltage alone.',
  },
  '1.6': {
    terms: [
      ['Series path', 'Parts connected one after another so the same branch current goes through them.'],
      ['Open', 'A break that prevents current in the path.'],
      ['Bypass', 'An added route around a part. Around the resistor, it can remove the intended LED current limit.'],
    ],
    workedExample: 'Imagine battery → switch → resistor → LED → battery. An open switch stops the loop. A wire across the resistor is different: the loop may remain closed while current avoids the resistor, which is unsafe for the LED.',
  },
  '2.1': {
    terms: [
      ['LED', 'A light-emitting diode; it has a direction and needs controlled current.'],
      ['Anode and cathode', 'The LED’s two electrical terminals. Identify them from the exact part drawing and map them to the schematic and board.'],
    ],
    workedExample: 'Before placing an LED, find its anode and cathode in the manufacturer drawing. Trace the intended current path on the schematic, then compare the board pad numbers and markings. If any of these disagree, pause and resolve the mismatch.',
  },
  '2.2': {
    terms: [
      ['Datasheet', 'The manufacturer’s document giving a part’s limits, measurements, and test conditions.'],
      ['Typical', 'A representative value under stated conditions, not a guaranteed result for every part.'],
      ['Nominal', 'A useful rated value, such as 1.5 V for an AA cell, not an exact voltage under every load.'],
    ],
    workedExample: 'If a datasheet lists LED voltage at 10 mA and 25 °C, write those conditions next to the number. If your circuit runs at another current, treat that listed point as context and check the appropriate range before choosing a resistor.',
  },
  '2.3': {
    terms: [
      ['Current target', 'The operating current you aim for when choosing the series resistor. It is a design choice.'],
      ['Rating', 'A limit or specified operating condition from the exact component datasheet.'],
    ],
    workedExample: 'Start with a modest current that the selected LED permits, calculate a resistor, and test whether the prototype is visible enough. If it is too dim, revisit the target while checking the LED and resistor limits again.',
  },
  '2.4': {
    terms: [
      ['Series resistor', 'A resistor in the LED’s current path that helps limit current.'],
      ['Voltage across the resistor', 'Supply voltage minus the LED voltage in this simple series model.'],
    ],
    workedExample: 'With a hypothetical 3 V supply, 2 V LED drop, and 10 mA target, the resistor has 1 V across it. Convert 10 mA to 0.010 A, then R = 1 ÷ 0.010 = 100 Ω. A real part choice also needs supply and LED ranges.',
  },
  '2.5': {
    terms: [
      ['Power dissipation', 'Electrical energy converted to heat per second in a part, measured in watts.'],
      ['Tolerance', 'The allowed variation around a part’s labeled value.'],
    ],
    workedExample: 'A 100 Ω resistor carrying 10 mA dissipates I²R = 0.010² × 100 = 0.010 W. Compare the worst plausible result with the exact resistor’s rating, allowing for the real supply and part values.',
  },
  '2.6': {
    terms: [
      ['Symbol', 'The schematic drawing of a part’s electrical connections.'],
      ['Footprint', 'The board pattern of pads and holes where that physical part will attach.'],
      ['Pinout', 'The identity and function of each numbered connection on the real part.'],
    ],
    workedExample: 'A three-pin slide switch may connect its middle pin to one outer pin in one position and to the other outer pin in the next. Read the exact switch drawing, choose the pair your circuit uses, and verify that the symbol pins map to those footprint pads.',
  },
  '2.7': {
    terms: [
      ['Symptom', 'What you observe, such as “LED is dark.” It is not yet a diagnosis.'],
      ['Hypothesis', 'A possible cause that predicts an observation you can test.'],
    ],
    workedExample: 'If the LED is dark, a weak battery and an open wire are different hypotheses. Measure the supply first. If it is normal, remove the cells and test the suspected connection rather than replacing parts at random.',
  },
  '3.1': {
    terms: [
      ['Breadboard row', 'A group of holes joined by metal under the plastic; holes in other rows may be separate.'],
      ['Power rail', 'A long group of holes often used for supply connections. Some rails have a break in the middle.'],
    ],
    workedExample: 'Before trusting a rail from one end to the other, remove the cells and place meter probes on opposite sides of its midpoint. A continuity result tells you whether this particular rail is joined there.',
  },
  '3.2': {
    terms: [
      ['Prototype', 'A temporary build used to test the circuit before committing to a PCB.'],
      ['Jumper', 'A removable wire between breadboard holes. Its location decides which rows are connected.'],
    ],
    workedExample: 'With cells absent, trace the schematic one connection at a time on the breadboard: holder to switch, switch to resistor, resistor to LED, and LED back to the holder. Check the exact row of every jumper before first power.',
  },
  '3.3': {
    terms: [
      ['DC voltage mode', 'The meter setting for a steady voltage such as a battery supply.'],
      ['Probe polarity', 'The meter reports red-probe potential relative to black-probe potential; reversing them changes the sign.'],
    ],
    workedExample: 'Set the meter to DC volts with leads in the correct jacks. Put red on holder positive and black on holder negative. If the sign is negative, check whether the probes or cells are reversed before interpreting the number.',
  },
  '3.4': {
    terms: [
      ['Infer current', 'Calculate current from another measurement instead of putting the meter directly into the current path.'],
      ['Resistor voltage', 'The voltage measured with one probe at each end of the known resistor.'],
    ],
    workedExample: 'If a known 100 Ω resistor has 0.5 V across it, I = V/R = 0.5 ÷ 100 = 0.005 A, or 5 mA. This avoids connecting a current-mode meter directly across a battery.',
  },
  '3.5': {
    terms: [
      ['Prediction', 'A value estimated from the circuit model and its assumptions.'],
      ['Observation', 'A value actually measured on the build.'],
    ],
    workedExample: 'If your model used 3.0 V but the loaded holder measures 2.7 V, write both values down. Recalculate the predicted resistor voltage using 2.7 V and a plausible LED voltage range before deciding that anything is faulty.',
  },
  '3.6': {
    terms: [
      ['Fault isolation', 'Using a measurement that separates possible causes of a problem.'],
      ['Split rail', 'A breadboard power rail whose two sections are not internally joined.'],
    ],
    workedExample: 'A normal battery reading rules out one possible cause of a dark LED, but not a broken breadboard path. With cells removed, test continuity across the suspected rail split. A failed connection supports that hypothesis.',
  },
  '4.1': {
    terms: [
      ['KiCad project', 'A named set of design files that keeps the schematic and PCB design together.'],
      ['Revision', 'A specific version of the design. Keep its schematic, board, and outputs together.'],
    ],
    workedExample: 'Create one project folder for the LED board. Save its schematic and PCB there, and write down the KiCad version. Before editing or exporting, confirm you opened the intended revision rather than a similarly named older folder.',
  },
  '4.2': {
    terms: [
      ['Schematic symbol', 'A drawing of a component’s electrical pins and their roles.'],
      ['Pin number', 'The identifier that must match the physical part and its board pad.'],
    ],
    workedExample: 'For a switch, read which numbered terminals connect in the ON position in its datasheet. Compare that pair with the symbol’s numbered pins. A matching name in the library does not prove the mapping is right.',
  },
  '4.3': {
    terms: [
      ['Net', 'A group of pins meant to be electrically connected.'],
      ['Junction', 'A point where wires join in the schematic editor. Crossing lines are not always joined.'],
    ],
    workedExample: 'Draw the wire from the resistor to the LED. Use net highlighting to select it and inspect which pins light up. If the intended LED pin does not highlight, correct the wire or junction instead of trusting the drawing’s appearance.',
  },
  '4.4': {
    terms: [
      ['Footprint', 'The PCB pattern of metal pads, holes, and outlines for a physical component.'],
      ['Pad', 'A metal landing where a component lead or terminal connects to the board. Each pad has a number.'],
      ['Pitch', 'The distance between neighboring leads or pads.'],
    ],
    workedExample: 'For a through-hole switch, compare the exact lead spacing and diameter with the footprint pitch and drill holes. Then compare every numbered pad with the schematic pin and part drawing. A good-looking 3D preview alone cannot confirm either check.',
  },
  '4.5': {
    terms: [
      ['ERC', 'Electrical Rules Check: KiCad’s check for configured schematic connection problems.'],
      ['Design intent', 'What the circuit is supposed to do, which a rule checker cannot fully infer.'],
    ],
    workedExample: 'Run ERC and resolve every reported issue. Then trace the battery-to-LED loop yourself and inspect polarity, values, and exact pin mapping. An LED wired backward may still be legal under the checker’s rules.',
  },
  '4.6': {
    terms: [
      ['Logical review', 'A deliberate trace of what the schematic means, beyond passing automated checks.'],
      ['Polarity review', 'A comparison of positive/negative and anode/cathode connections with the intended circuit and exact part.'],
    ],
    workedExample: 'Start at battery positive and trace switch → resistor → LED anode → LED cathode → return. At each part, compare the symbol and value with the chosen component. Write down any mismatch before making the board.',
  },
  '5.1': {
    terms: [
      ['Copper layer', 'Metal paths and pads that can conduct current on the PCB.'],
      ['Solder mask', 'A protective coating over much of the copper; openings expose pads for soldering.'],
      ['Silkscreen', 'Printed text and marks that guide assembly, not electrical connections.'],
    ],
    workedExample: 'If the LED and resistor must connect, route a copper track between their correct pads. Add a silkscreen label if it helps assembly, but a printed line cannot substitute for the copper connection.',
  },
  '5.2': {
    terms: [
      ['Drill size', 'The hole diameter specified for a through-hole component lead.'],
      ['Pad mapping', 'Which numbered footprint pad corresponds to each electrical pin.'],
    ],
    workedExample: 'Print a footprint at actual size or compare its dimensions directly with the exact part drawing. Check lead spacing, drill diameter, and every numbered pad. A 3D body that looks aligned can still hide a too-small hole.',
  },
  '5.3': {
    terms: [
      ['Fabrication rule', 'A limit from the chosen manufacturer, such as minimum track width, spacing, or drill size.'],
      ['Design margin', 'Extra room beyond a manufacturing minimum, when the layout allows it.'],
    ],
    workedExample: 'Read the current capabilities of the fabricator you plan to use. Enter appropriate rules in the PCB project before routing. If a track only fits at an absolute minimum, consider moving parts to leave more margin.',
  },
  '5.4': {
    terms: [
      ['Placement', 'The location and orientation of each part on the PCB.'],
      ['Assembly clearance', 'Room to insert, solder, and use parts without interference.'],
    ],
    workedExample: 'Put the LED where it can be seen and the switch where a finger can reach it. Check the battery holder’s real outline so it does not cover the switch or polarity marks. Then confirm routing still has room.',
  },
  '5.5': {
    terms: [
      ['Track', 'A routed copper path connecting pads on the PCB.'],
      ['Ratsnest line', 'An editor guide showing a connection that still needs to be routed.'],
    ],
    workedExample: 'Highlight the resistor-to-LED net and route copper between its intended pads. Check that the ratsnest line disappears and the unrouted count drops. If copper merely appears to touch a pad, inspect the actual net assignment.',
  },
  '5.6': {
    terms: [
      ['Board outline', 'The closed shape on the edge layer that tells the fabricator where to cut the PCB.'],
      ['Polarity mark', 'A readable board marking that helps place a polarized part correctly.'],
    ],
    workedExample: 'Draw a closed outline on the correct edge layer, then inspect it closely for gaps. Add LED and battery polarity labels on silkscreen where the assembled parts will not hide them. Review at actual board size.',
  },
  '5.7': {
    terms: [
      ['DRC', 'Design Rules Check: KiCad’s test of configured board geometry and connectivity rules.'],
      ['Schematic parity', 'Whether the PCB’s connections still match the schematic.'],
    ],
    workedExample: 'Choose rules for your fabricator, then run DRC and check the board against the schematic. If you change a rule or move a footprint, rerun the checks. A clean report says the configured checks passed, not that every part will fit.',
  },
  '5.8': {
    terms: [
      ['Board review', 'A separate check of the PCB against its circuit, exact parts, and intended use.'],
      ['Assembly mark', 'Printed guidance such as LED polarity or switch state used during the build.'],
    ],
    workedExample: 'Compare each pad number and net with the schematic and datasheets. Then imagine assembling and using the board: can you see the LED, reach the switch, and read the battery polarity? Fix mismatches before generating fabrication files.',
  },
  '6.1': {
    terms: [
      ['Gerber', 'A manufacturing file describing a board layer such as copper, mask, or silkscreen.'],
      ['Drill file', 'A separate output describing hole positions and sizes, commonly in Excellon format.'],
    ],
    workedExample: 'From one approved board revision, export the copper, mask, silkscreen, and outline layers plus the drill file into one release folder. Record that revision so a later change cannot silently mix new copper with old holes.',
  },
  '6.2': {
    terms: [
      ['GerbView', 'KiCad’s viewer for exported manufacturing layers.'],
      ['Layer alignment', 'Whether copper, holes, outline, mask openings, and marks line up in the exported package.'],
    ],
    workedExample: 'Open the exported package in GerbView, not just the PCB editor. Switch layers on and off: confirm the outline, pad openings, drill centers, and LED polarity mark are all present and aligned.',
  },
  '6.3': {
    terms: [
      ['Vendor preview', 'The fabricator’s rendering of the files you actually uploaded.'],
      ['Bill of materials', 'A list of exact components needed to assemble the board.'],
    ],
    workedExample: 'Compare the vendor preview with your inspected Gerbers and drill data. If a hole or layer is missing, stop and check the upload and revision. Also confirm the exact parts in the bill of materials are available before paying.',
  },
  '6.4': {
    terms: [
      ['Release package', 'The reviewed, matching set of design files and manufacturing outputs sent to a fabricator.'],
      ['Freeze a revision', 'Stop mixing files from different versions and record exactly what was approved.'],
    ],
    workedExample: 'Name an approved revision and keep its schematic, PCB, ERC/DRC results, Gerbers, drills, and bill of materials together. If the LED footprint changes afterward, create a new revision and regenerate the affected outputs.',
  },
  '7.1': {
    terms: [
      ['Bare board', 'The fabricated PCB before any components are soldered onto it.'],
      ['Receiving inspection', 'Comparing the physical board with approved files and looking for visible defects.'],
    ],
    workedExample: 'When the boards arrive, leave the cells out. Compare the outline, holes, pads, mask openings, and printed marks with the approved output. If a required hole is absent, stop before forcing a part or applying power.',
  },
  '7.2': {
    terms: [
      ['Soldering iron', 'A heated tool used to make solder joints between component leads and PCB pads.'],
      ['Iron stand', 'A stable place for the hot iron whenever it is not touching the work.'],
    ],
    workedExample: 'Before heating the iron, clear loose wires and flammable clutter, set up the stand, eye protection, and appropriate ventilation, then practice a joint on scrap material. Follow the instructions for your iron and solder.',
  },
  '7.3': {
    terms: [
      ['Polarized part', 'A component whose orientation matters electrically, such as this LED.'],
      ['Pad mark', 'A printed or copper label indicating how a numbered part connection should be installed.'],
    ],
    workedExample: 'With cells out, compare the LED’s actual lead markings with its datasheet, schematic symbol, and board pads. Place the part only when anode and cathode agree across all three; then solder within the part’s limits.',
  },
  '7.4': {
    terms: [
      ['Solder bridge', 'Unintended solder joining conductors that should remain separate.'],
      ['Joint inspection', 'Looking for poor wetting, disturbed joints, bridges, or damaged pads, followed by electrical checks.'],
    ],
    workedExample: 'If solder joins two pads on different nets, keep the board unpowered. Remove the bridge, inspect the pads again, and use an unpowered meter check to verify the unwanted connection is gone.',
  },
  '7.5': {
    terms: [
      ['Continuity test', 'A meter check for a low-resistance path, performed with the board unpowered. A beep does not identify which path caused it.'],
      ['Supply short', 'An unintended low-resistance path between the positive and negative supply contacts.'],
    ],
    workedExample: 'Remove both cells and verify the meter’s continuity mode on a known connection. A beep between two pads means some low-resistance path exists, but an installed part or another route may be responsible. Trace the actual circuit before deciding a solder bridge is present.',
  },
  '7.6': {
    terms: [
      ['First-power observation', 'What happens immediately when power is first applied after unpowered checks.'],
      ['Stop condition', 'A sign such as unexpected heat, smoke, or odor that means remove power and investigate.'],
    ],
    workedExample: 'After passing unpowered checks, insert cells and observe briefly. If anything heats or smells unusual, remove them. If the LED lights normally, record supply and resistor voltages so you can compare actual current with the design.',
  },
  '8.1': {
    terms: [
      ['Symptom', 'A direct observation such as “LED dark,” without assuming a cause.'],
      ['Diagnostic test', 'A safe check chosen because possible causes predict different results.'],
    ],
    workedExample: 'For a dark LED, list a weak supply and an open switch as two hypotheses. A supply voltage reading can test the first. If it is normal, remove cells and check whether the switch closes as intended.',
  },
  '8.2': {
    terms: [
      ['Open trace', 'A broken copper path that should have connected two points.'],
      ['Predicted reading', 'The result you expect from a test if a particular hypothesis is true.'],
    ],
    workedExample: 'If you suspect a broken trace, predict no continuity between its intended ends. Remove the cells, probe those ends, and compare the result with your prediction. For powered node questions, plan a DC voltage test instead.',
  },
  '8.3': {
    terms: [
      ['Inferred current', 'Current calculated from voltage across a known resistor using I = V/R.'],
      ['Actual resistance', 'The resistance of the installed part, which may differ from its label within tolerance.'],
    ],
    workedExample: 'If the installed resistor is 220 Ω and its measured voltage is 1.1 V, current is about 1.1 ÷ 220 = 0.005 A, or 5 mA. Compare that with the target and the measured supply before deciding what caused a difference.',
  },
  '8.4': {
    terms: [
      ['Repair evidence', 'Measurements made before and after a change to see whether the suspected fault was corrected.'],
      ['Retest', 'Repeating the same relevant check after the repair.'],
    ],
    workedExample: 'Record that a joint had no continuity between its intended endpoints. Remove cells, repair it, and repeat that same check. If it now connects, the result supports the diagnosis; a different test would be harder to compare.',
  },
  '8.5': {
    terms: [
      ['Discriminating test', 'A measurement for which competing fault hypotheses predict different outcomes.'],
      ['Remaining uncertainty', 'What your current evidence has not yet established.'],
    ],
    workedExample: 'If either an open switch or a reversed LED could explain a dark board, remove the cells and test the switch contacts in the ON position. An open reading supports the switch hypothesis. A closed reading directs your next inspection elsewhere.',
  },
  '9.1': {
    terms: [
      ['Part substitution', 'Replacing an exact component with a different model, which may change electrical and physical design.'],
      ['Package', 'The component’s physical body and lead arrangement.'],
    ],
    workedExample: 'Choose a specific replacement LED and read its voltage/current conditions, polarity marks, size, and lead spacing. Compare each with the original part before reusing its resistor calculation or footprint.',
  },
  '9.2': {
    terms: [
      ['Recalculation', 'Repeating design math with the new part’s stated conditions and a range of supply values.'],
      ['Assumption', 'A value used for a model that still needs verification against the exact part or hardware.'],
    ],
    workedExample: 'For a hypothetical 3 V supply, 2 V LED drop, and 5 mA target, the resistor estimate is (3 − 2) ÷ 0.005 = 200 Ω. A new LED with a different assumed drop needs a fresh estimate and a range check, not a copied value.',
  },
  '9.3': {
    terms: [
      ['Versioned revision', 'One consistent set of schematic, board, checks, and manufacturing outputs after a design change.'],
      ['Regenerate outputs', 'Export fresh manufacturing files from the updated approved board.'],
    ],
    workedExample: 'After changing the LED footprint, update the schematic-to-pad mapping and PCB, rerun ERC and DRC, then regenerate Gerbers and drills. Keep the previous output package separate so it cannot be uploaded by mistake.',
  },
  '9.4': {
    terms: [
      ['Design claim', 'A statement about what the design is expected or known to do.'],
      ['Verified evidence', 'A check or measurement that directly supports a particular claim.'],
    ],
    workedExample: 'A revised board that passes ERC and DRC has documented file checks. If it has not been built, say current and brightness remain unmeasured. A later physical measurement can support a stronger claim about the real board.',
  },
}
