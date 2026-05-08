import {
  createHotkeyRecorder,
  type Hotkey,
  type HotkeyRecorderOptions,
} from "@tanstack/solid-hotkeys";
import { Show, splitProps, type JSX } from "solid-js";
import { cn } from "@/lib/cn";
import { ShortcutDisplay, type ShortcutDisplayProps } from "./shortcut-display";

export type ShortcutRecorderProps = Omit<
  JSX.ButtonHTMLAttributes<HTMLButtonElement>,
  "onChange" | "onClick" | "value"
> & {
  clearLabel?: JSX.Element;
  formatOptions?: ShortcutDisplayProps["formatOptions"];
  onCancel?: () => void;
  onClear?: () => void;
  onClick?: JSX.EventHandler<HTMLButtonElement, MouseEvent>;
  onValueChange?: (hotkey: Hotkey | undefined) => void;
  placeholder?: JSX.Element;
  recordingLabel?: JSX.Element;
  value?: Hotkey;
  recorderOptions?: Omit<HotkeyRecorderOptions, "onCancel" | "onClear" | "onRecord">;
};

export function ShortcutRecorder(props: ShortcutRecorderProps) {
  const [local, rest] = splitProps(props, [
    "children",
    "class",
    "clearLabel",
    "disabled",
    "formatOptions",
    "onCancel",
    "onClear",
    "onClick",
    "onValueChange",
    "placeholder",
    "recordingLabel",
    "recorderOptions",
    "type",
    "value",
  ]);
  const recorder = createHotkeyRecorder(() => ({
    ...local.recorderOptions,
    onCancel: () => local.onCancel?.(),
    onClear: () => {
      local.onClear?.();
      local.onValueChange?.(undefined);
    },
    onRecord: (hotkey) => local.onValueChange?.(hotkey),
  }));
  const displayedHotkey = () => recorder.recordedHotkey() ?? local.value;

  return (
    <button
      {...rest}
      type={local.type ?? "button"}
      disabled={local.disabled}
      aria-pressed={recorder.isRecording() || undefined}
      data-scope="ui-shortcut-recorder"
      data-part="trigger"
      data-slot="shortcut-recorder"
      data-recording={recorder.isRecording() ? "" : undefined}
      data-empty={!displayedHotkey() ? "" : undefined}
      class={cn(
        "ui-shortcut-recorder inline-flex min-h-9 min-w-0 items-center justify-between gap-3 rounded-md border bg-background px-3 py-2 text-sm outline-none transition-[background-color,border-color,box-shadow]",
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
        data-scope="ui-shortcut-recorder"
        data-part="label"
        data-slot="shortcut-recorder-label"
        class="min-w-0 truncate"
      >
        <Show when={recorder.isRecording()} fallback={local.children ?? "Shortcut"}>
          {local.recordingLabel ?? "Press shortcut"}
        </Show>
      </span>
      <Show
        when={displayedHotkey()}
        fallback={
          <span
            data-scope="ui-shortcut-recorder"
            data-part="placeholder"
            data-slot="shortcut-recorder-placeholder"
            class="text-muted-foreground"
          >
            {local.placeholder ?? "None"}
          </span>
        }
      >
        {(hotkey) => (
          <span
            data-scope="ui-shortcut-recorder"
            data-part="value"
            data-slot="shortcut-recorder-value"
          >
            <ShortcutDisplay hotkey={hotkey()} formatOptions={local.formatOptions} />
          </span>
        )}
      </Show>
    </button>
  );
}
