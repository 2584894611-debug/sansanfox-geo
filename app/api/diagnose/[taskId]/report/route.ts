import { NextResponse } from "next/server";
import { getTask } from "@/lib/stores/task-store";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ taskId: string }> }
) {
  const { taskId } = await params;
  const task = getTask(taskId);

  if (!task) {
    return NextResponse.json({ message: "报告不存在" }, { status: 404 });
  }

  if (!task.report) {
    return NextResponse.json(
      {
        taskId,
        status: task.status,
        progress: task.progress,
        message: "报告生成中"
      },
      { status: 202 }
    );
  }

  return NextResponse.json(task.report);
}
