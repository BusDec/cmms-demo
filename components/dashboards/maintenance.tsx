"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/badge";
import { ChartCard } from "@/components/chart-card";
import { EChart } from "@/components/e-chart";
import { MoreAnalysis } from "@/components/more-analysis";
import { RangeTabs } from "@/components/range-tabs";
import { Reveal } from "@/components/reveal";
import { ScenarioSlider } from "@/components/scenario-slider";
import { StatCard } from "@/components/kpi-card";
import { TableScroller } from "@/components/table-scroller";
import type { PlantData } from "@/lib/data";
import { formatNumber, statusTone } from "@/lib/utils";

const axis = {
  axisLabel: { color: "#8fa9b7", fontSize: 11 },
  axisLine: { show: false },
  axisTick: { show: false },
  splitLine: { lineStyle: { color: "rgba(234,242,246,0.08)" } },
};

const tooltip = {
  backgroundColor: "#0d2638",
  borderWidth: 1,
  borderColor: "rgba(234,242,246,0.14)",
  textStyle: { color: "#eaf2f6", fontSize: 12 },
  padding: [8, 10],
};

const priorityRank: Record<string, number> = {
  Critical: 0,
  High: 1,
  Medium: 2,
  Low: 3,
};

export function MaintenanceDashboard({ data }: { data: PlantData }) {
  const [range, setRange] = useState(6);
  const [crewCapacity, setCrewCapacity] = useState(100);
  const monthly = useMemo(() => data.monthly.slice(-range), [data.monthly, range]);
  const latest = data.monthly[data.monthly.length - 1];
  const backlogTotal = data.backlog.reduce((sum, item) => sum + item.value, 0);
  const overdue = data.backlog[2].value + data.backlog[3].value;

  const crewRows = useMemo(
    () =>
      data.crewLoad.map((item) => ({
        label: item.label,
        value: Math.min(140, Math.round(item.value * (100 / crewCapacity))),
      })),
    [crewCapacity, data.crewLoad],
  );
  const overloaded = crewRows.filter((item) => item.value >= 100).length;
  const watch = crewRows.filter(
    (item) => item.value >= 85 && item.value < 100,
  ).length;

  const workOrders = useMemo(
    () =>
      [...data.workOrders].sort(
        (a, b) =>
          (priorityRank[a.priority] ?? 9) - (priorityRank[b.priority] ?? 9) ||
          b.age - a.age,
      ),
    [data.workOrders],
  );

  const pmOption = useMemo(
    () => ({
      grid: { left: 6, right: 10, top: 24, bottom: 6, containLabel: true },
      tooltip: { ...tooltip, trigger: "axis" },
      xAxis: {
        type: "category",
        data: monthly.map((point) => point.month),
        ...axis,
        splitLine: { show: false },
      },
      yAxis: {
        type: "value",
        min: 40,
        max: 100,
        ...axis,
        axisLabel: { color: "#8fa9b7", fontSize: 11, formatter: "{value}%" },
      },
      series: [
        {
          type: "line",
          name: "PM compliance",
          data: monthly.map((point) => point.pm),
          smooth: true,
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
              formatter: "target 85%",
              position: "insideStartTop",
              color: "#e8a33d",
              fontSize: 10,
            },
            data: [{ yAxis: 85 }],
          },
        },
      ],
    }),
    [monthly],
  );

  const backlogOption = useMemo(
    () => ({
      grid: { left: 6, right: 10, top: 16, bottom: 6, containLabel: true },
      tooltip: { ...tooltip, trigger: "axis" },
      xAxis: {
        type: "category",
        data: data.backlog.map((item) => item.label),
        ...axis,
        splitLine: { show: false },
        axisLabel: {
          color: "#8fa9b7",
          fontSize: 10,
          interval: 0,
          rotate: 20,
        },
      },
      yAxis: { type: "value", ...axis },
      series: [
        {
          type: "bar",
          data: data.backlog.map((item, index) => ({
            value: item.value,
            itemStyle: {
              color: ["#4fd1c5", "#7fb0ff", "#e8a33d", "#f97066"][index],
              borderRadius: [4, 4, 0, 0],
            },
          })),
          barMaxWidth: 42,
        },
      ],
    }),
    [data.backlog],
  );

  const crewOption = useMemo(
    () => ({
      grid: { left: 56, right: 10, top: 16, bottom: 6, containLabel: true },
      tooltip: { ...tooltip, trigger: "axis" },
      xAxis: { type: "value", min: 0, max: 120, ...axis },
      yAxis: {
        type: "category",
        data: crewRows.map((item) => item.label),
        ...axis,
        splitLine: { show: false },
      },
      series: [
        {
          type: "bar",
          data: crewRows.map((item) => ({
            value: item.value,
            itemStyle: {
              color:
                item.value >= 100
                  ? "#f97066"
                  : item.value >= 85
                    ? "#e8a33d"
                    : "#7fb0ff",
              borderRadius: [0, 4, 4, 0],
            },
          })),
          barMaxWidth: 18,
          label: {
            show: true,
            position: "right",
            formatter: "{c}%",
            color: "#8fa9b7",
            fontSize: 10,
          },
        },
      ],
    }),
    [crewRows],
  );

  const pipeline = [
    { label: "Planned", value: data.workOrders.filter((wo) => wo.status === "Planned").length },
    { label: "Awaiting permit", value: data.workOrders.filter((wo) => wo.status === "Awaiting permit").length },
    { label: "In progress", value: data.workOrders.filter((wo) => wo.status === "In progress").length },
    { label: "On hold", value: data.workOrders.filter((wo) => wo.status === "On hold" || wo.status === "Awaiting material").length },
  ];

  const pipelineOption = useMemo(
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
          data: pipeline.map((item, index) => ({
            name: item.label,
            value: item.value,
            itemStyle: { color: ["#7fb0ff", "#e8a33d", "#4fd1c5", "#8fa9b7"][index] },
          })),
        },
      ],
      graphic: [
        {
          type: "text",
          left: "center",
          top: "38%",
          style: {
            text: String(data.workOrders.length),
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
            text: "WOs",
            fill: "#8fa9b7",
            fontSize: 10,
            fontWeight: 600,
            textAlign: "center",
          },
        },
      ],
    }),
    [pipeline, data.workOrders.length],
  );

  return (
    <div className="space-y-4">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">
          Maintenance
        </p>
        <h2 className="mt-1 text-[20px] font-semibold tracking-[-0.03em] sm:text-[24px]">
          Planning and execution
        </h2>
        <p className="measure mt-1 text-[12px] text-muted sm:text-[13px]">
          PM due dates, backlog ageing and the work-order pipeline for this plant.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2.5 xl:grid-cols-4">
        {[
          {
            label: "PM compliance",
            value: `${formatNumber(latest.pm, 1)}%`,
            hint: "Completed by due date · target 85%",
            tone: latest.pm >= 85 ? ("good" as const) : latest.pm >= 70 ? ("warn" as const) : ("bad" as const),
          },
          {
            label: "Backlog",
            value: `${backlogTotal}`,
            hint: "Open PM and corrective items",
            tone: "warn" as const,
          },
          {
            label: "Overdue > 30 days",
            value: `${overdue}`,
            hint: "Needs a planner decision",
            tone: "bad" as const,
          },
          {
            label: "Material readiness",
            value: `${data.materialReadiness}%`,
            hint: "WO material lines ready",
            tone: data.materialReadiness >= 85 ? ("good" as const) : ("warn" as const),
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
            title="PM compliance trend"
            subtitle="Completed by due date; target 85%."
            action={<RangeTabs value={range} onChange={setRange} />}
          >
            <EChart
              option={pmOption}
              ariaLabel={`PM compliance trend for ${data.plant.name}`}
              fill
            />
          </ChartCard>
        </Reveal>
        <Reveal delay={0.04} className="h-full">
          <ChartCard
            title="Crew load"
            subtitle="Planned hours as a share of available hours this week."
            footer={
              <ScenarioSlider
                label="Available crew hours"
                value={crewCapacity}
                min={80}
                max={120}
                display={`${crewCapacity}%`}
                minLabel="80%"
                maxLabel="120%"
                onChange={setCrewCapacity}
                readout={
                  <>
                    <span className={cnTone(overloaded > 0)}>
                      {overloaded} {overloaded === 1 ? "crew" : "crews"} at or above 100%
                    </span>
                    <span className="text-muted"> · {watch} more above 85%</span>
                  </>
                }
              />
            }
          >
            <EChart option={crewOption} ariaLabel={`Crew load for ${data.plant.name} at ${crewCapacity} percent available hours`} />
          </ChartCard>
        </Reveal>
      </div>

      <Reveal>
        <section className="card overflow-hidden">
          <div className="px-4 pt-3.5">
            <h2 className="text-[14px] font-semibold">Work orders needing attention</h2>
            <p className="mt-0.5 text-[11px] text-muted">
              Critical first, then oldest open work.
            </p>
          </div>
          <TableScroller label="Work orders needing attention" className="mt-2.5">
            <table className="w-full min-w-[760px] text-left text-[12px]">
              <thead>
                <tr className="border-y border-line text-[11px] text-muted">
                  <th className="px-4 py-2 font-semibold">Work order</th>
                  <th className="px-3 py-2 font-semibold">Asset</th>
                  <th className="px-3 py-2 font-semibold">Description</th>
                  <th className="px-3 py-2 font-semibold">Status</th>
                  <th className="px-3 py-2 font-semibold">Priority</th>
                  <th className="px-3 py-2 text-right font-semibold">Age</th>
                  <th className="px-4 py-2 font-semibold">Owner</th>
                </tr>
              </thead>
              <tbody>
                {workOrders.map((wo) => (
                  <tr key={wo.id} className="table-row border-b border-line/70">
                    <td className="px-4 py-2.5 font-semibold">{wo.id}</td>
                    <td className="px-3 py-2.5">{wo.asset}</td>
                    <td className="px-3 py-2.5 text-muted">{wo.description}</td>
                    <td className="px-3 py-2.5">
                      <Badge tone={statusTone(wo.status)}>{wo.status}</Badge>
                    </td>
                    <td className="px-3 py-2.5">
                      <Badge
                        tone={
                          wo.priority === "Critical"
                            ? "bad"
                            : wo.priority === "High"
                              ? "warn"
                              : "neutral"
                        }
                      >
                        {wo.priority}
                      </Badge>
                    </td>
                    <td className="tabular px-3 py-2.5 text-right">{wo.age} d</td>
                    <td className="px-4 py-2.5 text-muted">{wo.owner}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableScroller>
        </section>
      </Reveal>

      <MoreAnalysis count={2} label="Backlog detail">
        <div className="grid gap-3 xl:grid-cols-2">
          <ChartCard
            title="Backlog ageing"
            subtitle="Current open items by age bucket."
          >
            <EChart option={backlogOption} ariaLabel={`Backlog ageing for ${data.plant.name}`} />
          </ChartCard>
          <ChartCard
            title="Work-order pipeline"
            subtitle="Current work orders by execution state."
          >
            <EChart
              option={pipelineOption}
              ariaLabel={`Work order pipeline for ${data.plant.name}`}
            />
          </ChartCard>
        </div>
      </MoreAnalysis>
    </div>
  );
}

function cnTone(bad: boolean) {
  return bad ? "font-semibold text-bad" : "font-semibold text-good";
}
