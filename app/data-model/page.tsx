import Link from "next/link";
import { SimpleHeader } from "@/components/simple-header";

export const metadata = {
  title: "Data model · Gearbox demo",
  description:
    "The canonical maintenance entities, reporting star schema and medallion flow behind the four-plant demo.",
};

const entities = [
  ["Functional location", "Where the work happens", "code, parent, plant, cost centre, criticality"],
  ["Equipment", "The asset", "asset tag, manufacturer, serial, linear/measure, replacement value"],
  ["Maintenance plan", "Preventive schedule", "plan code, cycle, next due, task list"],
  ["Notification", "Request or breakdown", "number, equipment, priority, malfunction start/end, state"],
  ["Work order", "Execution header", "number, order type, dates, actual cost, state"],
  ["Operation", "Individual step", "operation number, work centre, planned/actual hours"],
  ["Material component", "Spares reserved or consumed", "material, quantity, unit cost"],
  ["Time confirmation", "Labour", "technician, hours, work date, final flag"],
  ["Asset meter / reading", "Usage and condition", "meter type, reading, unit, reading date"],
  ["Failure report", "Reliability codes", "problem, cause, remedy, failure mode, downtime"],
  ["KPI snapshot", "Pre-aggregated executive data", "period, cost, RAV, MTBF, MTTR, PM compliance"],
];

const facts = ["FactWorkOrder", "FactNotification", "FactPMCompliance", "FactDowntime", "FactCost", "FactRCA"];
const dimensions = ["DimDate", "DimPlant", "DimFunctionalLocation", "DimEquipment", "DimWorkCentre", "DimStatus", "DimCatalog"];

export default function DataModelPage() {
  return (
    <main className="min-h-screen bg-canvas">
      <SimpleHeader />

      <div className="mx-auto max-w-[1080px] px-5 py-10 sm:px-8 lg:py-14">
        <p className="eyebrow">Data model</p>
        <h1 className="mt-2 max-w-[20ch] text-[clamp(2rem,4vw,3rem)] font-semibold tracking-[-0.035em]">
          One canonical model behind four ERPs.
        </h1>
        <p className="measure mt-4 text-[14px] leading-relaxed text-muted">
          The dashboards never read SAP AUFK, Oracle WIP_ENTITIES or Maximo WORKORDER
          directly. Adapters map each source into the same canonical entities, and the
          reporting layer reads those entities or the pre-aggregated KPI snapshots.
        </p>

        <section className="mt-10">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-[20px] font-semibold tracking-[-0.02em]">Canonical entities</h2>
            <span className="text-[11px] text-muted">11 core entities</span>
          </div>
          <div className="mt-4 overflow-x-auto rounded-xl border border-line bg-surface">
            <table className="w-full min-w-[720px] text-left text-[12px]">
              <thead>
                <tr className="border-b border-line text-[11px] text-muted">
                  <th className="px-4 py-3 font-semibold">Entity</th>
                  <th className="px-4 py-3 font-semibold">Purpose</th>
                  <th className="px-4 py-3 font-semibold">Key fields</th>
                </tr>
              </thead>
              <tbody>
                {entities.map(([name, purpose, fields]) => (
                  <tr key={name} className="border-b border-line/70 last:border-0">
                    <td className="px-4 py-3 font-semibold">{name}</td>
                    <td className="px-4 py-3 text-muted">{purpose}</td>
                    <td className="px-4 py-3 text-muted">{fields}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-12 grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div>
            <h2 className="text-[20px] font-semibold tracking-[-0.02em]">Reporting star</h2>
            <p className="mt-2 text-[13px] leading-relaxed text-muted">
              The analytical layer is a star schema. Facts carry the grain; dimensions
              carry the drill paths. Power BI or the Django workspace can read the same
              gold tables.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="card p-4">
                <p className="text-[11px] font-semibold text-muted">Facts</p>
                <ul className="mt-3 space-y-2 text-[12px]">
                  {facts.map((fact) => (
                    <li key={fact} className="border-t border-line pt-2 font-medium">
                      {fact}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="card p-4">
                <p className="text-[11px] font-semibold text-muted">Dimensions</p>
                <ul className="mt-3 space-y-2 text-[12px]">
                  {dimensions.map((dim) => (
                    <li key={dim} className="border-t border-line pt-2 font-medium">
                      {dim}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-[20px] font-semibold tracking-[-0.02em]">Medallion flow</h2>
            <p className="mt-2 text-[13px] leading-relaxed text-muted">
              Raw ERP payloads are kept for replay. The silver layer conforms types,
              units and status maps. The gold layer is the signed-off KPI mart.
            </p>
            <div className="mt-5 space-y-2">
              {[
                ["Bronze", "Raw OData/REST payloads, append-only, source hash and cursor."],
                ["Silver", "Canonical entities, deduplicated by external id, status mapped to core state."],
                ["Gold", "Star schema, KPI snapshots, RLS-ready plant and org-unit columns."],
              ].map(([layer, description], index) => (
                <div
                  key={layer}
                  className="grid grid-cols-[84px_1fr] gap-4 rounded-lg border border-line bg-surface px-4 py-4"
                >
                  <p className="text-[12px] font-semibold">{layer}</p>
                  <p className="text-[12px] leading-relaxed text-muted">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-[20px] font-semibold tracking-[-0.02em]">Field ownership</h2>
          <p className="mt-2 max-w-[70ch] text-[13px] leading-relaxed text-muted">
            Bidirectional integration only works when ownership is explicit. The
            connector never overwrites a field the CMMS owns.
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="card p-5">
              <p className="text-[12px] font-semibold text-info">ERP owns</p>
              <ul className="mt-3 space-y-2 text-[12px] text-muted">
                <li className="border-t border-line pt-2">Master data: functional locations, equipment, materials</li>
                <li className="border-t border-line pt-2">Status, costs and confirmations</li>
                <li className="border-t border-line pt-2">Maintenance plans and task lists</li>
              </ul>
            </div>
            <div className="card p-5">
              <p className="text-[12px] font-semibold text-good">CMMS owns</p>
              <ul className="mt-3 space-y-2 text-[12px] text-muted">
                <li className="border-t border-line pt-2">Permit to work, isolation and LOTO</li>
                <li className="border-t border-line pt-2">Checklists, RCA, CAPA and QA findings</li>
                <li className="border-t border-line pt-2">Local notes, photos and shift handover</li>
              </ul>
            </div>
          </div>
        </section>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link
            href="/erp-integration"
            className="rounded-md bg-[var(--warn)] px-4 py-2.5 text-[13px] font-semibold text-[var(--graphite)]"
          >
            How the adapters work
          </Link>
          <Link
            href="/demo/coal"
            className="rounded-md border border-line bg-surface px-4 py-2.5 text-[13px] font-semibold"
          >
            Open the demo
          </Link>
        </div>
      </div>
    </main>
  );
}
