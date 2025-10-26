type Reservoir = {buffer: number[]; writePos: number; filled: number; capacity: number};

type MetricState = {
  count: number;
  totalMs: number;
  reservoir: Reservoir;
};

const DEFAULT_CAPACITY = process.env.METRICS_RESERVOIR_SIZE ? Math.max(100, parseInt(process.env.METRICS_RESERVOIR_SIZE, 10)) : 2000;

const metricsStore: Record<string, MetricState> = {};

function getOrCreateMetricState(key: string): MetricState {
  if (!metricsStore[key]) {
    metricsStore[key] = {
      count: 0,
      totalMs: 0,
      reservoir: {buffer: new Array(DEFAULT_CAPACITY), writePos: 0, filled: 0, capacity: DEFAULT_CAPACITY},
    };
  }
  return metricsStore[key];
}

function recordDuration(key: string, durationMs: number): void {
  const state = getOrCreateMetricState(key);
  state.count += 1;
  state.totalMs += durationMs;
  const r = state.reservoir;
  r.buffer[r.writePos] = durationMs;
  r.writePos = (r.writePos + 1) % r.capacity;
  if (r.filled < r.capacity) r.filled += 1;
}

function percentileFromReservoir(reservoir: Reservoir, percentile: number): number | undefined {
  if (reservoir.filled === 0) return undefined;
  const arr = reservoir.buffer.slice(0, reservoir.filled).slice();
  arr.sort((a, b) => a - b);
  const rank = Math.min(arr.length - 1, Math.max(0, Math.ceil((percentile / 100) * arr.length) - 1));
  return arr[rank];
}

export function getRepositoryMetricsSnapshot(): Record<string, {count: number; avgMs: number; p95Ms?: number; p99Ms?: number}> {
  const out: Record<string, {count: number; avgMs: number; p95Ms?: number; p99Ms?: number}> = {};
  for (const [key, state] of Object.entries(metricsStore)) {
    const avgMs = state.count > 0 ? state.totalMs / state.count : 0;
    const p95 = percentileFromReservoir(state.reservoir, 95);
    const p99 = percentileFromReservoir(state.reservoir, 99);
    out[key] = {
      count: state.count,
      avgMs: Number(avgMs.toFixed(3)),
      p95Ms: p95 ? Number(p95.toFixed(3)) : undefined,
      p99Ms: p99 ? Number(p99.toFixed(3)) : undefined,
    };
  }
  return out;
}

export function Timed(operationName?: string) {
  return function (_target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      const op = operationName || propertyKey;
      const start = process.hrtime.bigint();
      try {
        const result = await original.apply(this, args);
        const durationMs = Number(process.hrtime.bigint() - start) / 1_000_000;
        recordDuration(op, durationMs);
        console.log(JSON.stringify({level: "info", layer: "repository", operation: op, durationMs: Number(durationMs.toFixed(3))}));
        return result;
      } catch (error: any) {
        const durationMs = Number(process.hrtime.bigint() - start) / 1_000_000;
        recordDuration(op, durationMs);
        console.error(
          JSON.stringify({
            level: "error",
            layer: "repository",
            operation: op,
            durationMs: Number(durationMs.toFixed(3)),
            message: error?.message || String(error),
          })
        );
        throw error;
      }
    };
    return descriptor;
  };
}
