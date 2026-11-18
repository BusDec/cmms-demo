import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/badge";
import { SimpleHeader } from "@/components/simple-header";
import { PARENT, PORTFOLIO, PORTFOLIO_STORY } from "@/lib/portfolio";

export const metadata = {
  title: "Portfolio · nirmNa",
  description:
    "The Nirmana portfolio: Gearbox SAP landscape and maintenance intelligence, Pramaan ERP audit and implementation, Promonitor and Yamuna.",
};

const statusTone = {
  Live: "good",
  "Audit pack live": "good",
  Practice: "info",
  Portfolio: "neutral",
} as const;

export default function PortfolioPage() {
  return (
    <main className="min-h-screen bg-canvas">
      <SimpleHeader product="Portfolio" />

      <div className="mx-auto max-w-[1180px] px-5 pb-16 pt-10 sm:px-8 lg:pt-14">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <p className="eyebrow">Nirmana portfolio</p>
            <h1 className="mt-2 max-w-[18ch] text-[clamp(2.2rem,5vw,4rem)] font-semibold leading-[0.98] tracking-[-0.045em]">
              One parent. Four specialist practices.
            </h1>
            <p className="measure mt-4 text-[14px] leading-relaxed text-muted">
              Nirmana builds the intelligence layer between the plant and the enterprise.
              Gearbox shows the enterprise structure and the operating picture. Pramaan
              audits and implements the ERP behind it. Promonitor and Yamuna carry the
              work into monitoring and data.
            </p>
          </div>
          <div className="rounded-xl border border-line bg-[var(--panel-strong)] p-5 text-white">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/55">
              Parent portfolio
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
            <h2 className="text-[20px] font-semibold tracking-[-0.02em]">The portfolio</h2>
            <p className="text-[11px] text-muted">Four names · one operating model</p>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
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
                    <Badge tone={statusTone[item.status]}>{item.status}</Badge>
                  </div>
                  <p className="mt-3 max-w-[54ch] text-[13px] leading-relaxed text-muted">
                    {item.description}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-[12px] font-semibold text-info">
                    {item.external ? "Visit nirmanaerp.com" : "Open"}
                    {item.external ? (
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    ) : (
                      <ArrowRight className="h-3.5 w-3.5" />
                    )}
                  </span>
                </>
              );

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

        <section className="mt-12 border-t border-line pt-8">
          <p className="eyebrow">How they fit</p>
          <h2 className="mt-2 max-w-[20ch] text-[clamp(1.8rem,3.4vw,2.6rem)] font-semibold tracking-[-0.03em]">
            Assure, implement, operate.
          </h2>
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {PORTFOLIO_STORY.map((item) => (
              <div key={item.step} className="card p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-warn">
                  {item.step}
                </p>
                <h3 className="mt-2 text-[18px] font-semibold tracking-[-0.02em]">
                  {item.title}
                </h3>
                <p className="mt-2 text-[12px] leading-relaxed text-muted">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-line bg-[var(--panel-strong)] px-5 py-5 text-white">
          <div>
            <p className="text-[15px] font-semibold">Start with the audit or the demo.</p>
            <p className="mt-1 max-w-[58ch] text-[12px] leading-relaxed text-white/65">
              Pramaan shows what is broken and what it costs, then implements the
              finance and HR core. Gearbox shows the operating picture when the data is clean.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/audit"
              className="rounded-md bg-[var(--warn)] px-4 py-2.5 text-[12px] font-semibold text-[var(--graphite)]"
            >
              Open Pramaan audit
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-md border border-white/20 px-4 py-2.5 text-[12px] font-semibold text-white/85"
            >
              Open Gearbox <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
