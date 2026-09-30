export const project = {
  id: 'led-a', revision: 'A', name: 'LED teaching project', width: 40, height: 25,
  status: 'Illustrative project. Exact hardware and a physical build remain unverified.',
  assumptions: ['One series path; S1 closes contacts 1 and 2 in ON.', 'Supplied voltages and observations are modeled examples, not readings from your board.', 'BT1 is an external two-AA holder. The schematic uses + and − contacts.', 'D1 uses KiCad Device:LED numbering: pin 1 is K (cathode); pin 2 is A (anode).'],
  terminals: [
    { id:'BT1+', label:'BT1 +', x:60,y:90,net:'VCC' },
    { id:'S1.1', label:'S1 pin 1',x:135,y:90,net:'VCC' },
    { id:'S1.2', label:'S1 pin 2',x:205,y:90,net:'SW' },
    { id:'R1.1', label:'R1 pin 1',x:270,y:90,net:'SW' },
    { id:'R1.2', label:'R1 pin 2',x:350,y:90,net:'LED_A' },
    { id:'D1.2', label:'D1 pin 2 (A)',x:415,y:90,net:'LED_A' },
    { id:'D1.1', label:'D1 pin 1 (K)',x:415,y:180,net:'GND' },
    { id:'BT1-', label:'BT1 −',x:60,y:180,net:'GND' },
  ],
  connections: [['BT1+','S1.1'],['S1.2','R1.1'],['R1.2','D1.2'],['D1.1','BT1-']],
  pads: [
    {id:'BT1+',label:'BT1 +',x:60,y:60,net:'VCC'}, {id:'BT1-',label:'BT1 −',x:60,y:175,net:'GND'},
    {id:'S1.1',label:'S1.1',x:130,y:60,net:'VCC'}, {id:'S1.2',label:'S1.2',x:190,y:60,net:'SW'},
    {id:'R1.1',label:'R1.1',x:270,y:60,net:'SW'}, {id:'R1.2',label:'R1.2',x:330,y:60,net:'LED_A'},
    {id:'D1.2',label:'D1.2 A',x:410,y:100,net:'LED_A'}, {id:'D1.1',label:'D1.1 K',x:410,y:170,net:'GND'},
  ],
  outputs: [
    {role:'Front copper',file:'LED_A-F_Cu.gbr',revision:'A'}, {role:'Back copper',file:'LED_A-B_Cu.gbr',revision:'A'},
    {role:'Front mask',file:'LED_A-F_Mask.gbr',revision:'A'}, {role:'Back mask',file:'LED_A-B_Mask.gbr',revision:'A'},
    {role:'Top silkscreen',file:'LED_A-F_Silkscreen.gbr',revision:'A'}, {role:'Outline',file:'LED_A-Edge_Cuts.gbr',revision:'A'},
    {role:'Plated drills',file:'LED_A-PTH.drl',revision:'A'},
  ],
  bom: [
    ['BT1','External two-AA holder','Exact product/connection unresolved'],
    ['S1','ON closes 1–2','Illustrative contact map; exact part unresolved'],
    ['R1','Series current limiter','Exercise values vary; exact resistor unresolved'],
    ['D1','WP7113ID reference drawing','1 K / 2 A symbol mapping; validate physical footprint'],
  ],
} as const
export const skillNames: Record<string,string> = {
  workflow:'Follow the PCB workflow', safety:'Prepare a safe test', loop:'Trace connections', units:'Use units', calculation:'Calculate resistor current and power',
  datasheet:'Extract conditions from a datasheet', mapping:'Map pins and pads', breadboard:'Read breadboard connections', measurement:'Choose meter setup and points',
  schematic:'Inspect a schematic', footprint:'Check physical fit', rules:'Interpret configured rules', layout:'Inspect PCB geometry', outputs:'Review a fabrication package',
  assembly:'Inspect assembly', diagnosis:'Test a fault hypothesis', evidence:'Limit a claim to its evidence',
}
