import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Status = "Failed" | "Paid" | "Pending" | "Unpaid";

const rows: {
  budget: string;
  project: string;
  status: Status;
  team: string;
}[] = [
  { budget: "$12,500", project: "Website Redesign", status: "Paid", team: "Frontend Team" },
  { budget: "$8,750", project: "Mobile App", status: "Unpaid", team: "Mobile Team" },
  { budget: "$5,200", project: "API Integration", status: "Pending", team: "Backend Team" },
  { budget: "$3,800", project: "Database Migration", status: "Paid", team: "DevOps Team" },
  { budget: "$7,200", project: "User Dashboard", status: "Paid", team: "UX Team" },
  { budget: "$2,100", project: "Security Audit", status: "Failed", team: "Security Team" },
];

const statusDotClass: Record<Status, string> = {
  Failed: "bg-destructive",
  Paid: "bg-success",
  Pending: "bg-warning",
  Unpaid: "bg-muted-foreground/72",
};

function StatusBadge(props: { status: Status }) {
  return (
    <span class="inline-flex h-6 items-center gap-1.5 rounded-md border border-border/72 bg-muted/20 px-2 font-medium text-foreground text-sm leading-none shadow-xs/5">
      <span class={`size-2 rounded-full ${statusDotClass[props.status]}`} />
      {props.status}
    </span>
  );
}

export function Component() {
  return (
    <TableContainer>
      <Table>
        <TableCaption>A list of current projects.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead scope="col">Project</TableHead>
            <TableHead scope="col">Status</TableHead>
            <TableHead scope="col">Team</TableHead>
            <TableHead class="text-right" scope="col">
              Budget
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow>
              <TableCell class="font-medium text-foreground">{row.project}</TableCell>
              <TableCell>
                <StatusBadge status={row.status} />
              </TableCell>
              <TableCell>{row.team}</TableCell>
              <TableCell class="text-right font-medium tabular-nums">{row.budget}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell class="font-semibold text-foreground" colSpan={3}>
              Total Budget
            </TableCell>
            <TableCell class="text-right font-semibold tabular-nums">$39,550</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}
