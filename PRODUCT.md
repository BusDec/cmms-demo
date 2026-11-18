# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Directors and business leaders evaluating SAP enterprise visibility: group
executives, vertical and company leads, CIOs, ERP and enterprise-architecture
stakeholders, and plant or maintenance leaders. They arrive from a link or a
sales conversation, scan the enterprise command, the exception register and the
SAP landscape on desktop or mobile, and the successful next step is a walkthrough
or conversation with the team.

## Product Purpose

Gearbox is the integrated dashboard portfolio inside Nirmana ERP: a public,
synthetic showcase of a top-down command view across ERP practices and business
processes. For Meridian Energy, directors see revenue, cost, people and data
confidence across Generation, Grid, Services and Retail, then drop into the
inconsistent records behind the score. Below the command layer sit the SAP
enterprise structure across S/4HANA and ECC R/3 and a four-plant CMMS wrapper
over SAP, IBM Maximo and Oracle EAM. Success is a qualified prospective client
asking for the walkthrough.

## Positioning

An integrated dashboard layer across ERP practices and business processes, shown
through Meridian Energy's four verticals, two SAP landscapes and four maintenance
scenarios. The product owns the command view, the exception register, the SAP
structure view, the canonical model and the operating picture; the ERP remains
the system of record for org units, master data, status, cost and confirmations.
The command layer deliberately shows the inconsistent records instead of hiding
them behind an average. SAP audit and implementation sit in the separate
Pramaan portfolio; cybersecurity sits in Kavach; efficiency benchmarking sits in
Benchmark.

## Operating Context

The demo is a public static web export. It has no login, database or live ERP
connection; all verticals, company codes, plants, business areas, employees,
exception counts, assets, work orders, permits, costs and KPIs are deterministic
synthetic data. Visitors first read the enterprise command across Generation,
Grid, Services and Retail, then the SAP landscape across S/4HANA and ECC R/3,
then compare four maintenance scenarios (coal, thermal, wind, gas) across
executive, maintenance, reliability, permits, cost and RCA/quality workspaces.
It is used in sales conversations and on mobile.

## Capabilities and Constraints

- Enterprise command dashboard: Group plus Generation, Grid, Services and Retail
  views; revenue, EBITDA, headcount, payroll, attrition, open roles and data
  confidence; a closed-loop exception register with severity, records, owner,
  status, due date and remedy.
- SAP landscape dashboard: combined, S/4HANA and ECC R/3 views; company, company
  codes, plants, business areas, controlling areas, sales and purchasing
  organisations, storage locations and a configuration matrix.
- Six maintenance workspaces: executive, maintenance, reliability, permits and
  safety, cost and resources, RCA and quality.
- Supporting pages: data model, ERP integration, a Pramaan handoff,
  Nirmana ERP sibling portfolio links, about and 404.
- The SAP PM audit pack — 20 checks across 13 domains, with a rule engine,
  evidence, findings and remediation — now lives in the separate Pramaan
  portfolio at `pramaan.nirmanaerp.com`. Gearbox keeps only the `/audit` handoff.
- Plant switcher, enterprise vertical switcher, landscape switcher, severity
  filter, range tabs, charts and tables; responsive down to mobile;
  reduced-motion support.
- No authentication, persistence, admin area or live ERP call.
- No client data, logos, names, records or screenshots. No real plant is
  represented.
- The SAP S/4HANA adapter and simulator live in a separate private connector
  repository and are not called by the static demo at runtime.
- The demo is not SAP-certified. Real SAP validation requires a sandbox,
  communication arrangement, released API list and OAuth2 credentials.
- SAP ECC, IBM Maximo and Oracle EAM adapters are planned, not
  production-validated.
- No testimonials, client benchmarks, pricing or commercial claims are present.

## Brand Commitments

- Parent brand: **Nirmana ERP** at [nirmanaerp.com](https://nirmanaerp.com).
- SAP enterprise dashboard: **Gearbox**, for Meridian Energy.
- Sibling portfolios: **Promonitor**, **Yamuna**, **Xirra**, **LedgeFlow**,
  **CoreSight**, **Benchmark**, **Kavach** and **Pramaan** — separate Nirmana ERP
  business domains with their own users. They are linked for navigation only and
  are not part of the Meridian SAP landscape.
- **Pramaan** is the separate SAP audit and implementation portfolio at
  `pramaan.nirmanaerp.com`; repository `BusDec/pramaan`.
- **Kavach** is the cybersecurity portfolio at `kavach.nirmanaerp.com`;
  repository `BusDec/kavach`.
- **Benchmark** is the efficiency-benchmarking portfolio at
  `benchmark.nirmanaerp.com`, built on data envelopment analysis.
- Use the parent lockup (Nirmana above Gearbox) in the wordmark, page titles and
  metadata. Keep the sibling portfolios clearly separate from the SAP dashboard.
- Neutral demo branding only. No client logos or client-specific colours.
- "Gearbox" overlaps with an established game studio; trademark screening is
  required before commercial use.

## Evidence on Hand

- Public demo: https://gearbox.nirmanaerp.com/ (the `github.io` project URL redirects here)
- Parent: Nirmana ERP at https://nirmanaerp.com
- Gearbox source: `BusDec/cmms-demo`
- Pramaan source: `BusDec/pramaan`
- Kavach source: `BusDec/kavach`
- Benchmark: live at https://benchmark.nirmanaerp.com
- Screenshot: `docs/executive-dashboard.jpg`.
- Maintenance datasets are generated in `lib/data.ts`; the SAP landscape
  configuration is in `lib/landscape.ts`; the enterprise command metrics and
  exception register are in `lib/enterprise.ts`. No client or production data is
  present.
- The private `erp-connector` repository contains the S/4HANA adapter, simulator
  and contract tests; it is not wired into the static demo at runtime.
- Absent: client logos, testimonials, case studies, production screenshots,
  benchmark data and certification evidence.

## Product Principles

1. The ERP stays the system of record; the product is the intelligence and
   operating layer around it.
2. One canonical model, many sources: the same KPI and workspace should not fork
   by ERP.
3. Start top-down: directors see the enterprise, the exceptions and the route to
   closure before the module detail.
4. Keep portfolio boundaries explicit: Gearbox is dashboards, Pramaan is SAP
   audit and implementation, Kavach is cybersecurity, Benchmark is efficiency
   benchmarking. Do not blur them inside one product surface.
5. Show the structure before the transaction: resolve company code, plant and
   business area before a work order is counted.
6. Show the operating picture, not a chart gallery: every number should answer a
   decision.
7. Be explicit about what is synthetic, implemented, planned or unproven.
8. Earn the walkthrough on a phone as well as on a desktop.

## Accessibility & Inclusion

No formal accessibility standard has been agreed. Preserve the existing
responsive layout, keyboard focus styles and `prefers-reduced-motion` support; do
not add motion or interaction that blocks the demo on a phone.
