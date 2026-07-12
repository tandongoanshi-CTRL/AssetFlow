// Lightweight background-job imitation using setImmediate.
// In production you would use BullMQ/worker threads/cron.

function enqueuePasswordResetBackgroundJob(payload) {
  setImmediate(() => {
    // Example: you could log, trigger email provider, analytics, etc.
    console.log('[BACKGROUND-JOB] password reset job executed:', payload);
  });
}

module.exports = { enqueuePasswordResetBackgroundJob };

