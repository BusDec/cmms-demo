"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/badge";
import { ChartCard } from "@/components/chart-card";
import { EChart } from "@/components/e-chart";
import { StatCard } from "@/components/kpi-card";
import { MoreAnalysis } from "@/components/more-analysis";
import { Reveal } from "@/components/reveal";
import { ScenarioSlider } from "@/components/scenario-slider";
import { TableScroller } from "@/components/table-scroller";
import type { PlantData } from "@/lib/data";
import { statusTone } from "@/lib/utils";

const tooltip = {
  backgroundColor: "#0d2638",
  borderWidth: 1,
  borderColor: "rgba(234,242,246,0.14)",
  textStyle: { color: "#eaf2f6", fontSize: 12 },
  padding: [8, 10],
};

const permitRank: Record<string, number> = {
  Overdue: 0,
  Active: 1,
  "Awaiting return": 2,
};

export function PermitsDashboard({ data }: { data: PlantData }) {
  const [minAge, setMinAge] = useState(0);
  const active = data.permits.filter((permit) => permit.status === "Active").length;
  const overdue = data.permits.filter((permit) => permit.status === "Overdue").length;
  const awaitingReturn = data.permits.filter(
    (permit) => permit.status === "Awaiting return",
  ).length;
  const cycle = data.permitCycle.reduce((sum, item) => sum + item.value, 0);

  const filtered = useMemo(
    () =>
      [...data.permits]
        .filter((permit) => permit.age >= minAge)
        .sort(
          (a, b) =>
            (permitRank[a.status] ?? 9) - (permitRank[b.status] ?? 9) ||
            b.age - a.age,
        ),
    [data.permits, minAge],
  );
  const oldest = filtered.reduce((max, permit) => Math.max(max, permit.age), 0);

  const cycleOption = useMemo(
    () => ({
      grid: { left: 6, right: 10, top: 16, bottom: 6, containLabel: true },
      tooltip: { ...tooltip, trigger: "axis" },
      xAxis: {
        type: "category",
        data: data.permitCycle.map((item) => item.label),
        axisLabel: { color: "#8fa9b7", fontSize: 11 },
        axisLine: { show: false },
        axisTick: { show: false },
      },
      yAxis: {
        type: "value",
        axisLabel: { color: "#8fa9b7", fontSize: 11, formatter: "{value}h" },
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { lineStyle: { color: "rgba(234,242,246,0.08)" } },
      },
      series: [
        {
          type: "bar",
          data: data.permitCycle.map((item, index) => ({
            value: item.value,
            itemStyle: {
              color: ["#7fb0ff", "#4fd1c5", "#e8a33d", "#8fa9b7"][index],
              borderRadius: [4, 4, 0, 0],
            },
          })),
          barMaxWidth: 38,
          label: {
            show: true,
            position: "top",
            formatter: "{c}h",
            color: "#8fa9b7",
            fontSize: 10,
          },
        },
      ],
    }),
    [data.permitCycle],
  );

  return (
    <div className="space-y-4">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">
          Permits & safety
        </p>
        <h2 className="mt-1 text-[20px] font-semibold tracking-[-0.03em] sm:text-[24px]">
          Permit to work
        </h2>
        <p className="measure mt-1 text-[12px] text-muted sm:text-[13px]">
          Open permits, status and the issue-to-closure cycle.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2.5 xl:grid-cols-4">
        {[
          {
            label: "Active permits",
            value: String(active),
            hint: "Issued and in the field",
            tone: "good" as const,
          },
          {
            label: "Overdue",
            value: String(overdue),
            hint: "Past the planned return time",
            tone: "bad" as const,
          },
          {
            label: "Awaiting return",
            value: String(awaitingReturn),
            hint: "Work finished, permit open",
            tone: "warn" as const,
          },
          {
            label: "Average cycle",
            value: `${cycle.toFixed(1)} h`,
            hint: "Issue to closure",
            tone: "info" as const,
          },
        ].map((item, index) => (
          <Reveal key={item.label} delay={index * 0.03} className="h-full">
            <StatCard label={item.label} value={item.value} hint={item.hint} tone={item.tone} />
          </Reveal>
        ))}
      </div>

      <Reveal>
        <section className="card overflow-hidden">
          <div className="px-4 pt-3.5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-[14px] font-semibold">Open permits</h2>
              <span className="tabular text-[11px] text-muted">
                {filtered.length} of {data.permits.length} permits
              </span>
            </div>
            <p className="mt-0.5 text-[11px] text-muted">
              Overdue first, then oldest open permits. Filter by age; swipe the table
              for all columns.
            </p>
          </div>
          <div className="mt-2.5 px-4">
            <ScenarioSlider
              label="Open at least"
              value={minAge}
              min={0}
              max={14}
              display={`${minAge} days`}
              minLabel="0 days"
              maxLabel="14+ days"
              onChange={setMinAge}
              readout={
                filtered.length > 0 ? (
                  <>
                    <span className="font-semibold text-ink">
                      {filtered.length} {filtered.length === 1 ? "permit" : "permits"}
                    </span>
                    <span className="text-muted"> · oldest {oldest} days</span>
                  </>
                ) : (
                  <span className="font-semibold text-ink">No permits at this age</span>
                )
              }
              footnote="Filter · updates the table below"
            />
          </div>
          <TableScroller label="Open permits table" className="mt-3">
            <table className="w-full min-w-[720px] text-left text-[12px]">
              <thead>
                <tr className="border-y border-line text-[11px] text-muted">
                  <th className="px-4 py-2 font-semibold">Permit</th>
                  <th className="px-3 py-2 font-semibold">Asset</th>
                  <th className="px-3 py-2 font-semibold">Type</th>
                  <th className="px-3 py-2 font-semibold">Status</th>
                  <th className="px-3 py-2 text-right font-semibold">Age</th>
                  <th className="px-4 py-2 font-semibold">Issued by</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((permit) => (
                  <tr key={permit.id} className="table-row border-b border-line/70">
                    <td className="px-4 py-2.5 font-semibold">{permit.id}</td>
                    <td className="px-3 py-2.5">{permit.asset}</td>
                    <td className="px-3 py-2.5 text-muted">{permit.type}</td>
                    <td className="px-3 py-2.5">
                      <Badge tone={statusTone(permit.status)}>{permit.status}</Badge>
                    </td>
                    <td className="tabular px-3 py-2.5 text-right">{permit.age} d</td>
                    <td className="px-4 py-2.5 text-muted">{permit.owner}</td>
                  </tr>
                ))}
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-[12px] text-muted">
                      No permit has been open for {minAge} days. Lower the filter to see
                      the rest of the queue.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </TableScroller>
        </section>
      </Reveal>

      <MoreAnalysis count={1} label="Cycle detail">
        <ChartCard title="Cycle time" subtitle="Average hours per stage.">
          <EChart
            option={cycleOption}
            ariaLabel={`Permit cycle time for ${data.plant.name}`}
          />
        </ChartCard>
      </MoreAnalysis>
    </div>
  );
}
