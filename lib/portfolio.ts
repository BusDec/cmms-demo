export const PARENT = {
  name: "Nirmana ERP",
  wordmark: "Nirmana",
  url: "https://nirmanaerp.com",
  tagline: "Enterprise systems, delivered.",
} as const;

export type PortfolioStatus = "Live" | "Audit live" | "Planned";

export type PortfolioItem = {
  name: string;
  role: string;
  description: string;
  status: PortfolioStatus;
  href: string;
  domain: string;
  external: boolean;
  planned?: boolean;
};

export const PORTFOLIO: PortfolioItem[] = [
  {
    name: "Promonitor",
    role: "Construction execution intelligence",
    description:
      "Connects meetings, commitments, schedules, risks and project evidence into one execution layer for capital projects.",
    status: "Live",
    href: "https://promonitor.nirmanaerp.com",
    domain: "promonitor.nirmanaerp.com",
    external: true,
  },
  {
    name: "Yamuna",
    role: "Project planning and decision simulations",
    description:
      "Eight simulations for energy and infrastructure — upstream, refining, thermal, distribution, O&M, plant performance, hydro and linear corridors. Plan the project, feel the decision.",
    status: "Live",
    href: "https://yamuna.nirmanaerp.com",
    domain: "yamuna.nirmanaerp.com",
    external: true,
  },
  {
    name: "Xirra",
    role: "Wealth intelligence and portfolio operations",
    description:
      "Portfolio analytics, buyback lifecycle management, fundamental research, tax-aware accounting and role-aware compliance in one institutional wealth platform.",
    status: "Live",
    href: "https://xirra.nirmanaerp.com",
    domain: "xirra.nirmanaerp.com",
    external: true,
  },
  {
    name: "LedgeFlow",
    role: "Cloud accounting for LLPs and MSMEs",
    description:
      "Smart cloud accounting for Indian LLPs and MSMEs, with automated GST/TDS compliance, AI receipt scanning and professional financial reports.",
    status: "Live",
    href: "https://ledgeflow.nirmanaerp.com",
    domain: "ledgeflow.nirmanaerp.com",
    external: true,
  },
  {
    name: "CoreSight",
    role: "Simulation-based learning",
    description:
      "High-stakes simulation scenarios in project management, cyber security and industrial AI, built for modern leaders and organisational partners.",
    status: "Live",
    href: "https://coresight.nirmanaerp.com",
    domain: "coresight.nirmanaerp.com",
    external: true,
  },
  {
    name: "Kavach",
    role: "Cybersecurity",
    description:
      "SAP security and controls, OT/IT convergence, cloud identity and incident readiness for asset-intensive enterprises.",
    status: "Planned",
    href: "https://kavach.nirmanaerp.com",
    domain: "kavach.nirmanaerp.com",
    external: true,
    planned: true,
  },
  {
    name: "Pramaan",
    role: "SAP audit and implementation",
    description:
      "The SAP audit and implementation portfolio: SAP PM audit pack live, finance and HR packs next, and partner-light S/4HANA delivery. The audit pack currently runs as a preview inside Gearbox while the subdomain is prepared.",
    status: "Audit live",
    href: "/audit",
    domain: "pramaan.nirmanaerp.com",
    external: false,
  },
];
