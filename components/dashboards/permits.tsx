"use client";

import { useMemo } from "react";
import { Badge } from "@/components/badge";
import { ChartCard } from "@/components/chart-card";
import { EChart } from "@/components/e-chart";
import { Reveal } from "@/components/reveal";
import type { PlantData } from "@/lib/data";
import { statusTone } from "@/lib/utils";

const tooltip = {
  backgroundColor: "#0d2638",
  borderWidth: 1,
  borderColor: "rgba(234,242,246,0.14)",
  textStyle: { color: "#eaf2f6", fontSize: 12 },
  padding: [8, 10],
};

export function PermitsDashboard({ data }: { data: PlantData }) {
  const active = data.permits.filter((permit) => permit.status === "Active").length;
  const overdue = data.permits.filter((permit) => permit.status === "Overdue").length;
  const awaitingReturn = data.permits.filter((permit) => permit.status === "Awaiting return").length;
  const cycle = data.permitCycle.reduce((sum, item) => sum + item.value, 0);

  const typeMix = useMemo(() => {
    const counts = new Map<string, number>();
    data.permits.forEach((permit) => {
      counts.set(permit.type, (counts.get(permit.type) ?? 0) + 1);
    });
    return Array.from(counts.entries()).map(([label, value]) => ({ label, value }));
  }, [data.permits]);

  const typeOption = useMemo(
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
          data: typeMix.map((item, index) => ({
            name: item.label,
            value: item.value,
            itemStyle: {
              color: ["#e8a33d", "#7fb0ff", "#4fd1c5", "#f97066", "#8fa9b7", "#8fa9b7"][index],
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
            text: String(data.permits.length),
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
            text: "PERMITS",
            fill: "#8fa9b7",
            fontSize: 9,
            fontWeight: 600,
            textAlign: "center",
          },
        },
      ],
    }),
    [typeMix, data.permits.length],
  );

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
    <div className="space-y-5">
      <div>
        <p className="text-[11px] font-semibold text-muted">
          Permits & safety
        </p>
        <h2 className="mt-1 text-[24px] font-semibold tracking-[-0.03em]">
          Permit to work
        </h2>
        <p className="measure mt-1 text-[13px] text-muted">
          Live permits, isolation status and the issue-to-closure cycle.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Active permits", value: String(active), hint: "Issued and in the field" },
          { label: "Overdue", value: String(overdue), hint: "Past the planned return time" },
          { label: "Awaiting return", value: String(awaitingReturn), hint: "Work finished, permit open" },
          { label: "Average cycle", value: `${cycle.toFixed(1)} h`, hint: "Issue to closure" },
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

      <div className="grid gap-4 xl:grid-cols-2">
        <Reveal>
          <ChartCard title="Permit mix" subtitle="Open permits by type.">
            <EChart option={typeOption} ariaLabel={`Permit mix for ${data.plant.name}`} />
          </ChartCard>
        </Reveal>
        <Reveal delay={0.05}>
          <ChartCard title="Cycle time" subtitle="Average hours per stage.">
            <EChart option={cycleOption} ariaLabel={`Permit cycle time for ${data.plant.name}`} />
          </ChartCard>
        </Reveal>
      </div>

      <Reveal>
        <section className="card overflow-hidden">
          <div className="px-4 pt-4">
            <h2 className="text-[15px] font-semibold">Open permits</h2>
            <p className="mt-1 text-[12px] text-muted">
              Oldest and highest-risk permits first.
            </p>
          </div>
          <div className="mt-3 overflow-x-auto">
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
                {data.permits.map((permit) => (
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
              </tbody>
            </table>
          </div>
        </section>
      </Reveal>
    </div>
  );
}
