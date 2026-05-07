import { For, Show, type Accessor, type JSX } from "solid-js";

import { cn } from "@/components/docs-shell";
import { useMediaQuery } from "@keystone-ui/ui/default/hooks/use-media-query.ts";

export function InlineCode(props: Readonly<{ children: JSX.Element }>) {
  return (
    <code class="break-all rounded-md bg-muted px-[0.3rem] py-[0.2rem] font-mono text-[0.8125rem] text-muted-foreground">
      {props.children}
    </code>
  );
}

type MediaQueryDemoRow = {
  description?: string;
  label: string;
  value: Accessor<boolean>;
};

function MediaQueryDemoSection(
  props: Readonly<{ rows: readonly MediaQueryDemoRow[]; title: string }>,
) {
  return (
    <div>
      <h3 class="mb-2 font-medium text-foreground text-sm">{props.title}</h3>
      <ul class="divide-y divide-border rounded-xl border border-border">
        <For each={props.rows}>
          {(row) => (
            <li class="flex items-center justify-between gap-2 px-3 py-2.5">
              <div class="min-w-0">
                <InlineCode>{row.label}</InlineCode>
              </div>
              <div class="flex items-center gap-2">
                <Show when={row.description}>
                  {(description) => (
                    <span class="ms-2 text-muted-foreground text-xs">{description()}</span>
                  )}
                </Show>
                <span
                  class={cn(
                    "inline-flex h-6 min-w-11 shrink-0 items-center justify-center rounded-full px-2 font-medium text-xs",
                    row.value()
                      ? "bg-success/12 text-success-foreground dark:bg-success/20"
                      : "bg-secondary text-muted-foreground",
                  )}
                >
                  {row.value() ? "true" : "false"}
                </span>
              </div>
            </li>
          )}
        </For>
      </ul>
    </div>
  );
}

export function MediaQueryDemo() {
  const sm = useMediaQuery("sm");
  const md = useMediaQuery("md");
  const lg = useMediaQuery("lg");
  const xl = useMediaQuery("xl");
  const xxl = useMediaQuery("2xl");

  const maxSm = useMediaQuery("max-sm");
  const maxMd = useMediaQuery("max-md");
  const maxLg = useMediaQuery("max-lg");

  const smToMd = useMediaQuery("sm:max-md");
  const mdToLg = useMediaQuery("md:max-lg");
  const lgToXl = useMediaQuery("lg:max-xl");

  const pointerCoarse = useMediaQuery({ pointer: "coarse" });
  const pointerFine = useMediaQuery({ pointer: "fine" });
  const darkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  return (
    <div class="my-8 flex flex-col gap-6">
      <MediaQueryDemoSection
        rows={[
          { description: ">= 640px", label: `useMediaQuery("sm")`, value: sm },
          { description: ">= 800px", label: `useMediaQuery("md")`, value: md },
          { description: ">= 1024px", label: `useMediaQuery("lg")`, value: lg },
          { description: ">= 1280px", label: `useMediaQuery("xl")`, value: xl },
          { description: ">= 1536px", label: `useMediaQuery("2xl")`, value: xxl },
        ]}
        title="Min-width (breakpoint and above)"
      />
      <MediaQueryDemoSection
        rows={[
          { description: "< 640px", label: `useMediaQuery("max-sm")`, value: maxSm },
          { description: "< 800px", label: `useMediaQuery("max-md")`, value: maxMd },
          { description: "< 1024px", label: `useMediaQuery("max-lg")`, value: maxLg },
        ]}
        title="Max-width (below breakpoint)"
      />
      <MediaQueryDemoSection
        rows={[
          { description: "640 - 799px", label: `useMediaQuery("sm:max-md")`, value: smToMd },
          { description: "800 - 1023px", label: `useMediaQuery("md:max-lg")`, value: mdToLg },
          { description: "1024 - 1279px", label: `useMediaQuery("lg:max-xl")`, value: lgToXl },
        ]}
        title="Ranges"
      />
      <MediaQueryDemoSection
        rows={[
          {
            description: "touch",
            label: `useMediaQuery({ pointer: "coarse" })`,
            value: pointerCoarse,
          },
          {
            description: "mouse",
            label: `useMediaQuery({ pointer: "fine" })`,
            value: pointerFine,
          },
          {
            label: `useMediaQuery("(prefers-color-scheme: dark)")`,
            value: darkMode,
          },
          {
            label: `useMediaQuery("(prefers-reduced-motion: reduce)")`,
            value: reducedMotion,
          },
        ]}
        title="Device and preferences"
      />
    </div>
  );
}
