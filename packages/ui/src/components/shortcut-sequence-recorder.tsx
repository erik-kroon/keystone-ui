import {
  createHotkeySequenceRecorder,
  type HotkeySequence,
  type HotkeySequenceRecorderOptions,
} from "@tanstack/solid-hotkeys";
import { Show, splitProps, type JSX } from "solid-js";
import { cn } from "@/lib/cn";
import { ShortcutDisplay, type ShortcutDisplayProps } from "./shortcut-display";

export type ShortcutSequenceRecorderProps = Omit<
  JSX.ButtonHTMLAttributes<HTMLButtonElement>,
  "onChange" | "onClick" | "value"
> & {
  formatOptions?: ShortcutDisplayProps["formatOptions"];
  onCancel?: () => void;
  onClear?: () => void;
  onClick?: JSX.EventHandler<HTMLButtonElement, MouseEvent>;
  onValueChange?: (sequence: HotkeySequence) => void;
  placeholder?: JSX.Element;
  recordingLabel?: JSX.Element;
  recorderOptions?: Omit<HotkeySequenceRecorderOptions, "onCancel" | "onClear" | "onRecord">;
  sequenceSeparator?: JSX.Element;
  value?: HotkeySequence;
};

export function ShortcutSequenceRecorder(props: ShortcutSequenceRecorderProps) {
  const [local, rest] = splitProps(props, [
    "children",
    "class",
    "disabled",
    "formatOptions",
    "onCancel",
    "onClear",
    "onClick",
    "onValueChange",
    "placeholder",
    "recordingLabel",
    "recorderOptions",
    "sequenceSeparator",
    "type",
    "value",
  ]);
  const recorder = createHotkeySequenceRecorder(() => ({
    ...local.recorderOptions,
    onCancel: () => local.onCancel?.(),
    onClear: () => {
      local.onClear?.();
      local.onValueChange?.([]);
    },
    onRecord: (sequence) => local.onValueChange?.(sequence),
  }));
  const displayedSequence = () => {
    const recordingSteps = recorder.steps();
    if (recordingSteps.length > 0) return recordingSteps;
    const recorded = recorder.recordedSequence();
    if (recorded && recorded.length > 0) return recorded;
    return local.value ?? [];
  };

  return (
    <button
      {...rest}
      type={local.type ?? "button"}
      disabled={local.disabled}
      aria-pressed={recorder.isRecording() || undefined}
      data-scope="ui-shortcut-sequence-recorder"
      data-part="trigger"
      data-slot="shortcut-sequence-recorder"
      data-recording={recorder.isRecording() ? "" : undefined}
      data-empty={displayedSequence().length === 0 ? "" : undefined}
      class={cn(
        "ui-shortcut-sequence-recorder inline-flex min-h-9 min-w-0 items-center justify-between gap-3 rounded-md border bg-background px-3 py-2 text-sm outline-none transition-[background-color,border-color,box-shadow]",
        "hover:bg-accent hover:text-accent-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/24 disabled:pointer-events-none disabled:opacity-64",
        local.class,
      )}
      onClick={(event) => {
        local.onClick?.(event);
        if (event.defaultPrevented || local.disabled) return;
        recorder.startRecording();
      }}
    >
      <span
        data-scope="ui-shortcut-sequence-recorder"
        data-part="label"
        data-slot="shortcut-sequence-recorder-label"
        class="min-w-0 truncate"
      >
        <Show when={recorder.isRecording()} fallback={local.children ?? "Shortcut sequence"}>
          {local.recordingLabel ?? "Press sequence"}
        </Show>
      </span>
      <Show
        when={displayedSequence().length > 0}
        fallback={
          <span
            data-scope="ui-shortcut-sequence-recorder"
            data-part="placeholder"
            data-slot="shortcut-sequence-recorder-placeholder"
            class="text-muted-foreground"
          >
            {local.placeholder ?? "None"}
          </span>
        }
      >
        <span
          data-scope="ui-shortcut-sequence-recorder"
          data-part="value"
          data-slot="shortcut-sequence-recorder-value"
        >
          <ShortcutDisplay
            sequence={displayedSequence()}
            sequenceSeparator={local.sequenceSeparator}
            formatOptions={local.formatOptions}
          />
        </span>
      </Show>
    </button>
  );
}
