export type DomainId =
  | "FL"
  | "EQ"
  | "BM"
  | "WC"
  | "TL"
  | "MP"
  | "PL"
  | "CT"
  | "QM"
  | "AU"
  | "AF"
  | "FR"
  | "RS";

export type Section = "Master data" | "Transactional";

export type Severity = "Critical" | "High" | "Medium";

export type Opinion = "Green" | "Amber" | "Red";

export type CheckStatus = "pass" | "fail" | "na";

export type RowLike = Record<string, unknown>;

export type Predicate = (row: RowLike) => boolean;

export type AuditDomain = {
  id: DomainId;
  name: string;
  section: Section;
  tables: string[];
};

/* ------------------------------------------------------------------ */
/* Source rows                                                         */
/* ------------------------------------------------------------------ */

export type Floc = {
  tplnr: string;
  pltxt: string;
  tplkz: string;
  fltyp: string;
  tplma: string;
  swerk: string;
  kostl: string;
  abckz: string;
  objnr: string;
  active: boolean;
};

export type Equipment = {
  equnr: string;
  eqktx: string;
  eqtyp: string;
  eqart: string;
  herst: string;
  typbz: string;
  serge: string;
  tplnr: string;
  hequi: string;
  abckz: string;
  gewrk: string;
  kostl: string;
  anlnr: string;
  inbdt: string;
  active: boolean;
};

export type Bom = {
  equnr: string;
  stlnr: string;
  stlan: string;
  items: number;
  obsoleteItems: number;
};

export type WorkCenter = {
  objid: string;
  arbpl: string;
  werk: string;
  verwe: string;
  kapid: string;
  kostl: string;
  lstar: string;
};

export type TaskList = {
  plnty: string;
  plnnr: string;
  plnal: string;
  verwe: string;
  statu: string;
  ktext: string;
};

export type TaskListOperation = {
  plnnr: string;
  vornr: string;
  ltxa1: string;
  arbei: number;
  anzahl: number;
  released: boolean;
};

export type MeasuringPoint = {
  point: string;
  mpobj: string;
  pttxt: string;
  category: "counter" | "condition";
  indrv: boolean;
  mrmin: number | null;
  mrmax: number | null;
};

export type MaintenancePlan = {
  warpl: string;
  wptxt: string;
  strat: string;
  horiz: number;
  status: "CRTD" | "REL";
};

export type PlanItem = {
  warpl: string;
  wapos: string;
  equnr: string;
  tplnr: string;
  plnnr: string;
  auart: string;
};

export type CatalogCode = {
  catalog: "B" | "C" | "5";
  codegruppe: string;
  code: string;
  kurztext: string;
  generic: boolean;
};

export type Notification = {
  qmnum: string;
  qmart: string;
  qmtxt: string;
  equnr: string;
  tplnr: string;
  erdat: string;
  status: "OPEN" | "CLOSED";
  msaaus: boolean;
  ausvn: string;
  fegrp: string;
  fecod: string;
  otgrp: string;
};

export type Order = {
  aufnr: string;
  auart: string;
  autyp: string;
  ktext: string;
  equnr: string;
  tplnr: string;
  erdat: string;
  gstrp: string;
  gltrp: string;
  status: "CRTD" | "REL" | "CNF" | "TECO" | "CLSD";
  idat2: string;
  kostv: string;
  warpl: string;
  qmnum: string;
};

export type Confirmation = {
  rueck: string;
  aufnr: string;
  ismnw: number;
  budat: string;
  erdat: string;
  aueru: boolean;
  stokz: boolean;
};

export type Reservation = {
  rsnum: string;
  aufnr: string;
  matnr: string;
  bdmng: number;
  enmng: number;
  kzear: boolean;
  xloek: boolean;
  bdter: string;
};

export type AuditDataset = {
  flocs: Floc[];
  equipment: Equipment[];
  boms: Bom[];
  workCenters: WorkCenter[];
  taskLists: TaskList[];
  taskListOperations: TaskListOperation[];
  measuringPoints: MeasuringPoint[];
  plans: MaintenancePlan[];
  planItems: PlanItem[];
  catalogCodes: CatalogCode[];
  notifications: Notification[];
  orders: Order[];
  confirmations: Confirmation[];
  reservations: Reservation[];
};

export type EntityKey = keyof AuditDataset;

/* ------------------------------------------------------------------ */
/* Framework                                                           */
/* ------------------------------------------------------------------ */

export type RuleSpec =
  | {
      kind: "missing";
      entity: EntityKey;
      fields: string[];
      where?: Predicate;
    }
  | {
      kind: "orphan";
      entity: EntityKey;
      field: string;
      parent: EntityKey;
      parentField: string;
      where?: Predicate;
      parentWhere?: Predicate;
    }
  | {
      kind: "status";
      entity: EntityKey;
      field: string;
      allowed: string[];
      where?: Predicate;
    }
  | {
      kind: "zero";
      entity: EntityKey;
      field: string;
      where?: Predicate;
    }
  | {
      kind: "aging";
      entity: EntityKey;
      dateField: string;
      olderThanDays: number;
      where?: Predicate;
    }
  | {
      kind: "custom";
      run: (ctx: AuditContext) => RawOutcome;
    };

export type Remediation = {
  tcode: string;
  spro?: string;
  bapi?: string;
  action: string;
};

export type AuditCheck = {
  id: string;
  domain: DomainId;
  title: string;
  question: string;
  tables: string[];
  ruleSummary: string;
  rule?: RuleSpec;
  /** Maximum acceptable exception share, 0–100. */
  maxExceptionPct: number;
  benchmark: string;
  severity: Severity;
  evidence: string[];
  remediation: Remediation;
  source: string;
  enabled: boolean;
};

/* ------------------------------------------------------------------ */
/* Execution                                                           */
/* ------------------------------------------------------------------ */

export type AuditContext = {
  dataset: AuditDataset;
  auditDate: string;
  plant: string;
};

export type RawOutcome = {
  total: number;
  exceptions: number;
  sample: RowLike[];
};

export type EvidenceRow = Record<string, string | number | boolean>;

export type CheckResult = {
  check: AuditCheck;
  total: number;
  exceptions: number;
  exceptionPct: number;
  status: CheckStatus;
  sample: EvidenceRow[];
};

export type Finding = {
  id: string;
  checkId: string;
  domain: DomainId;
  domainName: string;
  title: string;
  severity: Severity;
  total: number;
  exceptions: number;
  exceptionPct: number;
  benchmark: string;
  remediation: Remediation;
  owner: string;
  due: string;
  status: "Open";
};

export type DomainResult = {
  domain: AuditDomain;
  checks: number;
  evaluated: number;
  passed: number;
  failed: number;
  na: number;
  criticalFailures: number;
  readiness: number;
  opinion: Opinion;
};

export type AuditOverall = {
  checks: number;
  evaluated: number;
  passed: number;
  failed: number;
  na: number;
  criticalFailures: number;
  readiness: number;
  riskIndex: number;
  opinion: Opinion;
  redDomains: number;
  greenDomains: number;
};

export type AuditRun = {
  frameworkVersion: string;
  auditDate: string;
  results: CheckResult[];
  domains: DomainResult[];
  findings: Finding[];
  overall: AuditOverall;
};
