import type {
  AuditDomain,
  AuditCheck,
  DomainId,
  Severity,
  RowLike,
} from "./types";

export const FRAMEWORK_VERSION = "1.0.0";

export const AUDIT_DATE = "2026-11-14";

export const AUDIT_CONTEXT = {
  system: "SAP S/4HANA",
  client: "100",
  plant: "1000",
  plantName: "Combined Cycle Power Plant",
  lead: "Demo assessment",
  framework: "Pramaan ERP audit framework · SAP PM pack",
} as const;

export const DOMAINS: AuditDomain[] = [
  { id: "FL", name: "Functional locations", section: "Master data", tables: ["IFLOT", "IFLOTX", "ILOA"] },
  { id: "EQ", name: "Equipment master", section: "Master data", tables: ["EQUI", "EQKT", "EQUZ", "ILOA"] },
  { id: "BM", name: "Equipment & FL BOMs", section: "Master data", tables: ["EQST", "TPST", "STKO", "STPO"] },
  { id: "WC", name: "Work centres & capacity", section: "Master data", tables: ["CRHD", "CRTX", "KAKO", "CRCO"] },
  { id: "TL", name: "Task lists", section: "Master data", tables: ["PLKO", "PLPO", "PLMZ"] },
  { id: "MP", name: "Measuring points", section: "Master data", tables: ["IMPTT", "IMRG"] },
  { id: "PL", name: "Maintenance plans", section: "Master data", tables: ["MPLA", "MPOS", "MHIS"] },
  { id: "CT", name: "Catalogs & codes", section: "Master data", tables: ["QPGR", "QPCD", "QPCT"] },
  { id: "QM", name: "Notifications", section: "Transactional", tables: ["QMEL", "QMFE", "JEST"] },
  { id: "AU", name: "Orders & backlog", section: "Transactional", tables: ["AUFK", "AFIH", "JEST"] },
  { id: "AF", name: "Scheduling & dates", section: "Transactional", tables: ["AFKO", "AFVC"] },
  { id: "FR", name: "Confirmations", section: "Transactional", tables: ["AFRU", "AFVV"] },
  { id: "RS", name: "Reservations", section: "Transactional", tables: ["RESB", "MSEG"] },
];

export const SEVERITY_WEIGHT: Record<Severity, number> = {
  Critical: 5,
  High: 3,
  Medium: 1,
};

export const SLA_DAYS: Record<Severity, number> = {
  Critical: 14,
  High: 30,
  Medium: 60,
};

export const OWNER_BY_DOMAIN: Record<DomainId, string> = {
  FL: "Asset data owner",
  EQ: "Asset data owner",
  BM: "Reliability engineering",
  WC: "Planning",
  TL: "Reliability engineering",
  MP: "Condition monitoring",
  PL: "Planning",
  CT: "Reliability engineering",
  QM: "Maintenance execution",
  AU: "Work control",
  AF: "Work control",
  FR: "Work control",
  RS: "Materials management",
};

const SOURCE = "SAP PM complete audit workbook · 2026";

type EnabledCheck = Omit<AuditCheck, "enabled"> & { enabled?: true };

function active(id: string, check: EnabledCheck): AuditCheck {
  return { ...check, enabled: true };
}

function planned(
  id: string,
  domain: DomainId,
  title: string,
  tables: string[],
  severity: Severity,
  benchmark: string,
): AuditCheck {
  return {
    id,
    domain,
    title,
    question: title,
    tables,
    ruleSummary: "Planned for the next release — not evaluated in this run.",
    maxExceptionPct: 0,
    benchmark,
    severity,
    evidence: [],
    remediation: { tcode: "—", action: "Planned for the next release." },
    source: SOURCE,
    enabled: false,
  };
}

/* ------------------------------------------------------------------ */
/* v1 checks — 20 enabled, every domain covered                        */
/* ------------------------------------------------------------------ */

const v1: AuditCheck[] = [
  active("FL-02", {
    id: "FL-02",
    domain: "FL",
    title: "Active FLOCs missing plant or cost centre",
    question: "Do all active functional locations carry a maintenance plant and cost centre?",
    tables: ["IFLOT", "ILOA"],
    ruleSummary: "Active IFLOT rows where ILOA-KOSTL or SWERK is blank.",
    rule: {
      kind: "missing",
      entity: "flocs",
      fields: ["kostl", "swerk"],
      where: (row) => row.active === true,
    },
    maxExceptionPct: 0,
    benchmark: "0% of active FLOCs missing plant or cost centre",
    severity: "Critical",
    evidence: ["tplnr", "pltxt", "swerk", "kostl"],
    remediation: {
      tcode: "IL05",
      bapi: "BAPI_FUNCLOC_CHANGE",
      action: "Assign plant and cost centre through IL05 mass change; confirm the hierarchy owner.",
    },
    source: SOURCE,
  }),
  active("FL-03", {
    id: "FL-03",
    domain: "FL",
    title: "Active FLOCs without ABC criticality",
    question: "Is every active functional location classified A, B or C?",
    tables: ["IFLOT", "ILOA"],
    ruleSummary: "Active IFLOT rows where ABCKZ is blank.",
    rule: {
      kind: "missing",
      entity: "flocs",
      fields: ["abckz"],
      where: (row) => row.active === true,
    },
    maxExceptionPct: 5,
    benchmark: "< 5% of active FLOCs without ABC criticality",
    severity: "High",
    evidence: ["tplnr", "pltxt", "abckz"],
    remediation: {
      tcode: "IL05",
      bapi: "BAPI_FUNCLOC_CHANGE",
      action: "Set the ABC indicator from the criticality assessment; make the field mandatory in the FLOC screen.",
    },
    source: SOURCE,
  }),
  active("EQ-02", {
    id: "EQ-02",
    domain: "EQ",
    title: "Class A equipment missing OEM or model",
    question: "Do critical assets carry a manufacturer and model?",
    tables: ["EQUI", "ILOA"],
    ruleSummary: "EQUI rows with ABC class A where HERST or TYPBZ is blank.",
    rule: {
      kind: "missing",
      entity: "equipment",
      fields: ["herst", "typbz"],
      where: (row) => row.abckz === "A" && row.active === true,
    },
    maxExceptionPct: 2,
    benchmark: "< 2% of Class A equipment missing OEM or model",
    severity: "High",
    evidence: ["equnr", "eqktx", "herst", "typbz", "abckz"],
    remediation: {
      tcode: "IE05",
      bapi: "BAPI_EQUI_CHANGE",
      action: "Complete manufacturer and model from OEM nameplates; block release without them.",
    },
    source: SOURCE,
  }),
  active("EQ-03", {
    id: "EQ-03",
    domain: "EQ",
    title: "Equipment not installed at a functional location",
    question: "Is every active equipment record installed somewhere in the hierarchy?",
    tables: ["EQUI", "EQUZ", "ILOA"],
    ruleSummary: "Active equipment whose installation (TPLNR) is blank.",
    rule: {
      kind: "orphan",
      entity: "equipment",
      field: "tplnr",
      parent: "flocs",
      parentField: "tplnr",
      where: (row) => row.active === true,
    },
    maxExceptionPct: 5,
    benchmark: "< 5% of active equipment not installed at a FLOC",
    severity: "Critical",
    evidence: ["equnr", "eqktx", "tplnr", "abckz"],
    remediation: {
      tcode: "IE05",
      bapi: "BAPI_EQUI_CHANGE",
      action: "Install equipment into the functional-location hierarchy and clear the unassigned list.",
    },
    source: SOURCE,
  }),
  active("BM-01", {
    id: "BM-01",
    domain: "BM",
    title: "Class A equipment without a spare-parts BOM",
    question: "Do critical assets have a bill of material for their spares?",
    tables: ["EQST", "STKO", "STPO"],
    ruleSummary: "Class A equipment with no EQST BOM link.",
    rule: {
      kind: "orphan",
      entity: "equipment",
      field: "equnr",
      parent: "boms",
      parentField: "equnr",
      where: (row) => row.abckz === "A" && row.active === true,
    },
    maxExceptionPct: 10,
    benchmark: ">= 90% of Class A equipment has a BOM",
    severity: "High",
    evidence: ["equnr", "eqktx", "abckz", "herst"],
    remediation: {
      tcode: "IB01",
      bapi: "CSAP_MAT_BOM_MAINTAIN",
      action: "Create equipment BOMs for Class A assets from the OEM spare-parts list.",
    },
    source: SOURCE,
  }),
  active("WC-02", {
    id: "WC-02",
    domain: "WC",
    title: "Work centre without capacity",
    question: "Does every PM work centre have a capacity header and shift pattern?",
    tables: ["CRHD", "KAKO"],
    ruleSummary: "PM work centres (VERWE = 0005) with no capacity ID (KAPID).",
    rule: {
      kind: "missing",
      entity: "workCenters",
      fields: ["kapid"],
      where: (row) => row.verwe === "0005",
    },
    maxExceptionPct: 0,
    benchmark: "100% of PM work centres have a capacity header",
    severity: "Critical",
    evidence: ["arbpl", "werk", "kapid", "kostl"],
    remediation: {
      tcode: "IR02",
      spro: "OP40",
      action: "Maintain the capacity header, shift pattern and individual capacity for each PM work centre.",
    },
    source: SOURCE,
  }),
  active("TL-01", {
    id: "TL-01",
    domain: "TL",
    title: "Task lists not released",
    question: "Are task lists released for use, or stuck as drafts?",
    tables: ["PLKO"],
    ruleSummary: "Task lists where STATU is not 4 (released).",
    rule: {
      kind: "status",
      entity: "taskLists",
      field: "statu",
      allowed: ["4"],
      where: (row) => row.verwe === "4",
    },
    maxExceptionPct: 5,
    benchmark: ">= 95% of task lists released",
    severity: "High",
    evidence: ["plnnr", "ktext", "plnty", "statu"],
    remediation: {
      tcode: "IA08",
      action: "Release task lists after review; retire drafts that are no longer used.",
    },
    source: SOURCE,
  }),
  active("TL-02", {
    id: "TL-02",
    domain: "TL",
    title: "Operations with zero planned work",
    question: "Does every operation carry a planned work estimate?",
    tables: ["PLPO"],
    ruleSummary: "Operations on released task lists with ARBEI = 0.",
    rule: {
      kind: "zero",
      entity: "taskListOperations",
      field: "arbei",
      where: (row) => row.released === true,
    },
    maxExceptionPct: 0,
    benchmark: "0 operations with zero planned work",
    severity: "Critical",
    evidence: ["plnnr", "vornr", "ltxa1", "arbei"],
    remediation: {
      tcode: "IA08",
      action: "Add planned work to every operation; zero-hour operations cannot be scheduled or costed.",
    },
    source: SOURCE,
  }),
  active("MP-01", {
    id: "MP-01",
    domain: "MP",
    title: "Running-hour points not flagged as counters",
    question: "Are operating-hour and start-count points configured as counters?",
    tables: ["IMPTT"],
    ruleSummary: "Measuring points with counter category and INDRV not set.",
    rule: {
      kind: "custom",
      run: ({ dataset }) => {
        const rows = dataset.measuringPoints.filter((point) => point.category === "counter");
        const bad = rows.filter((point) => !point.indrv);
        return {
          total: rows.length,
          exceptions: bad.length,
          sample: bad.slice(0, 5) as unknown as RowLike[],
        };
      },
    },
    maxExceptionPct: 0,
    benchmark: "100% of counter points flagged as counters",
    severity: "High",
    evidence: ["point", "pttxt", "mpobj", "indrv"],
    remediation: {
      tcode: "IK08",
      action: "Set the counter indicator on running-hour and start-count points; correct the unit.",
    },
    source: SOURCE,
  }),
  active("MP-02", {
    id: "MP-02",
    domain: "MP",
    title: "Condition points without warning limits",
    question: "Do condition-monitoring points have lower and upper limits?",
    tables: ["IMPTT"],
    ruleSummary: "Condition points with MRMIN or MRMAX missing.",
    rule: {
      kind: "missing",
      entity: "measuringPoints",
      fields: ["mrmin", "mrmax"],
      where: (row) => row.category === "condition",
    },
    maxExceptionPct: 10,
    benchmark: ">= 90% of condition points have limits",
    severity: "High",
    evidence: ["point", "pttxt", "mrmin", "mrmax"],
    remediation: {
      tcode: "IK08",
      action: "Set lower and upper warning limits for condition points from OEM alarm limits.",
    },
    source: SOURCE,
  }),
  active("PL-01", {
    id: "PL-01",
    domain: "PL",
    title: "Plans never scheduled",
    question: "Has every active maintenance plan produced a call?",
    tables: ["MPLA", "MHIS"],
    ruleSummary: "Plans where status is CRTD (never scheduled).",
    rule: {
      kind: "status",
      entity: "plans",
      field: "status",
      allowed: ["REL"],
    },
    maxExceptionPct: 0,
    benchmark: "0 active plans left unscheduled",
    severity: "Critical",
    evidence: ["warpl", "wptxt", "strat", "horiz"],
    remediation: {
      tcode: "IP10",
      action: "Run IP10 scheduling and fix plans that never produced a call; retire unused plans.",
    },
    source: SOURCE,
  }),
  active("PL-03", {
    id: "PL-03",
    domain: "PL",
    title: "Plan items without a task list",
    question: "Does every maintenance item reference a task list?",
    tables: ["MPOS", "PLKO"],
    ruleSummary: "Plan items where PLNNR is blank.",
    rule: {
      kind: "missing",
      entity: "planItems",
      fields: ["plnnr"],
    },
    maxExceptionPct: 5,
    benchmark: ">= 95% of plan items have a task list",
    severity: "Critical",
    evidence: ["warpl", "wapos", "equnr", "plnnr"],
    remediation: {
      tcode: "IP02",
      action: "Assign a task list to every maintenance item; items without a list generate empty orders.",
    },
    source: SOURCE,
  }),
  active("CT-02", {
    id: "CT-02",
    domain: "CT",
    title: "Generic codes dominate the catalogs",
    question: "Are failure codes specific enough to analyse?",
    tables: ["QPGR", "QPCD", "QPCT"],
    ruleSummary: "Share of generic OTHER/MISC codes across active catalogs.",
    rule: {
      kind: "custom",
      run: ({ dataset }) => {
        const rows = dataset.catalogCodes;
        const bad = rows.filter((code) => code.generic);
        return {
          total: rows.length,
          exceptions: bad.length,
          sample: bad.slice(0, 5) as unknown as RowLike[],
        };
      },
    },
    maxExceptionPct: 15,
    benchmark: "< 15% generic codes in active catalogs",
    severity: "High",
    evidence: ["catalog", "codegruppe", "code", "kurztext"],
    remediation: {
      tcode: "QS41",
      action: "Prune generic OTHER/MISC codes; force a specific damage or cause code on M2.",
    },
    source: SOURCE,
  }),
  active("QM-01", {
    id: "QM-01",
    domain: "QM",
    title: "Open notifications older than 60 days",
    question: "Is the notification backlog being worked?",
    tables: ["QMEL", "JEST"],
    ruleSummary: "Open notifications with ERDAT older than 60 days.",
    rule: {
      kind: "aging",
      entity: "notifications",
      dateField: "erdat",
      olderThanDays: 60,
      where: (row) => row.status === "OPEN",
    },
    maxExceptionPct: 10,
    benchmark: "< 10% open notifications older than 60 days",
    severity: "High",
    evidence: ["qmnum", "qmtxt", "qmart", "erdat"],
    remediation: {
      tcode: "IW28",
      action: "Triage the aged open backlog; close or convert to orders with a named owner.",
    },
    source: SOURCE,
  }),
  active("QM-03", {
    id: "QM-03",
    domain: "QM",
    title: "Closed breakdowns without failure codes",
    question: "Do closed breakdown notifications carry object part, damage and cause codes?",
    tables: ["QMEL", "QMFE"],
    ruleSummary: "Closed M2 notifications with FEGRP or FECOD blank.",
    rule: {
      kind: "missing",
      entity: "notifications",
      fields: ["fegrp", "fecod"],
      where: (row) => row.qmart === "M2" && row.status === "CLOSED",
    },
    maxExceptionPct: 5,
    benchmark: ">= 95% of closed M2 notifications carry failure codes",
    severity: "Critical",
    evidence: ["qmnum", "qmtxt", "fegrp", "fecod"],
    remediation: {
      tcode: "IW22",
      spro: "OIAN",
      action: "Require object part, damage and cause codes before closing an M2 notification.",
    },
    source: SOURCE,
  }),
  active("AU-01", {
    id: "AU-01",
    domain: "AU",
    title: "CRTD orders older than 30 days",
    question: "Are created orders being released or rejected promptly?",
    tables: ["AUFK", "JEST"],
    ruleSummary: "CRTD orders with ERDAT older than 30 days.",
    rule: {
      kind: "aging",
      entity: "orders",
      dateField: "erdat",
      olderThanDays: 30,
      where: (row) => row.status === "CRTD",
    },
    maxExceptionPct: 5,
    benchmark: "< 5% CRTD orders older than 30 days",
    severity: "High",
    evidence: ["aufnr", "ktext", "auart", "erdat"],
    remediation: {
      tcode: "IW38",
      action: "Release or reject orders older than 30 days; add a weekly backlog review.",
    },
    source: SOURCE,
  }),
  active("AU-02", {
    id: "AU-02",
    domain: "AU",
    title: "Confirmed orders stuck before TECO",
    question: "Are confirmed orders technically completed at month-end?",
    tables: ["AUFK", "AFKO", "JEST"],
    ruleSummary: "CNF orders with a confirmation date older than 30 days.",
    rule: {
      kind: "aging",
      entity: "orders",
      dateField: "idat2",
      olderThanDays: 30,
      where: (row) => row.status === "CNF",
    },
    maxExceptionPct: 0,
    benchmark: "0 CNF orders older than 30 days",
    severity: "High",
    evidence: ["aufnr", "ktext", "idat2", "status"],
    remediation: {
      tcode: "IW38",
      action: "Technically complete confirmed orders at month-end; reconcile CNF to TECO.",
    },
    source: SOURCE,
  }),
  active("AF-01", {
    id: "AF-01",
    domain: "AF",
    title: "Released orders past their finish date",
    question: "Is the released backlog inside its promised dates?",
    tables: ["AUFK", "AFKO"],
    ruleSummary: "REL orders whose GLTRP is before the audit date.",
    rule: {
      kind: "aging",
      entity: "orders",
      dateField: "gltrp",
      olderThanDays: 0,
      where: (row) => row.status === "REL",
    },
    maxExceptionPct: 15,
    benchmark: "< 15% released orders past basic finish",
    severity: "High",
    evidence: ["aufnr", "ktext", "gltrp", "status"],
    remediation: {
      tcode: "IW38",
      action: "Reschedule or close released orders past their basic finish; review the weekly overdue list.",
    },
    source: SOURCE,
  }),
  active("FR-04", {
    id: "FR-04",
    domain: "FR",
    title: "Completed orders with zero confirmed hours",
    question: "Was labour actually booked before the order was completed?",
    tables: ["AFRU", "AUFK"],
    ruleSummary: "TECO/CLSD orders with no confirmed hours.",
    rule: {
      kind: "custom",
      run: ({ dataset }) => {
        const done = dataset.orders.filter(
          (order) => order.status === "TECO" || order.status === "CLSD",
        );
        const hours = new Map<string, number>();
        for (const confirmation of dataset.confirmations) {
          if (confirmation.stokz) continue;
          hours.set(
            confirmation.aufnr,
            (hours.get(confirmation.aufnr) ?? 0) + confirmation.ismnw,
          );
        }
        const bad = done.filter((order) => (hours.get(order.aufnr) ?? 0) <= 0);
        return {
          total: done.length,
          exceptions: bad.length,
          sample: bad.slice(0, 5) as unknown as RowLike[],
        };
      },
    },
    maxExceptionPct: 5,
    benchmark: "< 5% completed orders with zero confirmed hours",
    severity: "High",
    evidence: ["aufnr", "ktext", "status", "gltrp"],
    remediation: {
      tcode: "IW41",
      action: "Confirm actual hours before TECO; investigate completed orders with zero labour.",
    },
    source: SOURCE,
  }),
  active("RS-01", {
    id: "RS-01",
    domain: "RS",
    title: "Open reservations on completed orders",
    question: "Are spare-part reservations closed when the order is completed?",
    tables: ["RESB", "AUFK"],
    ruleSummary: "Open reservations whose order is TECO/CLSD.",
    rule: {
      kind: "custom",
      run: ({ dataset }) => {
        const completed = new Set(
          dataset.orders
            .filter((order) => order.status === "TECO" || order.status === "CLSD")
            .map((order) => order.aufnr),
        );
        const rows = dataset.reservations.filter((reservation) =>
          completed.has(reservation.aufnr),
        );
        const bad = rows.filter(
          (reservation) => !reservation.kzear && !reservation.xloek,
        );
        return {
          total: rows.length,
          exceptions: bad.length,
          sample: bad.slice(0, 5) as unknown as RowLike[],
        };
      },
    },
    maxExceptionPct: 0,
    benchmark: "0 open reservations on TECO/CLSD orders",
    severity: "High",
    evidence: ["rsnum", "aufnr", "matnr", "bdmng", "enmng"],
    remediation: {
      tcode: "MB25",
      action: "Finally issue or delete reservations on completed orders; block TECO with open reservations.",
    },
    source: SOURCE,
  }),
];

/* ------------------------------------------------------------------ */
/* Planned checks — the rest of the workbook, kept visible             */
/* ------------------------------------------------------------------ */

const plannedChecks: AuditCheck[] = [
  planned("FL-01", "FL", "Structure indicator not standardised", ["IFLOT"], "High", "100% standard hierarchy (KKS or ISO 14224)"),
  planned("FL-04", "FL", "Orphan functional locations", ["IFLOT"], "Medium", "0 orphan sub-locations outside the plant tree"),
  planned("EQ-01", "EQ", "Equipment without object type", ["EQUI"], "High", "< 2% equipment without a standard object type"),
  planned("EQ-04", "EQ", "Duplicate or scrapped assets still active", ["EQUI", "JEST"], "High", "0 duplicate active equipment records"),
  planned("EQ-05", "EQ", "Missing start-up date or asset link", ["EQUI", "ILOA"], "Medium", "> 95% major equipment linked to a fixed asset"),
  planned("BM-02", "BM", "BOM items with blocked or obsolete materials", ["STPO", "MARA"], "High", "0 obsolete materials in active PM BOMs"),
  planned("BM-03", "BM", "FL BOMs not using usage 4 (PM)", ["TPST", "STKO"], "Medium", "100% PM BOMs created under usage 4"),
  planned("WC-01", "WC", "Work centre maintenance indicator or deletion flag", ["CRHD"], "High", "All craft disciplines represented and active"),
  planned("WC-03", "WC", "Work centre missing cost centre or activity type", ["CRCO", "CSKS"], "Critical", "100% linked to active CO activity types"),
  planned("TL-03", "TL", "Generic one-line task list operations", ["PLPO"], "Medium", "> 85% operations have actionable steps"),
  planned("TL-04", "TL", "Task lists missing material components", ["PLMZ"], "High", "> 80% major lists include required spares"),
  planned("MP-03", "MP", "Counter rollovers or negative deltas", ["IMRG"], "Medium", "0 unvalidated rollovers in 12 months"),
  planned("PL-02", "PL", "Call horizon not set for long-lead work", ["MPLA"], "High", "80–90% call horizon for overhaul plans"),
  planned("PL-04", "PL", "Overdue maintenance calls", ["MHIS"], "Critical", "0 calls stuck in save-to-call beyond 14 days"),
  planned("PL-05", "PL", "Single-counter plans on critical rotating assets", ["MPLA", "T351P"], "Medium", "Multi-counter strategy on turbines and compressors"),
  planned("CT-01", "CT", "Failure catalogs incomplete or inactive", ["QPGR", "QPCD"], "High", "All B/C/5 catalogs active and structured"),
  planned("CT-03", "CT", "Catalog profiles not assigned to notification types", ["TQ80", "TQ8T"], "High", "100% of M2 types enforce a catalog profile"),
  planned("QM-02", "QM", "Breakdown notifications missing downtime start", ["QMEL"], "High", "0 M2 notifications without a malfunction start"),
  planned("QM-04", "QM", "Corrective orders created without a notification", ["QMEL", "AUFK"], "Medium", "> 90% corrective orders linked to a notification"),
  planned("AU-03", "AU", "TECO orders not business-closed after 90 days", ["AUFK", "JEST"], "High", "Monthly settlement and CLSD closure"),
  planned("AU-04", "AU", "Orders without a technical object", ["AUFK", "AFIH"], "Critical", "0 maintenance orders without equipment or FLOC"),
  planned("AU-05", "AU", "Released orders without a settlement rule", ["AUFK", "COBRB"], "Critical", "100% released orders have a settlement rule"),
  planned("AF-02", "AF", "Reactive vs preventive order mix", ["AFKO", "AFVV"], "High", "70–80% planned work; < 20% breakdown"),
  planned("AF-03", "AF", "Preventive orders generated without a task list", ["AFKO"], "High", "100% preventive orders inherit a task list"),
  planned("AF-04", "AF", "Operations missing a work centre", ["AFVC"], "Critical", "0 operations without a craft work centre"),
  planned("FR-01", "FR", "Actual hours identical to planned on every order", ["AFRU", "AFVV"], "Medium", "< 30% 1:1 confirmations"),
  planned("FR-02", "FR", "Confirmation lag beyond 48 hours", ["AFRU"], "Medium", "Confirmations entered within 24–48 hours"),
  planned("FR-03", "FR", "Partial confirmations left open", ["AFRU"], "High", "Final confirmation set on completion"),
  planned("RS-02", "RS", "Past-due reservations with no withdrawal", ["RESB"], "Medium", "Monthly cleanup of stale reservations"),
  planned("RS-03", "RS", "Non-stock items without a purchase requisition", ["RESB", "EBAN"], "High", "100% non-stock items generate a PR"),
];

export const AUDIT_CHECKS: AuditCheck[] = [...v1, ...plannedChecks];

export const FRAMEWORK_NOTES = [
  "Pramaan ERP audit · SAP PM pack v1. Finance and HR packs follow the same scoring and evidence model.",
  "Primary source: SAP_PM_Complete_Audit_Workbook.xlsx (50 checks, master and transactional).",
  "Variant source: SAP_PM_Master_Data_Audit_Checklist.xlsx. Its WC-04 planner-group check and its sampling version of CT-03 are recorded here rather than replacing the primary definitions.",
  "Rule definitions for active, open, released and overdue live in definitions.ts and are shown in the Method section.",
  "v1 enables 20 checks across all 13 domains; the remaining 30 are catalogued but not evaluated.",
];
