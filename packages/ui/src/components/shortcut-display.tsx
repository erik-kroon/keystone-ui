import {
  formatForDisplay,
  type FormatDisplayOptions,
  type RegisterableHotkey,
} from "@tanstack/solid-hotkeys";
import { For, Show, splitProps, type JSX } from "solid-js";
import { cn } from "@/lib/cn";

export type ShortcutDisplayProps = JSX.HTMLAttributes<HTMLElement> & {
  hotkey?: RegisterableHotkey;
  label?: string;
  sequence?: readonly RegisterableHotkey[];
  formatOptions?: FormatDisplayOptions;
  keyClass?: string;
  separatorClass?: string;
  sequenceSeparator?: JSX.Element;
  sequenceSeparatorClass?: string;
};

const defaultSequenceSeparator = "then";

export function ShortcutDisplay(props: ShortcutDisplayProps) {
  const [local, rest] = splitProps(props, [
    "class",
    "formatOptions",
    "hotkey",
    "keyClass",
    "label",
    "sequence",
    "separatorClass",
    "sequenceSeparator",
    "sequenceSeparatorClass",
  ]);
  const steps = () => {
    if (local.label) return [splitShortcutLabel(local.label)];
    if (local.sequence) {
      return local.sequence.map((hotkey) =>
        splitShortcutLabel(formatForDisplay(hotkey, displayOptions(local.formatOptions))),
      );
    }
    if (local.hotkey) {
      return [
        splitShortcutLabel(formatForDisplay(local.hotkey, displayOptions(local.formatOptions))),
      ];
    }
    return [];
  };

  return (
    <kbd
      {...rest}
      data-scope="ui-shortcut-display"
      data-part="root"
      data-slot="shortcut-display"
      data-empty={steps().length === 0 ? "" : undefined}
      class={cn(
        "ui-shortcut-display inline-flex min-w-0 items-center gap-1 font-medium font-sans text-muted-foreground text-xs",
        local.class,
      )}
    >
      <For each={steps()}>
        {(step, index) => (
          <>
            <Show when={index() > 0}>
              <span
                aria-hidden="true"
                data-scope="ui-shortcut-display"
                data-part="sequence-separator"
                data-slot="shortcut-display-sequence-separator"
                class={cn("px-0.5 text-muted-foreground/72", local.sequenceSeparatorClass)}
              >
                {local.sequenceSeparator ?? defaultSequenceSeparator}
              </span>
            </Show>
            <span
              data-scope="ui-shortcut-display"
              data-part="step"
              data-slot="shortcut-display-step"
              class="inline-flex min-w-0 items-center gap-1"
            >
              <For each={step}>
                {(token, tokenIndex) => (
                  <>
                    <Show when={tokenIndex() > 0}>
                      <span
                        aria-hidden="true"
                        data-scope="ui-shortcut-display"
                        data-part="separator"
                        data-slot="shortcut-display-separator"
                        class={cn("text-muted-foreground/56", local.separatorClass)}
                      >
                        +
                      </span>
                    </Show>
                    <span
                      data-scope="ui-shortcut-display"
                      data-part="key"
                      data-slot="shortcut-display-key"
                      data-key={token}
                      class={cn(
                        "inline-flex h-5 min-w-5 items-center justify-center rounded border bg-background px-1.5 text-[0.6875rem] leading-none shadow-xs/5",
                        local.keyClass,
                      )}
                    >
                      {token}
                    </span>
                  </>
                )}
              </For>
            </span>
          </>
        )}
      </For>
    </kbd>
  );
}

function displayOptions(options: FormatDisplayOptions | undefined): FormatDisplayOptions {
  return {
    separatorToken: " ",
    ...options,
  };
}

function splitShortcutLabel(label: string) {
  return label
    .replaceAll("+", " ")
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean);
}
