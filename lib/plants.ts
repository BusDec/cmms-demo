export type PlantSlug = "coal" | "thermal" | "wind" | "gas";

export type Plant = {
  slug: PlantSlug;
  name: string;
  shortName: string;
  location: string;
  capacity: string;
  units: string;
  sourceErp: string;
  sourceErpShort: string;
  accent: string;
  seed: number;
  headline: string;
  story: string;
  rav: number;
  hourlyLoss: number;
};

export const plants: Plant[] = [
  {
    slug: "coal",
    name: "Koradi Coal Station",
    shortName: "Koradi",
    location: "Maharashtra, India",
    capacity: "2 × 660 MW",
    units: "Unit 1 · Unit 2",
    sourceErp: "SAP S/4HANA Cloud",
    sourceErpShort: "SAP S/4",
    accent: "#b45309",
    seed: 11,
    headline: "High backlog, hard-working assets",
    story:
      "A 1,320 MW coal station running two supercritical units. The maintenance team is fighting a 27-day PM backlog while keeping availability above 90%.",
    rav: 1_820_000_000,
    hourlyLoss: 118_000,
  },
  {
    slug: "thermal",
    name: "Satpura Thermal Station",
    shortName: "Satpura",
    location: "Madhya Pradesh, India",
    capacity: "3 × 500 MW",
    units: "Unit 3 · Unit 4 · Unit 5",
    sourceErp: "SAP ECC 6.0",
    sourceErpShort: "SAP ECC",
    accent: "#0e7490",
    seed: 23,
    headline: "Ageing fleet, outage pressure",
    story:
      "A three-unit thermal fleet with an ageing turbine hall. Outage planning and cost control are the constraints; the same dashboard runs on ECC data.",
    rav: 1_430_000_000,
    hourlyLoss: 94_000,
  },
  {
    slug: "wind",
    name: "Coastal Wind Cluster",
    shortName: "Coastal Wind",
    location: "Gujarat, India",
    capacity: "200 MW",
    units: "84 turbines",
    sourceErp: "IBM Maximo",
    sourceErpShort: "Maximo",
    accent: "#0f766e",
    seed: 37,
    headline: "Remote assets, lean crews",
    story:
      "Eighty-four turbines across three ridges, managed by a small central team. Condition monitoring and work-order triage matter more than wrench time.",
    rav: 920_000_000,
    hourlyLoss: 26_000,
  },
  {
    slug: "gas",
    name: "Hazira Gas CCGT",
    shortName: "Hazira Gas",
    location: "Gujarat, India",
    capacity: "400 MW",
    units: "GT-1 · GT-2 · ST-1",
    sourceErp: "Oracle EAM",
    sourceErpShort: "Oracle EAM",
    accent: "#1d4ed8",
    seed: 41,
    headline: "Fast start, tight margins",
    story:
      "A 400 MW combined-cycle plant in a fast-start role. Availability and heat-rate sensitivity make every unplanned trip expensive.",
    rav: 760_000_000,
    hourlyLoss: 72_000,
  },
];

export function getPlant(slug: string): Plant | undefined {
  return plants.find((plant) => plant.slug === slug);
}
