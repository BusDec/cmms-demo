import { notFound } from "next/navigation";
import { CostDashboard } from "@/components/dashboards/cost";
import { getPlantData } from "@/lib/data";

export default async function CostPage({
  params,
}: {
  params: Promise<{ plant: string }>;
}) {
  const { plant } = await params;
  const data = getPlantData(plant);
  if (!data) notFound();
  return <CostDashboard data={data} />;
}
