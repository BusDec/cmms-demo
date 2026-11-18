# Gearbox

### A Nirmana ERP product

Integrated dashboards across ERP practices and business processes.

A top-down command view across Generation, Grid, Services and Retail, with the SAP landscape, a closed-loop exception register and a four-plant maintenance command centre underneath.

**Parent:** [Nirmana ERP](https://nirmanaerp.com)

**Operating company:** Nirmana Industrial Intelligence Private Limited

**Sibling portfolios:** Promonitor, LedgeFlow, Xirra, CoreSight, Yamuna, Benchmark, Pramaan and Kavach — separate business domains, each live on its own subdomain. The common portfolio page adds **Gearbox** as the ninth member and closes with the **Nirmana ERP** parent platform.

**Demo repository:** `cmms-demo`

**Live:** https://gearbox.nirmanaerp.com/ (the `github.io` project URL redirects here)

**Integration guide:** [Connecting Django to SAP S/4HANA](docs/Gearbox-SAP-Django-Integration-Guide.pdf)

![Executive dashboard](docs/executive-dashboard.jpg)

Gearbox is the integrated dashboard portfolio inside Nirmana ERP. It gives
directors one command view across ERP practices and business processes, surfaces
inconsistent records with owners and due dates, and then drops into the SAP
enterprise structure and maintenance workspaces. This repository is a public,
synthetic showcase of that stack. It is intentionally independent of the private
product repository: no product code, client data, logos or database.

**Pramaan** is the separate SAP audit and implementation portfolio at
`pramaan.nirmanaerp.com`; Gearbox keeps only a handoff at `/audit`. **Kavach**
is the cybersecurity portfolio at `kavach.nirmanaerp.com`, and **Benchmark** is
the efficiency-benchmarking portfolio at `benchmark.nirmanaerp.com`. Promonitor,
Yamuna, Xirra, LedgeFlow and CoreSight are the other sibling portfolios; Gearbox
is separate from all of them.

## Stack

- Next.js 15 (App Router, static export)
- Tailwind CSS 3
- Apache ECharts
- Framer Motion
- TypeScript

## Run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Production build:

```bash
npm run build
```

The static site is written to `out/`.

## Pages

- `/` — showcase landing page
- `/enterprise` — director command view across Generation, Grid, Services and Retail, with data confidence and the closed-loop exception register
- `/landscape` — SAP enterprise structure: company, company codes, plants, business areas and org units across S/4HANA and ECC R/3
- `/demo/[plant]` — maintenance command centre
- `/demo/[plant]/maintenance` — PM, backlog and work orders
- `/demo/[plant]/reliability` — MTBF/MTTR, pareto, bad actors, RCA
- `/demo/[plant]/ptw` — permits, isolation and cycle time
- `/demo/[plant]/cost` — cost / RAV, cost per MWh, cost mix
- `/demo/[plant]/rca-qa` — RCA, findings, CAPA, checklists, data quality
- `/data-model` — canonical entities, star schema, field ownership
- `/erp-integration` — adapters, SAP API inventory, what is real vs synthetic
- `/audit` — handoff to the live Pramaan SAP audit and implementation portfolio
- `/portfolio` — the common Nirmana ERP portfolio page: eight sibling portfolios plus Gearbox, and the parent next-generation ERP platform
- `/about` — scope and disclaimers

Plants: `coal`, `thermal`, `wind`, `gas`.

## Interactions

- **Enterprise** — switch Group / Generation / Grid / Services / Retail; the command posture, KPI strip, attention list and exception register follow the selected vertical.
- **SAP landscape** — switch Combined / S/4HANA / ECC R/3; every KPI, table and configuration column follows the selected landscape.
- **Overview** — switch Source / Canonical / Variance, and model a PM compliance recovery.
- **Maintenance** — change available crew hours to see crew load and the over-capacity count.
- **Reliability** — remove a share of top-three bad-actor downtime to see loss avoided.
- **Permits** — filter open permits by age.

The scenario values are illustrative and run against the synthetic dataset. The
Source / Canonical difference is modelled for the demo.

## Data

All data is synthetic and deterministic. Plant and maintenance data is generated
in `lib/data.ts` from a seeded PRNG. The SAP landscape configuration lives in
`lib/landscape.ts`; the enterprise command metrics and exception register live in
`lib/enterprise.ts`. Both are hand-authored for demonstration. There is no client
data and no live ERP call in this repository. Numbers are designed to be
plausible, not to represent any real company or plant.

## Enterprise command

Meridian Energy is shown as four verticals:

- **Generation** — S/4HANA, company code 1000.
- **Grid** — ECC R/3, company code 2000.
- **Services** — S/4HANA, company code 3000.
- **Retail** — ECC R/3, company code 4000.

Directors see revenue, EBITDA, headcount, payroll cost, attrition, open roles and
data confidence for the group or any vertical. The exception register shows the
records behind the score: severity, owner, status, due date and remedy. The
closed-loop view tracks detection, correction, review and certification.

The sibling portfolios are not part of this landscape. They are linked from the
dashboard footer and the common `/portfolio` page as separate Nirmana ERP
business domains. Each runs on its own subdomain; Pramaan keeps only a handoff at
`/audit`. The portfolio page also presents Gearbox as the ninth member and the
Nirmana ERP parent platform underneath.

## Portfolio separation

- **Gearbox** — integrated dashboards across ERP practices and business processes; presented as the ninth member on the common portfolio page, not as a sibling portfolio.
- **Pramaan** — SAP audit and implementation. Repository `BusDec/pramaan`; live at `pramaan.nirmanaerp.com`.
- **Kavach** — cybersecurity. Repository `BusDec/kavach`; live at `kavach.nirmanaerp.com`.
- **Benchmark** — efficiency benchmarking. Live at `benchmark.nirmanaerp.com`.
- **Promonitor, Yamuna, Xirra, LedgeFlow, CoreSight** — existing sibling portfolios, unchanged.

## SAP landscape

Two synthetic SAP systems are configured:

- **SAP S/4HANA 2023** on SAP HANA 2.0, client 100: two company codes, four plants, one controlling area.
- **SAP ECC 6.0 EHP8** on Oracle 19c, client 100: two company codes, three plants, one controlling area.

The dashboard reads the company, company codes, plants, business areas,
controlling areas, sales organisations, purchasing organisations and storage
locations from both systems. A configuration matrix shows the source table and key for each object
(`T880`, `T001`, `T001W`, `TGSB`, `TKA01`, `TVKO`, `T024E`, `T001L`).

## Decoupling

The demo has no dependency on the private product repository, its database or
its client branding. All content here is self-contained.

## Deploy

The site uses `output: "export"`, so it can be hosted on Vercel, Azure Static
Web Apps, Netlify or any static host.

- Vercel: import the repository and keep the default Next.js settings.
- Azure Static Web Apps: app location `/`, output location `out`.
- GitHub Pages: the workflow builds for the custom domain root. If you deploy
  to a project subpath instead (for example
  `https://<user>.github.io/cmms-demo/`), set
  `NEXT_PUBLIC_BASE_PATH=/cmms-demo` for the build.

## Status

This is a demonstration, not a certified product. The SAP landscape configuration
is synthetic; the SAP adapter is validated against a local simulator, not a
customer sandbox. The other ERP adapters are shown as planned until their APIs
are implemented and tested. Gearbox is the integrated dashboard product; Pramaan
is the separate SAP audit and implementation portfolio; Kavach is the
cybersecurity portfolio; Benchmark is the efficiency-benchmarking portfolio. All
names require trademark screening before commercial use.
