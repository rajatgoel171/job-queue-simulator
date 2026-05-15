import assert from "node:assert/strict";
import { test } from "node:test";
import { JobQueue } from "../src/queue.js";

test("retries temporary failures", async () => {
  const queue = new JobQueue({ concurrency: 1, maxAttempts: 3, backoffMs: 1 });
  let attempts = 0;

  queue.enqueue("flaky", {}, async () => {
    attempts += 1;
    if (attempts < 2) throw new Error("try again");
  });

  const stats = await queue.drain();
  assert.equal(stats.completed, 1);
  assert.equal(stats.failed, 0);
  assert.equal(attempts, 2);
});

test("moves exhausted jobs to dead letter", async () => {
  const queue = new JobQueue({ concurrency: 1, maxAttempts: 2, backoffMs: 1 });
  queue.enqueue("always-fails", {}, async () => {
    throw new Error("failed");
  });

  const stats = await queue.drain();
  assert.equal(stats.completed, 0);
  assert.equal(stats.failed, 1);
});
