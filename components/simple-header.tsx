import Link from "next/link";

export function SimpleHeader() {
  return (
    <header className="border-b border-line bg-surface">
      <div className="mx-auto flex max-w-[1080px] flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <Link href="/" className="text-[15px] font-semibold tracking-[-0.01em]">
          Nirmana
        </Link>
        <nav className="flex flex-wrap items-center gap-5 text-[12px] text-muted">
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
