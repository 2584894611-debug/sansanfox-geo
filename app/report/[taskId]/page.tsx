import { ReportClient } from "@/components/report-client";
import { SiteHeader } from "@/components/site-header";

export default async function ReportPage({ params }: { params: Promise<{ taskId: string }> }) {
  const { taskId } = await params;
  return (
    <>
      <SiteHeader />
      <ReportClient taskId={taskId} />
    </>
  );
}
