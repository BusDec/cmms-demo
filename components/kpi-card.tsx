import { Kpi } from "@/lib/data";
import { cn, formatCurrency, formatNumber, toneClass, toneDot } from "@/lib/utils";

export function KpiCard({ kpi }: { kpi: Kpi }) {
  const value =
    kpi.unit === "SAR"
      ? formatCurrency(kpi.value, true)
      : kpi.unit === "%"
        ? `${formatNumber(kpi.value, 1)}%`
        : formatNumber(kpi.value, 0);

  return (
    <article className="card px-4 py-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
          {kpi.label}
        </p>
        <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", toneDot(kpi.tone))} />
      </div>
      <p className="stat-value mt-2 text-[30px] font-semibold text-ink">
        {value}
        {kpi.unit && kpi.unit !== "SAR" && kpi.unit !== "%" ? (
          <span className="ml-1 text-[13px] font-medium text-muted">{kpi.unit}</span>
        ) : null}
      </p>
      <p className={cn("mt-2 text-[11px] font-semibold tabular", toneClass(kpi.tone))}>
        {kpi.delta}
      </p>
      <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-muted">
        {kpi.hint}
      </p>
    </article>
  );
}
