import { createColumnHelper } from "@tanstack/solid-table";
import { render } from "solid-js/web";
import { describe, expect, test } from "vitest";
import { DataTable } from "./data-table";
import { useDataTable } from "./use-data-table";

type ServiceRow = {
  id: string;
  latency: number;
  service: string;
};

describe("DataTable TanStack proof", () => {
  test("renders TanStack Table rows through Keystone Table anatomy", () => {
    const rows: ServiceRow[] = [
      { id: "api", service: "API", latency: 42 },
      { id: "worker", service: "Worker", latency: 18 },
    ];
    const column = createColumnHelper<ServiceRow>();
    const columns = [
      column.accessor("service", {
        header: "Service",
        cell: (context) => context.getValue(),
      }),
      column.accessor("latency", {
        header: "Latency",
        cell: (context) => `${context.getValue()} ms`,
      }),
    ];
    const host = document.createElement("div");
    const dispose = render(() => {
      const table = useDataTable({
        columns,
        data: rows,
        getRowId: (row) => row.id,
      });

      return <DataTable table={table} caption="Service latency" pagination={false} />;
    }, host);

    const table = host.querySelector("table");
    const viewport = host.querySelector("[data-part='viewport']");
    const headers = host.querySelectorAll("th");
    const cells = host.querySelectorAll("tbody td");

    expect(viewport?.getAttribute("data-scope")).toBe("ui-data-table");
    expect(viewport?.getAttribute("data-slot")).toBe("table-container");
    expect(table?.getAttribute("data-scope")).toBe("ui-data-table");
    expect(table?.getAttribute("data-slot")).toBe("table");
    expect(host.querySelector("caption")?.textContent).toBe("Service latency");
    expect(headers[0]?.getAttribute("aria-sort")).toBe("none");
    expect(cells[0]?.textContent).toBe("API");
    expect(cells[3]?.textContent).toBe("18 ms");

    dispose();
  });
});
