import { Show, createSignal, splitProps, type JSX } from "solid-js";
import { cn } from "@/lib/cn";

export type SearchInputSize = "sm" | "default" | "lg";
export type SearchInputValue = string | number | readonly string[];

export type SearchInputProps = Omit<JSX.InputHTMLAttributes<HTMLInputElement>, "size" | "type"> & {
  clearLabel?: string;
  clearable?: boolean;
  defaultValue?: SearchInputValue;
  invalid?: boolean;
  inputClass?: string;
  loading?: boolean;
  loadingLabel?: string;
  onClear?: (event: MouseEvent) => void;
  rootClass?: string;
  searchLabel?: string;
  size?: SearchInputSize;
};

const classes = (...tokens: string[]) => tokens.join(" ");

function SearchIcon() {
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
      <path d="m21 21-4.34-4.34" />
      <circle cx="11" cy="11" r="8" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="24" viewBox="0 0 24 24" width="24">
      <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-opacity="0.24" stroke-width="3" />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-width="3"
      />
    </svg>
  );
}

function ClearIcon() {
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

function readValue(value: SearchInputProps["value"] | SearchInputProps["defaultValue"]) {
  if (Array.isArray(value)) return value.join(",");
  return value == null ? "" : String(value);
}

function assignRef<T>(ref: unknown, value: T) {
  if (typeof ref === "function") {
    ref(value);
  }
}

export function SearchInput(props: SearchInputProps) {
  const [local, rest] = splitProps(props, [
    "aria-invalid",
    "aria-label",
    "class",
    "clearLabel",
    "clearable",
    "defaultValue",
    "disabled",
    "inputClass",
    "invalid",
    "loading",
    "loadingLabel",
    "onClear",
    "onInput",
    "ref",
    "rootClass",
    "searchLabel",
    "size",
    "value",
  ]);
  const [uncontrolledValue, setUncontrolledValue] = createSignal(readValue(local.defaultValue));
  let inputRef: HTMLInputElement | undefined;
  const size = () => local.size ?? "default";
  const value = () => readValue(local.value ?? uncontrolledValue());
  const invalid = () => Boolean(local.invalid || local["aria-invalid"]);
  const showClear = () =>
    local.clearable !== false && !local.disabled && !local.loading && value().length > 0;

  const setInputRef = (element: HTMLInputElement) => {
    inputRef = element;
    assignRef(local.ref, element);
  };

  return (
    <span
      data-scope="ui-search-input"
      data-part="root"
      data-disabled={local.disabled ? "" : undefined}
      data-invalid={invalid() ? "" : undefined}
      data-loading={local.loading ? "" : undefined}
      data-size={size()}
      data-slot="search-input"
      class={cn(
        classes(
          "ui-search-input",
          "relative",
          "inline-flex",
          "w-full",
          "items-center",
          "rounded-lg",
          "border",
          "border-input",
          "bg-background",
          "not-dark:bg-clip-padding",
          "text-base",
          "text-foreground",
          "shadow-xs/5",
          "ring-ring/24",
          "transition-shadow",
          "before:pointer-events-none",
          "before:absolute",
          "before:inset-0",
          "before:rounded-[calc(var(--radius-lg)-1px)]",
          "not-has-disabled:not-has-focus-visible:not-has-aria-invalid:before:shadow-[0_1px_--theme(--color-black/4%)]",
          "has-focus-visible:has-aria-invalid:border-destructive/64",
          "has-focus-visible:has-aria-invalid:ring-destructive/16",
          "has-aria-invalid:border-destructive/36",
          "has-focus-visible:border-ring",
          "has-autofill:bg-foreground/4",
          "has-disabled:opacity-64",
          "has-[:disabled,:focus-visible,[aria-invalid]]:shadow-none",
          "has-focus-visible:ring-[3px]",
          "sm:text-sm",
          "dark:bg-input/32",
          "dark:has-autofill:bg-foreground/8",
          "dark:has-aria-invalid:ring-destructive/24",
          "dark:not-has-disabled:not-has-focus-visible:not-has-aria-invalid:before:shadow-[0_-1px_--theme(--color-white/6%)]",
        ),
        local.rootClass,
        local.class,
      )}
    >
      <span
        aria-hidden="true"
        data-scope="ui-search-input"
        data-part="icon"
        data-slot="search-input-icon"
        class="pointer-events-none absolute left-2.5 z-10 flex size-4.5 items-center justify-center text-muted-foreground/72 sm:size-4"
      >
        <SearchIcon />
      </span>
      <input
        {...rest}
        ref={setInputRef}
        aria-invalid={invalid() || undefined}
        aria-label={local.searchLabel ?? local["aria-label"]}
        data-scope="ui-search-input"
        data-part="input"
        data-slot="search-input-control"
        disabled={local.disabled}
        type="search"
        value={local.value ?? uncontrolledValue()}
        onInput={(event) => {
          if (typeof local.onInput === "function") {
            local.onInput(event);
          }
          if (event.defaultPrevented) return;
          setUncontrolledValue(event.currentTarget.value);
        }}
        class={cn(
          classes(
            "ui-search-input-control",
            "h-8.5",
            "w-full",
            "min-w-0",
            "rounded-[inherit]",
            "bg-transparent",
            "ps-8",
            "pe-8",
            "leading-8.5",
            "outline-none",
            "[transition:background-color_5000000s_ease-in-out_0s]",
            "placeholder:text-muted-foreground/72",
            "sm:h-7.5",
            "sm:leading-7.5",
            "[&::-webkit-search-cancel-button]:appearance-none",
            "[&::-webkit-search-decoration]:appearance-none",
            "[&::-webkit-search-results-button]:appearance-none",
            "[&::-webkit-search-results-decoration]:appearance-none",
          ),
          size() === "sm" && classes("h-7.5", "leading-7.5", "sm:h-6.5", "sm:leading-6.5"),
          size() === "lg" && classes("h-9.5", "leading-9.5", "sm:h-8.5", "sm:leading-8.5"),
          local.inputClass,
        )}
      />
      <Show when={local.loading}>
        <span
          aria-label={local.loadingLabel ?? "Searching"}
          data-scope="ui-search-input"
          data-part="loading-indicator"
          data-slot="search-input-loading-indicator"
          role="status"
          class="absolute right-2.5 z-10 flex size-4.5 animate-spin items-center justify-center text-muted-foreground/72 sm:size-4"
        >
          <SpinnerIcon />
        </span>
      </Show>
      <Show when={showClear()}>
        <button
          aria-label={local.clearLabel ?? "Clear search"}
          data-scope="ui-search-input"
          data-part="clear"
          data-slot="search-input-clear"
          type="button"
          class={cn(
            classes(
              "ui-search-input-clear",
              "absolute",
              "right-1.5",
              "z-10",
              "inline-flex",
              "size-6",
              "cursor-pointer",
              "items-center",
              "justify-center",
              "rounded-md",
              "text-muted-foreground",
              "outline-none",
              "transition-colors",
              "hover:bg-accent",
              "hover:text-accent-foreground",
              "focus-visible:ring-2",
              "focus-visible:ring-ring",
              "focus-visible:ring-offset-1",
              "focus-visible:ring-offset-background",
              "[&_svg]:size-3.5",
            ),
          )}
          onClick={(event) => {
            local.onClear?.(event);
            if (event.defaultPrevented) return;
            setUncontrolledValue("");
            if (inputRef) {
              inputRef.value = "";
              inputRef.dispatchEvent(new InputEvent("input", { bubbles: true }));
              inputRef.focus();
            }
          }}
        >
          <ClearIcon />
        </button>
      </Show>
    </span>
  );
}
