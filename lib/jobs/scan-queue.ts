import { runDiagnosisTask } from "@/lib/jobs/diagnosis-runner";

const queueName = "sansanfox-scan";

export async function enqueueDiagnosis(taskId: string) {
  if (process.env.REDIS_URL) {
    const { Queue } = await import("bullmq");
    const IORedis = (await import("ioredis")).default;
    const connection = new IORedis(process.env.REDIS_URL, {
      maxRetriesPerRequest: null
    });
    const queue = new Queue(queueName, { connection });
    await queue.add("diagnose", { taskId }, { attempts: 2, backoff: { type: "exponential", delay: 1000 } });
    await queue.close();
    await connection.quit();
    return;
  }

  void runDiagnosisTask(taskId);
}

export { queueName };
