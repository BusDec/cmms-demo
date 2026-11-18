import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/badge";
import { SimpleHeader } from "@/components/simple-header";
import { PARENT, PORTFOLIO_MEMBERS } from "@/lib/portfolio";

export const metadata = {
  title: "Portfolio · Nirmana ERP",
  description:
    "The Nirmana ERP portfolio: Promonitor, LedgeFlow, Xirra, CoreSight, Yamuna, Benchmark, Gearbox, Pramaan and Kavach. The parent is a next-generation industrial ERP powered by Gen AI and agentic AI, with reliability and Weibull analysis at its core.",
};

export default function PortfolioPage() {
  return (
    <main className="min-h-screen bg-canvas">
      <SimpleHeader product="Portfolio" />

      <div className="mx-auto max-w-[1180px] px-5 pb-16 pt-10 sm:px-8 lg:pt-14">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <p className="eyebrow">Nirmana ERP portfolio</p>
            <h1 className="mt-2 max-w-[18ch] text-[clamp(2.2rem,5vw,4rem)] font-semibold leading-[0.98] tracking-[-0.045em]">
              One parent. Nine portfolios.
            </h1>
            <p className="measure mt-4 text-[14px] leading-relaxed text-muted">
              Nirmana ERP is the parent. Eight sibling portfolios and Gearbox, the
              integrated dashboard layer, make nine. Each runs on its own subdomain;
              this is the common portfolio page for the group. Gearbox commands
              Meridian Energy&rsquo;s enterprise; Benchmark measures operating
              efficiency; Kavach covers cybersecurity; Pramaan covers SAP audit and
              implementation.
            </p>
          </div>
          <div className="rounded-xl border border-line bg-[var(--panel-strong)] p-5 text-white">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/55">
              Parent
            </p>
            <p className="mt-2 text-[26px] font-semibold tracking-[-0.03em]">
              {PARENT.wordmark}
            </p>
            <p className="mt-1 text-[12px] text-white/65">
              {PARENT.name} · {PARENT.tagline}
            </p>
            <a
              href={PARENT.url}
              className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-semibold text-[var(--warn)] hover:text-[#f0b95f]"
            >
              nirmanaerp.com <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        <section className="mt-10">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 className="text-[20px] font-semibold tracking-[-0.02em]">
              Portfolio members
            </h2>
            <p className="text-[11px] text-muted">Nine portfolios · one parent · one common page</p>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {PORTFOLIO_MEMBERS.map((item) => {
              const content = (
                <>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-semibold text-muted">{item.role}</p>
                      <h3 className="mt-1 text-[22px] font-semibold tracking-[-0.02em]">
                        {item.name}
                      </h3>
                    </div>
                    <Badge
                      tone={
                        item.status === "Live"
                          ? "good"
                          : item.status === "Audit live"
                            ? "info"
                            : "neutral"
                      }
                    >
                      {item.status}
                    </Badge>
                  </div>
                  <p className="mt-3 max-w-[54ch] text-[13px] leading-relaxed text-muted">
                    {item.description}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-[12px] font-semibold text-info">
                    {item.domain} <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </>
              );

              return (
                <a
                  key={item.name}
                  href={item.href}
                  className="card p-5 transition-colors hover:bg-[var(--panel)]"
                >
                  {content}
                </a>
              );
            })}
          </div>
        </section>

        <section className="mt-10 overflow-hidden rounded-xl border border-line bg-[var(--panel-strong)] text-white">
          <div className="grid gap-7 px-5 py-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-6 lg:py-7">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/55">
                Nirmana ERP · the parent
              </p>
              <h2 className="mt-2 max-w-[20ch] text-[clamp(1.6rem,2.8vw,2.2rem)] font-semibold tracking-[-0.03em]">
                The next-generation ERP for industrial enterprises.
              </h2>
              <p className="mt-3 max-w-[62ch] text-[12px] leading-relaxed text-white/65">
                Nirmana ERP is the parent platform behind every portfolio on this
                page. It combines Gen AI and agentic AI across the operating model
                with reliability engineering at the core: Weibull life analysis,
                failure modes, asset health and maintenance strategy.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {["Gen AI", "Agentic AI", "Reliability engineering", "Weibull analysis", "Asset performance"].map((capability) => (
                  <span
                    key={capability}
                    className="rounded-md border border-white/15 px-2.5 py-1 text-[10px] font-semibold text-white/75"
                  >
                    {capability}
                  </span>
                ))}
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <a
                  href={PARENT.url}
                  className="inline-flex items-center gap-2 rounded-md bg-[var(--warn)] px-4 py-2.5 text-[12px] font-semibold text-[var(--graphite)]"
                >
                  Explore Nirmana ERP <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
                <a
                  href="mailto:pilot@nirmanaerp.com"
                  className="inline-flex items-center gap-1.5 rounded-md border border-white/20 px-4 py-2.5 text-[12px] font-semibold text-white/85"
                >
                  Talk to the parent team
                </a>
              </div>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
              {[
                ["Reliability-first", "Weibull life analysis, failure modes, asset health and maintenance strategy in the operating picture."],
                ["Gen AI + agentic AI", "Assistants and agents that work from the ERP's records, not a separate copy of the business."],
                ["One group view", "Nine portfolios, one parent, and a common portfolio page shared across the family."],
              ].map(([title, body]) => (
                <div key={title} className="rounded-lg border border-white/12 bg-white/[0.03] px-4 py-3">
                  <p className="text-[12px] font-semibold">{title}</p>
                  <p className="mt-1 text-[10px] leading-relaxed text-white/55">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
