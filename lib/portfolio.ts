export const PARENT = {
  name: "Nirmana ERP",
  wordmark: "nirmNa",
  url: "https://nirmanaerp.com",
  tagline: "Enterprise systems, delivered.",
} as const;

export type PortfolioStatus = "Live" | "Audit live";

export type PortfolioItem = {
  name: string;
  role: string;
  description: string;
  status: PortfolioStatus;
  href: string;
  domain: string;
  external: boolean;
};

export const PORTFOLIO: PortfolioItem[] = [
  {
    name: "Promonitor",
    role: "Industrial monitoring",
    description:
      "Operational visibility for asset-intensive sites: condition, availability and the operating picture above the plant systems.",
    status: "Live",
    href: "https://promonitor.nirmanaerp.com",
    domain: "promonitor.nirmanaerp.com",
    external: true,
  },
  {
    name: "Yamuna",
    role: "Integration and data",
    description:
      "The data and integration layer that connects plant, enterprise and analytics systems into one usable operating model.",
    status: "Live",
    href: "https://yamuna.nirmanaerp.com",
    domain: "yamuna.nirmanaerp.com",
    external: true,
  },
  {
    name: "Xirra",
    role: "Sibling portfolio",
    description:
      "A separate Nirmana ERP business portfolio, with its own users and domain. Linked here for navigation only.",
    status: "Live",
    href: "https://xirra.nirmanaerp.com",
    domain: "xirra.nirmanaerp.com",
    external: true,
  },
  {
    name: "Ledgflow",
    role: "Sibling portfolio",
    description:
      "A separate Nirmana ERP business portfolio, with its own users and domain. Linked here for navigation only.",
    status: "Live",
    href: "https://ledgflow.nirmanaerp.com",
    domain: "ledgflow.nirmanaerp.com",
    external: true,
  },
  {
    name: "Pramaan",
    role: "ERP audit and implementation",
    description:
      "The assurance-led ERP portfolio: SAP PM audit pack live, finance and HR packs next, and partner-light S/4HANA delivery. The audit pack currently runs inside Gearbox.",
    status: "Audit live",
    href: "/audit",
    domain: "pramaan.nirmanaerp.com",
    external: false,
  },
];
