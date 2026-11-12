"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Activity,
  ArrowLeft,
  ClipboardCheck,
  Database,
  Gauge,
  Info,
  Plug,
  ShieldCheck,
  Wallet,
  Wrench,
} from "lucide-react";
import { Plant, plants } from "@/lib/plants";
import { cn } from "@/lib/utils";
import { Badge } from "./badge";

const nav = [
  { key: "", label: "Overview", shortLabel: "Overview", icon: Gauge },
  { key: "maintenance", label: "Maintenance", shortLabel: "Maintenance", icon: Wrench },
  { key: "reliability", label: "Reliability", shortLabel: "Reliability", icon: Activity },
  { key: "ptw", label: "Permits & safety", shortLabel: "Permits", icon: ShieldCheck },
  { key: "cost", label: "Cost & resources", shortLabel: "Cost", icon: Wallet },
  { key: "rca-qa", label: "RCA & quality", shortLabel: "RCA", icon: ClipboardCheck },
];

export function AppShell({
  plant,
  children,
}: {
  plant: Plant;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  function switchPlant(slug: string) {
    if (pathname.startsWith("/demo/")) {
      const parts = pathname.split("/");
      parts[2] = slug;
      router.push(parts.join("/"));
    } else {
      router.push(`/demo/${slug}`);
    }
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-canvas lg:flex">
      <aside className="hidden w-[248px] shrink-0 border-r border-line bg-[var(--panel-strong)] text-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:overflow-y-auto">
        <Link
          href="/"
          className="flex items-center gap-2 px-5 pt-5 text-[15px] font-semibold tracking-[-0.01em] text-white"
        >
          <span className="h-2 w-2 bg-[var(--warn)]" />
          Gearbox
        </Link>
        <Link
          href="/"
          className="flex items-center gap-2 px-5 pb-4 pt-3 text-[12px] text-white/55 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to showcase
        </Link>

        <div className="px-5 pb-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-white/60">
            Active plant
          </p>
          <label className="mt-2 block">
            <span className="sr-only">Switch plant</span>
            <select
              value={plant.slug}
              onChange={(event) => switchPlant(event.target.value)}
              className="w-full rounded-md border border-white/15 bg-white/5 px-3 py-2 text-[13px] font-medium text-white outline-none"
            >
              {plants.map((option) => (
                <option key={option.slug} value={option.slug} className="text-[#0f172a]">
                  {option.shortName}
                </option>
              ))}
            </select>
          </label>
          <p className="mt-2 text-[11px] text-white/60">{plant.sourceErp}</p>
        </div>

        <nav className="space-y-0.5 px-2" aria-label="Workspace">
          {nav.map((item) => {
            const href = `/demo/${plant.slug}${item.key ? `/${item.key}` : ""}`;
            const active =
              item.key === ""
                ? pathname === `/demo/${plant.slug}` || pathname === `/demo/${plant.slug}/`
                : pathname.startsWith(href);
            const Icon = item.icon;
            return (
              <Link
                key={item.key}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-[13px] font-medium transition-colors",
                  active
                    ? "bg-[rgba(232,163,61,0.12)] text-white shadow-[inset_2px_0_0_0_var(--warn)]"
                    : "text-white/55 hover:bg-white/5 hover:text-white",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-white/10 px-3 py-3 text-[11px] text-white/65">
          <span
            className="inline-flex items-center gap-1.5"
            title="Synthetic data. No ERP or connector is called while you browse."
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--muted)]" />
            Demo dataset · no live ERP
          </span>
        </div>
        <div className="space-y-0.5 border-t border-white/10 px-2 py-4">
          <Link
            href="/data-model"
            className="flex items-center gap-3 rounded-md px-3 py-2.5 text-[13px] font-medium text-white/60 hover:bg-white/5 hover:text-white"
          >
            <Database className="h-4 w-4" />
            Data model
          </Link>
          <Link
            href="/erp-integration"
            className="flex items-center gap-3 rounded-md px-3 py-2.5 text-[13px] font-medium text-white/60 hover:bg-white/5 hover:text-white"
          >
            <Plug className="h-4 w-4" />
            ERP integration
          </Link>
          <Link
            href="/about"
            className="flex items-center gap-3 rounded-md px-3 py-2.5 text-[13px] font-medium text-white/60 hover:bg-white/5 hover:text-white"
          >
            <Info className="h-4 w-4" />
            About the demo
          </Link>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <div className="sticky top-0 z-30 bg-canvas/95 backdrop-blur lg:static lg:bg-transparent lg:backdrop-blur-none">
          <header className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-surface px-4 py-2.5 lg:px-6 lg:py-3">
            <div className="flex items-center gap-3">
              <div className="lg:hidden">
                <label className="block">
                  <span className="sr-only">Plant</span>
                  <select
                    value={plant.slug}
                    onChange={(event) => switchPlant(event.target.value)}
                    className="rounded-md border border-line bg-surface px-2 py-1.5 text-[12px] font-semibold"
                  >
                    {plants.map((option) => (
                      <option key={option.slug} value={option.slug}>
                        {option.shortName}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div>
                <p className="hidden text-[11px] font-semibold text-muted sm:block">
                  {plant.location}
                </p>
                <h1 className="text-[14px] font-semibold tracking-[-0.01em] sm:text-[16px]">
                  {plant.name}
                </h1>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge tone={plant.slug === "coal" ? "good" : "warn"}>
                {plant.sourceErpShort} ·{" "}
                {plant.slug === "coal" ? "implemented" : "planned"}
              </Badge>
              <Badge tone="neutral">Synthetic data</Badge>
              <span className="hidden text-[11px] text-muted md:inline">
                Dataset: 12 Nov 2026
              </span>
            </div>
          </header>

          <nav
            className="flex flex-wrap gap-1 border-b border-line bg-surface px-3 py-2 lg:hidden"
            aria-label="Workspace"
          >
            {nav.map((item) => {
              const href = `/demo/${plant.slug}${item.key ? `/${item.key}` : ""}`;
              const active =
                item.key === ""
                  ? pathname === `/demo/${plant.slug}` || pathname === `/demo/${plant.slug}/`
                  : pathname.startsWith(href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.key}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-2 py-2 text-[11px] font-semibold sm:text-[12px]",
                    active
                      ? "bg-[var(--warn)] text-[var(--graphite)]"
                      : "text-muted hover:bg-white/5",
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span className="sm:hidden">{item.shortLabel}</span>
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}
            <Link
              href="/"
              className="flex items-center gap-1.5 rounded-md px-2 py-2 text-[11px] font-semibold text-muted hover:bg-white/5 sm:text-[12px]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Showcase
            </Link>
          </nav>
        </div>

        <div className="px-4 py-4 lg:px-6 lg:py-5">{children}</div>
      </div>
    </div>
  );
}
