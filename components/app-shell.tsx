"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Activity,
  ArrowLeft,
  ClipboardCheck,
  Database,
  Gauge,
  Plug,
  ShieldCheck,
  Wallet,
  Wrench,
} from "lucide-react";
import { Plant, plants } from "@/lib/plants";
import { cn } from "@/lib/utils";
import { Badge } from "./badge";

const nav = [
  { key: "", label: "Overview", icon: Gauge },
  { key: "maintenance", label: "Maintenance", icon: Wrench },
  { key: "reliability", label: "Reliability", icon: Activity },
  { key: "ptw", label: "Permits & safety", icon: ShieldCheck },
  { key: "cost", label: "Cost & resources", icon: Wallet },
  { key: "rca-qa", label: "RCA & quality", icon: ClipboardCheck },
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
      <aside className="hidden w-[248px] shrink-0 border-r border-line bg-[var(--graphite)] text-white lg:flex lg:flex-col">
        <Link
          href="/"
          className="flex items-center gap-2 px-5 py-5 text-[13px] font-semibold tracking-[-0.01em] text-white/80 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to showcase
        </Link>

        <div className="px-5 pb-4">
          <p className="text-[10px] font-semibold text-white/60">
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
                <option key={option.slug} value={option.slug} className="text-ink">
                  {option.shortName}
                </option>
              ))}
            </select>
          </label>
          <p className="mt-2 text-[11px] text-white/60">{plant.sourceErp}</p>
        </div>

        <nav className="flex-1 space-y-0.5 px-2" aria-label="Workspace">
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
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-[13px] font-medium transition-colors",
                  active
                    ? "bg-white/10 text-white"
                    : "text-white/60 hover:bg-white/5 hover:text-white",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-0.5 border-t border-white/10 px-2 py-4">
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
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-surface px-4 py-3 lg:px-6">
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
              <p className="text-[11px] font-semibold text-muted">
                {plant.location}
              </p>
              <h1 className="text-[16px] font-semibold tracking-[-0.01em]">
                {plant.name}
              </h1>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="info">{plant.sourceErpShort}</Badge>
            <Badge tone="neutral">Synthetic data</Badge>
            <span className="hidden text-[11px] text-muted sm:inline">
              Generated 12 Nov 2026, 16:40
            </span>
          </div>
        </header>

        <nav
          className="no-scrollbar flex gap-1 overflow-x-auto border-b border-line bg-surface px-3 py-2 lg:hidden"
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
                  "flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-2 text-[12px] font-semibold",
                  active ? "bg-ink text-white" : "text-muted hover:bg-[#f1f5f9]",
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/"
            className="flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-2 text-[12px] font-semibold text-muted hover:bg-[#f1f5f9]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Showcase
          </Link>
        </nav>

        <div className="px-4 py-5 lg:px-6 lg:py-6">{children}</div>
      </div>
    </div>
  );
}
