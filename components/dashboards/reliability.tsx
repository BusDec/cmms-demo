"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/badge";
import { ChartCard } from "@/components/chart-card";
import { EChart } from "@/components/e-chart";
import { StatCard } from "@/components/kpi-card";
import { MoreAnalysis } from "@/components/more-analysis";
import { RangeTabs } from "@/components/range-tabs";
import { Reveal } from "@/components/reveal";
import { ScenarioSlider } from "@/components/scenario-slider";
import { TableScroller } from "@/components/table-scroller";
import type { PlantData } from "@/lib/data";
import { formatCurrency, formatNumber } from "@/lib/utils";

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

const unitCount: Record<string, number> = {
  coal: 2,
  thermal: 3,
  wind: 84,
  gas: 3,
};

export function ReliabilityDashboard({ data }: { data: PlantData }) {
  const [range, setRange] = useState(6);
  const [reduction, setReduction] = useState(0);
  const monthly = useMemo(() => data.monthly.slice(-range), [data.monthly, range]);
  const latest = data.monthly[data.monthly.length - 1];
  const repeatAssets = data.badActors.filter((actor) => actor.failures > 3).length;
  const totalFailures = data.badActors.reduce((sum, actor) => sum + actor.failures, 0);
  const totalDowntime = data.badActors.reduce((sum, actor) => sum + actor.downtime, 0);
  const operatingHours =
    8760 * (unitCount[data.plant.slug] ?? 1) * (latest.availability / 100);
  const mtbf = totalFailures > 0 ? operatingHours / totalFailures : operatingHours;
  const mttr = totalFailures > 0 ? totalDowntime / totalFailures : latest.mttr;

  const pareto = useMemo(
    () => [...data.badActors].sort((a, b) => b.failures - a.failures).slice(0, 7),
    [data.badActors],
  );
  const topThree = useMemo(
    () =>
      [...data.badActors]
        .sort((a, b) => b.downtime - a.downtime)
        .slice(0, 3)
        .reduce((sum, actor) => sum + actor.downtime, 0),
    [data.badActors],
  );
  const topThreeShare = totalDowntime > 0 ? topThree / totalDowntime : 0;

  const currentLoss = monthly.reduce(
    (sum, point) => sum + point.downtime * data.plant.hourlyLoss,
    0,
  );
  const scenarioLoss = currentLoss * (1 - (reduction / 100) * topThreeShare);
  const lossAvoided = currentLoss - scenarioLoss;

  const badActors = useMemo(
    () => [...data.badActors].sort((a, b) => b.cost - a.cost),
    [data.badActors],
  );

  const reliabilityOption = useMemo(
    () => ({
      grid: { left: 6, right: 10, top: 28, bottom: 30, containLabel: true },
      tooltip: { ...tooltip, trigger: "axis" },
      legend: {
        top: 0,
        right: 0,
        icon: "circle",
        itemWidth: 7,
        itemHeight: 7,
        textStyle: { color: "#8fa9b7", fontSize: 11 },
      },
      xAxis: {
        type: "category",
        data: monthly.map((point) => point.month),
        ...axis,
        splitLine: { show: false },
      },
      yAxis: [
        {
          type: "value",
          ...axis,
          axisLabel: { color: "#8fa9b7", fontSize: 11, formatter: "{value}h" },
        },
        {
          type: "value",
          ...axis,
          axisLabel: { color: "#8fa9b7", fontSize: 11, formatter: "{value}h" },
          splitLine: { show: false },
        },
      ],
      series: [
        {
          name: "MTTR",
          type: "line",
          smooth: true,
          data: monthly.map((point) => point.mttr * (mttr / latest.mttr)),
          symbol: "circle",
          symbolSize: 5,
          lineStyle: { color: "#e8a33d", width: 2 },
          itemStyle: { color: "#e8a33d" },
        },
        {
          name: "MTBF",
          type: "line",
          yAxisIndex: 1,
          smooth: true,
          data: monthly.map(
            (_point, index) => mtbf * (1 + (index - (monthly.length - 1)) * 0.01),
          ),
          symbol: "circle",
          symbolSize: 5,
          lineStyle: { color: "#7fb0ff", width: 2 },
          itemStyle: { color: "#7fb0ff" },
        },
      ],
    }),
    [latest.mttr, monthly, mtbf, mttr],
  );

  const paretoOption = useMemo(() => {
    const total = pareto.reduce((sum, actor) => sum + actor.failures, 0);
    let running = 0;
    const cumulative = pareto.map((actor) => {
      running += actor.failures;
      return total > 0 ? Math.round((running / total) * 100) : 0;
    });
    return {
      grid: { left: 56, right: 34, top: 16, bottom: 6, containLabel: true },
      tooltip: { ...tooltip, trigger: "axis" },
      xAxis: { type: "value", ...axis },
      yAxis: [
        {
          type: "category",
          inverse: true,
          data: pareto.map((actor) => actor.asset),
          ...axis,
          axisLabel: {
            color: "#8fa9b7",
            fontSize: 10,
            width: 150,
            overflow: "truncate",
          },
          splitLine: { show: false },
        },
        {
          type: "value",
          min: 0,
          max: 100,
          ...axis,
          axisLabel: { color: "#8fa9b7", fontSize: 10, formatter: "{value}%" },
          splitLine: { show: false },
        },
      ],
      series: [
        {
          name: "Failures",
          type: "bar",
          data: pareto.map((actor) => actor.failures),
          itemStyle: { color: "#7fb0ff", borderRadius: [0, 4, 4, 0] },
          barMaxWidth: 16,
          label: {
            show: true,
            position: "right",
            formatter: "{c}",
            color: "#8fa9b7",
            fontSize: 10,
          },
        },
        {
          name: "Cumulative",
          type: "line",
          yAxisIndex: 1,
          data: cumulative,
          symbol: "circle",
          symbolSize: 4,
          lineStyle: { color: "#e8a33d", width: 1.5 },
          itemStyle: { color: "#e8a33d" },
        },
      ],
    };
  }, [pareto]);

  const lossOption = useMemo(
    () => ({
      grid: { left: 6, right: 10, top: 28, bottom: 6, containLabel: true },
      tooltip: { ...tooltip, trigger: "axis" },
      legend: {
        top: 0,
        right: 0,
        icon: "circle",
        itemWidth: 7,
        itemHeight: 7,
        textStyle: { color: "#8fa9b7", fontSize: 11 },
      },
      xAxis: {
        type: "category",
        data: monthly.map((point) => point.month),
        ...axis,
        splitLine: { show: false },
      },
      yAxis: {
        type: "value",
        ...axis,
        axisLabel: {
          color: "#8fa9b7",
          fontSize: 11,
          formatter: compactMoney,
        },
      },
      series: [
        {
          name: "Current",
          type: "bar",
          data: monthly.map((point) => point.downtime * data.plant.hourlyLoss),
          itemStyle: { color: "#f97066", borderRadius: [4, 4, 0, 0] },
          barMaxWidth: 24,
        },
        ...(reduction > 0
          ? [
              {
                name: "Scenario",
                type: "line",
                smooth: true,
                data: monthly.map(
                  (point) =>
                    point.downtime *
                    data.plant.hourlyLoss *
                    (1 - (reduction / 100) * topThreeShare),
                ),
                symbol: "circle",
                symbolSize: 4,
                lineStyle: { color: "#e8a33d", width: 2 },
                itemStyle: { color: "#e8a33d" },
              },
            ]
          : []),
      ],
    }),
    [data.plant.hourlyLoss, monthly, reduction, topThreeShare],
  );

  return (
    <div className="space-y-4">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">
          Reliability
        </p>
        <h2 className="mt-1 text-[20px] font-semibold tracking-[-0.03em] sm:text-[24px]">
          Failure and repair
        </h2>
        <p className="measure mt-1 text-[12px] text-muted sm:text-[13px]">
          MTBF and MTTR, repeat failures and the assets driving downtime cost.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2.5 xl:grid-cols-4">
        {[
          {
            label: "MTBF",
            value: `${formatNumber(mtbf)} h`,
            hint: "Operating hours ÷ recorded failures",
            tone: "warn" as const,
          },
          {
            label: "MTTR",
            value: `${formatNumber(mttr, 1)} h`,
            hint: "Recorded downtime ÷ failure events",
            tone: "warn" as const,
          },
          {
            label: "Repeat-failure assets",
            value: `${repeatAssets}`,
            hint: "More than three failures this year",
            tone: "warn" as const,
          },
          {
            label: "Unplanned loss",
            value: formatCurrency(latest.downtime * data.plant.hourlyLoss, true),
            hint: "Last month",
            tone: "bad" as const,
          },
        ].map((item, index) => (
          <Reveal key={item.label} delay={index * 0.03} className="h-full">
            <StatCard label={item.label} value={item.value} hint={item.hint} tone={item.tone} />
          </Reveal>
        ))}
      </div>

      <div className="grid gap-3 xl:grid-cols-[1.45fr_1fr]">
        <Reveal className="h-full">
          <ChartCard
            title="MTBF and MTTR"
            subtitle="MTBF derived from recorded failures; right axis."
            action={<RangeTabs value={range} onChange={setRange} />}
          >
            <EChart
              option={reliabilityOption}
              ariaLabel={`MTBF and MTTR for ${data.plant.name}`}
              fill
            />
          </ChartCard>
        </Reveal>
        <Reveal delay={0.04} className="h-full">
          <ChartCard
            title="Downtime loss"
            subtitle={`Top three assets drive ${Math.round(topThreeShare * 100)}% of bad-actor downtime.`}
            footer={
              <ScenarioSlider
                label="Top-3 downtime removed"
                value={reduction}
                min={0}
                max={60}
                display={`${reduction}%`}
                minLabel="0%"
                maxLabel="60%"
                onChange={setReduction}
                readout={
                  <>
                    <span className="font-semibold text-good">
                      {formatCurrency(lossAvoided, true)} avoided
                    </span>
                    <span className="text-muted"> over {range}M</span>
                  </>
                }
              />
            }
          >
            <EChart
              option={lossOption}
              ariaLabel={`Current and scenario downtime loss for ${data.plant.name} with ${reduction} percent of top-three downtime removed`}
            />
          </ChartCard>
        </Reveal>
      </div>

      <Reveal>
        <section className="card overflow-hidden">
          <div className="flex items-start justify-between gap-3 px-4 pt-3.5">
            <div>
              <h2 className="text-[14px] font-semibold">Bad actors</h2>
              <p className="mt-0.5 text-[11px] text-muted">
                Ten assets ranked by estimated downtime cost · last 12 months.
              </p>
            </div>
            <Link
              href={`/demo/${data.plant.slug}/rca-qa`}
              className="inline-flex shrink-0 items-center gap-1 text-[11px] font-semibold text-info"
            >
              RCA <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <TableScroller label="Bad actors table" className="mt-2.5">
            <table className="w-full min-w-[720px] text-left text-[12px]">
              <thead>
                <tr className="border-y border-line text-[11px] text-muted">
                  <th className="px-4 py-2 font-semibold">Asset</th>
                  <th className="px-3 py-2 font-semibold">Criticality</th>
                  <th className="px-3 py-2 text-right font-semibold">Failures</th>
                  <th className="px-3 py-2 text-right font-semibold">Downtime</th>
                  <th className="px-4 py-2 text-right font-semibold">Estimated cost</th>
                </tr>
              </thead>
              <tbody>
                {badActors.map((actor) => (
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

      <MoreAnalysis count={1} label="Failure Pareto">
        <ChartCard
          title="Failure Pareto"
          subtitle="Bars: failure count · amber line: cumulative share."
        >
          <EChart
            option={paretoOption}
            ariaLabel={`Failure Pareto for ${data.plant.name}, bars are failure counts and the line is cumulative share`}
          />
        </ChartCard>
      </MoreAnalysis>
    </div>
  );
}
