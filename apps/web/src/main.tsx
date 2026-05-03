import { RouterProvider } from "@tanstack/solid-router";
import { render } from "solid-js/web";

import { getRouter } from "./router";

function App() {
  const router = getRouter();

  return <RouterProvider router={router} />;
}

const rootElement = document.getElementById("app");
if (rootElement) {
  render(() => <App />, rootElement);
}
