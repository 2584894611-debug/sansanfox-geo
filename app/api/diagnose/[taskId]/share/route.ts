import { NextResponse } from "next/server";
import { getTask } from "@/lib/stores/task-store";
import { absoluteUrl } from "@/lib/utils";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ taskId: string }> }
) {
  const { taskId } = await params;
  const task = getTask(taskId);

  if (!task) {
    return NextResponse.json({ message: "任务不存在" }, { status: 404 });
  }

  return NextResponse.json({
    taskId,
    shareUrl: absoluteUrl(`/report/${taskId}`)
  });
}
