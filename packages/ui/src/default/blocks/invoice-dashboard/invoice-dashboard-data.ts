export type InvoiceDashboardStatus = "draft" | "open" | "paid";

export type InvoiceDashboardRow = {
  id: string;
  customer: string;
  status: InvoiceDashboardStatus;
  total: number;
  owner: string;
  updatedAt: string;
};

export type InvoiceDashboardMetric = {
  label: string;
  value: string;
  detail: string;
};

export const invoiceDashboardRows: InvoiceDashboardRow[] = [
  {
    id: "inv-1001",
    customer: "Northstar Labs",
    status: "paid",
    total: 12800,
    owner: "Mina",
    updatedAt: "Today",
  },
  {
    id: "inv-1002",
    customer: "Orbit Systems",
    status: "open",
    total: 8400,
    owner: "Jon",
    updatedAt: "Yesterday",
  },
  {
    id: "inv-1003",
    customer: "Pioneer Studio",
    status: "draft",
    total: 5100,
    owner: "Mina",
    updatedAt: "Apr 28",
  },
  {
    id: "inv-1004",
    customer: "Railway Works",
    status: "paid",
    total: 14600,
    owner: "Ari",
    updatedAt: "Apr 27",
  },
];

export const invoiceDashboardMetrics: InvoiceDashboardMetric[] = [
  { label: "Collected", value: "$27.4k", detail: "Paid invoices this month" },
  { label: "Outstanding", value: "$8.4k", detail: "Open invoices awaiting action" },
  { label: "Drafts", value: "1", detail: "Needs review before sending" },
];

export const invoiceDashboardStatusOptions = [
  { label: "Draft", value: "draft" },
  { label: "Open", value: "open" },
  { label: "Paid", value: "paid" },
] as const;
