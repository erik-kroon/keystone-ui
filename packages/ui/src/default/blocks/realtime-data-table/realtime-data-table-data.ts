export type RealtimeDataTableStatus = "healthy" | "degraded" | "investigating";

export type RealtimeDataTableRow = {
  id: string;
  service: string;
  region: string;
  status: RealtimeDataTableStatus;
  latency: number;
  throughput: number;
  errorRate: number;
  updatedAt: string;
  tick: number;
};

export const realtimeDataTableStatusOptions = [
  { label: "Healthy", value: "healthy" },
  { label: "Degraded", value: "degraded" },
  { label: "Investigating", value: "investigating" },
] as const;

export const realtimeDataTableRows: RealtimeDataTableRow[] = [
  {
    id: "svc-edge-us",
    service: "Edge API",
    region: "US East",
    status: "healthy",
    latency: 42,
    throughput: 1280,
    errorRate: 0.12,
    updatedAt: "09:00:00",
    tick: 0,
  },
  {
    id: "svc-billing-eu",
    service: "Billing Sync",
    region: "EU West",
    status: "degraded",
    latency: 118,
    throughput: 430,
    errorRate: 1.8,
    updatedAt: "09:00:00",
    tick: 0,
  },
  {
    id: "svc-search-apac",
    service: "Search Index",
    region: "APAC",
    status: "healthy",
    latency: 64,
    throughput: 920,
    errorRate: 0.28,
    updatedAt: "09:00:00",
    tick: 0,
  },
  {
    id: "svc-worker-us",
    service: "Worker Queue",
    region: "US West",
    status: "investigating",
    latency: 156,
    throughput: 310,
    errorRate: 3.4,
    updatedAt: "09:00:00",
    tick: 0,
  },
];

export function nextRealtimeDataTableRows(
  rows: readonly RealtimeDataTableRow[],
  tick: number,
): RealtimeDataTableRow[] {
  return rows.map((row, index) => {
    const direction = (tick + index) % 2 === 0 ? 1 : -1;
    const latency = Math.max(24, row.latency + direction * (6 + index * 2));
    const throughput = Math.max(120, row.throughput + direction * (35 + index * 8));
    const errorRate = Math.max(0, row.errorRate + direction * (index % 2 === 0 ? 0.04 : 0.12));
    const status = getStatus(latency, errorRate);

    return {
      ...row,
      latency,
      throughput,
      errorRate: Math.round(errorRate * 100) / 100,
      status,
      tick,
      updatedAt: `09:00:${String(tick).padStart(2, "0")}`,
    };
  });
}

function getStatus(latency: number, errorRate: number): RealtimeDataTableStatus {
  if (errorRate >= 2.5 || latency >= 145) return "investigating";
  if (errorRate >= 1 || latency >= 100) return "degraded";
  return "healthy";
}
