import { Kpi } from "@/lib/data";
import { cn, formatCurrency, formatNumber, toneClass, toneDot } from "@/lib/utils";

const toneLabel: Record<string, string> = {
  good: "On target",
  warn: "Watch",
  bad: "Below target",
  info: "Information",
  neutral: "No status",
};

export function KpiCard({ kpi }: { kpi: Kpi }) {
  const value =
    kpi.unit === "SAR"
      ? formatCurrency(kpi.value, true)
      : kpi.unit === "%"
        ? `${formatNumber(kpi.value, kpi.id === "cost" ? 2 : 1)}%`
        : formatNumber(kpi.value, 0);

  return (
    <article className="card flex h-full flex-col px-3 py-3 sm:px-4 sm:py-4">
      <div className="flex items-start justify-between gap-2">
        <p className="line-clamp-2 h-[2.5em] text-[10px] font-semibold uppercase leading-[1.2] tracking-[0.08em] text-muted sm:text-[11px]">
          {kpi.label}
        </p>
        <span
          title={toneLabel[kpi.tone] ?? "Status"}
          aria-label={toneLabel[kpi.tone] ?? "Status"}
          className={cn(
            "mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full",
            toneDot(kpi.tone),
          )}
        />
      </div>
      <p className="stat-value mt-1.5 text-[24px] font-semibold text-ink sm:mt-2 sm:text-[30px]">
        {value}
        {kpi.unit && kpi.unit !== "SAR" && kpi.unit !== "%" ? (
          <span className="ml-1 text-[12px] font-medium text-muted sm:text-[13px]">
            {kpi.unit}
          </span>
        ) : null}
      </p>
      <p
        className={cn(
          "mt-1.5 text-[10px] font-semibold tabular sm:text-[11px]",
          toneClass(kpi.tone),
        )}
      >
        {kpi.delta}
      </p>
      <p className="mt-auto hidden pt-1 text-[11px] leading-snug text-muted sm:block">
        {kpi.hint}
      </p>
    </article>
  );
}

export function StatCard({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "good" | "warn" | "bad" | "info" | "neutral";
}) {
  return (
    <article className="card flex h-full flex-col px-3 py-3 sm:px-4 sm:py-4">
      <div className="flex items-start justify-between gap-2">
        <p className="line-clamp-2 h-[2.5em] text-[10px] font-semibold uppercase leading-[1.2] tracking-[0.08em] text-muted sm:text-[11px]">
          {label}
        </p>
        {tone ? (
          <span
            title={toneLabel[tone]}
            aria-label={toneLabel[tone]}
            className={cn("mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full", toneDot(tone))}
          />
        ) : null}
      </div>
      <p className="stat-value mt-1.5 text-[24px] font-semibold text-ink sm:mt-2 sm:text-[30px]">
        {value}
      </p>
      {hint ? (
        <p className="mt-auto hidden pt-1 text-[11px] leading-snug text-muted sm:block">
          {hint}
        </p>
      ) : null}
    </article>
  );
}
