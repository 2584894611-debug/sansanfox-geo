import { Worker } from "bullmq";
import IORedis from "ioredis";
import { runDiagnosisTask } from "@/lib/jobs/diagnosis-runner";
import { queueName } from "@/lib/jobs/scan-queue";

if (!process.env.REDIS_URL) {
  throw new Error("REDIS_URL 未配置，生产 Worker 需要 Redis");
}

const connection = new IORedis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null
});

const worker = new Worker(
  queueName,
  async (job) => {
    await runDiagnosisTask(job.data.taskId);
  },
  { connection }
);

worker.on("completed", (job) => {
  console.log(`scan job completed: ${job.id}`);
});

worker.on("failed", (job, error) => {
  console.error(`scan job failed: ${job?.id}`, error);
});
