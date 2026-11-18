export const PARENT = {
  name: "Nirmana",
  wordmark: "nirmNa",
  url: "https://nirmanaerp.com",
  tagline: "Industrial intelligence, delivered.",
} as const;

export type PortfolioStatus = "Live" | "Audit pack live" | "Practice" | "Portfolio";

export type PortfolioItem = {
  name: string;
  role: string;
  description: string;
  status: PortfolioStatus;
  href: string;
  external?: boolean;
};

export const PORTFOLIO: PortfolioItem[] = [
  {
    name: "Gearbox",
    role: "SAP landscape and maintenance intelligence",
    description:
      "Enterprise structure across S/4HANA and ECC R/3 — company codes, plants, business areas and controlling areas — with a four-plant maintenance command centre on top.",
    status: "Live",
    href: "/",
  },
  {
    name: "Pramaan",
    role: "ERP audit and S/4HANA implementation",
    description:
      "The assurance-led ERP practice: SAP PM audit pack live, finance and HR packs next, and partner-light S/4HANA delivery for FI, CO, personnel administration, organisational management, time and payroll.",
    status: "Audit pack live",
    href: "/audit",
  },
  {
    name: "Promonitor",
    role: "Industrial monitoring",
    description:
      "Operational visibility for asset-intensive sites: condition, availability and the operating picture that sits above the plant systems.",
    status: "Portfolio",
    href: PARENT.url,
    external: true,
  },
  {
    name: "Yamuna",
    role: "Integration and data",
    description:
      "The data and integration layer that connects plant, enterprise and analytics systems into one usable operating model.",
    status: "Portfolio",
    href: PARENT.url,
    external: true,
  },
];

export const PORTFOLIO_STORY = [
  {
    step: "01",
    title: "Assure",
    body: "Pramaan audits the ERP estate: master data, process controls, statutory readiness and the gaps that block a clean implementation.",
  },
  {
    step: "02",
    title: "Implement",
    body: "Pramaan’s S/4HANA implementation takes the audit into a working finance and HR core, with payroll parallel runs before cutover.",
  },
  {
    step: "03",
    title: "Operate",
    body: "Gearbox, Promonitor and Yamuna keep the enterprise structure and operating picture visible after go-live: companies, plants, assets, cost and the data that connects them.",
  },
];
