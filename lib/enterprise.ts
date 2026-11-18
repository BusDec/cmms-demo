import type { SapSystemId } from "./landscape";

export type VerticalId = "generation" | "grid" | "services" | "retail";

export type EnterpriseView = "group" | VerticalId;

export type Vertical = {
  id: VerticalId;
  name: string;
  shortName: string;
  system: SapSystemId;
  companyCode: string;
  revenue: number;
  revenueVsPlan: number;
  ebitda: number;
  headcount: number;
  headcountPlan: number;
  payrollCost: number;
  attrition: number;
  absence: number;
  overtime: number;
  openRoles: number;
  contractorShare: number;
  dataConfidence: number;
  openIssues: number;
  criticalIssues: number;
  detectedThisMonth: number;
  closedThisMonth: number;
};

export type IssueSeverity = "Critical" | "High" | "Medium";
export type IssueStatus = "Assigned" | "In review" | "In correction" | "Rectified";
export type IssueDomain = "HR" | "Finance" | "Procurement" | "Maintenance";

export type DataIssue = {
  id: string;
  title: string;
  vertical: VerticalId;
  domain: IssueDomain;
  severity: IssueSeverity;
  records: number;
  owner: string;
  status: IssueStatus;
  due: string;
  impact: string;
  remedy: string;
};

export const VERTICALS: Vertical[] = [
  {
    id: "generation",
    name: "Generation",
    shortName: "Generation",
    system: "hana",
    companyCode: "1000",
    revenue: 1_850_000_000,
    revenueVsPlan: 4.2,
    ebitda: 592_000_000,
    headcount: 1_240,
    headcountPlan: 1_220,
    payrollCost: 186_000_000,
    attrition: 7.8,
    absence: 4.1,
    overtime: 6.2,
    openRoles: 34,
    contractorShare: 18,
    dataConfidence: 88,
    openIssues: 2,
    criticalIssues: 1,
    detectedThisMonth: 5,
    closedThisMonth: 3,
  },
  {
    id: "grid",
    name: "Grid",
    shortName: "Grid",
    system: "r3",
    companyCode: "2000",
    revenue: 940_000_000,
    revenueVsPlan: -1.8,
    ebitda: 263_000_000,
    headcount: 860,
    headcountPlan: 872,
    payrollCost: 121_000_000,
    attrition: 6.1,
    absence: 3.6,
    overtime: 4.8,
    openRoles: 21,
    contractorShare: 12,
    dataConfidence: 74,
    openIssues: 2,
    criticalIssues: 1,
    detectedThisMonth: 6,
    closedThisMonth: 4,
  },
  {
    id: "services",
    name: "Services",
    shortName: "Services",
    system: "hana",
    companyCode: "3000",
    revenue: 610_000_000,
    revenueVsPlan: 6.5,
    ebitda: 110_000_000,
    headcount: 540,
    headcountPlan: 534,
    payrollCost: 74_000_000,
    attrition: 8.4,
    absence: 4.8,
    overtime: 3.2,
    openRoles: 18,
    contractorShare: 24,
    dataConfidence: 86,
    openIssues: 2,
    criticalIssues: 1,
    detectedThisMonth: 4,
    closedThisMonth: 2,
  },
  {
    id: "retail",
    name: "Retail",
    shortName: "Retail",
    system: "r3",
    companyCode: "4000",
    revenue: 430_000_000,
    revenueVsPlan: -3.1,
    ebitda: 52_000_000,
    headcount: 310,
    headcountPlan: 319,
    payrollCost: 39_000_000,
    attrition: 9.2,
    absence: 5.4,
    overtime: 2.6,
    openRoles: 12,
    contractorShare: 8,
    dataConfidence: 62,
    openIssues: 2,
    criticalIssues: 1,
    detectedThisMonth: 5,
    closedThisMonth: 3,
  },
];

export const DATA_ISSUES: DataIssue[] = [
  {
    id: "ISS-1042",
    title: "Positions without a cost centre",
    vertical: "generation",
    domain: "HR",
    severity: "Critical",
    records: 42,
    owner: "HR Operations",
    status: "In correction",
    due: "22 Nov",
    impact: "SAR 2.1M payroll unmapped to cost centres",
    remedy: "PA0001 cost-centre mapping; PA30 mass update and payroll simulation.",
  },
  {
    id: "ISS-1038",
    title: "Equipment without a functional location",
    vertical: "generation",
    domain: "Maintenance",
    severity: "High",
    records: 84,
    owner: "Asset Operations",
    status: "Assigned",
    due: "24 Nov",
    impact: "Work orders cannot be costed by asset",
    remedy: "IE05 / IL02 hierarchy assignment; validate equipment master.",
  },
  {
    id: "ISS-1029",
    title: "Duplicate vendor master records",
    vertical: "grid",
    domain: "Procurement",
    severity: "High",
    records: 63,
    owner: "Procurement",
    status: "Assigned",
    due: "30 Nov",
    impact: "Duplicate purchase orders and payment risk",
    remedy: "LFA1 de-duplication; block duplicates and consolidate open POs.",
  },
  {
    id: "ISS-1024",
    title: "Inactive cost centres receiving postings",
    vertical: "grid",
    domain: "Finance",
    severity: "Critical",
    records: 7,
    owner: "Controlling",
    status: "In review",
    due: "28 Nov",
    impact: "SAR 1.8M posted to closed cost centres",
    remedy: "KS01 lock; repost to active cost centres and re-run the close.",
  },
  {
    id: "ISS-1019",
    title: "Missing payroll area on active employees",
    vertical: "services",
    domain: "HR",
    severity: "Critical",
    records: 11,
    owner: "Payroll",
    status: "In correction",
    due: "21 Nov",
    impact: "Next payroll run at risk",
    remedy: "PA0001 / PA0007 validation; payroll simulation before release.",
  },
  {
    id: "ISS-1016",
    title: "Time evaluation errors for shift workers",
    vertical: "services",
    domain: "HR",
    severity: "High",
    records: 36,
    owner: "HR Operations",
    status: "In correction",
    due: "23 Nov",
    impact: "Overtime and shift-pay variance",
    remedy: "PT60 re-evaluation; correct the shift and overtime rules.",
  },
  {
    id: "ISS-1008",
    title: "Business area missing on GL line items",
    vertical: "retail",
    domain: "Finance",
    severity: "Critical",
    records: 1_240,
    owner: "Finance",
    status: "Assigned",
    due: "20 Nov",
    impact: "Segment reporting understated",
    remedy: "Substitution rule; FB01 correction and segment re-report.",
  },
  {
    id: "ISS-1004",
    title: "Customer master incomplete credit data",
    vertical: "retail",
    domain: "Finance",
    severity: "Medium",
    records: 29,
    owner: "Credit",
    status: "In review",
    due: "29 Nov",
    impact: "Orders released without a credit-limit check",
    remedy: "FD32 credit profile; block orders until the limit is confirmed.",
  },
  {
    id: "ISS-0991",
    title: "Plant 4000 business area mismatch",
    vertical: "retail",
    domain: "Finance",
    severity: "High",
    records: 18,
    owner: "Finance",
    status: "Rectified",
    due: "16 Nov",
    impact: "Closed and revalidated against T001W / TGSB",
    remedy: "Structure alignment completed; postings reconciled.",
  },
];

export const DETECTED_THIS_MONTH = 20;
export const CLOSED_THIS_MONTH = 12;

export function getVertical(id: VerticalId) {
  return VERTICALS.find((vertical) => vertical.id === id);
}

export function issuesFor(view: EnterpriseView) {
  return view === "group"
    ? DATA_ISSUES
    : DATA_ISSUES.filter((issue) => issue.vertical === view);
}
