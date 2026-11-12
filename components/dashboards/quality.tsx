"use client";

import { useMemo } from "react";
import { Badge } from "@/components/badge";
import { ChartCard } from "@/components/chart-card";
import { EChart } from "@/components/e-chart";
import { Reveal } from "@/components/reveal";
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

export function QualityDashboard({ data }: { data: PlantData }) {
  const openRca = data.rca.filter((item) => item.status !== "Closed").length;
  const openFindings = data.findings.filter((item) => item.status !== "Closed").length;
  const checklistAvg = Math.round(
    data.checklistCompletion.reduce((sum, item) => sum + item.value, 0) /
      data.checklistCompletion.length,
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
              color: item.value >= 85 ? "#4fd1c5" : item.value >= 75 ? "#e8a33d" : "#f97066",
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

  const severityMix = [
    { label: "Major", value: data.findings.filter((item) => item.severity === "Major").length },
    { label: "Minor", value: data.findings.filter((item) => item.severity === "Minor").length },
    { label: "Observation", value: data.findings.filter((item) => item.severity === "Observation").length },
  ];

  const severityOption = useMemo(
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
          data: severityMix.map((item, index) => ({
            name: item.label,
            value: item.value,
            itemStyle: { color: ["#f97066", "#e8a33d", "#7fb0ff"][index] },
          })),
        },
      ],
      graphic: [
        {
          type: "text",
          left: "center",
          top: "38%",
          style: {
            text: String(data.findings.length),
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
            text: "FINDINGS",
            fill: "#8fa9b7",
            fontSize: 9,
            fontWeight: 600,
            textAlign: "center",
          },
        },
      ],
    }),
    [severityMix, data.findings.length],
  );

  return (
    <div className="space-y-5">
      <div>
        <p className="text-[11px] font-semibold text-muted">
          RCA & quality
        </p>
        <h2 className="mt-1 text-[24px] font-semibold tracking-[-0.03em]">
          Learning from failure
        </h2>
        <p className="measure mt-1 text-[13px] text-muted">
          Investigations, corrective actions, checklist completion and data quality.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Open RCA", value: String(openRca), hint: "Investigations or actions" },
          { label: "Open findings", value: String(openFindings), hint: "Audit and statutory" },
          { label: "Checklist completion", value: `${checklistAvg}%`, hint: "Mandatory items" },
          { label: "Data quality", value: `${data.dataQuality}%`, hint: "Completeness and validity" },
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
          <ChartCard title="Checklist completion" subtitle="Mandatory items by department.">
            <EChart option={checklistOption} ariaLabel={`Checklist completion for ${data.plant.name}`} />
          </ChartCard>
        </Reveal>
        <Reveal delay={0.05}>
          <ChartCard title="Findings by severity" subtitle="Open and closed audit findings.">
            <EChart option={severityOption} ariaLabel={`Findings by severity for ${data.plant.name}`} />
          </ChartCard>
        </Reveal>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Reveal>
          <section className="card overflow-hidden">
            <div className="px-4 pt-4">
              <h2 className="text-[15px] font-semibold">RCA pipeline</h2>
              <p className="mt-1 text-[12px] text-muted">
                Root-cause investigations and action verification.
              </p>
            </div>
            <div className="mt-3 space-y-1 px-2 pb-3">
              {data.rca.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3 rounded-md px-2 py-2 hover:bg-[rgba(234,242,246,0.05)]"
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

        <Reveal delay={0.05}>
          <section className="card overflow-hidden">
            <div className="px-4 pt-4">
              <h2 className="text-[15px] font-semibold">Audit findings and CAPA</h2>
              <p className="mt-1 text-[12px] text-muted">
                Statutory and internal findings with the corrective action owner.
              </p>
            </div>
            <div className="mt-3 overflow-x-auto">
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
                  {data.findings.map((finding) => (
                    <tr key={finding.id} className="table-row border-b border-line/70">
                      <td className="px-3 py-2.5 font-medium">{finding.source}</td>
                      <td className="px-3 py-2.5">
                        <Badge tone={finding.severity === "Major" ? "bad" : finding.severity === "Minor" ? "warn" : "info"}>
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
            </div>
          </section>
        </Reveal>
      </div>

      <Reveal>
        <div className="card flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-[12px]">
          <div>
            <span className="font-semibold">ERP sync health</span>
            <span className="ml-2 text-muted">{data.sapSyncHealth}</span>
          </div>
          <Badge tone={data.sapSyncHealth.includes("warning") ? "warn" : "good"}>
            {data.sapSyncHealth.includes("warning") ? "Attention" : "Healthy"}
          </Badge>
        </div>
      </Reveal>
    </div>
  );
}
