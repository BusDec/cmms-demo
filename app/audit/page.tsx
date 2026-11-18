import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Pramaan · SAP audit and implementation",
  description:
    "Pramaan is a separate Nirmana ERP portfolio at pramaan.nirmanaerp.com. This URL hands over to the SAP audit and implementation site.",
  alternates: { canonical: "https://pramaan.nirmanaerp.com/audit/" },
  robots: { index: false, follow: true },
};

export default function AuditPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-canvas px-5 py-16">
      <meta
        httpEquiv="refresh"
        content="2; url=https://pramaan.nirmanaerp.com/audit/"
      />
      <div className="w-full max-w-[560px]">
        <div className="flex items-center gap-2.5">
          <span className="h-2 w-2 bg-[var(--warn)]" />
          <span className="flex flex-col leading-none">
            <span className="text-[10px] font-semibold tracking-[0.08em] text-muted">
              Nirmana
            </span>
            <span className="mt-1 text-[15px] font-semibold">Pramaan</span>
          </span>
        </div>

        <h1 className="mt-8 max-w-[14ch] text-[clamp(2.2rem,6vw,3.6rem)] font-semibold leading-[0.98] tracking-[-0.045em]">
          Pramaan has moved.
        </h1>
        <p className="mt-4 max-w-[52ch] text-[14px] leading-relaxed text-muted">
          The SAP audit and implementation portfolio now lives on its own
          subdomain. This Gearbox URL hands over to Pramaan; the audit pack is no
          longer duplicated here.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href="https://pramaan.nirmanaerp.com/audit/"
            className="inline-flex items-center gap-2 rounded-md bg-[var(--warn)] px-4 py-2.5 text-[13px] font-semibold text-[var(--graphite)]"
          >
            Open the audit pack <ArrowUpRight className="h-4 w-4" />
          </a>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-md border border-line bg-surface px-4 py-2.5 text-[13px] font-semibold"
          >
            Back to Gearbox <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <p className="mt-5 text-[11px] text-muted">
          If you are not redirected, use the link above.
        </p>
      </div>
    </main>
  );
}
