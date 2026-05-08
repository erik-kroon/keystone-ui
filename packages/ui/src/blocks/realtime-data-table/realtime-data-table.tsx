import { createSignal, onCleanup, onMount, Show } from "solid-js";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { useDataTable } from "@/components/data-table/use-data-table";
import { realtimeDataTableColumns } from "./realtime-data-table-columns";
import {
  nextRealtimeDataTableRows,
  realtimeDataTableRows,
  type RealtimeDataTableRow,
} from "./realtime-data-table-data";

export type RealtimeDataTableBlockProps = {
  title?: string;
  description?: string;
  autoUpdate?: boolean;
  updateInterval?: number;
};

export function RealtimeDataTableBlock(props: RealtimeDataTableBlockProps) {
  const [rows, setRows] = createSignal<RealtimeDataTableRow[]>(realtimeDataTableRows);
  const [tick, setTick] = createSignal(0);
  const [loading, setLoading] = createSignal(false);
  const [paused, setPaused] = createSignal(!props.autoUpdate);

  const table = useDataTable({
    data: rows,
    columns: realtimeDataTableColumns,
    getRowId: (row) => row.id,
    initialState: {
      pagination: { pageIndex: 0, pageSize: 4 },
      sorting: [{ id: "latency", desc: true }],
    },
  });

  const applyRealtimeTick = () => {
    const nextTick = tick() + 1;
    setTick(nextTick);
    setRows((current) => nextRealtimeDataTableRows(current, nextTick));
  };

  onMount(() => {
    const interval = window.setInterval(() => {
      if (!paused() && !loading() && rows().length > 0) {
        applyRealtimeTick();
      }
    }, props.updateInterval ?? 2500);

    onCleanup(() => window.clearInterval(interval));
  });

  return (
    <section
      data-scope="ui-block"
      data-part="realtime-data-table"
      class="ui-block-realtime-data-table space-y-4"
    >
      <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div class="space-y-1">
          <h2 class="text-lg font-semibold">{props.title ?? "Realtime service telemetry"}</h2>
          <p class="max-w-2xl text-sm text-muted-foreground">
            {props.description ??
              "Reactive TanStack Table rows update in place while stable row IDs preserve sorting, selection, and hydration-sensitive identity."}
          </p>
        </div>
        <div
          aria-label="Realtime table controls"
          class="flex flex-wrap items-center gap-2"
          data-scope="ui-block"
          data-part="realtime-controls"
          role="group"
        >
          <Button
            type="button"
            variant="outline"
            aria-pressed={!paused()}
            onClick={() => setPaused((current) => !current)}
          >
            <Show when={paused()} fallback="Pause">
              Resume
            </Show>
          </Button>
          <Button type="button" variant="outline" onClick={applyRealtimeTick}>
            Apply tick
          </Button>
          <Button type="button" variant="outline" onClick={() => setLoading((current) => !current)}>
            <Show when={loading()} fallback="Show loading">
              Hide loading
            </Show>
          </Button>
          <Button type="button" variant="outline" onClick={() => setRows([])}>
            Clear rows
          </Button>
          <Button
            type="button"
            onClick={() => {
              setRows(realtimeDataTableRows);
              setTick(0);
              setLoading(false);
            }}
          >
            Reset rows
          </Button>
        </div>
      </div>

      <div
        aria-live="polite"
        class="rounded-md border bg-muted/30 px-3 py-2 text-sm tabular-nums text-muted-foreground"
        data-scope="ui-block"
        data-part="realtime-status"
      >
        Tick {tick()} updates {rows().length} stable service rows.
      </div>

      <DataTable
        table={table}
        loading={loading()}
        skeletonRows={4}
        empty="No telemetry rows match the current table state."
      >
        <DataTableToolbar table={table} />
      </DataTable>
    </section>
  );
}
