"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/badge";
import { ChartCard } from "@/components/chart-card";
import { EChart } from "@/components/e-chart";
import { KpiCard } from "@/components/kpi-card";
import { RangeTabs } from "@/components/range-tabs";
import { Reveal } from "@/components/reveal";
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
  axisLabel: { color: "#5b6472", fontSize: 11 },
  axisLine: { show: false },
  axisTick: { show: false },
  splitLine: { lineStyle: { color: "#eef2f7" } },
};

const compactMoney = (value: number) => {
  if (value === 0) return "0";
  if (value >= 10_000_000) return `${Math.round(value / 1_000_000)}M`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${Math.round(value / 1_000)}k`;
  return String(value);
};

const tooltip = {
  backgroundColor: "#0f172a",
  borderWidth: 0,
  textStyle: { color: "#ffffff", fontSize: 12 },
  padding: [8, 10],
};

export function ExecutiveDashboard({
  data,
  comparison,
}: {
  data: PlantData;
  comparison: Comparison[];
}) {
  const [range, setRange] = useState(6);
  const monthly = useMemo(() => data.monthly.slice(-range), [data.monthly, range]);
  const labels = monthly.map((point) => point.month);

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
        axisLabel: { color: "#5b6472", fontSize: 11, formatter: "{value}%" },
      },
      series: [
        {
          name: "Availability",
          type: "line",
          smooth: true,
          data: monthly.map((point) => point.availability),
          symbol: "circle",
          symbolSize: 6,
          lineStyle: { color: "#1d4ed8", width: 2 },
          itemStyle: { color: "#1d4ed8" },
          areaStyle: { color: "rgba(29, 78, 216, 0.08)" },
          markLine: {
            silent: true,
            symbol: "none",
            lineStyle: { color: "#b45309", type: "dashed" },
            label: { formatter: "target 94%", position: "insideStartTop", color: "#b45309", fontSize: 10 },
            data: [{ yAxis: 94 }],
          },
        },
      ],
    }),
    [labels, monthly],
  );

  const downtimeOption = useMemo(
    () => ({
      grid: { left: 6, right: 10, top: 24, bottom: 6, containLabel: true },
      tooltip: { ...tooltip, trigger: "axis" },
      xAxis: { type: "category", data: labels, ...axis, splitLine: { show: false } },
      yAxis: {
        type: "value",
        ...axis,
        axisLabel: { color: "#5b6472", fontSize: 11, formatter: "{value}h" },
      },
      series: [
        {
          name: "Unplanned downtime",
          type: "bar",
          data: monthly.map((point) => point.downtime),
          itemStyle: { color: "#b45309", borderRadius: [4, 4, 0, 0] },
          barMaxWidth: 28,
        },
      ],
    }),
    [labels, monthly],
  );

  const costOption = useMemo(
    () => ({
      grid: { left: 6, right: 10, top: 28, bottom: 6, containLabel: true },
      tooltip: { ...tooltip, trigger: "axis" },
      legend: {
        bottom: 0,
        icon: "circle",
        itemWidth: 7,
        itemHeight: 7,
        textStyle: { color: "#5b6472", fontSize: 11 },
      },
      xAxis: { type: "category", data: labels, ...axis, splitLine: { show: false } },
      yAxis: [
        {
          type: "value",
          ...axis,
          axisLabel: {
            color: "#5b6472",
            fontSize: 11,
            formatter: compactMoney,
          },
        },
        {
          type: "value",
          min: 50,
          max: 100,
          ...axis,
          axisLabel: { color: "#5b6472", fontSize: 11, formatter: "{value}%" },
          splitLine: { show: false },
        },
      ],
      series: [
        {
          name: "Maintenance cost",
          type: "bar",
          data: monthly.map((point) => point.cost),
          itemStyle: { color: "#0f766e", borderRadius: [4, 4, 0, 0] },
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
          lineStyle: { color: "#1d4ed8", width: 2 },
          itemStyle: { color: "#1d4ed8" },
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
        textStyle: { color: "#5b6472", fontSize: 11 },
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
              color: ["#b91c1c", "#b45309", "#1d4ed8", "#0f766e"][index],
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
            fill: "#0f172a",
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
            fill: "#5b6472",
            fontSize: 10,
            fontWeight: 600,
            textAlign: "center",
          },
        },
      ],
    }),
    [data.priorityMix],
  );

  const latest = data.monthly[data.monthly.length - 1];
  const topActors = data.badActors.slice(0, 5);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold text-muted">
            Executive overview
          </p>
          <h2 className="mt-1 text-[24px] font-semibold tracking-[-0.03em]">
            {data.plant.headline}
          </h2>
          <p className="measure mt-1 text-[13px] text-muted">{data.plant.story}</p>
        </div>
        <RangeTabs value={range} onChange={setRange} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {data.kpis.map((kpi, index) => (
          <Reveal key={kpi.id} delay={index * 0.04}>
            <KpiCard kpi={kpi} />
          </Reveal>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.45fr_1fr]">
        <Reveal>
          <ChartCard
            title="Availability trend"
            subtitle="Weighted by unit capacity; target band 94–97%."
          >
            <EChart
              option={availabilityOption}
              ariaLabel={`Availability trend for ${data.plant.name}`}
            />
          </ChartCard>
        </Reveal>
        <Reveal delay={0.05}>
          <ChartCard
            title="Priority mix"
            subtitle="Open notifications by priority."
          >
            <EChart
              option={priorityOption}
              ariaLabel={`Priority mix for ${data.plant.name}`}
              height={280}
            />
          </ChartCard>
        </Reveal>
        <Reveal>
          <ChartCard
            title="Cost and PM compliance"
            subtitle="Monthly maintenance spend against PM completion."
          >
            <EChart
              option={costOption}
              ariaLabel={`Maintenance cost and PM compliance for ${data.plant.name}`}
            />
          </ChartCard>
        </Reveal>
        <Reveal delay={0.05}>
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
        </Reveal>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.45fr_1fr]">
        <Reveal>
          <section className="card overflow-hidden">
            <div className="flex items-center justify-between gap-3 px-4 pt-4">
              <div>
                <h2 className="text-[15px] font-semibold">Top bad actors</h2>
                <p className="mt-1 text-[12px] text-muted">
                  Ranked by downtime cost over the last 12 months.
                </p>
              </div>
              <Link
                href={`/demo/${data.plant.slug}/reliability`}
                className="inline-flex items-center gap-1 text-[12px] font-semibold text-info"
              >
                Reliability <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="mt-3 overflow-x-auto">
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
                        <Badge tone={actor.criticality === "A" ? "bad" : actor.criticality === "B" ? "warn" : "neutral"}>
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
            </div>
          </section>
        </Reveal>

        <Reveal delay={0.05}>
          <section className="card overflow-hidden">
            <div className="px-4 pt-4">
              <h2 className="text-[15px] font-semibold">Cross-plant view</h2>
              <p className="mt-1 text-[12px] text-muted">
                Same canonical model, four source systems.
              </p>
            </div>
            <div className="mt-3 space-y-2 px-4 pb-4">
              {comparison.map((plant) => (
                <Link
                  key={plant.slug}
                  href={`/demo/${plant.slug}`}
                  className={cn(
                    "flex items-center justify-between gap-3 rounded-md px-2 py-2 transition-colors hover:bg-[#f8fafc]",
                    plant.slug === data.plant.slug && "bg-[#f1f5f9]",
                  )}
                >
                  <div className="min-w-0">
                    <p className="truncate text-[12px] font-semibold">{plant.name}</p>
                    <p className="text-[10px] text-muted">{plant.sourceErp}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3 text-right text-[11px]">
                    <span className="tabular">{formatNumber(plant.availability, 1)}%</span>
                    <span className="tabular text-muted">{formatNumber(plant.pm, 0)}% PM</span>
                    <span className="tabular text-muted">{plant.costPct.toFixed(2)}%</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </Reveal>
      </div>
    </div>
  );
}
