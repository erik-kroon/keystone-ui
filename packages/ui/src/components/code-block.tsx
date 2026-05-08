import { Show, splitProps, type JSX, type ParentProps } from "solid-js";
import { CopyButton } from "@/components/ui/copy-button";
import { cn } from "@/lib/cn";

export type CodeBlockProps = ParentProps<
  Omit<JSX.HTMLAttributes<HTMLElement>, "children"> & {
    actions?: JSX.Element;
    code: string;
    codeClass?: string;
    copy?: boolean;
    copyClass?: string;
    copyLabel?: string;
    description?: JSX.Element;
    language?: string;
    preClass?: string;
    title?: JSX.Element;
    wrap?: boolean;
  }
>;

export type CodeBlockHeaderProps = ParentProps<JSX.HTMLAttributes<HTMLElement>>;
export type CodeBlockTitleProps = ParentProps<JSX.HTMLAttributes<HTMLSpanElement>>;
export type CodeBlockDescriptionProps = ParentProps<JSX.HTMLAttributes<HTMLSpanElement>>;
export type CodeBlockActionsProps = ParentProps<JSX.HTMLAttributes<HTMLDivElement>>;
export type CodeBlockPreProps = ParentProps<JSX.HTMLAttributes<HTMLPreElement>>;
export type CodeBlockCodeProps = ParentProps<JSX.HTMLAttributes<HTMLElement>>;

const classes = (...tokens: string[]) => tokens.join(" ");
const codeBlockCopyButtonClass = classes(
  "border-0",
  "bg-transparent",
  "shadow-none",
  "hover:bg-accent",
  "focus-visible:bg-accent",
);

export function CodeBlock(props: CodeBlockProps) {
  const [local, rest] = splitProps(props, [
    "actions",
    "class",
    "code",
    "codeClass",
    "copy",
    "copyClass",
    "copyLabel",
    "description",
    "language",
    "preClass",
    "title",
    "wrap",
  ]);
  const hasHeader = () =>
    Boolean(
      local.title || local.description || local.language || local.actions || local.copy !== false,
    );

  return (
    <figure
      {...rest}
      data-scope="ui-code-block"
      data-part="root"
      data-language={local.language}
      data-slot="code-block"
      data-wrap={local.wrap ? "" : undefined}
      class={cn(
        classes(
          "ui-code-block",
          "relative",
          "overflow-hidden",
          "rounded-lg",
          "border",
          "border-input",
          "bg-muted/48",
          "text-foreground",
          "shadow-xs/5",
        ),
        local.class,
      )}
    >
      <Show when={hasHeader()}>
        <CodeBlockHeader>
          <span class="min-w-0">
            <Show when={local.title ?? local.language}>
              <CodeBlockTitle>{local.title ?? local.language}</CodeBlockTitle>
            </Show>
            <Show when={local.description}>
              <CodeBlockDescription>{local.description}</CodeBlockDescription>
            </Show>
          </span>
          <CodeBlockActions>
            {local.actions}
            <Show when={local.copy !== false}>
              <CopyButton
                class={cn(codeBlockCopyButtonClass, local.copyClass)}
                label={local.copyLabel ?? "Copy code"}
                value={local.code}
              />
            </Show>
          </CodeBlockActions>
        </CodeBlockHeader>
      </Show>
      <CodeBlockPre class={local.preClass} data-wrap={local.wrap ? "" : undefined}>
        <CodeBlockCode class={local.codeClass} data-language={local.language}>
          {local.code}
        </CodeBlockCode>
      </CodeBlockPre>
    </figure>
  );
}

export function CodeBlockHeader(props: CodeBlockHeaderProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <figcaption
      {...rest}
      data-scope="ui-code-block"
      data-part="header"
      data-slot="code-block-header"
      class={cn(
        "ui-code-block-header flex min-w-0 items-center justify-between gap-3 border-input border-b bg-background/72 px-3 py-2",
        local.class,
      )}
    />
  );
}

export function CodeBlockTitle(props: CodeBlockTitleProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <span
      {...rest}
      data-scope="ui-code-block"
      data-part="title"
      data-slot="code-block-title"
      class={cn(
        "ui-code-block-title block truncate font-medium text-foreground text-sm",
        local.class,
      )}
    />
  );
}

export function CodeBlockDescription(props: CodeBlockDescriptionProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <span
      {...rest}
      data-scope="ui-code-block"
      data-part="description"
      data-slot="code-block-description"
      class={cn(
        "ui-code-block-description block truncate text-muted-foreground text-xs",
        local.class,
      )}
    />
  );
}

export function CodeBlockActions(props: CodeBlockActionsProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <div
      {...rest}
      data-scope="ui-code-block"
      data-part="actions"
      data-slot="code-block-actions"
      class={cn("ui-code-block-actions flex shrink-0 items-center gap-1.5", local.class)}
    />
  );
}

export function CodeBlockPre(props: CodeBlockPreProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <pre
      {...rest}
      data-scope="ui-code-block"
      data-part="pre"
      data-slot="code-block-pre"
      class={cn(
        classes(
          "ui-code-block-pre",
          "overflow-x-auto",
          "p-4",
          "font-mono",
          "text-sm",
          "leading-6",
          "data-wrap:whitespace-pre-wrap",
          "not-data-wrap:whitespace-pre",
        ),
        local.class,
      )}
    />
  );
}

export function CodeBlockCode(props: CodeBlockCodeProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <code
      {...rest}
      data-scope="ui-code-block"
      data-part="code"
      data-slot="code-block-code"
      class={cn("ui-code-block-code font-mono", local.class)}
    />
  );
}
