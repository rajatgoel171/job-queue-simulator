# Job Queue Simulator

A small in-memory job queue that models production queue behavior: concurrency limits, retries, exponential backoff, and dead-letter handling.

## What This Demonstrates

- Backend worker architecture
- Retry and failure handling
- Operational thinking around queues
- Testable asynchronous JavaScript

## Features

- Configurable concurrency
- Retry attempts per job
- Exponential backoff strategy
- Dead-letter queue for failed jobs
- Observable job status counters

## Run

```bash
npm test
npm run demo
```


















## Progress Note 9

- 2026-03-21: documented service readiness, implementation progress, and release hygiene for job-queue-simulator.
- Captured validation notes for observability, operational checks, and handoff readiness.
