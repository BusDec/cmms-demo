"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/badge";
import { ChartCard } from "@/components/chart-card";
import { EChart } from "@/components/e-chart";
import { KpiCard } from "@/components/kpi-card";
import { MoreAnalysis } from "@/components/more-analysis";
import { RangeTabs } from "@/components/range-tabs";
import { Reveal } from "@/components/reveal";
import { ScenarioSlider } from "@/components/scenario-slider";
import { TableScroller } from "@/components/table-scroller";
import type { PlantData } from "@/lib/data";
import { cn, formatCurrency, formatNumber } from "@/lib/utils";

type Comparison = {
  slug: string;
  name: string;
  availability: number;
  pm: number;
  costPct: number;
  sourceErp: string;
};

const axis = {
  axisLabel: { color: "#8fa9b7", fontSize: 11 },
  axisLine: { show: false },
  axisTick: { show: false },
  splitLine: { lineStyle: { color: "rgba(234,242,246,0.08)" } },
};

const compactMoney = (value: number) => {
  if (value === 0) return "0";
  if (value >= 10_000_000) return `${Math.round(value / 1_000_000)}M`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${Math.round(value / 1_000)}k`;
  return String(value);
};

const tooltip = {
  backgroundColor: "#0d2638",
  borderWidth: 1,
  borderColor: "rgba(234,242,246,0.14)",
  textStyle: { color: "#eaf2f6", fontSize: 12 },
  padding: [8, 10],
};

const sourceOffset: Record<string, number> = {
  coal: 1.1,
  thermal: -0.5,
  wind: 0.3,
  gas: -0.8,
};

export function ExecutiveDashboard({
  data,
  comparison,
}: {
  data: PlantData;
  comparison: Comparison[];
}) {
  const [range, setRange] = useState(6);
  const [layer, setLayer] = useState<"source" | "canonical" | "variance">("canonical");
  const monthly = useMemo(() => data.monthly.slice(-range), [data.monthly, range]);
  const labels = monthly.map((point) => point.month);
  const latest = data.monthly[data.monthly.length - 1];
  const currentPm = Math.round(latest.pm);
  const [pmTarget, setPmTarget] = useState(currentPm);

  const pmGap = pmTarget - currentPm;
  const availabilityGain = pmGap * 0.12;
  const annualHoursAvoided = (availabilityGain / 100) * 8760;
  const lossAvoided = annualHoursAvoided * data.plant.hourlyLoss;
  const orderedComparison = useMemo(
    () =>
      [...comparison].sort((a, b) =>
        a.slug === data.plant.slug ? -1 : b.slug === data.plant.slug ? 1 : 0,
      ),
    [comparison, data.plant.slug],
  );

  const availabilityOption = useMemo(
    () => ({
      grid: { left: 6, right: 10, top: 24, bottom: 6, containLabel: true },
      tooltip: { ...tooltip, trigger: "axis" },
      xAxis: { type: "category", data: labels, ...axis, splitLine: { show: false } },
      yAxis: {
        type: "value",
        min: 84,
        max: 100,
        interval: 4,
        ...axis,
        axisLabel: { color: "#8fa9b7", fontSize: 11, formatter: "{value}%" },
      },
      series: [
        {
          name: "Actual",
          type: "line",
          smooth: true,
          data: monthly.map((point) => point.availability),
          symbol: "circle",
          symbolSize: 6,
          lineStyle: { color: "#4fd1c5", width: 2 },
          itemStyle: { color: "#4fd1c5" },
          areaStyle: { color: "rgba(79,209,197,0.10)" },
          markLine: {
            silent: true,
            symbol: "none",
            lineStyle: { color: "#e8a33d", type: "dashed" },
            label: {
              formatter: "target 94%",
              position: "insideStartTop",
              color: "#e8a33d",
              fontSize: 10,
            },
            data: [{ yAxis: 94 }],
          },
        },
        ...(Math.abs(availabilityGain) > 0.05
          ? [
              {
                name: "PM scenario",
                type: "line",
                smooth: true,
                data: monthly.map((point) =>
                  Math.min(100, point.availability + availabilityGain),
                ),
                symbol: "none",
                lineStyle: { color: "#e8a33d", width: 1.5, type: "dashed" },
                itemStyle: { color: "#e8a33d" },
              },
            ]
          : []),
      ],
    }),
    [availabilityGain, labels, monthly],
  );

  const downtimeOption = useMemo(
    () => ({
      grid: { left: 6, right: 10, top: 24, bottom: 6, containLabel: true },
      tooltip: { ...tooltip, trigger: "axis" },
      xAxis: { type: "category", data: labels, ...axis, splitLine: { show: false } },
      yAxis: {
        type: "value",
        ...axis,
        axisLabel: { color: "#8fa9b7", fontSize: 11, formatter: "{value}h" },
      },
      series: [
        {
          name: "Unplanned downtime",
          type: "bar",
          data: monthly.map((point) => point.downtime),
          itemStyle: { color: "#e8a33d", borderRadius: [4, 4, 0, 0] },
          barMaxWidth: 28,
        },
      ],
    }),
    [labels, monthly],
  );

  const costOption = useMemo(
    () => ({
      grid: { left: 6, right: 10, top: 30, bottom: 6, containLabel: true },
      tooltip: { ...tooltip, trigger: "axis" },
      legend: {
        top: 0,
        right: 0,
        icon: "circle",
        itemWidth: 7,
        itemHeight: 7,
        textStyle: { color: "#8fa9b7", fontSize: 11 },
      },
      xAxis: { type: "category", data: labels, ...axis, splitLine: { show: false } },
      yAxis: [
        {
          type: "value",
          ...axis,
          axisLabel: {
            color: "#8fa9b7",
            fontSize: 11,
            formatter: compactMoney,
          },
        },
        {
          type: "value",
          min: 50,
          max: 100,
          ...axis,
          axisLabel: { color: "#8fa9b7", fontSize: 11, formatter: "{value}%" },
          splitLine: { show: false },
        },
      ],
      series: [
        {
          name: "Maintenance cost",
          type: "bar",
          data: monthly.map((point) => point.cost),
          itemStyle: { color: "#4fd1c5", borderRadius: [4, 4, 0, 0] },
          barMaxWidth: 22,
        },
        {
          name: "PM compliance",
          type: "line",
          yAxisIndex: 1,
          smooth: true,
          data: monthly.map((point) => point.pm),
          symbol: "circle",
          symbolSize: 5,
          lineStyle: { color: "#7fb0ff", width: 2 },
          itemStyle: { color: "#7fb0ff" },
        },
      ],
    }),
    [labels, monthly],
  );

  const priorityOption = useMemo(
    () => ({
      tooltip: { ...tooltip, trigger: "item" },
      legend: {
        bottom: 0,
        icon: "circle",
        itemWidth: 7,
        itemHeight: 7,
        textStyle: { color: "#8fa9b7", fontSize: 11 },
      },
      series: [
        {
          type: "pie",
          radius: ["58%", "78%"],
          center: ["50%", "44%"],
          avoidLabelOverlap: true,
          itemStyle: { borderWidth: 0 },
          label: { show: false },
          data: data.priorityMix.map((item, index) => ({
            name: item.label,
            value: item.value,
            itemStyle: {
              color: ["#f97066", "#e8a33d", "#7fb0ff", "#4fd1c5"][index],
            },
          })),
        },
      ],
      graphic: [
        {
          type: "text",
          left: "center",
          top: "38%",
          style: {
            text: String(data.priorityMix.reduce((sum, item) => sum + item.value, 0)),
            fill: "#eaf2f6",
            fontSize: 24,
            fontWeight: 600,
            textAlign: "center",
          },
        },
        {
          type: "text",
          left: "center",
          top: "47%",
          style: {
            text: "OPEN",
            fill: "#8fa9b7",
            fontSize: 10,
            fontWeight: 600,
            textAlign: "center",
          },
        },
      ],
    }),
    [data.priorityMix],
  );

  const topActors = useMemo(
    () => [...data.badActors].sort((a, b) => b.cost - a.cost).slice(0, 5),
    [data.badActors],
  );
  const criticalOpen = data.priorityMix.find((item) => item.label === "Critical")?.value ?? 0;
  const highOpen = data.priorityMix.find((item) => item.label === "High")?.value ?? 0;

  const gainLabel = `${availabilityGain >= 0 ? "+" : ""}${formatNumber(
    availabilityGain,
    1,
  )} pts availability`;
  const lossLabel = `${formatCurrency(Math.abs(lossAvoided), true)} ${
    lossAvoided >= 0 ? "avoided" : "added"
  } / yr`;

  return (
    <div className="space-y-4">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--warn)]">
          Executive overview
        </p>
        <h2 className="mt-1 text-[20px] font-semibold tracking-[-0.03em] sm:text-[24px]">
          {data.plant.headline}
        </h2>
        <p className="measure mt-1 line-clamp-3 text-[12px] text-muted sm:text-[13px]">
          {data.plant.story}
        </p>
      </div>

      <section className="card overflow-hidden" aria-label="Operating picture">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-line px-4 py-2.5">
          <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--warn)]">
            Operating picture
          </span>
          <span className="text-[11px] text-muted">
            Four sources · one canonical layer
          </span>
          <div
            className="ml-auto inline-flex rounded-md border border-line bg-[var(--panel-strong)] p-0.5"
            role="group"
            aria-label="Operating layer"
          >
            {(["source", "canonical", "variance"] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setLayer(option)}
                aria-pressed={layer === option}
                className={cn(
                  "rounded px-3 py-2 text-[10px] font-semibold capitalize transition-colors",
                  layer === option
                    ? "bg-[var(--warn)] text-[var(--graphite)]"
                    : "text-muted hover:text-ink",
                )}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-px bg-line xl:grid-cols-4">
          {orderedComparison.map((plant) => {
            const current = plant.slug === data.plant.slug;
            const availabilityDelta = plant.availability - 94;
            const pmDelta = plant.pm - 85;
            const sourceValue = plant.availability + (sourceOffset[plant.slug] ?? 0);
            const shownValue =
              layer === "variance"
                ? availabilityDelta
                : layer === "source"
                  ? sourceValue
                  : plant.availability;
            return (
              <Link
                key={plant.slug}
                href={`/demo/${plant.slug}`}
                className={cn(
                  "group bg-[var(--surface)] px-3 py-2.5 transition-colors hover:bg-[var(--panel)]",
                  current && "bg-[var(--panel)] shadow-[inset_2px_0_0_0_var(--warn)]",
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-[11px] font-semibold sm:text-[12px]">
                    {plant.name}
                  </span>
                  <span
                    className={cn(
                      "h-1.5 w-1.5 shrink-0 rounded-full",
                      current ? "bg-[var(--warn)]" : "bg-[var(--line-strong)]",
                    )}
                  />
                </div>
                <div className="mt-1.5 flex items-baseline justify-between gap-2">
                  <span className="min-w-0 truncate text-[10px] text-muted">
                    {plant.sourceErp}
                  </span>
                  <span
                    className={cn(
                      "shrink-0 tabular text-[17px] font-semibold tracking-[-0.03em]",
                      layer === "variance" && availabilityDelta < 0
                        ? "text-[var(--warn)]"
                        : "text-ink",
                    )}
                  >
                    {layer === "variance"
                      ? `${shownValue > 0 ? "+" : ""}${formatNumber(shownValue, 1)} pts`
                      : `${formatNumber(shownValue, 1)}%`}
                  </span>
                </div>
                <p className="mt-1 line-clamp-2 text-[10px] leading-snug text-muted">
                  {layer === "source" ? (
                    "source-reported · ERP field"
                  ) : layer === "canonical" ? (
                    <>
                      canonical · {formatNumber(plant.pm, 0)}% PM
                    </>
                  ) : (
                    <>
                      avail vs 94% · PM{" "}
                      <span
                        className={cn(
                          pmDelta < 0 ? "text-[var(--warn)]" : "text-[var(--good)]",
                        )}
                      >
                        {pmDelta > 0 ? "+" : ""}
                        {formatNumber(pmDelta, 1)} pts
                      </span>{" "}
                      vs 85%
                    </>
                  )}
                </p>
              </Link>
            );
          })}
        </div>
        <p className="border-t border-line px-4 py-2 text-[10px] leading-snug text-muted">
          S/4HANA adapter implemented · ECC, Maximo and Oracle planned. Source vs
          canonical difference is modelled in this synthetic demo.
        </p>
      </section>

      <div className="grid grid-cols-2 gap-2.5 xl:grid-cols-5">
        {data.kpis.map((kpi, index) => (
          <Reveal key={kpi.id} delay={index * 0.03} className="h-full">
            <KpiCard kpi={kpi} />
          </Reveal>
        ))}
      </div>

      <div className="flex flex-col gap-3 xl:grid xl:grid-cols-[1.45fr_1fr]">
        <Reveal className="order-1 h-full">
          <ChartCard
            title="Availability trend"
            subtitle="Teal actual · target 94%. Drag the lever to add the amber scenario."
            action={<RangeTabs value={range} onChange={setRange} />}
            footer={
              <ScenarioSlider
                label="PM compliance"
                value={pmTarget}
                min={55}
                max={90}
                display={`${pmTarget}%`}
                minLabel="55%"
                maxLabel="90% · target 85%"
                onChange={setPmTarget}
                readout={
                  Math.abs(availabilityGain) < 0.05 ? (
                    <span className="text-muted">
                      Baseline · drag to model PM recovery
                    </span>
                  ) : (
                    <>
                      <span
                        className={cn(
                          "font-semibold",
                          availabilityGain >= 0 ? "text-good" : "text-bad",
                        )}
                      >
                        {gainLabel}
                      </span>
                      <span className="text-muted"> · </span>
                      {lossLabel}
                    </>
                  )
                }
              />
            }
          >
            <EChart
              option={availabilityOption}
              ariaLabel={`Availability trend for ${data.plant.name}: actual versus a PM compliance scenario of ${pmTarget} percent.`}
            />
          </ChartCard>
        </Reveal>
        <Reveal delay={0.04} className="order-3 h-full xl:order-2">
          <ChartCard
            title="Priority mix"
            subtitle="Open notifications by priority."
            footer={
              <p className="text-[11px] text-muted">
                <span className="font-semibold text-bad">{criticalOpen} critical</span>
                <span> · </span>
                <span className="font-semibold text-warn">{highOpen} high</span>
                <span> awaiting triage</span>
              </p>
            }
          >
            <EChart
              option={priorityOption}
              ariaLabel={`Priority mix for ${data.plant.name}`}
              fill
            />
          </ChartCard>
        </Reveal>

        <Reveal className="order-2 xl:order-3 xl:col-span-2">
          <section className="card overflow-hidden">
          <div className="flex items-center justify-between gap-3 px-4 pt-3.5">
            <div>
              <h2 className="text-[14px] font-semibold">Top bad actors</h2>
              <p className="mt-0.5 text-[11px] text-muted">
                Ranked by downtime cost over the last 12 months.
              </p>
            </div>
            <Link
              href={`/demo/${data.plant.slug}/reliability`}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-info"
            >
              Reliability <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <TableScroller label="Top bad actors table" className="mt-2.5">
            <table className="w-full min-w-[560px] text-left text-[12px]">
              <thead>
                <tr className="border-y border-line text-[11px] text-muted">
                  <th className="px-4 py-2 font-semibold">Asset</th>
                  <th className="px-3 py-2 font-semibold">Criticality</th>
                  <th className="px-3 py-2 text-right font-semibold">Failures</th>
                  <th className="px-3 py-2 text-right font-semibold">Downtime</th>
                  <th className="px-4 py-2 text-right font-semibold">Cost</th>
                </tr>
              </thead>
              <tbody>
                {topActors.map((actor) => (
                  <tr key={actor.asset} className="table-row border-b border-line/70">
                    <td className="px-4 py-2.5 font-medium">{actor.asset}</td>
                    <td className="px-3 py-2.5">
                      <Badge
                        tone={
                          actor.criticality === "A"
                            ? "bad"
                            : actor.criticality === "B"
                              ? "warn"
                              : "neutral"
                        }
                      >
                        {actor.criticality}
                      </Badge>
                    </td>
                    <td className="tabular px-3 py-2.5 text-right">{actor.failures}</td>
                    <td className="tabular px-3 py-2.5 text-right">{actor.downtime} h</td>
                    <td className="tabular px-4 py-2.5 text-right">
                      {formatCurrency(actor.cost, true)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableScroller>
          </section>
        </Reveal>
      </div>

      <MoreAnalysis count={2} label="More analysis">
        <div className="grid gap-3 xl:grid-cols-2">
          <ChartCard
            title="Cost and PM compliance"
            subtitle="Monthly maintenance spend against PM completion."
          >
            <EChart
              option={costOption}
              ariaLabel={`Maintenance cost and PM compliance for ${data.plant.name}`}
            />
          </ChartCard>
          <ChartCard
            title="Unplanned downtime"
            subtitle={`${latest.downtime} hours last month · ${formatCurrency(
              latest.downtime * data.plant.hourlyLoss,
              true,
            )} estimated loss`}
          >
            <EChart
              option={downtimeOption}
              ariaLabel={`Unplanned downtime for ${data.plant.name}`}
            />
          </ChartCard>
        </div>
      </MoreAnalysis>
    </div>
  );
}
