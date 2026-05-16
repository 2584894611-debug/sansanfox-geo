import { NextResponse } from "next/server";
import { getTask } from "@/lib/stores/task-store";

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
    taskId: task.taskId,
    brandName: task.brandName,
    status: task.status,
    progress: task.progress,
    questions: task.questions,
    modelResults: task.modelResults,
    report: task.report,
    error: task.error
  });
}
