export class JobQueue {
  constructor({ concurrency = 2, maxAttempts = 3, backoffMs = 10 } = {}) {
    this.concurrency = concurrency;
    this.maxAttempts = maxAttempts;
    this.backoffMs = backoffMs;
    this.pending = [];
    this.deadLetter = [];
    this.active = 0;
    this.completed = 0;
  }

  enqueue(name, payload, handler) {
    const job = {
      id: `job_${Date.now()}_${Math.random().toString(16).slice(2)}`,
      name,
      payload,
      handler,
      attempts: 0,
    };
    this.pending.push(job);
    return job.id;
  }

  async drain() {
    while (this.pending.length > 0 || this.active > 0) {
      while (this.active < this.concurrency && this.pending.length > 0) {
        this.#run(this.pending.shift());
      }
      await sleep(1);
    }

    return this.stats();
  }

  stats() {
    return {
      pending: this.pending.length,
      active: this.active,
      completed: this.completed,
      failed: this.deadLetter.length,
    };
  }

  async #run(job) {
    this.active += 1;
    try {
      job.attempts += 1;
      await job.handler(job.payload, job);
      this.completed += 1;
    } catch (error) {
      if (job.attempts < this.maxAttempts) {
        await sleep(this.backoffMs * 2 ** (job.attempts - 1));
        this.pending.push(job);
      } else {
        this.deadLetter.push({ ...job, error: error.message });
      }
    } finally {
      this.active -= 1;
    }
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
