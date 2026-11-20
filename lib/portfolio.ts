export const PARENT = {
  name: "Nirmana ERP",
  wordmark: "Nirmana",
  url: "https://nirmanaerp.com",
  tagline: "The next-generation ERP for industrial enterprises.",
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

/**
 * The eight sibling portfolios, in the order used by the common portfolio page.
 * Gearbox is added separately as the ninth member; it is the dashboard layer, not
 * a sibling.
 */
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
    name: "Benchmark",
    role: "Efficiency benchmarking",
    description:
      "Data envelopment analysis for operating units: efficiency scores, peer benchmarks, scale efficiency and the input/output targets that close the gap.",
    status: "Live",
    href: "https://benchmark.nirmanaerp.com",
    domain: "benchmark.nirmanaerp.com",
    external: true,
  },
  {
    name: "Pramaan",
    role: "SAP audit and implementation",
    description:
      "The SAP audit and implementation portfolio: a 20-check SAP PM audit pack, finance and HR packs next, and partner-light S/4HANA delivery from mobilisation to hypercare.",
    status: "Live",
    href: "https://pramaan.nirmanaerp.com",
    domain: "pramaan.nirmanaerp.com",
    external: true,
  },
  {
    name: "Kavach",
    role: "Cybersecurity",
    description:
      "SAP security and controls, OT/IT convergence, network, access and asset/patch watch, cloud identity and incident readiness for asset-intensive enterprises.",
    status: "Live",
    href: "https://kavach.nirmanaerp.com",
    domain: "kavach.nirmanaerp.com",
    external: true,
  },
];

/** The integrated dashboard layer. Included on the common portfolio page only. */
export const GEARBOX: PortfolioItem = {
  name: "Gearbox",
  role: "Integrated ERP dashboards",
  description:
    "The command layer for Meridian Energy: one enterprise view across Generation, Grid, Services and Retail, with the SAP landscape, data confidence, a closed-loop exception register and four maintenance workspaces.",
  status: "Live",
  href: "https://gearbox.nirmanaerp.com",
  domain: "gearbox.nirmanaerp.com",
  external: true,
};

/**
 * The common portfolio page shows nine members in three rows:
 * Promonitor, LedgeFlow, Xirra / CoreSight, Yamuna, Benchmark /
 * Gearbox, Pramaan, Kavach.
 */
export const PORTFOLIO_MEMBERS: PortfolioItem[] = [
  ...PORTFOLIO.slice(0, 6),
  GEARBOX,
  ...PORTFOLIO.slice(6),
];
