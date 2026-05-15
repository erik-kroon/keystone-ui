/// <reference types="vite/client" />

import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
  useRouterState,
} from "@tanstack/solid-router";
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
  const pathname = useRouterState({
    select: (state) => (state.resolvedLocation ?? state.location).pathname,
  });
  const isLanding = () => pathname() === "/";

  return (
    <RootDocument>
      <div class="relative isolate flex min-h-svh flex-col overflow-clip bg-sidebar text-foreground [--header-height:4rem]">
        <div
          aria-hidden="true"
          class={`pointer-events-none absolute inset-0 z-45 mx-auto w-full max-w-[1416px] px-4 before:absolute before:inset-y-0 before:-left-3 before:w-px before:bg-border/64 after:absolute after:inset-y-0 after:-right-3 after:w-px after:bg-border/64 lg:px-6 ${
            isLanding() ? "hidden" : "hidden lg:block"
          }`}
        />
        {!isLanding() && <Header />}
        <Suspense>
          <Outlet />
        </Suspense>
      </div>
    </RootDocument>
  );
}

function RootDocument(props: Readonly<{ children: JSX.Element }>) {
  return (
    <html lang="en">
      <head>
        <script
          innerHTML={`try{var t=localStorage.getItem("theme")||"dark";var r=t==="light"?"light":"dark";document.documentElement.classList.remove("light","dark");document.documentElement.classList.add(r);document.documentElement.style.colorScheme=r}catch{document.documentElement.classList.add("dark")}`}
        />
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
