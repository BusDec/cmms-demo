import { notFound } from "next/navigation";
import { QualityDashboard } from "@/components/dashboards/quality";
import { getPlantData } from "@/lib/data";

export default async function RcaQualityPage({
  params,
}: {
  params: Promise<{ plant: string }>;
}) {
  const { plant } = await params;
  const data = getPlantData(plant);
  if (!data) notFound();
  return <QualityDashboard data={data} />;
}
