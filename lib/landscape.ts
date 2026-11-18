export type SapSystemId = "hana" | "r3";

export type LandscapeView = "all" | SapSystemId;

export type SapSystem = {
  id: SapSystemId;
  name: string;
  shortName: string;
  release: string;
  database: string;
  client: string;
  status: "Strategic" | "Legacy";
  note: string;
};

export type Company = {
  id: string;
  name: string;
  country: string;
  currency: string;
  companyCodes: string[];
};

export type CompanyCode = {
  code: string;
  name: string;
  shortName: string;
  system: SapSystemId;
  country: string;
  city: string;
  currency: string;
  chartOfAccounts: string;
  fiscalYearVariant: string;
  controllingArea: string;
  creditControlArea: string;
};

export type BusinessArea = {
  code: string;
  name: string;
  system: SapSystemId;
  owner: string;
  companyCodes: string[];
};

export type Plant = {
  code: string;
  name: string;
  system: SapSystemId;
  companyCode: string;
  city: string;
  region: string;
  businessArea: string;
  salesOrg: string;
  purchasingOrg: string;
  storageLocations: number;
  type: "Generation" | "Grid" | "Services" | "Logistics";
};

export type OrgUnit = {
  code: string;
  name: string;
  system: SapSystemId;
  companyCodes: string[];
  currency?: string;
};

export const SAP_SYSTEMS: SapSystem[] = [
  {
    id: "hana",
    name: "SAP S/4HANA",
    shortName: "S/4HANA",
    release: "2023 FPS02",
    database: "SAP HANA 2.0",
    client: "100",
    status: "Strategic",
    note: "Generation and services on the strategic S/4HANA platform.",
  },
  {
    id: "r3",
    name: "SAP ECC R/3",
    shortName: "ECC R/3",
    release: "6.0 EHP8",
    database: "Oracle 19c",
    client: "100",
    status: "Legacy",
    note: "Grid and retail operations on the legacy ECC estate.",
  },
];

export const COMPANIES: Company[] = [
  {
    id: "0001",
    name: "Meridian Energy Group",
    country: "Saudi Arabia",
    currency: "SAR",
    companyCodes: ["1000", "2000", "3000", "4000"],
  },
];

export const COMPANY_CODES: CompanyCode[] = [
  {
    code: "1000",
    name: "Meridian Generation KSA",
    shortName: "Generation KSA",
    system: "hana",
    country: "Saudi Arabia",
    city: "Ras Al Khair",
    currency: "SAR",
    chartOfAccounts: "MEGA",
    fiscalYearVariant: "K4",
    controllingArea: "1000",
    creditControlArea: "1000",
  },
  {
    code: "3000",
    name: "Meridian Services KSA",
    shortName: "Services KSA",
    system: "hana",
    country: "Saudi Arabia",
    city: "Jeddah",
    currency: "SAR",
    chartOfAccounts: "MEGA",
    fiscalYearVariant: "K4",
    controllingArea: "3000",
    creditControlArea: "3000",
  },
  {
    code: "2000",
    name: "Meridian Grid KSA",
    shortName: "Grid KSA",
    system: "r3",
    country: "Saudi Arabia",
    city: "Riyadh",
    currency: "SAR",
    chartOfAccounts: "MEGA",
    fiscalYearVariant: "K4",
    controllingArea: "2000",
    creditControlArea: "2000",
  },
  {
    code: "4000",
    name: "Meridian Retail KSA",
    shortName: "Retail KSA",
    system: "r3",
    country: "Saudi Arabia",
    city: "Dammam",
    currency: "SAR",
    chartOfAccounts: "MEGA",
    fiscalYearVariant: "K4",
    controllingArea: "4000",
    creditControlArea: "4000",
  },
];

export const BUSINESS_AREAS: BusinessArea[] = [
  {
    code: "1000",
    name: "Generation",
    system: "hana",
    owner: "Asset Operations",
    companyCodes: ["1000"],
  },
  {
    code: "3000",
    name: "Services",
    system: "hana",
    owner: "Service Operations",
    companyCodes: ["3000"],
  },
  {
    code: "2000",
    name: "Grid",
    system: "r3",
    owner: "Grid Operations",
    companyCodes: ["2000"],
  },
  {
    code: "4000",
    name: "Retail",
    system: "r3",
    owner: "Commercial",
    companyCodes: ["4000"],
  },
];

export const PLANTS: Plant[] = [
  {
    code: "1000",
    name: "Ras Al Khair Coal Station",
    system: "hana",
    companyCode: "1000",
    city: "Ras Al Khair",
    region: "Madinah",
    businessArea: "1000",
    salesOrg: "1000",
    purchasingOrg: "1000",
    storageLocations: 6,
    type: "Generation",
  },
  {
    code: "1100",
    name: "Al Jouf Wind Cluster",
    system: "hana",
    companyCode: "1000",
    city: "Al Jouf",
    region: "Tabuk",
    businessArea: "1000",
    salesOrg: "1000",
    purchasingOrg: "1000",
    storageLocations: 3,
    type: "Generation",
  },
  {
    code: "3000",
    name: "Jeddah Service Workshop",
    system: "hana",
    companyCode: "3000",
    city: "Jeddah",
    region: "Makkah",
    businessArea: "3000",
    salesOrg: "3000",
    purchasingOrg: "3000",
    storageLocations: 2,
    type: "Services",
  },
  {
    code: "3100",
    name: "Riyadh Service Centre",
    system: "hana",
    companyCode: "3000",
    city: "Riyadh",
    region: "Riyadh",
    businessArea: "3000",
    salesOrg: "3000",
    purchasingOrg: "3000",
    storageLocations: 2,
    type: "Services",
  },
  {
    code: "2000",
    name: "Sudair 380 kV Substation",
    system: "r3",
    companyCode: "2000",
    city: "Sudair",
    region: "Riyadh",
    businessArea: "2000",
    salesOrg: "2000",
    purchasingOrg: "2000",
    storageLocations: 5,
    type: "Grid",
  },
  {
    code: "2100",
    name: "Riyadh Control Centre",
    system: "r3",
    companyCode: "2000",
    city: "Riyadh",
    region: "Riyadh",
    businessArea: "2000",
    salesOrg: "2000",
    purchasingOrg: "2000",
    storageLocations: 2,
    type: "Grid",
  },
  {
    code: "4000",
    name: "Dammam Depot",
    system: "r3",
    companyCode: "4000",
    city: "Dammam",
    region: "Eastern",
    businessArea: "4000",
    salesOrg: "4000",
    purchasingOrg: "4000",
    storageLocations: 3,
    type: "Logistics",
  },
];

export const CONTROLLING_AREAS: OrgUnit[] = [
  {
    code: "1000",
    name: "Generation & Services",
    system: "hana",
    companyCodes: ["1000", "3000"],
    currency: "SAR",
  },
  {
    code: "2000",
    name: "Grid & Retail",
    system: "r3",
    companyCodes: ["2000", "4000"],
    currency: "SAR",
  },
];

export const SALES_ORGS: OrgUnit[] = [
  { code: "1000", name: "Generation Sales", system: "hana", companyCodes: ["1000"] },
  { code: "3000", name: "Services Sales", system: "hana", companyCodes: ["3000"] },
  { code: "2000", name: "Grid Sales", system: "r3", companyCodes: ["2000"] },
  { code: "4000", name: "Retail Sales", system: "r3", companyCodes: ["4000"] },
];

export const PURCHASING_ORGS: OrgUnit[] = [
  {
    code: "1000",
    name: "Generation Procurement",
    system: "hana",
    companyCodes: ["1000"],
  },
  {
    code: "3000",
    name: "Services Procurement",
    system: "hana",
    companyCodes: ["3000"],
  },
  {
    code: "2000",
    name: "Grid Procurement",
    system: "r3",
    companyCodes: ["2000"],
  },
  {
    code: "4000",
    name: "Retail Procurement",
    system: "r3",
    companyCodes: ["4000"],
  },
];

export const ENTERPRISE_OBJECTS = [
  {
    object: "Company",
    table: "T880",
    key: "RCOMP",
    purpose: "Consolidation unit above the company codes",
  },
  {
    object: "Company code",
    table: "T001",
    key: "BUKRS",
    purpose: "Legal entity, currency, chart of accounts and fiscal year",
  },
  {
    object: "Plant",
    table: "T001W",
    key: "WERKS",
    purpose: "Operating site, address, business area and maintenance ownership",
  },
  {
    object: "Business area",
    table: "TGSB",
    key: "GSBER",
    purpose: "Cross-company management segment used in financial postings",
  },
  {
    object: "Controlling area",
    table: "TKA01",
    key: "KOKRS",
    purpose: "Cost accounting scope and controlling currency",
  },
  {
    object: "Sales organization",
    table: "TVKO",
    key: "VKORG",
    purpose: "Sales channel ownership and pricing responsibility",
  },
  {
    object: "Purchasing organization",
    table: "T024E",
    key: "EKORG",
    purpose: "Procurement ownership and purchasing conditions",
  },
  {
    object: "Storage location",
    table: "T001L",
    key: "LGORT",
    purpose: "Material storage within a plant",
  },
] as const;

export function getSystem(id: SapSystemId) {
  return SAP_SYSTEMS.find((system) => system.id === id);
}

export function inView<T extends { system: SapSystemId }>(
  items: T[],
  view: LandscapeView,
) {
  return view === "all" ? items : items.filter((item) => item.system === view);
}

export function countStorageLocations(view: LandscapeView) {
  return inView(PLANTS, view).reduce((total, plant) => total + plant.storageLocations, 0);
}
