import { AUDIT_DATE } from "./framework";
import type {
  AuditDataset,
  Bom,
  CatalogCode,
  Confirmation,
  Equipment,
  Floc,
  MaintenancePlan,
  MeasuringPoint,
  Notification,
  Order,
  PlanItem,
  Reservation,
  TaskList,
  TaskListOperation,
  WorkCenter,
} from "./types";

const DAY = 86_400_000;
const AUDIT_MS = Date.parse(`${AUDIT_DATE}T00:00:00Z`);

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

function iso(ms: number) {
  return new Date(ms).toISOString().slice(0, 10);
}

function weighted<T>(rand: () => number, entries: [T, number][]): T {
  const total = entries.reduce((sum, [, weight]) => sum + weight, 0);
  let roll = rand() * total;
  for (const [value, weight] of entries) {
    roll -= weight;
    if (roll <= 0) return value;
  }
  return entries[entries.length - 1][0];
}

const UNITS = [
  { code: "GT1", name: "Gas turbine 1" },
  { code: "GT2", name: "Gas turbine 2" },
  { code: "ST1", name: "Steam turbine 1" },
  { code: "BOP", name: "Balance of plant" },
];

const SYSTEMS = [
  { code: "AIR", name: "Air intake" },
  { code: "FUEL", name: "Fuel gas" },
  { code: "LUBE", name: "Lube oil" },
  { code: "COOL", name: "Cooling water" },
  { code: "EXH", name: "Exhaust" },
  { code: "GEN", name: "Generator" },
  { code: "CTRL", name: "Control and instrumentation" },
];

const EQ_ARTS = [
  "Pump",
  "Motor",
  "Valve",
  "Compressor",
  "Turbine",
  "Heat exchanger",
  "Fan",
  "Transformer",
  "Filter",
  "Actuator",
];

const OEM = [
  "Siemens Energy",
  "GE Vernova",
  "ABB",
  "Sulzer",
  "Flowserve",
  "Emerson",
  "Atlas Copco",
  "Torishima",
];

const TL_TEXTS = [
  "500h inspection",
  "Lube oil change",
  "Vibration check",
  "Filter replacement",
  "Bearing inspection",
  "Cooling water test",
  "Fuel valve service",
  "Generator brush check",
];

const OP_TEXTS = [
  "Isolate and lock",
  "Drain and vent",
  "Inspect for wear",
  "Replace filter element",
  "Torque to specification",
  "Record vibration reading",
  "Clean and reassemble",
  "Restore and test",
];

const ORDER_TEXTS = [
  "Replace lube oil filter",
  "Investigate high vibration",
  "Repair fuel gas valve",
  "Inspect bearing clearance",
  "Service cooling water pump",
  "Overhaul compressor stage",
  "Calibrate transmitter",
  "Replace coupling element",
  "Attend oil leak",
  "Inspect exhaust thermocouples",
];

const NOTIF_TEXTS = [
  "High vibration on bearing",
  "Oil leak at flange",
  "Temperature above alarm",
  "Abnormal noise during start",
  "Valve failing to stroke",
  "Pressure drop across filter",
  "Cooling water leak",
  "Generator brush wear",
];

export function buildSyntheticDataset(seed = 1000): AuditDataset {
  const rand = mulberry32(seed);
  const chance = (probability: number) => rand() < probability;
  const pick = <T,>(values: T[]): T => values[Math.floor(rand() * values.length)];
  const daysAgo = (min: number, max: number) =>
    iso(AUDIT_MS - Math.round((min + rand() * (max - min)) * DAY));
  const daysAhead = (min: number, max: number) =>
    iso(AUDIT_MS + Math.round((min + rand() * (max - min)) * DAY));

  /* ---------------------------------------------------------------- */
  /* Work centres                                                     */
  /* ---------------------------------------------------------------- */
  const disciplines = [
    ["MECH", 6],
    ["ELEC", 5],
    ["C&I", 5],
    ["MACH", 4],
    ["CIV", 4],
  ] as const;
  const workCenters: WorkCenter[] = [];
  for (const [discipline, count] of disciplines) {
    for (let index = 1; index <= count; index += 1) {
      workCenters.push({
        objid: `WC${workCenters.length + 1}`,
        arbpl: `${discipline}-${String(index).padStart(2, "0")}`,
        werk: "1000",
        verwe: "0005",
        kapid: `KAP-${discipline}-${index}`,
        kostl: `CC-${discipline}`,
        lstar: chance(0.9) ? `ACT-${discipline}` : "",
      });
    }
  }

  /* ---------------------------------------------------------------- */
  /* Functional locations                                             */
  /* ---------------------------------------------------------------- */
  const flocs: Floc[] = [];
  const root: Floc = {
    tplnr: "1000",
    pltxt: "Combined cycle power plant",
    tplkz: "KKS",
    fltyp: "PLANT",
    tplma: "",
    swerk: "1000",
    kostl: "CC-PLANT",
    abckz: "A",
    objnr: "OR1000",
    active: true,
  };
  flocs.push(root);

  for (const unit of UNITS) {
    const unitCode = `1000-${unit.code}`;
    flocs.push({
      tplnr: unitCode,
      pltxt: unit.name,
      tplkz: chance(0.92) ? "KKS" : "",
      fltyp: "UNIT",
      tplma: "1000",
      swerk: "1000",
      kostl: chance(0.12) ? "" : `CC-${unit.code}`,
      abckz: chance(0.04) ? "" : weighted(rand, [["A", 0.35], ["B", 0.45], ["C", 0.2]] as const),
      objnr: `OR-${unitCode}`,
      active: chance(0.97),
    });

    for (const system of SYSTEMS) {
      const systemCode = `${unitCode}-${system.code}`;
      flocs.push({
        tplnr: systemCode,
        pltxt: `${unit.name} — ${system.name.toLowerCase()}`,
        tplkz: chance(0.92) ? "KKS" : "",
        fltyp: "SYSTEM",
        tplma: unitCode,
        swerk: "1000",
        kostl: chance(0.12) ? "" : `CC-${unit.code}-${system.code}`,
        abckz: chance(0.04) ? "" : weighted(rand, [["A", 0.3], ["B", 0.45], ["C", 0.25]] as const),
        objnr: `OR-${systemCode}`,
        active: chance(0.97),
      });

      const assetCount = 7;
      for (let index = 1; index <= assetCount; index += 1) {
        const assetCode = `${systemCode}-${String(index).padStart(2, "0")}`;
        flocs.push({
          tplnr: assetCode,
          pltxt: `${system.name} asset ${index}`,
          tplkz: chance(0.92) ? "KKS" : "",
          fltyp: "ASSET",
          tplma: systemCode,
          swerk: "1000",
          kostl: chance(0.12) ? "" : `CC-${unit.code}-${system.code}`,
          abckz: chance(0.04)
            ? ""
            : weighted(rand, [["A", 0.25], ["B", 0.45], ["C", 0.3]] as const),
          objnr: `OR-${assetCode}`,
          active: chance(0.97),
        });
      }
    }
  }

  const assetFlocs = flocs.filter((floc) => floc.fltyp === "ASSET");

  /* ---------------------------------------------------------------- */
  /* Equipment                                                        */
  /* ---------------------------------------------------------------- */
  const equipment: Equipment[] = [];
  for (let index = 0; index < 850; index += 1) {
    const equnr = String(10_000_000 + index);
    const abckz = weighted(rand, [["A", 0.28], ["B", 0.45], ["C", 0.27]] as const);
    const installed = chance(0.92);
    const floc = installed ? pick(assetFlocs) : undefined;
    const eqart = pick(EQ_ARTS);
    const missingOem = abckz === "A" ? chance(0.015) : chance(0.18);

    equipment.push({
      equnr,
      eqktx: `${eqart} ${String(index + 1).padStart(3, "0")}`,
      eqtyp: "M",
      eqart,
      herst: missingOem ? "" : pick(OEM),
      typbz: missingOem ? "" : `${eqart.slice(0, 3).toUpperCase()}-${100 + Math.floor(rand() * 800)}`,
      serge: `SN-${String(index + 1).padStart(5, "0")}`,
      tplnr: floc?.tplnr ?? "",
      hequi: "",
      abckz,
      gewrk: chance(0.9) ? pick(workCenters).arbpl : "",
      kostl: chance(0.94) ? `CC-${pick(UNITS).code}` : "",
      anlnr: chance(0.85) ? `ANL-${String(index + 1).padStart(6, "0")}` : "",
      inbdt: chance(0.95) ? daysAgo(400, 6000) : "",
      active: chance(0.97),
    });
  }

  /* ---------------------------------------------------------------- */
  /* BOMs                                                             */
  /* ---------------------------------------------------------------- */
  const boms: Bom[] = [];
  for (const item of equipment) {
    if (item.abckz !== "A") continue;
    if (!chance(0.8)) continue;
    boms.push({
      equnr: item.equnr,
      stlnr: `BOM-${String(boms.length + 1).padStart(6, "0")}`,
      stlan: "4",
      items: 5 + Math.floor(rand() * 14),
      obsoleteItems: chance(0.06) ? 1 + Math.floor(rand() * 3) : 0,
    });
  }

  /* ---------------------------------------------------------------- */
  /* Task lists                                                       */
  /* ---------------------------------------------------------------- */
  const taskLists: TaskList[] = [];
  const taskListOperations: TaskListOperation[] = [];
  for (let index = 0; index < 150; index += 1) {
    const plnnr = String(400_000 + index);
    const released = chance(0.96);
    taskLists.push({
      plnty: chance(0.8) ? "E" : "A",
      plnnr,
      plnal: "01",
      verwe: "4",
      statu: released ? "4" : "1",
      ktext: pick(TL_TEXTS),
    });

    const operationCount = 4 + Math.floor(rand() * 9);
    for (let op = 1; op <= operationCount; op += 1) {
      taskListOperations.push({
        plnnr,
        vornr: String(op * 10).padStart(4, "0"),
        ltxa1: pick(OP_TEXTS),
        arbei: Math.round((0.5 + rand() * 15.5) * 10) / 10,
        anzahl: 1 + Math.floor(rand() * 3),
        released,
      });
    }
  }

  /* ---------------------------------------------------------------- */
  /* Measuring points                                                 */
  /* ---------------------------------------------------------------- */
  const measuringPoints: MeasuringPoint[] = [];
  for (let index = 0; index < 180; index += 1) {
    const counter = index < 90;
    const missingLimit = chance(0.08);
    measuringPoints.push({
      point: `MP-${String(index + 1).padStart(4, "0")}`,
      mpobj: pick(equipment).equnr,
      pttxt: counter
        ? `Running hours ${index + 1}`
        : `Condition reading ${index + 1}`,
      category: counter ? "counter" : "condition",
      indrv: true,
      mrmin: counter ? null : missingLimit && chance(0.5) ? null : 10,
      mrmax: counter ? null : missingLimit && chance(0.5) ? null : 90,
    });
  }

  /* ---------------------------------------------------------------- */
  /* Plans                                                            */
  /* ---------------------------------------------------------------- */
  const plans: MaintenancePlan[] = [];
  const planItems: PlanItem[] = [];
  for (let index = 0; index < 160; index += 1) {
    const warpl = String(500_000 + index);
    plans.push({
      warpl,
      wptxt: `${pick(TL_TEXTS)} — ${pick(UNITS).code}`,
      strat: chance(0.7) ? "TIME" : "COUNTER",
      horiz: 80 + Math.floor(rand() * 11),
      status: "REL",
    });

    const items = 1 + Math.floor(rand() * 3);
    for (let item = 1; item <= items; item += 1) {
      const eq = pick(equipment);
      planItems.push({
        warpl,
        wapos: String(item * 10).padStart(4, "0"),
        equnr: eq.equnr,
        tplnr: eq.tplnr,
        plnnr: pick(taskLists).plnnr,
        auart: chance(0.85) ? "PM02" : "PM01",
      });
    }
  }

  /* ---------------------------------------------------------------- */
  /* Catalogs                                                         */
  /* ---------------------------------------------------------------- */
  const catalogCodes: CatalogCode[] = [];
  const catalogs: Array<["B" | "C" | "5", string, string]> = [
    ["B", "OBJ", "Object part"],
    ["C", "DMG", "Damage"],
    ["5", "CAU", "Cause"],
  ];
  for (const [catalog, group, label] of catalogs) {
    for (let index = 0; index < 140; index += 1) {
      const generic = chance(0.22);
      catalogCodes.push({
        catalog,
        codegruppe: group,
        code: `${group}-${String(index + 1).padStart(3, "0")}`,
        kurztext: generic ? "OTHER / MISC" : `${label} ${index + 1}`,
        generic,
      });
    }
  }

  /* ---------------------------------------------------------------- */
  /* Notifications                                                    */
  /* ---------------------------------------------------------------- */
  const notifications: Notification[] = [];
  for (let index = 0; index < 620; index += 1) {
    const qmnum = String(3_000_000 + index);
    const qmart = weighted(rand, [["M1", 0.55], ["M2", 0.35], ["M3", 0.1]] as const);
    const open = chance(0.18);
    const aged = open && chance(0.3);
    const erdat = open
      ? aged
        ? daysAgo(61, 200)
        : daysAgo(0, 60)
      : daysAgo(0, 365);
    const missingCodes = qmart === "M2" && !open && chance(0.03);
    const eq = pick(equipment);

    notifications.push({
      qmnum,
      qmart,
      qmtxt: pick(NOTIF_TEXTS),
      equnr: chance(0.95) ? eq.equnr : "",
      tplnr: eq.tplnr,
      erdat,
      status: open ? "OPEN" : "CLOSED",
      msaaus: qmart === "M2",
      ausvn: qmart === "M2" && chance(0.8) ? erdat : "",
      fegrp: missingCodes ? "" : `DMG-${1 + Math.floor(rand() * 12)}`,
      fecod: missingCodes ? "" : `DMG-${1 + Math.floor(rand() * 12)}-${1 + Math.floor(rand() * 6)}`,
      otgrp: `OBJ-${1 + Math.floor(rand() * 12)}`,
    });
  }

  /* ---------------------------------------------------------------- */
  /* Orders                                                           */
  /* ---------------------------------------------------------------- */
  const orders: Order[] = [];
  for (let index = 0; index < 1450; index += 1) {
    const aufnr = String(6_000_000 + index);
    const status = weighted(
      rand,
      [
        ["CLSD", 0.55],
        ["TECO", 0.2],
        ["REL", 0.12],
        ["CNF", 0.08],
        ["CRTD", 0.05],
      ] as const,
    );
    const auart = weighted(rand, [["PM03", 0.35], ["PM02", 0.45], ["PM01", 0.2]] as const);
    const eq = pick(equipment);
    const notif = pick(notifications);

    let erdat: string;
    let gstrp: string;
    let gltrp: string;
    let idat2 = "";

    if (status === "CLSD" || status === "TECO") {
      erdat = daysAgo(60, 365);
      const start = Date.parse(`${erdat}T00:00:00Z`) + (1 + Math.floor(rand() * 10)) * DAY;
      const finish = Math.min(
        start + (1 + Math.floor(rand() * 20)) * DAY,
        AUDIT_MS - DAY,
      );
      gstrp = iso(start);
      gltrp = iso(finish);
      idat2 = iso(
        Math.min(finish + Math.floor(rand() * 10) * DAY, AUDIT_MS - DAY),
      );
    } else if (status === "CNF") {
      erdat = daysAgo(120, 250);
      const start = Date.parse(`${erdat}T00:00:00Z`) + (1 + Math.floor(rand() * 10)) * DAY;
      gstrp = iso(start);
      gltrp = iso(start + (1 + Math.floor(rand() * 20)) * DAY);
      idat2 = chance(0.35) ? daysAgo(31, 90) : daysAgo(1, 25);
    } else if (status === "REL") {
      if (chance(0.12)) {
        erdat = daysAgo(60, 150);
        const start = AUDIT_MS - (30 + Math.floor(rand() * 60)) * DAY;
        gstrp = iso(start);
        gltrp = iso(
          Math.min(start + (5 + Math.floor(rand() * 20)) * DAY, AUDIT_MS - DAY),
        );
      } else {
        erdat = daysAgo(0, 60);
        gstrp = daysAhead(0, 20);
        gltrp = daysAhead(5, 60);
      }
    } else {
      erdat = chance(0.03) ? daysAgo(31, 90) : daysAgo(0, 25);
      gstrp = daysAhead(1, 30);
      gltrp = daysAhead(10, 60);
    }

    orders.push({
      aufnr,
      auart,
      autyp: "30",
      ktext: pick(ORDER_TEXTS),
      equnr: chance(0.95) ? eq.equnr : "",
      tplnr: eq.tplnr,
      erdat,
      gstrp,
      gltrp,
      status,
      idat2,
      kostv: chance(0.95) ? `CC-${pick(UNITS).code}` : "",
      warpl: auart === "PM02" && chance(0.7) ? pick(plans).warpl : "",
      qmnum: auart === "PM03" && chance(0.6) ? notif.qmnum : "",
    });
  }


  /* ---------------------------------------------------------------- */
  /* Confirmations                                                    */
  /* ---------------------------------------------------------------- */
  const confirmations: Confirmation[] = [];
  let confirmationNumber = 8_000_000;
  for (const order of orders) {
    const completed = order.status === "TECO" || order.status === "CLSD";
    const partial = order.status === "CNF" || order.status === "REL";
    if (completed && !chance(0.96)) continue;
    if (partial && !chance(0.4)) continue;

    const count = completed ? 1 + Math.floor(rand() * 6) : 1 + Math.floor(rand() * 2);
    for (let index = 0; index < count; index += 1) {
      confirmationNumber += 1;
      const booking = order.gltrp ? Date.parse(`${order.gltrp}T00:00:00Z`) : AUDIT_MS;
      const budat = iso(Math.min(booking + Math.floor(rand() * 4) * DAY, AUDIT_MS - DAY));
      confirmations.push({
        rueck: String(confirmationNumber),
        aufnr: order.aufnr,
        ismnw: Math.round((0.5 + rand() * 7.5) * 10) / 10,
        budat,
        erdat: budat,
        aueru: true,
        stokz: false,
      });
    }
  }

  /* ---------------------------------------------------------------- */
  /* Reservations                                                     */
  /* ---------------------------------------------------------------- */
  const reservations: Reservation[] = [];
  let reservationNumber = 7_000_000;
  for (const order of orders) {
    const completed = order.status === "TECO" || order.status === "CLSD";
    if (completed) {
      reservationNumber += 1;
      const quantity = 1 + Math.floor(rand() * 10);
      reservations.push({
        rsnum: String(reservationNumber),
        aufnr: order.aufnr,
        matnr: `MAT-${String(1000 + Math.floor(rand() * 400))}`,
        bdmng: quantity,
        enmng: quantity,
        kzear: true,
        xloek: false,
        bdter: order.gltrp,
      });
    } else if (order.status === "REL" && chance(0.2)) {
      reservationNumber += 1;
      reservations.push({
        rsnum: String(reservationNumber),
        aufnr: order.aufnr,
        matnr: `MAT-${String(1000 + Math.floor(rand() * 400))}`,
        bdmng: 1 + Math.floor(rand() * 6),
        enmng: 0,
        kzear: false,
        xloek: false,
        bdter: order.gstrp,
      });
    }
  }

  return {
    flocs,
    equipment,
    boms,
    workCenters,
    taskLists,
    taskListOperations,
    measuringPoints,
    plans,
    planItems,
    catalogCodes,
    notifications,
    orders,
    confirmations,
    reservations,
  };
}
