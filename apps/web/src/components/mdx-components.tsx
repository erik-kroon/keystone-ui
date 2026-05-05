import { For, splitProps, type JSX, type ParentProps } from "solid-js";

import { CodeBlock } from "@/components/docs-shell";

function classes(...tokens: Array<string | false | null | undefined>) {
  return tokens.filter(Boolean).join(" ");
}

function headingId(children: JSX.Element) {
  return String(children ?? "")
    .trim()
    .replace(/['?]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

export function MdxContent(props: ParentProps<JSX.HTMLAttributes<HTMLDivElement>>) {
  const [local, rest] = splitProps(props, ["class"]);

  return <div {...rest} class={classes("min-w-0 scroll-mt-20", local.class)} />;
}

export function MdxH2(props: ParentProps<JSX.HTMLAttributes<HTMLHeadingElement>>) {
  const [local, rest] = splitProps(props, ["children", "class", "id"]);
  const id = () => local.id ?? headingId(local.children);

  return (
    <h2
      {...rest}
      class={classes(
        "m-0 mb-3 scroll-mt-24 font-semibold text-2xl text-foreground leading-tight",
        local.class,
      )}
      id={id()}
    >
      <a class="no-underline hover:underline hover:underline-offset-4" href={`#${id()}`}>
        {local.children}
      </a>
    </h2>
  );
}

export function MdxH3(props: ParentProps<JSX.HTMLAttributes<HTMLHeadingElement>>) {
  const [local, rest] = splitProps(props, ["children", "class", "id"]);
  const id = () => local.id ?? headingId(local.children);

  return (
    <h3
      {...rest}
      class={classes("mt-8 mb-3 scroll-mt-24 font-semibold text-foreground text-lg", local.class)}
      id={id()}
    >
      <a class="no-underline hover:underline hover:underline-offset-4" href={`#${id()}`}>
        {local.children}
      </a>
    </h3>
  );
}

export function MdxP(props: ParentProps<JSX.HTMLAttributes<HTMLParagraphElement>>) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <p {...rest} class={classes("m-0 text-base text-muted-foreground leading-8", local.class)} />
  );
}

export function MdxList(props: ParentProps<JSX.HTMLAttributes<HTMLUListElement>>) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <ul
      {...rest}
      class={classes("mt-4 list-disc pl-5 text-muted-foreground leading-7", local.class)}
    />
  );
}

export function MdxTable(props: {
  columns: readonly string[];
  rows: readonly (readonly JSX.Element[])[];
}) {
  return (
    <div class="mt-5 overflow-x-auto rounded-lg border border-border">
      <table class="w-full border-collapse bg-card text-sm">
        <thead>
          <tr>
            <For each={props.columns}>
              {(column) => (
                <th class="border-border border-b px-4 py-3 text-left font-semibold text-foreground">
                  {column}
                </th>
              )}
            </For>
          </tr>
        </thead>
        <tbody>
          <For each={props.rows}>
            {(row) => (
              <tr class="last:[&_td]:border-b-0">
                <For each={row}>
                  {(cell) => (
                    <td class="border-border border-b px-4 py-3 text-left align-top text-muted-foreground">
                      {cell}
                    </td>
                  )}
                </For>
              </tr>
            )}
          </For>
        </tbody>
      </table>
    </div>
  );
}

export const mdxComponents = {
  CodeBlock,
  MdxContent,
  MdxH2,
  MdxH3,
  MdxList,
  MdxP,
  MdxTable,
};
