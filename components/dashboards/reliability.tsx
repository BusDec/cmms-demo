"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/badge";
import { ChartCard } from "@/components/chart-card";
import { EChart } from "@/components/e-chart";
import { RangeTabs } from "@/components/range-tabs";
import { Reveal } from "@/components/reveal";
import type { PlantData } from "@/lib/data";
import { formatCurrency, formatNumber } from "@/lib/utils";

const axis = {
  axisLabel: { color: "#5b6472", fontSize: 11 },
  axisLine: { show: false },
  axisTick: { show: false },
  splitLine: { lineStyle: { color: "#eef2f7" } },
};

const tooltip = {
  backgroundColor: "#0f172a",
  borderWidth: 0,
  textStyle: { color: "#ffffff", fontSize: 12 },
  padding: [8, 10],
};

const mtbfBase: Record<string, number> = {
  coal: 1850,
  thermal: 2240,
  wind: 4180,
  gas: 2620,
};

export function ReliabilityDashboard({ data }: { data: PlantData }) {
  const [range, setRange] = useState(6);
  const monthly = useMemo(() => data.monthly.slice(-range), [data.monthly, range]);
  const latest = data.monthly[data.monthly.length - 1];
  const repeatRate = Math.round(
    (data.badActors.filter((actor) => actor.failures > 3).length / data.badActors.length) * 100,
  );
  const mtbf = mtbfBase[data.plant.slug] ?? 2000;

  const pareto = useMemo(
    () => [...data.badActors].sort((a, b) => b.failures - a.failures).slice(0, 7),
    [data.badActors],
  );

  const reliabilityOption = useMemo(
    () => ({
      grid: { left: 6, right: 10, top: 28, bottom: 30, containLabel: true },
      tooltip: { ...tooltip, trigger: "axis" },
      legend: {
        bottom: 0,
        icon: "circle",
        itemWidth: 7,
        itemHeight: 7,
        textStyle: { color: "#5b6472", fontSize: 11 },
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
          axisLabel: { color: "#5b6472", fontSize: 11, formatter: "{value}h" },
        },
        {
          type: "value",
          ...axis,
          axisLabel: { color: "#5b6472", fontSize: 11, formatter: "{value}h" },
          splitLine: { show: false },
        },
      ],
      series: [
        {
          name: "MTTR",
          type: "line",
          smooth: true,
          data: monthly.map((point) => point.mttr),
          symbol: "circle",
          symbolSize: 5,
          lineStyle: { color: "#b45309", width: 2 },
          itemStyle: { color: "#b45309" },
        },
        {
          name: "MTBF",
          type: "line",
          yAxisIndex: 1,
          smooth: true,
          data: monthly.map((point, index) => mtbf + (index - 5) * 40),
          symbol: "circle",
          symbolSize: 5,
          lineStyle: { color: "#1d4ed8", width: 2 },
          itemStyle: { color: "#1d4ed8" },
        },
      ],
    }),
    [monthly, mtbf],
  );

  const paretoOption = useMemo(
    () => ({
      grid: { left: 56, right: 10, top: 16, bottom: 6, containLabel: true },
      tooltip: { ...tooltip, trigger: "axis" },
      xAxis: {
        type: "value",
        ...axis,
      },
      yAxis: {
        type: "category",
        data: pareto.map((actor) => actor.asset),
        ...axis,
        axisLabel: { color: "#5b6472", fontSize: 10, width: 150, overflow: "truncate" },
        splitLine: { show: false },
      },
      series: [
        {
          type: "bar",
          data: pareto.map((actor) => actor.failures),
          itemStyle: { color: "#1d4ed8", borderRadius: [0, 4, 4, 0] },
          barMaxWidth: 16,
          label: {
            show: true,
            position: "right",
            formatter: "{c}",
            color: "#5b6472",
            fontSize: 10,
          },
        },
      ],
    }),
    [pareto],
  );

  const lossOption = useMemo(
    () => ({
      grid: { left: 6, right: 10, top: 16, bottom: 6, containLabel: true },
      tooltip: { ...tooltip, trigger: "axis" },
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
          color: "#5b6472",
          fontSize: 11,
          formatter: (value: number) => `${Math.round(value / 1_000_000)}M`,
        },
      },
      series: [
        {
          type: "bar",
          data: monthly.map((point) => point.downtime * data.plant.hourlyLoss),
          itemStyle: { color: "#b91c1c", borderRadius: [4, 4, 0, 0] },
          barMaxWidth: 28,
        },
      ],
    }),
    [monthly, data.plant.hourlyLoss],
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold text-muted">
            Reliability
          </p>
          <h2 className="mt-1 text-[24px] font-semibold tracking-[-0.03em]">
            Failure and repair
          </h2>
          <p className="measure mt-1 text-[13px] text-muted">
            MTBF and MTTR, repeat failures and the assets driving downtime cost.
          </p>
        </div>
        <RangeTabs value={range} onChange={setRange} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "MTBF", value: `${formatNumber(mtbf)} h`, hint: "Operating hours ÷ failure events" },
          { label: "MTTR", value: `${formatNumber(latest.mttr, 1)} h`, hint: "Mean time to repair" },
          { label: "Repeat failure rate", value: `${repeatRate}%`, hint: "Assets with more than three failures" },
          { label: "Unplanned loss", value: formatCurrency(latest.downtime * data.plant.hourlyLoss, true), hint: "Last month" },
        ].map((item, index) => (
          <Reveal key={item.label} delay={index * 0.04}>
            <div className="card px-4 py-4">
              <p className="text-[12px] font-semibold text-muted">{item.label}</p>
              <p className="stat-value mt-2 text-[30px] font-semibold">{item.value}</p>
              <p className="mt-2 text-[11px] text-muted">{item.hint}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.45fr_1fr]">
        <Reveal>
          <ChartCard
            title="MTBF and MTTR"
            subtitle="Twelve-month trend; MTBF on the right axis."
          >
            <EChart option={reliabilityOption} ariaLabel={`MTBF and MTTR for ${data.plant.name}`} />
          </ChartCard>
        </Reveal>
        <Reveal delay={0.05}>
          <ChartCard
            title="Failure Pareto"
            subtitle="Top assets by failure count."
          >
            <EChart option={paretoOption} ariaLabel={`Failure Pareto for ${data.plant.name}`} />
          </ChartCard>
        </Reveal>
        <Reveal>
          <ChartCard
            title="Downtime loss"
            subtitle="Estimated cost of lost generation."
          >
            <EChart option={lossOption} ariaLabel={`Downtime loss for ${data.plant.name}`} />
          </ChartCard>
        </Reveal>
        <Reveal delay={0.05}>
          <ChartCard
            title="RCA pipeline"
            subtitle="Open investigations and actions."
          >
            <div className="space-y-2">
              {data.rca.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3 rounded-md px-2 py-2 hover:bg-[#f8fafc]"
                >
                  <div className="min-w-0">
                    <p className="truncate text-[12px] font-semibold">{item.asset}</p>
                    <p className="text-[10px] text-muted">
                      {item.id} · {item.method} · {item.owner}
                    </p>
                  </div>
                  <Badge tone={item.status === "Closed" ? "good" : item.status === "Verification" ? "info" : "warn"}>
                    {item.status}
                  </Badge>
                </div>
              ))}
            </div>
          </ChartCard>
        </Reveal>
      </div>

      <Reveal>
        <section className="card overflow-hidden">
          <div className="px-4 pt-4">
            <h2 className="text-[15px] font-semibold">Bad actors</h2>
            <p className="mt-1 text-[12px] text-muted">
              Ten assets ranked by estimated downtime cost.
            </p>
          </div>
          <div className="mt-3 overflow-x-auto">
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
                {data.badActors.map((actor) => (
                  <tr key={actor.asset} className="table-row border-b border-line/70">
                    <td className="px-4 py-2.5 font-medium">{actor.asset}</td>
                    <td className="px-3 py-2.5">
                      <Badge tone={actor.criticality === "A" ? "bad" : actor.criticality === "B" ? "warn" : "neutral"}>
                        {actor.criticality}
                      </Badge>
                    </td>
                    <td className="tabular px-3 py-2.5 text-right">{actor.failures}</td>
                    <td className="tabular px-3 py-2.5 text-right">{actor.downtime} h</td>
                    <td className="tabular px-4 py-2.5 text-right">{formatCurrency(actor.cost, true)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </Reveal>
    </div>
  );
}
