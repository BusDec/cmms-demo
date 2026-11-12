import { notFound } from "next/navigation";
import { MaintenanceDashboard } from "@/components/dashboards/maintenance";
import { getPlantData } from "@/lib/data";

export default async function MaintenancePage({
  params,
}: {
  params: Promise<{ plant: string }>;
}) {
  const { plant } = await params;
  const data = getPlantData(plant);
  if (!data) notFound();
  return <MaintenanceDashboard data={data} />;
}
