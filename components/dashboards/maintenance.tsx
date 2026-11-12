"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/badge";
import { ChartCard } from "@/components/chart-card";
import { EChart } from "@/components/e-chart";
import { RangeTabs } from "@/components/range-tabs";
import { Reveal } from "@/components/reveal";
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

export function MaintenanceDashboard({ data }: { data: PlantData }) {
  const [range, setRange] = useState(6);
  const monthly = useMemo(() => data.monthly.slice(-range), [data.monthly, range]);
  const latest = data.monthly[data.monthly.length - 1];
  const backlogTotal = data.backlog.reduce((sum, item) => sum + item.value, 0);
  const overdue = data.backlog[2].value + data.backlog[3].value;

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
            label: { formatter: "target 85%", position: "insideStartTop", color: "#e8a33d", fontSize: 10 },
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
      xAxis: { type: "value", min: 0, max: 100, ...axis },
      yAxis: {
        type: "category",
        data: data.crewLoad.map((item) => item.label),
        ...axis,
        splitLine: { show: false },
      },
      series: [
        {
          type: "bar",
          data: data.crewLoad.map((item) => ({
            value: item.value,
            itemStyle: {
              color: item.value >= 80 ? "#e8a33d" : "#7fb0ff",
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
    [data.crewLoad],
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
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold text-muted">
            Maintenance
          </p>
          <h2 className="mt-1 text-[24px] font-semibold tracking-[-0.03em]">
            Planning and execution
          </h2>
          <p className="measure mt-1 text-[13px] text-muted">
            PM due dates, backlog ageing and the work-order pipeline for this plant.
          </p>
        </div>
        <RangeTabs value={range} onChange={setRange} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "PM compliance", value: `${formatNumber(latest.pm, 1)}%`, hint: "Completed by due date" },
          { label: "Backlog", value: `${backlogTotal}`, hint: "Open PM and corrective items" },
          { label: "Overdue > 30 days", value: `${overdue}`, hint: "Needs a planner decision" },
          { label: "Material readiness", value: `${data.materialReadiness}%`, hint: "WO material lines ready" },
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
            title="PM compliance trend"
            subtitle="Completed by due date; target 85%."
          >
            <EChart option={pmOption} ariaLabel={`PM compliance trend for ${data.plant.name}`} />
          </ChartCard>
        </Reveal>
        <Reveal delay={0.05}>
          <ChartCard
            title="Backlog ageing"
            subtitle="Open items by age bucket."
          >
            <EChart option={backlogOption} ariaLabel={`Backlog ageing for ${data.plant.name}`} />
          </ChartCard>
        </Reveal>
        <Reveal>
          <ChartCard
            title="Crew load"
            subtitle="Planned hours as a share of available hours this week."
          >
            <EChart option={crewOption} ariaLabel={`Crew load for ${data.plant.name}`} />
          </ChartCard>
        </Reveal>
        <Reveal delay={0.05}>
          <ChartCard
            title="Work-order pipeline"
            subtitle="Current work orders by execution state."
          >
            <EChart option={pipelineOption} ariaLabel={`Work order pipeline for ${data.plant.name}`} />
          </ChartCard>
        </Reveal>
      </div>

      <Reveal>
        <section className="card overflow-hidden">
          <div className="px-4 pt-4">
            <h2 className="text-[15px] font-semibold">Work orders needing attention</h2>
            <p className="mt-1 text-[12px] text-muted">
              Highest priority and oldest open work.
            </p>
          </div>
          <div className="mt-3 overflow-x-auto">
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
                {data.workOrders.map((wo) => (
                  <tr key={wo.id} className="table-row border-b border-line/70">
                    <td className="px-4 py-2.5 font-semibold">{wo.id}</td>
                    <td className="px-3 py-2.5">{wo.asset}</td>
                    <td className="px-3 py-2.5 text-muted">{wo.description}</td>
                    <td className="px-3 py-2.5">
                      <Badge tone={statusTone(wo.status)}>{wo.status}</Badge>
                    </td>
                    <td className="px-3 py-2.5">
                      <Badge tone={wo.priority === "Critical" ? "bad" : wo.priority === "High" ? "warn" : "neutral"}>
                        {wo.priority}
                      </Badge>
                    </td>
                    <td className="tabular px-3 py-2.5 text-right">{wo.age} d</td>
                    <td className="px-4 py-2.5 text-muted">{wo.owner}</td>
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
