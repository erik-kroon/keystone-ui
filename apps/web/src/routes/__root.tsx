/// <reference types="vite/client" />

import { HeadContent, Outlet, Scripts, createRootRouteWithContext } from "@tanstack/solid-router";
import type { JSX } from "solid-js";
import { Suspense } from "solid-js";
import { HydrationScript } from "solid-js/web";

import Header from "@/components/header";
import stylesUrl from "@/styles.css?url";

export interface RouterContext {}

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    links: [{ rel: "stylesheet", href: stylesUrl }],
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Keystone UI" },
      { rel: "icon", href: "/favicon.svg" },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <div class="min-h-svh">
        <Header />
        <Outlet />
      </div>
    </RootDocument>
  );
}

function RootDocument(props: Readonly<{ children: JSX.Element }>) {
  return (
    <html lang="en" class="dark">
      <head>
        <HydrationScript />
        <HeadContent />
      </head>
      <body>
        <Suspense>{props.children}</Suspense>
        <Scripts />
      </body>
    </html>
  );
}
