import Link from "next/link";
import { SimpleHeader } from "@/components/simple-header";

export const metadata = {
  title: "About Gearbox · nirmNa",
  description:
    "What the Gearbox enterprise command, SAP landscape and four-plant maintenance demo implement, what is synthetic, and how Gearbox fits Nirmana ERP.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-canvas">
      <SimpleHeader />

      <div className="mx-auto max-w-[900px] px-5 py-10 sm:px-8 lg:py-14">
        <p className="eyebrow">About the demo</p>
        <h1 className="mt-2 max-w-[20ch] text-[clamp(2rem,4vw,3rem)] font-semibold tracking-[-0.035em]">
          A working picture of the wrapper, not a slide.
        </h1>
        <p className="measure mt-4 text-[14px] leading-relaxed text-muted">
          Gearbox is the SAP enterprise dashboard for Meridian Energy inside Nirmana
          ERP. It gives directors a top-down view across Generation, Grid, Services
          and Retail, then exposes the inconsistent records that sit behind the
          numbers. The SAP landscape and maintenance workspaces show the structure
          and execution layers underneath. Every plant uses the same canonical model;
          only the source adapter changes.
        </p>

        <section className="mt-10 space-y-4">
          {[
            {
              title: "Synthetic data",
              body: "All company codes, verticals, plants, business areas, employees, exception counts, assets, work orders, permits, costs and KPIs on this site are synthetic. They are generated deterministically for demonstration and do not represent any client, plant or contract. The site is a static export; no ERP or connector is called while you browse it.",
            },
            {
              title: "No client branding",
              body: "No client logos, names, records or screenshots are used. Gearbox is the SAP enterprise dashboard for Meridian Energy. Nirmana ERP's sibling portfolios — Promonitor, Yamuna, Xirra, LedgeFlow, CoreSight and Pramaan — are separate business domains and are linked only for navigation. Pramaan's audit pack currently runs inside Gearbox.",
            },
            {
              title: "What is implemented",
              body: "The enterprise command dashboard with a closed-loop exception register; the SAP landscape dashboard with separate S/4HANA and ECC R/3 configurations; the executive, maintenance, reliability, permit, cost and RCA/quality workspaces; the canonical data-model page; the ERP integration page; the Pramaan SAP PM audit pack; responsive layouts and reduced-motion support.",
            },
            {
              title: "What is not claimed",
              body: "This demo is not SAP-certified. Real SAP validation requires a sandbox, a communication arrangement, the released API list and OAuth2 credentials. The enterprise command, landscape configuration and exception register are synthetic demonstrations, not copies of a client system. The four ERP adapters other than SAP S/4HANA are planned, not production-validated.",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border border-line bg-surface px-5 py-5">
              <h2 className="text-[15px] font-semibold">{item.title}</h2>
              <p className="mt-2 text-[13px] leading-relaxed text-muted">{item.body}</p>
            </div>
          ))}
        </section>

        <section className="mt-10">
          <h2 className="text-[20px] font-semibold tracking-[-0.02em]">What comes next</h2>
          <ul className="mt-4 space-y-2 text-[13px] text-muted">
            <li className="border-t border-line pt-3">Wire the demo to the standalone connector package and a public simulator.</li>
            <li className="border-t border-line pt-3">Validate the SAP adapter against a client sandbox.</li>
            <li className="border-t border-line pt-3">Connect the exception register to a real workflow: owner assignment, evidence and certification.</li>
            <li className="border-t border-line pt-3">Add role-based cascades for portfolio, company and plant HR.</li>
            <li className="border-t border-line pt-3">Add profit-centre and segment reporting to the SAP landscape view.</li>
            <li className="border-t border-line pt-3">Add videos, a guided tour and a compare-plants mode.</li>
            <li className="border-t border-line pt-3">Publish the data-model and integration pages as a reusable sales asset.</li>
            <li className="border-t border-line pt-3">Add the Pramaan finance and HR audit packs to the same evidence model.</li>
          </ul>
        </section>

        <div className="mt-10 rounded-xl border border-line bg-[var(--panel-strong)] px-5 py-6 text-white">
          <p className="text-[15px] font-semibold">Want the walkthrough?</p>
          <p className="mt-2 max-w-[58ch] text-[13px] leading-relaxed text-white/65">
            Start with the enterprise command, then open the SAP landscape and the
            coal station command centre to see the structure and execution layers
            underneath.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/enterprise"
              className="rounded-md bg-[var(--warn)] px-4 py-2.5 text-[12px] font-semibold text-[var(--graphite)]"
            >
              Open enterprise command
            </Link>
            <Link
              href="/landscape"
              className="rounded-md border border-white/20 px-4 py-2.5 text-[12px] font-semibold text-white/85"
            >
              Open SAP landscape
            </Link>
            <Link
              href="/demo/coal"
              className="rounded-md border border-white/20 px-4 py-2.5 text-[12px] font-semibold text-white/85"
            >
              Open the maintenance demo
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
