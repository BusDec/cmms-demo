"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Check, Network } from "lucide-react";
import { Badge } from "@/components/badge";
import { StatCard } from "@/components/kpi-card";
import { TableScroller } from "@/components/table-scroller";
import {
  BUSINESS_AREAS,
  COMPANIES,
  COMPANY_CODES,
  CONTROLLING_AREAS,
  ENTERPRISE_OBJECTS,
  PLANTS,
  PURCHASING_ORGS,
  SALES_ORGS,
  SAP_SYSTEMS,
  countStorageLocations,
  getSystem,
  inView,
  type LandscapeView,
  type SapSystem,
  type SapSystemId,
} from "@/lib/landscape";
import { cn, formatNumber } from "@/lib/utils";

const viewOptions: { value: LandscapeView; label: string }[] = [
  { value: "all", label: "Combined landscape" },
  { value: "hana", label: "SAP S/4HANA" },
  { value: "r3", label: "SAP ECC R/3" },
];

function objectCount(object: string, system: SapSystemId) {
  switch (object) {
    case "Company":
      return COMPANIES.length;
    case "Company code":
      return COMPANY_CODES.filter((company) => company.system === system).length;
    case "Plant":
      return PLANTS.filter((plant) => plant.system === system).length;
    case "Business area":
      return BUSINESS_AREAS.filter((area) => area.system === system).length;
    case "Controlling area":
      return CONTROLLING_AREAS.filter((area) => area.system === system).length;
    case "Sales organization":
      return SALES_ORGS.filter((org) => org.system === system).length;
    case "Purchasing organization":
      return PURCHASING_ORGS.filter((org) => org.system === system).length;
    case "Storage location":
      return PLANTS.filter((plant) => plant.system === system).reduce(
        (total, plant) => total + plant.storageLocations,
        0,
      );
    default:
      return 0;
  }
}

function sortByCode<T extends { code: string }>(items: T[]) {
  return [...items].sort((a, b) => a.code.localeCompare(b.code));
}

function systemTone(system: SapSystem) {
  return system.status === "Strategic" ? ("good" as const) : ("neutral" as const);
}

function SystemCard({
  system,
  active,
  onClick,
}: {
  system: SapSystem;
  active: boolean;
  onClick: () => void;
}) {
  const companies = COMPANY_CODES.filter((company) => company.system === system.id).length;
  const plants = PLANTS.filter((plant) => plant.system === system.id).length;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "w-full rounded-xl border px-4 py-4 text-left transition-colors",
        active
          ? "border-[var(--warn)] bg-[var(--panel)]"
          : "border-line bg-surface hover:bg-[var(--panel)]",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[14px] font-semibold">{system.name}</p>
          <p className="mt-1 text-[11px] text-muted">
            {system.release} · {system.database}
          </p>
        </div>
        <Badge tone={systemTone(system)}>{system.status}</Badge>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 border-t border-line pt-3">
        <div>
          <p className="tabular text-[16px] font-semibold">{companies}</p>
          <p className="text-[10px] text-muted">company codes</p>
        </div>
        <div>
          <p className="tabular text-[16px] font-semibold">{plants}</p>
          <p className="text-[10px] text-muted">plants</p>
        </div>
        <div>
          <p className="tabular text-[16px] font-semibold">{system.client}</p>
          <p className="text-[10px] text-muted">client</p>
        </div>
      </div>
      <p className="mt-2 text-[10px] leading-snug text-muted">{system.note}</p>
    </button>
  );
}

export function LandscapeDashboard() {
  const [view, setView] = useState<LandscapeView>("all");

  const companyCodes = useMemo(() => sortByCode(inView(COMPANY_CODES, view)), [view]);
  const plants = useMemo(() => sortByCode(inView(PLANTS, view)), [view]);
  const businessAreas = useMemo(() => sortByCode(inView(BUSINESS_AREAS, view)), [view]);
  const controllingAreas = useMemo(
    () => sortByCode(inView(CONTROLLING_AREAS, view)),
    [view],
  );
  const salesOrgs = useMemo(() => sortByCode(inView(SALES_ORGS, view)), [view]);
  const purchasingOrgs = useMemo(() => sortByCode(inView(PURCHASING_ORGS, view)), [view]);
  const visibleSystems = useMemo(
    () => (view === "all" ? SAP_SYSTEMS : SAP_SYSTEMS.filter((system) => system.id === view)),
    [view],
  );
  const storageLocations = countStorageLocations(view);

  const checks = [
    "Every company code has a controlling area",
    "Every plant carries a business area",
    "Every plant has a sales and purchasing organization",
    "Chart of accounts and fiscal year are consistent",
    "Controlling-area currency matches the company codes",
  ];

  const viewLabel =
    view === "all" ? "Combined landscape" : getSystem(view)?.name ?? "Selected system";

  return (
    <div className="mx-auto max-w-[1180px] px-5 pb-14 pt-8 sm:px-8 lg:pt-10">
      <div className="grid gap-8 lg:grid-cols-[1.22fr_0.78fr] lg:items-end">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="eyebrow">SAP landscape</p>
            <Badge tone="neutral">Synthetic configuration</Badge>
          </div>
          <h1 className="mt-2 max-w-[18ch] text-[clamp(2rem,4.4vw,3.2rem)] font-semibold leading-[1.02] tracking-[-0.04em]">
            Every company, plant and business area. One structure.
          </h1>
          <p className="measure mt-4 text-[14px] leading-relaxed text-muted">
            Inspect the enterprise structure behind the ERP: company codes, plants,
            business areas, controlling areas, sales and purchasing organizations.
            Switch between the strategic S/4HANA platform and the legacy ECC R/3 estate,
            or read both as one landscape.
          </p>
          <div
            className="mt-6 inline-flex flex-wrap rounded-full border border-line bg-surface p-0.5"
            role="group"
            aria-label="SAP landscape view"
          >
            {viewOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setView(option.value)}
                aria-pressed={view === option.value}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-[11px] font-semibold transition-colors",
                  view === option.value
                    ? "bg-[var(--warn)] text-[var(--graphite)]"
                    : "text-muted hover:text-ink",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-2">
          {SAP_SYSTEMS.map((system) => (
            <SystemCard
              key={system.id}
              system={system}
              active={view === system.id}
              onClick={() => setView(view === system.id ? "all" : system.id)}
            />
          ))}
        </div>
      </div>

      <section className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard
          label="Company codes"
          value={formatNumber(companyCodes.length)}
          hint={
            view === "all"
              ? `${COMPANY_CODES.filter((company) => company.system === "hana").length} on S/4HANA · ${COMPANY_CODES.filter((company) => company.system === "r3").length} on ECC`
              : `Client ${getSystem(view)?.client ?? "100"}`
          }
        />
        <StatCard
          label="Plants"
          value={formatNumber(plants.length)}
          hint={`${storageLocations} storage locations assigned`}
        />
        <StatCard
          label="Business areas"
          value={formatNumber(businessAreas.length)}
          hint={`${plants.length} plant assignments`}
        />
        <StatCard
          label="Controlling areas"
          value={formatNumber(controllingAreas.length)}
          hint={controllingAreas.map((area) => area.code).join(" · ") || "—"}
        />
        <StatCard
          label="Sales orgs"
          value={formatNumber(salesOrgs.length)}
          hint={salesOrgs.map((org) => org.code).join(" · ") || "—"}
        />
        <StatCard
          label="Purchasing orgs"
          value={formatNumber(purchasingOrgs.length)}
          hint={purchasingOrgs.map((org) => org.code).join(" · ") || "—"}
        />
      </section>

      <section className="mt-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="eyebrow">Enterprise structure</p>
            <h2 className="mt-2 text-[clamp(1.5rem,2.4vw,2rem)] font-semibold tracking-[-0.03em]">
              Company → client → company code → plant.
            </h2>
          </div>
          <p className="text-[11px] text-muted">
            {companyCodes.length} company codes · {plants.length} plants · {storageLocations} storage locations
          </p>
        </div>

        <div className="card mt-4 p-4 sm:p-5">
          <div className="grid gap-4 lg:grid-cols-[150px_1fr]">
            <div className="rounded-lg border border-line bg-[var(--panel-strong)] p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted">
                Company
              </p>
              <p className="mt-1 text-[12px] font-semibold">{COMPANIES[0].name}</p>
              <p className="mt-0.5 text-[10px] text-muted">
                {COMPANIES[0].id} · {COMPANIES[0].country}
              </p>
              <div className="mt-3 border-t border-line pt-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted">
                  Client
                </p>
                <p className="mt-1 text-[30px] font-semibold tracking-[-0.03em]">100</p>
                <p className="mt-1 text-[11px] text-muted">
                  {visibleSystems.length} SAP {visibleSystems.length === 1 ? "system" : "systems"}
                </p>
              </div>
              <div className="mt-3 flex flex-wrap gap-1">
                {visibleSystems.map((system) => (
                  <Badge key={system.id} tone={systemTone(system)}>
                    {system.shortName}
                  </Badge>
                ))}
              </div>
              <p className="mt-4 border-t border-line pt-3 text-[10px] leading-relaxed text-muted">
                {view === "all"
                  ? "One client view across two production landscapes."
                  : `${getSystem(view)?.release ?? ""} · ${getSystem(view)?.database ?? ""}`}
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {visibleSystems.map((system) => {
                const systemCompanies = companyCodes.filter(
                  (company) => company.system === system.id,
                );
                const systemPlants = plants.filter((plant) => plant.system === system.id);
                return (
                  <div key={system.id} className="rounded-lg border border-line bg-surface p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-[13px] font-semibold">{system.name}</p>
                        <p className="mt-0.5 text-[10px] text-muted">
                          Client {system.client} · {system.release}
                        </p>
                      </div>
                      <Badge tone={systemTone(system)}>{system.status}</Badge>
                    </div>
                    <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-muted">
                      Controlling area
                    </p>
                    <p className="mt-1 text-[11px]">
                      {controllingAreas
                        .filter((area) => area.system === system.id)
                        .map((area) => `${area.code} · ${area.name}`)
                        .join(" / ") || "—"}
                    </p>
                    <div className="mt-3 space-y-3">
                      {systemCompanies.map((company) => (
                        <div key={company.code} className="border-t border-line pt-2.5">
                          <div className="flex flex-wrap items-baseline justify-between gap-2">
                            <p className="text-[12px] font-semibold">
                              {company.code} · {company.name}
                            </p>
                            <span className="text-[10px] text-muted">{company.city}</span>
                          </div>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {systemPlants
                              .filter((plant) => plant.companyCode === company.code)
                              .map((plant) => (
                                <span
                                  key={plant.code}
                                  className="rounded border border-line bg-[var(--panel)] px-1.5 py-0.5 text-[10px] text-muted"
                                >
                                  {plant.code} {plant.name}
                                </span>
                              ))}
                          </div>
                          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-warn">
                            {businessAreas
                              .filter(
                                (area) =>
                                  area.system === system.id &&
                                  area.companyCodes.includes(company.code),
                              )
                              .map((area) => (
                                <span key={area.code}>
                                  BA {area.code} · {area.name}
                                </span>
                              ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="eyebrow">Company codes</p>
            <h2 className="mt-2 text-[clamp(1.5rem,2.4vw,2rem)] font-semibold tracking-[-0.03em]">
              The legal and financial frame.
            </h2>
          </div>
          <p className="text-[11px] text-muted">{viewLabel}</p>
        </div>
        <TableScroller
          label="Company code configuration"
          className="mt-4 rounded-xl border border-line bg-surface"
        >
          <table className="w-full min-w-[940px] text-left text-[12px]">
            <thead>
              <tr className="border-b border-line text-[10px] uppercase tracking-[0.08em] text-muted">
                <th className="px-4 py-3 font-semibold">Company code</th>
                <th className="px-3 py-3 font-semibold">Name</th>
                <th className="px-3 py-3 font-semibold">System</th>
                <th className="px-3 py-3 font-semibold">Country</th>
                <th className="px-3 py-3 font-semibold">Currency</th>
                <th className="px-3 py-3 font-semibold">Chart</th>
                <th className="px-3 py-3 font-semibold">FY variant</th>
                <th className="px-3 py-3 font-semibold">Controlling area</th>
                <th className="px-4 py-3 font-semibold">Credit control</th>
              </tr>
            </thead>
            <tbody>
              {companyCodes.map((company) => {
                const system = getSystem(company.system);
                return (
                  <tr key={company.code} className="border-b border-line/70 last:border-0">
                    <td className="px-4 py-3 font-semibold">{company.code}</td>
                    <td className="px-3 py-3">{company.name}</td>
                    <td className="px-3 py-3">
                      <Badge tone={system ? systemTone(system) : "neutral"}>
                        {system?.shortName ?? company.system}
                      </Badge>
                    </td>
                    <td className="px-3 py-3 text-muted">{company.country}</td>
                    <td className="px-3 py-3 text-muted">{company.currency}</td>
                    <td className="px-3 py-3 text-muted">{company.chartOfAccounts}</td>
                    <td className="px-3 py-3 text-muted">{company.fiscalYearVariant}</td>
                    <td className="px-3 py-3 text-muted">{company.controllingArea}</td>
                    <td className="px-4 py-3 text-muted">{company.creditControlArea}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </TableScroller>
      </section>

      <section className="mt-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="eyebrow">Plants</p>
            <h2 className="mt-2 text-[clamp(1.5rem,2.4vw,2rem)] font-semibold tracking-[-0.03em]">
              The operating footprint.
            </h2>
          </div>
          <p className="text-[11px] text-muted">
            {plants.length} plants · {storageLocations} storage locations
          </p>
        </div>
        <TableScroller
          label="Plant configuration"
          className="mt-4 rounded-xl border border-line bg-surface"
        >
          <table className="w-full min-w-[1080px] text-left text-[12px]">
            <thead>
              <tr className="border-b border-line text-[10px] uppercase tracking-[0.08em] text-muted">
                <th className="px-4 py-3 font-semibold">Plant</th>
                <th className="px-3 py-3 font-semibold">Name</th>
                <th className="px-3 py-3 font-semibold">Company code</th>
                <th className="px-3 py-3 font-semibold">System</th>
                <th className="px-3 py-3 font-semibold">Location</th>
                <th className="px-3 py-3 font-semibold">Business area</th>
                <th className="px-3 py-3 font-semibold">Sales org</th>
                <th className="px-3 py-3 font-semibold">Purchasing org</th>
                <th className="px-3 py-3 text-right font-semibold">Storage</th>
                <th className="px-4 py-3 font-semibold">Type</th>
              </tr>
            </thead>
            <tbody>
              {plants.map((plant) => {
                const system = getSystem(plant.system);
                const area = BUSINESS_AREAS.find(
                  (businessArea) =>
                    businessArea.system === plant.system &&
                    businessArea.code === plant.businessArea,
                );
                return (
                  <tr key={plant.code} className="border-b border-line/70 last:border-0">
                    <td className="px-4 py-3 font-semibold">{plant.code}</td>
                    <td className="px-3 py-3">{plant.name}</td>
                    <td className="px-3 py-3 text-muted">{plant.companyCode}</td>
                    <td className="px-3 py-3">
                      <Badge tone={system ? systemTone(system) : "neutral"}>
                        {system?.shortName ?? plant.system}
                      </Badge>
                    </td>
                    <td className="px-3 py-3 text-muted">
                      {plant.city}, {plant.region}
                    </td>
                    <td className="px-3 py-3 text-muted">
                      {plant.businessArea} · {area?.name ?? "—"}
                    </td>
                    <td className="px-3 py-3 text-muted">{plant.salesOrg}</td>
                    <td className="px-3 py-3 text-muted">{plant.purchasingOrg}</td>
                    <td className="px-3 py-3 text-right tabular text-muted">
                      {plant.storageLocations}
                    </td>
                    <td className="px-4 py-3 text-muted">{plant.type}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </TableScroller>
      </section>

      <section className="mt-10 grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="card p-5">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <p className="eyebrow">Business areas</p>
              <h2 className="mt-1 text-[20px] font-semibold tracking-[-0.02em]">
                The management segments.
              </h2>
            </div>
            <span className="text-[11px] text-muted">{businessAreas.length} in view</span>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {businessAreas.map((area) => {
              const system = getSystem(area.system);
              const areaPlants = plants.filter(
                (plant) => plant.system === area.system && plant.businessArea === area.code,
              );
              return (
                <div key={`${area.system}-${area.code}`} className="rounded-lg border border-line bg-[var(--panel)] p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted">
                        Business area {area.code}
                      </p>
                      <p className="mt-1 text-[15px] font-semibold">{area.name}</p>
                    </div>
                    <Badge tone={system ? systemTone(system) : "neutral"}>
                      {system?.shortName ?? area.system}
                    </Badge>
                  </div>
                  <p className="mt-2 text-[11px] text-muted">{area.owner}</p>
                  <div className="mt-3 flex items-baseline justify-between border-t border-line pt-2 text-[11px]">
                    <span className="text-muted">Company codes</span>
                    <span className="font-semibold">{area.companyCodes.join(", ")}</span>
                  </div>
                  <div className="mt-1 flex items-baseline justify-between text-[11px]">
                    <span className="text-muted">Plants</span>
                    <span className="font-semibold">{areaPlants.length}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-2">
            <Network className="h-4 w-4 text-warn" />
            <p className="eyebrow">Organisational units</p>
          </div>
          <h2 className="mt-1 text-[20px] font-semibold tracking-[-0.02em]">
            The units behind the postings.
          </h2>

          <div className="mt-4 space-y-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted">
                Controlling areas
              </p>
              <div className="mt-2 space-y-1.5">
                {controllingAreas.map((area) => (
                  <div
                    key={`${area.system}-${area.code}`}
                    className="flex items-baseline justify-between gap-3 border-t border-line pt-1.5 text-[11px]"
                  >
                    <span>
                      <span className="font-semibold">{area.code}</span> · {area.name}
                    </span>
                    <span className="text-muted">
                      {area.currency} · {area.companyCodes.join(", ")}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted">
                Sales organizations
              </p>
              <div className="mt-2 space-y-1.5">
                {salesOrgs.map((org) => (
                  <div
                    key={`${org.system}-${org.code}`}
                    className="flex items-baseline justify-between gap-3 border-t border-line pt-1.5 text-[11px]"
                  >
                    <span>
                      <span className="font-semibold">{org.code}</span> · {org.name}
                    </span>
                    <span className="text-muted">{org.companyCodes.join(", ")}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted">
                Purchasing organizations
              </p>
              <div className="mt-2 space-y-1.5">
                {purchasingOrgs.map((org) => (
                  <div
                    key={`${org.system}-${org.code}`}
                    className="flex items-baseline justify-between gap-3 border-t border-line pt-1.5 text-[11px]"
                  >
                    <span>
                      <span className="font-semibold">{org.code}</span> · {org.name}
                    </span>
                    <span className="text-muted">{org.companyCodes.join(", ")}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="eyebrow">Configuration</p>
            <h2 className="mt-2 text-[clamp(1.5rem,2.4vw,2rem)] font-semibold tracking-[-0.03em]">
              Same objects. Two system profiles.
            </h2>
          </div>
          <p className="text-[11px] text-muted">
            S/4HANA {getSystem("hana")?.release} · ECC {getSystem("r3")?.release}
          </p>
        </div>
        <p className="measure mt-3 text-[13px] leading-relaxed text-muted">
          The enterprise-structure concepts are the same in both systems. The difference
          is the release, the database and the number of objects each landscape carries.
        </p>

        <TableScroller
          label="SAP enterprise structure configuration matrix"
          className="mt-4 rounded-xl border border-line bg-surface"
        >
          <table className="w-full min-w-[880px] text-left text-[12px]">
            <thead>
              <tr className="border-b border-line text-[10px] uppercase tracking-[0.08em] text-muted">
                <th className="px-4 py-3 font-semibold">Object</th>
                <th className="px-3 py-3 font-semibold">Table</th>
                <th className="px-3 py-3 font-semibold">Key</th>
                <th
                  className={cn(
                    "px-3 py-3 text-right font-semibold",
                    view === "hana" && "bg-[rgba(79,209,197,0.08)] text-good",
                  )}
                >
                  S/4HANA
                </th>
                <th
                  className={cn(
                    "px-3 py-3 text-right font-semibold",
                    view === "r3" && "bg-[rgba(232,163,61,0.08)] text-warn",
                  )}
                >
                  ECC R/3
                </th>
                <th className="px-4 py-3 font-semibold">Purpose</th>
              </tr>
            </thead>
            <tbody>
              {ENTERPRISE_OBJECTS.map((object) => (
                <tr key={object.object} className="border-b border-line/70 last:border-0">
                  <td className="px-4 py-3 font-semibold">{object.object}</td>
                  <td className="px-3 py-3 text-muted">
                    <code>{object.table}</code>
                  </td>
                  <td className="px-3 py-3 text-muted">
                    <code>{object.key}</code>
                  </td>
                  <td
                    className={cn(
                      "px-3 py-3 text-right tabular",
                      view === "hana" && "bg-[rgba(79,209,197,0.08)] font-semibold text-good",
                    )}
                  >
                    {objectCount(object.object, "hana")}
                  </td>
                  <td
                    className={cn(
                      "px-3 py-3 text-right tabular",
                      view === "r3" && "bg-[rgba(232,163,61,0.08)] font-semibold text-warn",
                    )}
                  >
                    {objectCount(object.object, "r3")}
                  </td>
                  <td className="px-4 py-3 text-muted">{object.purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableScroller>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-line bg-[var(--panel-strong)] px-4 py-4 text-[12px] leading-relaxed text-white/75">
            <p className="font-semibold text-white">S/4HANA profile</p>
            <p className="mt-1">
              SAP S/4HANA 2023 on HANA 2.0, client 100. Two company codes, four plants
              and one controlling area. Chart MEGA, fiscal year K4, currency SAR.
              Business areas remain available; profit centres are the recommended
              management-reporting unit for new design.
            </p>
          </div>
          <div className="rounded-lg border border-line bg-[var(--panel)] px-4 py-4 text-[12px] leading-relaxed text-muted">
            <p className="font-semibold text-ink">ECC R/3 profile</p>
            <p className="mt-1">
              SAP ECC 6.0 EHP8 on Oracle 19c, client 100. Two company codes, three
              plants and one controlling area. The same chart and fiscal-year variant
              keep consolidation mapping simple across both landscapes.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <div className="card p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="eyebrow">Structure checks</p>
              <h2 className="mt-1 text-[20px] font-semibold tracking-[-0.02em]">
                The configuration holds together.
              </h2>
            </div>
            <Badge tone="good">{checks.length} of {checks.length} pass</Badge>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {checks.map((check) => (
              <div
                key={check}
                className="flex items-start gap-2 border-t border-line pt-2 text-[12px]"
              >
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-good" />
                <span className="text-muted">{check}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-line bg-[var(--panel-strong)] px-5 py-5 text-white">
        <div>
          <p className="text-[15px] font-semibold">Audit the structure, then the module.</p>
          <p className="mt-1 max-w-[62ch] text-[12px] leading-relaxed text-white/65">
            Pramaan&apos;s SAP PM pack starts with the maintenance data. The enterprise
            structure is the layer above it: every company code, plant and business area
            resolved before a single work order is counted.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/audit"
            className="rounded-md bg-[var(--warn)] px-4 py-2.5 text-[12px] font-semibold text-[var(--graphite)]"
          >
            Open Pramaan audit
          </Link>
          <Link
            href="/data-model"
            className="inline-flex items-center gap-1.5 rounded-md border border-white/20 px-4 py-2.5 text-[12px] font-semibold text-white/85"
          >
            See the data model <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Link
            href="/demo/coal"
            className="inline-flex items-center gap-1.5 rounded-md border border-white/20 px-4 py-2.5 text-[12px] font-semibold text-white/85"
          >
            Open maintenance demo
          </Link>
        </div>
      </div>
    </div>
  );
}
