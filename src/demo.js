import { JobQueue } from "./queue.js";

const queue = new JobQueue({ concurrency: 2, maxAttempts: 3 });

queue.enqueue("send-email", { to: "user@example.com" }, async () => true);
queue.enqueue("sync-report", { id: "rep_1" }, async (payload, job) => {
  if (job.attempts < 2) throw new Error("temporary failure");
  return payload;
});

console.log(JSON.stringify(await queue.drain(), null, 2));
