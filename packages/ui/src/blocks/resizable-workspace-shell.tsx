import { createMemo, createSignal, For, type JSX } from "solid-js";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

type WorkspacePanel = {
  id: string;
  label: string;
  detail?: string;
  tone?: "default" | "attention" | "muted" | "success";
};

export type ResizableWorkspaceShellBlockProps = {
  class?: string;
  title?: string;
  description?: string;
  initialLeftWidth?: number;
  initialInspectorWidth?: number;
  minLeftWidth?: number;
  maxLeftWidth?: number;
  minInspectorWidth?: number;
  maxInspectorWidth?: number;
  leftRail?: JSX.Element;
  workSurface?: JSX.Element;
  inspector?: JSX.Element;
};

const navigationItems: WorkspacePanel[] = [
  { id: "overview", label: "Overview", detail: "Live workspace", tone: "success" },
  { id: "pipeline", label: "Pipeline", detail: "12 queued" },
  { id: "analytics", label: "Analytics", detail: "Updated now", tone: "attention" },
  { id: "settings", label: "Settings", detail: "Workspace" },
];

const workItems: WorkspacePanel[] = [
  { id: "northstar", label: "Northstar report", detail: "Owner: Maya Lin", tone: "success" },
  { id: "rollout", label: "Rollout review", detail: "Needs decision", tone: "attention" },
  { id: "handoff", label: "Support handoff", detail: "Ready for QA", tone: "muted" },
];

const inspectorItems: WorkspacePanel[] = [
  { id: "status", label: "Status", detail: "On track", tone: "success" },
  { id: "owner", label: "Owner", detail: "Design systems" },
  { id: "updated", label: "Updated", detail: "3 minutes ago", tone: "muted" },
];

const resizeStep = 16;
const resizeLargeStep = 64;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function panelToneClass(tone: WorkspacePanel["tone"]) {
  switch (tone) {
    case "attention":
      return "border-amber-300 bg-amber-50 text-amber-950 dark:border-amber-400/40 dark:bg-amber-400/10 dark:text-amber-100";
    case "muted":
      return "border-muted bg-muted/40 text-muted-foreground";
    case "success":
      return "border-emerald-300 bg-emerald-50 text-emerald-950 dark:border-emerald-400/40 dark:bg-emerald-400/10 dark:text-emerald-100";
    default:
      return "border-border bg-background text-foreground";
  }
}

function ResizableWorkspaceHandle(props: {
  label: string;
  value: number;
  min: number;
  max: number;
  side: "left" | "inspector";
  onResize: (nextValue: number) => void;
}) {
  const increase = () => (props.side === "left" ? resizeStep : -resizeStep);
  const decrease = () => (props.side === "left" ? -resizeStep : resizeStep);

  function handleKeyDown(event: KeyboardEvent) {
    const multiplier = event.shiftKey ? resizeLargeStep / resizeStep : 1;
    let nextValue: number | undefined;

    switch (event.key) {
      case "ArrowLeft":
        nextValue = props.value + decrease() * multiplier;
        break;
      case "ArrowRight":
        nextValue = props.value + increase() * multiplier;
        break;
      case "Home":
        nextValue = props.min;
        break;
      case "End":
        nextValue = props.max;
        break;
      default:
        return;
    }

    event.preventDefault();
    props.onResize(clamp(nextValue, props.min, props.max));
  }

  function handlePointerDown(event: PointerEvent) {
    event.preventDefault();
    const startX = event.clientX;
    const startValue = props.value;

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const delta = moveEvent.clientX - startX;
      const signedDelta = props.side === "left" ? delta : -delta;
      props.onResize(clamp(startValue + signedDelta, props.min, props.max));
    };

    const handlePointerUp = () => {
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerup", handlePointerUp);
    };

    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", handlePointerUp, { once: true });
  }

  return (
    <button
      aria-label={props.label}
      aria-orientation="vertical"
      aria-valuemax={props.max}
      aria-valuemin={props.min}
      aria-valuenow={props.value}
      aria-valuetext={`${props.value} pixels`}
      class="ui-block-resizable-workspace-resize-handle group hidden w-3 cursor-col-resize items-stretch justify-center self-stretch rounded-none border-0 bg-transparent p-0 outline-none lg:flex"
      data-scope="ui-block"
      data-part="resize-handle"
      data-panel={props.side}
      onKeyDown={handleKeyDown}
      onPointerDown={handlePointerDown}
      role="separator"
      type="button"
    >
      <span
        aria-hidden="true"
        class="my-3 block w-px rounded-full bg-border transition-colors group-hover:bg-ring group-focus-visible:bg-ring group-focus-visible:ring-2 group-focus-visible:ring-ring group-focus-visible:ring-offset-2"
        data-scope="ui-block"
        data-part="resize-indicator"
      />
    </button>
  );
}

function DefaultLeftRail() {
  return (
    <nav aria-label="Workspace" class="space-y-2" data-scope="ui-block" data-part="left-rail-nav">
      <For each={navigationItems}>
        {(item) => (
          <a
            class={cn(
              "ui-block-resizable-workspace-nav-item block rounded-md border px-3 py-2 text-sm outline-none transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring",
              panelToneClass(item.tone),
            )}
            data-scope="ui-block"
            data-part="left-rail-item"
            href={`#${item.id}`}
          >
            <span class="block font-medium">{item.label}</span>
            <span class="block text-xs opacity-70">{item.detail}</span>
          </a>
        )}
      </For>
    </nav>
  );
}

function DefaultWorkSurface() {
  return (
    <div class="space-y-3" data-scope="ui-block" data-part="work-list">
      <For each={workItems}>
        {(item) => (
          <article
            class={cn(
              "ui-block-resizable-workspace-work-item rounded-lg border p-4",
              panelToneClass(item.tone),
            )}
            data-scope="ui-block"
            data-part="work-item"
            id={item.id}
            tabindex="0"
          >
            <div class="flex items-start justify-between gap-3">
              <div>
                <h3 class="text-sm font-semibold">{item.label}</h3>
                <p class="mt-1 text-sm opacity-75">{item.detail}</p>
              </div>
              <Button size="sm" variant="outline">
                Open
              </Button>
            </div>
          </article>
        )}
      </For>
    </div>
  );
}

function DefaultInspector() {
  return (
    <dl class="space-y-3" data-scope="ui-block" data-part="inspector-list">
      <For each={inspectorItems}>
        {(item) => (
          <div
            class={cn("rounded-md border px-3 py-2", panelToneClass(item.tone))}
            data-scope="ui-block"
            data-part="inspector-item"
          >
            <dt class="text-xs font-medium uppercase text-muted-foreground">{item.label}</dt>
            <dd class="mt-1 text-sm">{item.detail}</dd>
          </div>
        )}
      </For>
    </dl>
  );
}

export function ResizableWorkspaceShellBlock(props: ResizableWorkspaceShellBlockProps) {
  const minLeftWidth = () => props.minLeftWidth ?? 192;
  const maxLeftWidth = () => props.maxLeftWidth ?? 320;
  const minInspectorWidth = () => props.minInspectorWidth ?? 240;
  const maxInspectorWidth = () => props.maxInspectorWidth ?? 420;
  const [leftWidth, setLeftWidth] = createSignal(
    clamp(props.initialLeftWidth ?? 248, minLeftWidth(), maxLeftWidth()),
  );
  const [inspectorWidth, setInspectorWidth] = createSignal(
    clamp(props.initialInspectorWidth ?? 312, minInspectorWidth(), maxInspectorWidth()),
  );
  const workspaceStyle = createMemo(
    () =>
      ({
        "--workspace-left": `${leftWidth()}px`,
        "--workspace-inspector": `${inspectorWidth()}px`,
      }) as JSX.CSSProperties,
  );

  return (
    <section
      class={cn(
        "ui-block-resizable-workspace-shell min-h-[640px] overflow-hidden rounded-xl border bg-background text-foreground shadow-sm",
        props.class,
      )}
      data-scope="ui-block"
      data-part="resizable-workspace-shell"
      style={workspaceStyle()}
    >
      <header
        class="flex flex-col gap-3 border-b px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
        data-scope="ui-block"
        data-part="workspace-header"
      >
        <div class="min-w-0">
          <p class="text-xs font-medium uppercase text-muted-foreground">Workspace</p>
          <h2 class="mt-1 text-xl font-semibold tracking-normal">
            {props.title ?? "Resizable workspace shell"}
          </h2>
          <p class="mt-1 max-w-2xl text-sm text-muted-foreground">
            {props.description ??
              "A source-owned app layout with keyboard-reachable panels and responsive constraints."}
          </p>
        </div>
        <div class="flex flex-wrap gap-2" data-scope="ui-block" data-part="workspace-actions">
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              setLeftWidth((width) => (width <= minLeftWidth() ? 248 : minLeftWidth()))
            }
          >
            Rail
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              setInspectorWidth((width) =>
                width <= minInspectorWidth() ? 312 : minInspectorWidth(),
              )
            }
          >
            Inspector
          </Button>
        </div>
      </header>

      <div
        class="grid min-h-[560px] grid-cols-1 lg:grid-cols-[var(--workspace-left)_12px_minmax(0,1fr)_12px_var(--workspace-inspector)]"
        data-scope="ui-block"
        data-part="workspace-grid"
      >
        <aside
          class="min-h-0 border-b p-4 lg:border-b-0 lg:border-r"
          data-scope="ui-block"
          data-part="left-rail"
        >
          <div class="mb-3 flex items-center justify-between gap-2">
            <h3 class="text-sm font-semibold">Rail</h3>
            <span class="text-xs text-muted-foreground">{leftWidth()}px</span>
          </div>
          {props.leftRail ?? <DefaultLeftRail />}
        </aside>

        <ResizableWorkspaceHandle
          label="Resize left rail"
          max={maxLeftWidth()}
          min={minLeftWidth()}
          onResize={setLeftWidth}
          side="left"
          value={leftWidth()}
        />

        <main class="min-w-0 p-4" data-scope="ui-block" data-part="work-surface" tabindex="-1">
          <div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 class="text-base font-semibold">Work surface</h3>
              <p class="text-sm text-muted-foreground">
                Resize handles sit outside the tab order until users reach them directly.
              </p>
            </div>
            <Button size="sm">Create item</Button>
          </div>
          {props.workSurface ?? <DefaultWorkSurface />}
        </main>

        <ResizableWorkspaceHandle
          label="Resize inspector panel"
          max={maxInspectorWidth()}
          min={minInspectorWidth()}
          onResize={setInspectorWidth}
          side="inspector"
          value={inspectorWidth()}
        />

        <aside
          class="border-t p-4 lg:border-l lg:border-t-0"
          data-scope="ui-block"
          data-part="inspector-panel"
        >
          <div class="mb-3 flex items-center justify-between gap-2">
            <h3 class="text-sm font-semibold">Inspector</h3>
            <span class="text-xs text-muted-foreground">{inspectorWidth()}px</span>
          </div>
          {props.inspector ?? <DefaultInspector />}
        </aside>
      </div>
    </section>
  );
}
