import { Show, splitProps, type JSX, type ParentProps } from "solid-js";
import { createCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { cn } from "@/lib/cn";

export type CopyButtonProps = ParentProps<
  Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, "children" | "value"> & {
    copiedDuration?: number;
    copiedLabel?: string;
    errorLabel?: string;
    label?: string;
    onCopy?: (value: string) => void;
    onCopyError?: (error: unknown, value: string) => void;
    showLabel?: boolean;
    value: string;
  }
>;

const classes = (...tokens: string[]) => tokens.join(" ");

function ClipboardIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="24"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      viewBox="0 0 24 24"
      width="24"
    >
      <rect height="14" rx="2" ry="2" width="14" x="8" y="8" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="24"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      viewBox="0 0 24 24"
      width="24"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="24"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      viewBox="0 0 24 24"
      width="24"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

export function CopyButton(props: CopyButtonProps) {
  const [local, rest] = splitProps(props, [
    "aria-label",
    "class",
    "copiedDuration",
    "copiedLabel",
    "disabled",
    "errorLabel",
    "label",
    "onClick",
    "onCopy",
    "onCopyError",
    "showLabel",
    "value",
  ]);
  const clipboard = createCopyToClipboard({
    copiedDuration: local.copiedDuration,
    onCopy: local.onCopy,
    onError: local.onCopyError,
  });
  const label = () => local.label ?? "Copy";
  const copiedLabel = () => local.copiedLabel ?? "Copied";
  const errorLabel = () => local.errorLabel ?? "Copy failed";
  const currentLabel = () =>
    clipboard.status() === "copied"
      ? copiedLabel()
      : clipboard.status() === "error"
        ? errorLabel()
        : label();

  return (
    <button
      {...rest}
      aria-label={local["aria-label"] ?? currentLabel()}
      data-scope="ui-copy-button"
      data-part="root"
      data-copied={clipboard.copied() ? "" : undefined}
      data-error={clipboard.status() === "error" ? "" : undefined}
      data-unsupported={!clipboard.isSupported() ? "" : undefined}
      data-slot="copy-button"
      disabled={local.disabled}
      title={currentLabel()}
      type={rest.type ?? "button"}
      onClick={async (event) => {
        if (typeof local.onClick === "function") {
          local.onClick(event);
        }
        if (event.defaultPrevented) return;
        await clipboard.copy(local.value);
      }}
      class={cn(
        classes(
          "ui-copy-button",
          "inline-flex",
          "h-8",
          "shrink-0",
          "items-center",
          "justify-center",
          "gap-1.5",
          "rounded-lg",
          "border",
          "border-input",
          "bg-background",
          "px-2.5",
          "text-muted-foreground",
          "text-sm",
          "shadow-xs/5",
          "outline-none",
          "transition-[background-color,color,box-shadow]",
          "hover:bg-accent",
          "hover:text-accent-foreground",
          "focus-visible:ring-2",
          "focus-visible:ring-ring",
          "focus-visible:ring-offset-1",
          "focus-visible:ring-offset-background",
          "disabled:pointer-events-none",
          "disabled:opacity-64",
          "data-copied:text-foreground",
          "data-error:text-destructive",
          "[&_svg]:size-4",
          "[&_svg]:shrink-0",
        ),
        !local.showLabel && "size-8 px-0",
        local.class,
      )}
    >
      <Show
        when={clipboard.status() === "copied"}
        fallback={
          <Show when={clipboard.status() === "error"} fallback={<ClipboardIcon />}>
            <ErrorIcon />
          </Show>
        }
      >
        <CheckIcon />
      </Show>
      <span class={local.showLabel ? undefined : "sr-only"}>{currentLabel()}</span>
    </button>
  );
}
