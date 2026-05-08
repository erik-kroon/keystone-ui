/// <reference types="vite/client" />

import { HeadContent, Outlet, Scripts, createRootRouteWithContext } from "@tanstack/solid-router";
import { Suspense, type JSX } from "solid-js";
import { HydrationScript } from "solid-js/web";

import Header from "@/components/header";
import { NotFound } from "@/components/not-found";
import { seo } from "@/lib/utils";
import stylesUrl from "@/styles.css?url";

export interface RouterContext {}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
  notFoundComponent: NotFound,
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      ...seo({
        title: "Keystone",
        description: "Keystone UI",
      }),
    ],
    links: [
      { rel: "stylesheet", href: stylesUrl },
      {
        rel: "icon",
        type: "image/svg+xml",
        href: "/favicon.svg",
      },
      {
        rel: "manifest",
        href: "/site.webmanifest",
      },
    ],
  }),
});

function RootComponent() {
  return (
    <RootDocument>
      <div class="relative isolate flex min-h-svh flex-col overflow-clip bg-sidebar text-foreground [--header-height:4rem]">
        <div
          aria-hidden="true"
          class="pointer-events-none absolute inset-0 z-45 mx-auto hidden w-full max-w-[1416px] px-4 before:absolute before:inset-y-0 before:-left-3 before:w-px before:bg-border/64 after:absolute after:inset-y-0 after:-right-3 after:w-px after:bg-border/64 lg:block lg:px-6"
        />
        <Header />
        <Suspense>
          <Outlet />
        </Suspense>
      </div>
    </RootDocument>
  );
}

function RootDocument(props: Readonly<{ children: JSX.Element }>) {
  return (
    <html lang="en" class="dark">
      <head>
        <HydrationScript />
      </head>
      <body>
        <HeadContent />
        {props.children}
        <Scripts />
      </body>
    </html>
  );
}
