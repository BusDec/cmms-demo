"use client";

import { useMemo, useState } from "react";
import { ChartCard } from "@/components/chart-card";
import { EChart } from "@/components/e-chart";
import { RangeTabs } from "@/components/range-tabs";
import { Reveal } from "@/components/reveal";
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
    (data.costBreakdown.find((item) => item.label === "Spares")?.value ?? 0) /
      annualCost *
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
          barMaxWidth: 30,
        },
      ],
    }),
    [monthly],
  );

  const mixOption = useMemo(
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
          radius: ["56%", "76%"],
          center: ["50%", "44%"],
          label: { show: false },
          data: data.costBreakdown.map((item, index) => ({
            name: item.label,
            value: item.value,
            itemStyle: {
              color: ["#7fb0ff", "#4fd1c5", "#e8a33d", "#8fa9b7"][index],
            },
          })),
        },
      ],
      graphic: [
        {
          type: "text",
          left: "center",
          top: "36%",
          style: {
            text: formatCurrency(annualCost, true),
            fill: "#eaf2f6",
            fontSize: 18,
            fontWeight: 600,
            textAlign: "center",
          },
        },
        {
          type: "text",
          left: "center",
          top: "46%",
          style: {
            text: "12 MONTHS",
            fill: "#8fa9b7",
            fontSize: 9,
            fontWeight: 600,
            textAlign: "center",
          },
        },
      ],
    }),
    [data.costBreakdown, annualCost],
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold text-muted">
            Cost & resources
          </p>
          <h2 className="mt-1 text-[24px] font-semibold tracking-[-0.03em]">
            Maintenance economics
          </h2>
          <p className="measure mt-1 text-[13px] text-muted">
            Spend against replacement value, cost per work order and the manpower,
            spares and contractor split.
          </p>
        </div>
        <RangeTabs value={range} onChange={setRange} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "12-month cost", value: formatCurrency(annualCost, true), hint: "Manpower, spares and services" },
          { label: "Cost / RAV", value: `${formatNumber(costPctRav, 2)}%`, hint: `RAV ${formatCurrency(data.plant.rav, true)}` },
          { label: "Cost / MWh", value: `SAR ${formatNumber(costPerMwh, 1)}`, hint: "Estimated generation" },
          { label: "Spares share", value: `${sparesShare}%`, hint: "Of total maintenance spend" },
        ].map((item, index) => (
          <Reveal key={item.label} delay={index * 0.04}>
            <div className="card px-4 py-4">
              <p className="text-[12px] font-semibold text-muted">{item.label}</p>
              <p className="stat-value mt-2 text-[28px] font-semibold">{item.value}</p>
              <p className="mt-2 text-[11px] text-muted">{item.hint}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.45fr_1fr]">
        <Reveal>
          <ChartCard
            title="Monthly maintenance cost"
            subtitle="Actual spend; the full product adds budget variance by cost centre."
          >
            <EChart option={costOption} ariaLabel={`Monthly maintenance cost for ${data.plant.name}`} />
          </ChartCard>
        </Reveal>
        <Reveal delay={0.05}>
          <ChartCard title="Cost mix" subtitle="12-month split by category.">
            <EChart option={mixOption} ariaLabel={`Cost mix for ${data.plant.name}`} />
          </ChartCard>
        </Reveal>
      </div>

      <Reveal>
        <section className="card overflow-hidden">
          <div className="px-4 pt-4">
            <h2 className="text-[15px] font-semibold">Cost lines</h2>
            <p className="mt-1 text-[12px] text-muted">
              Synthetic values for the demo; the product reads the same fields from
              ERP cost centres and confirmations.
            </p>
          </div>
          <div className="mt-3 overflow-x-auto">
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
                    <td className="tabular px-3 py-2.5 text-right">{formatCurrency(item.value, true)}</td>
                    <td className="tabular px-3 py-2.5 text-right">
                      {Math.round((item.value / annualCost) * 100)}%
                    </td>
                    <td className="px-4 py-2.5 text-muted">
                      {item.label === "Spares" ? "Inventory & material documents" : "Work orders & confirmations"}
                    </td>
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
