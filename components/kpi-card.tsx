import { Kpi } from "@/lib/data";
import { cn, formatCurrency, formatNumber, toneBorder, toneClass } from "@/lib/utils";

export function KpiCard({ kpi }: { kpi: Kpi }) {
  const value =
    kpi.unit === "SAR"
      ? formatCurrency(kpi.value, true)
      : kpi.unit === "%"
        ? `${formatNumber(kpi.value, 1)}%`
        : formatNumber(kpi.value, 0);

  return (
    <article
      className={cn(
        "card border-t-[3px] px-4 py-4",
        toneBorder(kpi.tone),
      )}
      title={kpi.hint}
    >
      <p className="text-[12px] font-semibold text-muted">{kpi.label}</p>
      <p className="stat-value mt-2 text-[30px] font-semibold text-ink">
        {value}
        {kpi.unit && kpi.unit !== "SAR" && kpi.unit !== "%" ? (
          <span className="ml-1 text-[13px] font-medium text-muted">{kpi.unit}</span>
        ) : null}
      </p>
      <div className="mt-3 flex items-center justify-between gap-2 text-[11px]">
        <span className={cn("font-semibold tabular", toneClass(kpi.tone))}>
          {kpi.delta}
        </span>
        <span className="text-muted" title={kpi.hint}>
          definition
        </span>
      </div>
    </article>
  );
}
