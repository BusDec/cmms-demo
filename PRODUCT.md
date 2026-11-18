# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Prospective clients evaluating SAP landscape visibility and a CMMS layer over an
existing ERP: CIOs, ERP and enterprise-architecture leads, plant managers,
maintenance and reliability leaders, and integration stakeholders. They arrive
from a link or a sales conversation, scan the enterprise structure and the
four-plant story on desktop or mobile, and the successful next step is a
walkthrough or conversation with the team.

## Product Purpose

Gearbox is the SAP landscape and maintenance intelligence product in the Nirmana
portfolio: a public, synthetic showcase of enterprise structure across SAP
S/4HANA and SAP ECC R/3, plus a four-plant CMMS wrapper over SAP, IBM Maximo and
Oracle EAM. It makes two claims legible in a few minutes: the group's company
codes, plants, business areas and controlling areas can be read as one
structure, and the same canonical maintenance model and six operating workspaces
can sit over different ERP systems without replacing the system of record.
Success is a qualified prospective client asking for the walkthrough.

## Positioning

One enterprise structure and maintenance intelligence layer over two SAP
landscapes and four ERP scenarios. The product owns the structure view, the
canonical model, the cross-plant workspace, permits, RCA/QA and the operating
picture; the ERP remains the system of record for org units, master data, status,
cost and confirmations. SAP S/4HANA is the implemented reference adapter; SAP
ECC, IBM Maximo and Oracle EAM are planned scenarios and are labelled as such.

## Operating Context

The demo is a public static web export. It has no login, database or live ERP
connection; all company codes, plants, business areas, assets, work orders,
permits, costs and KPIs are deterministic synthetic data. Visitors first read the
SAP landscape across S/4HANA and ECC R/3, then compare four maintenance scenarios
(coal, thermal, wind, gas) across executive, maintenance, reliability, permits,
cost and RCA/quality workspaces, then read the data-model and ERP-integration
pages. It is used in sales conversations and on mobile.

## Capabilities and Constraints

- SAP landscape dashboard: combined, S/4HANA and ECC R/3 views; company, company
  codes, plants, business areas, controlling areas, sales and purchasing
  organisations, storage locations and a configuration matrix.
- Six maintenance workspaces: executive, maintenance, reliability, permits and
  safety, cost and resources, RCA and quality.
- Supporting pages: data model, ERP integration, Pramaan ERP audit, portfolio,
  about and 404.
- The Pramaan ERP audit runs the SAP PM pack: 20 checks across 13 domains against
  a deterministic synthetic dataset. The rule engine and scores are computed; no
  SAP system is called. It is not an SAP-certified audit.
- Audit filters: domain, section (master data / transactional), result
  (failing / passing / N/A) and severity (critical / high / medium).
- Plant switcher, landscape switcher, range tabs, charts and tables; responsive
  down to mobile; reduced-motion support.
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

- Parent brand: **Nirmana**, wordmark **nirmNa**, at [nirmanaerp.com](https://nirmanaerp.com).
- Dashboard product: **Gearbox**.
- ERP audit and implementation vertical: **Pramaan** — recommended working name,
  subject to trademark screening. The audit product is the SAP PM pack today;
  finance and HR packs follow.
- Sibling practices: **Promonitor** and **Yamuna**. S/4HANA implementation is
  delivered under Pramaan.
- Use the parent lockup (nirmNa above Gearbox) in the wordmark, page titles and
  metadata. Use "Pramaan" for the audit and implementation practice.
- Neutral demo branding only. No client logos or client-specific colours.
- "Gearbox" overlaps with an established game studio; trademark screening is
  required before commercial use.

## Evidence on Hand

- Public demo: https://gearbox.nirmanaerp.com/ (the `github.io` project URL redirects here)
- Parent portfolio: https://nirmanaerp.com
- Source: `BusDec/cmms-demo`; the repository is self-contained and has no
  dependency on the private product repository.
- Screenshot: `docs/executive-dashboard.jpg`.
- Maintenance datasets are generated in `lib/data.ts`; the SAP landscape
  configuration is in `lib/landscape.ts`. No client or production data is present.
- The private `erp-connector` repository contains the S/4HANA adapter, simulator
  and contract tests; it is not wired into the static demo at runtime.
- Absent: client logos, testimonials, case studies, production screenshots,
  benchmark data and certification evidence.

## Product Principles

1. The ERP stays the system of record; the product is the intelligence and
   operating layer around it.
2. One canonical model, many sources: the same KPI and workspace should not fork
   by ERP.
3. Show the structure before the transaction: resolve company code, plant and
   business area before a work order is counted.
4. Show the operating picture, not a chart gallery: every number should answer a
   decision.
5. Be explicit about what is synthetic, implemented, planned or unproven.
6. Earn the walkthrough on a phone as well as on a desktop.

## Accessibility & Inclusion

No formal accessibility standard has been agreed. Preserve the existing
responsive layout, keyboard focus styles and `prefers-reduced-motion` support; do
not add motion or interaction that blocks the demo on a phone.
