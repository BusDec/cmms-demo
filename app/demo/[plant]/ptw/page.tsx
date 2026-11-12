import { notFound } from "next/navigation";
import { PermitsDashboard } from "@/components/dashboards/permits";
import { getPlantData } from "@/lib/data";

export default async function PermitsPage({
  params,
}: {
  params: Promise<{ plant: string }>;
}) {
  const { plant } = await params;
  const data = getPlantData(plant);
  if (!data) notFound();
  return <PermitsDashboard data={data} />;
}
