import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-canvas px-5">
      <div className="w-full max-w-[520px]">
        <p className="eyebrow">Page not found</p>
        <h1 className="mt-2 text-[32px] font-semibold tracking-[-0.03em]">
          That route is not part of the demo.
        </h1>
        <p className="mt-3 text-[14px] leading-relaxed text-muted">
          The four plant workspaces, the data model and the ERP integration pages are
          linked from the showcase.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/"
            className="rounded-md bg-[var(--warn)] px-4 py-2.5 text-[13px] font-semibold text-[var(--graphite)]"
          >
            Back to showcase
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
