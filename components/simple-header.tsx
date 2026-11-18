import Link from "next/link";

export function SimpleHeader({
  product = "Gearbox",
}: {
  product?: "Gearbox" | "Portfolio";
}) {
  const home = product === "Portfolio" ? "/portfolio" : "/";

  return (
    <header className="border-b border-line bg-surface">
      <div className="mx-auto flex max-w-[1080px] flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <Link
          href={home}
          className="flex items-center gap-2.5 text-[15px] font-semibold tracking-[-0.01em]"
        >
          <span className="h-2 w-2 bg-[var(--warn)]" />
          <span className="flex flex-col leading-none">
            <span className="text-[10px] font-semibold tracking-[0.08em] text-muted">
              Nirmana
            </span>
            <span className="mt-1">{product}</span>
          </span>
        </Link>
        <nav className="flex flex-wrap items-center gap-5 text-[12px] text-muted">
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
          <Link href="/about" className="hover:text-ink">
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}
