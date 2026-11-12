"use client";

import { useMemo } from "react";
import { Badge } from "@/components/badge";
import { ChartCard } from "@/components/chart-card";
import { EChart } from "@/components/e-chart";
import { StatCard } from "@/components/kpi-card";
import { MoreAnalysis } from "@/components/more-analysis";
import { Reveal } from "@/components/reveal";
import { TableScroller } from "@/components/table-scroller";
import type { PlantData } from "@/lib/data";
import { statusTone } from "@/lib/utils";

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

const severityRank: Record<string, number> = {
  Major: 0,
  Minor: 1,
  Observation: 2,
};

export function QualityDashboard({ data }: { data: PlantData }) {
  const openRca = data.rca.filter((item) => item.status !== "Closed").length;
  const openFindings = data.findings.filter((item) => item.status !== "Closed").length;
  const checklistAvg = Math.round(
    data.checklistCompletion.reduce((sum, item) => sum + item.value, 0) /
      data.checklistCompletion.length,
  );

  const findings = useMemo(
    () =>
      [...data.findings].sort(
        (a, b) =>
          (severityRank[a.severity] ?? 9) - (severityRank[b.severity] ?? 9) ||
          Number(a.status === "Closed") - Number(b.status === "Closed"),
      ),
    [data.findings],
  );

  const checklistOption = useMemo(
    () => ({
      grid: { left: 56, right: 10, top: 16, bottom: 6, containLabel: true },
      tooltip: { ...tooltip, trigger: "axis" },
      xAxis: { type: "value", min: 0, max: 100, ...axis },
      yAxis: {
        type: "category",
        data: data.checklistCompletion.map((item) => item.label),
        ...axis,
        splitLine: { show: false },
      },
      series: [
        {
          type: "bar",
          data: data.checklistCompletion.map((item) => ({
            value: item.value,
            itemStyle: {
              color:
                item.value >= 85 ? "#4fd1c5" : item.value >= 75 ? "#e8a33d" : "#f97066",
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
    [data.checklistCompletion],
  );

  return (
    <div className="space-y-4">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">
          RCA & quality
        </p>
        <h2 className="mt-1 text-[20px] font-semibold tracking-[-0.03em] sm:text-[24px]">
          Learning from failure
        </h2>
        <p className="measure mt-1 text-[12px] text-muted sm:text-[13px]">
          Investigations, corrective actions, checklist completion and data quality.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2.5 xl:grid-cols-4">
        {[
          {
            label: "Open RCA",
            value: String(openRca),
            hint: "Investigations or actions",
            tone: "warn" as const,
          },
          {
            label: "Open findings",
            value: String(openFindings),
            hint: "Audit and statutory",
            tone: "bad" as const,
          },
          {
            label: "Checklist completion",
            value: `${checklistAvg}%`,
            hint: "Mandatory items",
            tone: checklistAvg >= 85 ? ("good" as const) : ("warn" as const),
          },
          {
            label: "Data quality",
            value: `${data.dataQuality}%`,
            hint: "Completeness and validity",
            tone: data.dataQuality >= 90 ? ("good" as const) : ("warn" as const),
          },
        ].map((item, index) => (
          <Reveal key={item.label} delay={index * 0.03} className="h-full">
            <StatCard label={item.label} value={item.value} hint={item.hint} tone={item.tone} />
          </Reveal>
        ))}
      </div>

      <div className="grid gap-3 xl:grid-cols-2">
        <Reveal className="h-full">
          <section className="card h-full overflow-hidden">
            <div className="px-4 pt-3.5">
              <h2 className="text-[14px] font-semibold">RCA pipeline</h2>
              <p className="mt-0.5 text-[11px] text-muted">
                Root-cause investigations and action verification.
              </p>
            </div>
            <div className="mt-2 space-y-1 px-2 pb-2">
              {data.rca.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3 rounded-md px-2 py-2"
                >
                  <div className="min-w-0">
                    <p className="truncate text-[12px] font-semibold">{item.asset}</p>
                    <p className="text-[10px] text-muted">
                      {item.id} · {item.method} · {item.owner}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="tabular text-[11px] text-muted">{item.age} d</span>
                    <Badge tone={statusTone(item.status)}>{item.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        <Reveal delay={0.04} className="h-full">
          <section className="card h-full overflow-hidden">
            <div className="px-4 pt-3.5">
              <h2 className="text-[14px] font-semibold">Audit findings and CAPA</h2>
              <p className="mt-0.5 text-[11px] text-muted">
                Major first; statutory and internal findings with the action owner.
              </p>
            </div>
            <TableScroller label="Audit findings and CAPA table" className="mt-2.5">
              <table className="w-full min-w-[480px] text-left text-[12px]">
                <thead>
                  <tr className="border-y border-line text-[11px] text-muted">
                    <th className="px-3 py-2 font-semibold">Finding</th>
                    <th className="px-3 py-2 font-semibold">Severity</th>
                    <th className="px-3 py-2 font-semibold">Status</th>
                    <th className="px-3 py-2 font-semibold">Due</th>
                  </tr>
                </thead>
                <tbody>
                  {findings.map((finding) => (
                    <tr key={finding.id} className="table-row border-b border-line/70">
                      <td className="px-3 py-2.5 font-medium">{finding.source}</td>
                      <td className="px-3 py-2.5">
                        <Badge
                          tone={
                            finding.severity === "Major"
                              ? "bad"
                              : finding.severity === "Minor"
                                ? "warn"
                                : "info"
                          }
                        >
                          {finding.severity}
                        </Badge>
                      </td>
                      <td className="px-3 py-2.5">
                        <Badge tone={statusTone(finding.status)}>{finding.status}</Badge>
                      </td>
                      <td className="px-3 py-2.5 text-muted">{finding.due}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableScroller>
          </section>
        </Reveal>
      </div>

      <div className="card flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 text-[11px]">
        <span>
          <span className="font-semibold">Adapter status</span>
          <span className="ml-2 text-muted">
            S/4HANA implemented · ECC, Maximo and Oracle planned
          </span>
        </span>
        <Badge tone="info">Demo</Badge>
      </div>

      <MoreAnalysis count={1} label="Checklist detail">
        <ChartCard title="Checklist completion" subtitle="Mandatory items by department.">
          <EChart
            option={checklistOption}
            ariaLabel={`Checklist completion for ${data.plant.name}`}
          />
        </ChartCard>
      </MoreAnalysis>
    </div>
  );
}
