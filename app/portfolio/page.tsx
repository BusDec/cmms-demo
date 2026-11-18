import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/badge";
import { SimpleHeader } from "@/components/simple-header";
import { PARENT, PORTFOLIO } from "@/lib/portfolio";

export const metadata = {
  title: "Portfolio · Nirmana ERP",
  description:
    "Nirmana ERP and its sibling portfolios: Promonitor, Yamuna, Xirra, LedgeFlow, CoreSight, Kavach and Pramaan. Gearbox is the integrated dashboard portfolio for Meridian Energy.",
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
              One parent. Seven sibling portfolios.
            </h1>
            <p className="measure mt-4 text-[14px] leading-relaxed text-muted">
              Nirmana ERP is the parent. Promonitor, Yamuna, Xirra, LedgeFlow,
              CoreSight, Kavach and Pramaan are separate business portfolios. Pramaan
              currently runs its audit pack as a preview inside Gearbox; its subdomain
              is planned. Kavach is the cybersecurity portfolio. Gearbox — the
              integrated dashboard portfolio for Meridian Energy — is not one of
              these portfolios.
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
              Sibling portfolios
            </h2>
            <p className="text-[11px] text-muted">Seven portfolios · one parent</p>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {PORTFOLIO.map((item) => {
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
                  {item.planned ? (
                    <span className="mt-4 inline-flex items-center gap-1 text-[12px] font-medium text-muted">
                      {item.domain} · planned
                    </span>
                  ) : item.external ? (
                    <span className="mt-4 inline-flex items-center gap-1 text-[12px] font-semibold text-info">
                      {item.domain} <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                  ) : (
                    <>
                      <span className="mt-4 inline-flex items-center gap-1 text-[12px] font-semibold text-info">
                        Open audit pack <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                      <span className="mt-1 block text-[10px] text-muted">
                        Subdomain planned: {item.domain}
                      </span>
                    </>
                  )}
                </>
              );

              if (item.planned) {
                return (
                  <div key={item.name} className="card p-5">
                    {content}
                  </div>
                );
              }

              return item.external ? (
                <a
                  key={item.name}
                  href={item.href}
                  className="card p-5 transition-colors hover:bg-[var(--panel)]"
                >
                  {content}
                </a>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className="card p-5 transition-colors hover:bg-[var(--panel)]"
                >
                  {content}
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mt-10 rounded-xl border border-line bg-[var(--panel-strong)] px-5 py-5 text-white">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/55">
                SAP enterprise dashboard
              </p>
              <h2 className="mt-1 text-[20px] font-semibold tracking-[-0.02em]">
                Gearbox is separate from the sibling portfolios.
              </h2>
              <p className="mt-2 max-w-[64ch] text-[12px] leading-relaxed text-white/65">
                Gearbox is the command layer for Meridian Energy: enterprise structure,
                data confidence and maintenance across Generation, Grid, Services and
                Retail. The sibling portfolios above serve other business domains and
                other users; Pramaan currently runs its audit pack as a preview inside
                Gearbox, and Kavach is planned.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/enterprise"
                className="rounded-md bg-[var(--warn)] px-4 py-2.5 text-[12px] font-semibold text-[var(--graphite)]"
              >
                Open enterprise command
              </Link>
              <Link
                href="/landscape"
                className="inline-flex items-center gap-1.5 rounded-md border border-white/20 px-4 py-2.5 text-[12px] font-semibold text-white/85"
              >
                SAP landscape <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
