import { notFound } from "next/navigation";
import { ExecutiveDashboard } from "@/components/dashboards/executive";
import { getAllPlantData, getPlantData } from "@/lib/data";

export default async function ExecutivePage({
  params,
}: {
  params: Promise<{ plant: string }>;
}) {
  const { plant } = await params;
  const data = getPlantData(plant);
  if (!data) notFound();

  const comparison = getAllPlantData().map((item) => ({
    slug: item.plant.slug,
    name: item.plant.shortName,
    availability: item.kpis[0].value,
    pm: item.kpis[3].value,
    costPct: (item.monthly.reduce((sum, point) => sum + point.cost, 0) / item.plant.rav) * 100,
    sourceErp: item.plant.sourceErp,
  }));

  return <ExecutiveDashboard data={data} comparison={comparison} />;
}
