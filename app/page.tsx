import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { getAllPlantData } from "@/lib/data";
import { formatCurrency, formatNumber } from "@/lib/utils";

function sparkline(values: number[]) {
  const min = Math.min(...values) - 0.4;
  const max = Math.max(...values) + 0.4;
  return values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * 100;
      const y = 28 - ((value - min) / (max - min)) * 24;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

export default function HomePage() {
  const data = getAllPlantData();

  return (
    <main className="overflow-x-hidden">
      <section className="bg-[var(--graphite)] text-white">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
          <nav className="flex flex-wrap items-center justify-between gap-4 py-5">
            <Link href="/" className="text-[15px] font-semibold tracking-[-0.01em]">
              Gearbox
            </Link>
            <div className="flex flex-wrap items-center gap-5 text-[13px] text-white/65">
              <Link href="/demo/coal" className="hover:text-white">
                Demo
              </Link>
              <Link href="/data-model" className="hover:text-white">
                Data model
              </Link>
              <Link href="/erp-integration" className="hover:text-white">
                ERP integration
              </Link>
              <Link href="/about" className="hover:text-white">
                About
              </Link>
              <Link
                href="/demo/coal"
                className="hidden items-center gap-1.5 rounded-md bg-white px-3.5 py-2 text-[12px] font-semibold text-ink sm:inline-flex"
              >
                Open the demo <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </nav>

          <div className="grid items-end gap-10 pb-14 pt-12 lg:grid-cols-[1.15fr_0.85fr] lg:pb-20 lg:pt-20">
            <div>
              <p className="text-[12px] font-semibold text-white/50">
                A CMMS wrapper for SAP, Oracle and Maximo
              </p>
              <h1 className="display mt-4 max-w-[20ch] text-[clamp(2.8rem,5vw,5rem)] font-semibold">
                Four plants. Four ERPs. One view.
              </h1>
              <p className="mt-5 max-w-[58ch] text-[16px] leading-relaxed text-white/70">
                One canonical maintenance model over SAP S/4HANA, SAP ECC, IBM
                Maximo and Oracle EAM. The same KPIs, the same drill-through, the
                same executive view — without replacing the system of record.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link
                  href="/demo/coal"
                  className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2.5 text-[13px] font-semibold text-ink"
                >
                  Explore the command centre <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/data-model"
                  className="inline-flex items-center gap-2 rounded-md border border-white/20 px-4 py-2.5 text-[13px] font-semibold text-white/85"
                >
                  See the canonical model
                </Link>
              </div>
              <p className="mt-4 text-[11px] text-white/55">
                Synthetic data · no client data or logos · built for demonstration
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[12px] font-semibold text-white/70">
                  Cross-plant snapshot
                </p>
                <span className="rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-white/55">
                  Nov 2026
                </span>
              </div>
              <div className="mt-3 space-y-1">
                {data.map((plant) => (
                  <Link
                    key={plant.plant.slug}
                    href={`/demo/${plant.plant.slug}`}
                    className="grid grid-cols-[1.2fr_0.7fr_0.7fr] items-center gap-3 rounded-lg px-2 py-3 hover:bg-white/[0.06]"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-[12px] font-semibold">
                        {plant.plant.shortName}
                      </p>
                      <p className="text-[10px] text-white/60">{plant.plant.sourceErpShort}</p>
                    </div>
                    <div>
                      <svg viewBox="0 0 100 30" className="h-6 w-full" aria-hidden="true">
                        <polyline
                          points={sparkline(plant.monthly.map((point) => point.availability))}
                          fill="none"
                          stroke="rgba(255,255,255,0.7)"
                          strokeWidth="1.6"
                          vectorEffect="non-scaling-stroke"
                        />
                      </svg>
                      <p className="tabular mt-0.5 text-[10px] text-white/60">
                        {formatNumber(plant.kpis[0].value, 1)}% available
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="tabular text-[12px] font-semibold">
                        {formatCurrency(plant.kpis[2].value, true)}
                      </p>
                      <p className="text-[10px] text-white/60">downtime loss</p>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="mt-3 border-t border-white/10 pt-3 text-[10px] leading-relaxed text-white/40">
                Availability, PM compliance, cost and downtime are normalised from
                four different source systems into one canonical model.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-5 py-16 sm:px-8 lg:py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">The four scenarios</p>
            <h2 className="mt-2 max-w-[18ch] text-[clamp(1.8rem,3.4vw,2.6rem)] font-semibold tracking-[-0.03em]">
              Different systems. One operating language.
            </h2>
          </div>
          <Link
            href="/demo/coal"
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-info"
          >
            Start with the coal station <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 grid gap-3 md:grid-cols-2">
          {data.map((plant) => (
            <Link
              key={plant.plant.slug}
              href={`/demo/${plant.plant.slug}`}
              className="group card p-5 transition-colors hover:bg-white"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold text-muted">
                    {plant.plant.location}
                  </p>
                  <h3 className="mt-1 text-[20px] font-semibold tracking-[-0.02em]">
                    {plant.plant.name}
                  </h3>
                </div>
                <span className="rounded-md bg-[#eef2f7] px-2 py-1 text-[10px] font-semibold text-muted">
                  {plant.plant.sourceErpShort}
                </span>
              </div>
              <div className="mt-4 flex flex-wrap items-baseline gap-x-6 gap-y-2">
                <div>
                  <p className="tabular text-[26px] font-semibold tracking-[-0.03em]">
                    {formatNumber(plant.kpis[0].value, 1)}%
                  </p>
                  <p className="text-[10px] text-muted">availability</p>
                </div>
                <div>
                  <p className="tabular text-[26px] font-semibold tracking-[-0.03em]">
                    {formatNumber(plant.kpis[3].value, 0)}%
                  </p>
                  <p className="text-[10px] text-muted">PM compliance</p>
                </div>
                <div>
                  <p className="tabular text-[26px] font-semibold tracking-[-0.03em]">
                    {formatCurrency(plant.kpis[2].value, true)}
                  </p>
                  <p className="text-[10px] text-muted">downtime loss</p>
                </div>
              </div>
              <p className="mt-4 max-w-[52ch] text-[13px] leading-relaxed text-muted">
                {plant.plant.story}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-[12px] font-semibold text-info">
                Open {plant.plant.shortName} <ArrowUpRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-surface">
        <div className="mx-auto grid max-w-[1280px] gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:py-24">
          <div>
            <p className="eyebrow">What is shared</p>
            <h2 className="mt-2 max-w-[16ch] text-[clamp(1.8rem,3.4vw,2.6rem)] font-semibold tracking-[-0.03em]">
              The connector is the moat.
            </h2>
            <p className="mt-4 max-w-[52ch] text-[14px] leading-relaxed text-muted">
              Every source system has its own tables, statuses and APIs. The wrapper
              maps them into one canonical model, then builds the same KPIs and
              drill-through on top. The ERP stays the system of record.
            </p>
            <div className="mt-6 space-y-3 text-[13px]">
              {[
                ["Canonical model", "Functional locations, equipment, notifications, orders, confirmations, meters and failure codes."],
                ["ERP adapters", "SAP S/4HANA OData is implemented; ECC RFC/BAPI, Oracle EAM REST and Maximo REST sit behind the same interface next."],
                ["Scope-based access", "Group, region, plant and work-centre roles; financial fields masked where the role requires it."],
                ["Operational dashboards", "Command centre, maintenance, reliability, permits, cost, quality and corporate views."],
              ].map(([title, body]) => (
                <div key={title} className="grid grid-cols-[0.8fr_1.2fr] gap-4 border-t border-line pt-3">
                  <p className="font-semibold">{title}</p>
                  <p className="text-muted">{body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card overflow-hidden">
            <div className="border-b border-line px-5 py-4">
              <p className="text-[12px] font-semibold">Canonical flow</p>
              <p className="mt-1 text-[11px] text-muted">
                Source → canonical → workspace
              </p>
            </div>
            <div className="space-y-4 p-5">
              <div className="grid gap-2 sm:grid-cols-4">
                {["SAP S/4", "SAP ECC", "Maximo", "Oracle EAM"].map((erp) => (
                  <div
                    key={erp}
                    className="rounded-md border border-line bg-[#f8fafc] px-3 py-3 text-center text-[11px] font-semibold"
                  >
                    {erp}
                  </div>
                ))}
              </div>
              <div className="text-center text-[11px] text-muted">
                OData · RFC/BAPI · REST · IDoc
              </div>
              <div className="rounded-md bg-[var(--graphite)] px-4 py-4 text-center text-[12px] font-semibold text-white">
                Canonical maintenance model
              </div>
              <div className="grid gap-2 sm:grid-cols-3">
                {["Command centre", "Maintenance", "Reliability"].map((page) => (
                  <div
                    key={page}
                    className="rounded-md border border-line px-3 py-3 text-center text-[11px] font-semibold"
                  >
                    {page}
                  </div>
                ))}
              </div>
              <div className="grid gap-2 sm:grid-cols-3">
                {["Permits", "Cost", "RCA & quality"].map((page) => (
                  <div
                    key={page}
                    className="rounded-md border border-line px-3 py-3 text-center text-[11px] font-semibold"
                  >
                    {page}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-5 py-16 sm:px-8 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="eyebrow">What the demo covers</p>
            <h2 className="mt-2 max-w-[18ch] text-[clamp(1.8rem,3.4vw,2.6rem)] font-semibold tracking-[-0.03em]">
              A complete operating picture.
            </h2>
            <div className="mt-6 grid gap-x-8 gap-y-4 text-[13px] sm:grid-cols-2">
              {[
                "Executive command centre",
                "PM compliance and backlog ageing",
                "MTBF, MTTR and bad actors",
                "Permit-to-work and isolation",
                "Cost, spares and manpower",
                "RCA, CAPA and checklist completion",
                "Canonical data model",
                "ERP integration and field ownership",
              ].map((item) => (
                <div key={item} className="border-t border-line pt-3 font-medium">
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <Link
              href="/data-model"
              className="flex items-center justify-between gap-4 rounded-xl border border-line bg-surface px-5 py-5 hover:bg-white"
            >
              <div>
                <p className="text-[14px] font-semibold">Data model</p>
                <p className="mt-1 text-[12px] text-muted">
                  Canonical entities, star schema and the medallion flow.
                </p>
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted" />
            </Link>
            <Link
              href="/erp-integration"
              className="flex items-center justify-between gap-4 rounded-xl border border-line bg-surface px-5 py-5 hover:bg-white"
            >
              <div>
                <p className="text-[14px] font-semibold">ERP integration</p>
                <p className="mt-1 text-[12px] text-muted">
                  How SAP, Oracle and Maximo map into the same model.
                </p>
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted" />
            </Link>
            <Link
              href="/about"
              className="flex items-center justify-between gap-4 rounded-xl border border-line bg-surface px-5 py-5 hover:bg-white"
            >
              <div>
                <p className="text-[14px] font-semibold">About the demo</p>
                <p className="mt-1 text-[12px] text-muted">
                  Synthetic data, scope and what is intentionally not shown.
                </p>
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-line bg-surface">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-4 px-5 py-8 text-[11px] text-muted sm:px-8">
          <p>Gearbox demo · synthetic data · no client logos or records</p>
          <p>Four plants · four ERPs · one canonical maintenance model</p>
        </div>
      </footer>
    </main>
  );
}
