import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { getAllPlantData } from "@/lib/data";
import { VERTICALS } from "@/lib/enterprise";
import { getSystem } from "@/lib/landscape";
import { PORTFOLIO } from "@/lib/portfolio";
import { formatCurrency, formatNumber } from "@/lib/utils";

const adapterStatus: Record<string, "Implemented" | "Planned"> = {
  coal: "Implemented",
  thermal: "Planned",
  wind: "Planned",
  gas: "Planned",
};

export default function HomePage() {
  const data = getAllPlantData();

  return (
    <main className="overflow-x-hidden">
      <section className="bg-[var(--canvas)] text-ink">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
          <nav className="flex flex-wrap items-center justify-between gap-4 py-5">
            <Link
              href="/"
              className="flex items-center gap-2.5 text-[15px] font-semibold tracking-[-0.01em]"
            >
              <span className="h-2 w-2 bg-[var(--warn)]" />
              <span className="flex flex-col leading-none">
                <span className="text-[10px] font-semibold tracking-[0.08em] text-muted">
                  nirmNa
                </span>
                <span className="mt-1">Gearbox</span>
              </span>
            </Link>
            <div className="flex flex-wrap items-center gap-5 text-[13px] text-muted">
              <Link href="/portfolio" className="hover:text-ink">
                Portfolio
              </Link>
              <Link href="/enterprise" className="hover:text-ink">
                Enterprise
              </Link>
              <Link href="/landscape" className="hover:text-ink">
                SAP landscape
              </Link>
              <Link href="/demo/coal" className="hover:text-ink">
                Demo
              </Link>
              <Link href="/data-model" className="hover:text-ink">
                Data model
              </Link>
              <Link href="/erp-integration" className="hover:text-ink">
                ERP integration
              </Link>
              <Link href="/audit" className="hover:text-ink">
                ERP audit
              </Link>
              <Link href="/about" className="hover:text-ink">
                About
              </Link>
              <Link
                href="/enterprise"
                className="hidden items-center gap-1.5 rounded-md bg-[var(--warn)] px-3.5 py-2 text-[12px] font-semibold text-[var(--graphite)] sm:inline-flex"
              >
                Open enterprise command <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </nav>

          <div className="atlas-hero">
            <div>
              <p className="atlas-kicker">Nirmana ERP · Gearbox</p>
              <h1 className="display atlas-title">
                Every vertical. <br />
                Every exception. <br />
                One command view.
              </h1>
              <p className="atlas-lede">
                Gearbox gives Meridian Energy directors one enterprise view across
                Generation, Grid, Services and Retail: revenue, cost, people and data
                confidence. Every inconsistency is visible, owned and on a path to
                closure.
              </p>
              <div className="atlas-actions">
                <Link href="/enterprise" className="atlas-primary">
                  Open enterprise command <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/landscape" className="atlas-secondary">
                  Open SAP landscape
                </Link>
              </div>
              <p className="atlas-note">
                Synthetic data · Meridian Energy Group · Client 100
              </p>
            </div>

            <div
              className="atlas-map"
              aria-label="Four Meridian Energy verticals converging into one enterprise command view"
            >
              <div className="atlas-map-head">
                <span>Verticals</span>
                <span>Command layer</span>
                <span>FY26</span>
              </div>
              <div className="atlas-map-body">
                <svg viewBox="0 0 400 320" preserveAspectRatio="none" aria-hidden="true">
                  <line x1="145" y1="55" x2="200" y2="160" stroke="rgba(232,163,61,.55)" />
                  <line x1="145" y1="265" x2="200" y2="160" stroke="rgba(79,209,197,.55)" />
                  <line x1="255" y1="55" x2="200" y2="160" stroke="rgba(127,176,255,.55)" />
                  <line x1="255" y1="265" x2="200" y2="160" stroke="rgba(234,242,246,.25)" />
                  <circle cx="200" cy="160" r="34" fill="rgba(232,163,61,.08)" stroke="rgba(232,163,61,.4)" />
                </svg>
                {VERTICALS.map((vertical, index) => {
                  const system = getSystem(vertical.system);
                  return (
                    <div
                      key={vertical.id}
                      className={"atlas-source atlas-source-" + (index + 1)}
                    >
                      <span className="atlas-source-erp">{vertical.name}</span>
                      <span className="atlas-source-plant">
                        {system?.shortName} · {vertical.companyCode}
                      </span>
                      <span className="atlas-source-metric">
                        {vertical.dataConfidence}% confidence
                      </span>
                    </div>
                  );
                })}
                <div className="atlas-core">
                  <span className="atlas-core-kicker">Enterprise command</span>
                  <span className="atlas-core-title">Meridian Energy Group</span>
                  <span className="atlas-core-meta">4 verticals · 2 SAP systems</span>
                </div>
              </div>
              <div className="atlas-map-foot">
                <span>Directors see the exceptions.</span>
                <span>81% data confidence · 8 open issues</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-5 py-12 sm:px-8 lg:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">The maintenance module</p>
            <h2 className="mt-2 max-w-[28ch] text-[clamp(1.8rem,3.4vw,2.6rem)] font-semibold tracking-[-0.03em]">
              Four plants. Four source systems. One operating language.
            </h2>
            <p className="mt-3 max-w-[64ch] text-[13px] leading-relaxed text-muted">
              The command centre is the maintenance workspace on top of the landscape.
              Each plant exercises a different source system; the same KPIs,
              drill-through and executive view run over all four.
            </p>
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
              className="group card p-5 transition-colors hover:bg-[var(--panel)]"
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
                <span className="flex shrink-0 flex-col items-end gap-1">
                  <span className="rounded-md bg-[rgba(234,242,246,0.08)] px-2 py-1 text-[10px] font-semibold text-muted">
                    {plant.plant.sourceErpShort}
                  </span>
                  <span
                    className={
                      adapterStatus[plant.plant.slug] === "Implemented"
                        ? "inline-flex items-center gap-1 text-[11px] font-semibold text-good"
                        : "inline-flex items-center gap-1 text-[11px] font-semibold text-warn"
                    }
                  >
                    <span
                      className={
                        adapterStatus[plant.plant.slug] === "Implemented"
                          ? "h-1 w-1 rounded-full bg-good"
                          : "h-1 w-1 rounded-full bg-warn"
                      }
                    />
                    {adapterStatus[plant.plant.slug]}
                  </span>
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
        <div className="mx-auto grid max-w-[1280px] gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:py-16">
          <div>
            <p className="eyebrow">What is shared</p>
            <h2 className="mt-2 max-w-[18ch] text-[clamp(1.8rem,3.4vw,2.6rem)] font-semibold tracking-[-0.03em]">
              The structure is the spine.
            </h2>
            <p className="mt-4 max-w-[52ch] text-[14px] leading-relaxed text-muted">
              Every company code, plant and business area is resolved before a work
              order is counted. Gearbox reads the SAP enterprise structure, then maps
              the maintenance entities into one canonical layer. The ERP stays the
              system of record.
            </p>
            <div className="mt-6 space-y-3 text-[13px]">
              {[
                ["Enterprise structure", "Company codes, plants, business areas, controlling areas, sales and purchasing organisations across S/4HANA and ECC R/3."],
                ["Canonical model", "Functional locations, equipment, notifications, orders, confirmations, meters and failure codes."],
                ["ERP adapters", "SAP S/4HANA OData is implemented; ECC RFC/BAPI, Oracle EAM REST and Maximo REST sit behind the same interface next."],
                ["Scope-based access", "Group, region, plant and work-centre roles; financial fields masked where the role requires it."],
                ["Operational dashboards", "SAP landscape, command centre, maintenance, reliability, permits, cost, quality and corporate views."],
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
                Source → structure → canonical → workspace
              </p>
            </div>
            <div className="space-y-4 p-5">
              <div className="grid gap-2 sm:grid-cols-4">
                {["SAP S/4", "SAP ECC", "Maximo", "Oracle EAM"].map((erp) => (
                  <div
                    key={erp}
                    className="rounded-md border border-line bg-[var(--panel)] px-3 py-3 text-center text-[11px] font-semibold"
                  >
                    {erp}
                  </div>
                ))}
              </div>
              <div className="text-center text-[11px] text-muted">
                OData · RFC/BAPI · REST · IDoc
              </div>
              <div className="rounded-md border border-[var(--warn)] bg-[var(--panel-strong)] px-4 py-4 text-center text-[12px] font-semibold text-ink">
                SAP enterprise structure
              </div>
              <div className="text-center text-[11px] text-muted">
                company · plant · business area
              </div>
              <div className="rounded-md border border-line bg-[var(--panel)] px-4 py-4 text-center text-[12px] font-semibold">
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

      <section className="border-t border-line bg-[var(--canvas)]">
        <div className="mx-auto max-w-[1280px] px-5 py-12 sm:px-8 lg:py-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Nirmana ERP</p>
              <h2 className="mt-2 max-w-[20ch] text-[clamp(1.8rem,3.4vw,2.6rem)] font-semibold tracking-[-0.03em]">
                One parent. Five sibling portfolios.
              </h2>
            </div>
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-info"
            >
              See the portfolio <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
            {PORTFOLIO.map((item) => {
              const body = (
                <>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted">
                    {item.status}
                  </p>
                  <h3 className="mt-1.5 text-[16px] font-semibold tracking-[-0.01em]">
                    {item.name}
                  </h3>
                  <p className="mt-1 text-[11px] leading-snug text-muted">{item.role}</p>
                </>
              );

              return item.external ? (
                <a
                  key={item.name}
                  href={item.href}
                  className="card p-4 transition-colors hover:bg-[var(--panel)]"
                >
                  {body}
                </a>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className="card p-4 transition-colors hover:bg-[var(--panel)]"
                >
                  {body}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="border-t border-line bg-surface">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-4 px-5 py-6 text-[11px] text-muted sm:px-8">
          <p>Gearbox · a Nirmana ERP product · synthetic data · no client records</p>
          <nav className="flex flex-wrap items-center gap-4" aria-label="Supporting pages">
            <Link href="/enterprise" className="hover:text-ink">
              Enterprise
            </Link>
            <Link href="/landscape" className="hover:text-ink">
              SAP landscape
            </Link>
            <Link href="/data-model" className="hover:text-ink">
              Data model
            </Link>
            <Link href="/erp-integration" className="hover:text-ink">
              ERP integration
            </Link>
            <Link href="/portfolio" className="hover:text-ink">
              Portfolio
            </Link>
            <Link href="/audit" className="hover:text-ink">
              ERP audit
            </Link>
            <Link href="/about" className="hover:text-ink">
              About
            </Link>
          </nav>
          <p>Four verticals · two SAP systems · one enterprise command</p>
        </div>
      </footer>
    </main>
  );
}
