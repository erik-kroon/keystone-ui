/// <reference types="vite/client" />

import { HeadContent, Outlet, Scripts, createRootRouteWithContext } from "@tanstack/solid-router";
import type { JSX } from "solid-js";
import { Suspense } from "solid-js";
import { HydrationScript } from "solid-js/web";

import Header from "@/components/header";
import "@/styles.css";

export interface RouterContext {}

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
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
      <div class="grid h-svh grid-rows-[auto_1fr]">
        <Header />
        <Outlet />
      </div>
    </RootDocument>
  );
}

function RootDocument(props: Readonly<{ children: JSX.Element }>) {
  return (
    <html lang="en">
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
