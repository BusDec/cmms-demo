"use client";

import { useMemo, useState } from "react";
import { ChartCard } from "@/components/chart-card";
import { EChart } from "@/components/e-chart";
import { StatCard } from "@/components/kpi-card";
import { RangeTabs } from "@/components/range-tabs";
import { Reveal } from "@/components/reveal";
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

const generation: Record<string, number> = {
  coal: 9_800_000,
  thermal: 11_200_000,
  wind: 520_000,
  gas: 2_900_000,
};

export function CostDashboard({ data }: { data: PlantData }) {
  const [range, setRange] = useState(6);
  const monthly = useMemo(() => data.monthly.slice(-range), [data.monthly, range]);
  const annualCost = data.monthly.reduce((sum, point) => sum + point.cost, 0);
  const costPctRav = (annualCost / data.plant.rav) * 100;
  const costPerMwh = annualCost / (generation[data.plant.slug] ?? 1);
  const sparesShare = Math.round(
    ((data.costBreakdown.find((item) => item.label === "Spares")?.value ?? 0) /
      annualCost) *
      100,
  );

  const costOption = useMemo(
    () => ({
      grid: { left: 6, right: 10, top: 20, bottom: 6, containLabel: true },
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
          color: "#8fa9b7",
          fontSize: 11,
          formatter: compactMoney,
        },
      },
      series: [
        {
          type: "bar",
          data: monthly.map((point) => point.cost),
          itemStyle: { color: "#4fd1c5", borderRadius: [4, 4, 0, 0] },
          barMaxWidth: 44,
          label: {
            show: true,
            position: "top",
            formatter: (params: { value: number }) => compactMoney(params.value),
            color: "#8fa9b7",
            fontSize: 10,
          },
        },
      ],
    }),
    [monthly],
  );

  return (
    <div className="space-y-4">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">
          Cost & resources
        </p>
        <h2 className="mt-1 text-[20px] font-semibold tracking-[-0.03em] sm:text-[24px]">
          Maintenance economics
        </h2>
        <p className="measure mt-1 text-[12px] text-muted sm:text-[13px]">
          Spend against replacement value, cost per work order and the manpower,
          spares and contractor split.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2.5 xl:grid-cols-4">
        {[
          {
            label: "12-month cost",
            value: formatCurrency(annualCost, true),
            hint: "Manpower, spares and services",
            tone: "info" as const,
          },
          {
            label: "Cost / RAV",
            value: `${formatNumber(costPctRav, 2)}%`,
            hint: `RAV ${formatCurrency(data.plant.rav, true)}`,
            tone: costPctRav <= 2.4 ? ("good" as const) : ("warn" as const),
          },
          {
            label: "Cost / MWh",
            value: `SAR ${formatNumber(costPerMwh, 1)}`,
            hint: "Estimated generation",
            tone: "neutral" as const,
          },
          {
            label: "Spares share",
            value: `${sparesShare}%`,
            hint: "Of total maintenance spend",
            tone: "info" as const,
          },
        ].map((item, index) => (
          <Reveal key={item.label} delay={index * 0.03} className="h-full">
            <StatCard label={item.label} value={item.value} hint={item.hint} tone={item.tone} />
          </Reveal>
        ))}
      </div>

      <Reveal>
        <ChartCard
          title="Monthly maintenance cost"
          subtitle="Actual spend; the full product adds budget variance by cost centre."
          action={<RangeTabs value={range} onChange={setRange} />}
        >
          <EChart
            option={costOption}
            ariaLabel={`Monthly maintenance cost for ${data.plant.name}`}
          />
        </ChartCard>
      </Reveal>

      <Reveal>
        <section className="card overflow-hidden">
          <div className="px-4 pt-3.5">
            <h2 className="text-[14px] font-semibold">Cost lines</h2>
            <p className="mt-0.5 text-[11px] text-muted">
              Synthetic values for the demo; the product reads the same fields from ERP
              cost centres and confirmations.
            </p>
          </div>
          <TableScroller label="Cost lines table" className="mt-2.5">
            <table className="w-full min-w-[620px] text-left text-[12px]">
              <thead>
                <tr className="border-y border-line text-[11px] text-muted">
                  <th className="px-4 py-2 font-semibold">Category</th>
                  <th className="px-3 py-2 text-right font-semibold">12-month cost</th>
                  <th className="px-3 py-2 text-right font-semibold">Share</th>
                  <th className="px-4 py-2 font-semibold">Source</th>
                </tr>
              </thead>
              <tbody>
                {data.costBreakdown.map((item) => (
                  <tr key={item.label} className="table-row border-b border-line/70">
                    <td className="px-4 py-2.5 font-medium">{item.label}</td>
                    <td className="tabular px-3 py-2.5 text-right">
                      {formatCurrency(item.value, true)}
                    </td>
                    <td className="tabular px-3 py-2.5 text-right">
                      {Math.round((item.value / annualCost) * 100)}%
                    </td>
                    <td className="px-4 py-2.5 text-muted">
                      {item.label === "Spares"
                        ? "Inventory & material documents"
                        : "Work orders & confirmations"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableScroller>
        </section>
      </Reveal>
    </div>
  );
}
