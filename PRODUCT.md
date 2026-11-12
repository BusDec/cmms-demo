# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Prospective clients evaluating a CMMS layer over an existing ERP: plant managers,
maintenance and reliability leaders, and ERP/integration stakeholders. They arrive
from a link or a sales conversation, scan the four-plant story on desktop or
mobile, and the successful next step is a walkthrough or conversation with the
team.

## Product Purpose

Gearbox is a public, synthetic four-plant showcase of a CMMS wrapper over SAP
S/4HANA, SAP ECC, IBM Maximo and Oracle EAM. It makes one claim legible in a few
minutes: the same canonical maintenance model and the same six operating
workspaces can sit over different ERP systems without replacing the system of
record. Success is a qualified prospective client asking for the walkthrough.

## Positioning

One maintenance intelligence layer over four ERP scenarios. The product owns the
canonical model, the cross-plant workspace, permits, RCA/QA and the operating
picture; the ERP remains the system of record for master data, status, cost and
confirmations. This is a four-ERP concept showcase: SAP S/4HANA is the
implemented reference adapter, while SAP ECC, IBM Maximo and Oracle EAM are
planned scenarios and are labelled as such.

## Operating Context

The demo is a public static web export. It has no login, database or live ERP
connection; all plant names, assets, work orders, permits, costs and KPIs are
deterministic synthetic data. Visitors compare four scenarios (coal, thermal,
wind, gas) across executive, maintenance, reliability, permits, cost and
RCA/quality workspaces, then read the data-model and ERP-integration pages. It is
used in sales conversations and on mobile.

## Capabilities and Constraints

- Six workspaces: executive, maintenance, reliability, permits and safety, cost
  and resources, RCA and quality.
- Supporting pages: data model, ERP integration, about and 404.
- Plant switcher, range tabs, charts and tables; responsive down to mobile;
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

- Interim name: **Gearbox**. It is a working name for the demo, not a final
  commercial brand.
- Use the name consistently in the wordmark, page titles, metadata and README.
- Neutral demo branding only. No client logos or client-specific colours.
- "Gearbox" overlaps with an established game studio; trademark screening is
  required before commercial use.
- No final naming decision has been made.

## Evidence on Hand

- Public demo: https://busdec.github.io/cmms-demo/
- Source: `BusDec/cmms-demo`; the repository is self-contained and has no
  dependency on the private product repository.
- Screenshot: `docs/executive-dashboard.jpg`.
- Synthetic datasets are generated in `lib/data.ts`; no client or production
  data is present.
- The private `erp-connector` repository contains the S/4HANA adapter, simulator
  and contract tests; it is not wired into the static demo at runtime.
- Absent: client logos, testimonials, case studies, production screenshots,
  benchmark data and certification evidence.

## Product Principles

1. The ERP stays the system of record; the product is the intelligence and
   operating layer around it.
2. One canonical model, many sources: the same KPI and workspace should not fork
   by ERP.
3. Show the operating picture, not a chart gallery: every number should answer a
   decision.
4. Be explicit about what is synthetic, implemented, planned or unproven.
5. Earn the walkthrough on a phone as well as on a desktop.

## Accessibility & Inclusion

No formal accessibility standard has been agreed. Preserve the existing
responsive layout, keyboard focus styles and `prefers-reduced-motion` support; do
not add motion or interaction that blocks the demo on a phone.
