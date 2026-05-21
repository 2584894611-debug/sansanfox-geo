import type { DiagnosisReport, ScanTaskRecord } from "@/lib/types";

const globalForTasks = globalThis as unknown as {
  sansanfoxTasks?: Map<string, ScanTaskRecord>;
};

const tasks = globalForTasks.sansanfoxTasks ?? new Map<string, ScanTaskRecord>();

if (!globalForTasks.sansanfoxTasks) {
  globalForTasks.sansanfoxTasks = tasks;
}

export function saveTask(task: ScanTaskRecord) {
  tasks.set(task.taskId, task);
  return task;
}

export function getTask(taskId: string) {
  return tasks.get(taskId);
}

export function updateTask(
  taskId: string,
  patch: Partial<ScanTaskRecord> | ((task: ScanTaskRecord) => Partial<ScanTaskRecord>)
) {
  const current = tasks.get(taskId);
  if (!current) return undefined;
  const nextPatch = typeof patch === "function" ? patch(current) : patch;
  const next = { ...current, ...nextPatch };
  tasks.set(taskId, next);
  return next;
}

export function attachReport(taskId: string, report: DiagnosisReport) {
  return updateTask(taskId, { report });
}
