import { Plant, getPlant, plants } from "./plants";

export type Tone = "good" | "warn" | "bad" | "info" | "neutral";

export type Kpi = {
  id: string;
  label: string;
  value: number;
  unit: string;
  delta: string;
  tone: Tone;
  hint: string;
};

export type MonthPoint = {
  month: string;
  availability: number;
  pm: number;
  cost: number;
  downtime: number;
  notifications: number;
  workOrders: number;
  permits: number;
  mttr: number;
};

export type NamedValue = { label: string; value: number };

export type WorkOrderRow = {
  id: string;
  asset: string;
  description: string;
  status: string;
  priority: string;
  age: number;
  owner: string;
};

export type PermitRow = {
  id: string;
  asset: string;
  type: string;
  status: string;
  age: number;
  owner: string;
};

export type BadActor = {
  asset: string;
  failures: number;
  downtime: number;
  cost: number;
  criticality: string;
};

export type RcaRow = {
  id: string;
  asset: string;
  method: string;
  status: string;
  age: number;
  owner: string;
};

export type FindingRow = {
  id: string;
  source: string;
  severity: string;
  status: string;
  owner: string;
  due: string;
};

export type PlantData = {
  plant: Plant;
  kpis: Kpi[];
  monthly: MonthPoint[];
  backlog: NamedValue[];
  priorityMix: NamedValue[];
  departments: NamedValue[];
  badActors: BadActor[];
  workOrders: WorkOrderRow[];
  permits: PermitRow[];
  costBreakdown: NamedValue[];
  rca: RcaRow[];
  findings: FindingRow[];
  crewLoad: NamedValue[];
  materialReadiness: number;
  permitCycle: NamedValue[];
  checklistCompletion: NamedValue[];
  dataQuality: number;
  sapSyncHealth: string;
  generatedAt: string;
};

const monthLabels = [
  "Dec 25",
  "Jan 26",
  "Feb 26",
  "Mar 26",
  "Apr 26",
  "May 26",
  "Jun 26",
  "Jul 26",
  "Aug 26",
  "Sep 26",
  "Oct 26",
  "Nov 26",
];

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function between(rand: () => number, min: number, max: number) {
  return min + rand() * (max - min);
}

function round(value: number, decimals = 1) {
  return Number(value.toFixed(decimals));
}

function buildMonthly(plant: Plant): MonthPoint[] {
  const rand = mulberry32(plant.seed);
  const base = {
    coal: { availability: 91.5, pm: 64, cost: 3_450_000, downtime: 42, notifs: 64, wos: 48, permits: 28, mttr: 26 },
    thermal: { availability: 93.2, pm: 74, cost: 2_850_000, downtime: 32, notifs: 48, wos: 38, permits: 22, mttr: 21 },
    wind: { availability: 96.4, pm: 84, cost: 1_050_000, downtime: 9, notifs: 22, wos: 16, permits: 6, mttr: 14 },
    gas: { availability: 94.6, pm: 79, cost: 1_950_000, downtime: 18, notifs: 31, wos: 24, permits: 12, mttr: 18 },
  }[plant.slug];

  return monthLabels.map((month, index) => {
    const season = Math.sin((index / 11) * Math.PI * 2) * 0.6;
    return {
      month,
      availability: round(base.availability + season + between(rand, -1.4, 1.4), 1),
      pm: round(base.pm + season * 4 + between(rand, -5, 5), 1),
      cost: Math.round(base.cost * (1 + between(rand, -0.09, 0.11))),
      downtime: Math.round(base.downtime * (1 + between(rand, -0.22, 0.26))),
      notifications: Math.round(base.notifs * (1 + between(rand, -0.15, 0.2))),
      workOrders: Math.round(base.wos * (1 + between(rand, -0.16, 0.18))),
      permits: Math.round(base.permits * (1 + between(rand, -0.2, 0.22))),
      mttr: round(base.mttr * (1 + between(rand, -0.14, 0.18)), 1),
    };
  });
}

const assetNames: Record<string, string[]> = {
  coal: [
    "Boiler Feed Pump A",
    "Boiler Feed Pump B",
    "Primary Air Fan 1",
    "Primary Air Fan 2",
    "Coal Mill 3",
    "Coal Mill 4",
    "ID Fan 1",
    "Turbine Lube Oil Pump",
    "Condensate Extraction Pump",
    "Ash Handling Blower",
  ],
  thermal: [
    "Turbine 3 HP Rotor",
    "Turbine 4 HP Rotor",
    "Boiler 5 Economiser",
    "Feed Pump 3A",
    "Feed Pump 4B",
    "Condenser Vacuum Pump",
    "ESP Field 2",
    "Cooling Tower Fan 5",
    "Mill 3C",
    "Mill 4A",
  ],
  wind: [
    "WTG-07 Gearbox",
    "WTG-12 Generator",
    "WTG-18 Pitch System",
    "WTG-23 Yaw Drive",
    "WTG-31 Converter",
    "WTG-38 Blade A",
    "WTG-44 Transformer",
    "WTG-51 Main Bearing",
    "WTG-63 Hydraulic Unit",
    "WTG-77 Anemometer",
  ],
  gas: [
    "GT-1 Compressor",
    "GT-2 Compressor",
    "ST-1 Steam Turbine",
    "HRSG-1 Economiser",
    "HRSG-2 Superheater",
    "Gas Skid Valve Train",
    "Condensate Pump 1",
    "Condensate Pump 2",
    "Cooling Water Pump A",
    "Generator Exciter",
  ],
};

const departmentNames: Record<string, string[]> = {
  coal: ["Boiler", "Turbine", "Electrical", "C&I", "Coal Handling"],
  thermal: ["Boiler", "Turbine", "Electrical", "C&I", "Ash Handling"],
  wind: ["Turbine O&M", "Electrical", "SCADA", "Blade Services", "Logistics"],
  gas: ["Mechanical", "Electrical", "C&I", "HRSG", "Operations"],
};

function buildBadActors(plant: Plant, rand: () => number): BadActor[] {
  return assetNames[plant.slug]
    .map((asset, index) => {
      const failures = Math.max(1, Math.round(between(rand, 2, 9) - index * 0.25));
      const downtime = Math.round(failures * between(rand, 3, 11));
      return {
        asset,
        failures,
        downtime,
        cost: Math.round(downtime * plant.hourlyLoss * between(rand, 0.65, 1.05)),
        criticality: index < 3 ? "A" : index < 6 ? "B" : "C",
      };
    })
    .sort((a, b) => b.cost - a.cost)
    .slice(0, 10);
}

function buildWorkOrders(plant: Plant, rand: () => number): WorkOrderRow[] {
  const assets = assetNames[plant.slug];
  const statuses = ["In progress", "Planned", "Awaiting permit", "On hold", "In progress", "Planned", "Awaiting material", "In progress"];
  const priorities = ["Critical", "High", "High", "Medium", "Medium", "Medium", "Low", "High"];
  return assets.slice(0, 8).map((asset, index) => ({
    id: `WO-${String(4100 + index)}`,
    asset,
    description: [
      "Vibration above alarm",
      "Annual preventive inspection",
      "Oil leak on bearing housing",
      "Replace worn coupling",
      "Overdue PM checklist",
      "Thermography follow-up",
      "Alignment after outage",
      "Control valve calibration",
    ][index],
    status: statuses[index],
    priority: priorities[index],
    age: Math.round(between(rand, 1, 34)),
    owner: ["A. Sharma", "R. Patel", "M. Khan", "S. Iyer", "D. Rao", "P. Singh", "K. Mehta", "V. Joshi"][index],
  }));
}

function buildPermits(plant: Plant, rand: () => number): PermitRow[] {
  const assets = assetNames[plant.slug];
  const types = ["Hot work", "Confined space", "Electrical isolation", "Work at height", "Cold work", "Line breaking"];
  const statuses = ["Active", "Active", "Awaiting return", "Active", "Overdue", "Active"];
  return assets.slice(0, 6).map((asset, index) => ({
    id: `PTW-${String(880 + index)}`,
    asset,
    type: types[index],
    status: statuses[index],
    age: Math.round(between(rand, 1, 16)),
    owner: ["Operations", "Boiler", "Electrical", "Turbine", "C&I", "Operations"][index],
  }));
}

function buildRca(plant: Plant, rand: () => number): RcaRow[] {
  const assets = assetNames[plant.slug];
  const methods = ["5 Whys", "Fishbone", "Apollo", "FMEA", "5 Whys"];
  const statuses = ["Analysis", "Actions open", "Verification", "Closed", "Actions open"];
  return assets.slice(0, 5).map((asset, index) => ({
    id: `RCA-${String(120 + index)}`,
    asset,
    method: methods[index],
    status: statuses[index],
    age: Math.round(between(rand, 2, 46)),
    owner: ["Reliability", "Boiler", "Turbine", "Electrical", "C&I"][index],
  }));
}

function buildFindings(plant: Plant, rand: () => number): FindingRow[] {
  const sources = ["Internal audit", "Statutory inspection", "Checklist deviation", "Management review", "Internal audit"];
  const severities = ["Major", "Minor", "Major", "Observation", "Minor"];
  const statuses = ["CAPA open", "Closed", "CAPA open", "Verification", "Closed"];
  return sources.map((source, index) => ({
    id: `FIND-${String(44 + index)}`,
    source,
    severity: severities[index],
    status: statuses[index],
    owner: ["QA", "Operations", "Maintenance", "Plant Head", "C&I"][index],
    due: ["12 Dec 2026", "18 Nov 2026", "05 Jan 2027", "30 Nov 2026", "22 Nov 2026"][index],
  }));
}

export function getPlantData(slug: string): PlantData | undefined {
  const plant = getPlant(slug);
  if (!plant) return undefined;
  const rand = mulberry32(plant.seed + 7);
  const monthly = buildMonthly(plant);
  const latest = monthly[monthly.length - 1];
  const annualCost = monthly.reduce((sum, point) => sum + point.cost, 0);
  const costPctRav = round((annualCost / plant.rav) * 100, 2);
  const unplannedLoss = latest.downtime * plant.hourlyLoss;
  const statutoryBacklog = { coal: 4, thermal: 6, wind: 0, gas: 1 }[plant.slug];
  const dataQuality = { coal: 91, thermal: 87, wind: 94, gas: 89 }[plant.slug];
  const materialReadiness = { coal: 82, thermal: 74, wind: 88, gas: 91 }[plant.slug];

  const kpis: Kpi[] = [
    {
      id: "availability",
      label: "Asset availability",
      value: latest.availability,
      unit: "%",
      delta: `${round(latest.availability - monthly[monthly.length - 2].availability, 1)} pts`,
      tone: latest.availability >= 94 ? "good" : latest.availability >= 91 ? "warn" : "bad",
      hint: "Operating hours ÷ available hours, weighted by unit capacity.",
    },
    {
      id: "cost",
      label: "Maintenance cost / RAV",
      value: costPctRav,
      unit: "%",
      delta: `${round(costPctRav - 2.4, 2)} pts`,
      tone: costPctRav <= 2.6 ? "good" : costPctRav <= 3.2 ? "warn" : "bad",
      hint: "Rolling 12-month maintenance spend ÷ replacement asset value.",
    },
    {
      id: "loss",
      label: "Unplanned downtime loss",
      value: unplannedLoss,
      unit: "SAR",
      delta: `${latest.downtime} hrs`,
      tone: unplannedLoss > 4_000_000 ? "bad" : unplannedLoss > 2_000_000 ? "warn" : "good",
      hint: "Unplanned downtime hours × plant-specific cost of lost generation.",
    },
    {
      id: "pm",
      label: "PM compliance",
      value: latest.pm,
      unit: "%",
      delta: `${round(latest.pm - monthly[monthly.length - 2].pm, 1)} pts`,
      tone: latest.pm >= 85 ? "good" : latest.pm >= 70 ? "warn" : "bad",
      hint: "PM items completed by due date ÷ PM items due in the period.",
    },
    {
      id: "statutory",
      label: "Statutory backlog",
      value: statutoryBacklog,
      unit: "",
      delta: statutoryBacklog === 0 ? "clear" : "open",
      tone: statutoryBacklog === 0 ? "good" : statutoryBacklog > 4 ? "bad" : "warn",
      hint: "Open statutory inspections or compliance actions past their due date.",
    },
  ];

  const backlog = [
    { label: "0–7 days", value: Math.round(48 * (plant.slug === "wind" ? 0.5 : 1)) },
    { label: "8–30 days", value: Math.round(31 * (plant.slug === "wind" ? 0.6 : 1)) },
    { label: "31–90 days", value: Math.round(18 * (plant.slug === "wind" ? 0.4 : 1)) },
    { label: "> 90 days", value: Math.round(9 * (plant.slug === "thermal" ? 1.6 : 1)) },
  ];

  const priorityMix = [
    { label: "Critical", value: Math.round(latest.notifications * 0.12) },
    { label: "High", value: Math.round(latest.notifications * 0.28) },
    { label: "Medium", value: Math.round(latest.notifications * 0.42) },
    { label: "Low", value: Math.round(latest.notifications * 0.18) },
  ];

  const departments = departmentNames[plant.slug].map((label, index) => ({
    label,
    value: Math.round(latest.workOrders * [0.3, 0.24, 0.18, 0.16, 0.12][index]),
  }));

  const costBreakdown = [
    { label: "Manpower", value: Math.round(annualCost * 0.42) },
    { label: "Spares", value: Math.round(annualCost * 0.34) },
    { label: "Contractors", value: Math.round(annualCost * 0.16) },
    { label: "Services", value: Math.round(annualCost * 0.08) },
  ];

  const crewLoad = ["Boiler", "Turbine", "Electrical", "C&I", "Operations"].map((label, index) => ({
    label,
    value: [86, 78, 64, 71, 58][index],
  }));

  const permitCycle = [
    { label: "Issue", value: 3.2 },
    { label: "Work", value: 18.4 },
    { label: "Return", value: 6.1 },
    { label: "Closure", value: 2.4 },
  ];

  const checklistCompletion = ["Boiler", "Turbine", "Electrical", "C&I"].map((label, index) => ({
    label,
    value: [92, 86, 78, 81][index],
  }));

  return {
    plant,
    kpis,
    monthly,
    backlog,
    priorityMix,
    departments,
    badActors: buildBadActors(plant, rand),
    workOrders: buildWorkOrders(plant, rand),
    permits: buildPermits(plant, rand),
    costBreakdown,
    rca: buildRca(plant, rand),
    findings: buildFindings(plant, rand),
    crewLoad,
    materialReadiness,
    permitCycle,
    checklistCompletion,
    dataQuality,
    sapSyncHealth: plant.slug === "thermal" ? "Last sync 14 min ago · 2 warnings" : "Last sync 4 min ago · healthy",
    generatedAt: "12 Nov 2026, 16:40",
  };
}

export function getAllPlantData(): PlantData[] {
  return plants.map((plant) => getPlantData(plant.slug)!).filter(Boolean);
}
