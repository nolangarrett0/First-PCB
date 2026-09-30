import type { LessonContent } from './courseContent'
import type { LessonArticle } from './lessonArticles'
import type { LessonPlan, Part, TaskCase } from './taskTypes'

// E IDs are deliberately separate from the existing course and saved records.
type Basic = { lesson: LessonContent; article: LessonArticle; plan: LessonPlan }
const basic = (id: string, title: string, learn: string, terms: LessonArticle['terms'], steps: string[], example: string, sources: LessonContent['sources'], prompt: string, options: LessonContent['options'], correct: number, why: string): Basic => ({
  lesson: { id, title, learn, prompt, options, correct, why, evidence: 'Explain your decision using the displayed example.', sources, visual: 'schematic' },
  article: { terms, workedExample: example },
  plan: { id, outcome: steps[0], steps, example },
})
const basics: Basic[] = [
  basic('E.1', 'What makes a circuit?',
    'A circuit is a set of parts connected so electric charge can move along a complete path. A battery supplies energy, wires connect the parts, and a load uses energy. Our load is a small light called an LED. You can learn this course without having studied electronics or owning any tools.',
    [['Component', 'One part of a circuit, such as a battery, switch, resistor, or LED.'], ['Electric charge', 'An electrical property of particles such as electrons. Moving charge through a path is electric current.'], ['Terminal', 'A connection point on a part, often a metal wire or pin.'], ['Load', 'A part that uses electrical energy, for example a light.'], ['Open and closed', 'An open path has a break. A closed path is connected all the way around.']],
    ['Follow a path from battery positive (+), through the parts, and back to battery negative (−).', 'A switch opens or closes a connection. Opening the only path stops current through the load.', 'A wire straight from battery positive to negative skips the load and can cause a short circuit. Keep cells removed when changing connections.'],
    'In the drawing, battery + connects to the switch, resistor, LED, then battery −. Opening the switch leaves a gap. The battery can still supply voltage, but charge cannot travel around this broken path.', ['E1', 'E2', 'B2'],
    'The only wire back to battery negative is broken. What happens to the path?', ['It is open', 'It is closed', 'It becomes an extra battery'], 0, 'The broken return wire leaves a gap in the only path.'),
  basic('E.2', 'Voltage, current, and units',
    'Voltage describes the difference in electrical energy per unit charge between two points. Current describes how much charge passes a point each second. A battery can have voltage even when disconnected; current through a load needs a conducting path. Voltage is measured in volts (V), and current in amperes (A). Small circuit currents are often written in milliamperes (mA).',
    [['Voltage', 'A difference between two points, measured in volts (V).'], ['Current', 'Charge passing a point per second, measured in amperes (A).'], ['Milliampere', 'One thousandth of an ampere: 1000 mA = 1 A.'], ['Across and through', 'Voltage is measured across two ends; current passes through a part.']],
    ['Tell voltage across two points apart from current through a part.', 'Read the unit beside a number: V means voltage; A or mA means current.', 'To convert mA to A, divide by 1000. For example, 5 mA = 0.005 A.'],
    'A label of 3 V on a battery refers to voltage between its + and − contacts. A label of 5 mA beside a wire refers to current through that wire. Those numbers describe different quantities.', ['E2', 'F1', 'M1'],
    'A label beside a wire says 4 mA. What does it describe?', ['Current through the wire', 'Voltage across the battery', 'The length of the wire'], 0, 'mA is a current unit. It does not describe voltage or length.'),
  basic('E.3', 'Resistors: controlling current',
    'A resistor opposes current. Its resistance is measured in ohms (Ω). At the same voltage across a resistor, more resistance means less current. In our LED circuit, the resistor limits current so the LED is not connected straight to the battery. An ordinary fixed resistor has no positive or negative end.',
    [['Resistance', 'How strongly a part opposes current, measured in ohms (Ω).'], ['Resistor value', 'The resistance written beside a resistor, such as 220 Ω.'], ['Ohm’s law', 'For the resistor model: current I = voltage V divided by resistance R.'], ['Kilohm', 'One thousand ohms. A 1 kΩ resistor is a 1000 Ω resistor.']],
    ['Identify the resistor as the part that limits current in our LED path.', 'Read I = V/R as: current in amperes = voltage across the resistor in volts ÷ resistance in ohms.', 'For the same resistor voltage, doubling resistance halves current. The LED’s voltage is treated separately.'],
    'Suppose a resistor has 1 V across it and a resistance of 200 Ω. Current = 1 ÷ 200 = 0.005 A = 5 mA. Using 400 Ω at that same 1 V gives 2.5 mA.', ['E3', 'F1'],
    'Why do we put a resistor in the LED current path?', ['To limit current', 'To supply energy like a battery', 'To make LED direction irrelevant'], 0, 'The resistor limits current; the battery supplies energy, and the LED still has a direction.'),
  basic('E.4', 'Diodes and LEDs: direction matters',
    'A diode conducts much more readily in one direction than the other. An LED is a light-emitting diode. Its two terminals are the anode (A) and cathode (K). For normal forward operation, conventional current enters the anode and leaves the cathode. An LED needs both the correct direction and controlled current.',
    [['Diode', 'A component that conducts primarily in one direction under its intended operating conditions.'], ['LED', 'Light-emitting diode: a diode that produces light during forward operation.'], ['Anode / cathode', 'Names of the two diode terminals. The symbol’s bar marks the cathode (K).'], ['Polarity', 'The required orientation of connections. Check it in the exact part drawing.']],
    ['Recognize the cathode bar in the LED symbol and the arrows pointing out to represent light.', 'In our series path, connect the anode toward the resistor and battery positive; the cathode returns to battery negative.', 'Keep a resistor in the current path. Identify physical leads from the exact manufacturer drawing before wiring.'],
    'Battery + → switch → resistor → LED anode → LED cathode → battery − is the intended path. Reversing the LED can keep it dark. Removing the resistor is a separate problem: it removes the intended current limit.', ['E4', 'C1'],
    'Which end does the bar on a diode symbol identify?', ['Cathode (K)', 'Anode (A)', 'Battery positive'], 0, 'The bar identifies the cathode, regardless of how the symbol is rotated.'),
  basic('E.5', 'Capacitors: storing energy',
    'A capacitor stores energy in an electric field when a voltage is applied across it. Capacitors are used in timing and in reducing rapid supply-voltage changes. Capacitance is measured in farads (F), often microfarads (µF). Some capacitors have a required polarity. We do not need a capacitor for the simple switched LED board, but you will see them on many PCBs.',
    [['Capacitance', 'The amount of charge stored per volt, measured in farads (F).'], ['Microfarad', 'One millionth of a farad, written µF.'], ['Polarized capacitor', 'A capacitor whose positive and negative terminals must be connected as specified.'], ['Voltage rating', 'The permitted voltage across the part under the manufacturer’s specified conditions.']],
    ['Distinguish a capacitor’s storage role from a resistor’s current-limiting role.', 'Read capacitance and voltage rating separately: 10 µF and 16 V describe different properties.', 'Check polarity and voltage rating in the exact capacitor datasheet. A capacitor can retain charge after the source is removed.'],
    'An illustrative capacitor specification says 10 µF, maximum 16 V, with the stripe marking negative. The stripe must face the lower-potential connection. A 20 V supply exceeds that stated rating even if orientation is correct.', ['E5', 'F4'],
    'Does a 10 µF marking mean the capacitor is rated for 10 V?', ['No; capacitance and voltage rating are different', 'Yes; all numbers on a capacitor are voltages', 'Yes; µF means volts'], 0, 'µF measures capacitance. Find the voltage rating separately.'),
  basic('E.6', 'Transistors: an electronic switch',
    'A transistor lets an electrical signal control current in another path. Transistors can switch a load or amplify a signal. A bipolar transistor has base, collector, and emitter terminals; a MOSFET has gate, drain, and source terminals. These are different device families. Our first board uses a hand-operated switch, so no transistor is needed to complete it.',
    [['Transistor', 'A device used to control current electronically, including switching and amplification.'], ['Control signal', 'An electrical input used to control another part, for example to turn a light on. “Drive” means supplying the required control input.'], ['NPN bipolar transistor', 'Base (B) receives control drive. Collector (C) and emitter (E) carry the load current in this NPN switch example.'], ['MOSFET', 'Gate (G) receives control drive relative to source (S). The controlled load path is between drain (D) and source (S).'], ['Pinout', 'The manufacturer’s map from physical pin numbers to terminal names. It varies by part and package.']],
    ['Identify a transistor as an electrically controlled device, rather than a hand-operated switch.', 'For an NPN switch example, base drive controls the collector-to-emitter load path. For a MOSFET, gate-to-source voltage controls the channel.', 'Check the exact pinout and drive requirements before building. A transistor does not replace the LED’s current-limiting resistor.'],
    'A future automatic light could use a transistor to switch the LED from a control signal. The onsemi 2N3904 drawing labels pin 1 emitter, pin 2 base, pin 3 collector. That mapping belongs to the specified part/package; it is not a rule for every transistor.', ['E6', 'T1'],
    'Which named terminal receives the control drive in this NPN example?', ['Base', 'Cathode', 'Battery negative terminal'], 0, 'The base receives the drive in this NPN example. Cathode is a diode terminal name.'),
  basic('E.7', 'Chips and their pins',
    'An integrated circuit (IC), often called a chip, contains many connected electronic elements in one package. A timer, amplifier, voltage regulator, and microcontroller are different kinds of IC. Each pin has a specific job, such as power, input, or output. A chip’s shape alone does not tell you its pin functions or permitted supply voltage.',
    [['Integrated circuit', 'Many electronic elements connected inside one chip to perform a function.'], ['Input / output', 'An input receives a signal; an output provides a signal to another part of the circuit.'], ['Supply pins', 'Pins that connect the chip to its permitted power source and return.'], ['Package', 'The physical body and leads of a part; the datasheet identifies pin numbering and orientation.']],
    ['Use the exact chip datasheet to find supply, input, and output pins.', 'Compare the intended supply with the stated operating range before connecting the chip.', 'Keep pin numbers separate from pin functions. Two chips with the same number of pins can have different connections.'],
    'A hypothetical chip table says pin 1 is supply, pin 2 is input, pin 3 is output, and pin 4 is return. To receive a sensor signal, choose pin 2. To check whether 3 V is suitable, read this chip’s supply range rather than guessing from its four-pin shape.', ['E7'],
    'Two chips have eight pins. Does that mean their pins do the same jobs?', ['No; check each exact datasheet', 'Yes; pin count determines every function', 'Yes; all chips are microcontrollers'], 0, 'Pin count and shape do not establish a chip’s internal function or pinout.'),
  basic('E.8', 'Read symbols, labels, and connections',
    'A schematic is a drawing of electrical connections, not a picture of where parts sit. A symbol identifies a component type. A reference label identifies one specific part: R1 is our resistor and D1 our LED. A dot marks a wire junction. A net is a group of directly connected points. Net names identify connections, not additional components.',
    [['Reference label', 'A short drawing name for one component: R1 means resistor 1, not a resistance of 1 Ω.'], ['Pin / pad', 'A pin is a component connection; a pad is its metal landing on the PCB. Their numbers must match the intended mapping.'], ['Dotted pin label', 'R1.2 means pin 2 of resistor R1. The dot in this text is different from a drawn wire-junction dot.'], ['Ground / return', 'GND names battery-negative return in this project. It does not mean a connection to mains earth.']],
    ['Translate R1.2 as “pin 2 of the resistor” and D1.2 as “pin 2 of the LED.”', 'Use the diagram’s pin numbers, not left/right position. In our chosen LED symbol, pin 2 is anode and pin 1 is cathode.', 'LED_A is the connection joining resistor pin 2 to LED pin 2. A line crossing another line is not automatically a connection.'],
    '“Check R1.2 → D1.2” asks about the wire from resistor pin 2 to LED anode pin 2. It does not ask you to measure across the resistor; that would use R1.1 and R1.2.', ['E8', 'K3', 'K6'],
    'What does R1.2 mean?', ['Pin 2 of resistor R1', 'A resistor of 1.2 Ω', 'Two separate resistors'], 0, 'The letters and first number identify the part; the number after the dot identifies its pin.'),
  basic('E.9', 'Put the parts together',
    'Series parts sit one after another along one path, so the same current passes through them. Parallel branches are separate paths between the same two connection points; they have the same voltage across them. Our first LED project has one series path: battery, switch, resistor, LED, and return. You are now ready to learn how that circuit becomes a PCB.',
    [['Series', 'Components one after another in the same path; they carry the same branch current.'], ['Parallel', 'Branches connected between the same two points; their endpoint voltage is the same.'], ['Conventional current', 'The direction used in these diagrams: from supply positive through the external circuit toward negative.'], ['Power', 'Energy transferred per second, measured in watts (W). Parts have power limits.']],
    ['Trace the first project as battery + → switch → resistor → LED anode → LED cathode → battery −.', 'In this single path, the resistor and LED carry the same current. The resistor does not use up current before it reaches the LED.', 'A second path between the same two points is a parallel branch. Adding a wire around the resistor bypasses its protection.'],
    'If 4 mA passes through the resistor in the single LED path, 4 mA also passes through the LED. A wire joining the resistor’s two ends creates a parallel bypass, so remove power and correct that connection.', ['F2', 'F3', 'B2'],
    'In one series path, 5 mA passes through the resistor. How much passes through the LED?', ['5 mA', '0 mA because the resistor uses it up', '10 mA because two parts double it'], 0, 'The same current passes through components in a single series path.'),
]
export const basicsLessons = basics.map(b => b.lesson)
export const basicsArticles = Object.fromEntries(basics.map(b => [b.lesson.id, b.article]))
export const basicsPlans = Object.fromEntries(basics.map(b => [b.lesson.id, b.plan]))
export const basicsChoiceFeedback = Object.fromEntries(basics.map(b => [b.lesson.id, b.lesson.options.map((_, i) => i === b.lesson.correct ? null : b.lesson.why)]))

const choose = (id: string, prompt: string, labels: [string, string, string], expected: number, explanation: string, skill: string): Part => ({
  id, prompt, kind: 'choice', options: labels.map((label, i) => ({ id: String(i), label, feedback: explanation })), expected: String(expected), hint: explanation, explanation, skillIds: [skill],
})
const value = (id: string, prompt: string, expected: number, unit: string, explanation: string, skill = 'units'): Part => ({
  id, prompt, kind: 'number', expected, baseUnit: unit, units: [unit], tolerance: 0.000001, hint: explanation, explanation, skillIds: [skill],
})
export function makeBasicsTask(id: string, v: number): TaskCase {
  const lesson = basicsLessons.find(b => b.id === id)!
  const task: TaskCase = { id, title: lesson.title, variantId: '', context: '', artifact: { kind: 'basics', variant: v, target: id }, parts: [], sources: lesson.sources }
  const table = (context: string, rows: string[][], parts: Part[]) => { task.context = context; task.artifact.rows = rows; task.parts = parts }
  switch (id) {
    case 'E.1': {
      const situations = ['Switch is open', 'Return wire is broken', 'All intended parts connect in one complete path', 'Extra wire joins battery + straight to battery −', 'Both cells are removed']
      const expected = [0, 0, 1, 2, 0][v]
      const role = ['battery', 'wire', 'switch', 'LED', 'resistor'][v]
      table('Read the connection description. This is a drawing exercise; leave real cells removed while changing wires.', [['Item', 'Description'], ['Connection state', situations[v]], ['Part to identify', role]], [
        choose('path', 'What does this connection state imply?', ['The load has no complete powered path', 'The intended load path is complete', 'There is an unsafe direct battery short'], expected, ['An open switch leaves a gap.', 'A broken return wire leaves a gap.', 'All intended parts make a complete path.', 'The added wire skips the load and shorts the source.', 'With the cells removed, there is no battery source to drive the load.'][v], 'loop'),
        choose('role', `What is the ${role} used for here?`, [['Supply energy', 'Produce light', 'Open a connection'], ['Connect terminals', 'Supply energy', 'Store energy'], ['Open or close a connection', 'Limit current', 'Produce light'], ['Produce light', 'Supply energy', 'Open a connection'], ['Limit current', 'Supply energy', 'Produce light']][v] as [string,string,string], 0, `In this project the ${role} ${['supplies energy', 'connects terminals', 'opens or closes a connection', 'produces light', 'limits current'][v]}.`, 'components'),
      ]); break
    }
    case 'E.2': {
      const current = [4, 6, 10, 2, 8][v], voltage = [3, 2.8, 3.1, 2.9, 3.2][v]
      table('Use the units to distinguish two different quantities before converting the current.', [['Quantity', 'Label'], ['Across the battery contacts', `${voltage} V`], ['Through the LED path', `${current} mA`]], [
        choose('quantity', `What does the ${v % 2 ? current + ' mA' : voltage + ' V'} label describe?`, ['Voltage across two points', 'Current through the path', 'Resistance'], v % 2 ? 1 : 0, 'V is voltage; mA is current. Voltage compares points and current passes through a path.', 'units'),
        value('amps', 'Write the displayed LED current in amperes (A).', current / 1000, 'A', `${current} mA ÷ 1000 = ${current / 1000} A.`),
      ]); break
    }
    case 'E.3': {
      const resistance = [100, 200, 250, 500, 1000][v], voltage = [1, 1, 2, 2, 3][v]
      table('These values apply to an ordinary resistor model. The voltage is across the resistor, rather than across a whole LED circuit.', [['Quantity', 'Value'], ['Voltage across resistor', `${voltage} V`], ['Resistance', `${resistance} Ω`]], [
        value('current', 'Calculate resistor current in amperes: voltage ÷ resistance.', voltage / resistance, 'A', `${voltage} V ÷ ${resistance} Ω = ${voltage / resistance} A.`, 'calculation'),
        choose('change', `Replace it with ${resistance * 2} Ω at the same ${voltage} V. What happens to current?`, ['It halves', 'It doubles', 'It stays the same'], 0, 'At fixed resistor voltage, doubling resistance halves current because I = V/R.', 'components'),
      ]); break
    }
    case 'E.4': {
      const rows = [ ['Resistor connects to', 'Anode (A)'], ['Resistor connects to', 'Cathode (K)'], ['Series resistor', 'Removed and replaced by wire'], ['LED return connects from', 'Cathode (K)'], ['Polarity instruction', 'Identify cathode bar on the rotated symbol'] ][v]
      table('Our intended path goes from battery + through the switch and resistor to LED anode, then cathode to battery −. Compare this case with that path.', [['Feature', 'This case'], rows], [
        choose('direction', 'Which finding matches this case?', ['The described LED connection matches the intended direction', 'The LED direction is reversed', 'The intended current-limiting resistor is missing'], [0,1,2,0,0][v], ['The resistor should reach the anode in this project.', 'A resistor connected toward the cathode reverses this intended LED path.', 'A wire in place of the resistor removes the intended current limit.', 'The cathode should connect to battery-negative return.', 'Rotation does not change the cathode-bar meaning.'][v], 'components'),
        choose('bar', 'On the LED symbol, what does the bar mark?', ['Cathode (K)', 'Anode (A)', 'The resistor'], 0, 'The symbol’s bar identifies cathode. Check physical polarity against the exact part drawing.', 'mapping'),
      ]); break
    }
    case 'E.5': {
      const rating = [6, 10, 16, 25, 35][v], applied = [3, 12, 5, 30, 9][v], reversed = v === 4
      table('This is an illustrative capacitor specification, not a selected physical part. Compare both polarity and voltage.', [['Feature', 'Specification or connection'], ['Capacitance', `${[10,22,47,100,220][v]} µF`], ['Maximum voltage in this exercise', `${rating} V`], ['Applied voltage', `${applied} V`], ['Required polarity', 'Stripe marks negative'], ['Stripe connected to', reversed ? 'Supply positive' : 'Battery negative']], [
        choose('check', 'Which comparison is correct?', ['Polarity matches and voltage is below the stated limit', 'Applied voltage exceeds the stated limit', 'Polarity is reversed'], reversed ? 2 : applied > rating ? 1 : 0, 'Compare the voltage with the stated limit, and the stripe with the specified negative connection. Capacitance is a separate quantity.', 'components'),
        choose('storage', 'What should you remember after removing the source?', ['A capacitor may retain charge', 'Every capacitor is immediately discharged', 'A capacitor becomes a resistor'], 0, 'Removing the source does not guarantee a capacitor is discharged; follow equipment instructions for handling.', 'safety'),
      ]); break
    }
    case 'E.6': {
      const mosfet = v % 2 === 1
      table('This is a recognition exercise, not a transistor build recipe. The control terminal differs between device families.', [['Device family', 'Named terminals'], [mosfet ? 'MOSFET' : 'NPN bipolar', mosfet ? 'Gate (G), drain (D), source (S)' : 'Base (B), collector (C), emitter (E)'], ['Next task', ['Switch a light from a sensor', 'Switch a light from a timer', 'Amplify a small signal', 'Switch a load from a control input', 'Check a replacement’s physical pins'][v]]], [
        choose('control', `Which terminal receives the control drive for this ${mosfet ? 'MOSFET' : 'NPN'}?`, ['Base', 'Gate', 'Cathode'], mosfet ? 1 : 0, mosfet ? 'Gate-to-source voltage controls a MOSFET channel.' : 'Base drive controls the collector-to-emitter load path in this NPN example.', 'transistors'),
        choose('pinout', 'How do you identify the physical pins of an exact replacement?', ['Use its manufacturer pinout for the exact package', 'Use the pin order of any three-pin component', 'Assume the middle leg is always the control terminal'], 0, 'Terminal names describe functions. Physical pin order requires the exact part/package drawing.', 'transistors'),
      ]); break
    }
    case 'E.7': {
      const input = [2,3,4,2,3][v], supply = [3,5,3.3,5,3][v], min = [2,2,2.7,2,4][v], max = [5,3.6,5.5,6,6][v]
      table('The following pin functions and voltage range belong to a hypothetical chip. Practice reading them; they are not a universal pinout.', [['Chip feature', 'Teaching specification'], ['Supply pin', '1'], ['Signal input pin', String(input)], ['Signal output pin', String(input + 1)], ['Permitted supply range', `${min}–${max} V`], ['Proposed supply', `${supply} V`]], [
        value('pin', 'Which numbered pin receives an input signal?', input, 'pins', `The table explicitly identifies pin ${input} as input.`, 'components'),
        choose('supply', 'Does the proposed supply fall within this stated range?', ['Yes', 'No; it is above the range', 'No; it is below the range'], supply > max ? 1 : supply < min ? 2 : 0, `${supply} V must lie between ${min} V and ${max} V for this exercise.`, 'components'),
      ]); break
    }
    case 'E.8': {
      const labels = ['R1.2','D1.1','S1.2','D1.2','R1.1'], meanings = ['Pin 2 of the resistor','Pin 1 of the LED (cathode)','Pin 2 of the switch','Pin 2 of the LED (anode)','Pin 1 of the resistor']
      table('Use the labels in the project drawing. The number after the dot identifies a terminal; it does not specify a component value.', [['Label to interpret', labels[v]], ['Resistor', 'R1: pins 1 and 2'], ['LED', 'D1: pin 1 cathode; pin 2 anode'], ['Switch', 'S1: ON joins pins 1 and 2'], ['Battery-negative return name', 'GND']], [
        choose('label', `What does ${labels[v]} refer to?`, [meanings[v], 'A resistance value in ohms', 'A separate wire named after its length'], 0, `${labels[v]} identifies ${meanings[v].toLowerCase()} in this project.`, 'mapping'),
        choose('return', 'What does GND mean in this battery project?', ['The connection returning to battery negative', 'A connection to a wall outlet’s earth terminal', 'Another component to purchase'], 0, 'GND is the name chosen for battery-negative return in this project.', 'mapping'),
      ]); break
    }
    case 'E.9': {
      const current = [3,4,5,6,8][v], bypass = v % 2 === 1
      table('Compare the intended single LED path with the proposed change. Resistor current is given for the original series path.', [['Feature', 'Teaching case'], ['Original path', 'Battery + → switch → resistor → LED → battery −'], ['Original resistor current', `${current} mA`], ['Proposed change', bypass ? 'Add a wire between the resistor’s two ends' : 'Open the switch in the only path']], [
        value('series', 'In the original series path, what is the LED current in mA?', current, 'mA', `The resistor and LED are in one series path, so both carry ${current} mA.`, 'loop'),
        choose('change', 'What does the proposed change do?', ['Breaks the only conducting path', 'Bypasses the current-limiting resistor', 'Adds a second battery'], bypass ? 1 : 0, bypass ? 'The new parallel wire lets current avoid the resistor. Correct it unpowered before using the LED circuit.' : 'Opening the only switch breaks the single path and stops its current.', 'loop'),
      ]); break
    }
  }
  // Change presentation order without changing answer or exposure identity.
  task.parts.forEach((part, index) => {
    if (part.kind !== 'choice' || !part.options) return
    const offset = (v + index) % part.options.length
    part.options = [...part.options.slice(offset), ...part.options.slice(0, offset)]
  })
  return task
}
