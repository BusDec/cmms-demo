import Link from "next/link";
import { Badge } from "@/components/badge";
import { SimpleHeader } from "@/components/simple-header";

export const metadata = {
  title: "ERP integration · Gearbox demo",
  description:
    "How SAP S/4HANA, SAP ECC, IBM Maximo and Oracle EAM adapters map into one canonical maintenance model.",
};

const adapters = [
  {
    erp: "SAP S/4HANA Cloud",
    transport: "OData V2/V4",
    auth: "OAuth2 client credentials",
    entities: "Equipment, functional locations, notifications, orders, confirmations, measuring points",
    status: "Reference adapter",
    tone: "good" as const,
  },
  {
    erp: "SAP ECC 6.0",
    transport: "RFC/BAPI or OData via Gateway",
    auth: "SAP NW RFC SDK or OAuth2",
    entities: "Same canonical entities, ECC field names",
    status: "Planned",
    tone: "warn" as const,
  },
  {
    erp: "IBM Maximo",
    transport: "REST / OSLC",
    auth: "API key or OAuth2",
    entities: "Assets, locations, work orders, preventive maintenance",
    status: "Planned",
    tone: "warn" as const,
  },
  {
    erp: "Oracle EAM",
    transport: "Oracle REST APIs",
    auth: "OAuth2 or basic",
    entities: "Assets, work orders, operations, materials",
    status: "Planned",
    tone: "warn" as const,
  },
];

const apis = [
  ["Equipment", "API_EQUIPMENT", "Inbound", "Asset master and criticality"],
  ["Functional location", "API_FUNCTIONALLOCATION", "Inbound", "Location hierarchy"],
  ["Maintenance notification", "API_MAINTNOTIFICATION", "Bidirectional", "Request and breakdown"],
  ["Maintenance order", "API_MAINTENANCEORDER", "Bidirectional", "Execution header and status"],
  ["Confirmation", "API_MAINTENANCEORDERCONFIRMATION", "Outbound", "Labour and time"],
  ["Measuring point", "API_MEASURINGPOINT", "Inbound", "Meters and condition"],
];

export default function ErpIntegrationPage() {
  return (
    <main className="min-h-screen bg-canvas">
      <SimpleHeader />

      <div className="mx-auto max-w-[1080px] px-5 py-10 sm:px-8 lg:py-14">
        <p className="eyebrow">ERP integration</p>
        <h1 className="mt-2 max-w-[22ch] text-[clamp(2rem,4vw,3rem)] font-semibold tracking-[-0.035em]">
          The ERP stays the system of record.
        </h1>
        <p className="measure mt-4 text-[14px] leading-relaxed text-muted">
          Each adapter owns authentication, pagination, field mapping and retries.
          The product owns the canonical model and the workspace. The connector is a
          standalone library, not a copy of any one CMMS.
        </p>

        <section className="mt-10">
          <h2 className="text-[20px] font-semibold tracking-[-0.02em]">Adapters</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {adapters.map((adapter) => (
              <div key={adapter.erp} className="card p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-[15px] font-semibold">{adapter.erp}</h3>
                  <Badge tone={adapter.tone}>{adapter.status}</Badge>
                </div>
                <dl className="mt-4 space-y-2 text-[12px]">
                  <div className="grid grid-cols-[86px_1fr] gap-3 border-t border-line pt-2">
                    <dt className="text-muted">Transport</dt>
                    <dd>{adapter.transport}</dd>
                  </div>
                  <div className="grid grid-cols-[86px_1fr] gap-3 border-t border-line pt-2">
                    <dt className="text-muted">Auth</dt>
                    <dd>{adapter.auth}</dd>
                  </div>
                  <div className="grid grid-cols-[86px_1fr] gap-3 border-t border-line pt-2">
                    <dt className="text-muted">Entities</dt>
                    <dd className="text-muted">{adapter.entities}</dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12 grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div>
            <h2 className="text-[20px] font-semibold tracking-[-0.02em]">SAP API inventory</h2>
            <p className="mt-2 text-[13px] leading-relaxed text-muted">
              Released S/4HANA Cloud APIs. The exact API list and communication
              arrangement must be confirmed in the client sandbox before UAT.
            </p>
            <div className="mt-4 overflow-x-auto rounded-xl border border-line bg-surface">
              <table className="w-full min-w-[520px] text-left text-[12px]">
                <thead>
                  <tr className="border-b border-line text-[11px] text-muted">
                    <th className="px-4 py-3 font-semibold">Entity</th>
                    <th className="px-4 py-3 font-semibold">API</th>
                    <th className="px-4 py-3 font-semibold">Direction</th>
                  </tr>
                </thead>
                <tbody>
                  {apis.map(([entity, api, direction]) => (
                    <tr key={entity} className="border-b border-line/70 last:border-0">
                      <td className="px-4 py-3">
                        <p className="font-semibold">{entity}</p>
                        <p className="text-[10px] text-muted">{apis.find((row) => row[0] === entity)?.[3]}</p>
                      </td>
                      <td className="px-4 py-3 text-muted">{api}</td>
                      <td className="px-4 py-3 text-muted">{direction}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 className="text-[20px] font-semibold tracking-[-0.02em]">What is real here</h2>
            <div className="mt-4 space-y-3">
              {[
                ["Real", "The OData client, OAuth2 flow, pagination, retry policy, canonical mapping, simulator and CI contract tests."],
                ["Synthetic", "The four plant datasets, KPI values, names and work orders on this site."],
                ["Not yet validated", "A real SAP sandbox: communication arrangement, API list, authorisations and field-level business validation."],
              ].map(([label, body]) => (
                <div key={label} className="rounded-lg border border-line bg-surface px-4 py-4">
                  <p className="text-[12px] font-semibold">{label}</p>
                  <p className="mt-1 text-[12px] leading-relaxed text-muted">{body}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-lg bg-[var(--graphite)] px-4 py-4 text-[12px] leading-relaxed text-white/75">
              The simulator is not SAP and is never described as certified. It exercises
              the same client code over HTTP so contract failures surface before a
              sandbox is available.
            </div>
          </div>
        </section>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link
            href="/data-model"
            className="rounded-md bg-ink px-4 py-2.5 text-[13px] font-semibold text-white"
          >
            See the canonical model
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
