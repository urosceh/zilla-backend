import express from "express";

const router = express.Router();

router.get("/", async (req, res) => {
  const memoryUsage = process.memoryUsage();
  const cpuUsage = process.cpuUsage();
  const uptime = process.uptime();

  // Convert bytes to MB for readability
  const formatBytes = (bytes: number) => (bytes / (1024 * 1024)).toFixed(2);

  const metrics = {
    timestamp: new Date().toISOString(),
    uptime: {
      seconds: uptime,
      formatted: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m`,
    },
    memory: {
      rss: `${formatBytes(memoryUsage.rss)} MB`, // Total memory
      heapTotal: `${formatBytes(memoryUsage.heapTotal)} MB`, // Heap allocated
      heapUsed: `${formatBytes(memoryUsage.heapUsed)} MB`, // Heap used
      heapFree: `${formatBytes(memoryUsage.heapTotal - memoryUsage.heapUsed)} MB`, // Heap free
      heapUsedPercent: `${((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100).toFixed(2)}%`, // Heap used percentage
      external: `${formatBytes(memoryUsage.external)} MB`, // C++ objects
      arrayBuffers: `${formatBytes(memoryUsage.arrayBuffers)} MB`,
    },
    cpu: {
      user: `${(cpuUsage.user / 1000000).toFixed(2)} seconds`, // User CPU time
      system: `${(cpuUsage.system / 1000000).toFixed(2)} seconds`, // System CPU time
    },
  };

  res.json(metrics);
});

export default router;
