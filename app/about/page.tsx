import Link from "next/link";
import { SimpleHeader } from "@/components/simple-header";

export const metadata = {
  title: "About the demo · Nirmana",
  description:
    "What the four-plant CMMS demo implements, what is synthetic, and what is not claimed.",
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
          This site shows how one maintenance intelligence layer can sit over SAP,
          Oracle and Maximo without replacing the system of record. Every plant uses
          the same canonical model and the same workspace; only the source adapter
          changes.
        </p>

        <section className="mt-10 space-y-4">
          {[
            {
              title: "Synthetic data",
              body: "All plant names, assets, work orders, permits, costs and KPIs on this site are synthetic. They are generated deterministically for demonstration and do not represent any client, plant or contract. The site is a static export; no ERP or connector is called while you browse it.",
            },
            {
              title: "No client branding",
              body: "No client logos, names, records or screenshots are used. The product and demo use neutral branding while the commercial name is still being decided.",
            },
            {
              title: "What is implemented",
              body: "The executive, maintenance, reliability, permit, cost and RCA/quality workspaces; the canonical data-model page; the ERP integration page; responsive layouts and reduced-motion support.",
            },
            {
              title: "What is not claimed",
              body: "This demo is not SAP-certified. Real SAP validation requires a sandbox, a communication arrangement, the released API list and OAuth2 credentials. The four ERP adapters other than SAP S/4HANA are planned, not production-validated.",
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
            <li className="border-t border-line pt-3">Add videos, a guided tour and a compare-plants mode.</li>
            <li className="border-t border-line pt-3">Publish the data-model and integration pages as a reusable sales asset.</li>
          </ul>
        </section>

        <div className="mt-10 rounded-xl bg-[var(--graphite)] px-5 py-6 text-white">
          <p className="text-[15px] font-semibold">Want the walkthrough?</p>
          <p className="mt-2 max-w-[58ch] text-[13px] leading-relaxed text-white/65">
            Open the coal station command centre and follow the same six workspaces
            across the other three plants.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/demo/coal"
              className="rounded-md bg-white px-4 py-2.5 text-[12px] font-semibold text-ink"
            >
              Open the demo
            </Link>
            <Link
              href="/erp-integration"
              className="rounded-md border border-white/20 px-4 py-2.5 text-[12px] font-semibold text-white/85"
            >
              How integration works
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
