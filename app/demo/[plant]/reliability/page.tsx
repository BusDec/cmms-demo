import { notFound } from "next/navigation";
import { ReliabilityDashboard } from "@/components/dashboards/reliability";
import { getPlantData } from "@/lib/data";

export default async function ReliabilityPage({
  params,
}: {
  params: Promise<{ plant: string }>;
}) {
  const { plant } = await params;
  const data = getPlantData(plant);
  if (!data) notFound();
  return <ReliabilityDashboard data={data} />;
}
